import React, { useEffect, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
  MiniMap,
  Controls,
} from "reactflow";
import { stratify, tree } from "d3-hierarchy";
import { Box } from "@mui/material";
import "reactflow/dist/style.css";

// import your BusinessContext hook or any other context as needed
import { useBusinessContext } from "../context/BusinessContext";

// Set default / fallback nodes and edges (optional)
const initialNodes = [];
const initialEdges = [];

// Define node dimensions for tree layout
const nodeWidth = 172;
const nodeHeight = 36;

// A helper function to position nodes in a tree-like layout
const getLayoutedElements = (nodes, edges) => {
  if (nodes.length === 0) {
    return { nodes, edges };
  }

  // Create a hierarchy from the nodes and edges
  const hierarchy = stratify()
    .id((d) => d.id)
    .parentId((d) => {
      // for each node, find if there's an edge whose `target` is this node
      // that edge's `source` is the parent
      const parentEdge = edges.find((edge) => edge.target === d.id);
      return parentEdge?.source || null;
    });

  const root = hierarchy(nodes);

  // Configure d3 tree layout
  const treeLayout = tree().nodeSize([nodeWidth * 2, nodeHeight * 4]);
  const layout = treeLayout(root);

  // Map the d3-hierarchy positions back to React Flow positions
  const layoutedNodes = layout.descendants().map((node) => ({
    ...node.data,
    position: {
      x: node.x - nodeWidth / 2,
      y: node.y - nodeHeight / 2,
    },
  }));

  return { nodes: layoutedNodes, edges };
};

const LayoutFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // If you use a context to get businessId
  const { businessId } = useBusinessContext();

  useEffect(() => {
    const fetchFunnelData = async () => {
      try {
        console.log("Attempting to fetch with businessId:", businessId);
        const response = await fetch(
          "http://localhost:3000/generate-funnel-flow",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ businessId }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch funnel data");
        }

        const data = await response.json();
        console.log("Funnel Data:", data);

        // data.visualizationData contains { nodes: [...], edges: [...] }
        const { nodes: newNodes, edges: newEdges } = data.visualizationData;

        // OPTIONAL: if you want each edge to be animated, you can map them:
        const edgesWithAnimation = newEdges.map((edge) => ({
          ...edge,
          animated: true,
        }));

        // Apply D3 layout before setting them in state:
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(newNodes, edgesWithAnimation);

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      } catch (error) {
        console.error("Error fetching funnel data:", error);
      }
    };

    if (businessId) {
      fetchFunnelData();
    } else {
      console.log("No businessId available");
    }
  }, [businessId, setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Controls />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      <MiniMap nodeStrokeWidth={3} zoomable pannable />
    </ReactFlow>
  );
};

const Funnel = () => (
  <Box sx={{ width: "100%", height: "100vh" }}>
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  </Box>
);

export default Funnel;
