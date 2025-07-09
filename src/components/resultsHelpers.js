import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { grey } from "@mui/material/colors";
import Popover from "@mui/material/Popover";
import deepEqual from 'deep-equal';

export const HideExplanationButton = ({
  buttonText,
  handleClick,
  handleClickParam,
}) => {
  return (
    <Button
      variant="text"
      onClick={() => {
        handleClick(handleClickParam);
      }}
      sx={{
        fontSize: "inherit",
        color: "inherit",
        textTransform: "none",
        fontStyle: "inherit",
        lineHeight: 1,
        marginTop: 0,
        marginBottom: "1px",
        padding: "4px",
      }}
    >
      <KeyboardArrowUpIcon sx={{ marginRight: "3px" }} />
      {buttonText}
    </Button>
  );
};

export const ShowExplanationButton = ({
  buttonText,
  handleClick,
  handleClickParam,
}) => {
  return (
    <Button
      variant="text"
      onClick={() => {
        handleClick(handleClickParam);
      }}
      sx={{
        fontSize: "inherit",
        color: "inherit",
        textTransform: "none",
        fontStyle: "inherit",
        lineHeight: 1,
        marginTop: 0,
        marginBottom: "1px",
        padding: "4px",
      }}
    >
      <QuestionAnswerOutlinedIcon sx={{ marginRight: "3px" }} />
      {buttonText}
    </Button>
  );
};

export const UndefeatedCandidateText = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <span>
      <Typography
        component="span"
        aria-owns={open ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        sx={{
          font: "inherit",
          textDecoration: "underline",
          textDecorationStyle: "dotted",
          textDecorationColor: grey[600],
          cursor: "help",
        }}
      >
        undefeated candidate
      </Typography>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
          width: "75%",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 2, backgroundColor: grey[200] }}>
          <Box sx={{ paddingBottom: 1 }}>
            According to Stable Voting, if there is only one undefeated
            candidate, that candidate wins the election.
          </Box>

          <Box sx={{ paddingBottom: 1 }}>
            The <em>margin of</em> a candidate A vs. a candidate B is the number
            of voters who rank A above B minus the number of voters who rank B
            above A. If the margin is positive, it is a margin of victory for A;
            if the margin is negative, it is a margin of loss for A.
          </Box>
          <Box sx={{ paddingBottom: 1 }}>
            We resolve majority cycles as follows:
            <ul>
              <li>
                For each majority cycle, the match with the smallest margin of
                victory is discarded. For example, if A wins against B by 1,000
                votes, B wins against C by 2,000 votes, and C wins against A by
                3,000 votes, then A's win against B is discarded.
              </li>
              <li>
                The wins in the remaining matches are considered{" "}
                <em>defeats</em> of the losing candidates.
              </li>
            </ul>
          </Box>
        </Typography>
      </Popover>
    </span>
  );
};

export const undefeatedCandsStr = (cands) => {
  const numCands = cands.length;

  if (numCands === 0) {
    return "";
  } else if (numCands === 1) {
    return cands[0].toString() + " is the only candidate ";
  } else {
    const lastCand = cands[numCands - 1];
    return (
      cands.slice(0, -1).join(", ") +
      " and " +
      lastCand.toString() + " are the only candidates "
    );
  }
};

export const undefeatedCandsStr2 = (cands) => {
  const numCands = cands.length;

  if (numCands === 0) {
    return "";
  } else if (numCands === 1) {
    return cands[0].toString() + " is the only undefeated candidate. ";
  } else {
    const lastCand = cands[numCands - 1];
    return (
      cands.slice(0, -1).join(", ") +
      " and " +
      lastCand.toString() + " are the only undefeated candidates. "
    );
  }
};


export const listToStr = (list) => {
  if (list.length === 1) {
    return list[0];
  } else if (list.length === 2) {
    return list[0] + " and " + list[1];
  } else {
    const lastCand = list[list.length - 1];
    return list.slice(0, -1).join(", ") + ", and " + lastCand;
  }
};

export const listStrToStr = (listStr, cmap) => {
  const list = listStr.split(",");
  return listToStr(list.map((x)=>cmap[x]));
};

export const winnerStr = (winners) => {
  const numWinners = winners.length;

  if (numWinners === 0) {
    return "";
  } else if (numWinners === 1) {
    return "Stable Voting winner is " + winners[0].toString();
  } else {
    const lastWinner = winners[numWinners - 1];
    return (
      "Stable Voting winners are " +
      winners.slice(0, -1).join(", ") +
      " and " +
      lastWinner.toString()
    );
  }
};

export const winnerStr2 = (winners) => {
  const numWinners = winners.length;

  if (numWinners === 0) {
    return "";
  } else if (numWinners === 1) {
    return winners[0].toString() + " is the Stable Voting winner";
  } else {
    const lastWinner = winners[numWinners - 1];
    return (
      winners.slice(0, -1).join(", ") +
      " and " +
      lastWinner.toString() +
      " are Stable Voting winners"
    );
  }
};



export const winnerStr3 = (winners) => {
  const numWinners = winners.length;

  if (numWinners === 0) {
    return "";
  } else if (numWinners === 1) {
    return "winner is " + winners[0].toString();
  } else {
    const lastWinner = winners[numWinners - 1];
    return (
      "winners are " +
      winners.slice(0, -1).join(", ") +
      " and " +
      lastWinner.toString()
    );
  }
};

export const areEqual = (prevProps, nextProps) => {
  console.log("areEqual return TRUE!!!"); 
  console.log(prevProps); 
  console.log("nextProps"); 
  console.log(nextProps); 
  console.log(deepEqual(prevProps, nextProps)); 
  return deepEqual(prevProps, nextProps);
};