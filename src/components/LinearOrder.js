import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import { COLORS } from "./helpers";

export const LinearOrder = ({ margins, candidateOrder, cmap }) => {
  const [selectedCands, setSelectedCands] = useState([]);
  
  const handleChangeSelectedCands = (c) => {
    if (selectedCands.length < 2) {
      const candIndex = selectedCands.indexOf(c);
      let newSelectedCands =
        candIndex === -1
          ? selectedCands.concat(c)
          : selectedCands.filter((c1) => c1 != c);
      console.log(newSelectedCands);
      setSelectedCands(newSelectedCands);
    } else {
      setSelectedCands([c]);
    }
  };

  const getMessage = () => {
    if (selectedCands.length !== 2) return "Select two candidates to see the margin.";
    
    const [c1, c2] = selectedCands;
    const margin = margins[c1][c2];
    const winner = margin > 0 ? c1 : c2;
    const loser = margin > 0 ? c2 : c1;
    const absMargin = Math.abs(margin);
    
    return `${cmap[winner]} defeats ${cmap[loser]} by ${absMargin} vote${absMargin === 1 ? '' : 's'}`;
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <Box sx={{ fontSize: 18, marginTop: 1, textAlign: "center" }}>
            {getMessage()}
          </Box>
        </Grid>

        <Grid item xs={12} sm={12}>
          <Box>
            {candidateOrder.map((c, cIdx) => {
              return (
                <Box
                  key={cIdx}
                  sx={{ fontSize: 18, marginTop: 1, marginBottom: 2 }}
                >
                  <Chip
                    key={cIdx}
                    label={`${cIdx + 1}. ${cmap[c]}`}
                    onClick={() => handleChangeSelectedCands(c)}
                    sx={{
                      width: "100%",
                      minHeight: "48px",
                      overflow: "scroll",
                      textAlign: "left",
                      backgroundColor: selectedCands.includes(c)
                        ? COLORS.primary
                        : "white",
                      color: selectedCands.includes(c) ? "white" : "black",
                      fontSize: 18,
                      padding: 1,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: selectedCands.includes(c) 
                          ? COLORS.primary 
                          : COLORS.lightgrey,
                      }
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default LinearOrder;