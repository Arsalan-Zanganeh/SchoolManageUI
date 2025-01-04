from channels.generic.websocket import AsyncWebsocketConsumer
import json
from datetime import datetime
import redis
import logging

logger = logging.getLogger(__name__)
redis_client = redis.Redis(host='127.0.0.1', port=6379, db=0)

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.chat_id = self.scope['url_route']['kwargs']['chat_id']
            self.room_group_name = f'chat_{self.chat_id}'
            self.history_key = f'chat_history:{self.chat_id}'  # Changed key format
            print(f"Connecting to chat {self.chat_id}")

            # Join room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

            # Send chat history after connection
            history = await self.get_chat_history()
            print(f"Sending chat history: {history}")
            await self.send(text_data=json.dumps({
                'type': 'chat_history',
                'messages': history
            }))

        except Exception as e:
            print(f"Connection error: {e}")
            await self.close(code=4000)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def get_chat_history(self):
        try:
            messages = redis_client.lrange(self.history_key, 0, -1)
            print(f"Retrieved {len(messages)} messages from Redis")
            return [json.loads(msg.decode('utf-8')) for msg in messages]
        except Exception as e:
            print(f"Error getting chat history: {e}")
            return []

    async def save_to_redis(self, message_data):
        try:
            redis_client.rpush(self.history_key, json.dumps(message_data))
            print(f"Saved message to Redis: {message_data}")
            # Keep only last 100 messages
            redis_client.ltrim(self.history_key, -100, -1)
            return True
        except Exception as e:
            print(f"Error saving to Redis: {e}")
            return False

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            print(f"Received: {text_data_json}")
            
            if text_data_json.get('type') == 'authentication':
                await self.send(json.dumps({
                    'type': 'authentication_successful'
                }))
                return

            message = text_data_json.get('content')
            sender = text_data_json.get('sender')
            timestamp = datetime.now().isoformat()

            # Create message data
            message_data = {
                'content': message,
                'sender': sender,
                'timestamp': timestamp
            }

            # Save to Redis
            success = await self.save_to_redis(message_data)
            if not success:
                print("Failed to save message to Redis")
                return

            # Broadcast message
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender': sender,
                    'timestamp': timestamp
                }
            )

        except Exception as e:
            print(f"Error in receive: {e}")

    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'content': event['message'],
            'sender': event['sender'],
            'timestamp': event['timestamp']
        })) 