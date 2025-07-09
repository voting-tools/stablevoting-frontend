import React, { useState } from 'react';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from 'moment';
import SettingsIcon from '@mui/icons-material/Settings';
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { StyledAccordion } from '../StyledAccordion';
import { isEmpty, canUpdatePoll, parseEmailList } from '../../../utils/pollUtils';

export const PollSettingsAccordion = ({ 
  currentPollData,
  updatedPollData,
  candList,
  showGetDate,
  closingDate,
  dateErrorText,
  onUpdatePollField,
  onUpdateCandList,
  onAddCandList,
  onRemoveCand,
  onReset,
  onUpdatePoll,
  onClosingDateChange,
  onShowDateToggle,
  expandedAccordion,
  setExpandedAccordion
}) => {
  const [emailList, setEmailList] = useState("");
  const [invalidEmail, setInvalidEmail] = useState("");

  const handleEmailList = (event) => {
    const emailListStr = event.target.value;
    const { validEmails, invalidEmails } = parseEmailList(emailListStr);
    
    if (invalidEmails.length > 0) {
      setInvalidEmail(
        "Only valid emails are saved. Invalid emails: " + invalidEmails.join(",")
      );
    } else {
      setInvalidEmail("");
    }
    
    onUpdatePollField("voter_emails", validEmails);
    setEmailList(emailListStr);
  };

  const handleClosingDate = (date) => {
    const now = moment();
    if (date.isBefore(now)) {
      onClosingDateChange(date, "closing date must be in the future");
    } else {
      onClosingDateChange(date, "");
    }
  };

  return (
    <StyledAccordion 
      icon={<SettingsIcon color="primary" />} 
      title="Update Poll Settings"
      accordionKey="settings"
      expandedAccordion={expandedAccordion}
      setExpandedAccordion={setExpandedAccordion}
    >
      <Box sx={{ p: 2 }}>
        <Stack spacing={3}>
          {updatedPollData !== null && updatedPollData["title"] !== undefined && (
            <TextField
              fullWidth
              error={updatedPollData !== null && isEmpty(updatedPollData["title"])}
              helperText={
                updatedPollData !== null && isEmpty(updatedPollData["title"])
                  ? "Please enter a title for the poll."
                  : ""
              }
              value={updatedPollData["title"]}
              onChange={(ev) => onUpdatePollField("title", ev.target.value)}
              label="Poll Title"
              variant="outlined"
            />
          )}

          {updatedPollData !== null && updatedPollData["description"] !== undefined && (
            <TextField
              fullWidth
              multiline
              rows={3}
              value={updatedPollData["description"]}
              onChange={(ev) => onUpdatePollField("description", ev.target.value)}
              label="Description"
              variant="outlined"
            />
          )}

          {updatedPollData !== null && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Candidates
              </Typography>
              {currentPollData["num_ballots"] === 0 ? (
                <Stack spacing={2}>
                  {candList.map((c, cidx) => (
                    <TextField
                      key={cidx}
                      fullWidth
                      value={c}
                      onChange={(ev) => onUpdateCandList(cidx, ev.target.value)}
                      label={`Candidate ${cidx + 1}`}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => onRemoveCand(cidx)}
                              edge="end"
                            >
                              <DeleteForeverIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  ))}
                  <Button
                    onClick={onAddCandList}
                    variant="outlined"
                    startIcon={<AddBoxOutlinedIcon />}
                    sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
                  >
                    Add Candidate
                  </Button>
                </Stack>
              ) : (
                <Alert severity="info">
                  Since voters have already submitted ballots, you cannot update the candidates.
                </Alert>
              )}
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={updatedPollData !== null && updatedPollData["is_private"]}
                  onChange={() => onUpdatePollField("is_private", !updatedPollData["is_private"])}
                />
              }
              label="Make the poll private"
            />
            <Collapse in={updatedPollData !== null && updatedPollData["is_private"]}>
              <Box sx={{ mt: 2, ml: 4 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Give the list of emails for the additional voters that will participate in the poll. 
                  No existing voters will be removed. Each voter will receive a unique link to access the poll. 
                  Enter the emails separated by a comma, a space or a newline. <em>No emails will be saved.</em>
                </Typography>
                <TextField
                  label="Email List"
                  multiline
                  fullWidth
                  rows={3}
                  error={invalidEmail.length > 0}
                  helperText={invalidEmail.length > 0 ? invalidEmail : null}
                  value={emailList}
                  onChange={handleEmailList}
                  variant="outlined"
                />
              </Box>
            </Collapse>
          </FormGroup>

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={updatedPollData !== null && updatedPollData["show_rankings"]}
                  onChange={() => onUpdatePollField("show_rankings", !updatedPollData["show_rankings"])}
                />
              }
              label="Show anonymized voter rankings"
            />
          </FormGroup>

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={showGetDate}
                  onChange={onShowDateToggle}
                />
              }
              label="Add a closing date for the poll"
            />
            <Collapse in={showGetDate}>
              <Box sx={{ mt: 2, ml: 4 }}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DateTimePicker
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={dateErrorText.length > 0}
                        helperText={dateErrorText && dateErrorText.length > 0 ? dateErrorText : null}
                      />
                    )}
                    label="Closing date & time"
                    value={closingDate}
                    onChange={handleClosingDate}
                    minDate={moment().subtract(1, "day")}
                  />
                </LocalizationProvider>
                <FormGroup sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        disabled={updatedPollData !== null && !updatedPollData["show_outcome"]}
                        checked={
                          updatedPollData !== null &&
                          updatedPollData["show_outcome"] &&
                          updatedPollData["can_view_outcome_before_closing"]
                        }
                        onChange={() =>
                          onUpdatePollField(
                            "can_view_outcome_before_closing",
                            !updatedPollData["can_view_outcome_before_closing"]
                          )
                        }
                      />
                    }
                    label="Voters can view poll results before closing date"
                  />
                </FormGroup>
              </Box>
            </Collapse>
          </FormGroup>

          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={updatedPollData !== null && updatedPollData["show_outcome"]}
                  onChange={() => {
                    onUpdatePollField("show_outcome", !updatedPollData["show_outcome"]);
                    onUpdatePollField(
                      "can_view_outcome_before_closing",
                      !updatedPollData["show_outcome"] && updatedPollData["can_view_outcome_before_closing"]
                    );
                  }}
                />
              }
              label="Anyone with the link can view the outcome"
            />
          </FormGroup>

          <Box sx={{ pt: 3 }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={onReset}
                sx={{ textTransform: "none" }}
              >
                Reset
              </Button>
              {canUpdatePoll(updatedPollData, candList) ? (
                <Button
                  variant="contained"
                  onClick={onUpdatePoll}
                  sx={{ textTransform: "none" }}
                >
                  Update Poll
                </Button>
              ) : (
                <Tooltip title="A title and at least two candidates is required for a poll.">
                  <span>
                    <Button
                      variant="contained"
                      disabled={true}
                      sx={{ textTransform: "none" }}
                    >
                      Update Poll
                    </Button>
                  </span>
                </Tooltip>
              )}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </StyledAccordion>
  );
};