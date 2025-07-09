// Replace the entire Demo.js file with this fixed version:

import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import RankingInput from "./RankingInput";
import { Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { COLORS_RGB, API_URL } from "./helpers";
import Profile from "./Profile";
import Results from "./Results";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Title = styled(Box)(({ theme }) => ({
  fontSize: 24,
  color: "#1080c3",
  fontWeight: 600,
  marginBottom: 20,
  marginTop: 20,
}));

export function Demo() {
  const [rankings, setRankings] = useState([
    { num: 1, ranking: { A: 1, B: 2, C: 3 } },
    { num: 1, ranking: { A: 1, B: 2, C: 1 } },
    { num: 1, ranking: { A: 2, B: 1, C: 2 } },
    { num: 1, ranking: { A: 1, B: 2 } },
  ]);
  const [candidates, setCandidates] = useState(["A", "B", "C"]);
  const [cmap, setCmap] = useState({"A": "A", "B": "B", "C": "C"});
  const [columns, setColumns] = useState({ "columns": [[1, "A", "B", "C"], [1, "A,C", "B", ""], [1, "B", "A,C", ""], [1, "A", "B", ""]], "numRows": 3 });
  const [showInputRankings, setShowInputRankings] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    generateColumns();
  }, [rankings]);

  const handleChangeCandidates = (numCands) => {
    if (numCands < 2 || numCands > 10) {
      return;
    }
    const candNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    var newCandidates = candNames.slice(0, numCands);

    var newRankings = rankings.map((r, ridx) => {
      let newR = Object.fromEntries(Object.entries(r["ranking"]).filter(([key]) => newCandidates.includes(key) && r["ranking"][key] <= numCands));
      return { "num": r["num"], "ranking": newR };
    });

    setCandidates(newCandidates);
    setRankings(newRankings);
    setCmap(Object.fromEntries(newCandidates.map((c) => [c, c])));
    // Reset results when candidates change
    setShowResults(false);
  };

  const handleChangeRankingNum = (num, ridx) => {
    var newRankings = [...rankings];
    newRankings[ridx]["num"] = parseInt(num) || 0;
    setRankings(newRankings);
  };

  const handleDeleteRanking = (ridx) => {
    const newRankings = rankings.filter((_, index) => index !== ridx);
    setRankings(newRankings);
  };

  const handleAddRanking = () => {
    setRankings([...rankings, { num: 0, ranking: {} }]);
  };

  const handleUpdateRanking = (newRanking, ridx) => {
    var newRankings = [...rankings];
    newRankings[ridx]["ranking"] = newRanking;
    setRankings(newRankings);
  };

  const generateColumns = () => {
    var newColumns = [];

    let maxRank = 1;
    for (const ridx in rankings) {
      const rankingValues = Object.values(rankings[ridx]["ranking"]);
      if (rankingValues.length > 0) {
        let currMaxRank = Math.max(...rankingValues);
        if (currMaxRank > maxRank) {
          maxRank = currMaxRank;
        }
      }
    }
    
    rankings.forEach((r, ridx) => {
      if (parseInt(r["num"]) > 0) {
        var col = [];
        col.push(r["num"]);
        var rankingEntries = Object.entries(r["ranking"]);

        for (var rank = 1; rank <= maxRank; rank++) {
          var cList = [];
          for (var re_idx = 0; re_idx < rankingEntries.length; re_idx++) {
            if (rankingEntries[re_idx][1] === rank) {
              cList.push(rankingEntries[re_idx][0]);
            }
          }
          if (cList.length > 0) {
            col.push(cList.join(","));
          } else {
            col.push("");
          }
        }
        newColumns.push(col);
      }
    });
    
    setColumns({ "columns": newColumns, "numRows": maxRank });
  };

  const handleToggleResults = () => {
    setShowResults(!showResults);
  };

  // Get valid rankings for display
  const getValidRankings = () => {
    return rankings.filter(r => r.num > 0);
  };

  console.log("rankings", rankings);
  
  return (
    <div>
      <Container
        maxWidth={false}
        sx={{
          width: "100%",
          marginTop: "50px",
          maxWidth: 1000,
          paddingLeft: 5,
          paddingRight: 5,
          marginBottom: 20
        }}
      >
        <Title>Demo</Title>
        <Box sx={{ fontSize: 20, marginBottom: 5 }}>
          Create a demo poll to see Stable Voting in action.
        </Box>

        <Box sx={{ marginBottom: 5 }}>
          <Box component="span" sx={{ display: "inline-block", paddingTop: "10px", marginRight: 3 }}>
            <Typography component="span" sx={{ fontSize: 20, paddingTop: 5 }}>
              Number of Candidates:
            </Typography>
          </Box>
          <Box component="span">
            <Slider
              value={candidates.length}
              getAriaValueText={() => candidates.length.toString()}
              step={1}
              marks
              min={2}
              max={10}
              valueLabelDisplay="on"
              onChange={(ev) => { handleChangeCandidates(ev.target.value) }}
              sx={{ width: "300px", padding: 0, paddingTop: matches ? 13 : 0 }}
            />
          </Box>
        </Box>

        <Button
          variant="text"
          sx={{
            fontSize: 20,
            color: "inherit",
            textTransform: "none",
            "&:hover": {
              backgroundColor: `rgba(${COLORS_RGB.secondary},0.5)`,
            },
            backgroundColor: `rgba(${COLORS_RGB.secondary},0.5)`,
            fontStyle: "inherit",
            textAlign: "left",
          }}
          onClick={() => {
            setShowInputRankings(!showInputRankings);
          }}
        >
          {showInputRankings
            ? "Hide the form to input rankings in the demo poll"
            : "Change the rankings in the demo poll"}{" "}
          {showInputRankings ? (
            <KeyboardArrowDownIcon />
          ) : (
            <KeyboardArrowRightIcon />
          )}{" "}
        </Button>
        
        {showInputRankings ?
          <Box sx={{ fontSize: 20, marginTop: 5 }}>
            Drag the candidates to create a ranking. A voter who leaves a candidate unranked will have no effect on that candidate's performance against other candidates in the poll.
          </Box> : <div />}

        <Collapse in={showInputRankings}>
          <Box
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              paddingTop: 5,
              paddingBottom: 5
            }}
          >
            <Box>
              <Grid container spacing={2}>
                {rankings.map((r, ridx) => {
                  return (
                    <Grid key={"ranking" + ridx.toString()} xs={12} sm={6}>
                      <Item elevation={0}>
                        <Box>
                          <Box>
                            <Grid container spacing={1}>
                              <Grid xs={12} sm={2}></Grid>
                              <Grid xs={12} sm={8}>
                                <TextField
                                  id="outlined-number"
                                  label="Number of voters"
                                  type="number"
                                  value={r["num"]}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  sx={{ marginLeft: 0 }}
                                  onChange={(ev) => { handleChangeRankingNum(ev.target.value, ridx) }}
                                />
                              </Grid>
                              <Grid xs={12} sm={2}>
                                <IconButton 
                                  aria-label="delete" 
                                  onClick={() => handleDeleteRanking(ridx)}
                                  sx={{ marginLeft: 0 }}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </Box>
                        </Box>
                        <Box sx={{ marginTop: 2 }}>
                          <RankingInput 
                            key={"rankinginput" + ridx.toString()}
                            theCandidates={candidates} 
                            currRanking={r["ranking"]} 
                            handleUpdateRanking={(newR) => { handleUpdateRanking(newR, ridx) }} 
                            tightLayout={true} 
                          />
                        </Box>
                      </Item>
                    </Grid>
                  );
                })}
              </Grid>
              <Button variant="contained" onClick={handleAddRanking} sx={{ marginTop: 3 }}>
                Add ranking
              </Button>
            </Box>
          </Box>
        </Collapse>
        
        <Box sx={{ marginTop: 5, marginBottom: 10 }}>
          {columns != undefined && <Profile cmap={cmap} columnData={columns} />}
        </Box>
        
        <Box sx={{ textAlign: "center", marginBottom: 5 }}>
          <Button
            sx={{ fontSize: 18, width: "50%", marginTop: 2, textTransform: "none" }}
            variant="contained"
            onClick={handleToggleResults}
            disabled={getValidRankings().length === 0}
          >
            {showResults ? "Hide results" : "Find Stable Voting winner(s)"}
          </Button>
          {getValidRankings().length === 0 && (
            <Typography sx={{ mt: 1, color: 'text.secondary' }}>
              Please add at least one ranking with voters to see results
            </Typography>
          )}
        </Box>
        
        <Collapse in={showResults}>
          <Box sx={{ border: "1px solid grey", borderRadius: 2, padding: 2 }}>
            <Results demoRankings={getValidRankings()} />
          </Box>
        </Collapse>
      </Container>
    </div>
  );
}

export default Demo;