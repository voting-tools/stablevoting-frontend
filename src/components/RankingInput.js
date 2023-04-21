import React, { useState, useEffect } from "react";

import { DragDropContext } from "react-beautiful-dnd";
import CandidateBox from "./CandidateBox";
import Box from "@mui/material/Box";
import Zoom from "@mui/material/Zoom";
import Chip from "@mui/material/Chip";
import UndoIcon from '@mui/icons-material/Undo';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import { rankLabels, shortRankLabels } from "./helpers";

export const RankingInput = ({ 
  theCandidates, 
  currRanking, 
  handleUpdateRanking, 
  tightLayout,
  onlyDisplay
   }) => {
  const [rankingState, setRankingState] = useState({
    candidates: {},
    candBoxes: {
      candidates: {
        id: "candidates",
        title: "Candidates",
        candIds: [],
      },
    },
    candBoxOrder: ["candidates"],
  });
  const [candidates, setCandidates] = useState([]);
  const [hasUnrankedCandidates, setHasUnrankedCandidates] = useState(theCandidates);

  
  useEffect(() => {

    var ranking = currRanking;
    const existingVote = Object.keys(ranking).length !== 0

    var candidates = Object.fromEntries(
      theCandidates.map((c, idx) => [
        `cand-${idx + 1}`,
        { id: `cand-${idx + 1}`, name: c },
      ])
    );
    var candIds = theCandidates.map((c, idx) => `cand-${idx + 1}`);

    var ranks = theCandidates.map((c, idx) => `rank-${idx + 1}`);
    var rankBoxes = Object.fromEntries(
      theCandidates.map((c, idx) => [
        `rank-${idx + 1}`,
        {
          id: `rank-${idx + 1}`,
          title: tightLayout ? shortRankLabels[idx + 1] : rankLabels[idx + 1],
          candIds: [],
        },
      ])
    );

    var initialData = {
      candidates: candidates,
      candBoxes: rankBoxes,

      // Facilitate reordering of the columns
      candBoxOrder: ["candidates"].concat(ranks),
    };
    initialData["candBoxes"]["candidates"] = {
      id: "candidates",
      title: "Candidates",
      candIds: candIds,
    };
    for (const c in ranking) {
      var rank = ranking[c];
      for (const cid in candidates) {
        if (candidates[cid]["name"] == c) {
          var cIdx =
            initialData["candBoxes"]["candidates"]["candIds"].indexOf(
              cid
            );
          initialData["candBoxes"]["candidates"]["candIds"].splice(
            cIdx,
            1
          );
          initialData["candBoxes"][`rank-${rank}`]["candIds"].push(cid);
        }
      }
    }
    //console.log(candidates)
    setRankingState(initialData);
    handleHasUnrankedCandidates(getCurrentRanking(initialData))
  }, [theCandidates, currRanking, tightLayout]);

  const onDragEnd = (result) => {
    //console.log("on DRAGE ENDS");
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = rankingState.candBoxes[source.droppableId];
    const finish = rankingState.candBoxes[destination.droppableId];

    if (start === finish) {
      const newCandIds = Array.from(start.candIds);
      newCandIds.splice(source.index, 1);
      newCandIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...start,
        candIds: newCandIds,
      };

      const newState = {
        ...rankingState,
        candBoxes: {
          ...rankingState.candBoxes,
          [newColumn.id]: newColumn,
        },
      };
      setRankingState(newState);
      handleUpdateRanking(getCurrentRanking(newState));
      handleHasUnrankedCandidates(getCurrentRanking(newState));
      return;
    }

    // Moving from one list to another
    const startCandIds = Array.from(start.candIds);
    startCandIds.splice(source.index, 1);
    const newStart = {
      ...start,
      candIds: startCandIds,
    };

    const finishCandIds = Array.from(finish.candIds);
    finishCandIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      candIds: finishCandIds,
    };

    const newState = {
      ...rankingState,
      candBoxes: {
        ...rankingState.candBoxes,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    //console.log("newState is ");
    //console.log(newState);

    setRankingState(newState);
    handleUpdateRanking(getCurrentRanking(newState));
    handleHasUnrankedCandidates(getCurrentRanking(newState));
  };

  const getCurrentRanking = (rankingState) => {
    const ranking = {};
    for (const rankBoxId in rankingState.candBoxes) {
      if (rankBoxId !== "candidates") {
        const rank = parseInt(rankBoxId.split("-")[1]);
        for (const candId in rankingState.candBoxes[rankBoxId].candIds) {
          ranking[
            rankingState.candidates[
              rankingState.candBoxes[rankBoxId].candIds[candId]
            ].name
          ] = rank;
        }
      }
    }
    return ranking  
  }

  const handleHasUnrankedCandidates = (ranking) => {
    setHasUnrankedCandidates(theCandidates.some((c) => !Object.keys(ranking).includes(c)))
  }

  const handleUndoRakings = () => {

    let newCandBoxes = rankingState.candBoxes;
    //const lastRankingId = rankingState.candBoxOrder[rankingState.candBoxOrder.length - 1];
    //const candsToPlaceLast = newCandBoxes[lastRankingId]["candIds"].concat(unRankedCandIds);
    
    newCandBoxes.candidates.candIds = Object.keys(rankingState.candidates)
    for (const rankBoxId in rankingState.candBoxes) {
      if (rankBoxId !== "candidates") {
        newCandBoxes[rankBoxId].candIds = []
      }
    }
    const newState = {
      ...rankingState,
      candBoxes: newCandBoxes,
    };
    //console.log("newState is ");
    //console.log(newState);

    setRankingState(newState);
    handleUpdateRanking({});
    setHasUnrankedCandidates(true);

  }
  const handlePutUnrankedCandidatesLast = () => {
    const currRanking = getCurrentRanking(rankingState);
    const candidateIds = Object.keys(rankingState.candidates)
    const unRankedCandIds = candidateIds.filter((cId) => {
      return(!Object.keys(currRanking).includes(rankingState.candidates[cId].name))
    });

    let newCandBoxes = rankingState.candBoxes;

    let lastRankedIdx = 0
    //console.log(rankingState.candBoxes)
    //console.log(rankingState)
    for (let rbIdx =  0; rbIdx < rankingState.candBoxOrder.length; rbIdx++) {
      if (rankingState.candBoxes[rankingState.candBoxOrder[rbIdx]].candIds.length !== 0) {
        lastRankedIdx = rbIdx
      }
    }

    const bottomRankingIdx = lastRankedIdx == rankingState.candBoxOrder.length - 1 ? lastRankedIdx : lastRankedIdx + 1
    const bottomRankingId = rankingState.candBoxOrder[bottomRankingIdx];
    const candsToPlaceLast = newCandBoxes[bottomRankingId]["candIds"].concat(unRankedCandIds);
    
    newCandBoxes.candidates.candIds = []
    newCandBoxes[bottomRankingId].candIds = candsToPlaceLast
    const newState = {
      ...rankingState,
      candBoxes: newCandBoxes,
    };
    //console.log("newState is ");
    //console.log(newState);

    setRankingState(newState);
    handleUpdateRanking(getCurrentRanking(newState));
    handleHasUnrankedCandidates(getCurrentRanking(newState));

  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
      }}
    >
        {!onlyDisplay ? <Box sx={{marginBottom:2}}>
        {hasUnrankedCandidates ? (
          <Zoom in={hasUnrankedCandidates}>
            <Chip
              label="Move remaining candidates to last place"
              onClick={handlePutUnrankedCandidatesLast}
              onDelete={handlePutUnrankedCandidatesLast}
              deleteIcon={<MoveDownIcon/>}
            />
          </Zoom>
        ) : (
          <Zoom in={!hasUnrankedCandidates}>
            <Chip
              label="Remove all rankings"
              onClick={handleUndoRakings}
              onDelete={handleUndoRakings}
              deleteIcon={<UndoIcon/>}
            />
          </Zoom>
        )}
      </Box> : <span/>}
      <CandidateBox
        key="candidates"
        candBox={rankingState.candBoxes["candidates"]}
        candidates={rankingState.candBoxes[
          "candidates"
        ].candIds.map(
          (candId) => rankingState.candidates[candId]
        )}
        tightLayout = {tightLayout}
        onlyDisplay = {onlyDisplay}
      />
      
      {rankingState.candBoxOrder.map((candBoxId) => {
        if (candBoxId !== "candidates") {
          const candBox = rankingState.candBoxes[candBoxId];
          const candidates = candBox.candIds.map(
            (candId) => rankingState.candidates[candId]
          );
          return (
            <CandidateBox
              key={candBox.id}
              candBox={candBox}
              candidates={candidates}
              tightLayout = {tightLayout}
              onlyDisplay = {onlyDisplay}
            />
          );
        }
      })}

    </Box>
  </DragDropContext>
  
);
};

export default RankingInput;
