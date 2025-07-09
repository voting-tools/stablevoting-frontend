import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import BarChartIcon from '@mui/icons-material/BarChart';
import BallotIcon from '@mui/icons-material/Ballot';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import LinkIcon from '@mui/icons-material/Link';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PersonIcon from '@mui/icons-material/Person';

const MetricCard = ({ icon, label, value, subtitle, color = 'primary' }) => (
  <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: `${color}.50`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {React.cloneElement(icon, { sx: { color: `${color}.main` } })}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const CandidateRankingBar = ({ candidate, count, maxCount }) => {
  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
  
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="body2" fontWeight="medium">
          {candidate}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {count} ballot{count !== 1 ? 's' : ''}
        </Typography>
      </Stack>
      <LinearProgress 
        variant="determinate" 
        value={percentage} 
        sx={{ 
          height: 8, 
          borderRadius: 1,
          bgcolor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            borderRadius: 1,
            bgcolor: 'primary.main'
          }
        }} 
      />
    </Box>
  );
};

export const PollDashboardAccordion = ({ 
  submittedRankingInfo, 
  candidates = [],
  loading = false,
  onExpand,
  expandedAccordion,
  setExpandedAccordion 
}) => {
  const handleAccordionChange = (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? 'dashboard' : false);
    if (isExpanded && onExpand) {
      onExpand();
    }
  };

  // Calculate metrics from the actual ballot data
  const metrics = React.useMemo(() => {
    if (!submittedRankingInfo || !submittedRankingInfo.rankings) {
      return {
        totalBallots: 0,
        lastSubmittedTime: "No submissions yet",
        bulletVotes: 0,
        ballotsWithTies: 0,
        completeBallotsNoTies: 0,
        candidateRankings: candidates.map(c => ({ candidate: c, count: 0 }))
      };
    }

    const ballots = submittedRankingInfo.rankings;
    const totalBallots = ballots.length;

    // Calculate last submission time
    const lastBallot = ballots[0]; // Assuming sorted by most recent
    const lastSubmittedTime = lastBallot.created_dt 
      ? formatTimeAgo(new Date(lastBallot.created_dt))
      : "Unknown";

    // Initialize counters
    let bulletVotes = 0;
    let ballotsWithTies = 0;
    let completeBallotsNoTies = 0;
    const candidateRankingCounts = {};

    candidates.forEach(candidate => {
      candidateRankingCounts[candidate] = 0;
    });

    // Process each ballot
    ballots.forEach(ballot => {
      const ranking = ballot.ranking || [];
      const rankedCandidates = new Set();
      const rankPositions = {};
      let hasTies = false;

      // Parse the ranking data
      ranking.forEach((candidateRank, index) => {
        const rankValue = parseInt(candidateRank);
        if (!isNaN(rankValue) && rankValue > 0) {
          rankedCandidates.add(candidates[index]);
          
          // Check for ties
          if (!rankPositions[rankValue]) {
            rankPositions[rankValue] = [];
          }
          rankPositions[rankValue].push(candidates[index]);
          
          // Count this candidate as ranked
          candidateRankingCounts[candidates[index]]++;
        }
      });

      // Check if ballot has ties
      hasTies = Object.values(rankPositions).some(positions => positions.length > 1);
      if (hasTies) {
        ballotsWithTies++;
      }

      // Count bullet votes (only one candidate ranked)
      if (rankedCandidates.size === 1) {
        bulletVotes++;
      }

      // Complete ballots with no ties
      if (rankedCandidates.size === candidates.length && !hasTies) {
        completeBallotsNoTies++;
      }
    });

    const candidateRankings = Object.entries(candidateRankingCounts)
      .map(([candidate, count]) => ({ candidate, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalBallots,
      lastSubmittedTime,
      bulletVotes,
      ballotsWithTies,
      completeBallotsNoTies,
      candidateRankings
    };
  }, [submittedRankingInfo, candidates]);

  const maxCandidateCount = Math.max(...metrics.candidateRankings.map(c => c.count), 1);

  return (
    <Accordion
      expanded={expandedAccordion === 'dashboard'}
      onChange={handleAccordionChange}
      sx={{ mb: 2 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <BarChartIcon color="primary" />
          <Box>
            <Typography variant="h6">Voting Statistics Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">
              View detailed ballot analytics and voting patterns
            </Typography>
          </Box>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        {loading ? (
          <Typography>Loading statistics...</Typography>
        ) : (
          <Box sx={{ width: '100%' }}>
            {/* Main Metrics Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <MetricCard
                  icon={<BallotIcon />}
                  label="Total Ballots"
                  value={metrics.totalBallots}
                  color="primary"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <MetricCard
                  icon={<AccessTimeIcon />}
                  label="Last Submission"
                  value={metrics.lastSubmittedTime}
                  color="info"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <MetricCard
                  icon={<RadioButtonCheckedIcon />}
                  label="Bullet Votes"
                  value={metrics.bulletVotes}
                  subtitle="Ranked only one candidate"
                  color="warning"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <MetricCard
                  icon={<LinkIcon />}
                  label="Ballots with Ties"
                  value={metrics.ballotsWithTies}
                  subtitle="Same rank for multiple candidates"
                  color="secondary"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <MetricCard
                  icon={<DoneAllIcon />}
                  label="Complete Ballots"
                  value={metrics.completeBallotsNoTies}
                  subtitle="All candidates ranked, no ties"
                  color="success"
                />
              </Grid>
            </Grid>

            {/* Candidate Rankings */}
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <PersonIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="medium">
                  Candidate Rankings
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  (Ballots that ranked each candidate)
                </Typography>
              </Stack>
              
              {metrics.candidateRankings.length > 0 ? (
                metrics.candidateRankings.map((item, index) => (
                  <CandidateRankingBar
                    key={index}
                    candidate={item.candidate}
                    count={item.count}
                    maxCount={maxCandidateCount}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No candidate data available
                </Typography>
              )}
            </Paper>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

// Helper function to format time ago
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minute${Math.floor(seconds / 60) !== 1 ? 's' : ''} ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) !== 1 ? 's' : ''} ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) !== 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};