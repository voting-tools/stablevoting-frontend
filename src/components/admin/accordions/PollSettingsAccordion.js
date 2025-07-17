import React, { useState } from 'react';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from 'moment';
import SettingsIcon from '@mui/icons-material/Settings';
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { StyledAccordion } from '../StyledAccordion';
import { isEmpty, canUpdatePoll, parseEmailList } from '../../../utils/pollUtils';
import { COLORS } from "../../helpers";

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
  const [includeDescription, setIncludeDescription] = useState(
    updatedPollData?.description !== ""
  );

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
    
    onUpdatePollField("new_voter_emails", validEmails);
    setEmailList(emailListStr);
  };

  const handleClosingDate = (date) => {
    const now = moment();
    if (date != null && date.isBefore(now)) {
      onClosingDateChange(date, "closing date must be in the future");
    } else {
      onClosingDateChange(date, "");
    }
  };

  const handleViewResultsBeforeClosing = () => {
    onUpdatePollField(
      "can_view_outcome_before_closing",
      !updatedPollData["can_view_outcome_before_closing"]
    );
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

          <List>
            <Setting
              pollSetting={includeDescription}
              handlePollSetting={() => {
                setIncludeDescription(!includeDescription);
                if (includeDescription) {
                  onUpdatePollField("description", "");
                }
              }}
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
                  minRows={3}
                  maxRows={10}
                  value={updatedPollData?.description || ""}
                  onChange={(ev) => onUpdatePollField("description", ev.target.value)}
                  variant="standard"
                  helperText="Markdown formatting is supported"
                  placeholder="Enter your poll description here... You can use **bold**, *italic*, and other markdown formatting."
                />
                
                <Setting
                  pollSetting={updatedPollData?.hide_description || false}
                  handlePollSetting={() => onUpdatePollField("hide_description", !updatedPollData?.hide_description)}
                  settingDescription="Initially hide the poll description on the vote page. Users will be able to select a button to show the description."
                />
              </Box>
            </Collapse>

            {/* KEEPING CANDIDATES SECTION AS IS */}
            {updatedPollData !== null && (
              <Box sx={{ mt: 3, mb: 3 }}>
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

            <Setting
              pollSetting={updatedPollData?.is_private || false}
              handlePollSetting={() => {
                onUpdatePollField("is_private", !updatedPollData["is_private"]);
                onUpdatePollField("new_voter_emails", []);
                setEmailList("");
              }}
              settingDescription="Make the poll private."
            />
            <Collapse in={updatedPollData?.is_private}>
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
                  Give the list of emails for the additional voters that will participate in the poll. 
                  No existing voters will be removed. Each voter will receive a unique link to access the poll. 
                  Enter the emails separated by a comma, a space or a newline.
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
              pollSetting={updatedPollData?.show_rankings || false}
              handlePollSetting={() => onUpdatePollField("show_rankings", !updatedPollData["show_rankings"])}
              settingDescription="Show anonymized voter rankings."
            />

            <Setting
              pollSetting={updatedPollData?.show_outcome || false}
              handlePollSetting={() => {
                if (updatedPollData?.show_outcome) {
                  onUpdatePollField("can_view_outcome_before_closing", false);
                }
                onUpdatePollField("show_outcome", !updatedPollData["show_outcome"]);
              }}
              settingDescription="Voters can view poll results."
            />

            <Setting
              pollSetting={updatedPollData?.allow_multiple_votes || false}
              handlePollSetting={() => onUpdatePollField("allow_multiple_votes", !updatedPollData["allow_multiple_votes"])}
              settingDescription="Allow multiple votes from the same ip address."
            />

            <Setting
              pollSetting={showGetDate}
              handlePollSetting={onShowDateToggle}
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
                {updatedPollData?.show_outcome ? 
                <Setting
                  pollSetting={updatedPollData?.can_view_outcome_before_closing || false}
                  handlePollSetting={handleViewResultsBeforeClosing}
                  settingDescription="Voters can view poll results before closing date."
                /> : <span />}
              </Box>
            </Collapse>
          </List>

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