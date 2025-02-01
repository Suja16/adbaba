import React, { useEffect, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  MiniMap,
  Controls,
} from "reactflow";
import { stratify, tree } from "d3-hierarchy";
import { Box } from "@mui/material";
import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "input" },
    position: { x: 0, y: 0 },
  },
  {
    id: "2",
    data: { label: "node 2" },
    position: { x: 0, y: 100 },
  },
  {
    id: "2a",
    data: { label: "node 2a" },
    position: { x: 0, y: 200 },
  },
  {
    id: "2b",
    data: { label: "node 2b" },
    position: { x: 0, y: 300 },
  },
  {
    id: "2c",
    data: { label: "node 2c" },
    position: { x: 0, y: 400 },
  },
  {
    id: "2d",
    data: { label: "node 2d" },
    position: { x: 0, y: 500 },
  },
  {
    id: "3",
    data: { label: "node 3" },
    position: { x: 200, y: 100 },
  },
];

const initialEdges = [
  { id: "e12", source: "1", target: "2", animated: true },
  { id: "e13", source: "1", target: "3", animated: true },
  { id: "e22a", source: "2", target: "2a", animated: true },
  { id: "e22b", source: "2", target: "2b", animated: true },
  { id: "e22c", source: "2", target: "2c", animated: true },
  { id: "e2c2d", source: "2c", target: "2d", animated: true },
];

// Define node dimensions
const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  if (nodes.length === 0) return { nodes, edges };

  // Create a hierarchy from the nodes and edges
  const hierarchy = stratify<Node>()
    .id((d) => d.id)
    .parentId((d) => edges.find((edge) => edge.target === d.id)?.source);

  const root = hierarchy(nodes);

  const treeLayout = tree<Node>().nodeSize([nodeWidth * 2, nodeHeight * 2]);
  const layout = treeLayout(root);

  const layoutedNodes = layout.descendants().map((node) => ({
    ...node.data,
    position: { x: node.x - nodeWidth / 2, y: node.y - nodeHeight / 2 },
  }));

  return { nodes: layoutedNodes, edges };
};

const LayoutFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [layouted, setLayouted] = useState(false);

  useEffect(() => {
    if (!layouted) {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setLayouted(true);
    }
  }, [layouted, nodes, edges, setNodes, setEdges]);

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
