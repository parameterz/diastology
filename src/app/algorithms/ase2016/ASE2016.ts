// src/algorithms/ase2016.ts - Enhanced ASE 2016 Algorithm
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
  description: 'Widely used algorithm for assessing diastolic function',
  citation: {
    authors: "Nagueh, S., Smiseth, O., Appleton, C. et al.",
    title: "Recommendations for the Evaluation of Left Ventricular Diastolic Function by Echocardiography: An Update from the American Society of Echocardiography and the European Association of Cardiovascular Imaging",
    journal: "Journal of the American Society of Echocardiography, 29(4), 277–314. (2016)",
    url: "https://pubmed.ncbi.nlm.nih.gov/27037982/",
  },
  modes: [
    { 
      id: 'integrated', 
      name: 'Integrated Assessment', 
      description: 'Complete assessment starting with LVEF evaluation',
      startNodeId: 'initialAssessment' 
    },
    { 
      id: 'standard', 
      name: '"1st Algorithm" Only', 
      description: 'For normal LV function',
      startNodeId: 'standardStart' 
    },
    { 
      id: 'dysfunction', 
      name: '"2nd Algorithm" Only', 
      description: 'For reduced EF or myocardial disease with normal EF',
      startNodeId: 'dysfunctionStart' 
    }
  ],
  startNodeId: 'initialAssessment',
  nodes: {
    // Initial assessment to determine which algorithm path to take
    'initialAssessment': createDecisionNode(
      'initialAssessment',
      'What is the left ventricular ejection fraction (LVEF)?',
      [
        {value: 'normal', text: 'Normal LVEF (≥50%) without myocardial disease'},
        {value: 'normal_with_disease', text: 'Normal LVEF with myocardial disease'},
        {value: 'reduced', text: 'Reduced LVEF (<50%)'}
      ],
      {
        'normal': 'standardStart',
        'reduced': 'dysfunctionStart',
        'normal_with_disease': 'dysfunctionStart'
      }
    ),

    // Standard algorithm nodes (1st Algorithm)
    'standardStart': createDecisionNode(
      'standardStart',
      'What is the average E/e\' ratio?',
      [
        {value: 'positive', text: '> 14'},
        {value: 'positive_septal', text: 'Septal E/e\' > 15 (only septal available)'},
        {value: 'positive_lateral', text: 'Lateral E/e\' > 13 (only lateral available)'},
        {value: 'negative', text: '≤ 14 (or below septal/lateral thresholds)'},
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
        {value: 'negative', text: 'Septal ≥ 7 AND Lateral ≥ 10 cm/s'},
        {value: 'positive', text: 'Septal < 7 OR Lateral < 10 cm/s'},
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

    // For reduced LVEF patients, if one parameter is missing, check pulmonary vein S/D ratio
    'checkPulmonaryVein': createDecisionNode(
      'checkPulmonaryVein',
      'What is the pulmonary vein S/D ratio?',
      [
        {value: 'negative', text: '≥ 1'},
        {value: 'positive', text: '< 1'},
        {value: 'unavailable', text: 'Unavailable'}
      ],
      {
        '*': 'standardEvaluate' // Go back to evaluation node with this additional data
      }
    ),
    
    'standardEvaluate': {
      id: 'standardEvaluate',
      type: 'evaluator',
      evaluate: (answers: Record<string, string>) => {
        // Count standard positive/negative criteria
        let positives = 0;
        let negatives = 0;
        let unavailables = 0;
        
        // Evaluate E/e' ratio including special cases for septal/lateral only
        if (answers['standardStart'] === 'positive' || 
            answers['standardStart'] === 'positive_septal' || 
            answers['standardStart'] === 'positive_lateral') {
          positives++;
        } else if (answers['standardStart'] === 'negative') {
          negatives++;
        } else if (answers['standardStart'] === 'unavailable') {
          unavailables++;
        }
        
        // Evaluate e' velocity
        if (answers['eVelocity'] === 'positive') {
          positives++;
        } else if (answers['eVelocity'] === 'negative') {
          negatives++;
        } else if (answers['eVelocity'] === 'unavailable') {
          unavailables++;
        }
        
        // Evaluate TR velocity
        if (answers['trVelocity'] === 'positive') {
          positives++;
        } else if (answers['trVelocity'] === 'negative') {
          negatives++;
        } else if (answers['trVelocity'] === 'unavailable') {
          unavailables++;
        }
        
        // Evaluate LA volume
        if (answers['laVolume'] === 'positive') {
          positives++;
        } else if (answers['laVolume'] === 'negative') {
          negatives++;
        } else if (answers['laVolume'] === 'unavailable') {
          unavailables++;
        }

        // For reduced LVEF, check pulmonary vein data if one parameter is unavailable
        const isFromDysfunction = answers['initialAssessment'] === 'reduced' || 
                                  answers['initialAssessment'] === 'normal_with_disease';
                                  
        if (isFromDysfunction && unavailables === 1 && answers['checkPulmonaryVein'] === 'positive') {
          positives++;
        } else if (isFromDysfunction && unavailables === 1 && answers['checkPulmonaryVein'] === 'negative') {
          negatives++;
        }
        
        // Calculate available parameters
        const availableParams = 4 - unavailables;
        
        // Decision logic
        if (negatives > availableParams / 2) {
          return 'resultNormal';
        } else if (positives > availableParams / 2) {
          // This is where we bridge to the 2nd algorithm if we started with the first
          if (answers['initialAssessment'] === 'normal') {
            return 'transitionToDysfunction';
          } else {
            return 'resultImpairedElevated';
          }
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
        {value: 'mid_range', text: 'E/A between 0.8 and 1.99'},
        {value: 'lt08_high_e', text: 'E/A ≤ 0.8 AND E > 50 cm/s'},
        {value: 'lt08_low_e', text: 'E/A ≤ 0.8 AND E ≤ 50 cm/s'}
      ],
      {
        'gte2': 'resultGrade3',
        'lt08_low_e': 'resultGrade1',
        'lt08_high_e': 'checkExistingAnswers',
        'mid_range': 'checkExistingAnswers'
      }
    ),
    
    // New evaluator node to check for existing answers and route accordingly
    'checkExistingAnswers': {
      id: 'checkExistingAnswers',
      type: 'evaluator',
      evaluate: (answers: Record<string, string>) => {
        console.log("Checking existing answers:", answers);
        
        // Check if we came from the first algorithm and have measurements
        const hasEeRatio = answers['standardStart'] !== undefined && 
                          answers['standardStart'] !== 'unavailable';
        const hasTrVelocity = answers['trVelocity'] !== undefined && 
                             answers['trVelocity'] !== 'unavailable';
        const hasLaVolume = answers['laVolume'] !== undefined && 
                            answers['laVolume'] !== 'unavailable';
                            
        console.log(`Has E/e': ${hasEeRatio}, Has TR: ${hasTrVelocity}, Has LA vol: ${hasLaVolume}`);
        
        // If we have all the parameters already, skip directly to reuse
        if (hasEeRatio && hasTrVelocity && hasLaVolume) {
          return 'reuseFirstAlgoAnswers';
        } 
        
        // Start collecting missing parameters
        if (!hasEeRatio) {
          return 'dysfunctionStep2';
        } else if (!hasTrVelocity) {
          return 'dysfunctionTR';
        } else if (!hasLaVolume) {
          return 'dysfunctionLA';
        } else {
          // Fallback (shouldn't reach here)
          return 'reuseFirstAlgoAnswers';
        }
      }
    },
    
    // Node to handle reusing first algorithm answers
    'reuseFirstAlgoAnswers': {
      id: 'reuseFirstAlgoAnswers',
      type: 'evaluator',
      evaluate: (answers: Record<string, string>) => {
        console.log("Reusing first algo answers:", answers);
        
        // Copy answers from first algorithm to second algorithm's keys
        const updatedAnswers = { ...answers };
        
        // Map the standardStart answer (E/e' ratio) to dysfunctionStep2
        if (!updatedAnswers['dysfunctionStep2']) {
          if (updatedAnswers['standardStart'] === 'positive' || 
              updatedAnswers['standardStart'] === 'positive_septal' || 
              updatedAnswers['standardStart'] === 'positive_lateral') {
            updatedAnswers['dysfunctionStep2'] = 'positive';
            console.log("Mapped E/e' ratio to positive");
          } else if (updatedAnswers['standardStart'] === 'negative') {
            updatedAnswers['dysfunctionStep2'] = 'negative';
            console.log("Mapped E/e' ratio to negative");
          }
        }
        
        // Map TR velocity
        if (!updatedAnswers['dysfunctionTR'] && updatedAnswers['trVelocity']) {
          updatedAnswers['dysfunctionTR'] = updatedAnswers['trVelocity'];
          console.log("Mapped TR velocity");
        }
        
        // Map LA volume
        if (!updatedAnswers['dysfunctionLA'] && updatedAnswers['laVolume']) {
          updatedAnswers['dysfunctionLA'] = updatedAnswers['laVolume'];
          console.log("Mapped LA volume");
        }
        
        // Force save the updated answers to the global state
        Object.keys(updatedAnswers).forEach(key => {
          answers[key] = updatedAnswers[key];
        });
        
        // Proceed directly to evaluation
        return 'dysfunctionEvaluate';
      }
    },
    
    'dysfunctionStep2': createDecisionNode(
      'dysfunctionStep2',
      'What is the average E/e\' ratio?',
      [
        {value: 'positive', text: '> 14'},
        {value: 'positive_septal', text: 'Septal E/e\' > 15 (only septal available)'},
        {value: 'positive_lateral', text: 'Lateral E/e\' > 13 (only lateral available)'},
        {value: 'negative', text: '≤ 14 (or below septal/lateral thresholds)'},
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
        '*': 'checkDysfunctionPVFlow' // Check if we need PV flow data
      }
    ),
    
    // Check if we need pulmonary vein flow data for reduced LVEF patients
    'checkDysfunctionPVFlow': {
      id: 'checkDysfunctionPVFlow',
      type: 'evaluator',
      evaluate: (answers: Record<string, string>) => {
        // Check if any parameter is unavailable
        const hasUnavailable = answers['dysfunctionStep2'] === 'unavailable' || 
                              answers['dysfunctionTR'] === 'unavailable' || 
                              answers['dysfunctionLA'] === 'unavailable';
                              
        // If we're in the second algorithm directly (reduced LVEF) and one parameter is unavailable,
        // ask for PV S/D ratio
        if (hasUnavailable && 
            (answers['initialAssessment'] === 'reduced' || 
             answers['initialAssessment'] === 'normal_with_disease')) {
          return 'dysfunctionPVFlow';
        } else {
          return 'dysfunctionEvaluate';
        }
      }
    },
    
    'dysfunctionPVFlow': createDecisionNode(
      'dysfunctionPVFlow',
      'What is the pulmonary vein S/D ratio?',
      [
        {value: 'negative', text: '≥ 1'},
        {value: 'positive', text: '< 1'},
        {value: 'unavailable', text: 'Unavailable'}
      ],
      {
        '*': 'dysfunctionEvaluate' // Now go to evaluation
      }
    ),
    
    'dysfunctionEvaluate': {
      id: 'dysfunctionEvaluate',
      type: 'evaluator',
      evaluate: (answers: Record<string, string>) => {
        // Log answers to help with debugging
        console.log("All available answers for evaluation:", answers);
        
        // Get only the answers from step2 onwards (exclude the initial mitral inflow question)
        const step2Answers: Record<string, string> = { 
          'dysfunctionStep2': 'unavailable',
          'dysfunctionTR': 'unavailable',
          'dysfunctionLA': 'unavailable'
        };
        
        // Map standardStart (E/e') to dysfunctionStep2 if available
        if (answers['dysfunctionStep2'] && answers['dysfunctionStep2'] !== 'unavailable') {
          step2Answers['dysfunctionStep2'] = answers['dysfunctionStep2'];
          console.log("Using directly provided dysfunctionStep2:", answers['dysfunctionStep2']);
        } else if (answers['standardStart'] && answers['standardStart'] !== 'unavailable') {
          if (answers['standardStart'] === 'positive' || 
              answers['standardStart'] === 'positive_septal' || 
              answers['standardStart'] === 'positive_lateral') {
            step2Answers['dysfunctionStep2'] = 'positive';
            console.log("Mapped standardStart to positive");
          } else if (answers['standardStart'] === 'negative') {
            step2Answers['dysfunctionStep2'] = 'negative';
            console.log("Mapped standardStart to negative");
          }
        }
        
        // Map TR velocity
        if (answers['dysfunctionTR'] && answers['dysfunctionTR'] !== 'unavailable') {
          step2Answers['dysfunctionTR'] = answers['dysfunctionTR'];
          console.log("Using directly provided dysfunctionTR");
        } else if (answers['trVelocity'] && answers['trVelocity'] !== 'unavailable') {
          step2Answers['dysfunctionTR'] = answers['trVelocity'];
          console.log("Mapped trVelocity to dysfunctionTR");
        }
        
        // Map LA volume
        if (answers['dysfunctionLA'] && answers['dysfunctionLA'] !== 'unavailable') {
          step2Answers['dysfunctionLA'] = answers['dysfunctionLA'];
          console.log("Using directly provided dysfunctionLA");
        } else if (answers['laVolume'] && answers['laVolume'] !== 'unavailable') {
          step2Answers['dysfunctionLA'] = answers['laVolume'];
          console.log("Mapped laVolume to dysfunctionLA");
        }
        
        // Include pulmonary vein S/D ratio if one parameter is unavailable
        if ((step2Answers['dysfunctionStep2'] === 'unavailable' || 
             step2Answers['dysfunctionTR'] === 'unavailable' || 
             step2Answers['dysfunctionLA'] === 'unavailable') && 
            answers['dysfunctionPVFlow'] === 'positive') {
          // Add it as an additional positive
          step2Answers['pv_sd_ratio'] = 'positive';
          console.log("Added positive PV S/D ratio");
        }
        
        console.log("Final step 2 answers being evaluated:", step2Answers);
        
        // Count positives, negatives, and availables
        let positives = 0;
        let negatives = 0;
        let unavailables = 0;
        
        // Evaluate each parameter
        Object.entries(step2Answers).forEach(([key, answer]) => {
          console.log(`Evaluating ${key}: ${answer}`);
          if (answer === 'positive') positives++;
          else if (answer === 'negative') negatives++;
          else if (answer === 'unavailable') unavailables++;
        });
        
        const availables = Object.keys(step2Answers).length - unavailables;
        
        console.log(`Final counts: positives=${positives}, negatives=${negatives}, availables=${availables}`);
        
        // Make decision based on available data
        if (availables >= 3) {
          if (positives >= 2) {
            return 'resultGrade2';
          } else if (negatives >= 2) {
            return 'resultGrade1';
          } else {
            return 'resultIndeterminate';
          }
        } else if (availables === 2) {
          if (positives === 2) {
            return 'resultGrade2';
          } else if (negatives === 2) {
            return 'resultGrade1';
          } else {
            return 'resultIndeterminate';
          }
        } else {
          return 'resultInsufficientInfo';
        }
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