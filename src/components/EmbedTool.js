import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CodeIcon from '@mui/icons-material/Code';
import PreviewIcon from '@mui/icons-material/Preview';
import SettingsIcon from '@mui/icons-material/Settings';

const EmbedTool = ({ pollId, pollTitle, voteUrl }) => {
  const [width, setWidth] = useState(100);
  const [widthUnit, setWidthUnit] = useState('%');
  const [height, setHeight] = useState(600);
  const [showBorder, setShowBorder] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateEmbedCode = () => {
    const widthValue = widthUnit === '%' ? `${width}%` : `${width}px`;
    const borderStyle = showBorder ? ' style="border: 1px solid #ddd; border-radius: 8px;"' : ' style="border: none;"';
    
    return `<iframe 
  src="${voteUrl}" 
  width="${widthValue}" 
  height="${height}px"
  frameborder="0"${borderStyle}
  title="Vote in poll: ${pollTitle}">
</iframe>`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode());
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Box>
      <Stack spacing={3}>
        
        <Alert severity="info">
          Embed this voting form directly on your website to allow visitors to vote without leaving your page.
        </Alert>

        {/* Settings */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon fontSize="small" />
            Embed Settings
          </Typography>
          
          <Stack spacing={3}>
            {/* Width Control */}
            <Box>
              <Typography variant="body2" gutterBottom>
                Width: {width}{widthUnit}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Slider
                  value={width}
                  onChange={(e, newValue) => setWidth(newValue)}
                  min={widthUnit === '%' ? 50 : 300}
                  max={widthUnit === '%' ? 100 : 1200}
                  sx={{ flex: 1 }}
                />
                <FormControl size="small">
                  <Select
                    value={widthUnit}
                    onChange={(e) => {
                      setWidthUnit(e.target.value);
                      setWidth(e.target.value === '%' ? 100 : 600);
                    }}
                  >
                    <MenuItem value="%">%</MenuItem>
                    <MenuItem value="px">px</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            {/* Height Control */}
            <Box>
              <Typography variant="body2" gutterBottom>
                Height: {height}px
              </Typography>
              <Slider
                value={height}
                onChange={(e, newValue) => setHeight(newValue)}
                min={400}
                max={1000}
                step={50}
              />
            </Box>

            {/* Border Toggle */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2">Show Border:</Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  label="Yes"
                  onClick={() => setShowBorder(true)}
                  color={showBorder ? "primary" : "default"}
                  variant={showBorder ? "filled" : "outlined"}
                />
                <Chip
                  label="No"
                  onClick={() => setShowBorder(false)}
                  color={!showBorder ? "primary" : "default"}
                  variant={!showBorder ? "filled" : "outlined"}
                />
              </Stack>
            </Stack>
          </Stack>
        </Paper>

        {/* Embed Code */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Embed Code
            </Typography>
            <Button
              size="small"
              startIcon={<PreviewIcon />}
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
          </Stack>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            value={generateEmbedCode()}
            InputProps={{
              readOnly: true,
              sx: {
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                backgroundColor: 'grey.50',
              }
            }}
          />
          
          <Button
            fullWidth
            variant="contained"
            startIcon={copied ? <ContentCopyIcon /> : <ContentCopyIcon />}
            onClick={copyToClipboard}
            sx={{ mt: 2 }}
          >
            {copied ? 'Copied!' : 'Copy Embed Code'}
          </Button>
        </Paper>

        {/* Preview */}
        {showPreview && (
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Preview
            </Typography>
            <Box 
              sx={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center',
                backgroundColor: 'grey.100',
                p: 2,
                borderRadius: 1,
              }}
            >
              <Box
                sx={{
                  width: widthUnit === '%' ? `${width}%` : `${width}px`,
                  height: `${height}px`,
                  border: showBorder ? '1px solid #ddd' : 'none',
                  borderRadius: showBorder ? '8px' : 0,
                  overflow: 'hidden',
                  backgroundColor: 'white',
                }}
              >
                <iframe
                  src={voteUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title={`Vote in poll: ${pollTitle}`}
                />
              </Box>
            </Box>
          </Paper>
        )}

        {/* Instructions */}
        <Paper variant="outlined" sx={{ p: 3, backgroundColor: 'grey.50' }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
            How to Use
          </Typography>
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            <li>
              <Typography variant="body2">
                Adjust the width and height settings to fit your website layout
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Copy the embed code using the button above
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                Paste the code into your website's HTML where you want the voting form to appear
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                The voting form will automatically update as people vote
              </Typography>
            </li>
          </ol>
        </Paper>
      </Stack>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="Embed code copied to clipboard!"
      />
    </Box>
  );
};

export default EmbedTool;