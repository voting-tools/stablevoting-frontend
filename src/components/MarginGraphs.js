import React, { useState, useEffect, memo, useMemo } from "react";
import { v4 } from "uuid";
import "./network.css";
import { COLORS, COLORS_RGB } from "./helpers";
import Graph from "react-graph-vis";

function areEqual(prevProps, nextProps) { return true}



export const MarginSubGraph = memo(
  ({ margins, winners, currCands, bgColor, cmap }) => {
    var allEdges = [];
    for (var c1_idx = 0; c1_idx < currCands.length; c1_idx++) {
      for (var c2_idx = 0; c2_idx < currCands.length; c2_idx++) {
        var c1 = currCands[c1_idx];
        var c2 = currCands[c2_idx];
        if (c1 !== c2) {
          if (margins[c1][c2] > 0) {
            allEdges.push({
              from: c1_idx + 1,
              to: c2_idx + 1,
              label: margins[c1][c2].toString(),
              title: `The margin of ${cmap[c1]} vs. ${cmap[c2]} is ${margins[c1][
                c2
              ].toString()}.`,
              font: { background: bgColor },
              width: 2,
              color: "black",
              arrows: { to: true },
            });
          }
        }
      }
    }
    const graph = {
      nodes: currCands.map((c, idx) => {
        return winners.includes(c)
          ? {
              id: idx + 1,
              label: cmap[c],
              title: `${cmap[c]} is a Stable Voting winner`,
              borderWidth: 2,
              color: {
                background: "#EEEEEE", //green[200],
                border: "black", // green[200],
              },
            }
          : {
              id: idx + 1,
              label: cmap[c],
              borderWidth: 1,
              color: {
                background: "#EEEEEE",
                border: "gray",
              },
            };
      }),
      edges: allEdges,
    };
    const options = {
      layout: {
        randomSeed: 0,
        hierarchical: false,
      },
      nodes: {
        font: { size: 20 },
        size: 100,
        shape: "box",
      },
      edges: {
        length: 100,
        arrows: {
          to: { enabled: true, scaleFactor: 1, type: "arrow" },
        },
        font: {
          size: 20,
          background: "white",
          align: "middle",
        },
        smooth: true,
      },
      height: "250px",
      width: "50vh",
      interaction: { zoomView: false, hover: true },
      physics: {
        enabled:true,
        wind: { x: 0, y: 0 },
        stabilization: {
          enabled: true,
        },
        barnesHut: {
          theta: 0.5, //0.5
          gravitationalConstant: -3000,//-2000,
          centralGravity: 0.03, //0.3,
          springLength: 95,
          springConstant: 0.01,//0.04,
          damping: 0.09, //0.09
          avoidOverlap: 0 //0
        },
        }
  };

    const events = {
      select: function (event) {
        //var { nodes, edges } = event;
      },
    };
    return useMemo(() => {
      return (
        <Graph
          key={v4()}
          graph={graph}
          options={options}
          events={events}
          style={{ background: bgColor }}
          getNetwork={(network) => {
            //console.log(network);
            //  if you want access to vis.js network api you can set the state in a parent component using this property
          }}
        />
      );
    }, []);
  },
  (props) => {
    console.log(props);
    return true;
  }
);

export const MarginSubGraphDefeats = memo(
  ({ margins, undefeatedCands, currCands, defeats, bgColor, cmap }) => {
    var allEdges = [];
    for (var c1_idx = 0; c1_idx < currCands.length; c1_idx++) {
      for (var c2_idx = 0; c2_idx < currCands.length; c2_idx++) {
        var c1 = currCands[c1_idx];
        var c2 = currCands[c2_idx];
        if (c1 !== c2) {
          if (margins[c1][c2] > 0 && defeats[c1][c2]) {
            allEdges.push({
              from: c1_idx + 1,
              to: c2_idx + 1,
              label: margins[c1][c2].toString(),
              title: `The margin of ${cmap[c1]} vs. ${cmap[c2]} is ${margins[c1][
                c2
              ].toString()}. `,
              font: { background: bgColor },
              width: 2,
              color: COLORS.primary,
              arrows: { to: true },
            });
          }
        }
      }
    }
    const graph = {
      nodes: currCands.map((c, idx) => {
        return undefeatedCands.includes(c)
          ? cmap[c].length > 5
            ? {
                id: idx + 1,
                label: cmap[c].slice(0, 5) + "...",
                title: `${cmap[c]} is undefeated.`,
                borderWidth: 2,
                color: {
                  background: "#EEEEEE", //green[200],
                  border: "black", // green[200],
                },
              }
            : {
                id: idx + 1,
                label: cmap[c],
                title: `${cmap[c]} is undefeated.`,
                borderWidth: 2,
                color: {
                  background: "#EEEEEE", //green[200],
                  border: "black", // green[200],
                },
              }
          : cmap[c].length > 5
          ? {
              id: idx + 1,
              label: cmap[c].slice(0, 5) + "...",
              title: cmap[c],
              borderWidth: 1,
              color: {
                background: "#EEEEEE",
                border: "gray",
              },
            }
          : {
              id: idx + 1,
              label: cmap[c],
              borderWidth: 1,
              color: {
                background: "#EEEEEE",
                border: "gray",
              },
            };
      }),
      edges: allEdges,
    };
    const options = {
      layout: {
        randomSeed: 0,
        hierarchical: false,
      },
      nodes: {
        font: { size: 20 },
        size: 50,
        shape: "box",
      },
      edges: {
        length: 125,
        arrows: {
          to: { enabled: true, scaleFactor: 0.5, type: "arrow" },
        },
        font: {
          size: 20,
          background: "white",
          align: "middle",
        },
        smooth: true,
      },
      height: "400px",
      width: "100vh",
      interaction: { zoomView: false, hover: true },
      physics: {
        enabled:true,
        wind: { x: 0, y: 0 },
        stabilization: {
          enabled: true,
        },
        barnesHut: {
          theta: 0.5, //0.5
          gravitationalConstant: -3000,//-2000,
          centralGravity: 0.03, //0.3,
          springLength: 95,
          springConstant: 0.01,//0.04,
          damping: 0.09, //0.09
          avoidOverlap: 0 //0
        }
      }
    };

    const events = {
      select: function (event) {
        //var { nodes, edges } = event;
      },
    };
    return useMemo(() => {
      return (
        <Graph
          key={v4()}
          graph={graph}
          options={options}
          events={events}
          getNetwork={(network) => {
            //console.log(network);
            //  if you want access to vis.js network api you can set the state in a parent component using this property
          }}
        />
      );
    }, []);
  },
  (props) => {
    return true;
  }
);

export const Cycle = memo(
  ({ margins, currCands, splittingNum, cycle, bgColor, cmap }) => {
    var allEdges = [];
    var cycleList = cycle.split(",");
    for (var c1_idx = 0; c1_idx < currCands.length; c1_idx++) {
      for (var c2_idx = 0; c2_idx < currCands.length; c2_idx++) {
        var c1 = currCands[c1_idx];
        var c2 = currCands[c2_idx];
        if (c1 !== c2) {
          if (
            margins[c1][c2] > 0 &&
            (cycle.includes(c1.toString() + "," + c2.toString()) ||
              (cycleList[cycleList.length - 1] == c1 && cycleList[0] == c2))
          ) {
            allEdges.push({
              from: c1_idx + 1,
              to: c2_idx + 1,
              label: margins[c1][c2].toString(),
              title: `The margin of ${cmap[c1]} vs. ${cmap[c2]} is ${margins[c1][
                c2
              ].toString()}.`,
              font: { background: bgColor },
              width: margins[c1][c2] == splittingNum ? 4 : 2,
              color: margins[c1][c2] == splittingNum ? COLORS.third : "black",
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
              borderWidth: 1,
              color: {
                background: "#EEEEEE", //green[200],
                border: "gray", // green[200],
              },
            }
          : {
              id: idx + 1,
              label: cmap[c],
              borderWidth: 1,
              color: {
                background: "#EEEEEE",
                border: "gray",
              },
            };
      }),
      edges: allEdges,
    };
    const options = {
      layout: {
        randomSeed: 0,
        hierarchical: false,
      },
      nodes: {
        font: { size: 20 },
        size: 75,
        shape: "box",
      },
      edges: {
        length: 100,
        arrows: {
          to: { enabled: true, scaleFactor: 0.5, type: "arrow" },
        },
        font: {
          size: 20,
          background: "white",
          align: "middle",
        },
        smooth: true,
      },
      height: "250px",
      width: "250px",
      layout: { randomSeed: 7 },
      interaction: { zoomView: false, hover: true },
      physics: {
        timestep: 0,
        solver: "forceAtlas2Based",
      },
    };

    const events = {
      select: function (event) {
        //var { nodes, edges } = event;
      },
    };
    return useMemo(() => {
      return (
        <Graph
          key={v4()}
          graph={graph}
          options={options}
          events={events}
          getNetwork={(network) => {
            //console.log(network);
            //  if you want access to vis.js network api you can set the state in a parent component using this property
          }}
        />
      );
    }, []);
  },
  (props) => {
    console.log(props);
    return true;
  }
);
