import React, { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { COLORS, COLORS_RGB } from "./helpers";
import { styled } from "@mui/material/styles";
import { Link as LinkReact } from "react-router-dom";
import RankingInput from "./RankingInput";

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Styled components
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  boxShadow: 'none',
  border: '1px solid',
  borderColor: theme.palette.divider,
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: theme.spacing(1, 0),
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  '& .MuiAccordionSummary-content': {
    margin: theme.spacing(1.5, 0),
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2, 3, 3, 3),
  borderTop: '1px solid',
  borderColor: theme.palette.divider,
}));

const RegLinkReact = styled(LinkReact)(({ theme }) => ({
  fontSize: "inherit",
  textDecoration: "none",
  color: theme.palette.primary.main,
  "&:hover": {
    textDecoration: "underline",
  },
}));

const ExampleBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(3, 0),
  border: '1px solid #e0e0e0',
}));

export const FAQ = (props) => {
  const [expanded, setExpanded] = useState([]);
  const matches = useMediaQuery("(min-width:600px)");
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(prev => {
      if (isExpanded) {
        return [...prev, panel];
      } else {
        return prev.filter(p => p !== panel);
      }
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Frequently Asked Questions
      </Typography>

      <Box sx={{ mb: 6 }}>
        <StyledAccordion expanded={expanded.includes('panel1')} onChange={handleChange('panel1')}>
          <StyledAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography sx={{ fontWeight: 500 }}>
              As a voter, do I have to rank all of the candidates?
            </Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Typography paragraph>
              No, but it is important to understand what it means to leave a candidate unranked. 
              For example, suppose you rank A in 1st, B in 2nd, and leave C and D unranked:
            </Typography>
            
            <ExampleBox>
              <RankingInput 
                theCandidates={["A", "B", "C", "D"]} 
                currRanking={{ "A": 1, "B": 2 }} 
                handleUpdateRanking={() => true} 
                onlyDisplay={true} 
              />
            </ExampleBox>
            
            <Typography paragraph>
              If you submit this ballot, it will increase the margin of A vs. B by 1, but it will have 
              no effect on the margin of A vs. C, A vs. D, B vs. C, or B vs. D. If your intention was 
              to express that you preferred both A and B to C and D but have no preference between C and D, 
              then you should submit this ballot:
            </Typography>
            
            <ExampleBox>
              <RankingInput 
                theCandidates={["A", "B", "C", "D"]} 
                currRanking={{ "A": 1, "B": 2, "C": 3, "D": 3 }} 
                handleUpdateRanking={() => true} 
                onlyDisplay={true}
              />
            </ExampleBox>
          </StyledAccordionDetails>
        </StyledAccordion>

        <StyledAccordion expanded={expanded.includes('panel2')} onChange={handleChange('panel2')}>
          <StyledAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography sx={{ fontWeight: 500 }}>
              As a poll owner, I lost the links for my poll. How can I find the links?
            </Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Typography paragraph>
              Please send us a message on the <RegLinkReact to="/contact">Contact</RegLinkReact> page 
              with the name of your poll (or something close to it). Since we do not store email addresses 
              of poll owners, we cannot look up your poll by your email address. But please leave us your 
              email on the Contact page so we can reply to you with your links.
            </Typography>
          </StyledAccordionDetails>
        </StyledAccordion>

        <StyledAccordion expanded={expanded.includes('panel3')} onChange={handleChange('panel3')}>
          <StyledAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <Typography sx={{ fontWeight: 500 }}>
              Can I edit the settings of a poll after it is created?
            </Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Typography paragraph>
              Yes, after creating the poll you received an admin link. Many poll settings can be changed 
              from the admin page.
            </Typography>
            
            <Typography paragraph>
              If you lost the admin link, please send us a message on the{' '}
              <RegLinkReact to="/contact">Contact</RegLinkReact> page with the name of your poll 
              (or something close to it). Since we do not store email addresses of poll owners, we 
              cannot look up your poll by your email address. But please leave us your email on the 
              Contact page so we can reply to you with your links.
            </Typography>
          </StyledAccordionDetails>
        </StyledAccordion>
      </Box>

      {/* Additional info box */}
      <Box 
        sx={{ 
          p: 3, 
          mt: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1
        }}
      >
        <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
          Still have questions?
        </Typography>
        <Typography variant="body1" paragraph>
          If you couldn't find the answer you're looking for, please visit our{' '}
          <RegLinkReact to="/contact">Contact page</RegLinkReact> to get in touch.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You can also learn more about our voting system on the{' '}
          <RegLinkReact to="/about">About page</RegLinkReact>.
        </Typography>
      </Box>
    </Container>
  );
};

export default FAQ;