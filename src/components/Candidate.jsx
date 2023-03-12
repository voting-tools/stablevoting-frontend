import React from "react";
import { Draggable } from "react-beautiful-dnd";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import EllipsisText from "react-ellipsis-text";

export const Candidate = ({ cand, index }) => {
  return (
    <Draggable draggableId={cand.id} index={index}>
      {(provided, snapshot) => (
        <Box
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}
          ref={provided.innerRef}
          sx={{
            padding: 0,
            minWidth: "150px",
            minHeight: "40px",
            lineHeight: "40px",
            verticalAlign: "middle",
            textAlign: "center",
            border: "2px solid lightgray",
            borderRadius: 2,
            marginRight: 4,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            backgroundColor: snapshot.isDragging ? "lightgreen" : "white",
          }}
        >
          <Tooltip title={<Box sx={{fontSize:18, padding:1}}>{cand.name}</Box>}  >
            <Box><EllipsisText text={cand.name} length={15} /></Box>
          </Tooltip>
        </Box>
      )}
    </Draggable>
  );
};

export default Candidate;
