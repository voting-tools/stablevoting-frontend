import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { COLORS_RGB } from "./helpers";

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
        }}
      >
        <Container maxWidth="md" sx={{ padding: 10 }}>
          <Box
            sx={{
              width: "100%",
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
            }}
          >
            <Stack spacing={1}>
              <Typography variant="body1" color="inherit">
                <a
                  href="https://sites.google.com/site/wesholliday"
                  target="_blank"
                  style={{
                    "&:hover": {
                      textDecoration: "underline !important",
                      color: "white",
                    },
                    textDecoration: "underline",
                    color: "white",
                    display: "inline-block",
                  }}
                >
                  Wesley H. Holliday
                </a>
                &nbsp;and&nbsp;
                <a
                  href="https://pacuit.org"
                  target="_blank"
                  style={{
                    "&:hover": {
                      textDecoration: "underline !important",
                      color: "white",
                    },
                    textDecoration: "underline",
                    color: "white",
                    display: "inline-block",
                  }}
                >
                  Eric Pacuit{" "}
                </a>
              </Typography>
            </Stack>
          </Box>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
