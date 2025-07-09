import React, { useState } from 'react';
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import { CSVLink } from "react-csv";
import { StyledAccordion } from '../StyledAccordion';
import { FileUpload } from '../FileUpload';

export const UploadRankingsAccordion = ({ 
  candidates,
  onUploadRankings,
  expandedAccordion,
  setExpandedAccordion
}) => {
  const [rankingsFile, setRankingsFile] = useState(null);
  const [overwriteBallots, setOverwriteBallots] = useState(false);

  const handleUploadRankings = async () => {
    if (!rankingsFile || rankingsFile.length === 0) {
      return;
    }
    
    const result = await onUploadRankings(rankingsFile[0], overwriteBallots);
    if (result.success) {
      setRankingsFile(null);
      setOverwriteBallots(false);
    }
  };

  return (
    <StyledAccordion 
      icon={<UploadFileIcon color="primary" />} 
      title="Upload Rankings"
      accordionKey="upload"
      expandedAccordion={expandedAccordion}
      setExpandedAccordion={setExpandedAccordion}
    >
      <Box sx={{ p: 2 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          The header row of the CSV file must contain all the candidates, one in each column. 
          Each row describes a ranking. The last column is the number of copies of each ballot 
          to submit (if blank, one copy will be submitted).
        </Alert>
        <Typography variant="body2" sx={{ mb: 3 }}>
          <strong>Example:</strong> "A,B,C,D\n1,1,2,3,3\n3,1,2,4" represents 4 rankings: 
          3 copies of the ranking with A and B tied for 1st, C in 2nd place and D in 3rd place, 
          and the fourth ranking has B in first place, C in 2nd place, A in 3rd place and D in 4th place.
        </Typography>
        
        {candidates && candidates.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <CSVLink 
              data={[candidates]} 
              filename={'stablevoting-poll.csv'}
              style={{ textDecoration: 'none' }}
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                sx={{ textTransform: 'none' }}
              >
                Download sample CSV file
              </Button>
            </CSVLink>
          </Box>
        )}

        <FileUpload
          title="Upload Rankings CSV"
          buttonText="Choose CSV File"
          value={rankingsFile}
          onChange={setRankingsFile}
          accept=".csv"
        />
        
        <Box sx={{ mt: 3 }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={overwriteBallots}
                  onChange={() => setOverwriteBallots(!overwriteBallots)}
                />
              }
              label="Overwrite existing ballots"
            />
          </FormGroup>
          <Button
            variant="contained"
            onClick={handleUploadRankings}
            disabled={!rankingsFile || rankingsFile.length === 0}
            sx={{ mt: 2, textTransform: "none" }}
            startIcon={<UploadFileIcon />}
          >
            Add Rankings to Poll
          </Button>
        </Box>
      </Box>
    </StyledAccordion>
  );
};