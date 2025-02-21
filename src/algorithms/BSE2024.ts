// src/algorithms/BSE2024.ts - BSE Algorithm
import { Algorithm, DecisionNode, ResultNode } from '../types/algorithm';

// Helper functions (same as above)
function createDecisionNode(id: string, question: string, options: any[], nextNodes: any): DecisionNode {
  return {
    id,
    type: 'decision',
    question,
    options,
    nextNodes
  };
}

function createResultNode(id: string, resultKey: string): ResultNode {
  return {
    id,
    type: 'result',
    resultKey: resultKey as any
  };
}

// Define the BSE algorithm
const bseAlgorithm: Algorithm = {
  id: 'bse',
  name: 'British Society of Echocardiography Diastolic Function (2024)',
  citation: {
    authors: "Robinson, S., Ring, L., Oxborough, D. et al.",
    title: "The assessment of left ventricular diastolic function: guidance and recommendations from the British Society of Echocardiography",
    journal: "Echo Res Pract 11, 16 (2024)",
    url: "https://pubmed.ncbi.nlm.nih.gov/38825710/",
  },
  startNodeId: 'standardStart',
  nodes: {
    // Define BSE-specific nodes here
    // ...
  }
};

export default bseAlgorithm;