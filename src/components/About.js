import React, { useState, useEffect } from "react";
import { Link as LinkReact} from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Results from "./Results";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Link  from "@mui/material/Link";
import { COLORS, COLORS_RGB } from "./helpers";
import { styled } from "@mui/material/styles";

const RegLinkReact = styled(LinkReact)(({ theme }) => ({
  fontSize: "inherit",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
    color: `rgba(${COLORS_RGB.primary}, 0.5)`,
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

const Question = styled(Box)(({ theme }) => ({
  fontSize: 22,
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

const samplePoll1Id = "615f1087f756a1970f8c7f59";
const samplePoll2Id = "615f10cef756a1970f8c7f5a";
const samplePoll3Id = "62117dfe6bc53a9813703b8b";
const samplePoll4Id = "62117e6d6bc53a9813703b8c";

export const About = (props) => {
  const [showEx1, setShowEx1] = useState(false);
  const [showEx2, setShowEx2] = useState(false);
  const [showEx3, setShowEx3] = useState(false);
  const [showEx4, setShowEx4] = useState(false);

  const matches = useMediaQuery("(min-width:600px)");
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div>
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        marginTop: "50px",
        maxWidth:1000,
        paddingLeft:5, 
        paddingRight:5,
        marginBottom: 20
      }}
    >
        <Box sx={{ marginLeft: "auto", marginRight: "auto",   textAlign:"left", marginTop: 0            
}}>
          <Paper variant="elevation" elevation={0}>

          <Question>Mission</Question>
            <Paragraph>
            Our goal is to translate academic <RegLinkReact to="/research">research</RegLinkReact> on voting into a beneficial service for the public, as well as to improve our understanding of voting by the study of real elections. We offer Stable Voting as a free service, we maintain your <RegLinkReact to="/privacy">privacy</RegLinkReact>, and we hope to improve the site with your <RegLinkReact to="/contact">feedback</RegLinkReact>.
            </Paragraph>


            <Question>Why Stable Voting?</Question>
            <Paragraph>
              Stable Voting respects majority preferences and mitigates the
              threats of vote splitting and spoiler effects that can undermine
              elections run with traditional voting systems.
            </Paragraph>

            <Paragraph>
              The key idea of <em>stability</em> is that if a candidate A would
              win without another candidate B in the election, and a majority of
              voters prefer A to B, then A should still win when B is included
              in the election.
            </Paragraph>

            <Paragraph>
              The only exception to stability should be for tie-breaking: if
              there is another candidate C who has the same kind of claim to
              winning as A does&mdash;that is, C would win without a candidate D
              in the election, and a majority of voters prefer C to D&mdash;then
              it is legitimate to choose between A and C (and any other
              candidates with the same kind of claim to winning).
            </Paragraph>

            <Question>How does it work?</Question>
            <Paragraph>
              Voters rank the candidates. Then Stable Voting determines the
              winner of an election by looking at{" "}
              <em> head-to-head matches </em> between candidates:
            </Paragraph>

            <Paragraph>
              If more voters rank candidate A above candidate B than rank B
              above A, then A <em> wins </em> their head-to-head match and B{" "}
              <em> loses </em> their head-to-head match.
            </Paragraph>

            <Paragraph>
              If one candidate{" "}
              <em>wins its matches against all other candidates</em>, this
              candidate&mdash;known as the{" "}
              <RegLink
                href="https://en.wikipedia.org/wiki/Marquis_de_Condorcet"
                target="_blank"
              >
                <em>Condorcet winner</em>
              </RegLink>
              &mdash;is the winner of the election.
            </Paragraph>
            <Paragraph>
              <Button
                variant="text"
                sx={{
                  fontSize: 20,
                  color: "inherit",
                  "&:hover": {
                    backgroundColor: `rgba(${COLORS_RGB.secondary},0.5)`,
                  },
                  backgroundColor: `rgba(${COLORS_RGB.secondary},0.5)`,
                  textTransform: "none",
                  fontStyle: "inherit",
                  textAlign: "left",
                }}
                onClick={() => {
                  setShowEx1(!showEx1);
                }}
              >
                {showEx1
                  ? "Hide example"
                  : "See an example of an election with a candidate who wins all head-to-head matches."}{" "}
                {showEx1 ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowRightIcon />
                )}{" "}
              </Button>
              <Collapse in={showEx1}>
                <Box
                  sx={{ border: "1px solid grey", borderRadius: 2, padding: 2 }}
                >
                  <Results pollId={samplePoll1Id} />
                </Box>
              </Collapse>
            </Paragraph>

            <Question>
              What if there is no candidate who wins all head-to-head matches?
            </Question>

            <Paragraph>
              It is possible that every candidate loses a head-to-head match to
              some other candidate. For example, in an election with three
              candidates, A, B, and C, it may be that A wins head-to-head
              against B, B wins head-to-head against C, and C wins head-to-head
              against A, so each candidate has one loss. This is an example of a{" "}
              <em>majority cycle</em>.
            </Paragraph>

            <Paragraph>
              To deal with majority cycles, we look at the{" "}
              <em> margins of victory or loss </em> in head-to-head matches. The{" "}
              <em> margin of </em> A vs. B is the number of voters who rank A
              above B minus the number of voters who rank B above A. If the
              margin is positive, it is a margin of victory for A; if the margin
              is negative, it is a margin of loss for A.
            </Paragraph>

            <Paragraph>
              We resolve majority cycles as follows:
              <ul>
                <li>
                  <Box>
                    For each majority cycle, the match with the smallest margin
                    of victory in that cycle is discarded.{" "}
                  </Box>

                  <Box sx={{ paddingTop: "10px", paddingBottom: "10px" }}>
                    For example, if A wins against B by 1,000 votes, B wins
                    against C by 2,000 votes, and C wins against A by 3,000
                    votes, then A’s win against B is discarded.
                  </Box>
                </li>
                <li>
                  The wins in the remaining matches are considered{" "}
                  <em>defeats</em> of the losing candidates.
                </li>
              </ul>
            </Paragraph>

            <Paragraph>
              There is always an undefeated candidate. If there is only one,
              that candidate wins the election.
            </Paragraph>
            <Paragraph>
              <Button
                variant="text"
                sx={{
                  fontSize: 20,
                  color: "inherit",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: `rgba(${COLORS_RGB.secondary},0.5)`,
                  },
                  backgroundColor: `rgba(${COLORS_RGB.secondary},0.5)`,
                  fontStyle: "inherit",
                  textAlign: "left",
                }}
                onClick={() => {
                  setShowEx2(!showEx2);
                }}
              >
                {showEx2
                  ? "Hide example"
                  : "See an example of a poll with no candidate who wins all head-to-head matches but with a single undefeated candidate."}{" "}
                {showEx2 ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowRightIcon />
                )}{" "}
              </Button>
              <Collapse in={showEx2}>
                <Box
                  sx={{ border: "1px solid grey", borderRadius: 2, padding: 2 }}
                >
                  <Results pollId={samplePoll2Id} />
                </Box>
              </Collapse>
            </Paragraph>

            <Question>
              What if there is more than one undefeated candidate?
            </Question>

            <Paragraph>
              If there is more than one undefeated candidate, we break the tie
              as follows:
              <ul>
                <li>
                  List all head-to-head matches of the form A vs. B, where A is
                  undefeated, in order from the largest to smallest margin of A
                  vs. B. Find the first match A vs. B in the list such that A is
                  a Stable Voting winner{" "}
                  <em> after B is removed from all ballots</em>; this A is the
                  Stable Voting winner for the original set of ballots.
                </li>
              </ul>
            </Paragraph>

            <Paragraph>
              This rule guarantees that the only exceptions to stability occur
              when multiple candidates have a claim to winning based on
              stability, in which case the winner is the candidate with the
              strongest claim, as measured by the margin of A vs. B where A
              would win without B in the election.
            </Paragraph>

            <Paragraph>
              <Button
                variant="text"
                sx={{
                  fontSize: 20,
                  color: "inherit",
                  "&:hover": {
                    backgroundColor: `rgba(${COLORS_RGB.secondary},0.5)`,
                  },
                  backgroundColor: `rgba(${COLORS_RGB.secondary},0.5)`,
                  textTransform: "none",
                  fontStyle: "inherit",
                  textAlign: "left",
                }}
                onClick={() => {
                  setShowEx3(!showEx3);
                }}
              >
                {showEx3
                  ? "Hide example"
                  : "See an example of a poll with no candidate who wins all head-to-head matches,  multiple undefeated candidates, and a single Stable Voting winner."}{" "}
                {showEx3 ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowRightIcon />
                )}{" "}
              </Button>
              <Collapse in={showEx3}>
                <Box
                  sx={{ border: "1px solid grey", borderRadius: 2, padding: 2 }}
                >
                  <Results pollId={samplePoll3Id} />
                </Box>
              </Collapse>
            </Paragraph>

            <Paragraph>
              In the unlikely event that there are multiple Stable Voting
              winners, we report all the Stable Voting winners and a randomly
              selected ultimate winner.
            </Paragraph>

            <Paragraph>
              <Button
                variant="text"
                sx={{
                  fontSize: 20,
                  color: "inherit",
                  "&:hover": {
                    backgroundColor: `rgba(${COLORS_RGB.secondary},0.5)`,
                  },
                  backgroundColor: `rgba(${COLORS_RGB.secondary},0.5)`,
                  textTransform: "none",
                  fontStyle: "inherit",
                }}
                onClick={() => {
                  setShowEx4(!showEx4);
                }}
              >
                {showEx4
                  ? "Hide example"
                  : "See an example with multiple Stable Voting winners."}{" "}
                {showEx4 ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowRightIcon />
                )}{" "}
              </Button>
              <Collapse in={showEx4}>
                <Box
                  sx={{ border: "1px solid grey", borderRadius: 2, padding: 2 }}
                >
                  <Results pollId={samplePoll4Id} />
                </Box>
              </Collapse>
            </Paragraph>

            <Question>Where can I learn more about Stable Voting?</Question>

            <Paragraph>
              See the <RegLinkReact to="/research">research</RegLinkReact>  or   <RegLinkReact to="/faq">FAQ</RegLinkReact> pages for more information or the <RegLinkReact to="/demo">demo</RegLinkReact> page to see Stable Voting in action.   
            </Paragraph>
            {/*<Paragraph>
              See "
              <RegLink href="https://arxiv.org/abs/2108.00542" target="_blank">
                Stable Voting
              </RegLink>
              " by Wesley H. Holliday and Eric Pacuit to learn more about the
              Stable Voting procedure.
            </Paragraph>
            <Paragraph>
              See "
              <RegLink href="https://arxiv.org/abs/2008.08451" target="_blank">
                Axioms for Defeat in Democratic Elections
              </RegLink>
              " by Wesley H. Holliday and Eric Pacuit to learn more about the
              concept of defeat used to resolve majority cycles.
                </Paragraph>*/}
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default About;
