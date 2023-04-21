import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Box";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { isValidEmail } from "./helpers";
import { URL, API_URL } from "./helpers";
import { useNewPollState } from "./NewPollStore";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import moment from "moment";

export const PollLinks = ({ handleReset }) => {
  const newPollState = useNewPollState();
  const [emailList, setEmailList] = useState([]);
  const [emailListStr, setEmailListStr] = useState("");

  const [invalidEmail, setInvalidEmail] = useState("");

  const [ownerEmailList, setOwnerEmailList] = useState([]);
  const [ownerEmailListStr, setOwnerEmailListStr] = useState("");

  const [ownerInvalidEmail, setOwnerInvalidEmail] = useState("");

  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  async function copyLinkToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  const handleEmailList = (event) => {
    var emailListStr = event.target.value;

    var emails = emailListStr
      .split(" ")
      .join(",")
      .split("\n")
      .join(",")
      .split(",")
      .filter(String);
    var validEmails = [];
    var invalidEmails = [];
    for (var ei = 0; ei < emails.length; ei++) {
      if (isValidEmail(emails[ei])) {
        validEmails.push(emails[ei]);
      } else {
        invalidEmails.push(emails[ei]);
      }
    }
    if (invalidEmails.length > 0) {
      setInvalidEmail(
        "Only valid emails are saved.  Invalid emails: " +
          invalidEmails.join(",")
      );
    } else {
      setInvalidEmail("");
    }
    setEmailListStr(emailListStr);
    setEmailList(validEmails);
  };

  const handleOwnerEmails = (event) => {
    var emailListStr = event.target.value;

    var emails = emailListStr
      .split(" ")
      .join(",")
      .split("\n")
      .join(",")
      .split(",")
      .filter(String);
    var validEmails = [];
    var invalidEmails = [];
    for (var ei = 0; ei < emails.length; ei++) {
      if (isValidEmail(emails[ei])) {
        validEmails.push(emails[ei]);
      } else {
        invalidEmails.push(emails[ei]);
      }
    }
    if (invalidEmails.length > 0) {
      setOwnerInvalidEmail(
        "Only valid emails are saved.  Invalid emails: " +
          invalidEmails.join(",")
      );
    } else {
      setOwnerInvalidEmail("");
    }
    setOwnerEmailListStr(emailListStr);
    setOwnerEmailList(validEmails);
  };

  const voteUrl = `${URL}/vote/` + newPollState.id.get();
  const voteUrlOid =
    `${URL}/vote/` +
    newPollState.id.get() +
    "?oid=" +
    newPollState.owner_id.get();
  const voteLink = "/vote/" + newPollState.id.get();
  const resultsLink = "/results/" + newPollState.id.get();
  const resultsUrl = `${URL}/results/` + newPollState.id.get();
  const resultsLinkOid =
    "/results/" + newPollState.id.get() + "?oid=" + newPollState.owner_id.get();
  const resultsUrlOid =
    `${URL}/results/` +
    newPollState.id.get() +
    "?oid=" +
    newPollState.owner_id.get();
  const adminLink =
    "/admin/" + newPollState.id.get() + "?oid=" + newPollState.owner_id.get();
  const adminUrl =
    `${URL}/admin/` +
    newPollState.id.get() +
    "?oid=" +
    newPollState.owner_id.get();

  const handleSendEmails = () => {
    axios
      .post(
        `${API_URL}/emails/send_to_voters/${newPollState.id.get()}?oid=${newPollState.owner_id.get()}`,
        {
          emails: emailList,
          link: voteUrl,
          title: newPollState.title.get(),
          description: newPollState.description.get(),
        }
      )
      .then((resp) => {
        console.log(resp.data);
        console.log(emailList);
        console.log(
          "The vote link was sent to " +
            (emailList.length === 1
              ? "1 person."
              : emailList.length.toString() + " people.")
        );
        setShowMessage(true);
        setMessage(
          "The vote link was sent to " +
            (emailList.length === 1
              ? "1 person."
              : emailList.length.toString() + " people.")
        );
      })
      .catch((err) => {
        console.log("ERROR");
        console.log(err.response.data.detail);
        setShowErrorMessage(true);
        setErrorMessage("Error sending email.");
      });
  };

  const handleSendOwnerEmail = () => {
    console.log(newPollState.closing_datetime.get());
    axios
      .post(
        `${API_URL}/emails/send_to_owner/${newPollState.id.get()}?oid=${newPollState.owner_id.get()}`,
        {
          emails: ownerEmailList,
          title: newPollState.title.get(),
          vote_link: voteUrlOid,
          results_link: resultsUrlOid,
          admin_link: adminUrl,
          is_private: newPollState.is_private.get(),
          closing_datetime:
            newPollState.closing_datetime.get() !== null
              ? moment(newPollState.closing_datetime.get()).format(
                  "MMMM Do YYYY, h:mm a"
                )
              : "none",
        }
      )
      .then((resp) => {
        setShowMessage(true);
        setMessage("Email sent.");
      })
      .catch((err) => {
        console.log("ERROR");
        console.log(err.response.data.detail);
        setShowErrorMessage(true);
        setErrorMessage("Error sending email.");
      });
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 10, marginBottom: 10 }}>
      <Stack spacing={6}>
        <Box sx={{ fontSize: 20 }}>
          {newPollState.is_private.get() ? (
            <Box sx={{ marginBottom: 1 }}>
              The poll is private. An email was sent to{" "}
              {newPollState.voter_emails.get().length === 1
                ? "1 person"
                : newPollState.voter_emails.get().length.toString() +
                  " people"}{" "}
              with{" "}
              {newPollState.voter_emails.get().length === 1
                ? "a personalized link"
                : "personalized links"}{" "}
              to vote in the poll.
            </Box>
          ) : (
            <>
              <Box sx={{ marginBottom: 1 }}>
                Anyone with the following link can vote in the poll.
              </Box>
              <Box sx={{ overflow: "scroll", paddingLeft: 4, paddingTop: 0 }}>
                <Link to={voteLink}>{voteUrl} </Link>{" "}
                <Tooltip title="Copy link">
                  <IconButton
                    sx={{ marginLeft: 2 }}
                    onClick={() => copyLinkToClipboard(voteUrl)}
                    aria-label="copy link"
                  >
                    <InsertLinkOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ marginTop: 4, marginLeft: 4 }}>
                <Box sx={{ marginBottom: 2 }}>
                  Send the above link to the following emails. Enter the emails
                  separated by a space, comma, or newline. <br />
                  <em>No emails will be saved.</em>
                </Box>
                <Box
                  sx={{
                    width: { xs: "100%", md: "50%" },
                    padding: 0,
                    marginTop: 0,
                    marginBottom: 4,
                    backgroundColor: "inherit",
                  }}
                >
                  <TextField
                    id="email-list"
                    label="Email List"
                    multiline
                    fullWidth
                    error={invalidEmail.length > 0}
                    helperText={invalidEmail.length > 0 ? invalidEmail : null}
                    value={emailListStr}
                    onChange={handleEmailList}
                    variant="standard"
                  />
                </Box>
                <Box>
                  <Button
                    sx={{ textTransform: "none", fontSize: 20 }}
                    variant="outlined"
                    disabled={emailList.length === 0}
                    onClick={handleSendEmails}
                  >
                    Send Email
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
        <Box sx={{ fontSize: 20 }}>
          {!newPollState.show_outcome.get() ? (
            <>
              <Box sx={{ marginBottom: 1 }}>
                The results of the poll is hidden from the voters. You can
                access the results of the poll using the following link.
              </Box>
              <Box sx={{ overflow: "scroll", paddingLeft: 4, paddingTop: 0 }}>
                <Link to={resultsLinkOid}>{resultsUrlOid} </Link>
                <Tooltip title="Copy link">
                  <IconButton
                    variant="outlined"
                    sx={{ marginLeft: 2 }}
                    onClick={() => copyLinkToClipboard(resultsUrlOid)}
                    aria-label="copy link"
                  >
                    <InsertLinkOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          ) : (
            <>
              {" "}
              <Box sx={{ marginBottom: 1 }}>
                The poll results can be viewed using the following link.{" "}
                {newPollState.closing_datetime.get() != null &&
                !newPollState.can_view_outcome_before_closing.get()
                  ? "The voters will not be able to view the outcome of the poll until it closes on " +
                    moment(newPollState.closing_datetime.get()).format(
                      "MMMM Do YYYY, h:mm a"
                    )
                  : ""}
              </Box>
              <Box sx={{ paddingLeft: 4, paddingTop: 0 }}>
                <Link to={resultsLink}>{resultsUrl} </Link>
                <Tooltip title="Copy link">
                  <IconButton
                    variant="outlined"
                    sx={{ marginLeft: 2 }}
                    onClick={() => copyLinkToClipboard(resultsUrl)}
                    aria-label="copy link"
                  >
                    <InsertLinkOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          )}
        </Box>
        <Box sx={{ fontSize: 20 }}>
          <Box sx={{ marginBottom: 1 }}>
            You can manage the poll using the following link.
          </Box>
          <Box sx={{ paddingLeft: 4, paddingTop: 0 }}>
            <Link to={adminLink}>{adminUrl} </Link>{" "}
            <Tooltip title="Copy link">
              <IconButton
                sx={{ marginLeft: 2 }}
                onClick={() => copyLinkToClipboard(adminUrl)}
                aria-label="copy link"
              >
                <InsertLinkOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ marginTop: 4, marginLeft: 4 }}>
          <Box sx={{ marginBottom: 2 }}>
            Send the above links to an email. <em>No emails will be saved.</em>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              padding: 0,
              marginTop: 0,
              marginBottom: 4,
              backgroundColor: "inherit",
            }}
          >
            <TextField
              id="email-list"
              label="Email List"
              multiline
              fullWidth
              error={ownerInvalidEmail.length > 0}
              helperText={
                ownerInvalidEmail.length > 0 ? ownerInvalidEmail : null
              }
              value={ownerEmailListStr}
              onChange={handleOwnerEmails}
              variant="standard"
            />
          </Box>
          <Box>
            <Button
              sx={{ textTransform: "none", fontSize: 20 }}
              variant="outlined"
              disabled={ownerEmailList.length === 0}
              onClick={handleSendOwnerEmail}
            >
              Send Email
            </Button>
          </Box>
        </Box>

        <Box
          sx={{ marginTop: 4, display: "flex", justifyContent: "flex-start" }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ paddingLeft: 2, paddingRight: 2 }}
            onClick={handleReset}
          >
            Create a new poll
          </Button>
        </Box>
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showErrorMessage}
        autoHideDuration={3000}
        onClose={() => setShowErrorMessage(false)}
      >
        <Alert
          onClose={() => setShowErrorMessage(false)}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showMessage}
        autoHideDuration={3000}
        onClose={() => setShowMessage(false)}
      >
        <Alert
          onClose={() => setShowMessage(false)}
          severity="info"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PollLinks;
