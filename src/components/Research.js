import React, { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { COLORS, COLORS_RGB } from "./helpers";
import { styled } from "@mui/material/styles";

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import sc_paper from './images/sc_paper.jpg';
import sv_paper from './images/sv_paper.jpg';
import axioms_paper from './images/axioms_paper.jpg';


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


export const Research = (props) => {

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
        <Box sx={{  marginTop: 0 }}>
          <Paper variant="elevation" elevation={0}>
            <Title>
              Research
            </Title>
            <Paragraph>
              Stable Voting is based on research in the following  journal articles.
            </Paragraph>
            <Paragraph>

              <Grid container spacing={3}>
                <Grid item sm={12} md={12}>
                  <Card sx={{ maxWidth: 600 }}>
                    <CardActionArea sx={{ padding: 1 }} href="https://link.springer.com/article/10.1007/s10602-022-09383-9">
                      <CardMedia
                        component="img"
                        width="600"
                        image={sv_paper}
                        alt="Stable Voting Paper"
                      />
                    </CardActionArea>
                  </Card>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Card sx={{ maxWidth: 600 }}>
                    <CardActionArea sx={{ padding: 1 }} href="https://arxiv.org/abs/2004.02350">
                      <CardMedia
                        component="img"
                        width="600"
                        image={sc_paper}
                        alt="Split Cycle Paper"
                      />
                    </CardActionArea>
                  </Card>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Card sx={{ maxWidth: 600 }} >
                    <CardActionArea sx={{ padding: 1 }} href="https://journals.sagepub.com/doi/abs/10.1177/09516298211043236">
                      <CardMedia
                        component="img"
                        width="600"
                        image={axioms_paper}
                        alt="Axioms for Defeat in Democratic Elections"
                      />
                    </CardActionArea>
                  </Card>
                </Grid>
              </Grid>
            </Paragraph>

            <Paragraph sx={{ paddingTop: 5 }}>
              Stable Voting and a number of other voting methods are implemented in the <RegLink href="https://pref-voting.readthedocs.io/">Preferential Voting Tools Python package</RegLink>.
            </Paragraph>
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default Research;
