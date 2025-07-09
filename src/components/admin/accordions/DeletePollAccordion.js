import React from 'react';
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { StyledAccordion } from '../StyledAccordion';

export const DeletePollAccordion = ({ 
  onDeletePoll,
  expandedAccordion,
  setExpandedAccordion
}) => {
  return (
    <StyledAccordion 
      icon={<DeleteForeverOutlinedIcon color="error" />} 
      title="Delete Poll"
      accordionKey="delete"
      expandedAccordion={expandedAccordion}
      setExpandedAccordion={setExpandedAccordion}
    >
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Warning</AlertTitle>
          This action cannot be undone. All poll data and votes will be permanently deleted.
        </Alert>
        <Button
          variant="contained"
          color="error"
          onClick={onDeletePoll}
          startIcon={<DeleteForeverIcon />}
          sx={{ textTransform: "none" }}
        >
          Delete Poll Permanently
        </Button>
      </Box>
    </StyledAccordion>
  );
};