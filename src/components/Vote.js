import React, { useState, useEffect } from "react";

import { DragDropContext } from "react-beautiful-dnd";
import CandidateBox from "./CandidateBox";
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
import {  useParams, useSearchParams, Link } from "react-router-dom";
import { rankLabels, URL, API_URL } from "./helpers";
import { Collapse } from "@mui/material";

export const Vote = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rankingState, setRankingState] = useState({
    candidates: {},
    candBoxes: {
      candidates: {
        id: "candidates",
        title: "Candidates",
        candIds: [],
      },
    },
    candBoxOrder: ["candidates"],
  });
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

  const { id, allowmultiple } = params;
  const vid = searchParams.get("vid");
  const oid = searchParams.get("oid");

  const fetchIpAddress = async () =>
    await axios
      .get("https://jsonip.com")
      .then((res) =>
        allowmultiple === "__scsv"
          ? setIpAdress("n/a")
          : setIpAdress(res.data["ip"])
      )
      .catch((err) => setIpAdress("n/a"));

  const putRankingData = async (id, rankingData) => {
    axios
      .post(`${API_URL}/v/${id}?vid=${vid}&oid=${oid}`, rankingData)
      .then((resp) => {
        setIsSubmitted(true);
        setServerErrorMessage("");
      })
      .catch((err) => {
        console.log(err.response.data.detail);
        setServerErrorMessage(err.response.data.detail);
      });
  };

  useEffect(() => {
    fetchIpAddress();
    axios
      .get(`${API_URL}/pr/${id}?vid=${vid}`)
      .then((resp) => {
        if (!resp.data["can_vote"]) {
          setShowCannotRankMessage(true);
          if (!resp.data["is_closed"] && resp.data["is_private"]) {
            setCannotRankMessage(
              "This poll is private.  You must use the link provided in the email to vote in the poll."
            );
          } else if (resp.data["is_closed"]) {
            setCannotRankMessage(
              "The poll is closed, so it is no longer accepting votes."
            );
          } else {
            setCannotRankMessage("You are not allowed to vote in this poll.");
          }
        } else {
          var cands = resp.data["candidates"];
          var ranking = resp.data["ranking"];
          const existingVote = Object.keys(ranking).length !== 0
          var candidates = Object.fromEntries(
            cands.map((c, idx) => [
              `cand-${idx + 1}`,
              { id: `cand-${idx + 1}`, name: c },
            ])
          );
          var candIds = cands.map((c, idx) => `cand-${idx + 1}`);

          var ranks = cands.map((c, idx) => `rank-${idx + 1}`);
          var rankBoxes = Object.fromEntries(
            cands.map((c, idx) => [
              `rank-${idx + 1}`,
              {
                id: `rank-${idx + 1}`,
                title: rankLabels[idx + 1],
                candIds: [],
              },
            ])
          );

          var initialData = {
            candidates: candidates,
            candBoxes: rankBoxes,

            // Facilitate reordering of the columns
            candBoxOrder: ["candidates"].concat(ranks),
          };

          initialData["candBoxes"]["candidates"] = {
            id: "candidates",
            title: "Candidates",
            candIds: candIds,
          };
          for (const c in ranking) {
            var rank = ranking[c];
            for (const cid in candidates) {
              if (candidates[cid]["name"] == c) {
                var cIdx =
                  initialData["candBoxes"]["candidates"]["candIds"].indexOf(
                    cid
                  );
                initialData["candBoxes"]["candidates"]["candIds"].splice(
                  cIdx,
                  1
                );
                initialData["candBoxes"][`rank-${rank}`]["candIds"].push(cid);
              }
            }
          }
          setCandidates(cands);
          setRankingState(initialData);
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

  const onDragEnd = (result) => {
    console.log("on DRAGE ENDS");
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = rankingState.candBoxes[source.droppableId];
    const finish = rankingState.candBoxes[destination.droppableId];

    if (start === finish) {
      const newCandIds = Array.from(start.candIds);
      newCandIds.splice(source.index, 1);
      newCandIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...start,
        candIds: newCandIds,
      };

      const newState = {
        ...rankingState,
        candBoxes: {
          ...rankingState.candBoxes,
          [newColumn.id]: newColumn,
        },
      };
      setRankingState(newState);
      return;
    }

    // Moving from one list to another
    const startCandIds = Array.from(start.candIds);
    startCandIds.splice(source.index, 1);
    const newStart = {
      ...start,
      candIds: startCandIds,
    };

    const finishCandIds = Array.from(finish.candIds);
    finishCandIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      candIds: finishCandIds,
    };

    const newState = {
      ...rankingState,
      candBoxes: {
        ...rankingState.candBoxes,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    console.log("newState is ");
    console.log(newState);

    setRankingState(newState);
  };

  async function copyLinkToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  const submitRanking = () => {
    const ranking = {};
    for (const rankBoxId in rankingState.candBoxes) {
      if (rankBoxId !== "candidates") {
        const rank = parseInt(rankBoxId.split("-")[1]);
        for (const candId in rankingState.candBoxes[rankBoxId].candIds) {
          ranking[
            rankingState.candidates[
              rankingState.candBoxes[rankBoxId].candIds[candId]
            ].name
          ] = rank;
        }
      }
    }
    if (Object.keys(ranking).length === 0) {
      setShowNoRankingErrorMessage(true);
      return;
    }
    if ((Object.keys(ranking).length > 0) && candidates.some((c) => !Object.keys(ranking).includes(c))){
      setShowSomeUnrankedMessage(true);
      return;
    }

    const rankingData = {
      submission_date: moment().format("DD-MM-YYYY hh:mm:ss"),
      ranking: ranking,
      ip: ipAddress,
    };
    putRankingData(id, rankingData);
  };

  const handleSubmitRanking = () => {
    const ranking = {};
    for (const rankBoxId in rankingState.candBoxes) {
      if (rankBoxId !== "candidates") {
        const rank = parseInt(rankBoxId.split("-")[1]);
        for (const candId in rankingState.candBoxes[rankBoxId].candIds) {
          ranking[
            rankingState.candidates[
              rankingState.candBoxes[rankBoxId].candIds[candId]
            ].name
          ] = rank;
        }
      }
    }

    const rankingData = {
      submission_date: moment().format("DD-MM-YYYY hh:mm:ss"),
      ranking: ranking,
      ip: ipAddress,
    };
    putRankingData(id, rankingData);
  };
  return (
    <Container maxWidth="lg" sx={{ marginTop:5, marginBottom: 10 }}>
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
                      copyLinkToClipboard(`${URL}//results/` + id);
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
                      <Link to={`/results/${id}?vid=${vid}&oid=${oid}`} state={{ newVote: true }}>
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
                          copyLinkToClipboard(`${URL}/results/${id}?vid=${vid}&oid=${oid}`);
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
                    {alreadyVoted ? <Typography
                      component="p"
                      align="center"
                      sx={{ marginBottom: "30px", fontSize: 20 }}
                    >
                    You already submitted the ballot below. You can change your ballot before the poll closes <Link to = {`/results/${id}?vid=${vid}`}>see the current results. </Link>
                    </Typography> : 

                    <Typography
                      component="p"
                      align="center"
                      sx={{ marginBottom: "30px", fontSize: 20 }}
                    >
                      Drag each candidate to a place below to create a ranking.
                    </Typography>}

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
                          to one of the boxes below. You do not need to rank all
                          the candidates.
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleSubmitRanking}>
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
                        <DialogContentText id="alert-dialog-description">
                          You have not ranked one or more of the candidates.  This means that you will not have any influence over their performance against other candidates in the poll.  
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleSubmitRanking}>
                          Submit without ranking all candidates{" "}
                        </Button>
                        <Button
                          onClick={() => setShowSomeUnrankedMessage(false)}
                          autoFocus
                        >
                          Rank candidates
                        </Button>
                      </DialogActions>
                    </Dialog>

                    <DragDropContext onDragEnd={onDragEnd}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          marginLeft: "auto",
                          marginRight: "auto",
                          width: "100%",
                        }}
                      >
                        <CandidateBox
                          key="candidates"
                          candBox={rankingState.candBoxes["candidates"]}
                          candidates={rankingState.candBoxes[
                            "candidates"
                          ].candIds.map(
                            (candId) => rankingState.candidates[candId]
                          )}
                        />
                        {rankingState.candBoxOrder.map((candBoxId) => {
                          if (candBoxId !== "candidates") {
                            const candBox = rankingState.candBoxes[candBoxId];
                            const candidates = candBox.candIds.map(
                              (candId) => rankingState.candidates[candId]
                            );
                            return (
                              <CandidateBox
                                key={candBox.id}
                                candBox={candBox}
                                candidates={candidates}
                              />
                            );
                          }
                        })}
                      </Box>
                    </DragDropContext>
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
