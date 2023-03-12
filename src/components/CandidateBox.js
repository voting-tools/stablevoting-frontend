import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Candidate from "./Candidate";
import Box from "@mui/material/Box";


export const CandidateBox = ({ candBox, candidates }) => {
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
        overflow: "scroll",
        padding: "0.5rem 1rem",
        marginBottom: "1.5rem",
      }}
    >
      <Box
        component="div"
        sx={{
          minHeight: "45px",
          lineHeight: "45px",
          minWidth: "100px",
          maxWidth: "100px",
          marginRight: 4,
          flexGrow: 1,
          fontWeight: 600,
          verticalAlign: "middle",
          textAlign: "left",
          paddingLeft:3,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {candBox.title}
      </Box>
      <Droppable droppableId={candBox.id} direction="horizontal">
        {(provided, snapshot) => (
          <Box
            component="div"
            innerRef={provided.innerRef}
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
            sx={{
              width:"100%",
              transition: "background-color 0.2s ease",
              backgroundColor: snapshot.isDraggingOver ? "skyblue" : "white",
              display: "flex",
              flexDirection: "row",
              padding:0,
              margin:0,
              minHeight: "40px",
            }}
          >
            {candidates.map((cand, index) => (
              <Candidate key={cand.id} cand={cand} index={index} />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  );
};

export default CandidateBox;
