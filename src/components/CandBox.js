import { memo } from "react";
import { DragSource } from "react-dnd";
export const CandBox = memo(function CandBox({
  name,
  isDropped,
  isDragging,
  connectDragSource,
}) {
  return connectDragSource(
    <Box
      role="Box"
      sx={{
        border: "2px dashed gray",
        backgroundColor: "white",
        padding: "0.5rem 1rem",
        marginRight: "1.5rem",
        marginBottom: "1.5rem",
        cursor: "move",
        float: "left",
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      {isDropped ? <s>{name}</s> : name}
    </Box>
  );
});
export default DragSource(
  (props) => props.type,
  {
    beginDrag: (props) => ({ name: props.name }),
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })
)(CandBox);
