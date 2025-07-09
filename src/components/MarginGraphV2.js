import React, { memo, useMemo } from "react";
import CytoscapeComponent from "react-cytoscapejs";

// Main unified component with hover highlighting
const MarginGraph = memo(
  ({
    margins,
    winners = [],
    undefeatedCands = [],
    currCands,
    defeats = null,
    bgColor = "white",
    cmap,
    cycle = null,
    splittingNum = null,
    mode = "all", // "all" | "defeats" | "cycle"
    height = "400px",
    width = "100vh",
    nodeSize = 75,
    COLORS = { primary: "#1976d2", third: "#ff9800" },
    showLegend = true
  }) => {
    const elements = useMemo(() => {
      const nodes = [];
      const edges = [];

      // Create nodes
      currCands.forEach((candidate, idx) => {
        const label = cmap[candidate];
        const displayLabel = label.length > 5 ? `${label.slice(0, 5)}...` : label;
        
        // Determine if node should be highlighted based on mode
        let isWinner = false;
        let nodeTitle = label;
        
        if (mode === "all" && winners.includes(candidate)) {
          isWinner = true;
          nodeTitle = `${label} is a Stable Voting winner`;
        } else if (mode === "defeats" && undefeatedCands.includes(candidate)) {
          isWinner = true;
          nodeTitle = `${label} is undefeated.`;
        }

        nodes.push({
          data: {
            id: (idx + 1).toString(),
            candidateId: candidate,
            label: displayLabel,
            fullLabel: label,
            isWinner: isWinner,
            title: nodeTitle
          }
        });
      });

      // Create edges based on mode
      for (let c1_idx = 0; c1_idx < currCands.length; c1_idx++) {
        for (let c2_idx = 0; c2_idx < currCands.length; c2_idx++) {
          const c1 = currCands[c1_idx];
          const c2 = currCands[c2_idx];
          
          if (c1 === c2) continue;
          
          const margin = margins[c1]?.[c2];
          if (!margin || margin <= 0) continue;

          let includeEdge = false;
          let edgeColor = "black";
          let edgeWidth = 2;

          switch (mode) {
            case "all":
              includeEdge = true;
              break;
              
            case "defeats":
              includeEdge = defeats && defeats[c1] && defeats[c1][c2];
              if (includeEdge) {
                edgeColor = COLORS.primary;
              }
              break;
              
            case "cycle":
              if (cycle) {
                const cycleList = cycle.split(",");
                includeEdge = 
                  cycle.includes(`${c1},${c2}`) ||
                  (cycleList[cycleList.length - 1] == c1 && cycleList[0] == c2);
                
                if (includeEdge && margin === splittingNum) {
                  edgeWidth = 4;
                  edgeColor = COLORS.third;
                }
              }
              break;
          }

          if (includeEdge) {
            edges.push({
              data: {
                id: `e${c1_idx + 1}-${c2_idx + 1}`,
                source: (c1_idx + 1).toString(),
                target: (c2_idx + 1).toString(),
                label: margin.toString(),
                margin: margin,
                title: `The margin of ${cmap[c1]} vs. ${cmap[c2]} is ${margin}.`,
                originalColor: edgeColor,
                originalWidth: edgeWidth
              }
            });
          }
        }
      }

      return [...nodes, ...edges];
    }, [margins, currCands, cmap, winners, undefeatedCands, defeats, cycle, splittingNum, mode, COLORS]);

    const stylesheet = [
      // Base node style
      {
        selector: "node",
        style: {
          "background-color": "#EEEEEE",
          "border-color": "gray",
          "border-width": 1,
          "label": "data(label)",
          "text-valign": "center",
          "text-halign": "center",
          "font-size": "20px",
          "font-family": "Arial, sans-serif",
          "shape": "rectangle",
          "width": nodeSize,
          "height": nodeSize,
          "transition-property": "background-color, border-color, border-width, opacity",
          "transition-duration": "0.2s"
        }
      },
      // Winner/undefeated nodes
      {
        selector: "node[isWinner]",
        style: {
          "border-color": "black",
          "border-width": 2
        }
      },
      // Base edge style
      {
        selector: "edge",
        style: {
          "width": "data(originalWidth)",
          "line-color": "data(originalColor)",
          "target-arrow-color": "data(originalColor)",
          "target-arrow-shape": "triangle",
          "arrow-scale": 1,
          "curve-style": "bezier",
          "control-point-step-size": 40,
          "label": "data(label)",
          "font-size": "20px",
          "text-background-color": bgColor,
          "text-background-opacity": 1,
          "text-background-shape": "rectangle",
          "text-background-padding": "3px",
          "text-margin-y": -10,
          "transition-property": "line-color, target-arrow-color, width, opacity",
          "transition-duration": "0.2s",
          "z-index": 1
        }
      },
      // Hover styles
      {
        selector: "node.hover",
        style: {
          "background-color": "#FFE0E0",
          "border-color": "#FF0000",
          "border-width": 3,
          "z-index": 100
        }
      },
      {
        selector: "edge.hover-outgoing",
        style: {
          "line-color": "#FF4444",
          "target-arrow-color": "#FF4444",
          "width": 5,
          "z-index": 50,
          "font-size": "24px",
          "font-weight": "bold"
        }
      },
      {
        selector: "edge.hover-incoming",
        style: {
          "line-color": "#4444FF",
          "target-arrow-color": "#4444FF",
          "width": 5,
          "z-index": 50,
          "font-size": "24px",
          "font-weight": "bold"
        }
      },
      {
        selector: ".dim",
        style: {
          "opacity": 0.2
        }
      },
      {
        selector: "edge.dim",
        style: {
          "opacity": 0.15,
          "z-index": 0
        }
      }
    ];

    const layoutConfig = {
      name: mode === "cycle" ? "circle" : "cose",
      animate: true,
      animationDuration: 0,
      randomize: false,
      fit: true,
      padding: 30,
      // Cose-specific options (similar to Barnes-Hut)
      nodeRepulsion: (node) => 3000,
      idealEdgeLength: (edge) => mode === "defeats" ? 125 : 100,
      edgeElasticity: (edge) => 95,
      nestingFactor: 0.01,
      gravity: 0.03,
      numIter: 1000,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0,
      componentSpacing: 100,
      // For cycle layout
      startAngle: 0,
      sweep: undefined,
      clockwise: true,
      radius: undefined
    };

    return (
      <div style={{ height, width, background: bgColor, position: "relative" }}>
        <CytoscapeComponent
          elements={elements}
          stylesheet={stylesheet}
          layout={layoutConfig}
          style={{ width: "100%", height: "100%" }}
          cy={(cy) => {
            // Configure interaction
            cy.userZoomingEnabled(false);
            cy.autoungrabify(true);
            
            // Clear previous listeners
            cy.off("mouseover");
            cy.off("mouseout");
            cy.off("tap");
            
            let tooltip = null;
            let lockedNode = null;
            
            // Helper to create tooltip
            const createTooltip = (content, x, y) => {
              removeTooltip();
              tooltip = document.createElement("div");
              tooltip.innerHTML = content;
              tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.85);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
                pointer-events: none;
                z-index: 1000;
                left: ${x}px;
                top: ${y}px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              `;
              cy.container().appendChild(tooltip);
            };
            
            const removeTooltip = () => {
              if (tooltip) {
                tooltip.remove();
                tooltip = null;
              }
            };
            
            // Node hover
            cy.on("mouseover", "node", (evt) => {
              if (lockedNode) return;
              
              const node = evt.target;
              const pos = evt.renderedPosition;
              
              // Add hover classes
              node.addClass("hover");
              
              // Get edges
              const outgoing = node.edgesTo("*");
              const incoming = cy.edges(`[target = "${node.id()}"]`);
              
              outgoing.addClass("hover-outgoing");
              incoming.addClass("hover-incoming");
              
              // Dim others
              cy.elements()
                .not(node)
                .not(outgoing)
                .not(incoming)
                .not(outgoing.targets())
                .not(incoming.sources())
                .addClass("dim");
              
              // Show full label
              node.style("label", node.data("fullLabel"));
              
              // Tooltip
              createTooltip(
                `<strong>${node.data("fullLabel")}</strong><br/>
                <span style="color: #FF4444">Defeats:</span> ${outgoing.length}<br/>
                <span style="color: #4444FF">Defeated by:</span> ${incoming.length}`,
                pos.x + 10,
                pos.y - 40
              );
            });
            
            cy.on("mouseout", "node", (evt) => {
              if (lockedNode) return;
              
              const node = evt.target;
              
              // Remove classes
              cy.elements().removeClass("hover hover-outgoing hover-incoming dim");
              
              // Restore label
              const label = node.data("fullLabel");
              node.style("label", label.length > 5 ? `${label.slice(0, 5)}...` : label);
              
              removeTooltip();
            });
            
            // Click to lock
            cy.on("tap", "node", (evt) => {
              evt.stopPropagation();
              const node = evt.target;
              
              if (lockedNode && lockedNode.id() === node.id()) {
                // Unlock
                lockedNode = null;
                cy.elements().removeClass("hover hover-outgoing hover-incoming dim");
                
                // Restore label
                const label = node.data("fullLabel");
                node.style("label", label.length > 5 ? `${label.slice(0, 5)}...` : label);
                
                removeTooltip();
              } else {
                // Clear previous lock
                if (lockedNode) {
                  cy.elements().removeClass("hover hover-outgoing hover-incoming dim");
                  const prevLabel = lockedNode.data("fullLabel");
                  lockedNode.style("label", prevLabel.length > 5 ? `${prevLabel.slice(0, 5)}...` : prevLabel);
                }
                
                // Lock new node
                lockedNode = node;
                node.addClass("hover");
                
                const outgoing = node.edgesTo("*");
                const incoming = cy.edges(`[target = "${node.id()}"]`);
                
                outgoing.addClass("hover-outgoing");
                incoming.addClass("hover-incoming");
                
                cy.elements()
                  .not(node)
                  .not(outgoing)
                  .not(incoming)
                  .not(outgoing.targets())
                  .not(incoming.sources())
                  .addClass("dim");
                
                node.style("label", node.data("fullLabel"));
              }
            });
            
            // Click on background to unlock
            cy.on("tap", (evt) => {
              if (evt.target === cy) {
                if (lockedNode) {
                  lockedNode = null;
                  cy.elements().removeClass("hover hover-outgoing hover-incoming dim");
                  cy.nodes().forEach(n => {
                    const label = n.data("fullLabel");
                    n.style("label", label.length > 5 ? `${label.slice(0, 5)}...` : label);
                  });
                  removeTooltip();
                }
              }
            });
            
            // Edge hover
            cy.on("mouseover", "edge", (evt) => {
              const edge = evt.target;
              const pos = evt.renderedPosition;
              createTooltip(edge.data("title"), pos.x, pos.y - 30);
            });
            
            cy.on("mouseout", "edge", () => {
              if (!lockedNode) removeTooltip();
            });
          }}
        />
        
        {/* Legend - only show if enabled */}
        {showLegend && (
          <div style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            background: "rgba(255,255,255,0.95)",
            padding: "8px 12px",
            borderRadius: "4px",
            fontSize: "12px",
            border: "1px solid #ddd",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <div style={{ marginBottom: "4px", fontWeight: "bold" }}>Hover over a candidate:</div>
            <div><span style={{ color: "#FF4444" }}>→</span> Defeats these candidates</div>
            <div><span style={{ color: "#4444FF" }}>→</span> Is defeated by these</div>
            <div style={{ fontSize: "10px", marginTop: "4px", color: "#666" }}>Click to lock/unlock</div>
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Proper memoization
    return JSON.stringify({
      margins: prevProps.margins,
      winners: prevProps.winners,
      undefeatedCands: prevProps.undefeatedCands,
      currCands: prevProps.currCands,
      defeats: prevProps.defeats,
      cycle: prevProps.cycle,
      splittingNum: prevProps.splittingNum,
      mode: prevProps.mode,
      showLegend: prevProps.showLegend
    }) === JSON.stringify({
      margins: nextProps.margins,
      winners: nextProps.winners,
      undefeatedCands: nextProps.undefeatedCands,
      currCands: nextProps.currCands,
      defeats: nextProps.defeats,
      cycle: nextProps.cycle,
      splittingNum: nextProps.splittingNum,
      mode: nextProps.mode,
      showLegend: nextProps.showLegend
    });
  }
);

// Export the specific variants for backward compatibility
export const MarginSubGraph = memo((props) => (
  <MarginGraph
    {...props}
    mode="all"
    height="250px"
    width="50vh"
    nodeSize={100}
    showLegend={false}
  />
));

export const MarginSubGraphDefeats = memo((props) => (
  <MarginGraph
    {...props}
    mode="defeats"
    height="400px"
    width="100vh"
    nodeSize={50}
  />
));

export const Cycle = memo((props) => (
  <MarginGraph
    {...props}
    mode="cycle"
    height="250px"
    width="250px"
    nodeSize={75}
    showLegend={false}
  />
));