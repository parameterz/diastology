// src/algorithms/ase2016.ts - Updated ASE 2016 Algorithm
import { Algorithm, DecisionNode, ResultNode, EvaluatorNode } from '../../../types/algorithm';

// Helper function for creating standard decision nodes
function createDecisionNode(id: string, question: string, options: any[], nextNodes: any): DecisionNode {
  return {
    id,
    type: 'decision',
    question,
    options,
    nextNodes
  };
}

// Helper function for creating result nodes
function createResultNode(id: string, resultKey: string): ResultNode {
  return {
    id,
    type: 'result',
    resultKey: resultKey as any
  };
}

// Define the ASE 2016 algorithm
const ase2016Algorithm: Algorithm = {
  id: 'ase2016',
  name: 'ASE/EACVI Diastolic Function (2016)',
  description: 'Widely used; loved and hated by many',
  citation: {
    authors: "Nagueh, S., Smiseth, O., Appleton, C. et al.",
    title: "Recommendations for the Evaluation of Left Ventricular Diastolic Function by Echocardiography: An Update from the American Society of Echocardiography and the European Association of Cardiovascular Imaging",
    journal: "Journal of the American Society of Echocardiography, 29(4), 277–314. (2016)",
    url: "https://pubmed.ncbi.nlm.nih.gov/27037982/",
  },
  modes: [
    { 
      id: 'integrated', 
      name: 'Integrated Approach', 
      description: 'Start with the 1st algorithm which may progress to the 2nd algorithm',
      startNodeId: 'standardStart' 
    },
    { 
      id: 'standard', 
      name: '"1st Algorithm" Only', 
      description: 'Only use the 1st algorithm for normal LV function',
      startNodeId: 'standardStart' 
    },
    { 
      id: 'dysfunction', 
      name: '"2nd Algorithm" Only', 
      description: 'Skip to the 2nd algorithm for abnormal function or myocardial disease',
      startNodeId: 'dysfunctionStart' 
    }
  ],
  startNodeId: 'standardStart',
  nodes: {
    // Standard algorithm nodes (1st Algorithm)
    'standardStart': createDecisionNode(
      'standardStart',
      'What is the average E/e\' ratio?',
      [
        {value: 'positive', text: '> 14'},
        {value: 'negative', text: '≤ 14'},
        {value: 'unavailable', text: 'Unavailable'}
      ],
      {
        '*': 'eVelocity' // Go to next question regardless of answer
      }
    ),
    
    'eVelocity': createDecisionNode(
      'eVelocity',
      'What are the e\' velocities?',
      [
        {value: 'positive', text: 'Septal < 7 OR Lateral < 10 cm/s'},
        {value: 'negative', text: 'Septal ≥ 7 AND Lateral ≥ 10 cm/s'},
        {value: 'unavailable', text: 'Unavailable'}
      ],
      {
        '*': 'trVelocity' // Go to next question regardless of answer
      }
    ),
    
    'trVelocity': createDecisionNode(
      'trVelocity',
      'What is the TR Velocity?',
      [
        {value: 'positive', text: '>2.8 m/s'},
        {value: 'negative', text: '≤ 2.8 m/s'},
        {value: 'unavailable', text: 'Unavailable'}
      ],
      {
        '*': 'laVolume' // Go to next question regardless of answer
      }
    ),
    
    'laVolume': createDecisionNode(
      'laVolume',
      'What is the indexed LA Volume?',
      [
        {value: 'positive', text: '>34 ml/m²'},
        {value: 'negative', text: '≤ 34 ml/m²'},
        {value: 'unavailable', text: 'Unavailable'}
      ],
      {
        '*': 'standardEvaluate' // Go to evaluation node
      }
    ),
    
    'standardEvaluate': {
      id: 'standardEvaluate',
      type: 'evaluator',
      evaluate: (answers: Record<string, string>) => {
        const positives = Object.values(answers).filter(a => a === 'positive').length;
        const negatives = Object.values(answers).filter(a => a === 'negative').length;
        
        if (negatives > 2) {
          return 'resultNormal';
        } else if (positives > 2) {
          // This is where we bridge to the 2nd algorithm
          // Instead of going directly to a result, we transition to the 2nd algorithm
          return 'transitionToDysfunction';
        } else {
          return 'resultIndeterminate';
        }
      }
    },
    
    // Transition node to 2nd algorithm
    'transitionToDysfunction': createDecisionNode(
      'transitionToDysfunction',
      'The 1st algorithm indicates diastolic dysfunction with elevated filling pressures. Let\'s further categorize with the 2nd algorithm.',
      [
        {value: 'continue', text: 'Continue to 2nd Algorithm'}
      ],
      {
        'continue': 'dysfunctionStart'
      }
    ),
    
    // Dysfunction algorithm nodes (2nd Algorithm)
    'dysfunctionStart': createDecisionNode(
      'dysfunctionStart',
      'What is the Mitral Inflow Pattern (E/A ratio)?',
      [
        {value: 'gte2', text: 'E/A ≥ 2'},
        {value: 'lt08_high_e', text: 'E/A ≤ 0.8 AND E > 50 cm/s'},
        {value: 'mid_range', text: 'E/A between 0.8 and 1.99'},
        {value: 'lt08_low_e', text: 'E/A ≤ 0.8 AND E ≤ 50 cm/s'}
      ],
      {
        'gte2': 'resultGrade3',
        'lt08_low_e': 'resultGrade1',
        'lt08_high_e': 'dysfunctionStep2',
        'mid_range': 'dysfunctionStep2'
      }
    ),
    
    'dysfunctionStep2': createDecisionNode(
      'dysfunctionStep2',
      'What is the average E/e\' ratio?',
      [
        {value: 'positive', text: '> 14'},
        {value: 'negative', text: '≤ 14'},
        {value: 'unavailable', text: 'Unavailable'}
      ],
      {
        '*': 'dysfunctionTR' // Go to next question regardless of answer
      }
    ),
    
    'dysfunctionTR': createDecisionNode(
      'dysfunctionTR',
      'What is the TR Velocity?',
      [
        {value: 'positive', text: '> 2.8 m/s'},
        {value: 'negative', text: '≤ 2.8 m/s'},
        {value: 'unavailable', text: 'Unavailable'}
      ],
      {
        '*': 'dysfunctionLA' // Go to next question regardless of answer
      }
    ),
    
    'dysfunctionLA': createDecisionNode(
      'dysfunctionLA',
      'What is the indexed LA Volume?',
      [
        {value: 'positive', text: '> 34 ml/m²'},
        {value: 'negative', text: '≤ 34 ml/m²'},
        {value: 'unavailable', text: 'Unavailable'}
      ],
      {
        '*': 'dysfunctionEvaluate' // Go to evaluation node
      }
    ),
    
    'dysfunctionEvaluate': {
      id: 'dysfunctionEvaluate',
      type: 'evaluator',
      evaluate: (answers: Record<string, string>) => {
        // Get only the answers from step2 onwards (exclude the initial mitral inflow question)
        const step2Answers = { 
          'dysfunctionStep2': answers['dysfunctionStep2'] || answers['standardStart'], // Reuse E/e' from 1st algorithm if available
          'dysfunctionTR': answers['dysfunctionTR'] || answers['trVelocity'], // Reuse TR from 1st algorithm if available
          'dysfunctionLA': answers['dysfunctionLA'] || answers['laVolume'] // Reuse LA volume from 1st algorithm if available
        };
        
        const positives = Object.values(step2Answers).filter(a => a === 'positive').length;
        const negatives = Object.values(step2Answers).filter(a => a === 'negative').length;
        const availables = Object.values(step2Answers).filter(a => a !== 'unavailable').length;
        
        if (availables > 2) {
          if (positives >= 2) {
            return 'resultGrade2';
          } else if (negatives >= 2) {
            return 'resultGrade1';
          }
        } else if (availables === 2) {
          if (positives === 2) {
            return 'resultGrade2';
          } else if (negatives === 2) {
            return 'resultGrade1';
          } else {
            return 'resultIndeterminate';
          }
        }
        
        return 'resultInsufficientInfo';
      }
    },
    
    // Result nodes
    'resultNormal': createResultNode('resultNormal', 'normal'),
    'resultGrade1': createResultNode('resultGrade1', 'grade-1'),
    'resultGrade2': createResultNode('resultGrade2', 'grade-2'),
    'resultGrade3': createResultNode('resultGrade3', 'grade-3'),
    'resultImpairedElevated': createResultNode('resultImpairedElevated', 'impaired-elevated'),
    'resultIndeterminate': createResultNode('resultIndeterminate', 'indeterminate'),
    'resultInsufficientInfo': createResultNode('resultInsufficientInfo', 'insufficient_info')
  }
};

export default ase2016Algorithm;