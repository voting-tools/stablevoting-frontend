import React from 'react';
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import PeopleIcon from '@mui/icons-material/People';
import DownloadIcon from '@mui/icons-material/Download';
import { CSVLink } from "react-csv";
import Profile from "../../Profile";
import { StyledAccordion } from '../StyledAccordion';
import { candListToRankedStr } from '../../../utils/pollUtils';

export const SubmittedRankingsAccordion = ({ 
  submittedRankingInfo,
  columns,
  numRows,
  cmap,
  pollTitle,
  loading,
  onExpand,
  expandedAccordion,
  setExpandedAccordion
}) => {
  return (
    <StyledAccordion 
      onExpand={onExpand}
      icon={<PeopleIcon color="primary" />} 
      title="Submitted Rankings"
      accordionKey="rankings"
      expandedAccordion={expandedAccordion}
      setExpandedAccordion={setExpandedAccordion}
    >
      {loading ? (
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
                      filename={'submitted_rankings-' + pollTitle + '.csv'}
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
  );
};