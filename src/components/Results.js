import React, { useState, useEffect, memo, useMemo, useCallback } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useParams, useSearchParams } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import axios from "axios";
import ShareIcon from "@mui/icons-material/Share";
import CircularProgress from "@mui/material/CircularProgress";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CheckIcon from "@mui/icons-material/Check";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { grey } from "@mui/material/colors";
import { API_URL } from "./helpers";
import { v4 } from "uuid";
import "./network.css";
import Graph from "react-graph-vis";
import CytoscapeComponent from "react-cytoscapejs";

import Profile from "./Profile";
import { Cycle, MarginSubGraphDefeats, MarginSubGraph } from "./MarginGraphs";
import LinearOrder from "./LinearOrder";
import { COLORS, COLORS_RGB } from "./helpers";
import {
  HideExplanationButton,
  ShowExplanationButton,
  UndefeatedCandidateText,
  undefeatedCandsStr,
  undefeatedCandsStr2,
  listToStr,
  listStrToStr,
  areEqual,
  winnerStr3,
  winnerStr2,
  winnerStr,
} from "./resultsHelpers";


const WinnerString = ({ winners, cmap, selectedSVWinner}) => {
  console.log(winners)
  console.log(selectedSVWinner)
  if (winners.length === 1) {
    return (<Typography component='span' sx={{ fontSize: 20 }}>The Stable Voting winner is  <Typography component='span' sx={{ fontSize: 20, fontWeight: 600 }}>{cmap[winners[0]]}</Typography>.</Typography>)
  }
  else if (winners.length === 2) {
    return (
    <>
    <Typography component='span' sx={{ fontSize: 20 }}>The Stable Voting winners are <Typography component='span' sx={{ fontSize: 20, fontWeight: 600 }}>{cmap[winners[0]]}</Typography> and <Typography component='span' sx={{ fontSize: 20, fontWeight: 600 }}>{cmap[winners[1]]}.</Typography></Typography>
    
    {selectedSVWinner != null && <Typography component='span' sx={{ fontSize: 20 }}>The randomly chosen winner is <Typography component='span' sx={{ fontSize: 20, fontWeight: 600 }}>{cmap[selectedSVWinner]}</Typography>.</Typography>}
    </>
    )
  }
  else if (winners.length > 2) {
    var lastWinner = cmap[winners[winners.length - 1]];
    var otherWinners = winners.slice(0, -1).map((w) => cmap[w]);
    //console.log(otherWinners)
    return (<><Typography component='span' sx={{ fontSize: 20 }}>The Stable Voting winners are {otherWinners.map((w) => <span><Typography component='span' sx={{ fontSize: 20, fontWeight: 600 }}>{w}</Typography>, </span>)} and <Typography component='span' sx={{ fontSize: 20, fontWeight: 600 }}>{lastWinner}</Typography>.</Typography>
    
    {selectedSVWinner != null &&  <Typography component='span' sx={{ fontSize: 20 }}>The randomly chosen winner is {cmap[selectedSVWinner]}.</Typography>}
    </>
    )
  }

}


const UniqueUndefeatedExplanation = (
  ({
    margins,
    undefeatedCands,
    isCondorcetWinner,
    currCands,
    paddingLeft,
    cycles,
    hasCycle,
    defeats,
    bgColor,
    currColor,
    cmap
  }) => {
    const [showExplanation, setShowExplanation] = useState(false);
    const undefeatedStr = (undefeatedCands) => {
      var numUndefeatedCands = undefeatedCands.length;
      if (numUndefeatedCands == 1) {
        return undefeatedCands[0] + " is undefeated ";
      } else if (numUndefeatedCands == 2) {
        return (
          undefeatedCands[0] + " and " + undefeatedCands[1] + " are undefeated "
        );
      } else {
        var lastCand = undefeatedCands[numUndefeatedCands - 1];
        return (
          undefeatedCands.slice(0, -1).join(", ") +
          ", and " +
          lastCand +
          " are undefeated "
        );
      }
    };
    return (
      <Box
        key="uniqueUndefeated"
        sx={{
          paddingLeft: paddingLeft,
          backgroundColor: currColor,
          fontSize: 20,
        }}
      >
        {listToStr(undefeatedCands.map((x)=>cmap[x]))}{" "}
        {isCondorcetWinner ? (
          <>
            {" "}
            wins all head-to-head matches.{" "}
            <Button
              variant="text"
              disabled={true}
              sx={{
                color: "black !important",
                paddingLeft: 0,
                marginLeft: 0,
              }}
            >
              <CheckIcon size="small" />
            </Button>
          </>
        ) : (
          <>
            {" "}
            is the only <UndefeatedCandidateText />.
            {hasCycle && Object.keys(cycles).length === 0 ?<div> test</div> : 
            <div>
              {showExplanation ? (
                <HideExplanationButton
                  handleClick={setShowExplanation}
                  handleClickParam={false}
                  buttonText={"Hide explanation"}
                />
              ) : (
                <ShowExplanationButton
                  handleClick={setShowExplanation}
                  handleClickParam={true}
                  buttonText={"Explain why"}
                />
              )}
            </div>
            }
            <Collapse in={showExplanation}>
              {Object.keys(cycles).length > 0 ? (
                <Stack spacing={0}>
                  <Box
                    sx={{
                      fontSize: 20,
                      paddingLeft: paddingLeft,
                      paddingTop: "10px",
                      backgroundColor: { bgColor },
                    }}
                  >
                    The majority cycles are shown below, where the red arrows in
                    a cycle represent the head-to-head wins with the smallest
                    margin of victory in that cycle:
                    <Grid
                      container
                      direction="row"
                      justifyContent="start"
                      alignItems="center"
                      flexWrap="nowrap"
                      sx={{
                        fontSize: 20,
                        maxHeight: "250px",
                        overflow: "scroll",
                      }}
                    >
                      {Object.keys(cycles).map((cycle, cIdx) => {
                        var cands = cycle.split(",");
                        if (cands.every((c) => currCands.includes(c))) {
                          return (
                            <Grid key={cIdx} item>
                              <Cycle
                                margins={margins}
                                undefeatedCands={undefeatedCands}
                                currCands={cands}
                                cycle={cycle}
                                splittingNum={cycles[cycle]}
                                bgColor={bgColor}
                                cmap={cmap}
                              />
                            </Grid>
                          );
                        } else {
                          return <span />;
                        }
                      })}
                    </Grid>
                  </Box>
                  <Box
                    sx={{
                      paddingLeft: paddingLeft,
                      paddingTop: "0px",
                      backgroundColor: { bgColor },
                      fontSize: 20,
                    }}
                  >
                    {undefeatedStr(undefeatedCands.map((x)=>cmap[x]))} after discarding the red
                    arrows:
                    <MarginSubGraphDefeats
                      margins={margins}
                      currCands={currCands}
                      undefeatedCands={undefeatedCands}
                      defeats={defeats}
                      bgColor={bgColor}
                      cmap={cmap}
                    />
                  </Box>
                </Stack>
              ) : (
                hasCycle ? 
                  <Box
                  sx={{
                    fontSize: 20,
                    paddingLeft: paddingLeft,
                    paddingTop: "10px",
                  }}
                >
                  There are majority cycles.{" "}
                  {undefeatedCandsStr2(undefeatedCands.map((x)=>cmap[x]))} 
                </Box> : 
                <Box
                  sx={{
                    fontSize: 20,
                    paddingLeft: paddingLeft,
                    paddingTop: "10px",
                  }}
                >
                  There are no majority cycles.{" "}
                  {undefeatedCandsStr(undefeatedCands.map((x)=>cmap[x]))} with no head-to-head
                  losses.
                </Box>
              )}
            </Collapse>
          </>
        )}
      </Box>
    );
  }
);

const UndefeatedExplanation = (
  ({
    margins,
    cycles,
    hasCycle,
    undefeatedCands,
    currCands,
    paddingLeft,
    defeats,
    bgColor,
    cmap
  }) => {
    const [showExplanation, setShowExplanation] = useState(false);
    const undefeatedStr = (undefeatedCands) => {
      var numUndefeatedCands = undefeatedCands.length;
      if (numUndefeatedCands == 1) {
        return undefeatedCands[0] + " is undefeated ";
      } else if (numUndefeatedCands == 2) {
        return (
          undefeatedCands[0] + " and " + undefeatedCands[1] + " are undefeated "
        );
      } else {
        var lastCand = undefeatedCands[numUndefeatedCands - 1];
        return (
          undefeatedCands.slice(0, -1).join(", ") +
          ", and " +
          lastCand +
          " are undefeated "
        );
      }
    };
    return (
      <Box sx={{ paddingLeft: paddingLeft, marginTop: 2, marginBottom: 2 }}>
        The undefeated candidates are {listToStr(undefeatedCands.map((w)=>cmap[w]))}.
        <div>
          {showExplanation ? (
            <HideExplanationButton
              handleClick={setShowExplanation}
              handleClickParam={false}
              buttonText={"Hide explanation"}
            />
          ) : (
            <ShowExplanationButton
              handleClick={setShowExplanation}
              handleClickParam={true}
              buttonText={"Explain why"}
            />
          )}
        </div>
        <Collapse in={showExplanation}>
          {Object.keys(cycles).length > 0 ? (
            <Stack spacing={0}>
              <Box
                sx={{
                  fontSize: 20,
                  paddingLeft: paddingLeft,
                  paddingTop: "10px",
                  backgroundColor: { bgColor },
                }}
              >
                The majority cycles are shown below, where the red arrows in a
                cycle represent the head-to-head wins with the smallest margin
                of victory in that cycle:
                <Grid
                  container
                  direction="row"
                  justifyContent="start"
                  alignItems="center"
                  flexWrap="nowrap"
                  sx={{ fontSize: 20, maxHeight: "250px", overflow: "scroll" }}
                >
                  {Object.keys(cycles).map((cycle, cIdx) => {
                    var cands = cycle.split(",");
                    if (cands.every((c) => currCands.includes(c))) {
                      return (
                        <Grid key={cIdx} item>
                          <Cycle
                            margins={margins}
                            undefeatedCands={undefeatedCands}
                            currCands={cands}
                            cycle={cycle}
                            splittingNum={cycles[cycle]}
                            bgColor={bgColor}
                            cmap={cmap}
                          />
                        </Grid>
                      );
                    } else {
                      return <span />;
                    }
                  })}
                </Grid>
              </Box>
              <Box
                sx={{
                  paddingLeft: paddingLeft,
                  paddingTop: "0px",
                  backgroundColor: { bgColor },
                  fontSize: 20,
                }}
              >
                {undefeatedStr(undefeatedCands.map((x)=>cmap[x]))} after discarding the red
                arrows:
                <MarginSubGraphDefeats
                  margins={margins}
                  currCands={currCands}
                  undefeatedCands={undefeatedCands}
                  defeats={defeats}
                  bgColor={bgColor}
                  cmap={cmap}
                />
              </Box>
            </Stack>
          ) : (hasCycle ? 
            <Box
              sx={{
                fontSize: 20,
                paddingLeft: paddingLeft,
                paddingTop: "10px",
              }}
            >
              {undefeatedCandsStr2(undefeatedCands.map((x)=>cmap[x]))}{" "}
            </Box>: 
            <Box
              sx={{
                fontSize: 20,
                paddingLeft: paddingLeft,
                paddingTop: "10px",
              }}
            >
              There are no majority cycles.{" "}
              {undefeatedCandsStr(undefeatedCands.map((x)=>cmap[x]))} with no head-to-head losses.
            </Box>
          )}
        </Collapse>
      </Box>
    );
  }
);

function MarginGraph({ margins, svWinners, defeats, currCands, cmap }) {
  var allEdges = [];
  let numCands = currCands.length;
  for (var c1_idx = 0; c1_idx < currCands.length; c1_idx++) {
    for (var c2_idx = 0; c2_idx < currCands.length; c2_idx++) {
      var c1 = currCands[c1_idx];
      var c2 = currCands[c2_idx];
      if (c1 !== c2) {
        if (margins[c1][c2] > 0) {
          allEdges.push({
            id: `${c1_idx + 1}-${c2_idx + 1}`,
            from: c1_idx + 1,
            to: c2_idx + 1,
            label: margins[c1][c2].toString(),
            font: { color: "black" },
            title: defeats[c1][c2]
              ? `The margin of ${cmap[c1]} vs. ${cmap[c2]} is ${margins[c1][
                  c2
                ].toString()}. ${cmap[c1]} defeats ${cmap[c2]}.`
              : `The margin of ${cmap[c1]} vs. ${cmap[c2]} is ${margins[c1][
                  c2
                ].toString()}.`,
            width: 2,
            color: defeats[c1][c2] ? "#1080c3" : "black",
            arrows: { to: true },
          });
        }
      }
    }
  }
  const graph = {
    nodes: currCands.map((c, idx) => {
      return cmap[c].length > 5
        ? {
            id: idx + 1,
            label: cmap[c].slice(0, 5) + "...",
            title: `${cmap[c]}`,
            borderWidth: 2,
            color: {
              background: svWinners.includes(c)
                ? `rgba(${COLORS_RGB.secondary},1)`
                : "#EEEEEE",
              border: svWinners.includes(c)
                ? `rgba(${COLORS_RGB.secondary},1)`
                : "#EEEEEE",
            },
          }
        : {
            id: idx + 1,
            label: cmap[c],
            borderWidth: 1,
            color: {
              background: svWinners.includes(c)
                ? `rgba(${COLORS_RGB.secondary},1)`
                : "#EEEEEE",
              border: svWinners.includes(c)
                ? `rgba(${COLORS_RGB.secondary},1)`
                : "#EEEEEE",
            },
          };
    }),
    edges: allEdges,
  };
  const options = {
    layout: {
      hierarchical: false,
      randomSeed: 2,
    },

    nodes: {
      font: { size: numCands < 6 ? 24 : 16 },
      size: 100,
      shape: "box",
    },
    edges: {
      length: numCands < 6 ? 200 : 200,
      arrows: {
        to: { enabled: true, scaleFactor: 1, type: "arrow" },
      },
      font: {
        size: numCands < 6 ? 24 : 16,
        background: "white",
        align: "middle",
      },
      smooth: true,
    },
    height: "500px",
    width: "100vh",
    autoResize: true,
    interaction: { zoomView: false, hover: true },
    // physics: {
    //   enabled: true,
    //   wind: { x: 0, y: 0 },
    //   stabilization: {
    //     enabled: true,
    //   },
    //   barnesHut: {
    //     theta: 0.5, //0.5
    //     gravitationalConstant: -3000, //-2000,
    //     centralGravity: 0.03, //0.3,
    //     springLength: 95,
    //     springConstant: 0.01, //0.04,
    //     damping: 0.09, //0.09
    //     avoidOverlap: 0, //0
    //   },
    //   /* repulsion: {
    //       centralGravity: 0.2,
    //       springLength: 200,
    //       springConstant: 0.05,
    //       nodeDistance: 100,
    //       damping: 0.09
    //     },
    //     */
    //   /* forceAtlas2Based: {
    //       theta: 0.5,
    //       gravitationalConstant: 0, //-50,
    //       centralGravity: 0.01,
    //       springConstant: 0.08,
    //       springLength: 100,
    //       damping: 0.4,
    //       avoidOverlap: 10 //0
    //     },*/
    // },

      physics: {
    enabled: true,
    wind: { x: 0, y: 0 },
    stabilization: {
      enabled: true,
      iterations: 1000,  // Add more iterations
      updateInterval: 10,
      fit: true
    },
    barnesHut: {
      theta: 0.5,
      gravitationalConstant: -3000,
      centralGravity: 0.03,
      springLength: 95,
      springConstant: 0.01,
      damping: 0.09,
      avoidOverlap: 0
    },
  }

  };

  const events = {
    select: function (event) {
      //var { nodes, edges } = event;
    },
    // hoverNode: function (n) {
    //graph.edges[0]["color"] = "red"
    //}
  };
  return (
    <div style={{minHeight:"500px"}}>
    <Graph
      key={v4()}
      graph={graph}
      options={options}
      events={events}
      getNetwork={useCallback((network) => {
        network.on("hoverEdge", function (params) {
          var newEdges = allEdges.map((e) => {
            var newEdge = { ...e };
            if (e.id != params.edge) {
              newEdge["color"] = "lightgrey";
              newEdge["font"]["color"] = "lightgrey";
            }
            //e["opacity"] = 0.1
            return newEdge;
          });
          var newNodes = graph.nodes.map((n) => {
            var newNode = { ...n };
            var src = params.edge.split("-")[0];
            var target = params.edge.split("-")[1];
            if (n.id == src || n.id == target) {
              newNode["color"]["border"] = "black";
              newNode["borderWidth"] = 3;
            }
            //e["opacity"] = 0.1
            return newNode;
          });

          network.body.data.edges.update(newEdges);
          network.body.data.nodes.update(newNodes);
        });

        network.on("blurEdge", function (params) {
          var newEdges = allEdges.map((e) => {
            e["font"]["color"] = "black";
            return e;
          });

          var newNodes = graph.nodes.map((n) => {
            var newNode = { ...n };
            var src = params.edge.split("-")[0];
            var target = params.edge.split("-")[1];
            if (n.id == src || n.id == target) {
              newNode["color"]["border"] = svWinners.includes(n.title)
                ? `rgba(${COLORS_RGB.secondary},1)`
                : "#EEEEEE";
              newNode["borderWidth"] = 1;
            }
            //e["opacity"] = 0.1
            return newNode;
          });
          network.body.data.edges.update(newEdges);
          network.body.data.nodes.update(newNodes);
        });
        network.on("hoverNode", function (params) {
          var newEdges = allEdges.map((e) => {
            var newEdge = { ...e };
            if (e.to !== params.node && e.from !== params.node) {
              newEdge["color"] = "lightgrey";
              newEdge["font"]["color"] = "lightgrey";
            }
            //e["opacity"] = 0.1
            return newEdge;
          });
          network.body.data.edges.update(newEdges);
        });
        network.on("blurNode", function (params) {
          var newEdges = allEdges.map((e) => {
            e["font"]["color"] = "black";
            return e;
          });
          network.body.data.edges.update(newEdges);
        });
      }, [])}
    />
    </div>
  );
}


const MemoMarginGraph = memo(MarginGraph, areEqual);

const onlyZeroMargins = (currCands, margins) => {
  return currCands.every((c) => {
    return currCands.every((c2) => margins[c][c2] == 0);
  });
};

const Explanation = memo(
  ({
    currCands,
    paddingLeft,
    parentColor,
    undefeatedCands,
    svWinners,
    explanations,
    margins,
    cycles,
    hasCycle,
    defeats,
    cmap
  }) => {
    const [shownMainExplanation, setShownMainExplanation] = useState([]);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleAddMainExplanation = (newValue) => {
      setShownMainExplanation(shownMainExplanation.concat(newValue));
    };
    const handleDeleteMainExplanation = (toDelete) => {
      const newShownMainExplanations = shownMainExplanation.filter(
        (eId) => eId !== toDelete
      );
      setShownMainExplanation(newShownMainExplanations);
    };
    var exp = explanations[currCands];

    if (Object.entries(exp).length === 0) {
      return(<span />);
    } else if (Object.keys(exp)[0] == "is_uniquely_undefeated") {
      var a = exp["is_uniquely_undefeated"]["winner"];
      var isCondorcetWinner =
        exp["is_uniquely_undefeated"]["is_condorcet_winner"];
      if (parentColor === null) {
        var currColor = svWinners.includes(a)
          ? `rgba(${COLORS_RGB.secondary}, 0.5)`
          : "white";
      } else {
        var currColor = parentColor;
      }
      return (
        <UniqueUndefeatedExplanation
          margins={margins}
          undefeatedCands={[a]}
          isCondorcetWinner={isCondorcetWinner}
          currCands={currCands.split(",")}
          paddingLeft={paddingLeft}
          cycles={cycles}
          hasCycle={hasCycle}
          defeats={defeats}
          currColor={currColor}
          cmap={cmap}
        />
      );
    } else {
      let sortedExplanations = Object.entries(exp).sort((e1, e2) =>
        parseFloat(e1[1]["margin"]) < parseInt(e2[1]["margin"])
          ? 1
          : parseFloat(e1[1]["margin"]) > parseInt(e2[1]["margin"])
          ? -1
          : 0
      );
      return (
        <Stack sx={{ fontSize: "20px", overflowX:"scroll" }} spacing={1}>
          <UndefeatedExplanation
            margins={margins}
            undefeatedCands={undefeatedCands}
            currCands={currCands.split(",")}
            paddingLeft={paddingLeft}
            cycles={cycles}
            hasCycle={hasCycle}
            defeats={defeats}
            cmap={cmap}
          />
          <Box
            sx={{ paddingLeft: paddingLeft, marginTop: 2, marginBottom: 2 }}
          >
            The tiebreak {winnerStr3(svWinners.map((x)=>cmap[x]))}.
          </Box>
          <Box sx={{ paddingLeft: paddingLeft }}>
            <div>
              {showExplanation ? (
                <HideExplanationButton
                  handleClick={setShowExplanation}
                  handleClickParam={false}
                  buttonText={"Hide explanation"}
                />
              ) : (
                <ShowExplanationButton
                  handleClick={setShowExplanation}
                  handleClickParam={true}
                  buttonText={"Explain why"}
                />
              )}
            </div>
            <Collapse in={showExplanation}>
              <>
                <Box
                  sx={{
                    paddingLeft: paddingLeft,
                    marginTop: 2,
                    paddingBottom: 2.5,
                  }}
                >
                  We find the head-to-head match between two candidates with
                  the largest margin such that the first candidate is
                  undefeated and is the Stable Voting winner after removing
                  the second candidate from the poll:
                </Box>
                {sortedExplanations.map((e, eIdx) => {
                  let a = e[0].split(",")[0];
                  let b = e[0].split(",")[1];
                  let margin = e[1]["margin"];
                  let winners = e[1]["winner"];
                  let candsMinusb = e[1]["cands_minus_b"];
                  let newUndefeatedCands = e[1]["undefeated_cands"];
                  if (parentColor === null) {
                    var currColor =
                      svWinners.includes(a) && winners.split(",").includes(a)
                        ? `rgba(${COLORS_RGB.secondary},0.5)`
                        : winners.split(",").includes(a)
                        ? `rgba(${COLORS_RGB.grey},0.5)`
                        : "white";
                  } else {
                    var currColor =
                      parentColor === `rgba(${COLORS_RGB.secondary},0.5)` &&
                      svWinners.includes(a) &&
                      winners.split(",").includes(a)
                        ? `rgba(${COLORS_RGB.secondary},0.5)`
                        : winners.split(",").includes(a)
                        ? `rgba(${COLORS_RGB.grey},0.5)`
                        : "white";
                  }
                  return (
                    <div key={eIdx}>
                      <Box
                        key={eIdx}
                        sx={{
                          borderTop: `1px solid ${grey[500]}`,
                          paddingTop: 2,
                          paddingBottom: 2,
                          paddingLeft:1,
                          marginLeft: paddingLeft,
                          backgroundColor: currColor,
                          minWidth:700
                        }}
                      >
                        The margin of {cmap[a]} vs. {cmap[b]} is {margin}.{" "}
                        <>
                          <Box
                            sx={{
                              textAlign: "center",
                              fontSize: "24",
                              fontWeight: 600,
                              paddingBottom: "4px",
                            }}
                          >
                            Removing {cmap[b]}
                          </Box>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Paper
                                variant="elevation"
                                elevation={0}
                                sx={{
                                  backgroundColor: `rgba(${COLORS_RGB.lightgrey},1)`,
                                  padding: 4,
                                  marginTop: 5,
                                  border: `2px solid ${COLORS.grey}`,
                                  borderRadius: 2,
                                }}
                              >
                                The Stable Voting{" "}
                                {winners.split(",").length === 1
                                  ? "winner is"
                                  : "winners are"}{" "}
                                {listStrToStr(winners, cmap)}
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Box
                                sx={{
                                  width: "100%",
                                  textAlign: "center",
                                  backgroundColor: "white",
                                }}
                              >
                                {
                                  <MarginSubGraph
                                    margins={margins}
                                    winners={winners.split(",")}
                                    currCands={candsMinusb.split(",")}
                                    bgColor={currColor}
                                    cmap={cmap}
                                  />
                                }
                              </Box>
                            </Grid>
                          </Grid>
                        </>
                        {candsMinusb.length === 1 ||
                        onlyZeroMargins(
                          candsMinusb.split(","),
                          margins
                        ) ? (
                          <Button
                            variant="text"
                            disabled={true}
                            sx={{
                              color: "black !important",
                              paddingLeft: 0,
                              marginLeft: 0,
                            }}
                          >
                            <CheckIcon size="small" />
                          </Button>
                        ) : shownMainExplanation.includes(eIdx) ? (
                          <Button
                            variant="text"
                            onClick={() => handleDeleteMainExplanation(eIdx)}
                            sx={{
                              fontSize: "inherit",
                              color: "inherit",
                              textTransform: "none",
                              fontStyle: "inherit",
                              lineHeight: 1,
                              marginTop: 0,
                              marginBottom: "1px",
                              padding: "4px",
                            }}
                          >
                            <KeyboardArrowUpIcon
                              sx={{ marginRight: "3px" }}
                            />
                            Hide explanation
                          </Button>
                        ) : (
                          <Button
                            variant="text"
                            onClick={() => {handleAddMainExplanation(eIdx)}}
                            sx={{
                              fontSize: "inherit",
                              color: "inherit",
                              textTransform: "none",
                              fontStyle: "inherit",
                              lineHeight: 1,
                              marginTop: 0,
                              marginBottom: "1px",
                              padding: "4px",
                            }}
                          >
                            <QuestionAnswerOutlinedIcon
                              sx={{ marginRight: "3px" }}
                            />
                            Explain why {winnerStr2(winners.split(",").map((x)=> cmap[x]))}
                          </Button>
                        )}
                        <Collapse in={shownMainExplanation.includes(eIdx)}>
                          <Stack spacing={1}>
                            {shownMainExplanation.includes(eIdx) && <Explanation
                              key={eIdx  + 1}
                              currCands={candsMinusb}
                              undefeatedCands={newUndefeatedCands.split(",")}
                              svWinners={winners.split(",")}
                              paddingLeft={paddingLeft + 2}
                              parentColor={currColor}
                              explanations={explanations}
                              margins={margins}
                              cycles={cycles}
                              defeats={defeats}
                              cmap={cmap}
                          />}
                          </Stack>
                        </Collapse>
                      </Box>
                    </div>
                  );
                })}
              </>
            </Collapse>
          </Box>
        </Stack>
      );
    }
  }
); // end explanation

export const Results = ({ pollId, demoRankings }) => {
  const [showNotFoundMessage, setShowNotFoundMessage] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [cand1, setCand1] = useState("");
  const [cand2, setCand2] = useState("");
  const [currShownExplanations, setCurrShownExplanations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pollOutcome, setPollOutcome] = useState({
    title: "",
    no_candidates_ranked: false,
    one_ranked_candidate: false,
    candidates: [],
    canView: true,
    closingDateTimeStr: null,
    timezone: null,
    svWinners: [],
    scWinners: [],
    selectedSVWinner: null,
    condorcetWinner: null,
    margins: {},
    numVoters: 0,
    numRows: 0,
    columns: [],
    explanations: {},
    linearOrder: [],
    defeats: {},
    cycles: {},
    cmap: {},
    hasCycle: false,
    allowShowProfile: false,
  });
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const matches = useMediaQuery("(min-width:600px)");
  const [error, setError] = useState(null);

  var { id } = params;
  const vid = searchParams.get("vid");
  const oid = searchParams.get("oid");
  //console.log("demoRanking")
  //console.log(demoRankings)
  id = id == undefined ? pollId : id;

  if(demoRankings !== undefined) {
    var api_url = `${API_URL}/polls/demo_outcome/`
    //console.log("Loading demo poll....")
    var submittedRankings = {"rankings": demoRankings}

  }
  else {
    var api_url = `${API_URL}/polls/outcome/${id}?oid=${oid}&vid=${vid}`
    var submittedRankings = {}
  }

  useEffect(() => {
    axios
      .post(api_url, submittedRankings)
      .then((resp) => {
        setPollOutcome({
          title: resp.data["title"],
          candidates: Object.keys(resp.data["margins"]).sort(),
          cmap: resp.data["cmap"],
          no_candidates_ranked: resp.data["no_candidates_ranked"],
          one_ranked_candidate: resp.data["one_ranked_candidate"],
          canView: resp.data["can_view"],
          closingDateTimeStr: resp.data["closing_datetime"],
          timezone: resp.data["timezone"],
          svWinners: resp.data["sv_winners"],
          scWinners: resp.data["sc_winners"],
          selectedSVWinner: resp.data["selected_sv_winner"],
          condorcetWinner:
            resp.data["condorcet_winner"] !== "N/A"
              ? resp.data["condorcet_winner"]
              : null,
          margins: resp.data["margins"],
          explanations: resp.data["explanations"],
          defeats: resp.data["defeats"],
          hasDefeats: resp.data["has_defeats"],
          hasCycle: resp.data["has_cycle"],
          linearOrder: resp.data["linear_order"],
          cycles: resp.data["splitting_numbers"],
          numVoters: parseInt(resp.data["num_voters"]),
          numRows: resp.data["num_rows"],
          columns: resp.data["columns"],
          allowShowProfile: resp.data["show_rankings"],
        });
        //console.log("POLL OUTCOME");
        //console.log(resp.data);
        setIsLoading(false);
        //window.history.replaceState({}, document.title)
      })
      .catch((err) => {
        console.log("Error in poll outcome request:", err);
        
        // Safely access error details
        let errorMessage = "An error occurred while fetching results";
        let isNotFound = false;
        
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Server error response:", err.response);
          
          // Check if it's a 404 or poll not found error
          if (err.response.status === 404) {
            isNotFound = true;
          }
          
          // Safely navigate the error object
          if (err.response.data) {
            if (err.response.data.detail) {
              if (typeof err.response.data.detail === 'string') {
                errorMessage = err.response.data.detail;
                // Check for "poll not found" type messages
                if (errorMessage.toLowerCase().includes('not found') || 
                    errorMessage.toLowerCase().includes('does not exist')) {
                  isNotFound = true;
                }
              } else if (err.response.data.detail.error) {
                errorMessage = err.response.data.detail.error;
                if (errorMessage.toLowerCase().includes('not found') || 
                    errorMessage.toLowerCase().includes('does not exist')) {
                  isNotFound = true;
                }
              }
            } else if (err.response.data.error) {
              errorMessage = err.response.data.error;
              if (errorMessage.toLowerCase().includes('not found') || 
                  errorMessage.toLowerCase().includes('does not exist')) {
                isNotFound = true;
              }
            }
          }
        } else if (err.request) {
          // The request was made but no response was received
          console.error("No response received:", err.request);
          errorMessage = "No response from server. Please check your connection.";
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Request setup error:", err.message);
          errorMessage = err.message || "Failed to send request";
        }
        
        // Set the appropriate state based on the error
        if (isNotFound) {
          setShowNotFoundMessage(true);
        } else {
          setError(errorMessage);
        }
        setIsLoading(false);
      });

      // .catch((err) => {
      //   console.log("Error message");
      //   console.error(err["response"].data["detail"]["error"]);
      //   setShowNotFoundMessage(true);
      //   setIsLoading(false);
      // });
  }, [demoRankings]);


  const getShareableUrl = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete('oid'); // Remove oid for security
  return url.toString();
};

const shareResults = async () => {
  const shareUrl = getShareableUrl();
  const winners = pollOutcome.svWinners.map(w => pollOutcome.cmap[w]).join(', ');
  
  const shareData = {
    title: pollOutcome.title,
    text: `Poll Results: The winner is ${winners}. Check out the full results!`,
    url: shareUrl
  };
  
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  } catch (err) {
    console.log('Share cancelled');
  }
};

  console.log(pollOutcome)
  console.log(pollOutcome.cmap[2])
  console.log(pollOutcome.cmap["2"])
  return (
    <>
      <Container maxWidth="lg" sx={{ marginBottom: 10 }}>
        <Paper
          elevation={0}
          sx={{ marginLeft: "auto", marginRight: "auto", marginTop: 10 }}
        >
          {isLoading || showNotFoundMessage || !pollOutcome.canView ? (
            <>
              {isLoading ? (
                <div>
                  <Paper elevation={0}>
                    <Box sx={{ textAlign: "center" }}>
                      <CircularProgress />{" "}
                    </Box>
                  </Paper>
                </div>
              ) : (
                <>
                  {" "}
                  {showNotFoundMessage ? (
                    <Alert sx={{ padding: 5 }} severity="error">
                      <AlertTitle>Poll not found</AlertTitle>
                      There is no poll with the id {id}.
                    </Alert>
                  ) : (
                    <>
                      {" "}
                      {pollOutcome.closingDateTimeStr != "N/A" ? (
                        <Alert sx={{ padding: 5 }} severity="info">
                          <AlertTitle>Poll not closed</AlertTitle>
                          You can view the results after the poll closes on{" "}
                          {pollOutcome.closingDateTimeStr}.
                        </Alert>
                      ) : (
                        <Alert sx={{ padding: 5 }} severity="info">
                          <AlertTitle>Cannot view outcome</AlertTitle>
                          The outcome of the poll is not publicly available.
                        </Alert>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <Typography
                component="h1"
                variant="h4"
                align="center"
                sx={{ marginBottom: "40px" }}
              >
                Results for {pollOutcome.title}
              </Typography>

              {pollOutcome.numVoters === 0 ? (
                <Box sx={{ fontSize: 20, textAlign: "center", marginTop: 2 }}>
                  {" "}
                  No one has participated in the poll.
                </Box>
              ) : (
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={12}>
                  <Paper
                    variant="elevation"
                    elevation={0}
                    sx={{
                      backgroundColor: `rgba(${COLORS_RGB.lightgrey}, 1)`,
                      padding: 4,
                      border: `2px solid ${COLORS.grey}`,
                      borderRadius: 2,
                    }}
                  >
                    <Stack spacing={2} sx={{ fontSize: 20 }}>
                      {!pollOutcome.no_candidates_ranked ? 
                      <WinnerString winners = {pollOutcome.svWinners} cmap={pollOutcome.cmap} selectedSVWinner = {pollOutcome.selectedSVWinner}/>:
                      "No candidates were ranked by the voters."
                      }
                      <Box>
                        {pollOutcome.numVoters === 1
                          ? "1 person "
                          : pollOutcome.numVoters.toString() + " people"}{" "}
                        participated in this poll.
                      </Box>
                    </Stack>
                  </Paper>
                                        <Box sx={{ textAlign: 'left', mt: 2 }}>
                        <Button 
                          variant="outlined" 
                          onClick={shareResults}
                          startIcon={<ShareIcon />}
                          sx={{ 
                            textTransform: 'none',
                            fontSize: '16px'
                          }}
                        >
                          Share Results
                        </Button>
                      </Box>

                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Box
                      sx={{
                        textAlign: "center",
                        fontSize: 24,
                        fontWeight: 500,
                      }}
                    >
                      Majority Comparisons
                    </Box>
                    <Box
                      sx={{
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "inherit",
                      }}
                    >
                      {pollOutcome.hasDefeats && pollOutcome.linearOrder.length === 0
                        ? "Defeats are shown in blue."
                        : ""}
                    </Box>

                    <Box sx={{ width: "100%", textAlign: "center" }}>
                      {pollOutcome.linearOrder.length === 0 ? (
                        <>
                          <MemoMarginGraph
                            key="mg"
                            margins={pollOutcome.margins}
                            cw={pollOutcome.condorcetWinner}
                            svWinners={pollOutcome.svWinners}
                            defeats={pollOutcome.defeats}
                            currCands={pollOutcome.candidates}
                            cmap={pollOutcome.cmap}
                      /> 
                        </>
                      ) : (
                        <span>
                        <LinearOrder
                          margins={pollOutcome.margins}
                          candidateOrder={pollOutcome.linearOrder}
                          cmap={pollOutcome.cmap}
                      /> 
                      </span>
                      )}
                    </Box>
                  </Grid> 
                  {Object.keys(pollOutcome.explanations).length === 0 || Object.keys(pollOutcome.explanations[pollOutcome.candidates.join(",")]).length === 0 ? 
                    <Grid item xs={12}>
                      <Box sx={{
                          fontSize: 20,
                          color: "inherit",
                          textAlign:"left",
                          fontStyle: "inherit",
                          marginTop: 0,
                        }}>
                          {pollOutcome.no_candidates_ranked ? "": pollOutcome.one_ranked_candidate ? `${pollOutcome.cmap[pollOutcome.candidates[0]]} is the only candidate that is ranked by any voter.`: "Explanation of winner is too complicated to display."}
                          
                      </Box>
                  </Grid> : 
                  <Grid item xs={12}>
                    <Box>
                      <Button
                        variant="text"
                        sx={{
                          fontSize: 20,
                          color: "inherit",
                          textTransform: "none",
                          fontStyle: "inherit",
                          marginTop: 0,
                        }}
                        onClick={() => {
                          setShowExplanation(!showExplanation);
                        }}
                      >
                        {showExplanation
                          ? "Hide explanation"
                          : `Explain why ${winnerStr2(pollOutcome.svWinners.map((x) => pollOutcome.cmap[x]
                            ))}`}{" "}
                        {showExplanation ? (
                          <KeyboardArrowDownIcon />
                        ) : (
                          <KeyboardArrowRightIcon />
                        )}{" "}
                      </Button>
                      <Stack spacing={3}>
                        <Collapse in={showExplanation}>
                          <Explanation
                            currCands={pollOutcome.candidates.join(",")}
                            paddingLeft={1}
                            parentColor={null}
                            svWinners={pollOutcome.svWinners}
                            undefeatedCands = {pollOutcome.scWinners}
                            explanations={pollOutcome.explanations}
                            margins={pollOutcome.margins}
                            cycles={pollOutcome.cycles}
                            hasCycle={pollOutcome.hasCycle}
                            defeats={pollOutcome.defeats}
                            cmap={pollOutcome.cmap}
                          />
                        </Collapse>
                      </Stack>
                    </Box>
                  </Grid>
                  }
                  {pollOutcome.allowShowProfile ? (
                    <Grid item xs={12}>
                      <Button
                        variant="text"
                        sx={{
                          fontSize: 20,
                          color: "inherit",
                          textTransform: "none",
                          fontStyle: "inherit",
                        }}
                        onClick={() => {
                          setCand1("");
                          setCand2("");
                          setShowProfile(!showProfile);
                        }}
                      >
                        {showProfile ? "Hide" : "Show"} the submitted rankings{" "}
                        {showProfile ? (
                          <KeyboardArrowDownIcon />
                        ) : (
                          <KeyboardArrowRightIcon />
                        )}{" "}
                      </Button>
                      <Collapse in={showProfile}>
                        <Box sx={{ marginTop: 4, overflow: "scroll" }}>
                          <Profile
                            columnData={{"columns": pollOutcome.columns, "numRows": pollOutcome.numRows}}
                            cand1={cand1}
                            cand2={cand2}
                            cmap={pollOutcome.cmap}
                        />
                          <Box
                            component="div"
                            sx={{ marginTop: 4, fontSize: 20 }}
                          >
                            The margin of{" "}
                            <Box component="span">
                              <Select
                                variant="standard"
                                value={cand1}
                                onChange={(ev) => {
                                  setCand1(ev.target.value);
                                }}
                                label="Choose Candidate"
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {pollOutcome.candidates.map((c, cIdx) => (
                                  <MenuItem key={cIdx} value={c}>
                                    {pollOutcome.cmap[c]}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Box>{" "}
                            vs.{" "}
                            <Box component="span">
                              <Select
                                variant="standard"
                                value={cand2}
                                onChange={(ev) => {
                                  setCand2(ev.target.value);
                                }}
                                label="Choose Candidate"
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                {pollOutcome.candidates.map((c, cIdx) => (
                                  <MenuItem key={cIdx} value={c}>
                                    {pollOutcome.cmap[c]}
                                  </MenuItem>
                                ))}
                              </Select>
                            </Box>{" "}
                            is{" "}
                            {cand1 !== "" && cand2 !== ""
                              ? pollOutcome.margins[cand1][cand2].toString() +
                                "."
                              : ""}
                          </Box>
                        </Box>
                      </Collapse>
                    </Grid>
                  ) : (
                    <div />
                  )}
                </Grid>
                )}
            </>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default Results;
