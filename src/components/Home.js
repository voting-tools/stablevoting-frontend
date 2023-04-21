import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import useMediaQuery from "@mui/material/useMediaQuery";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

import ReactVivus from "react-vivus";

import mbsvg from "./home_images/MailBallot_gold2.svg";
import votesvg from "./home_images/Vote_gold2.svg";
import winnersvg from "./home_images/Winner_gold2.svg";
import { styled } from "@mui/material/styles";

import { COLORS, COLORS_RGB } from "./helpers";

const RegLink = styled(Link)(({ theme }) => ({
  fontSize: "inherit",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
    color: `rgba(${COLORS_RGB.primary}, 0.5)`,
  },
  color: COLORS.primary,
}));

const RegLink2 = styled(Link)(({ theme }) => ({
  fontSize: "inherit",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
    color: `rgba(${COLORS_RGB.primary}, 0.6)`,
  },
  color: `rgba(${COLORS_RGB.primary}, 1.0)`,
}));

export const Home = (props) => {
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
          paddingLeft: "0px !important",
          paddingRight: "0px !important",
        }}
      >
        <Box
          sx={{
            width: "100% !important",
            textAlign: "center",
            backgroundColor: `rgba(${COLORS_RGB.primary}, 0.6)`,
            backgroundImage: `linear-gradient(to right, rgba(${COLORS_RGB.primary}, 0.6),rgba(${COLORS_RGB.primary}, 1.0) 50%)`,
            color: "white",
            padding: 0,
            marginBottom: 5,
          }}
        >
          <Typography
            align="center"
            sx={{
              fontSize: {
                lg: 35,
                md: 35,
                sm: 35,
                xs: 25,
              },
              fontWeight: 300,
              color: "white",
              paddingLeft: matches ? 10 : 5,
              paddingRight: matches ? 10 : 5,
              paddingTop: matches ? 10 : 5,
              paddingBottom: matches ? 10 : 5,
              textAlign: "center",
              width: "100%",
              lineHeight: matches ? 1.5 : 1.25,
            }}
          >
            Stable Voting is a free and easy way to make a group decision by
            voting.
          </Typography>
        </Box>
      </Container>
      <Container maxWidth="lg">
        <Paper variant="elevation" elevation={0}>
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              <ListItem key={1}>
                <ListItemAvatar key={"1-2"}>
                  <Avatar
                    alt="Create a poll"
                    sx={{
                      minWidth: matches ? "150px" : "80px",
                      minHeight: matches ? "150px" : "80px",
                    }}
                  >
                    <ReactVivus
                      id="mailsvg"
                      option={{
                        file: mbsvg,
                        animTimingFunction: "EASE",
                        type: "sync",
                      }}
                      style={{
                        height: matches ? "150px" : "80px",
                        width: matches ? "150px" : "80px",
                      }}
                    />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>
                  <Box
                    sx={{
                      fontSize: matches ? "24px !important" : "20px !important",
                      paddingLeft: 2,
                    }}
                  >
                    <RegLink to="create">Create a poll</RegLink> and send the
                    generated link to your voters.{" "}
                  </Box>
                </ListItemText>
              </ListItem>
              <ListItem key={2}>
                <ListItemAvatar key={"2-1"}>
                  <Avatar
                    alt="Rank candidates"
                    sx={{
                      minWidth: matches ? "150px" : "80px",
                      minHeight: matches ? "150px" : "80px",
                    }}
                  >
                    <ReactVivus
                      id="votesvg"
                      option={{
                        file: votesvg,
                        animTimingFunction: "EASE",
                        type: "sync",
                      }}
                      style={{
                        height: matches ? "150px" : "80px",
                        width: matches ? "150px" : "80px",
                      }}
                    />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>
                  <Box
                    sx={{
                      fontSize: matches ? "24px !important" : "20px !important",
                      paddingLeft: 2,
                    }}
                  >
                    Voters rank the candidates.
                  </Box>
                </ListItemText>
              </ListItem>
              <ListItem key={3}>
                <ListItemAvatar key={"3-1"}>
                  <Avatar
                    alt="Create a poll"
                    sx={{
                      minWidth: matches ? "150px" : "80px",
                      minHeight: matches ? "150px" : "80px",
                    }}
                  >
                    <ReactVivus
                      id="winnersvg"
                      option={{
                        file: winnersvg,
                        animTimingFunction: "EASE",
                        type: "sync",
                      }}
                      style={{
                        height: matches ? "150px" : "80px",
                        width: matches ? "150px" : "80px",
                      }}
                    />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>
                  <Box
                    sx={{
                      fontSize: matches ? "24px !important" : "20px !important",
                      paddingLeft: 2,
                    }}
                  >
                    View the winner and explanation of results.{" "}
                  </Box>
                </ListItemText>
              </ListItem>
            </List>
          </Box>
        </Paper>
      </Container>
      <Container
        maxWidth={false}
        sx={{
          width: "100%",
          paddingLeft: "0px !important",
          paddingRight: "0px !important",
          marginTop: 0,
        }}
      >
        <Box
          sx={{
            width: "100% !important",
            textAlign: "center",
            backgroundColor: `rgba(${COLORS_RGB.grey}, 0.6)` /*"rgba(16, 128, 195, 0.6)"*/,
            backgroundImage: `linear-gradient(to right, rgba(${COLORS_RGB.grey}, 0.6),rgba(${COLORS_RGB.grey}, 1) 50%)`,
            color: "black",
            padding: 0,
            marginTop: 5,
          }}
        >
          <Typography
            align="center"
            sx={{
              fontSize: {
                lg: 24,
                md: 24,
                sm: 24,
                xs: 20,
              },
              fontWeight: 300,
              paddingLeft: matches ? 5 : 5,
              paddingRight: matches ? 5 : 5,
              paddingTop: matches ? 5 : 5,
              paddingBottom: matches ? 5 : 5,
              textAlign: "center",
              width: "100%",
              lineHeight: matches ? 1.5 : 1.25,
            }}
          >
            Stable Voting respects majority preferences and mitigates the
            threats of vote splitting and spoiler effects that can undermine
            elections run with traditional voting systems. <br /> <br />
            <RegLink2 to="about">Learn more</RegLink2>.
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
