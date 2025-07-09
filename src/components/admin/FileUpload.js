import React, { useState } from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { formatFileSize } from '../../utils/pollUtils';

export const FileUpload = ({
  value,
  onChange,
  title = "Upload File",
  buttonText = "Choose File",
  accept = ".csv",
  maxSize = 10 * 1024 * 1024, // 10MB default
}) => {
  const [error, setError] = useState('');

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setError('');

    // Validate file size
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError(`File too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
      return;
    }

    onChange(selectedFiles);
    event.target.value = '';
  };

  const handleRemoveFile = () => {
    onChange(null);
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
        {title}
      </Typography>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id="file-upload-input"
        type="file"
        onChange={handleFileSelect}
      />
      <label htmlFor="file-upload-input">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
          fullWidth
          sx={{ 
            justifyContent: 'flex-start',
            textTransform: 'none',
            borderStyle: 'dashed',
            borderWidth: 2,
            py: 2,
            '&:hover': {
              borderStyle: 'dashed',
              borderWidth: 2,
            }
          }}
        >
          {buttonText}
        </Button>
      </label>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {value && value.length > 0 && (
        <Paper variant="outlined" sx={{ mt: 2, p: 1 }}>
          <List dense>
            <ListItem>
              <InsertDriveFileIcon sx={{ mr: 2, color: 'text.secondary' }} />
              <ListItemText
                primary={value[0].name}
                secondary={formatFileSize(value[0].size)}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={handleRemoveFile}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>
      )}
    </Box>
  );
};