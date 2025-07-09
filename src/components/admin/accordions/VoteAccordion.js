import React from 'react';
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import LockIcon from '@mui/icons-material/Lock';
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import { StyledAccordion } from '../StyledAccordion';

export const VoteAccordion = ({ 
  pollData, 
  voteUrl,
  voteLink,
  onCopyLink,
  expandedAccordion,
  setExpandedAccordion
}) => {
  return (
    <StyledAccordion 
      icon={<HowToVoteIcon color="primary" />} 
      title="Vote in Poll"
      accordionKey="vote"
      expandedAccordion={expandedAccordion}
      setExpandedAccordion={setExpandedAccordion}
    >
      {pollData !== null && !pollData["is_private"] ? (
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Use the following link to vote in the poll.
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
            <Link to={voteLink} style={{ flex: 1, wordBreak: 'break-all' }}>
              {voteUrl}
            </Link>
            <Tooltip title="Copy link">
              <IconButton
                onClick={() => onCopyLink(voteUrl)}
                color="primary"
              >
                <InsertLinkOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Paper>
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>
          <Alert severity="info" icon={<LockIcon />}>
            The poll is private: {pollData["num_invited_voters"] === 1 
              ? "1 person has" 
              : pollData["num_invited_voters"].toString() + " people have"} been invited to vote in the poll. 
            Each voter has received a unique link to vote in the poll.
          </Alert>
        </Box>
      )}
    </StyledAccordion>
  );
};