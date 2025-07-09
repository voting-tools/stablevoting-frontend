import React from 'react';
import Box from "@mui/material/Box";
import CodeIcon from '@mui/icons-material/Code';
import EmbedTool from "../../EmbedTool";
import { StyledAccordion } from '../StyledAccordion';

export const EmbedPollAccordion = ({ 
  pollId,
  pollTitle,
  voteUrl,
  expandedAccordion,
  setExpandedAccordion
}) => {
  return (
    <StyledAccordion 
      icon={<CodeIcon color="primary" />} 
      title="Embed Poll"
      accordionKey="embed"
      expandedAccordion={expandedAccordion}
      setExpandedAccordion={setExpandedAccordion}
    >
      <Box sx={{ p: 2 }}>
        <EmbedTool 
          pollId={pollId}
          pollTitle={pollTitle}
          voteUrl={voteUrl}
        />
      </Box>
    </StyledAccordion>
  );
};