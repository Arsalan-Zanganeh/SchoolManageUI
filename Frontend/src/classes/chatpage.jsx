import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Stack,
  IconButton,
  Paper,
  Container,
  Divider,
  Button,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Picker from 'emoji-picker-react'; // Import emoji-picker-react
import ArrowBack from '@mui/icons-material/ArrowBack'; // For back button icon

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'Instructor', content: 'Hello everyone!' },
    { sender: 'Student 1', content: 'Hi, I have a question.' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const newMessageObject = {
      sender: 'You', // You can dynamically set the sender (e.g., user name)
      content: newMessage,
    };
    setMessages([...messages, newMessageObject]);
    setNewMessage('');
  };

  // Handle 'Enter' key to send message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (event, emojiObject) => {
    if (emojiObject && emojiObject.emoji) {
      setNewMessage(newMessage + emojiObject.emoji);
      setShowEmojiPicker(false); // Hide emoji picker after selection
    }
  };

  return (
<Box
  sx={{
    backgroundColor: '#DCE8FD',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
    position: 'absolute',
    width: '100%',  // This makes the box take full width of the screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }}
>
  <Container
    maxWidth="md"  // Increased to 'md' to make the container bigger
    sx={{
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderRadius: 2,
      boxShadow: 3,
      py: { xs: 2, md: 3 },
      px: { xs: 2, md: 4 },  // Increased horizontal padding for a bit more space
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

          {/* Messages Section */}
          <Box
            sx={{
              maxHeight: '60vh',
              overflowY: 'auto',
              mb: 2,
              paddingRight: 2,
              width: '100%',
              maxWidth: '800px',
            }}
          >
            <Stack spacing={2}>
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    padding: 2,
                    backgroundColor: msg.sender === 'You' ? '#d1e7dd' : '#fff',
                    borderRadius: 2,
                    maxWidth: '70%',
                    alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                    {msg.sender}:
                  </Typography>
                  <Typography variant="body1">{msg.content}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Message Input Section */}
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
            <TextField
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              fullWidth
              label="Type a message"
              variant="outlined"
              multiline
              rows={3}
              sx={{ mr: 2 }} // This gives space between TextField and the icons
            />

            <IconButton color="primary" onClick={() => setShowEmojiPicker(!showEmojiPicker)} sx={{ ml: 1 }}>
              😊
            </IconButton>
            <IconButton color="primary" onClick={handleSendMessage} sx={{ ml: 1 }}>
              <SendIcon />
            </IconButton>

            {showEmojiPicker && (
              <Box sx={{ position: 'absolute', bottom: '60px', right: '20px' }}>
                <Picker onEmojiClick={handleEmojiSelect} />
              </Box>
            )}
          </Box>

          {/* Back Button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBack />}
            onClick={() => alert('Back to previous page')}
            sx={{ marginTop: 3, width: '100%' }}
          >
            Back To Dashboard
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChatPage;
