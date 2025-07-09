import React, { useState } from "react";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { API_URL } from "./helpers";
import { isValidEmail } from "./helpers";
import { COLORS } from "./helpers";
import { useNewPollState } from "./NewPollStore";

const Setting = ({ pollSetting, handlePollSetting, settingDescription }) => {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={handlePollSetting}>
        <ListItemIcon sx={{ minWidth: 0 }}>
          {pollSetting ? <CheckIcon color="primary" /> : <CloseIcon />}
        </ListItemIcon>
        <ListItemText>
          {pollSetting ? (
            <Box component="span" sx={{ fontSize: 20, marginLeft: 2 }}>
              {" "}
              {settingDescription}
            </Box>
          ) : (
            <Box
              component="span"
              sx={{
                color: COLORS.darkgrey,
                fontSize: 20,
                marginLeft: 2,
              }}
            >
              {settingDescription}
            </Box>
          )}
        </ListItemText>
      </ListItemButton>
    </ListItem>
  );
};
export const PollSettings = ({ handleReset, handleBack, handleNext }) => {
  const newPollState = useNewPollState();

  const [message, setMessage] = useState("");

  const [showProfile, setShowProfile] = useState(
    newPollState.show_rankings.get()
  );
  const [includeDescription, setIncludeDescription] = useState(
    newPollState.description.get() !== ""
  );
  const [pollDescription, setPollDescription] = useState(
    newPollState.description.get()
  );

  const [dateErrorText, setDateErrorText] = useState("");
  const [showGetDate, setShowGetDate] = useState(
    newPollState.closing_datetime.get() !== null
  );
  const [closingDate, setClosingDate] = useState(
    moment(newPollState.closing_datetime.get())
  );

  const [canViewResultsBeforeClosing, setCanViewResultsBeforeClosing] =
    useState(newPollState.can_view_outcome_before_closing.get());

  const [isPrivate, setIsPrivate] = useState(newPollState.is_private.get());
  const [emailList, setEmailList] = useState(
    newPollState.voter_emails.get().join(", ")
  );
  const [invalidEmail, setInvalidEmail] = useState("");

  const [showOutcome, setShowOutcome] = useState(
    newPollState.show_outcome.get()
  );
  

  const handleAddDescription = (event) => {
    var description = event.target.value;
    newPollState.merge({ description: description });
    setPollDescription(description);
  };

  const handleShowProfile = () => {
    newPollState.merge({ show_rankings: !showProfile });
    setShowProfile(!showProfile);
  };

  const handleShowOutcome = () => {
    if (showOutcome) {
      setCanViewResultsBeforeClosing(false);
    }
    newPollState.merge({ show_outcome: !showOutcome });
    setShowOutcome(!showOutcome);
  };

  const handleIsPrivate = () => {
    newPollState.merge({ is_private: !isPrivate });
    newPollState.merge({ voter_emails: [] });
    setEmailList("");
    setIsPrivate(!isPrivate);
  };

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
    newPollState.merge({ voter_emails: validEmails });
    setEmailList(emailListStr);
  };

  const handleClosingDate = (closingDate) => {
    const now = moment();
    console.log(closingDate);
    if (closingDate != null && closingDate.isBefore(now)) {
      setDateErrorText("closing date must be in the future");
    } else {
      setDateErrorText("");
    }
    newPollState.merge({
      closing_datetime: closingDate != null ? closingDate.toISOString() : null,
    });
    setClosingDate(closingDate);
  };

  const handleShowDate = () => {
    if (showGetDate) {
      newPollState.merge({ closing_datetime: null });
      setDateErrorText("");
      setClosingDate(null);
      setShowGetDate(false);
    } else {
      setShowGetDate(true);
    }
  };

  const handleViewResultsBeforeClosing = () => {
    newPollState.merge({
      can_view_outcome_before_closing: !canViewResultsBeforeClosing,
    });
    setCanViewResultsBeforeClosing(!canViewResultsBeforeClosing);
  };

  const sendPostRequest = async (newPost) => {
    console.log(newPost);
    try {
      const resp = await axios.post(`${API_URL}/polls/create/`, newPost);
      newPollState.merge({
        submitted: true,
        id: resp.data["id"],
        owner_id: resp.data["owner_id"],
      });
      handleNext();
    } catch (err) {
      setMessage("Server error: Poll not created");
      console.error(err);
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      setMessage("");
    }
    setMessage("");
  };

  const handleCreateElection = () => {
    if (
      newPollState.is_private.get() &&
      newPollState.voter_emails.get().length === 0
    ) {
      setInvalidEmail(
        "At least one valid email must be provided when the poll is private."
      );
      return;
    }

    sendPostRequest({
      title: newPollState.title.get(),
      description: newPollState.description.get(),
      candidates: newPollState.candidates.get(),
      voter_emails: newPollState.voter_emails.get(),
      is_private: newPollState.is_private.get(),
      show_rankings: newPollState.show_rankings.get(),
      show_outcome: newPollState.show_outcome.get(),
      closing_datetime:
        newPollState.closing_datetime.get() !== null
          ? newPollState.closing_datetime.get()
          : null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      can_view_outcome_before_closing:
        newPollState.can_view_outcome_before_closing.get(),
      put_unranked_candidates_at_bottom: newPollState.put_unranked_candidates_at_bottom.get(),
      num_candidates_to_rank: newPollState.num_candidates_to_rank.get(),
      allow_ties: newPollState.allow_ties.get(),
      });
  };
  return (
    <Box
      component="div"
      variant={"body1"}
      sx={{ fontSize: 20, p: 2, marginTop: 2 }}
    >
      <Stack spacing={1}>
        <div>
          <Box component="span" sx={{ fontWeight: 600 }}>
            Title:
          </Box>{" "}
          {newPollState.title.get()}
        </div>

        <div>
          There are {newPollState.candidates.get().length} candidates in this
          poll:
          {newPollState.candidates.get().map((cand, cidx) => (
            <Box key={cidx} sx={{ paddingLeft: 2, paddingTop: 1 }}>
              {`Candidate ${cidx + 1}:  ${cand}`}
            </Box>
          ))}
        </div>
        <div>
          <List>
            <Setting
              pollSetting={includeDescription}
              handlePollSetting={() =>
                setIncludeDescription(!includeDescription)
              }
              settingDescription="Include description of the poll."
            />
            <Collapse in={includeDescription}>
              <Box
                sx={{
                  padding: 2,
                  marginLeft: 5,
                  marginTop: 1,
                  backgroundColor: "inherit",
                  borderRadius: 2,
                }}
              >
                <TextField
                  id="poll-description"
                  label="Poll Description"
                  multiline
                  fullWidth
                  value={pollDescription}
                  onChange={handleAddDescription}
                  variant="standard"
                />
              </Box>
            </Collapse>
            <Setting
              pollSetting={isPrivate}
              handlePollSetting={handleIsPrivate}
              settingDescription="Make the poll private."
            />
            <Collapse in={isPrivate}>
              <Box
                sx={{
                  padding: 2,
                  marginLeft: 5,
                  marginTop: 1,
                  backgroundColor: "inherit",
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    padding: 0,
                    marginTop: 0,
                    marginBottom: 4,
                    backgroundColor: "inherit",
                  }}
                >
                  Only voters that you list below will be able to access the
                  poll. Give the list of emails for the voters that will
                  participate in the poll. Each voter will receive a unique link
                  to access the poll. Enter the emails separated by a comma, a
                  space or a newline. {/*<em>No emails will be saved.</em>*/}{" "}
                </Box>
                <Box
                  sx={{
                    width: "50%",
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
                    value={emailList}
                    onChange={handleEmailList}
                    variant="standard"
                  />
                </Box>
              </Box>
            </Collapse>
            <Setting
              pollSetting={showProfile}
              handlePollSetting={handleShowProfile}
              settingDescription="Show anonymized voter rankings."
            />

            <Setting
              pollSetting={showOutcome}
              handlePollSetting={handleShowOutcome}
              settingDescription="Voters can view poll results."
            />
            <Setting
              pollSetting={showGetDate}
              handlePollSetting={handleShowDate}
              settingDescription="Add a closing date for the poll."
            />
            <Collapse in={showGetDate}>
              <Box
                sx={{
                  padding: 3,
                  marginTop: 2,
                  marginLeft: 5,
                  backgroundColor: "inherit",
                  borderRadius: 2,
                }}
              >
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={dateErrorText.length > 0}
                        helperText={
                          dateErrorText && dateErrorText.length > 0
                            ? dateErrorText
                            : null
                        }
                      />
                    )}
                    label="Closing date & time"
                    value={closingDate}
                    onChange={(closingDate) => {
                      handleClosingDate(closingDate);
                    }}
                    minDate={moment().subtract(1, "day")}
                  />
                </LocalizationProvider>
                <Box sx={{marginTop:2}} />
                {showOutcome ? 
                <Setting
                  pollSetting={canViewResultsBeforeClosing}
                  handlePollSetting={handleViewResultsBeforeClosing}
                  settingDescription="Voters can view poll results before closing date."
                /> : <span />}
              </Box>
            </Collapse>


          </List>

          {/*<FormGroup>
            <FormControlLabel
              control={
                <Switch checked={showProfile} onChange={handleShowProfile} />
              }
              label={
                showProfile ? (
                  <Box component="span" sx={{ display:"box", fontSize: 20, marginLeft: 2 }}>
                    With the results, show not only the winner but also a ranking of the candidates, ranked according to who would win if higher-ranked candidates were no longer available to be chosen.
                  </Box>
                ) : (
                  <Box
                    component="span"
                    sx={{ color: COLORS.darkgrey, fontSize: 20, marginLeft: 2 }}
                  >
                    With the results, show not only the winner but also a ranking of the candidates, ranked according to who would win if higher-ranked candidates were no longer available to be chosen.
                  </Box>
                )
              }
            />
            </FormGroup>*/}
        </div>
        <Box
          sx={{ paddingTop: 8, display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            onClick={handleReset}
            sx={{
              paddingTop: 1,
              paddingBottom: 1,
              paddingLeft: 2,
              paddingRight: 2,
              marginRight: 1,
            }}
          >
            Reset Form
          </Button>
          <Button
            onClick={handleBack}
            sx={{
              paddingTop: 1,
              paddingBottom: 1,
              paddingLeft: 2,
              paddingRight: 2,
              marginRight: 1,
            }}
          >
            Back
          </Button>
          <Button
            id="create-poll-button"
            variant="contained"
            color="primary"
            sx={{ paddingLeft: 2, paddingRight: 2 }}
            onClick={handleCreateElection}
          >
            Create Poll
          </Button>
          <Snackbar
            open={message !== ""}
            autoHideDuration={4000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              {message}
            </Alert>
          </Snackbar>
        </Box>
      </Stack>
    </Box>
  );
};

export default PollSettings;
