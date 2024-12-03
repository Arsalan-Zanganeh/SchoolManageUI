import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const AssignmentDetail = () => {
  const { cid, aid } = useParams(); // دریافت شناسه کلاس و تکلیف از URL
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState([
    // داده‌های نمونه (جایگزین API می‌شود)
    { id: 1, name: "PreviousUpload1.pdf", uploadDate: "2024-12-01" },
    { id: 2, name: "PreviousUpload2.pdf", uploadDate: "2024-12-02" },
  ]);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      const newUpload = {
        id: uploadedFiles.length + 1,
        name: file.name,
        uploadDate: new Date().toISOString().split("T")[0],
      };
      setUploadedFiles([newUpload, ...uploadedFiles]);
      setFile(null);
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: "800px", margin: "auto" }}>
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Assignment {aid}
        </Typography>
        <Divider sx={{ marginBottom: 3 }} />
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Class ID: {cid}
        </Typography>

        <Typography variant="h6" color="primary" sx={{ marginBottom: 2 }}>
          Upload your file
        </Typography>
        <Box display="flex" alignItems="center" gap={2} sx={{ marginBottom: 3 }}>
          <TextField
            type="file"
            onChange={handleFileChange}
            inputProps={{ accept: "application/pdf" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file}
          >
            Upload
          </Button>
        </Box>

        <Typography variant="h6" color="primary" sx={{ marginBottom: 2 }}>
          Previous Uploads
        </Typography>
        <List>
          {uploadedFiles.map((upload) => (
            <React.Fragment key={upload.id}>
              <ListItem>
                <ListItemText
                  primary={upload.name}
                  secondary={`Uploaded on: ${upload.uploadDate}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate(-1)}
          sx={{ marginTop: 3 }}
        >
          Back to Class
        </Button>
      </Paper>
    </Box>
  );
};

export default AssignmentDetail;
