import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { API_URL, isValidEmail } from "./helpers";

export const Contact = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState(false);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const sendMessage = (data) => {
    axios
      .post(`${API_URL}/sendmessage`, {
        name: name,
        email: email,
        message: message,
      })
      .then((resp) => {
        setServerError(false);
        setServerMessage(
          "Message sent.  If you provided an email, then we will get back to you as soon as possible."
        );
      })
      .catch((err) => {
        console.log(err.response.data.detail);
        setServerError(true);
        setServerMessage(err.response.data.detail);
      });
  };
  const isEmpty = (s) => s.replace(/\s/g, "") === "";
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
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: 1000,
            my: { xs: 3, md: 6 },
            p: { xs: 5, md: 7 },
          }}
        >
          <Stack spacing={5}>
            <TextField
              value={name}
              label="Name"
              onChange={(ev) => setName(ev.target.value)}
              variant="standard"
            />

            <TextField
              value={email}
              label="Email"
              error={!isEmpty(email) && !isValidEmail(email)}
              onChange={(ev) => setEmail(ev.target.value)}
              variant="standard"
            />
            <TextField
              value={message}
              multiline
              variant="outlined"
              minRows={4}
              label="Message"
              onChange={(ev) => setMessage(ev.target.value)}
            />
            <Box
              sx={{
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
              }}
            >
              <Button
                sx={{ fontSize: 16, width: "50%", marginTop: 2 }}
                variant="contained"
                disabled={message.replace(/\s/g, "") === ""}
                onClick={sendMessage}
              >
                {" "}
                Send Message
              </Button>
            </Box>
            <Collapse in={serverMessage !== ""}>
              <Alert
                severity={serverError ? "error" : "info"}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setServerError(false);
                      setServerMessage("");
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mt: 4, mb: 2 }}
              >
                {serverMessage}
              </Alert>
            </Collapse>
          </Stack>
        </Box>
      </Container>
    </div>
  );
};

export default Contact;
