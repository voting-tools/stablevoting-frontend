import React, { useState, useEffect } from "react";

import axios from "axios";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import moment from "moment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { grey } from "@mui/material/colors";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {  URL, API_URL, COLORS } from "./helpers";
import RankingInput from "./RankingInput";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export const Vote = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentRanking, setCurrentRanking] = useState({})
  const [showButton, setShowButton] = useState(false);
  const [title, setTitle] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [showNotFoundMessage, setShowNotFoundMessage] = useState(false);
  const [ipAddress, setIpAdress] = useState("n/a");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [showNoRankingErrorMessage, setShowNoRankingErrorMessage] =
    useState(false);
  const [showSomeUnrankedMessage, setShowSomeUnrankedMessage] =
    useState(false);
  const [showCannotRankMessage, setShowCannotRankMessage] = useState(false);
  const [cannotRankMessage, setCannotRankMessage] = useState("");
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  const { id, allowmultiple } = params;
  const vid = searchParams.get("vid");
  const oid = searchParams.get("oid");
  const fetchIpAddress = async () =>
    await axios
      .get("https://jsonip.com")
      .then((res) =>
        setIpAdress(res.data["ip"])
      )
      .catch((err) => setIpAdress("n/a"));

  const putRankingData = async (id, rankingData) => {
    axios
      .post(`${API_URL}/polls/vote/${id}?vid=${vid}&oid=${oid}&allowmultiplevote=${allowmultiple}`, rankingData)
      .then((resp) => {
        setIsSubmitted(true);
        setServerErrorMessage("");
      })
      .catch((err) => {
        console.log("ERROR!!!!")
        console.log(err.response.data.detail);
        setServerErrorMessage(err.response.data.detail);
      });
  };

  useEffect(() => {
    fetchIpAddress();
    axios
      .get(`${API_URL}/polls/ranking_information/${id}?vid=${vid}&allowmultiplevote=${allowmultiple}`)
      .then((resp) => {
        if (!resp.data["can_vote"]) {
          setShowCannotRankMessage(true);
          if (!resp.data["is_closed"] && resp.data["is_private"]) {
            setCannotRankMessage(
              "This poll is private.  You must use the link provided in the email to vote in the poll."
            );
          } else if (resp.data["is_completed"]) {
            setCannotRankMessage(
              "The poll is completed, so it is no longer accepting votes."
            );
          } else {
            setCannotRankMessage("You are not allowed to vote in this poll.");
          }
        } else {
          var ranking = resp.data["ranking"];
          const existingVote = Object.keys(ranking).length !== 0
          setCandidates(resp.data["candidates"]);
          setCurrentRanking(resp.data["ranking"])
          setShowButton(true);
          setAlreadyVoted(existingVote)
          setTitle(resp.data["title"]);
        }
      })
      .catch((err) => {
        console.log("Error message");
        console.log(err);
        setShowNotFoundMessage(true);
      });
  }, [id]);

  async function copyLinkToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  const submitRanking = () => {
    console.log("Submit Ranking")
    console.log(currentRanking)
    console.log(candidates)
    if (Object.keys(currentRanking).length === 0) {
      setShowNoRankingErrorMessage(true);
      return;
    }
    if ((Object.keys(currentRanking).length > 0) && candidates.some((c) => !Object.keys(currentRanking).includes(c))){
      setShowSomeUnrankedMessage(true);
      return;
    }

    const rankingData = {
      submission_date: moment().format("DD-MM-YYYY hh:mm:ss"),
      ranking: currentRanking,
      ip: ipAddress,
    };
    putRankingData(id, rankingData);
  };

  const handleSubmitPartialRanking = () => {

    const rankingData = {
      submission_date: moment().format("DD-MM-YYYY hh:mm:ss"),
      ranking: currentRanking,
      ip: ipAddress,
    };
    putRankingData(id, rankingData);
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 5, marginBottom: 10 }}>
      <Paper elevation={0}>
        {showNotFoundMessage ? (
          <Alert severity="error">
            <AlertTitle>Poll not found</AlertTitle>
            There is no poll with the id {id}
          </Alert>
        ) : serverErrorMessage !== "" ? (
          <>
            <Alert severity="warning">
              <AlertTitle>Ranking not submitted</AlertTitle>
              {serverErrorMessage}
            </Alert>
            <Box sx={{ marginTop: 5, fontSize: 20 }}>
              <Box component="div">
                You can view the results at the following link:
              </Box>
              <Paper
                elevation={0}
                sx={{
                  textAlign: "center",
                  fontSize: "110%",
                  margin: 1,
                  padding: 5,
                  background: grey[200],
                  overflow: "hidden",
                }}
              >
                <div>
                  <Link to={"/results/" + id} state={{ newVote: true }}>
                    {`${URL}/results/` + id}
                  </Link>
                </div>
                <div
                  style={{
                    display: "box",
                    marginLeft: "auto",
                    marginRight: "auto",
                    paddingTop: 8,
                    width: "50%",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => {
                      copyLinkToClipboard(`${URL}/results/` + id);
                      setIsCopied(true);
                    }}
                    sx={{ marginTop: 4 }}
                    startIcon={isCopied ? <CheckIcon /> : <ContentCopyIcon />}
                  >
                    {isCopied ? "Results link copied" : "Copy result link"}
                  </Button>
                </div>
              </Paper>
            </Box>
          </>
        ) : (
          <>
            {isSubmitted ? (
              <div>
                <Typography component="h1" variant="h4" align="center">
                  Thank you for submitting your vote
                </Typography>

                <Box component="div" sx={{ marginTop: 5, fontSize: 20 }}>
                  <Box component="div">
                    You can view the results at the following link:
                  </Box>
                  <Paper
                    elevation={0}
                    sx={{
                      textAlign: "center",
                      fontSize: "110%",
                      margin: 1,
                      padding: 5,
                      background: grey[200],
                      overflow: "hidden",
                    }}
                  >
                    <div>
                      <Link
                        to={`/results/${id}?vid=${vid}&oid=${oid}`}
                        state={{ newVote: true }}
                      >
                        {`${URL}/results/${id}?vid=${vid}&oid=${oid}`}
                      </Link>
                    </div>
                    <div
                      style={{
                        display: "box",
                        marginLeft: "auto",
                        marginRight: "auto",
                        paddingTop: 8,
                        width: "50%",
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => {
                          copyLinkToClipboard(
                            `${URL}/results/${id}?vid=${vid}&oid=${oid}`
                          );
                          setIsCopied(true);
                        }}
                        sx={{ marginTop: 4 }}
                        startIcon={
                          isCopied ? <CheckIcon /> : <ContentCopyIcon />
                        }
                      >
                        {isCopied ? "Results link copied" : "Copy result link"}
                      </Button>
                    </div>
                  </Paper>
                </Box>
              </div>
            ) : (
              <>
                {showCannotRankMessage ? (
                  <Alert severity="warning">
                    <AlertTitle>Cannot vote in this poll</AlertTitle>
                    {cannotRankMessage}
                  </Alert>
                ) : (
                  <div>
                    <Typography
                      component="h1"
                      variant="h4"
                      align="center"
                      sx={{ marginBottom: "10px" }}
                    >
                      Vote in the poll {title}
                    </Typography>
                    {alreadyVoted ? (
                      <Typography
                        component="p"
                        align="center"
                        sx={{ marginBottom: "30px", fontSize: 20 }}
                      >
                        You already submitted the ballot below. You can change
                        your ballot before the poll closes{" "}
                        <Link to={`/results/${id}?vid=${vid}`}>
                          see the current results.{" "}
                        </Link>
                      </Typography>
                    ) : (
                      <Typography
                        component="p"
                        align="center"
                        sx={{ color:COLORS.primary,  marginBottom: "30px", fontSize: 20 }}
                      >
                        Drag each candidate to a place below to create a
                        ranking.
                      </Typography>
                    )}

                    <Dialog
                      open={showNoRankingErrorMessage}
                      onClose={() => setShowNoRankingErrorMessage(false)}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"You have not ranked any candidates."}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          To rank a candidate, drag a candidate from the top box
                          to one of the boxes below. {candidates.length > 2 ? "You do not need to rank all the candidates." : ""}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleSubmitPartialRanking}>
                          Submit without ranking candidates{" "}
                        </Button>
                        <Button
                          onClick={() => setShowNoRankingErrorMessage(false)}
                          autoFocus
                        >
                          Rank candidates
                        </Button>
                      </DialogActions>
                    </Dialog>

                    <Dialog
                      open={showSomeUnrankedMessage}
                      onClose={() => setShowSomeUnrankedMessage(false)}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"Some candidates are unranked."}
                      </DialogTitle>
                      <DialogContent>
                      {candidates.length === 2 ?
                        <DialogContentText id="alert-dialog-description">
 
                         Please rank all the candidates before submitting your vote. 
                        </DialogContentText> : <DialogContentText id="alert-dialog-description">
 
                        You have not ranked one or more of the candidates.
                        If you leave a candidate unranked, your ballot will have no effect on that candidate's performance against other candidates in the poll.
                        </DialogContentText> 
                        }
                      </DialogContent>
                      <DialogActions>
                      {candidates.length > 2 ?

                        <Button onClick={handleSubmitPartialRanking}>
                          Submit without ranking all candidates{" "}
                        </Button> :<span/>
                      }
                        <Button
                          onClick={() => setShowSomeUnrankedMessage(false)}
                          autoFocus
                        >
                          Rank candidates
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <RankingInput 
                      theCandidates={candidates}
                      currRanking={currentRanking} 
                      handleUpdateRanking={setCurrentRanking} 
                      tightLayout={matches} />
                    {showButton && (
                      <Box
                        sx={{
                          textAlign: "center",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      >
                        {!isSubmitted ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={submitRanking}
                            sx={{ width: "50%", fontSize: "120%" }}
                          >
                            Submit ranking
                          </Button>
                        ) : (
                          <div />
                        )}
                      </Box>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Vote;
