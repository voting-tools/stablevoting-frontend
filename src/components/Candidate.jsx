import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import EllipsisText from "react-ellipsis-text";

export const Candidate = ({ cand, tightLayout, onlyDisplay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: cand.id,
    disabled: onlyDisplay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        padding: "0 8px",
        minWidth: tightLayout ? "75px" : "150px",
        height: "40px",
        lineHeight: "40px",
        verticalAlign: "middle",
        textAlign: "center",
        border: "2px solid lightgray",
        borderRadius: 2,
        marginRight: tightLayout ? 1 : 2,
        marginBottom: "4px",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        backgroundColor: isDragging ? "lightgreen" : "white",
        cursor: onlyDisplay ? "default" : "grab",
        touchAction: "none",
        userSelect: "none",
        "&:active": {
          cursor: onlyDisplay ? "default" : "grabbing",
        },
        transition: "background-color 0.2s ease",
        "&:hover": !onlyDisplay && {
          backgroundColor: "#f5f5f5",
          borderColor: "#999",
        },
      }}
    >
      <Tooltip title={<Box sx={{fontSize:18, padding:1}}>{cand.name}</Box>}>
        <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <EllipsisText text={cand.name} length={15} />
        </Box>
      </Tooltip>
    </Box>
  );
};

export default Candidate;