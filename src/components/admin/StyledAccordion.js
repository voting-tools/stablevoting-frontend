import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";

export const StyledAccordion = ({ 
  icon, 
  title, 
  children, 
  accordionKey, 
  expandedAccordion,
  setExpandedAccordion,
  onExpand, 
  ...props 
}) => {
  const isExpanded = expandedAccordion === accordionKey;
  
  return (
    <Accordion 
      {...props}
      expanded={isExpanded}
      onChange={(event, expanded) => {
        setExpandedAccordion(expanded ? accordionKey : false);
        if (expanded && onExpand) {
          onExpand();
        }
        if (props.onChange) props.onChange(event, expanded);
      }}
      sx={{ 
        mb: 1,
        '&:before': { display: 'none' },
        boxShadow: 'none',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          borderColor: 'primary.main',
        }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          '& .MuiAccordionSummary-content': {
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }
        }}
      >
        {icon}
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};