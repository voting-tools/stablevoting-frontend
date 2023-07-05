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
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    borderLeft: 0,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  borderLeft: 0,
  "&:nth-of-type(odd)": {
    backgroundColor: "inherit" /*theme.palette.action.hover,*/,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const Profile = ({ columnData, cand1, cand2, cmap }) => {

  let columns = columnData["columns"]
  let numRows = columnData["numRows"]
  console.log("IN PROFILE")
  console.log(columns)
  return (
    <TableContainer component={Paper}>
      <Table sx={{ fontSize: 20 }} size="small" aria-label="simple table">
        <TableHead>
          <StyledTableRow>
            <TableCell key={"empty"} sx={{ backgroundColor: "white" }}>
              {" "}
            </TableCell>
            {[...Array(columns.length).keys()].map((colIdx) => {
              return (
                <StyledTableCell key={`H${colIdx}`} align="center">
                  {columns[colIdx][0]}
                </StyledTableCell>
              );
            })}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {[...Array(numRows).keys()].map((rowIdx) => (
            <StyledTableRow
              key={rowIdx}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell key={`R${rowIdx}`} sx={{ width: "15%" }}>
                {rankLabels[rowIdx + 1]}
              </TableCell>

              {[...Array(columns.length).keys()].map((colIdx) => {
                var cands = columns[colIdx][rowIdx + 1]
                  .split(",")
                  .map((c) => cmap[c.trim()]);

                  console.log("CANDS")
                  console.log(cands)
                  return (
                  <StyledTableCell
                    key={`C${colIdx}`}
                    sx={{
                      borderLeft: 0,
                      backgroundColor:
                        cand1 !== "" && cands.includes(cand1)
                          ? `rgba(${COLORS_RGB.primary}, 0.5)`
                          : cand2 !== "" && cands.includes(cand2)
                          ? `rgba(${COLORS_RGB.third}, 0.5)`
                          : "inherit",
                    }}
                    align="center"
                  >
                    {cands.join(",")}
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