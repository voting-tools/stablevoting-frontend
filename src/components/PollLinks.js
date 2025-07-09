import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import axios from "axios";
import { isValidEmail } from "./helpers";
import { URL, API_URL } from "./helpers";
import { useNewPollState } from "./NewPollStore";
import moment from "moment";

// Icons
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import BarChartIcon from "@mui/icons-material/BarChart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Styled component for link display
const LinkDisplay = ({ icon, title, description, link, url, onCopy, variant = "default" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await onCopy(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          bgcolor: 'primary.50',
          borderColor: 'primary.200',
          iconBg: 'primary.100',
          iconColor: 'primary.main'
        };
      case "success":
        return {
          bgcolor: 'success.50',
          borderColor: 'success.200',
          iconBg: 'success.100',
          iconColor: 'success.main'
        };
      case "warning":
        return {
          bgcolor: 'warning.50',
          borderColor: 'warning.200',
          iconBg: 'warning.100',
          iconColor: 'warning.main'
        };
      default:
        return {
          bgcolor: 'grey.50',
          borderColor: 'grey.300',
          iconBg: 'grey.100',
          iconColor: 'grey.700'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        borderColor: styles.borderColor,
        bgcolor: styles.bgcolor,
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: styles.iconColor,
          boxShadow: 1
        }
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: styles.iconBg,
            color: styles.iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {description}
            </Typography>
          )}
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              display: 'flex', 
              alignItems: 'center',
              bgcolor: 'background.paper',
              borderRadius: 1,
              gap: 2
            }}
          >
            <Link 
              to={link} 
              style={{ 
                flex: 1, 
                wordBreak: 'break-all',
                color: '#1976d2',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              {url}
            </Link>
            <Button
              size="small"
              variant="outlined"
              onClick={handleCopy}
              startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
              sx={{ 
                minWidth: 'auto',
                color: copied ? 'success.main' : 'primary.main',
                borderColor: copied ? 'success.main' : 'primary.main',
                '&:hover': {
                  borderColor: copied ? 'success.dark' : 'primary.dark',
                }
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </Paper>
        </Box>
      </Stack>
    </Paper>
  );
};

// Email section component
const EmailSection = ({ 
  title, 
  description, 
  value, 
  onChange, 
  error, 
  onSend, 
  disabled,
  buttonText = "Send Email" 
}) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <EmailIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
        <Stack spacing={3}>
          <TextField
            label="Email addresses"
            multiline
            rows={3}
            fullWidth
            error={error.length > 0}
            helperText={error.length > 0 ? error : "Separate multiple emails with commas, spaces, or new lines"}
            value={value}
            onChange={onChange}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper'
              }
            }}
          />
          <Button
            variant="contained"
            disabled={disabled}
            onClick={onSend}
            startIcon={<SendIcon />}
            sx={{ 
              alignSelf: 'flex-start',
              textTransform: 'none',
              px: 3
            }}
          >
            {buttonText}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export const PollLinks = ({ handleReset }) => {
  const newPollState = useNewPollState();
  const [emailList, setEmailList] = useState([]);
  const [emailListStr, setEmailListStr] = useState("");
  const [invalidEmail, setInvalidEmail] = useState("");
  const [ownerEmailList, setOwnerEmailList] = useState([]);
  const [ownerEmailListStr, setOwnerEmailListStr] = useState("");
  const [ownerInvalidEmail, setOwnerInvalidEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  async function copyLinkToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

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
        "Invalid emails: " + invalidEmails.join(", ")
      );
    } else {
      setInvalidEmail("");
    }
    setEmailListStr(emailListStr);
    setEmailList(validEmails);
  };

  const handleOwnerEmails = (event) => {
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
      setOwnerInvalidEmail(
        "Invalid emails: " + invalidEmails.join(", ")
      );
    } else {
      setOwnerInvalidEmail("");
    }
    setOwnerEmailListStr(emailListStr);
    setOwnerEmailList(validEmails);
  };

  // URLs construction
  const voteUrl = `${URL}/vote/` + newPollState.id.get();
  const voteUrlOid = `${URL}/vote/` + newPollState.id.get() + "?oid=" + newPollState.owner_id.get();
  const voteLink = "/vote/" + newPollState.id.get();
  const resultsLink = "/results/" + newPollState.id.get();
  const resultsUrl = `${URL}/results/` + newPollState.id.get();
  const resultsLinkOid = "/results/" + newPollState.id.get() + "?oid=" + newPollState.owner_id.get();
  const resultsUrlOid = `${URL}/results/` + newPollState.id.get() + "?oid=" + newPollState.owner_id.get();
  const adminLink = "/admin/" + newPollState.id.get() + "?oid=" + newPollState.owner_id.get();
  const adminUrl = `${URL}/admin/` + newPollState.id.get() + "?oid=" + newPollState.owner_id.get();

  const handleSendEmails = () => {
    axios
      .post(
        `${API_URL}/emails/send_to_voters/${newPollState.id.get()}?oid=${newPollState.owner_id.get()}`,
        {
          emails: emailList,
          link: voteUrl,
          title: newPollState.title.get(),
          description: newPollState.description.get(),
        }
      )
      .then((resp) => {
        setShowMessage(true);
        setMessage(
          "The vote link was sent to " +
            (emailList.length === 1
              ? "1 person."
              : emailList.length.toString() + " people.")
        );
        setEmailListStr("");
        setEmailList([]);
      })
      .catch((err) => {
        setShowErrorMessage(true);
        setErrorMessage("Error sending email. Please try again.");
      });
  };

const handleSendOwnerEmail = () => {
  axios
    .post(
      `${API_URL}/emails/send_to_owner/${newPollState.id.get()}?oid=${newPollState.owner_id.get()}`,
      {
        emails: ownerEmailList,
        title: newPollState.title.get(),
        description: newPollState.description.get() || null,  // <- Added description field
        vote_link: voteUrlOid,
        results_link: resultsUrlOid,
        admin_link: adminUrl,
        is_private: newPollState.is_private.get(),
        closing_datetime:
          newPollState.closing_datetime.get() !== null
            ? moment(newPollState.closing_datetime.get()).format(
                "MMMM Do YYYY, h:mm a"
              )
            : null,   
      }
    )
    .then((resp) => {
      setShowMessage(true);
      setMessage("Email sent successfully.");
      setOwnerEmailListStr("");
      setOwnerEmailList([]);
    })
    .catch((err) => {
      console.error("Error sending owner email:", err);  // <- Added for debugging
      setShowErrorMessage(true);
      setErrorMessage("Error sending email. Please try again.");
    });
};

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Your Poll Has Been Created!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Share these links to start collecting votes and manage your poll
        </Typography>
      </Box>

      {/* Poll Status Chips */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'center' }}>
        <Chip 
          icon={newPollState.is_private.get() ? <LockIcon /> : <PublicIcon />} 
          label={newPollState.is_private.get() ? "Private Poll" : "Public Poll"} 
          color={newPollState.is_private.get() ? "warning" : "primary"}
          variant="outlined"
        />
        {newPollState.closing_datetime.get() && (
          <Chip 
            label={`Closes: ${moment(newPollState.closing_datetime.get()).format("MMM D, YYYY h:mm A")}`}
            variant="outlined"
          />
        )}
      </Box>

      <Stack spacing={4}>
        {/* Voting Link Section */}
        {newPollState.is_private.get() ? (
          <Alert 
            severity="info" 
            icon={<LockIcon />}
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: 28
              }
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>Private Poll</Typography>
            <Typography variant="body2">
              An email was sent to{" "}
              <strong>
                {newPollState.voter_emails.get().length === 1
                  ? "1 person"
                  : newPollState.voter_emails.get().length.toString() + " people"}
              </strong>{" "}
              with{" "}
              {newPollState.voter_emails.get().length === 1
                ? "a personalized link"
                : "personalized links"}{" "}
              to vote in the poll.
            </Typography>
          </Alert>
        ) : (
          <>
            <LinkDisplay
              icon={<HowToVoteIcon sx={{ fontSize: 28 }} />}
              title="Voting Link"
              description="Share this link with people you want to vote in your poll"
              link={voteLink}
              url={voteUrl}
              onCopy={copyLinkToClipboard}
              variant="primary"
            />
            
            {/* Email voters section for public polls */}
            <EmailSection
              title="Send Voting Link via Email"
              description="Enter email addresses to send the voting link. No emails will be saved."
              value={emailListStr}
              onChange={handleEmailList}
              error={invalidEmail}
              onSend={handleSendEmails}
              disabled={emailList.length === 0}
            />
          </>
        )}

        {/* Results Link Section */}
        <LinkDisplay
          icon={<BarChartIcon sx={{ fontSize: 28 }} />}
          title="Results Link"
          description={
            !newPollState.show_outcome.get() 
              ? "This private link allows you to view the poll results"
              : newPollState.closing_datetime.get() != null && !newPollState.can_view_outcome_before_closing.get()
              ? `Public results will be available after ${moment(newPollState.closing_datetime.get()).format("MMMM Do YYYY, h:mm a")}`
              : "Anyone with this link can view the poll results"
          }
          link={!newPollState.show_outcome.get() ? resultsLinkOid : resultsLink}
          url={!newPollState.show_outcome.get() ? resultsUrlOid : resultsUrl}
          onCopy={copyLinkToClipboard}
          variant="success"
        />

        {/* Admin Link Section */}
        <LinkDisplay
          icon={<AdminPanelSettingsIcon sx={{ fontSize: 28 }} />}
          title="Admin Link"
          description="Use this link to manage your poll settings, view detailed results, and more"
          link={adminLink}
          url={adminUrl}
          onCopy={copyLinkToClipboard}
          variant="warning"
        />

        <Divider sx={{ my: 2 }} />

        {/* Send all links via email */}
        <EmailSection
          title="Send All Links to Yourself"
          description="Get all the above links sent to your email for safekeeping. No emails will be saved."
          value={ownerEmailListStr}
          onChange={handleOwnerEmails}
          error={ownerInvalidEmail}
          onSend={handleSendOwnerEmail}
          disabled={ownerEmailList.length === 0}
          buttonText="Send All Links"
        />

        {/* Create new poll button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleReset}
            startIcon={<AddIcon />}
            sx={{ 
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1.1rem',
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4
              }
            }}
          >
            Create Another Poll
          </Button>
        </Box>
      </Stack>

      {/* Snackbars */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showErrorMessage}
        autoHideDuration={4000}
        onClose={() => setShowErrorMessage(false)}
      >
        <Alert
          onClose={() => setShowErrorMessage(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showMessage}
        autoHideDuration={4000}
        onClose={() => setShowMessage(false)}
      >
        <Alert
          onClose={() => setShowMessage(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PollLinks;