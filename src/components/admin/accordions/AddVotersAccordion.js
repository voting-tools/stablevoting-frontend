import React, { useState } from 'react';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import { StyledAccordion } from '../StyledAccordion';
import { parseEmailList } from '../../../utils/pollUtils';

export const AddVotersAccordion = ({ 
  onAddVoters,
  onDeleteVoter,
  onResendEmail,
  existingVoters = [],
  pollId,
  expandedAccordion,
  setExpandedAccordion
}) => {
  const [voterEmailList, setVoterEmailList] = useState("");
  const [invalidEmail, setInvalidEmail] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState(null);
  const [resendEmailDialog, setResendEmailDialog] = useState(null);

  const handleEmailListChange = (event) => {
    const emailListStr = event.target.value;
    const { validEmails, invalidEmails } = parseEmailList(emailListStr);
    
    if (invalidEmails.length > 0) {
      setInvalidEmail(
        "Only valid emails are saved. Invalid emails: " + invalidEmails.join(",")
      );
    } else {
      setInvalidEmail("");
    }
    
    setVoterEmailList(emailListStr);
  };

  const handleAddVoters = async () => {
    const { validEmails } = parseEmailList(voterEmailList);
    const result = await onAddVoters(validEmails);
    if (result.success) {
      setVoterEmailList("");
      setInvalidEmail("");
      setShowAddDialog(false);
    }
  };

  const handleDeleteVoter = async (email) => {
    if (onDeleteVoter) {
      await onDeleteVoter(email);
    }
    setDeleteConfirmEmail(null);
  };

  const handleResendEmail = async (email) => {
    if (onResendEmail) {
      await onResendEmail(email);
    }
    setResendEmailDialog(null);
  };

  // Check if we have voter data with emails
  const hasEmailData = existingVoters.length > 0 && existingVoters.some(v => !v.email.includes("not available"));

  return (
    <>
      <StyledAccordion 
        icon={<PeopleIcon color="primary" />} 
        title="Manage Voters"
        accordionKey="add-voters"
        expandedAccordion={expandedAccordion}
        setExpandedAccordion={setExpandedAccordion}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Registered Voters ({existingVoters.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowAddDialog(true)}
              sx={{ textTransform: "none" }}
            >
              Add Voters
            </Button>
          </Box>

          {existingVoters.length > 0 ? (
            <>
              {!hasEmailData && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  This poll was created before email tracking was implemented. Voter emails are not available for existing voters.
                </Alert>
              )}
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Invitations Sent</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {existingVoters.map((voter, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{voter.email}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {voter.emailsSent || 1}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Tooltip title={hasEmailData ? "Resend invitation email" : "Not available for legacy voters"}>
                              <span>
                                <IconButton 
                                  size="small" 
                                  onClick={() => setResendEmailDialog(voter.email)}
                                  color="primary"
                                  disabled={!hasEmailData}
                                >
                                  <SendIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title={hasEmailData ? "Delete voter" : "Not available for legacy voters"}>
                              <span>
                                <IconButton 
                                  size="small" 
                                  onClick={() => setDeleteConfirmEmail(voter.email)}
                                  color="error"
                                  disabled={!hasEmailData}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', mb: 2 }}>
              <Typography color="text.secondary">
                No voters have been added yet. Click "Add Voters" to get started.
              </Typography>
            </Paper>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Each voter receives a unique link via email to access the poll. 
            To maintain ballot secrecy, individual voting status is not displayed.
          </Typography>
        </Box>
      </StyledAccordion>

      {/* Add Voters Dialog */}
      <Dialog 
        open={showAddDialog} 
        onClose={() => setShowAddDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Voters</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter email addresses separated by commas, spaces, or new lines. 
            Each voter will receive a unique voting link via email.
          </DialogContentText>
          <TextField
            label="Email Addresses"
            multiline
            fullWidth
            rows={4}
            error={invalidEmail.length > 0}
            helperText={invalidEmail.length > 0 ? invalidEmail : null}
            value={voterEmailList}
            onChange={handleEmailListChange}
            variant="outlined"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowAddDialog(false);
            setVoterEmailList("");
            setInvalidEmail("");
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddVoters} 
            variant="contained"
            disabled={voterEmailList.length === 0}
          >
            Add Voters
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmEmail !== null}
        onClose={() => setDeleteConfirmEmail(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove <strong>{deleteConfirmEmail}</strong> from the voter list? 
            This will also delete any ballot they have submitted. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmEmail(null)}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleDeleteVoter(deleteConfirmEmail)} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Resend Email Dialog */}
      <Dialog
        open={resendEmailDialog !== null}
        onClose={() => setResendEmailDialog(null)}
      >
        <DialogTitle>Resend Invitation Email</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Send another invitation email to <strong>{resendEmailDialog}</strong>? 
            This will generate a new voting link and invalidate any previous links.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResendEmailDialog(null)}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleResendEmail(resendEmailDialog)} 
            color="primary"
            variant="contained"
            startIcon={<SendIcon />}
          >
            Resend Email
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};