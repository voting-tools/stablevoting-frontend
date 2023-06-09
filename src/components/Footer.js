import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { COLORS_RGB } from "./helpers";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { Link as LinkReact } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import ReactVivus from "react-vivus";
import logo_grey from "./home_images/logo_grey.svg";

const Copyright = () => {

  const RegLinkReact2 = styled(LinkReact)(({ theme }) => ({
    fontSize: "16px",
    textDecoration: "none",
  
    "&:hover": {
      textDecoration: "underline",
      color: `white`,
    },
    color: "white",
  }));
  
  return (
    <Box sx={{
      width: "100%", background: "rgba(0, 0, 0, 0.1)",
      paddingTop: 5, paddingBottom: 5,
      height: "100%",
    }}>
      <Typography component="div" variant="body1" color="inherit">
        &copy; {new Date().getFullYear()} <RegLinkReact2
          href="https://sites.google.com/site/wesholliday"
          rel="noreferrer"
          target="_blank"
        >
          Wesley H. Holliday
        </RegLinkReact2>
        &nbsp;and&nbsp;
        <RegLinkReact2
          href="https://pacuit.org"
          rel="noreferrer"
          target="_blank"
        >
          Eric Pacuit{" "}
        </RegLinkReact2>
      </Typography>
    </Box>
  )
}


const RegLinkReact = styled(LinkReact)(({ theme }) => ({
  fontSize: "18px",
  textDecoration: "none",

  "&:hover": {
    textDecoration: "underline",
    color: `white`,
  },
  color: "white",
}));

const RegLink = styled(Link)(({ theme }) => ({
  fontSize: "18px",
  textDecoration: "none",

  "&:hover": {
    textDecoration: "underline",
    color: `white`,
  },
  color: "white",
}));



export const Footer = () => {
  return (
    <footer>
      <div
        style={{
          textAlign: "center",
          bottom: 0,
          backgroundColor: `rgba(${COLORS_RGB.primary}, 0.5)`,
          backgroundImage: `linear-gradient(to right, rgba(${COLORS_RGB.primary}, 0.5), rgba(${COLORS_RGB.primary}, 1.0) 50%)`,
          color: "white",
          width: "100%",
          padding: 0
        }}
      >
        <Stack spacing={2}>
          <Container disableGutters maxWidth={false} sx={{
            marginLeft: "auto",
            marginRight: "auto",
            paddingTop: 5
          }}>

            <Box
              sx={{
                width: "100%",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
                paddingLeft:5, 
                paddingRight:5
              }}
            >
              <Box sx={{maxWidth:800,                 marginLeft: "auto",
                marginRight: "auto",
}}>
              <Grid container rowSpacing={1} sx={{ marginBottom: 5 }}>
                <Grid item xs={12} sm={5.4} sx={{ textAlign: "left" }} >
                  <Box sx={{ textAlign: "left" }} >
                    <Box sx={{ fontWeight: 500, fontSize: 23, paddingBottom: 0 }}>Stable Voting</Box>
                    <Avatar
                      alt="Logo"
                      sx={{
                        minWidth: "70px",
                        minHeight: "70px",
                        marginLeft: 4,
                        paddingTop: 1,
                        paddingBottom: 1,
                        textAlign: "center",
                        background: "inherit"
                      }}
                    >

                      <ReactVivus
                        id="logosvg_bottom2"
                        option={{
                          file: logo_grey,
                          animTimingFunction: "EASE",
                          type: "sync",
                        }}
                        style={{
                          height: "55px",
                          width: "55px",
                        }}
                      />

                    </Avatar>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={5.4}  >

                  <Box sx={{ textAlign: "left" }}>
                    <Box sx={{ marginTop: 1, marginBottom: 1 }}><RegLinkReact to="/create" sx={{ color: "white" }}>Create Poll</RegLinkReact></Box>
                    <Box sx={{ marginBottom: 1 }}><RegLinkReact to="/about">About</RegLinkReact></Box>
                    <Box sx={{ marginBottom: 1 }}><RegLinkReact to="/contact">Contact</RegLinkReact></Box>
                    <Box><RegLinkReact to="/faq">FAQ</RegLinkReact></Box>

                  </Box>

                </Grid>
                <Grid item xs={12} sm={1.2}  >
                  <Box sx={{ textAlign: "left" }}>
                    <Box sx={{ marginTop: 1, marginBottom: 1 }}><RegLinkReact to="/research">Research</RegLinkReact></Box>
                    <Box sx={{ marginBottom: 1 }}><RegLinkReact to="/demo">Demo</RegLinkReact></Box>
                    <Box sx={{ marginBottom: 1 }}><RegLinkReact to="/privacy">Privacy</RegLinkReact></Box>
                    <Box><RegLink
                      href="https://github.com/voting-tools/stablevoting-backend"
                      rel="noreferrer"
                      target="_blank"
                    >GitHub</RegLink></Box>


                  </Box>
                </Grid>

              </Grid>
              </Box>
            </Box>
          </Container>

          <Container disableGutters maxWidth={false} sx={{ padding: 0 }}>
            <Copyright />
          </Container>
        </Stack>
      </div>
    </footer>
  );
};

export default Footer;
