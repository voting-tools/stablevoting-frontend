import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PollIcon from '@mui/icons-material/Poll';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PeopleIcon from '@mui/icons-material/People';
import moment from 'moment';

import { URL } from "./helpers";
import { isEmpty } from "../utils/pollUtils";
import { usePollAdmin } from "../hooks/usePollAdmin";

// Import accordion components
import { PollStatusAccordion } from "./admin/accordions/PollStatusAccordion";
import { PollSettingsAccordion } from "./admin/accordions/PollSettingsAccordion";
import { VoteAccordion } from "./admin/accordions/VoteAccordion";
import { ViewResultsAccordion } from "./admin/accordions/ViewResultsAccordion";
import { SubmittedRankingsAccordion } from "./admin/accordions/SubmittedRankingsAccordion";
import { AddVotersAccordion } from "./admin/accordions/AddVotersAccordion";
import { UploadRankingsAccordion } from "./admin/accordions/UploadRankingsAccordion";
import { EmbedPollAccordion } from "./admin/accordions/EmbedPollAccordion";
import { DeletePollAccordion } from "./admin/accordions/DeletePollAccordion";

import { DeleteBallotsAccordion } from "./admin/accordions/DeleteBallotsAccordion";

import { PollDashboardAccordion } from "./admin/accordions/PollDashboardAccordion";



export const Admin = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [expandedAccordion, setExpandedAccordion] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(false);

  const id = params.id;
  const oid = searchParams.get("oid");

  const {
    loading,
    currentPollData,
    updatedPollData,
    showNotFoundMessage,
    showNotOwnerMessage,
    showErrorMessage,
    errorMessage,
    showMessage,
    message,
    dateErrorText,
    showGetDate,
    closingDate,
    candList,
    submittedRankingInfo,
    columns,
    numRows,
    cmap,
    loadingRankings,
    updatePollField,
    updatePoll,
    closePoll,
    openPoll,
    deletePoll,
    deleteAllBallots,
    addVoters,
    deleteVoter,
    resendEmail,
    generateNewVoteLink,
    getExistingVoters,
    addBulkRankings,
    getSubmittedRankingInfo,
    refreshPollData,
    setShowErrorMessage,
    setShowMessage,
    setMessage,
    setErrorMessage,
    setDateErrorText,
    setClosingDate,
    setShowGetDate,
    setCandList,
  } = usePollAdmin(id, oid);

  // URL construction
  const voteUrl = `${URL}/vote/${id}`;
  const voteLink = `/vote/${id}`;
  const resultsLinkOid = `/results/${id}?oid=${oid}`;
  const resultsUrlOid = `${URL}/results/${id}?oid=${oid}`;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const copyLinkToClipboard = async (text) => {
    try {
      if ("clipboard" in navigator) {
        await navigator.clipboard.writeText(text);
      } else {
        document.execCommand("copy", true, text);
      }
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  };

  const handleUpdateCandList = (cIdx, newCand) => {
    const newCands = [...candList];
    newCands[cIdx] = newCand;
    setCandList(newCands);
  };

  const handleAddCandList = () => {
    setCandList([...candList, ""]);
  };

  const handleRemoveCand = (cIdx) => {
    const newCands = [...candList];
    newCands.splice(cIdx, 1);
    setCandList(newCands);
  };

  const handleReset = () => {
    if (currentPollData) {
      setCandList([...(currentPollData["candidates"] || [])]);
      if (currentPollData["closing_datetime"]) {
        setClosingDate(moment(currentPollData["closing_datetime"]));
        setShowGetDate(true);
      } else {
        setClosingDate(null);
        setShowGetDate(false);
      }
      // Reset updatedPollData by triggering updatePollField
      Object.keys(currentPollData).forEach(key => {
        updatePollField(key, currentPollData[key]);
      });
    }
  };

  const handleUpdatePoll = async () => {
    const nonNullCands = candList.filter((c) => !isEmpty(c));
    const pollData = {
      title: updatedPollData["title"],
      description: updatedPollData["description"],
      candidates: nonNullCands,
      is_private: updatedPollData["is_private"],
      voter_emails: updatedPollData["voter_emails"],
      show_rankings: updatedPollData["show_rankings"],
      closing_datetime: closingDate !== null ? closingDate.toISOString() : "del",
      timezone: updatedPollData["timezone"] || Intl.DateTimeFormat().resolvedOptions().timeZone,
      show_outcome: updatedPollData["show_outcome"],
      can_view_outcome_before_closing: updatedPollData["can_view_outcome_before_closing"]
    };
    await updatePoll(pollData);
  };

  const handleClosingDateChange = (date, errorText) => {
    setDateErrorText(errorText);
    setClosingDate(date);
    updatePollField("closing_datetime", date.toISOString());
  };

  const handleShowDateToggle = () => {
    if (showGetDate) {
      updatePollField("closing_datetime", null);
      setDateErrorText("");
      setClosingDate(null);
      setShowGetDate(false);
    } else {
      setShowGetDate(true);
    }
  };

  const handleDeletePoll = async () => {
    const result = await deletePoll();
    if (result.success) {
      setDeleteMessage(true);
    }
  };

  const handleUploadRankings = async (file, overwrite) => {
    const result = await addBulkRankings(file, overwrite);
    if (result.success && expandedAccordion === "rankings") {
      await getSubmittedRankingInfo();
    }
    return result;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Card>
          <CardContent>
            <Typography>Loading...</Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <div>
      <Container maxWidth="lg" sx={{ fontSize: 18, py: 5, px: { xs: 2, md: 3 } }}>
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
            {currentPollData && Object.keys(currentPollData).length > 0 && (
              <Card elevation={0} sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        {currentPollData?.title || "Poll"}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Created on {currentPollData?.creation_dt || ""}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                    <Chip 
                      icon={currentPollData?.is_closed || currentPollData?.is_completed ? <LockIcon /> : <LockOpenIcon />} 
                      label={currentPollData?.is_closed || currentPollData?.is_completed ? "Closed" : "Open"} 
                      color={currentPollData?.is_closed || currentPollData?.is_completed ? "default" : "success"}
                      variant="outlined"
                    />
                    {currentPollData?.is_private && (
                      <Chip 
                        icon={<LockIcon />} 
                        label="Private" 
                        color="secondary"
                        variant="outlined"
                      />
                    )}
                    {currentPollData?.num_ballots > 0 && (
                      <Chip 
                        icon={<PeopleIcon />} 
                        label={`${currentPollData.num_ballots} votes`} 
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}


            {/* Accordions - wrap in safety check */}
            {currentPollData && (
              <Box>
              {/* 1. Poll Status */}
              <PollStatusAccordion
                pollData={currentPollData}
                onClosePoll={closePoll}
                onOpenPoll={openPoll}
                expandedAccordion={expandedAccordion}
                setExpandedAccordion={setExpandedAccordion}
              />

              {/* 2. Update Poll Settings */}
              <PollSettingsAccordion
                currentPollData={currentPollData}
                updatedPollData={updatedPollData}
                candList={candList}
                showGetDate={showGetDate}
                closingDate={closingDate}
                dateErrorText={dateErrorText}
                onUpdatePollField={updatePollField}
                onUpdateCandList={handleUpdateCandList}
                onAddCandList={handleAddCandList}
                onRemoveCand={handleRemoveCand}
                onReset={handleReset}
                onUpdatePoll={handleUpdatePoll}
                onClosingDateChange={handleClosingDateChange}
                onShowDateToggle={handleShowDateToggle}
                expandedAccordion={expandedAccordion}
                setExpandedAccordion={setExpandedAccordion}
              />

              {/* 3. Vote in Poll */}
              <VoteAccordion
                pollData={currentPollData}
                voteUrl={voteUrl}
                voteLink={voteLink}
                onCopyLink={copyLinkToClipboard}
                expandedAccordion={expandedAccordion}
                setExpandedAccordion={setExpandedAccordion}
              />

              {/* Add Voters (for private polls) */}
              {currentPollData?.is_private && 
              !currentPollData?.is_completed && !currentPollData?.is_closed && (
                <AddVotersAccordion
                  onAddVoters={addVoters}
                  onDeleteVoter={deleteVoter}
                  onResendEmail={resendEmail}  // Changed from onGenerateNewLink
                  existingVoters={getExistingVoters()}
                  pollId={id}
                  expandedAccordion={expandedAccordion}
                  setExpandedAccordion={setExpandedAccordion}
                  // Removed onCopyLink prop as we no longer show links
                />
              )}
              {/* 4. View Results */}
              <ViewResultsAccordion
                resultsUrl={resultsUrlOid}
                resultsLink={resultsLinkOid}
                onCopyLink={copyLinkToClipboard}
                expandedAccordion={expandedAccordion}
                setExpandedAccordion={setExpandedAccordion}
              />

              {/* 5. Submitted Rankings */}
              {currentPollData && Object.keys(currentPollData).length > 0 && (
                <SubmittedRankingsAccordion
                  submittedRankingInfo={submittedRankingInfo}
                  columns={columns}
                  numRows={numRows}
                  cmap={cmap}
                  pollTitle={currentPollData?.title || ""}
                  loading={loadingRankings}
                  onExpand={getSubmittedRankingInfo}
                  expandedAccordion={expandedAccordion}
                  setExpandedAccordion={setExpandedAccordion}
                />
              )}

                {/*<PollDashboardAccordion
                  submittedRankingInfo={submittedRankingInfo}
                  candidates={currentPollData?.candidates || []}
                  loading={loadingRankings}
                  onExpand={getSubmittedRankingInfo}
                  expandedAccordion={expandedAccordion}
                  setExpandedAccordion={setExpandedAccordion}
                />

              {/* 6. Upload Rankings */}
              {!currentPollData?.is_completed && !currentPollData?.is_closed && (
                <UploadRankingsAccordion
                  candidates={currentPollData?.candidates || []}
                  onUploadRankings={handleUploadRankings}
                  expandedAccordion={expandedAccordion}
                  setExpandedAccordion={setExpandedAccordion}
                />
              )}

              {/* 7. Embed Poll - only for public polls */}
              {!currentPollData?.is_private && (
                <EmbedPollAccordion
                  pollId={id}
                  pollTitle={currentPollData?.title || ""}
                  voteUrl={voteUrl}
                  expandedAccordion={expandedAccordion}
                  setExpandedAccordion={setExpandedAccordion}
                />
              )}

              {/* 8. Delete All Ballots */}
              {!currentPollData?.is_completed && !currentPollData?.is_closed && (
                <DeleteBallotsAccordion
                  onDeleteAllBallots={deleteAllBallots}
                  numBallots={currentPollData?.num_ballots || 0}
                  expandedAccordion={expandedAccordion}
                  setExpandedAccordion={setExpandedAccordion}
                />
              )}

              {/* 9. Delete Poll */}
              <DeletePollAccordion
                onDeletePoll={handleDeletePoll}
                expandedAccordion={expandedAccordion}
                setExpandedAccordion={setExpandedAccordion}
              />
              </Box>
            )}
          </Stack>
        )}

        {/* Snackbars */}
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
        
        {/* Delete Dialog */}
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
      </Container>
    </div>
  );
};

export default Admin;