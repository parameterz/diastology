// src/algorithms/Young2025.ts - Young et al. 2025 Diastolic Function Algorithm
import { Algorithm, DecisionNode, ResultNode, EvaluatorNode } from '../types/algorithm';

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

// Define the Young 2025 algorithm
const young2025Algorithm: Algorithm = {
    id: 'young2025',
    name: 'Young et al. Diastolic Function (2025)',
    description: 'From the Mayo Clinic',
    citation: {
      authors: "Young, Kathleen A. et al.",
      title: "Association of Impaired Relaxation Mitral Inflow Pattern (Grade 1 Diastolic Function) With Long-Term Noncardiovascular and Cardiovascular Mortality",
      journal: "Journal of the American Society of Echocardiography (2024)",
      url: "https://www.jasejournal.org/article/S0894-7317(24)00242-9/fulltext",
    },
    modes: [
      { 
        id: 'standard', 
        name: 'Standard Algorithm', 
        description: 'This algorithm applies to patients with an EF ≥ 50% and without heart failure or significant valve disease',
        startNodeId: 'criteriaCollection' 
      }
    ],

  startNodeId: 'heartFailureCheck',
  nodes: {
    // Initial check for heart failure or valve disease
/*     'heartFailureCheck': createDecisionNode(
      'heartFailureCheck',
      'Does the patient have known heart failure, LV EF < 50%, or ≥ moderate valve disease?',
      [
        {value: 'yes', text: 'Yes'},
        {value: 'no', text: 'No'}
      ],
      {
        'yes': 'resultExclude',
        'no': 'criteriaCollection'
      }
    ),
 */    
    // Collection of all four criteria
    'criteriaCollection': createDecisionNode(
      'criteriaCollection',
      'Septal e\' velocity',
      [
        {value: 'abnormal', text: '< 7 cm/s'},
        {value: 'normal', text: '≥ 7 cm/s'}
      ],
      {
        '*': 'eToERatio'
      }
    ),
    
    'eToERatio': createDecisionNode(
      'eToERatio',
      'E/e\' ratio (septal)',
      [
        {value: 'abnormal', text: '> 15'},
        {value: 'normal', text: '≤ 15'}
      ],
      {
        '*': 'trVelocity'
      }
    ),
    
    'trVelocity': createDecisionNode(
      'trVelocity',
      'TR velocity',
      [
        {value: 'abnormal', text: '> 2.8 m/s'},
        {value: 'normal', text: '≤ 2.8 m/s'}
      ],
      {
        '*': 'laVolume'
      }
    ),
    
    'laVolume': createDecisionNode(
      'laVolume',
      'LA volume index',
      [
        {value: 'abnormal', text: '> 34 mL/m²'},
        {value: 'normal', text: '≤ 34 mL/m²'}
      ],
      {
        '*': 'criteriaEvaluate'
      }
    ),
    
    // Evaluator for the collected criteria
    'criteriaEvaluate': {
      id: 'criteriaEvaluate',
      type: 'evaluator',
      evaluate: (answers: Record<string, string>) => {
        // Count normal and abnormal results
        const normalCount = Object.values(answers).filter(a => a === 'normal').length;
        const abnormalCount = Object.values(answers).filter(a => a === 'abnormal').length;
        
        // Skip the first question (heart failure check)
        // Count only the 4 criteria questions
        if (normalCount >= 3) {
          // ≥ 3 of 4 Normal
          return 'normalFillingPressure';
        } else if (abnormalCount >= 3) {
          // ≥ 3 of 4 Abnormal
          return 'elevatedFillingPressure';
        } else if (normalCount === 2 && abnormalCount === 2) {
          // 2 and 2
          return 'resultIndeterminate';
        } else {
          // This shouldn't happen with 4 criteria but for safety
          return 'resultIndeterminate';
        }
      }
    },
    
    // Normal filling pressure path
    'normalFillingPressure': createDecisionNode(
      'normalFillingPressure',
      'E/A ratio',
      [
        {value: 'greater', text: '> 0.8'},
        {value: 'less_equal', text: '≤ 0.8'}
      ],
      {
        'greater': 'resultNormal',
        'less_equal': 'resultGrade1'
      }
    ),
    
    // Elevated filling pressure path
    'elevatedFillingPressure': createDecisionNode(
      'elevatedFillingPressure',
      'E/A ratio',
      [
        {value: 'greater_equal', text: '≥ 2'},
        {value: 'less', text: '< 2'}
      ],
      {
        'less': 'resultGrade2',
        'greater_equal': 'resultGrade3'
      }
    ),
    
    // Result nodes
    'resultNormal': createResultNode('resultNormal', 'normal'),
    'resultGrade1': createResultNode('resultGrade1', 'grade-1'),
    'resultGrade2': createResultNode('resultGrade2', 'grade-2'),
    'resultGrade3': createResultNode('resultGrade3', 'grade-3'),
    'resultIndeterminate': createResultNode('resultIndeterminate', 'indeterminate'),
    'resultExclude': createResultNode('resultExclude', 'exclude')
  }
};

export default young2025Algorithm;