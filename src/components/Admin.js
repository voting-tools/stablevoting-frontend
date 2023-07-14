import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
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
//import moment from "moment";
import moment from 'moment-timezone';
import Fab from "@mui/material/Fab";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axios from "axios";
import FileUpload from "react-material-file-upload";
import { CSVLink } from "react-csv";

import { useParams, useSearchParams } from "react-router-dom";
import { COLORS, URL, API_URL } from "./helpers";
import { isValidEmail } from "./helpers";

import Profile from "./Profile";
import { Typography } from "@mui/material";

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
        console.log(err.response.detail);
        setShowNotFoundMessage(true);
      });
  }, []);

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
        console.log(err.response.detail);
        setShowNotFoundMessage(true);
      });
      handleGetSubmittedRankingInfo();
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
        reload();
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
        reload();
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
        console.log("ERROR");
        console.log(err.response);
        setShowErrorMessage(true);
        setErrorMessage(err.response.data.detail);
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
        reload();
      })
      .catch((err) => {
        console.log("ERROR");
        console.log(err.detail);
        setShowErrorMessage(true);
        setErrorMessage(err.response.data.detail);
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
        reload();
      })
      .catch((err) => {
        console.log("ERROR");
        console.log(err.detail);
        setShowErrorMessage(true);
        setErrorMessage(err.response.data.detail);
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
        reload();
      })
      .catch((err) => {
        console.log("ERROR");
        console.log(err.detail);
        setShowErrorMessage(true);
        setErrorMessage(err.response.data.detail);
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
        console.log("ERROR");
        console.log(err.response.data.detail);
        //setShowErrorMessage(true);
        //setErrorMessage(err.response.data.detail);
      });
  };
  const isEmpty = (s) => s !== undefined && s.replace(/\s/g, "") === "";

  const voteUrl = `${URL}/vote/` + id;
  const voteLink = "/vote/" + id;
  const resultsLinkOid = "/results/" + id + "?oid=" + oid;
  const resultsUrlOid = `${URL}/results/` + id + "?oid=" + oid;

  console.log("currentPollData")
  console.log(currentPollData)
  return (
    <div>
      <Container
        maxWidth="lg"
        sx={{
          fontSize: 20,
          padding: 5,
          marginTop: 5,
          marginBottom: 10,
          width: "100%",
          paddingLeft: "0px !important",
          paddingRight: "0px !important",
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
          <Stack sx={{ paddingLeft: 2, paddingRight: 2 }} spacing={2}>
            {currentPollData !== null && (
              <Box>
                The poll, {currentPollData["title"]}, was created on{" "}
                {currentPollData["creation_dt"]}.{" "}
              </Box>
            )}

            <Box sx={{ fontSize: 20 }}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  View the results of the poll.
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ marginBottom: 1 }}>
                    <Box sx={{ marginBottom: 1 }}>
                      Use the following link to view the results of the poll.
                    </Box>
                    <Box
                      sx={{ overflow: "scroll", paddingLeft: 4, paddingTop: 0 }}
                    >
                      <Link to={resultsLinkOid}>{resultsUrlOid} </Link>{" "}
                      <Tooltip title="copy link">
                        <IconButton
                          sx={{ marginLeft: 2 }}
                          onClick={() => copyLinkToClipboard(resultsUrlOid)}
                          aria-label="copy link"
                        >
                          <InsertLinkOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  Vote in the poll.
                </AccordionSummary>
                <AccordionDetails>
                  {currentPollData !== null && !currentPollData["is_private"] ?
                    <Box sx={{ marginBottom: 1 }}>
                      <Box sx={{ marginBottom: 1 }}>
                        Use the following link to vote in the poll.
                      </Box>
                      <Box
                        sx={{ overflow: "scroll", paddingLeft: 4, paddingTop: 0 }}
                      >
                        <Link to={voteLink}>{voteUrl} </Link>{" "}
                        <Tooltip title="copy link">
                          <IconButton
                            sx={{ marginLeft: 2 }}
                            onClick={() => copyLinkToClipboard(voteUrl)}
                            aria-label="copy link"
                          >
                            <InsertLinkOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      </Box> </Box> :
                    <Box> The poll is private: {currentPollData["num_invited_voters"] === 1 ? "1 person has" : currentPollData["num_invited_voters"].toString() + " people have"}  been invited to vote in the poll.  Each voter has received a unique link to vote in the poll. </Box>}
                </AccordionDetails>
              </Accordion>
              <Accordion onClick={handleGetSubmittedRankingInfo}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  Information about the submitted rankings.
                </AccordionSummary>
                <AccordionDetails>
                  {submittedRankingInfo !== null ? 
                  <Box sx={{ marginBottom: 0 }}>
                    {submittedRankingInfo !== null &&
                    submittedRankingInfo["num_voters"] === 0 ? (
                      "No rankings have been submitted to this poll."
                    ) : (
                      <List dense={true}  >
                            <ListItem sx={{ fontSize: "none" }}>
                          <ListItemText >
                            <Typography sx={{fontSize:"inherit"}}>
                            {submittedRankingInfo !== null && submittedRankingInfo["num_voters"] === 1
                              ? "1 person has "
                              : submittedRankingInfo["num_voters"].toString() +
                                " people have"}{" "}
                            participated in the poll.
                            </Typography>
                          </ListItemText>
                        </ListItem>
                        <ListItem sx={{ fontSize: "none" }}>
                          <ListItemText>
                          <Typography sx={{fontSize:"inherit"}}>
                           {submittedRankingInfo["unranked_candidates"].length > 0
                              ? candListToRankedStr(
                                submittedRankingInfo["unranked_candidates"]
                                )
                              : "All candidates are ranked by at least one voter."}
                              </Typography>
                          </ListItemText>
                        </ListItem>
                        {submittedRankingInfo !== null && submittedRankingInfo["num_voters"] > 0 &&
                          submittedRankingInfo["num_empty_ballots"] > 0 && (
                            <ListItem sx={{ fontSize: "none" }}>
                              <ListItemText>
                              <Typography sx={{fontSize:"inherit"}}>
                              {" "}
                                {submittedRankingInfo["num_empty_ballots"] === 1
                                  ? "1 person "
                                  : submittedRankingInfo[
                                      "num_empty_ballots"
                                    ].toString() + " people "}
                                submitted a ballot without ranking any
                                candidates.
                                </Typography>
                              </ListItemText>
                            </ListItem>
                          )}

                        {submittedRankingInfo !== null &&
                          submittedRankingInfo["num_voters"] > 0 && (
                            <ListItem >
                              <ListItemText>
                              <Typography sx={{fontSize:20}}>
                                Current Submitted Ballots
                                </Typography>

                                <Box sx={{ marginTop: 2, overflow: "scroll" }}>
                                  {console.log(cmap)}
                                  <Profile
                                  columnData = {{"columns": columns, "numRows": numRows}}
                                    cand1={""}
                                    cand2={""}
                                    cmap={cmap}
                                  />
                                </Box>
                                <Box sx={{ marginTop: 2, fontSize:20}}>

                                <CSVLink data={submittedRankingInfo["csv_data"]} filename={'submitted_rankings-' + currentPollData["title"] + '.csv'}>Download submitted rankings.</CSVLink>                                
                                </Box>
                              </ListItemText>
                            </ListItem>
                          )}

                      </List>
                    )}
                  </Box> : <div/>}
                </AccordionDetails>
              </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel5a-content"
                    id="panel5a-header"
                  >
                    The poll is {currentPollData["is_closed"] || currentPollData["is_completed"] ? "closed." : "open."}
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      The poll {(currentPollData["is_closed"] || currentPollData["is_completed"]) ? "is not " : "is "}  currently accepting votes.  
                      {currentPollData["closing_datetime"] === null
                        ? " There is no closing date for this poll."
                        : ` The closing date for this poll ${currentPollData["is_closed"] || currentPollData["is_completed"] ? "was" : "is"} ${moment(
                            currentPollData["closing_datetime"]
                          ).format("MMMM Do YYYY, h:mm a")}`}
                    </Box>
                    <Box sx={{ marginTop: 2 }}>
                    {(currentPollData["is_closed"] || currentPollData["is_completed"]) ?
                      <Button
                        sx={{
                          textTransform: "none",
                          fontSize: 20,
                        }}
                        onClick={handleOpenPoll}
                        variant="outlined"
                      >
                        Open poll
                      </Button> : <Button
                        sx={{
                          textTransform: "none",
                          fontSize: 20,
                        }}
                        onClick={handleClosePoll}
                        variant="outlined"
                      >
                        Close poll
                      </Button> }
                    </Box>
                  </AccordionDetails>
                </Accordion>
              

                {currentPollData !== null && currentPollData["is_private"] && !currentPollData["is_completed"] && !currentPollData["is_closed"] && (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4a-content"
                    id="panel4a-header"
                  >
                    Add voters to the poll.
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      <Box
                        sx={{
                          padding: 0,
                          marginTop: 0,
                          marginBottom: 4,
                          backgroundColor: "inherit",
                        }}
                      >
                        Give the list of emails for the additional voters that
                        will participate in the poll. No existing voters will be removed. Each voter will receive a unique link to access the poll. Enter the emails separated by a comma, a space or a newline. <em>No emails will be saved.</em>{" "}
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
                          error={invalidAdvoterEmail.length > 0}
                          helperText={
                            invalidAdvoterEmail.length > 0
                              ? invalidAdvoterEmail
                              : null
                          }
                          value={addVoterEmailList}
                          onChange={handleAddVoterEmailList}
                          variant="standard"
                        />
                      </Box>
                      <Button
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          fontSize: 20,
                        }}
                        disabled={addVoterEmailList.length === 0}
                        onClick={handleAddVoters}
                      >
                        Add voters
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}

              {!currentPollData["is_completed"] && !currentPollData["is_closed"] && <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3a-content"
                  id="panel3a-header"
                >
                  Upload rankings to the poll.
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ paddingBottom: 2 }}>
                    The header row of the csv file must contain all the candidates, one with each column.  Each row describes a ranking.  The last column is the number of copies of each ballot to submit (if it is blank, then one copy will be submitted). For example, the csv file "A,B,C,D\n1,1,2,3,3\n3,1,2,4" represents 4 rankings: 3 copies of the ranking in which A and B tied for 1st, C in 2nd place and D in 3rd place, and the fourth ranking has B in first place, C in 2nd place, A is 3rd place and D in 4th place. {currentPollData["candidates"] !== undefined ? <CSVLink data={[currentPollData["candidates"]]} filename={'stablevoting-poll.csv'}>Download a sample csv file.</CSVLink> : ''}

                  </Box>
                  <FileUpload
                    title="Upload a csv file"
                    buttonText="Upload"
                    value={rankingsFile}
                    onChange={setRankingsFile}
                  />
                  <Box
                    sx={{
                      textAlign: "center",
                      marginLeft: "auto",
                      marginRight: "auto",
                      marginTop: 5,
                    }}
                  >
                    <Box
                      sx={{
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        textAlign: "center",
                        padding: 0,
                        marginBottom: 1,
                        width: "100%",
                      }}
                    >
                      <FormGroup>
                        <FormControlLabel
                          sx={{ marginLeft: "auto", marginRight: "auto" }}
                          control={
                            <Checkbox
                              checked={overwriteBallots}
                              onChange={() =>
                                setOverWriteBallots(!overwriteBallots)
                              }
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          }
                          label="Overwrite existing ballots."
                        />
                      </FormGroup>
                    </Box>
                    <Button
                      sx={{
                        width: "50%",
                        padding: 1,
                        textTransform: "none",
                        fontSize: 20,
                      }}
                      onClick={handleAddBulkRankings}
                    >
                      Add rankings to the poll
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>}
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel6a-content"
                  id="panel6a-header"
                >
                  Update the poll.
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ padding: 2 }}>
                    <Stack spacing={2}>
                      {updatedPollData !== null && updatedPollData["title"] !== undefined && (
                        <FormGroup sx={{ marginBottom: 2 }}>
                          <TextField
                            fullWidth
                            error={
                              updatedPollData !== null &&
                              isEmpty(updatedPollData["title"])
                                ? true
                                : false
                            }
                            helperText={
                              updatedPollData !== null &&
                              isEmpty(updatedPollData["title"])
                                ? "Please enter a title for the poll."
                                : ""
                            }
                            value={updatedPollData["title"]}
                            onChange={(ev) =>
                              updatePollField("title", ev.target.value)
                            }
                            label="Poll Title"
                            variant="standard"
                          />
                        </FormGroup>
                      )}

                      {updatedPollData !== null && updatedPollData["description"] !== undefined && (
                        <FormGroup sx={{ marginBottom: 2 }}>
                          <TextField
                            fullWidth
                            multiline
                            value={updatedPollData["description"]}
                            onChange={(ev) =>
                              updatePollField("description", ev.target.value)
                            }
                            label="Description"
                          />
                        </FormGroup>
                      )}
                      {updatedPollData !== null && (
                        <Box>
                          <Box sx={{ marginTop: 5 }}>Candidates</Box>
                          {currentPollData["num_ballots"] === 0 ? (
                            <Stack sx={{ padding: 2 }} spacing={2}>
                              {candList.map((c, cidx) => {
                                return (
                                  <Input
                                    sx={{
                                      marginBottom: 1,
                                      width: { xs: "100%", md: "50%" },
                                    }}
                                    variant="standard"
                                    value={c}
                                    label={`Candidate ${cidx + 1}`}
                                    endAdornment={
                                      <InputAdornment position="end">
                                        <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={() => handleRemoveCand(cidx)}
                                          edge="end"
                                        >
                                          <DeleteForeverIcon />
                                        </IconButton>
                                      </InputAdornment>
                                    }
                                    onChange={(ev) =>
                                      handleUpdateCandList(
                                        cidx,
                                        ev.target.value
                                      )
                                    }
                                    key={cidx}
                                  />
                                );
                              })}
                              <Fab
                                onClick={handleAddCandList}
                                variant="extended"
                                size="small"
                                color="primary"
                                aria-label="add"
                                sx={{
                                  width: 200,
                                  marginTop: 4,
                                  marginLeft: 3,
                                  paddingLeft: 2,
                                  paddingRight: 2,
                                }}
                              >
                                <AddBoxOutlinedIcon sx={{ marginRight: 1 }} />{" "}
                                Add Candidate
                              </Fab>
                            </Stack>
                          ) : (
                            <Box>
                              Since voters have already submitted ballots, you
                              cannot update the candidates.{" "}
                            </Box>
                          )}
                        </Box>
                      )}

                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={
                                updatedPollData !== null &&
                                updatedPollData["is_private"]
                              }
                              onChange={() =>
                                updatePollField(
                                  "is_private",
                                  !updatedPollData["is_private"]
                                )
                              }
                            />
                          }
                          label={
                            updatedPollData !== null &&
                            updatedPollData["is_private"] ? (
                              <Box
                                component="span"
                                sx={{ fontSize: 20, marginLeft: 2 }}
                              >
                                {" "}
                                Make the poll private.
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
                                Make the poll private.
                              </Box>
                            )
                          }
                        />
                        <Collapse
                          in={
                            updatedPollData !== null &&
                            updatedPollData["is_private"]
                          }
                        >
                          <Box
                            sx={{
                              padding: 3,
                              marginTop: 2,
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
                              Give the list of emails for the additional voters
                              that will participate in the poll. No existing
                              voters will be removed. Each voter will receive a
                              unique link to access the poll. Enter the emails
                              separated by a comma, a space or a newline.{" "}
                              <em>No emails will be saved.</em>{" "}
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
                                helperText={
                                  invalidEmail.length > 0 ? invalidEmail : null
                                }
                                value={emailList}
                                onChange={handleEmailList}
                                variant="standard"
                              />
                            </Box>
                          </Box>
                        </Collapse>
                      </FormGroup>

                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={
                                updatedPollData !== null &&
                                updatedPollData["show_rankings"]
                              }
                              onChange={() =>
                                updatePollField(
                                  "show_rankings",
                                  updatedPollData !== null &&
                                    !updatedPollData["show_rankings"]
                                )
                              }
                            />
                          }
                          label={
                            updatedPollData !== null &&
                            updatedPollData["show_rankings"] ? (
                              <Box
                                component="span"
                                sx={{ fontSize: 20, marginLeft: 2 }}
                              >
                                {" "}
                                Show anonymized voter rankings.
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
                                Show anonymized voter rankings.
                              </Box>
                            )
                          }
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
                          label={
                            showGetDate ? (
                              <Box
                                component="span"
                                sx={{ fontSize: 20, marginLeft: 2 }}
                              >
                                {" "}
                                Add a closing date for the poll.
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
                                Add a closing date for the poll.
                              </Box>
                            )
                          }
                        />
                      </FormGroup>
                      <Collapse in={showGetDate}>
                        <Box
                          sx={{
                            padding: 3,
                            marginTop: 2,
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
                          <FormGroup sx={{ marginTop: 2 }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  disabled={
                                    updatedPollData !== null &&
                                    !updatedPollData["show_outcome"]
                                  }
                                  checked={
                                    updatedPollData !== null &&
                                    updatedPollData["show_outcome"] &&
                                    updatedPollData[
                                      "can_view_outcome_before_closing"
                                    ]
                                  }
                                  onChange={() =>
                                    updatePollField(
                                      "can_view_outcome_before_closing",
                                      !updatedPollData[
                                        "can_view_outcome_before_closing"
                                      ]
                                    )
                                  }
                                />
                              }
                              label={
                                updatedPollData !== null &&
                                updatedPollData["show_outcome"] &&
                                updatedPollData[
                                  "can_view_outcome_before_closing"
                                ] ? (
                                  <Box
                                    component="span"
                                    sx={{ fontSize: 20, marginLeft: 2 }}
                                  >
                                    {" "}
                                    Voters can view poll results before closing
                                    date.
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
                                    Voters can view poll results before closing
                                    date.
                                  </Box>
                                )
                              }
                            />
                          </FormGroup>
                        </Box>
                      </Collapse>

                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={
                                updatedPollData !== null &&
                                updatedPollData["show_outcome"]
                              }
                              onChange={() => {
                                updatePollField(
                                  "show_outcome",
                                  updatedPollData !== null &&
                                    !updatedPollData["show_outcome"]
                                );
                                updatePollField(
                                  "can_view_outcome_before_closing",
                                  !updatedPollData["show_outcome"] &&
                                    updatedPollData[
                                      "can_view_outcome_before_closing"
                                    ]
                                );
                              }}
                            />
                          }
                          label={
                            updatedPollData !== null &&
                            updatedPollData["show_outcome"] ? (
                              <Box
                                component="span"
                                sx={{ fontSize: 20, marginLeft: 2 }}
                              >
                                {" "}
                                Anyone with the link can view the outcome.
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
                                Anyone with the link can view the outcome.
                              </Box>
                            )
                          }
                        />
                      </FormGroup>
                      <Box sx={{ paddingTop: 5 }}>
                        <Stack direction="row" spacing={5}>
                          <Button
                            variant="outlined"
                            sx={{
                              textTransform: "none",
                              fontSize: 20,
                            }}
                            onClick={handleReset}
                          >
                            Reset
                          </Button>
                          {canUpdatePoll() ? (
                            <Button
                              variant="contained"
                              sx={{
                                textTransform: "none",
                                fontSize: 20,
                              }}
                              onClick={handleUpdatePoll}
                            >
                              Update Poll
                            </Button>
                          ) : (
                            <Tooltip title="A title and at least two candidates is required for a poll.">
                              <span>
                                <Button
                                  variant="contained"
                                  sx={{
                                    textTransform: "none",
                                    fontSize: 20,
                                  }}
                                  disabled={true}
                                  onClick={handleUpdatePoll}
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
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel7a-content"
                  id="panel7a-header"
                >
                  Delete the poll.
                </AccordionSummary>
                <AccordionDetails>
                  <Button
                    sx={{
                      padding: 1,
                      textTransform: "none",
                      fontSize: 20,
                    }}
                    variant="contained"
                    color="error"
                    onClick={handleDeletePoll}
                  >
                    Delete poll: This cannot be undone.
                  </Button>
                </AccordionDetails>
              </Accordion>

                {/*



              {currentPollData !== null && !currentPollData["is_closed"] && (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel5a-content"
                    id="panel5a-header"
                  >
                    Close the poll.
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      {currentPollData["closing_datetime"] === null
                        ? "There is no closing date for this poll."
                        : `The closing date for this poll is ${moment(
                            currentPollData["closing_datetime"]
                          ).format("MMMM Do YYYY, h:mm a")} (${
                            currentPollData["timezone"]
                          })`}
                    </Box>
                    <Box sx={{ marginTop: 2 }}>
                      <Button
                        sx={{
                          textTransform: "none",
                          fontSize: 20,
                        }}
                        onClick={handleClosePoll}
                        variant="outlined"
                      >
                        Close poll
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel6a-content"
                  id="panel6a-header"
                >
                  Update the poll.
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ padding: 2 }}>
                    <Stack spacing={2}>
                      {updatedPollData !== null && (
                        <FormGroup sx={{ marginBottom: 2 }}>
                          <TextField
                            fullWidth
                            error={
                              updatedPollData !== null &&
                              isEmpty(updatedPollData["title"])
                                ? true
                                : false
                            }
                            helperText={
                              updatedPollData !== null &&
                              isEmpty(updatedPollData["title"])
                                ? "Please enter a title for the poll."
                                : ""
                            }
                            value={updatedPollData["title"]}
                            onChange={(ev) =>
                              updatePollField("title", ev.target.value)
                            }
                            label="Poll Title"
                            variant="standard"
                          />
                        </FormGroup>
                      )}

                      {updatedPollData !== null && (
                        <FormGroup sx={{ marginBottom: 2 }}>
                          <TextField
                            fullWidth
                            multiline
                            value={updatedPollData["description"]}
                            onChange={(ev) =>
                              updatePollField("description", ev.target.value)
                            }
                            label="Description"
                          />
                        </FormGroup>
                      )}
                      {updatedPollData !== null && (
                        <Box>
                          <Box sx={{ marginTop: 5 }}>Candidates</Box>
                          {currentPollData["num_ballots"] === 0 ? (
                            <Stack sx={{ padding: 2 }} spacing={2}>
                              {candList.map((c, cidx) => {
                                return (
                                  <Input
                                    sx={{
                                      marginBottom: 1,
                                      width: { xs: "100%", md: "50%" },
                                    }}
                                    variant="standard"
                                    value={c}
                                    label={`Candidate ${cidx + 1}`}
                                    endAdornment={
                                      <InputAdornment position="end">
                                        <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={() => handleRemoveCand(cidx)}
                                          edge="end"
                                        >
                                          <DeleteForeverIcon />
                                        </IconButton>
                                      </InputAdornment>
                                    }
                                    onChange={(ev) =>
                                      handleUpdateCandList(
                                        cidx,
                                        ev.target.value
                                      )
                                    }
                                    key={cidx}
                                  />
                                );
                              })}
                              <Fab
                                onClick={handleAddCandList}
                                variant="extended"
                                size="small"
                                color="primary"
                                aria-label="add"
                                sx={{
                                  width: 200,
                                  marginTop: 4,
                                  marginLeft: 3,
                                  paddingLeft: 2,
                                  paddingRight: 2,
                                }}
                              >
                                <AddBoxOutlinedIcon sx={{ marginRight: 1 }} />{" "}
                                Add Candidate
                              </Fab>
                            </Stack>
                          ) : (
                            <Box>
                              Since voters have already submitted ballots, you
                              cannot update the candidates.{" "}
                            </Box>
                          )}
                        </Box>
                      )}

                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={
                                updatedPollData !== null &&
                                updatedPollData["is_private"]
                              }
                              onChange={() =>
                                updatePollField(
                                  "is_private",
                                  !updatedPollData["is_private"]
                                )
                              }
                            />
                          }
                          label={
                            updatedPollData !== null &&
                            updatedPollData["is_private"] ? (
                              <Box
                                component="span"
                                sx={{ fontSize: 20, marginLeft: 2 }}
                              >
                                {" "}
                                Make the poll private.
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
                                Make the poll private.
                              </Box>
                            )
                          }
                        />
                        <Collapse
                          in={
                            updatedPollData !== null &&
                            updatedPollData["is_private"]
                          }
                        >
                          <Box
                            sx={{
                              padding: 3,
                              marginTop: 2,
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
                              Give the list of emails for the additional voters
                              that will participate in the poll. No existing
                              voters will be removed. Each voter will receive a
                              unique link to access the poll. Enter the emails
                              separated by a comma, a space or a newline.{" "}
                              <em>No emails will be saved.</em>{" "}
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
                                helperText={
                                  invalidEmail.length > 0 ? invalidEmail : null
                                }
                                value={emailList}
                                onChange={handleEmailList}
                                variant="standard"
                              />
                            </Box>
                          </Box>
                        </Collapse>
                      </FormGroup>

                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={
                                updatedPollData !== null &&
                                updatedPollData["show_rankings"]
                              }
                              onChange={() =>
                                updatePollField(
                                  "show_rankings",
                                  updatedPollData !== null &&
                                    !updatedPollData["show_rankings"]
                                )
                              }
                            />
                          }
                          label={
                            updatedPollData !== null &&
                            updatedPollData["show_rankings"] ? (
                              <Box
                                component="span"
                                sx={{ fontSize: 20, marginLeft: 2 }}
                              >
                                {" "}
                                Show anonymized voter rankings.
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
                                Show anonymized voter rankings.
                              </Box>
                            )
                          }
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
                          label={
                            showGetDate ? (
                              <Box
                                component="span"
                                sx={{ fontSize: 20, marginLeft: 2 }}
                              >
                                {" "}
                                Add a closing date for the poll.
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
                                Add a closing date for the poll.
                              </Box>
                            )
                          }
                        />
                      </FormGroup>
                      <Collapse in={showGetDate}>
                        <Box
                          sx={{
                            padding: 3,
                            marginTop: 2,
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
                          <FormGroup sx={{ marginTop: 2 }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  disabled={
                                    updatedPollData !== null &&
                                    !updatedPollData["show_outcome"]
                                  }
                                  checked={
                                    updatedPollData !== null &&
                                    updatedPollData["show_outcome"] &&
                                    updatedPollData[
                                      "can_view_outcome_before_closing"
                                    ]
                                  }
                                  onChange={() =>
                                    updatePollField(
                                      "can_view_outcome_before_closing",
                                      !updatedPollData[
                                        "can_view_outcome_before_closing"
                                      ]
                                    )
                                  }
                                />
                              }
                              label={
                                updatedPollData !== null &&
                                updatedPollData["show_outcome"] &&
                                updatedPollData[
                                  "can_view_outcome_before_closing"
                                ] ? (
                                  <Box
                                    component="span"
                                    sx={{ fontSize: 20, marginLeft: 2 }}
                                  >
                                    {" "}
                                    Voters can view poll results before closing
                                    date.
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
                                    Voters can view poll results before closing
                                    date.
                                  </Box>
                                )
                              }
                            />
                          </FormGroup>
                        </Box>
                      </Collapse>

                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={
                                updatedPollData !== null &&
                                updatedPollData["show_outcome"]
                              }
                              onChange={() => {
                                updatePollField(
                                  "show_outcome",
                                  updatedPollData !== null &&
                                    !updatedPollData["show_outcome"]
                                );
                                updatePollField(
                                  "can_view_outcome_before_closing",
                                  !updatedPollData["show_outcome"] &&
                                    updatedPollData[
                                      "can_view_outcome_before_closing"
                                    ]
                                );
                              }}
                            />
                          }
                          label={
                            updatedPollData !== null &&
                            updatedPollData["show_outcome"] ? (
                              <Box
                                component="span"
                                sx={{ fontSize: 20, marginLeft: 2 }}
                              >
                                {" "}
                                Anyone with the link can view the outcome.
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
                                Anyone with the link can view the outcome.
                              </Box>
                            )
                          }
                        />
                      </FormGroup>
                      <Box sx={{ paddingTop: 5 }}>
                        <Stack direction="row" spacing={5}>
                          <Button
                            variant="outlined"
                            sx={{
                              textTransform: "none",
                              fontSize: 20,
                            }}
                            onClick={handleReset}
                          >
                            Reset
                          </Button>
                          {canUpdatePoll() ? (
                            <Button
                              variant="contained"
                              sx={{
                                textTransform: "none",
                                fontSize: 20,
                              }}
                              onClick={handleUpdatePoll}
                            >
                              Update Poll
                            </Button>
                          ) : (
                            <Tooltip title="A title and at least two candidates is required for a poll.">
                              <span>
                                <Button
                                  variant="contained"
                                  sx={{
                                    textTransform: "none",
                                    fontSize: 20,
                                  }}
                                  disabled={true}
                                  onClick={handleUpdatePoll}
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
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel7a-content"
                  id="panel7a-header"
                >
                  Delete the Poll.
                </AccordionSummary>
                <AccordionDetails>
                  <Button
                    sx={{
                      padding: 1,
                      textTransform: "none",
                      fontSize: 20,
                    }}
                    variant="contained"
                    color="error"
                    onClick={handleDeletePoll}
                  >
                    Delete poll: This cannot be undone.
                  </Button>
                </AccordionDetails>
              </Accordion>
                  */}
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
                <DialogContent
                  sx={{
                    width: "100%",
                  }}
                >
                  <DialogContentText
                    sx={{ color: "black", fontSize: 20, width: "300px" }}
                    id="alert-dialog-description"
                  >
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
