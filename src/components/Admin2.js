import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import DownloadIcon from '@mui/icons-material/Download';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import AlertTitle from "@mui/material/AlertTitle";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from 'moment-timezone';
import Fab from "@mui/material/Fab";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axios from "axios";
import { CSVLink } from "react-csv";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";

// Import icons for better visual hierarchy
import PollIcon from '@mui/icons-material/Poll';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import BarChartIcon from '@mui/icons-material/BarChart';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CodeIcon from '@mui/icons-material/Code';

import { useParams, useSearchParams } from "react-router-dom";
import { COLORS, URL, API_URL } from "./helpers";
import { isValidEmail } from "./helpers";

import Profile from "./Profile";
import { Typography } from "@mui/material";
// Import EmbedTool
import EmbedTool from "./EmbedTool";

// Modern File Upload Component to replace react-material-file-upload
const FileUpload = ({
  value,
  onChange,
  title = "Upload File",
  buttonText = "Choose File",
  accept = ".csv",
  maxSize = 10 * 1024 * 1024, // 10MB default
}) => {
  const [error, setError] = useState('');

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setError('');

    // Validate file size
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError(`File too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
      return;
    }

    onChange(selectedFiles);
    event.target.value = '';
  };

  const handleRemoveFile = () => {
    onChange(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
        {title}
      </Typography>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id="file-upload-input"
        type="file"
        onChange={handleFileSelect}
      />
      <label htmlFor="file-upload-input">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
          fullWidth
          sx={{ 
            justifyContent: 'flex-start',
            textTransform: 'none',
            borderStyle: 'dashed',
            borderWidth: 2,
            py: 2,
            '&:hover': {
              borderStyle: 'dashed',
              borderWidth: 2,
            }
          }}
        >
          {buttonText}
        </Button>
      </label>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {value && value.length > 0 && (
        <Paper variant="outlined" sx={{ mt: 2, p: 1 }}>
          <List dense>
            <ListItem>
              <InsertDriveFileIcon sx={{ mr: 2, color: 'text.secondary' }} />
              <ListItemText
                primary={value[0].name}
                secondary={formatFileSize(value[0].size)}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={handleRemoveFile}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>
      )}
    </Box>
  );
};

export const Admin = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showNotFoundMessage, setShowNotFoundMessage] = useState(false);
  const [showNotOwnerMessage, setNotOwnerMessage] = useState(false);
  const [rankingsFile, setRankingsFile] = useState(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [overwriteBallots, setOverWriteBallots] = useState(false);
  const [currentPollData, setCurrentPollData] = useState({});
  const [updatedPollData, setUpdatedPollData] = useState({});
  const navigate = useNavigate();
  const [emailList, setEmailList] = useState([]);
  const [invalidEmail, setInvalidEmail] = useState("");
  const [addVoterEmailList, setVoterEmailList] = useState([]);
  const [invalidAdvoterEmail, setInvalidAdvoterEmail] = useState("");
  const [dateErrorText, setDateErrorText] = useState("");
  const [showGetDate, setShowGetDate] = useState(false);
  const [closingDate, setClosingDate] = useState(null);
  const [candList, setCandList] = useState([]);
  const [columns, setColumns] = useState([[]]);
  const [numRows, setNumRows] = useState(0);
  const [cmap, setCmap] = useState({});
  const [submittedRankingInfo, setSubmittedRankingInfo] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState(false);
  const [loadingRankings, setLoadingRankings] = useState(false);

  const id = params.id;
  const oid = searchParams.get("oid");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    axios
      .get(`${API_URL}/polls/data/${id}?oid=${oid}`)
      .then((resp) => {
        console.log(resp);
        setCurrentPollData(resp.data);
        if (!resp.data["is_owner"]) {
          setNotOwnerMessage(true);
        } else {
          setCurrentPollData({ ...resp.data });
          setUpdatedPollData({ ...resp.data });
          setCandList([...resp.data["candidates"]]);
          setDateErrorText("");
          if (
            resp.data["closing_datetime"] !== "" &&
            resp.data["closing_datetime"] !== null
          ) {
            setClosingDate(moment(resp.data["closing_datetime"]));
            setShowGetDate(true);
          }
        }
      })
      .catch((err) => {
        console.log("Error loading poll data");
        if (err.response && err.response.data && err.response.data.detail) {
          console.log(err.response.data.detail);
        } else {
          console.log(err);
        }
        setShowNotFoundMessage(true);
      });
  }, [id, oid]);

  async function reload() {
    axios
      .get(`${API_URL}/polls/data/${id}?oid=${oid}`)
      .then((resp) => {
        setCurrentPollData(resp.data);
        if (!resp.data["is_owner"]) {
          setNotOwnerMessage(true);
        } else {
          console.log(resp.data);
          setCurrentPollData({ ...resp.data });
          setUpdatedPollData({ ...resp.data });
          setCandList([...resp.data["candidates"]]);
          setDateErrorText("");
          if (
            resp.data["closing_datetime"] !== "" &&
            resp.data["closing_datetime"] !== null
          ) {
            setClosingDate(moment(resp.data["closing_datetime"]));
            setShowGetDate(true);
          }
        }
      })
      .catch((err) => {
        console.log("Error reloading poll data");
        if (err.response && err.response.data && err.response.data.detail) {
          console.log(err.response.data.detail);
        } else {
          console.log(err);
        }
        setShowNotFoundMessage(true);
      });
      
    if (expandedAccordion === "rankings") {
      handleGetSubmittedRankingInfo();
    }
  }
  
  async function copyLinkToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  const updatePollField = (fieldname, val) => {
    console.log("Update Poll Field")
    console.log(fieldname)
    console.log(val)
    var updatedPoll = updatedPollData;
    updatedPoll[fieldname] = val;
    console.log(updatedPoll)
    setUpdatedPollData({ ...updatedPoll });
  };

  const handleUpdateCandList = (cIdx, newCand) => {
    var newCands = candList;
    newCands[cIdx] = newCand;
    setCandList([...newCands]);
  };

  const handleAddCandList = () => {
    var newCands = candList;
    newCands.push("");
    setCandList([...newCands]);
  };

  const handleRemoveCand = (cIdx) => {
    var newCands = candList;
    newCands.splice(cIdx, 1);
    setCandList([...newCands]);
  };

  const handleReset = () => {
    console.log("RESET");
    console.log(currentPollData);
    setUpdatedPollData({ ...currentPollData });
    setCandList([...currentPollData["candidates"]]);
    if (
      currentPollData["closing_datetime"] !== "" &&
      currentPollData["closing_datetime"] !== null
    ) {
      setClosingDate(moment(currentPollData["closing_datetime"]));
      setShowGetDate(true);
    } else {
      setClosingDate(null);
      setShowGetDate(false);
    }
  };

  const canUpdatePoll = () => {
    var nonNullCands = candList.filter((c) => !isEmpty(c));
    return (
      updatedPollData !== null &&
      !isEmpty(updatedPollData["title"]) &&
      nonNullCands.length >= 2
    );
  };
  
  const handleUpdatePoll = () => {
    var nonNullCands = candList.filter((c) => !isEmpty(c));
    var updatedPoll = {
      title: updatedPollData["title"],
      description: updatedPollData["description"],
      candidates: nonNullCands,
      is_private: updatedPollData["is_private"],
      voter_emails: updatedPollData["voter_emails"],
      show_rankings: updatedPollData["show_rankings"],
      closing_datetime: closingDate !== null ? closingDate.toISOString() : "del",
      timezone: updatedPollData["timezone"],
      show_outcome: updatedPollData["show_outcome"],
      can_view_outcome_before_closing: updatedPollData["can_view_outcome_before_closing"]
    };
    axios
      .post(`${API_URL}/polls/update/${id}?oid=${oid}`, updatedPoll)
      .then((resp) => {
        console.log(resp.data);
        setShowMessage(true);
        setMessage("Poll updated.");
        // Update the current data without reloading the whole page
        setCurrentPollData(prev => ({
          ...prev,
          ...updatedPoll,
          candidates: nonNullCands,
          closing_datetime: closingDate ? closingDate.toISOString() : null
        }));
      })
      .catch((err) => {
        console.log("ERROR");
        console.log(err.response.data.detail);
        setShowErrorMessage(true);
        setErrorMessage(err.response.data.detail);
      });
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
    updatePollField("voter_emails", validEmails);
    setEmailList(emailListStr);
  };

  const handleAddVoterEmailList = (event) => {
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
      setInvalidAdvoterEmail(
        "Only valid emails are saved.  Invalid emails: " +
        invalidEmails.join(",")
      );
    } else {
      setInvalidAdvoterEmail("");
    }
    setVoterEmailList(emailListStr);
  };

  const handleAddVoters = () => {
    console.log("handle add voters")
    console.log(addVoterEmailList.split(","))
    var updatedPoll = {
      is_private: true,
      new_voter_emails: addVoterEmailList.split(","),
    };
    axios
      .post(`${API_URL}/polls/update/${id}?oid=${oid}`, updatedPoll)
      .then((resp) => {
        console.log(resp.data);
        setShowMessage(true);
        setMessage(
          `Added ${addVoterEmailList.split(",").length} voters to the poll.`
        );
        // Clear the voter email list after successful addition
        setVoterEmailList("");
        // Update the voter count if available in response
        if (resp.data.num_invited_voters !== undefined) {
          setCurrentPollData(prev => ({
            ...prev,
            num_invited_voters: resp.data.num_invited_voters
          }));
        }
      })
      .catch((err) => {
        console.log("ERROR");
        console.log(err.response.data.detail);
        setShowErrorMessage(true);
        setErrorMessage(err.response.data.detail);
      });
  };

  const handleClosingDate = (closingDate) => {
    const now = moment();
    if (closingDate.isBefore(now)) {
      setDateErrorText("closing date must be in the future");
    } else {
      setDateErrorText("");
    }
    updatePollField("closing_datetime", closingDate.toISOString());
    setClosingDate(closingDate);
  };

  const handleShowDate = () => {
    if (showGetDate) {
      updatePollField("closing_datetime", null);
      setDateErrorText("");
      setClosingDate(null);
      setShowGetDate(false);
    } else {
      setShowGetDate(true);
    }
  };

  const candListToRankedStr = (candArr) => {
    if (candArr.length === 0) {
      return "";
    }
    if (candArr.length === 1) {
      return (
        "The candidate " +
        candArr[0].toString() +
        " has not been ranked by any voters."
      );
    } else if (candArr.length === 2) {
      return (
        "The candidates " +
        candArr[0].toString() +
        " and " +
        candArr[1].toString() +
        " have not been ranked by any voters."
      );
    } else if (candArr.length > 2) {
      var lastCand = candArr[candArr.length - 1];
      return (
        "The candidates " +
        candArr.slice(0, -1).join(", ") +
        ", and " +
        lastCand.toString() +
        " have not been ranked by any voters."
      );
    }
  };

  const handleDeletePoll = () => {
    axios
      .delete(`${API_URL}/polls/delete/${id}?oid=${oid}`)
      .then((resp) => {
        console.log(resp.data);
        setDeleteMessage(true);
      })
      .catch((err) => {
        console.log("ERROR deleting poll");
        if (err.response && err.response.data && err.response.data.detail) {
          console.log(err.response.data.detail);
          setShowErrorMessage(true);
          setErrorMessage(err.response.data.detail);
        } else if (err.message) {
          console.log(err.message);
          setShowErrorMessage(true);
          setErrorMessage("Failed to delete poll");
        } else {
          console.log(err);
          setShowErrorMessage(true);
          setErrorMessage("An unexpected error occurred");
        }
      });
  };

  const handleClosePoll = () => {
    const now = moment();
    axios
      .post(`${API_URL}/polls/update/${id}?oid=${oid}`, {
        closing_datetime: now.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        is_completed: true
      })
      .then((resp) => {
        console.log(resp.data);
        setShowMessage(true);
        setMessage("The poll is no longer accepting votes.");
        // Update local state
        setCurrentPollData(prev => ({
          ...prev,
          is_completed: true,
          is_closed: true,
          closing_datetime: now.toISOString()
        }));
        setUpdatedPollData(prev => ({
          ...prev,
          is_completed: true,
          is_closed: true,
          closing_datetime: now.toISOString()
        }));
      })
      .catch((err) => {
        console.log("ERROR closing poll");
        if (err.response && err.response.data && err.response.data.detail) {
          console.log(err.response.data.detail);
          setShowErrorMessage(true);
          setErrorMessage(err.response.data.detail);
        } else {
          console.log(err);
          setShowErrorMessage(true);
          setErrorMessage("Failed to close poll");
        }
      });
  };

  const handleOpenPoll = () => {
    axios
      .post(`${API_URL}/polls/update/${id}?oid=${oid}`, {
        closing_datetime: "del",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        is_completed: false
      })
      .then((resp) => {
        console.log(resp.data);
        setShowMessage(true);
        setMessage("The poll is now accepting votes.");
        // Update local state
        setCurrentPollData(prev => ({
          ...prev,
          is_completed: false,
          is_closed: false,
          closing_datetime: null
        }));
        setUpdatedPollData(prev => ({
          ...prev,
          is_completed: false,
          is_closed: false,
          closing_datetime: null
        }));
        setClosingDate(null);
        setShowGetDate(false);
      })
      .catch((err) => {
        console.log("ERROR opening poll");
        if (err.response && err.response.data && err.response.data.detail) {
          console.log(err.response.data.detail);
          setShowErrorMessage(true);
          setErrorMessage(err.response.data.detail);
        } else {
          console.log(err);
          setShowErrorMessage(true);
          setErrorMessage("Failed to open poll");
        }
      });
  };

  const handleAddBulkRankings = () => {
    if (rankingsFile === null || rankingsFile.length === 0) {
      setShowErrorMessage(true);
      setErrorMessage("You must upload a csv file with the rankings.");
      return;
    }
    var formData = new FormData();
    formData.append("csv_file", rankingsFile[0], rankingsFile[0].name);
    formData.append("overwrite", overwriteBallots);
    const headers = { "Content-Type": rankingsFile[0].type };
    axios
      .post(
        `${API_URL}/polls/bulk_vote/${id}?oid=${oid}&overwrite=${overwriteBallots}`,
        formData,
        headers
      )
      .then((resp) => {
        console.log(resp.data);
        setShowMessage(true);
        setMessage(resp.data["success"]);
        // Clear the file after successful upload
        setRankingsFile(null);
        // If submitted rankings info was open, refresh it
        if (expandedAccordion === "rankings") {
          handleGetSubmittedRankingInfo();
        }
      })
      .catch((err) => {
        console.log("ERROR uploading bulk rankings");
        if (err.response && err.response.data && err.response.data.detail) {
          console.log(err.response.data.detail);
          setShowErrorMessage(true);
          setErrorMessage(err.response.data.detail);
        } else {
          console.log(err);
          setShowErrorMessage(true);
          setErrorMessage("Failed to upload rankings. Please check the CSV format.");
        }
      });
  };

  const handleGetSubmittedRankingInfo = () => {
    console.log("Get submitted ranking info...");
    axios
      .get(`${API_URL}/polls/submitted_rankings/${id}?oid=${oid}`)
      .then((resp) => {
        console.log(resp.data);
        setColumns(resp.data.columns);
        setNumRows(resp.data.num_rows);
        setSubmittedRankingInfo(resp.data);
        setCmap(resp.data.cmap);
      })
      .catch((err) => {
        console.log("ERROR getting submitted rankings");
        // Safely access error details
        if (err.response && err.response.data && err.response.data.detail) {
          console.log(err.response.data.detail);
          setShowErrorMessage(true);
          setErrorMessage(err.response.data.detail);
        } else if (err.message) {
          console.log(err.message);
          setShowErrorMessage(true);
          setErrorMessage("Failed to load submitted rankings");
        } else {
          console.log(err);
          setShowErrorMessage(true);
          setErrorMessage("An unexpected error occurred");
        }
        // Set default empty data to prevent UI errors
        setSubmittedRankingInfo({
          num_voters: 0,
          unranked_candidates: [],
          num_empty_ballots: 0,
          csv_data: [],
          columns: [],
          num_rows: 0,
          cmap: {}
        });
      });
  };
  
  const isEmpty = (s) => s !== undefined && s.replace(/\s/g, "") === "";

  const voteUrl = `${URL}/vote/` + id;
  const voteLink = "/vote/" + id;
  const resultsLinkOid = "/results/" + id + "?oid=" + oid;
  const resultsUrlOid = `${URL}/results/` + id + "?oid=" + oid;

  // Custom styled accordion with better visual hierarchy
  const StyledAccordion = ({ icon, title, children, accordionKey, onExpand, ...props }) => {
    const isExpanded = expandedAccordion === accordionKey;
    
    return (
      <Accordion 
        {...props}
        expanded={isExpanded}
        onChange={(event, expanded) => {
          setExpandedAccordion(expanded ? accordionKey : false);
          if (expanded && onExpand) {
            onExpand();
          }
          if (props.onChange) props.onChange(event, expanded);
        }}
        sx={{ 
          mb: 1,
          '&:before': { display: 'none' },
          boxShadow: 'none',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            borderColor: 'primary.main',
          }
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            '& .MuiAccordionSummary-content': {
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }
          }}
        >
          {icon}
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          {children}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <div>
      <Container
        maxWidth="lg"
        sx={{
          fontSize: 18,
          py: 5,
          px: { xs: 2, md: 3 }
        }}
      >
        {showNotFoundMessage || showNotOwnerMessage ? (
          <Alert severity={showNotFoundMessage ? "error" : "warning"}>
            <AlertTitle>
              {showNotFoundMessage ? "Poll not found." : "Not a owner."}
            </AlertTitle>
            {showNotFoundMessage
              ? `There is no poll with the id ${id}`
              : `You must use the link provided when creating the poll to access this page.`}
          </Alert>
        ) : (
          <Stack spacing={4}>
            {/* Header Card */}
            {currentPollData !== null && (
              <Card elevation={0} sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        {currentPollData["title"]}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Created on {currentPollData["creation_dt"]}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                    <Chip 
                      icon={currentPollData["is_closed"] || currentPollData["is_completed"] ? <LockIcon /> : <LockOpenIcon />} 
                      label={currentPollData["is_closed"] || currentPollData["is_completed"] ? "Closed" : "Open"} 
                      color={currentPollData["is_closed"] || currentPollData["is_completed"] ? "default" : "success"}
                      variant="outlined"
                    />
                    {currentPollData["is_private"] && (
                      <Chip 
                        icon={<LockIcon />} 
                        label="Private" 
                        color="secondary"
                        variant="outlined"
                      />
                    )}
                    {currentPollData["num_ballots"] > 0 && (
                      <Chip 
                        icon={<PeopleIcon />} 
                        label={`${currentPollData["num_ballots"]} votes`} 
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Main Content - Reordered Accordions */}
            <Box>
              {/* 1. Poll Status */}
              <StyledAccordion 
                icon={currentPollData["is_closed"] || currentPollData["is_completed"] ? <LockIcon color="error" /> : <LockOpenIcon color="success" />} 
                title={`Poll Status: ${currentPollData["is_closed"] || currentPollData["is_completed"] ? "Closed" : "Open"}`}
                accordionKey="status"
              >
                <Box sx={{ p: 2 }}>
                  <Alert severity={currentPollData["is_closed"] || currentPollData["is_completed"] ? "warning" : "success"} sx={{ mb: 3 }}>
                    The poll {(currentPollData["is_closed"] || currentPollData["is_completed"]) ? "is not " : "is "} currently accepting votes.
                    {currentPollData["closing_datetime"] === null
                      ? " There is no closing date for this poll."
                      : ` The closing date for this poll ${currentPollData["is_closed"] || currentPollData["is_completed"] ? "was" : "is"} ${moment(
                          currentPollData["closing_datetime"]
                        ).format("MMMM Do YYYY, h:mm a")}`}
                  </Alert>
                  {(currentPollData["is_closed"] || currentPollData["is_completed"]) ? (
                    <Button
                      onClick={handleOpenPoll}
                      variant="contained"
                      color="success"
                      startIcon={<LockOpenIcon />}
                      sx={{ textTransform: "none" }}
                    >
                      Open Poll
                    </Button>
                  ) : (
                    <Button
                      onClick={handleClosePoll}
                      variant="contained"
                      color="error"
                      startIcon={<LockIcon />}
                      sx={{ textTransform: "none" }}
                    >
                      Close Poll
                    </Button>
                  )}
                </Box>
              </StyledAccordion>

              {/* 2. Update Poll Settings */}
              <StyledAccordion 
                icon={<SettingsIcon color="primary" />} 
                title="Update Poll Settings"
                accordionKey="settings"
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
                        onChange={(ev) => updatePollField("title", ev.target.value)}
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
                        onChange={(ev) => updatePollField("description", ev.target.value)}
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
                                onChange={(ev) => handleUpdateCandList(cidx, ev.target.value)}
                                label={`Candidate ${cidx + 1}`}
                                variant="outlined"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        onClick={() => handleRemoveCand(cidx)}
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
                              onClick={handleAddCandList}
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
                            onChange={() => updatePollField("is_private", !updatedPollData["is_private"])}
                          />
                        }
                        label="Make the poll private"
                      />
                      <Collapse in={updatedPollData !== null && updatedPollData["is_private"]}>
                        <Box sx={{ mt: 2, ml: 4 }}>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            Give the list of emails for the additional voters that will participate in the poll. No existing voters will be removed. Each voter will receive a unique link to access the poll. Enter the emails separated by a comma, a space or a newline. <em>No emails will be saved.</em>
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
                            onChange={() => updatePollField("show_rankings", !updatedPollData["show_rankings"])}
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
                            onChange={handleShowDate}
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
                              onChange={(closingDate) => {
                                handleClosingDate(closingDate);
                              }}
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
                                    updatePollField(
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
                              updatePollField("show_outcome", !updatedPollData["show_outcome"]);
                              updatePollField(
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
                          onClick={handleReset}
                          sx={{ textTransform: "none" }}
                        >
                          Reset
                        </Button>
                        {canUpdatePoll() ? (
                          <Button
                            variant="contained"
                            onClick={handleUpdatePoll}
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

              {/* 3. Vote in Poll */}
              <StyledAccordion 
                icon={<HowToVoteIcon color="primary" />} 
                title="Vote in Poll"
                accordionKey="vote"
              >
                {currentPollData !== null && !currentPollData["is_private"] ? (
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      Use the following link to vote in the poll.
                    </Typography>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        display: 'flex', 
                        alignItems: 'center',
                        bgcolor: 'grey.50',
                        borderRadius: 2
                      }}
                    >
                      <Link to={voteLink} style={{ flex: 1, wordBreak: 'break-all' }}>
                        {voteUrl}
                      </Link>
                      <Tooltip title="Copy link">
                        <IconButton
                          onClick={() => copyLinkToClipboard(voteUrl)}
                          color="primary"
                        >
                          <InsertLinkOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    </Paper>
                  </Box>
                ) : (
                  <Box sx={{ p: 2 }}>
                    <Alert severity="info" icon={<LockIcon />}>
                      The poll is private: {currentPollData["num_invited_voters"] === 1 ? "1 person has" : currentPollData["num_invited_voters"].toString() + " people have"} been invited to vote in the poll. Each voter has received a unique link to vote in the poll.
                    </Alert>
                  </Box>
                )}
              </StyledAccordion>

              {/* Add Voters accordion for private polls */}
              {currentPollData !== null && currentPollData["is_private"] && !currentPollData["is_completed"] && !currentPollData["is_closed"] && (
                <StyledAccordion 
                  icon={<PeopleIcon color="primary" />} 
                  title="Add Voters"
                  accordionKey="add-voters"
                >
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      Give the list of emails for the additional voters that
                      will participate in the poll. No existing voters will be removed. Each voter will receive a unique link to access the poll. Enter the emails separated by a comma, a space or a newline. <em>No emails will be saved.</em>
                    </Typography>
                    <TextField
                      id="email-list"
                      label="Email List"
                      multiline
                      fullWidth
                      rows={4}
                      error={invalidAdvoterEmail.length > 0}
                      helperText={
                        invalidAdvoterEmail.length > 0
                          ? invalidAdvoterEmail
                          : null
                      }
                      value={addVoterEmailList}
                      onChange={handleAddVoterEmailList}
                      variant="outlined"
                      sx={{ mb: 3 }}
                    />
                    <Button
                      variant="contained"
                      disabled={addVoterEmailList.length === 0}
                      onClick={handleAddVoters}
                      startIcon={<PeopleIcon />}
                      sx={{ textTransform: "none" }}
                    >
                      Add Voters
                    </Button>
                  </Box>
                </StyledAccordion>
              )}

              {/* 4. View Results */}
              <StyledAccordion 
                icon={<BarChartIcon color="primary" />} 
                title="View Results"
                accordionKey="results"
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Use the following link to view the results of the poll.
                  </Typography>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: 'grey.50',
                      borderRadius: 2
                    }}
                  >
                    <Link to={resultsLinkOid} style={{ flex: 1, wordBreak: 'break-all' }}>
                      {resultsUrlOid}
                    </Link>
                    <Tooltip title="Copy link">
                      <IconButton
                        onClick={() => copyLinkToClipboard(resultsUrlOid)}
                        color="primary"
                      >
                        <InsertLinkOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </Paper>
                </Box>
              </StyledAccordion>

              {/* 5. Submitted Rankings */}
              <StyledAccordion 
                onExpand={handleGetSubmittedRankingInfo}
                icon={<PeopleIcon color="primary" />} 
                title="Submitted Rankings"
                accordionKey="rankings"
              >
                {loadingRankings ? (
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                    <LinearProgress sx={{ width: '100%' }} />
                  </Box>
                ) : submittedRankingInfo !== null ? (
                  <Box sx={{ p: 2 }}>
                    {submittedRankingInfo["num_voters"] === 0 ? (
                      <Alert severity="info">
                        No rankings have been submitted to this poll.
                      </Alert>
                    ) : (
                      <Box>
                        <List>
                          <ListItem>
                            <ListItemText>
                              <Typography>
                                {submittedRankingInfo["num_voters"] === 1
                                  ? "1 person has "
                                  : submittedRankingInfo["num_voters"].toString() + " people have"}{" "}
                                participated in the poll.
                              </Typography>
                            </ListItemText>
                          </ListItem>
                          <ListItem>
                            <ListItemText>
                              <Typography>
                                {submittedRankingInfo["unranked_candidates"].length > 0
                                  ? candListToRankedStr(submittedRankingInfo["unranked_candidates"])
                                  : "All candidates are ranked by at least one voter."}
                              </Typography>
                            </ListItemText>
                          </ListItem>
                          {submittedRankingInfo["num_empty_ballots"] > 0 && (
                            <ListItem>
                              <ListItemText>
                                <Typography>
                                  {submittedRankingInfo["num_empty_ballots"] === 1
                                    ? "1 person "
                                    : submittedRankingInfo["num_empty_ballots"].toString() + " people "}
                                  submitted a ballot without ranking any candidates.
                                </Typography>
                              </ListItemText>
                            </ListItem>
                          )}
                        </List>

                        {submittedRankingInfo["num_voters"] > 0 && columns && numRows >= 0 && (
                          <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                              Current Submitted Ballots
                            </Typography>
                            <Box sx={{ overflow: "auto", mb: 3 }}>
                              <Profile
                                columnData={{"columns": columns, "numRows": numRows}}
                                cand1={""}
                                cand2={""}
                                cmap={cmap}
                              />
                            </Box>
                            {submittedRankingInfo["csv_data"] && (
                              <CSVLink 
                                data={submittedRankingInfo["csv_data"]} 
                                filename={'submitted_rankings-' + currentPollData["title"] + '.csv'}
                                style={{ textDecoration: 'none' }}
                              >
                                <Button
                                  variant="outlined"
                                  startIcon={<DownloadIcon />}
                                  sx={{ textTransform: 'none' }}
                                >
                                  Download submitted rankings
                                </Button>
                              </CSVLink>
                            )}
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                ) : <div/>}
              </StyledAccordion>

              {/* 6. Upload Rankings */}
              {!currentPollData["is_completed"] && !currentPollData["is_closed"] && (
                <StyledAccordion 
                  icon={<UploadFileIcon color="primary" />} 
                  title="Upload Rankings"
                  accordionKey="upload"
                >
                  <Box sx={{ p: 2 }}>
                    <Alert severity="info" sx={{ mb: 3 }}>
                      The header row of the CSV file must contain all the candidates, one in each column. Each row describes a ranking. The last column is the number of copies of each ballot to submit (if blank, one copy will be submitted).
                    </Alert>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                      <strong>Example:</strong> "A,B,C,D\n1,1,2,3,3\n3,1,2,4" represents 4 rankings: 3 copies of the ranking with A and B tied for 1st, C in 2nd place and D in 3rd place, and the fourth ranking has B in first place, C in 2nd place, A in 3rd place and D in 4th place.
                    </Typography>
                    
                    {currentPollData["candidates"] !== undefined && (
                      <Box sx={{ mb: 3 }}>
                        <CSVLink 
                          data={[currentPollData["candidates"]]} 
                          filename={'stablevoting-poll.csv'}
                          style={{ textDecoration: 'none' }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DownloadIcon />}
                            sx={{ textTransform: 'none' }}
                          >
                            Download sample CSV file
                          </Button>
                        </CSVLink>
                      </Box>
                    )}

                    <FileUpload
                      title="Upload Rankings CSV"
                      buttonText="Choose CSV File"
                      value={rankingsFile}
                      onChange={setRankingsFile}
                      accept=".csv"
                    />
                    
                    <Box sx={{ mt: 3 }}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={overwriteBallots}
                              onChange={() => setOverWriteBallots(!overwriteBallots)}
                            />
                          }
                          label="Overwrite existing ballots"
                        />
                      </FormGroup>
                      <Button
                        variant="contained"
                        onClick={handleAddBulkRankings}
                        disabled={!rankingsFile || rankingsFile.length === 0}
                        sx={{ mt: 2, textTransform: "none" }}
                        startIcon={<UploadFileIcon />}
                      >
                        Add Rankings to Poll
                      </Button>
                    </Box>
                  </Box>
                </StyledAccordion>
              )}

              {/* 7. Embed Poll */}
              <StyledAccordion 
                icon={<CodeIcon color="primary" />} 
                title="Embed Poll"
                accordionKey="embed"
              >
                <Box sx={{ p: 2 }}>
                  <EmbedTool 
                    pollId={id}
                    pollTitle={currentPollData["title"]}
                    voteUrl={voteUrl}
                  />
                </Box>
              </StyledAccordion>

              {/* 8. Delete Poll */}
              <StyledAccordion 
                icon={<DeleteForeverOutlinedIcon color="error" />} 
                title="Delete Poll"
                accordionKey="delete"
              >
                <Box sx={{ p: 2 }}>
                  <Alert severity="error" sx={{ mb: 3 }}>
                    <AlertTitle>Warning</AlertTitle>
                    This action cannot be undone. All poll data and votes will be permanently deleted.
                  </Alert>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeletePoll}
                    startIcon={<DeleteForeverIcon />}
                    sx={{ textTransform: "none" }}
                  >
                    Delete Poll Permanently
                  </Button>
                </Box>
              </StyledAccordion>

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
              
              <Dialog
                open={deleteMessage}
                onClose={() => {
                  setDeleteMessage(false);
                  navigate("/");
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogContent sx={{ width: "100%" }}>
                  <DialogContentText sx={{ color: "black", fontSize: 20, width: "300px" }} id="alert-dialog-description">
                    Poll deleted
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => {
                      setDeleteMessage(false);
                      navigate("/");
                    }}
                    autoFocus
                  >
                    OK
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Stack>
        )}
      </Container>
    </div>
  );
};

export default Admin;