import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  pointerWithin,
  rectIntersection,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import CandidateBox from "./CandidateBox";
import Box from "@mui/material/Box";
import Zoom from "@mui/material/Zoom";
import Chip from "@mui/material/Chip";
import UndoIcon from '@mui/icons-material/Undo';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import InfoIcon from "@mui/icons-material/Info";
import IconButton from "@mui/material/IconButton";
import { rankLabels, shortRankLabels } from "./helpers";

export const RankingInput = ({ 
  theCandidates, 
  currRanking, 
  handleUpdateRanking, 
  tightLayout,
  onlyDisplay,
  description,
  onShowDescription,
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
  const [hasUnrankedCandidates, setHasUnrankedCandidates] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [needsUpdate, setNeedsUpdate] = useState(false);  // THIS WAS MISSING!

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper function to get current ranking from state
  const getCurrentRanking = (state) => {
    const ranking = {};
    for (const rankBoxId in state.candBoxes) {
      if (rankBoxId !== "candidates") {
        const rank = parseInt(rankBoxId.split("-")[1]);
        for (const candId of state.candBoxes[rankBoxId].candIds) {
          if (state.candidates[candId]) {
            ranking[state.candidates[candId].name] = rank;
          }
        }
      }
    }
    return ranking;
  };

  // THIS WAS COMMENTED OUT - UNCOMMENT IT!
  useEffect(() => {
    if (!theCandidates || theCandidates.length === 0) {
      return;
    }

    var ranking = currRanking || {};

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
      candBoxes: {
        candidates: {
          id: "candidates",
          title: "Candidates",
          candIds: [...candIds],
        },
        ...rankBoxes
      },
      candBoxOrder: ["candidates"].concat(ranks),
    };
    
    // Place already ranked candidates
    for (const c in ranking) {
      var rank = ranking[c];
      for (const cid in candidates) {
        if (candidates[cid]["name"] === c && initialData["candBoxes"][`rank-${rank}`]) {
          var cIdx = initialData["candBoxes"]["candidates"]["candIds"].indexOf(cid);
          if (cIdx !== -1) {
            initialData["candBoxes"]["candidates"]["candIds"].splice(cIdx, 1);
            initialData["candBoxes"][`rank-${rank}`]["candIds"].push(cid);
          }
        }
      }
    }
    
    setRankingState(initialData);
    const currentRanking = getCurrentRanking(initialData);
    setHasUnrankedCandidates(theCandidates.some((c) => !Object.keys(currentRanking).includes(c)));
  }, [theCandidates, currRanking, tightLayout]);

  // Update parent when state changes
  useEffect(() => {
    if (needsUpdate && Object.keys(rankingState.candidates).length > 0) {
      const newRanking = getCurrentRanking(rankingState);
      handleUpdateRanking(newRanking);
      const candidateNames = Object.values(rankingState.candidates).map(c => c.name);
      setHasUnrankedCandidates(candidateNames.some((c) => !Object.keys(newRanking).includes(c)));
      setNeedsUpdate(false);
    }
  }, [rankingState, needsUpdate, handleUpdateRanking]);  // FIXED DEPENDENCY ARRAY

  // DELETE THIS FUNCTION - NOT NEEDED
  // const updateRanking = (newState) => {
  //   const newRanking = getCurrentRanking(newState);
  //   console.log("RankingInput: Updating ranking to:", newRanking);
  //   handleUpdateRanking(newRanking);
  //   
  //   const candidateNames = Object.values(newState.candidates).map(c => c.name);
  //   setHasUnrankedCandidates(candidateNames.some((c) => !Object.keys(newRanking).includes(c)));
  // };

  const findContainer = (id) => {
    if (!id) return undefined;
    
    if (id in rankingState.candBoxes) {
      return id;
    }
    
    return Object.keys(rankingState.candBoxes).find((key) =>
      rankingState.candBoxes[key].candIds.includes(id)
    );
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) {
      return;
    }

    setRankingState((prev) => {
      let newState = prev;
      
      if (activeContainer === overContainer) {
        // Same container - reorder
        const items = [...prev.candBoxes[activeContainer].candIds];
        const activeIndex = items.indexOf(activeId);
        const overIndex = items.indexOf(overId);

        if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
          newState = {
            ...prev,
            candBoxes: {
              ...prev.candBoxes,
              [activeContainer]: {
                ...prev.candBoxes[activeContainer],
                candIds: arrayMove(items, activeIndex, overIndex),
              },
            },
          };
        }
      } else {
        // Different containers - move
        const activeItems = [...prev.candBoxes[activeContainer].candIds];
        const overItems = [...prev.candBoxes[overContainer].candIds];

        const activeIndex = activeItems.indexOf(activeId);
        
        if (activeIndex === -1) return prev;

        // Remove from source
        activeItems.splice(activeIndex, 1);

        // Add to destination
        if (overId === overContainer || prev.candBoxes[overId]) {
          // Dropped on the container itself
          overItems.push(activeId);
        } else {
          // Dropped on an item
          const overIndex = overItems.indexOf(overId);
          if (overIndex >= 0) {
            overItems.splice(overIndex, 0, activeId);
          } else {
            overItems.push(activeId);
          }
        }

        newState = {
          ...prev,
          candBoxes: {
            ...prev.candBoxes,
            [activeContainer]: {
              ...prev.candBoxes[activeContainer],
              candIds: activeItems,
            },
            [overContainer]: {
              ...prev.candBoxes[overContainer],
              candIds: overItems,
            },
          },
        };
      }
      
      return newState;
    });
    // Only trigger update if moving between containers or within rank boxes
    if (activeContainer !== overContainer || activeContainer !== "candidates") {
      setNeedsUpdate(true);
    }  

};

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    // Only trigger ranking update if we moved between containers
    // or within a rank box (not the candidates box)
    if (activeContainer !== overContainer || activeContainer !== "candidates") {
      setNeedsUpdate(true);
    }
  };

  const handleUndoRankings = () => {
    const allCandIds = Object.keys(rankingState.candidates);
    
    const newState = {
      ...rankingState,
      candBoxes: {
        ...rankingState.candBoxes,
        candidates: {
          ...rankingState.candBoxes.candidates,
          candIds: allCandIds
        },
        ...Object.fromEntries(
          rankingState.candBoxOrder.slice(1).map(rankBoxId => [
            rankBoxId,
            { ...rankingState.candBoxes[rankBoxId], candIds: [] }
          ])
        )
      }
    };
    
    setRankingState(newState);
    handleUpdateRanking({});
    setHasUnrankedCandidates(true);
  };

  const handlePutUnrankedCandidatesLast = () => {
    const currRanking = getCurrentRanking(rankingState);
    const candidateIds = Object.keys(rankingState.candidates);
    const unRankedCandIds = candidateIds.filter((cId) => {
      return !Object.keys(currRanking).includes(rankingState.candidates[cId].name);
    });

    if (unRankedCandIds.length === 0) return;

    let lastRankedIdx = 0;
    for (let rbIdx = 0; rbIdx < rankingState.candBoxOrder.length; rbIdx++) {
      if (rankingState.candBoxes[rankingState.candBoxOrder[rbIdx]].candIds.length !== 0) {
        lastRankedIdx = rbIdx;
      }
    }

    const bottomRankingIdx = lastRankedIdx === rankingState.candBoxOrder.length - 1 
      ? lastRankedIdx 
      : lastRankedIdx + 1;
    const bottomRankingId = rankingState.candBoxOrder[bottomRankingIdx];
    
    const newState = {
      ...rankingState,
      candBoxes: {
        ...rankingState.candBoxes,
        candidates: {
          ...rankingState.candBoxes.candidates,
          candIds: []
        },
        [bottomRankingId]: {
          ...rankingState.candBoxes[bottomRankingId],
          candIds: [...rankingState.candBoxes[bottomRankingId].candIds, ...unRankedCandIds]
        }
      }
    };
    
    setRankingState(newState);
    setNeedsUpdate(true);  // THIS WILL TRIGGER THE UPDATE
  };

  if (!theCandidates || theCandidates.length === 0 || Object.keys(rankingState.candidates).length === 0) {
    return null;
  }

  // Custom collision detection that works better for horizontal reordering
  const customCollisionDetection = (args) => {
    const { active, droppableContainers, pointerCoordinates } = args;
    const activeContainer = findContainer(active.id);
    
    // First try pointer within for direct hits
    const pointerCollisions = pointerWithin(args);
    
    // Filter to prioritize items over containers when reordering within same container
    if (pointerCollisions.length > 0) {
      // Check if we're hovering over items in the same container
      const itemCollisions = pointerCollisions.filter(collision => {
        const collisionContainer = findContainer(collision.id);
        return collisionContainer === activeContainer && collision.id !== activeContainer;
      });
      
      if (itemCollisions.length > 0) {
        return [itemCollisions[0]];
      }
      
      // Otherwise, check for container collisions
      const containerCollisions = pointerCollisions.filter(
        collision => collision.id in rankingState.candBoxes
      );
      if (containerCollisions.length > 0) {
        return [containerCollisions[0]];
      }
      
      return [pointerCollisions[0]];
    }
    
    // Use closest center as fallback
    const centerCollisions = closestCenter(args);
    if (centerCollisions.length > 0) {
      return [centerCollisions[0]];
    }
    
    // Final fallback to rect intersection
    const rectCollisions = rectIntersection(args);
    if (rectCollisions.length > 0) {
      return [rectCollisions[0]];
    }
    
    return [];
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
        }}
      >
      {!onlyDisplay && (
        <Box sx={{ 
          marginBottom: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1 
        }}>
          {hasUnrankedCandidates ? (
            <Zoom in={hasUnrankedCandidates}>
              <Chip
                label="Move remaining candidates to last place"
                onClick={handlePutUnrankedCandidatesLast}
                onDelete={handlePutUnrankedCandidatesLast}
                deleteIcon={<MoveDownIcon />}
              />
            </Zoom>
          ) : (
            <Zoom in={!hasUnrankedCandidates}>
              <Chip
                label="Remove all rankings"
                onClick={handleUndoRankings}
                onDelete={handleUndoRankings}
                deleteIcon={<UndoIcon />}
              />
            </Zoom>
          )}
          
          {description && (
            <Zoom in={true}>
              <IconButton
                onClick={onShowDescription}
                size="small"
                sx={{
                  backgroundColor: 'action.hover',
                  '&:hover': {
                    backgroundColor: 'action.selected',
                  }
                }}
              >
                <InfoIcon fontSize="small" />
              </IconButton>
            </Zoom>
          )}
        </Box>
      )}
        
        {rankingState.candBoxOrder.map((candBoxId) => {
          const candBox = rankingState.candBoxes[candBoxId];
          if (!candBox) return null;
          
          const candidates = candBox.candIds
            .map((candId) => rankingState.candidates[candId])
            .filter(Boolean);
            
          return (
            <CandidateBox
              key={candBox.id}
              candBox={candBox}
              candidates={candidates}
              tightLayout={tightLayout}
              onlyDisplay={onlyDisplay}
            />
          );
        })}
      </Box>
      
      <DragOverlay>
        {activeId && rankingState.candidates[activeId] ? (
          <Box
            sx={{
              padding: 0,
              minWidth: tightLayout ? "75px" : "150px",
              minHeight: "40px",
              lineHeight: "40px",
              verticalAlign: "middle",
              textAlign: "center",
              border: "2px solid lightgray",
              borderRadius: 2,
              backgroundColor: "lightgreen",
              opacity: 0.8,
              cursor: "grabbing",
            }}
          >
            {rankingState.candidates[activeId].name}
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default RankingInput;