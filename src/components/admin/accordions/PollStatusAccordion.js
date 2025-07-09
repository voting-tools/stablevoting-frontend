import React from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import moment from 'moment';
import { StyledAccordion } from '../StyledAccordion';

export const PollStatusAccordion = ({ 
  pollData, 
  onClosePoll, 
  onOpenPoll,
  expandedAccordion,
  setExpandedAccordion 
}) => {
  const isClosed = pollData["is_closed"] || pollData["is_completed"];
  
  return (
    <StyledAccordion 
      icon={isClosed ? <LockIcon color="error" /> : <LockOpenIcon color="success" />} 
      title={`Poll Status: ${isClosed ? "Closed" : "Open"}`}
      accordionKey="status"
      expandedAccordion={expandedAccordion}
      setExpandedAccordion={setExpandedAccordion}
    >
      <Box sx={{ p: 2 }}>
        <Alert severity={isClosed ? "warning" : "success"} sx={{ mb: 3 }}>
          The poll {isClosed ? "is not " : "is "} currently accepting votes.
          {pollData["closing_datetime"] === null
            ? " There is no closing date for this poll."
            : ` The closing date for this poll ${isClosed ? "was" : "is"} ${moment(
                pollData["closing_datetime"]
              ).format("MMMM Do YYYY, h:mm a")}`}
        </Alert>
        {isClosed ? (
          <Button
            onClick={onOpenPoll}
            variant="contained"
            color="success"
            startIcon={<LockOpenIcon />}
            sx={{ textTransform: "none" }}
          >
            Open Poll
          </Button>
        ) : (
          <Button
            onClick={onClosePoll}
            variant="contained"
            color="error"
            startIcon={<LockIcon />}
            sx={{ textTransform: "none" }}
          >
            Close Poll
          </Button>
        )}
      </Box>
    </StyledAccordion>
  );
};