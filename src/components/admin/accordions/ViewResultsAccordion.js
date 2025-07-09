import React from 'react';
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import BarChartIcon from '@mui/icons-material/BarChart';
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import { StyledAccordion } from '../StyledAccordion';

export const ViewResultsAccordion = ({ 
  resultsUrl,
  resultsLink,
  onCopyLink,
  expandedAccordion,
  setExpandedAccordion
}) => {
  return (
    <StyledAccordion 
      icon={<BarChartIcon color="primary" />} 
      title="View Results"
      accordionKey="results"
      expandedAccordion={expandedAccordion}
      setExpandedAccordion={setExpandedAccordion}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Use the following link to view the results of the poll.
        </Typography>
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center',
            bgcolor: 'grey.50',
            borderRadius: 2
          }}
        >
          <Link to={resultsLink} style={{ flex: 1, wordBreak: 'break-all' }}>
            {resultsUrl}
          </Link>
          <Tooltip title="Copy link">
            <IconButton
              onClick={() => onCopyLink(resultsUrl)}
              color="primary"
            >
              <InsertLinkOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Paper>
      </Box>
    </StyledAccordion>
  );
};