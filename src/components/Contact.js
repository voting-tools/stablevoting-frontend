import React, { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
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
  const matches = useMediaQuery("(min-width:600px)");
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
      .post(`${API_URL}/emails/send_contact_form`, {
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
        marginTop: "50px",
        maxWidth:1000,
        paddingLeft:5, 
        paddingRight:5,
        marginBottom: 20
      }}
    >
        <Box
          sx={{
            marginLeft: "auto",
            marginRight: "auto",
            paddingTop:0,
          }}
        >
          <Stack spacing={5}>
          <Box           
          sx={{
            fontSize: "20px ",
          }}
>
        Please use the space below to report bugs or request features. If you leave your email address, we will respond as soon as possible. We look forward to hearing from you!
        </Box>

            <TextField
              value={name}
              label="Name"
              variant="outlined"
              onChange={(ev) => setName(ev.target.value)}
            />

            <TextField
              value={email}
              label="Email (Optional)"
              variant="outlined"
              error={!isEmpty(email) && !isValidEmail(email)}
              onChange={(ev) => setEmail(ev.target.value)}
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
                sx={{ fontSize: 18, width: "50%", marginTop: 2, textTransform:"none" }}
                variant="contained"
                disabled={(isEmpty(message) && isEmpty(email)) || (!isEmpty(message) && !isEmpty(email) && !isValidEmail(email)) || (isEmpty(message) &&  isValidEmail(email))}
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
