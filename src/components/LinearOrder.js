import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import { grey, green, blue, red, yellow } from "@mui/material/colors";



export const LinearOrder = ({ margins, candidateOrder }) => {
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
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Box sx={{ fontSize: 18, marginTop: 1, textAlign: "center" }}>
              {selectedCands.length === 2
                ? margins[selectedCands[0]][selectedCands[1]] > 0
                  ? `The margin of victory of ${selectedCands[0]} vs. ${
                      selectedCands[1]
                    } is ${margins[selectedCands[0]][selectedCands[1]]}. ${
                      selectedCands[0]
                    } defeats ${selectedCands[1]}.`
                  : `The margin of victory of ${selectedCands[1]} vs. ${
                      selectedCands[0]
                    } is ${margins[selectedCands[1]][selectedCands[0]]}.  ${
                      selectedCands[1]
                    } defeats ${selectedCands[0]}.`
                : "Select two candidates to see the margin. "}
            </Box>
          </Grid>
  
          <Grid item xs={12} sm={12}>
            <Box>
              {candidateOrder.map((c, cIdx) => {
                console.log(selectedCands.includes(c) ? blue[300] : "white");
                return (
                  <Box
                    key={cIdx}
                    sx={{ fontSize: 18, marginTop: 1, marginBottom: 2 }}
                  >
                    <Chip
                      key={cIdx}
                      label={`${cIdx + 1}. ${c}`}
                      onClick={() => handleChangeSelectedCands(c)}
                      style={{
                        width: "100%",
                        overflow: "scroll",
                        textAlign: "left",
                        backgroundColor: selectedCands.includes(c)
                          ? blue[300]
                          : "white",
                        fontSize: 18,
                        padding: 1,
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