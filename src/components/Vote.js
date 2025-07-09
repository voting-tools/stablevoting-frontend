import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import moment from "moment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import ReactMarkdown from 'react-markdown';
import { grey } from "@mui/material/colors";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { URL, API_URL, COLORS } from "./helpers";
import RankingInput from "./RankingInput";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const QRCodeModal = ({ open, onClose, qrCodeUrl, pollTitle }) => {
  return (
    <Backdrop
      sx={{ 
        color: '#fff', 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)'
      }}
      open={open}
      onClick={onClose}
    >
      <Fade in={open}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: 4,
            width: '100%',
            maxWidth: '600px', // Reasonable max width
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent backdrop click
              onClose();
            }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
          
          <Box sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Scan to vote in:
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                wordBreak: 'break-word',
                fontWeight: 400,
                opacity: 0.9,
                px: 2
              }}
            >
              {pollTitle}
            </Typography>
          </Box>
          
          <Paper 
            elevation={24} 
            sx={{ 
              p: 3, 
              mt: 3,
              backgroundColor: 'white',
              borderRadius: 2,
              maxWidth: '90vw',
              maxHeight: '70vh',
            }}
          >
            <img 
              src={qrCodeUrl} 
              alt="QR Code for voting"
              style={{ 
                width: '100%', 
                height: 'auto',
                maxWidth: '500px',
                display: 'block'
              }}
            />
          </Paper>
          
          <Typography variant="body1" sx={{ mt: 2, opacity: 0.8 }}>
            Click anywhere to close
          </Typography>
        </Box>
      </Fade>
    </Backdrop>
  );
};

const QRCodeCorner = ({ qrCodeUrl, onClick, title }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        flexShrink: 0,
        ml: 2,
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 0.5,
          backgroundColor: 'white',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <img 
          src={qrCodeUrl} 
          alt="QR Code for voting"
          style={{ 
            width: '80px',
            height: '80px',
            display: 'block'
          }}
        />
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block',
            textAlign: 'center',
            mt: 0.25,
            fontSize: '0.7rem',
            color: 'text.secondary'
          }}
        >
          Tap to enlarge
        </Typography>
      </Paper>
    </Box>
  );
};


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
  const [showNoRankingErrorMessage, setShowNoRankingErrorMessage] = useState(false);
  const [showSomeUnrankedMessage, setShowSomeUnrankedMessage] = useState(false);
  const [showCannotRankMessage, setShowCannotRankMessage] = useState(false);
  const [cannotRankMessage, setCannotRankMessage] = useState("");
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [isPrivatePoll, setIsPrivatePoll] = useState(false);
  const [description, setDescription] = useState("");
  const [showDescriptionDialog, setShowDescriptionDialog] = useState(false);

  // WORKAROUND: Make handleUpdateRanking available globally to bypass the closure issue
  const handleRankingUpdate = React.useCallback((newRanking) => {
    console.log("handleRankingUpdate called with:", newRanking);
    if (newRanking && typeof newRanking === 'object') {
      setCurrentRanking(newRanking);
    }
  }, []);
  
  // Store the function in a ref to ensure RankingInput always gets the latest version
  const updateRankingRef = React.useRef(handleRankingUpdate);
  updateRankingRef.current = handleRankingUpdate;
  
  // Create a stable wrapper that always calls the current version
  const stableHandleUpdateRanking = React.useCallback((newRanking) => {
    updateRankingRef.current(newRanking);
  }, []);
  
  // Debug: Log currentRanking changes
  useEffect(() => {
    console.log("currentRanking state changed:", currentRanking);
    console.log("currentRanking keys:", Object.keys(currentRanking));
  }, [currentRanking]);
  
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  const { id, allowmultiple } = params;
  const vid = searchParams.get("vid");
  const oid = searchParams.get("oid");
  const embedMode = searchParams.get("embed") === "true";
  
const fetchQRCode = async () => {
  try {
    // Build URL with proper query parameter handling
    let voteUrl = `${URL}/vote/${id}`;
    const queryParams = [];
    
    if (vid) {
      queryParams.push(`vid=${vid}`);
    }
    if (oid) {
      queryParams.push(`oid=${oid}`);
    }
    
    if (queryParams.length > 0) {
      voteUrl += '?' + queryParams.join('&');
    }
    
    console.log("Fetching QR code for URL:", voteUrl);
    
    const response = await axios.get(
      `${API_URL}/polls/qrcode?url=${encodeURIComponent(voteUrl)}`,
      { responseType: 'blob' }
    );
    
    const qrCodeBlob = new Blob([response.data], { type: 'image/png' });
    const qrCodeUrl = window.URL.createObjectURL(qrCodeBlob);
    setQrCodeUrl(qrCodeUrl);
    console.log("QR code generated successfully");
  } catch (err) {
    console.error("Error fetching QR code:", err);
    // Fallback to public API if backend fails
    try {
      let voteUrl = `${URL}/vote/${id}`;
      const queryParams = [];
      
      if (vid) {
        queryParams.push(`vid=${vid}`);
      }
      if (oid) {
        queryParams.push(`oid=${oid}`);
      }
      
      if (queryParams.length > 0) {
        voteUrl += '?' + queryParams.join('&');
      }
      
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(voteUrl)}`;
      setQrCodeUrl(qrApiUrl);
      console.log("Using fallback QR code service");
    } catch (fallbackErr) {
      console.error("Fallback QR code generation also failed:", fallbackErr);
    }
  }
};

// Also keep the improved fetchIpAddress function:
const fetchIpAddress = async () => {
  try {
    // Try ipapi.co as an alternative to jsonip.com
    const response = await axios.get("https://ipapi.co/json/");
    setIpAdress(response.data.ip);
  } catch (err) {
    // If that fails, try ipify
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      setIpAdress(response.data.ip);
    } catch (err2) {
      // If all fail, just use a default
      console.log("Could not fetch IP address:", err2);
      setIpAdress("0.0.0.0");
    }
  }
};

// And update the useEffect to include cleanup for blob URLs:
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
        const existingVote = ranking && Object.keys(ranking).length !== 0;
        console.log("Initial ranking from API:", ranking);
        console.log("Existing vote:", existingVote);
        setCandidates(resp.data["candidates"]);
        // Ensure ranking is always an object, defaulting to empty if null/undefined
        const initialRanking = (ranking && typeof ranking === 'object' && !Array.isArray(ranking)) ? ranking : {};
        console.log("Setting initial ranking to:", initialRanking);
        setCurrentRanking(initialRanking);
        setShowButton(true);
        setAlreadyVoted(existingVote)
        setTitle(resp.data["title"]);
        setDescription(resp.data["description"] || "");
        setIsPrivatePoll(resp.data["is_private"] || false);
        if (!embedMode && !resp.data["is_private"]) {
          fetchQRCode();
        }
      }
    })
    .catch((err) => {
      console.log("Error message");
      console.log(err);
      setShowNotFoundMessage(true);
    });
  
  // Cleanup blob URL on unmount
  return () => {
    if (qrCodeUrl && qrCodeUrl.startsWith('blob:')) {
      window.URL.revokeObjectURL(qrCodeUrl);
    }
  };
}, [id]);

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
          const existingVote = ranking && Object.keys(ranking).length !== 0;
          console.log("Initial ranking from API (2nd useEffect):", ranking);
          console.log("Existing vote (2nd useEffect):", existingVote);
          setCandidates(resp.data["candidates"]);
          // Ensure ranking is always an object, defaulting to empty if null/undefined
          const initialRanking = (ranking && typeof ranking === 'object' && !Array.isArray(ranking)) ? ranking : {};
          console.log("Setting initial ranking to (2nd):", initialRanking);
          setCurrentRanking(initialRanking);
          setShowButton(true);
          setAlreadyVoted(existingVote)
          setTitle(resp.data["title"]);
          setDescription(resp.data["description"] || "");
          setIsPrivatePoll(resp.data["is_private"] || false);
          if (!embedMode && !resp.data["is_private"]) {
            fetchQRCode();
          }
        }
      })
      .catch((err) => {
        console.log("Error message");
        console.log(err);
        setShowNotFoundMessage(true);
      });
    
    return () => {
      if (qrCodeUrl && qrCodeUrl.startsWith('blob:')) {
        window.URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [id]);

  async function copyLinkToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  // Create a wrapper component for RankingInput that manages its own state
  const RankingInputWrapper = ({ candidates, currentRanking, onRankingChange, tightLayout }) => {
    const [localRanking, setLocalRanking] = React.useState(currentRanking);
    
    // Update parent whenever local ranking changes
    React.useEffect(() => {
      if (JSON.stringify(localRanking) !== JSON.stringify(currentRanking)) {
        onRankingChange(localRanking);
      }
    }, [localRanking]);
    
    return (
      <RankingInput 
        theCandidates={candidates}
        currRanking={localRanking} 
        handleUpdateRanking={setLocalRanking}
        tightLayout={tightLayout} 
        description={description}  
        onShowDescription={() => setShowDescriptionDialog(true)} 

      />
    );
  };

  const submitRanking = () => {
    console.log("Submit Ranking Called");
    console.log("Current Ranking:", currentRanking);
    console.log("Current Ranking Type:", typeof currentRanking);
    console.log("Current Ranking Keys:", Object.keys(currentRanking));
    console.log("Candidates:", candidates);
    
    // Check if currentRanking is actually empty or has no valid entries
    const validRankingEntries = Object.entries(currentRanking).filter(
      ([key, value]) => key && value !== undefined && value !== null
    );
    
    console.log("Valid ranking entries:", validRankingEntries);
    
    if (validRankingEntries.length === 0) {
      console.log("Showing no ranking error message");
      setShowNoRankingErrorMessage(true);
      return;
    }
    
    // Convert both candidates and ranking keys to strings and trim whitespace for comparison
    const normalizedCandidates = candidates.map(c => String(c).trim());
    const normalizedRankingKeys = validRankingEntries.map(([key]) => String(key).trim());
    
    // Check if any candidates are missing from the ranking
    const unrankedCandidates = normalizedCandidates.filter(
      candidate => !normalizedRankingKeys.includes(candidate)
    );
    
    console.log("Unranked candidates:", unrankedCandidates);
    
    if (unrankedCandidates.length > 0) {
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

  return embedMode ? (
    // Embed mode - minimal interface
    <Box sx={{ 
      p: { xs: 1, sm: 2 }, 
      backgroundColor: 'white', 
      height: '100%'
    }}>
      {showNotFoundMessage ? (
        <Alert severity="error">
          <AlertTitle>Poll not found</AlertTitle>
          There is no poll with the id {id}
        </Alert>
      ) : serverErrorMessage !== "" ? (
        <Alert severity="warning">
          <AlertTitle>Ranking not submitted</AlertTitle>
          {serverErrorMessage}
        </Alert>
      ) : (
        <>
          {isSubmitted ? (
            <div>
              <Typography component="h1" variant="h5" align="center">
                Thank you for submitting your vote
              </Typography>
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
  variant="h5"
  sx={{ 
    marginBottom: "10px",
    wordBreak: 'break-word'
  }}
>
  {title}
</Typography>

{!alreadyVoted && (
  <Typography
    component="p"
    sx={{ color:COLORS.primary, marginBottom: "20px", fontSize: 16 }}
  >
    Drag each candidate to a place below to create a ranking.
  </Typography>
)}
                <Collapse in={showDescriptionDialog}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 3, 
                      mb: 3,
                      backgroundColor: grey[100],
                      position: 'relative'
                    }}
                  >
                    <IconButton
                      onClick={() => setShowDescriptionDialog(false)}
                      size="small"
                      sx={{ 
                        position: 'absolute',
                        right: 8,
                        top: 8
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                    
                    <Box sx={{ pr: 4 }}>
                      <ReactMarkdown>{description}</ReactMarkdown>
                    </Box>
                  </Paper>
                </Collapse>

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
                  
                  {candidates.length > 0 && (
                    <RankingInput 
                      key={`ranking-${candidates.join(',')}`}
                      theCandidates={candidates}
                      currRanking={currentRanking} 
                      handleUpdateRanking={stableHandleUpdateRanking}
                      tightLayout={matches} 
                      description={description} 
                      onShowDescription={() => setShowDescriptionDialog(true)} 

                      />
                  )}
                    
                  {showButton && (
                    <Box
                      sx={{
                        textAlign: "center",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: 3,
                      }}
                    >
                      {!isSubmitted ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={submitRanking}
                          sx={{ 
                            width: matches || embedMode ? "100%" : "50%", 
                            fontSize: "120%",
                            py: 1.5
                          }}
                        >
                          Submit ranking
                          {Object.keys(currentRanking).length > 0 && (
                            <span style={{ fontSize: '0.8em', marginLeft: '8px' }}>
                              ({Object.keys(currentRanking).length} ranked)
                            </span>
                          )}
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
    </Box>
  ) : (
    // Normal mode - full interface
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
        <Box sx={{ mb: 3 }}>
          {/* Title row with QR on desktop */}
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 3,
            mb: 2
          }}>
            <Typography
              component="h1"
              variant="h4"
              sx={{ 
                wordBreak: 'break-word',
                flex: 1
              }}
            >
              Vote in the poll {title}
            </Typography>
            
            {/* QR Code on desktop only */}
            {qrCodeUrl && !embedMode && !matches && !isPrivatePoll && (
              <Box sx={{ flexShrink: 0 }}>
                <QRCodeCorner
                  qrCodeUrl={qrCodeUrl}
                  onClick={() => setShowQRModal(true)}
                  title={title}
                />
              </Box>
            )}
          </Box>
          
          {/* QR button on mobile - under title, before instructions */}
          {qrCodeUrl && !embedMode && matches && !isPrivatePoll && (
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <IconButton
                onClick={() => setShowQRModal(true)}
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  width: 48,
                  height: 48,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                  }
                }}
              >
                <QrCode2Icon />
              </IconButton>
              <Typography variant="body2" sx={{ ml: 1.5, color: 'text.secondary' }}>
                Show QR code for sharing
              </Typography>
            </Box>
          )}
  
        {/* Instructions */}
        {alreadyVoted ? (
          <Typography
            component="p"
            sx={{ fontSize: 20 }}
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
            sx={{ color: COLORS.primary, fontSize: 20 }}
          >
            Drag each candidate to a place below to create a ranking.
          </Typography>
        )}
      </Box>

            {/* Description Collapse */}
            <Collapse in={showDescriptionDialog}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  mb: 3,
                  backgroundColor: grey[50],
                  border: '1px solid',
                  borderColor: grey[300],
                  position: 'relative'
                }}
              >
                <IconButton
                  onClick={() => setShowDescriptionDialog(false)}
                  size="small"
                  sx={{ 
                    position: 'absolute',
                    right: 8,
                    top: 8
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
                
                <Box sx={{ pr: 4 }}>
                  <ReactMarkdown>{description}</ReactMarkdown>
                </Box>
              </Paper>
            </Collapse>

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
                    
                    {candidates.length > 0 && (
                      <RankingInput 
                        key={`ranking-${candidates.join(',')}`}
                        theCandidates={candidates}
                        currRanking={currentRanking} 
                        handleUpdateRanking={stableHandleUpdateRanking}
                        tightLayout={matches} 
                        description={description} 
                        onShowDescription={() => setShowDescriptionDialog(true)}  

                        />
                    )}
                      
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
                            {Object.keys(currentRanking).length > 0 && (
                              <span style={{ fontSize: '0.8em', marginLeft: '8px' }}>
                                ({Object.keys(currentRanking).length} ranked)
                              </span>
                            )}
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
      
      {/* QR Code Modal - only in non-embed mode */}
      {!embedMode && (
        <QRCodeModal
          open={showQRModal}
          onClose={() => setShowQRModal(false)}
          qrCodeUrl={qrCodeUrl}
          pollTitle={title}
        />
      )}

    </Container>
  );
};

export default Vote;