import React, { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { COLORS, COLORS_RGB } from "./helpers";
import { styled } from "@mui/material/styles";
import { Link as LinkReact } from "react-router-dom";
import RankingInput from "./RankingInput";

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import sc_paper from './images/sc_paper.jpg';
import sv_paper from './images/sv_paper.jpg';
import axioms_paper from './images/axioms_paper.jpg';


const RegLinkReact = styled(LinkReact)(({ theme }) => ({
  fontSize: "18px",
  textDecoration: "none",

  "&:hover": {
    textDecoration: "underline",
    color: `rgba(${COLORS_RGB.primary},0.5)`,
  },
  color: COLORS.primary,
}));


const RegLink = styled(Link)(({ theme }) => ({
  fontSize: "inherit",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
    color: `rgba(${COLORS_RGB.primary},0.5)`,
  },
  color: COLORS.primary,
}));

const Title = styled(Box)(({ theme }) => ({
  fontSize: 24,
  color: "#1080c3",
  fontWeight: 600,
  marginBottom: 20,
  marginTop: 20,
}));

const Paragraph = styled(Box)(({ theme }) => ({
  fontSize: 20,
  lineHeight: 1.5,
  color: "inherit",
  marginBottom: 15,
}));

const Question = styled(Box)(({ theme }) => ({
  fontSize: 20,
  lineHeight: 1.5,
  color: "inherit",
  marginBottom: 15,
  fontWeight: 600
}));


export const FAQ = (props) => {
  const [expanded, setExpanded] = useState(false);
  const matches = useMediaQuery("(min-width:600px)");
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleChange =
    (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };


  return (
    <div>
      <Container
        maxWidth={false}
        sx={{
          width: "100%",
          marginTop: "50px",
          maxWidth: 1000,
          paddingLeft: 5,
          paddingRight: 5,
          marginBottom: 20
        }}
      >
        <Box sx={{ marginTop: 0 }}>
          <Paper variant="elevation" elevation={0}>
            <Title>
              Frequently Asked Questions
            </Title>

            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Question >
                  As a voter, do I have to rank all of the candidates?
                </Question>

              </AccordionSummary>
              <AccordionDetails>
                <Paragraph>
                  No, but it is important to understand what it means to leave a candidate unranked. For example, suppose you rank A in 1st, B in 2nd, and leave C and D unranked:
                  <Box sx={{paddingTop:3, paddingLeft:2, paddingRight:2}}>
                  <RankingInput theCandidates={["A", "B", "C", "D"]} currRanking={{ "A": 1, "B": 2 }} handleUpdateRanking={() => true} onlyDisplay={true} />
                  </Box>
                  If you submit this ballot, it will increase the margin of A vs. B by 1, but it will have no effect on the margin of A vs. C, A vs. D, B vs. C, or B vs. D. If your intention was to express that you preferred both A and B to C and D but have no preference between C and D, then you should submit this ballot:
                  <Box sx={{paddingTop:3, paddingLeft:2, paddingRight:2}}>
                  <RankingInput theCandidates={["A", "B", "C", "D"]} currRanking={{ "A": 1, "B": 2, "C": 3, "D": 3 }} handleUpdateRanking={() => true} onlyDisplay={true}/>
                  </Box>
                </Paragraph>

              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2bh-content"
                id="panel2bh-header"
              >
            <Question>
              As a poll owner, I lost the links for my poll. How can I find the links?
            </Question>
              </AccordionSummary>
              <AccordionDetails>
              <Paragraph>
              Please send us a message on the <RegLinkReact to="/contact">Contact</RegLinkReact> page with the name of your poll (or something close to it). Since we do not store email addresses of poll owners, we cannot look up your poll by your email address. But please leave us your email on the Contact page so we can reply to you with your links.
            </Paragraph>


              </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3bh-content"
                id="panel3bh-header"
              >
            <Question>
              Can I edit the settings of a poll after it is created?
            </Question>
              </AccordionSummary>
              <AccordionDetails>
              <Paragraph>
              Yes, after creating the poll you received an admin link. Many poll settings can be changed from the admin page.
            </Paragraph>
            <Paragraph>If you lost the admin link, please send us a message on the <RegLinkReact to="/contact">Contact</RegLinkReact> page with the name of your poll (or something close to it).  Since we do not store email addresses of poll owners, we cannot look up your poll by your email address. But please leave us your email on the Contact page so we can reply to you with your links.
            </Paragraph>
              </AccordionDetails>
            </Accordion>



          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default FAQ;
