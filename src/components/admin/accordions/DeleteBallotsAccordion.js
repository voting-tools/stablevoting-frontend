import React, { useState } from 'react';
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { StyledAccordion } from '../StyledAccordion';

export const DeleteBallotsAccordion = ({ 
  onDeleteAllBallots,
  numBallots = 0,
  expandedAccordion,
  setExpandedAccordion
}) => {
  const [confirmDialog, setConfirmDialog] = useState(false);

  const handleDeleteBallots = async () => {
    await onDeleteAllBallots();
    setConfirmDialog(false);
  };

  return (
    <>
      <StyledAccordion 
        icon={<DeleteSweepIcon color="error" />} 
        title="Delete All Ballots"
        accordionKey="delete-ballots"
        expandedAccordion={expandedAccordion}
        setExpandedAccordion={setExpandedAccordion}
      >
        <Box sx={{ p: 2 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Warning</AlertTitle>
            This action cannot be undone. All submitted ballots will be permanently deleted.
          </Alert>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Chip
              icon={<HowToVoteIcon />}
              label={`${numBallots} ballot${numBallots !== 1 ? 's' : ''} submitted`}
              color={numBallots > 0 ? "primary" : "default"}
              variant="outlined"
            />
          </Box>

          {numBallots > 0 ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                This will delete all {numBallots} ballot{numBallots !== 1 ? 's' : ''} that have been submitted to this poll. 
                Voters will be able to submit new ballots after deletion.
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={() => setConfirmDialog(true)}
                startIcon={<DeleteSweepIcon />}
                sx={{ textTransform: "none" }}
              >
                Delete All Ballots
              </Button>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No ballots have been submitted to this poll yet.
            </Typography>
          )}
        </Box>
      </StyledAccordion>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
      >
        <DialogTitle>Confirm Delete All Ballots</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete all {numBallots} ballot{numBallots !== 1 ? 's' : ''}? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteBallots} 
            color="error"
            variant="contained"
          >
            Delete All Ballots
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};