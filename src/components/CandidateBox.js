import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import Candidate from "./Candidate";
import Box from "@mui/material/Box";

export const CandidateBox = ({ candBox, candidates, tightLayout, onlyDisplay }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: candBox.id,
  });

  // Ensure we have valid data
  if (!candBox || !candidates) {
    return null;
  }

  const candidateIds = candidates.map(c => c.id || `temp-${Math.random()}`);

  return (
    <Box
      component="div"
      sx={{
        minWidth:"100%",
        border: "1px solid lightgrey",
        borderRadius: 2,
        minHeight: "40px",
        display: "flex",
        flexDirection: "row",
        verticalAlign: "middle",
        textAlign: "center",
        overflow: "visible", // Changed from "scroll" to "visible"
        padding: "0.5rem 1rem",
        marginBottom: "1.5rem",
      }}
    >
      {tightLayout && candBox.title === "Candidates" ? null : (
        <Box
          component="div"
          sx={{
            minHeight: "45px",
            lineHeight: "45px",
            minWidth: tightLayout ? "50px" : "100px",
            maxWidth: tightLayout ? "50px" : "100px",
            marginRight: 4,
            flexGrow: 1,
            fontWeight: 600,
            verticalAlign: "middle",
            textAlign: "left",
            paddingLeft: 3,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        > 
          {candBox.title}
        </Box>
      )}
      
      <Box
        ref={setNodeRef}
        sx={{
          width:"100%",
          transition: "background-color 0.2s ease",
          backgroundColor: isOver ? "skyblue" : "white",
          display: "flex",
          flexDirection: "row",
          padding:0,
          margin:0,
          minHeight: "40px",
        }}
      >
        <SortableContext 
          items={candidateIds}
          strategy={horizontalListSortingStrategy}
        >
          {candidates.map((cand, index) => (
            <Candidate 
              key={cand.id || index} 
              cand={cand} 
              index={index} 
              tightLayout={tightLayout} 
              onlyDisplay={onlyDisplay} 
            />
          ))}
        </SortableContext>
      </Box>
    </Box>
  );
};

export default CandidateBox;