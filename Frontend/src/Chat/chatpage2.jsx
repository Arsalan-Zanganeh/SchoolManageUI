import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Paper,
  Container,
  Divider,
  Button,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Picker from 'emoji-picker-react';
import { useStudent } from '../context/StudentContext';

const ChatPage = ({ classId, onBack }) => {
  const { student } = useStudent();
  const messagesEndRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [isSocketOpen, setIsSocketOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatroomId, setChatroomId] = useState(classId);

  const [userData, setUserData] = useState({});

  const fetchUserDataByNationalId = async (nationalId) => {
    // اگر قبلاً در userData موجود است، دوباره درخواست نمی‌دهیم
    if (userData[nationalId]) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_HTTP_BASE}://${import.meta.env.VITE_APP_URL_BASE}/portfolio/chat_info/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ National_ID: nationalId }),
      });
      const result = await response.json();

      // نتیجه را در استیت ذخیره می‌کنیم
      setUserData((prevData) => ({
        ...prevData,
        [nationalId]: result, // انتظار داریم شامل first_name, last_name, Type باشد
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (student?.National_ID && classId) {
      const socketConnection = new WebSocket(`ws://${import.meta.env.VITE_APP_URL_BASE}/ws/${chatroomId}/`);

      socketConnection.onopen = () => {
        console.log('WebSocket connection established');
        setIsSocketOpen(true);
      };

      socketConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message:', data);

          if (data.type === 'chat_history') {
            setMessages(data.messages.map(msg => {
              fetchUserDataByNationalId(msg.sender);
              return {
                ...msg,
                isSent: msg.sender === student.National_ID
              };
            }));
          } else if (data.type === 'chat_message' || data.content) {
            fetchUserDataByNationalId(data.sender);
            setMessages(prev => [...prev, {
              ...data,
              isSent: data.sender === student.National_ID
            }]);
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      setSocket(socketConnection);

      return () => {
        if (socketConnection) {
          socketConnection.close();
        }
      };
    }
  }, [student, chatroomId]);

  const handleSendMessage = () => {
    if (socket && isSocketOpen && student?.National_ID && newMessage.trim()) {
      const messageData = {
        type: 'chat_message',
        content: newMessage.trim(),
        sender: student.National_ID,
        timestamp: new Date().toISOString()
      };
      
      socket.send(JSON.stringify(messageData));
      setNewMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emojiData, event) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#DCE8FD',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: { xs: 1, md: 3 },
        mb: 2,
        position: 'absolute',
        width: '100%',
        top: 0,
        left: { xs: '-8px', md: 0 },
        right: 0,
        bottom: 0,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderRadius: 2,
          boxShadow: 3,
          py: { xs: 2, md: 3 },
          px: { xs: 1, md: 4 },
          width: { xs: '95%', md: '100%' },
          margin: '0 auto',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 1, md: 2 },
            marginBottom: 3,
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: 2,
            backdropFilter: 'blur(5px)',
          }}
        >
          <Typography variant="h4" color="primary" gutterBottom fontWeight="bold" sx={{ textAlign: 'center' }}>
            Class Chat
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />

          <Box sx={{ 
            height: '250px',
            overflowY: 'auto', 
            mb: 2, 
            mt: '-5px',
            paddingRight: 2, 
            width: '100%', 
            maxWidth: '800px', 
            display: 'flex', 
            flexDirection: 'column'
          }}>
            {messages.map((msg, index) => {
              const senderInfo = userData[msg.sender];
              let displayName = msg.sender; 
              if (senderInfo) {
                if (senderInfo.Type === 'Teacher') {
                  displayName = `${senderInfo.first_name} ${senderInfo.last_name} (Teacher)`;
                } else {
                  displayName = `${senderInfo.first_name} ${senderInfo.last_name}`;
                }
              }

              return (
                <Box 
                  key={`${msg.content}-${index}`} 
                  sx={{ 
                    display: 'flex',
                    justifyContent: msg.isSent ? 'flex-end' : 'flex-start',
                    width: '100%', 
                    mb: 1,
                  }}
                >
                  <Box sx={{
                    padding: 1.5,
                    backgroundColor: msg.isSent ? '#d1e7dd' : '#ffffff',
                    borderRadius: 2,
                    maxWidth: '70%',
                    boxShadow: 1,
                    width: 'auto',
                  }}>
                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {displayName}
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                      {msg.content}
                    </Typography>
                    {msg.timestamp && (
                      <Typography variant="caption" color="textSecondary">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
            <div ref={messagesEndRef} />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 2,
              width: '100%',
              maxWidth: '800px',
              position: 'relative',
            }}
          >
            <Box sx={{ flex: 1, mr: 2 }}>
              <TextField
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                fullWidth
                label="Type a message"
                variant="outlined"
                multiline
                rows={3}
              />
            </Box>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              gap: 1 
            }}>
              <IconButton 
                color="primary" 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
              >
                😊
              </IconButton>
              <IconButton 
                color="primary" 
                onClick={handleSendMessage} 
              >
                <SendIcon />
              </IconButton>
            </Box>

            {showEmojiPicker && (
              <Box sx={{ 
                position: 'absolute', 
                bottom: '60px', 
                right: '20px',
                zIndex: 1000
              }}>
                <Picker 
                  onEmojiClick={handleEmojiSelect}
                  width={300}
                  height={400}
                />
              </Box>
            )}
          </Box>


        </Paper>
      </Container>
    </Box>
  );
};

export default ChatPage;
