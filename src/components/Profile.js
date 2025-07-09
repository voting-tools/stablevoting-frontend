import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { rankLabels } from "./helpers";
import { COLORS_RGB } from "./helpers";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f5f5f5',
    color: theme.palette.text.primary,
    fontWeight: 600,
    fontSize: 14,
    borderBottom: '2px solid #e0e0e0',
    borderRight: '1px solid #e0e0e0',
    padding: '12px 16px',
    whiteSpace: 'nowrap',
    position: 'sticky',
    top: 0,
    zIndex: 2,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
    padding: '10px 16px',
    borderRight: '1px solid #f0f0f0',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: '#fafafa',
  },
  '&:hover': {
    backgroundColor: '#f0f0f0',
    '& td': {
      color: theme.palette.text.primary,
    }
  },
  '& td:last-child, & th:last-child': {
    borderRight: 0,
  },
}));

const RankHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  fontWeight: 600,
  fontSize: 14,
  color: theme.palette.text.primary,
  borderRight: '2px solid #e0e0e0',
  borderBottom: '2px solid #e0e0e0',
  position: 'sticky',
  left: 0,
  top: 0,
  zIndex: 4, // Highest z-index - above both column and row headers
  padding: '12px 16px',
  minWidth: '120px',
}));

const RankCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#fafafa',
  fontWeight: 500,
  fontSize: 14,
  color: theme.palette.text.secondary,
  borderRight: '2px solid #e0e0e0',
  position: 'sticky',
  left: 0,
  zIndex: 1,
  padding: '10px 16px',
  minWidth: '120px',
}));

export const Profile = ({ columnData, cand1, cand2, cmap }) => {
  let columns = columnData["columns"];
  let numRows = columnData["numRows"];
  
  // Sort columns by vote count
  const sortedColumns = [...columns].sort((a, b) => {
    const headerA = String(a[0]);
    const headerB = String(b[0]);
    
    // Extract ANY number from the headers
    const extractNumber = (str) => {
      const nums = str.match(/\d+/g);
      if (nums && nums.length > 0) {
        // Return the first number found
        return parseInt(nums[0], 10);
      }
      return 0;
    };
    
    const countA = extractNumber(headerA);
    const countB = extractNumber(headerB);
    
    // Debug logging
    console.log(`Sorting: "${headerA}" (${countA}) vs "${headerB}" (${countB})`);
    
    // Sort descending - highest vote count first
    return countB - countA;
  });
  
  console.log("Original order:", columns.map(c => c[0]));
  console.log("Sorted order:", sortedColumns.map(c => c[0]));

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        boxShadow: 'none',
        border: '1px solid #e0e0e0',
        borderRadius: 1, // Subtle rounded corners
        overflow: 'auto',
        maxHeight: '600px',
        position: 'relative',
      }}
    >
      <Table 
        sx={{ 
          minWidth: 650,
          borderCollapse: 'collapse',
        }} 
        size="small" 
        aria-label="ranking profile table"
        stickyHeader
      >
        <TableHead>
          <TableRow>
            <RankHeaderCell>
              Ranking
            </RankHeaderCell>
            {sortedColumns.map((column, colIdx) => (
              <StyledTableCell key={`H${colIdx}`} align="center">
                {column[0]}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(numRows).keys()].map((rowIdx) => (
            <StyledTableRow key={rowIdx}>
              <RankCell>
                {rankLabels[rowIdx + 1]}
              </RankCell>
              {sortedColumns.map((column, colIdx) => {
                var cands = column[rowIdx + 1]
                  .split(",")
                  .map((c) => c.trim());

                const isHighlighted1 = cand1 !== "" && cands.includes(cand1);
                const isHighlighted2 = cand2 !== "" && cands.includes(cand2);
                
                return (
                  <StyledTableCell
                    key={`C${colIdx}`}
                    align="center"
                    sx={{
                      backgroundColor: isHighlighted1
                        ? `rgba(${COLORS_RGB.primary}, 0.2)`
                        : isHighlighted2
                        ? `rgba(${COLORS_RGB.third}, 0.2)`
                        : "inherit",
                      fontWeight: isHighlighted1 || isHighlighted2 ? 500 : 400,
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    {cands.map((c) => cmap[c]).join(", ")}
                  </StyledTableCell>
                );
              })}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Profile;