import React, { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { COLORS, COLORS_RGB } from "./helpers";
import { styled } from "@mui/material/styles";
import { Link as LinkReact } from "react-router-dom";


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


export const Privacy = (props) => {
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
          maxWidth: 1000,
          paddingLeft: 5,
          paddingRight: 5,
          marginBottom: 20
        }}
      >
        <Box sx={{ marginTop: 0 }}>
          <Paper variant="elevation" elevation={0}>
            <Title>
              Privacy
            </Title>
            <Paragraph>
              We do not store email addresses of poll owners or voters. We do store IP addresses with each ballot as a minimal attempt to prevent double voting (to more effectively prevent double voting, select the "private" setting when creating a poll).
            </Paragraph>
            <Paragraph>

              A fully anonymized version of your poll may be used in academic research or shared with other academic researchers. "Fully anonymized" means that your poll name will be erased, your candidate names will be replaced by letters A,B,C, etc., and the only information retained about your poll will be how many voters submitted a ranking of the form ABC, how many submitted a ranking of the form BAC, and so on (see <RegLink href="https://www.preflib.org/">https://www.preflib.org/</RegLink> for the format of anonymized elections studied by researchers).
            </Paragraph>

          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default Privacy;
