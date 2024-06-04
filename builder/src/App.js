import React, { useState, useEffect, memo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useReactFlow,
  Handle,
  Position,
  useStore,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Selector for zoom level
const zoomSelector = (s) => s.transform[2];

const Placeholder = () => <div style={{ padding: '10px', color: '#888' }}>Zoom in to see content</div>;

const CustomNodeComponent = memo(({ data, selectedNodeId, id, currentZoom }) => {
  const zoomLevel = useStore(zoomSelector);

  const showContent = selectedNodeId === null || selectedNodeId === id || zoomLevel < 1.5;

  return (
    <div style={{ padding: '20px', borderRadius: '5px', background: '#fff', boxShadow: '0px 3px 6px rgba(0,0,0,0.1)' }}>
      <Handle type="target" position={Position.Left} />
      {showContent ? data.content : <Placeholder />}
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    data: { content: 'Unveiling the Mysteries of Interaction Design' },
    position: { x: 300, y: 100 },
  },
  {
    id: '2',
    type: 'custom',
    data: { content: 'Interaction Metaphors' },
    position: { x: 50, y: 50 },
  },
  {
    id: '3',
    type: 'custom',
    data: { content: 'Frequency & Novelty' },
    position: { x: 600, y: 50 },
  },
  {
    id: '4',
    type: 'custom',
    data: { content: 'Kinetic Physics' },
    position: { x: 50, y: 300 },
  },
  {
    id: '5',
    type: 'custom',
    data: { content: 'Fitts\'s Law' },
    position: { x: 600, y: 300 },
  },
  {
    id: '6',
    type: 'custom',
    data: { content: 'Swipe Gestures' },
    position: { x: 300, y: 500 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e1-4', source: '1', target: '4', animated: true },
  { id: 'e1-5', source: '1', target: '5', animated: true },
  { id: 'e1-6', source: '1', target: '6', animated: true },
];

const App = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const reactFlowInstance = useReactFlow();

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const zoomToNode = (nodeId) => {
    setSelectedNodeId(nodeId);
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      reactFlowInstance.setCenter(node.position.x + 100, node.position.y + 75, {
        zoom: 2,
        duration: 800,
      });
    }
  };

  useEffect(() => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomTo(zoomLevel);
    }
  }, [zoomLevel, reactFlowInstance]);

  return (
    <ReactFlowProvider>
      <div style={{ height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          nodeTypes={{ custom: (props) => <CustomNodeComponent {...props} selectedNodeId={selectedNodeId} currentZoom={zoomLevel} /> }}
          fitView
          onNodeClick={(event, node) => zoomToNode(node.id)}
        >
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
        <div style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 4 }}>
          <button onClick={() => zoomToNode('1')}>Zoom to Main Topic</button>
          <button onClick={() => zoomToNode('2')}>Zoom to Interaction Metaphors</button>
          <button onClick={() => zoomToNode('3')}>Zoom to Frequency & Novelty</button>
          <button onClick={() => zoomToNode('4')}>Zoom to Kinetic Physics</button>
          <button onClick={() => zoomToNode('5')}>Zoom to Fitts's Law</button>
          <button onClick={() => zoomToNode('6')}>Zoom to Swipe Gestures</button>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(Number(e.target.value))}
            style={{ width: '100%', marginTop: '10px' }}
          />
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default App;
