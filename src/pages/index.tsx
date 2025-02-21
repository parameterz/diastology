import React, { useState, useEffect } from 'react';
import { AlgorithmNavigator } from '../services/AlgorithmNavigator';
import algorithms from '../algorithms';
import { DecisionNode, ResultNode, EvaluatorNode } from '../types/algorithm';
import Head from 'next/head';
import { results } from '../data/results';


export default function Home() {
  // Create a navigator instance
  const [navigator] = useState<AlgorithmNavigator>(() => new AlgorithmNavigator(algorithms));
  const [initialized, setInitialized] = useState<boolean>(false);
  
  // State for the component
  const [algorithmId, setAlgorithmId] = useState<string>('');
  const [modeId, setModeId] = useState<string>('');
  const [currentNode, setCurrentNode] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [currentResult, setCurrentResult] = useState<any>(null);
  
  // One-time initialization to prevent unnecessary effect triggers
  useEffect(() => {
    setInitialized(true);
  }, []);
  
  // Safe function to update current node and result
  const updateCurrentNodeAndResult = () => {
    // Safety check - only try to get current node if the algorithm has been started
    if (!algorithmId) {
      setCurrentNode(null);
      setCurrentResult(null);
      return;
    }
    
    try {
      const node = navigator.getCurrentNode();
      console.log('Current node:', node);
      setCurrentNode(node);
      
      if (node.type === 'result') {
        const resultKey = node.resultKey;
        console.log('Result node found:', resultKey);
        setCurrentResult(results[resultKey]);
      } else {
        setCurrentResult(null);
      }
    } catch (error) {
      console.error('Error updating node and result:', error);
      setCurrentNode(null);
      setCurrentResult(null);
    }
  };
  
  // Function to start an algorithm
  const handleAlgorithmStart = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (algorithmId) {
      try {
        navigator.startAlgorithm(algorithmId, modeId || undefined);
        updateCurrentNodeAndResult();
        setSelectedAnswer('');
      } catch (error) {
        console.error('Error starting algorithm:', error);
      }
    }
  };
  
  // Function to submit an answer
  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    console.log('Submitting answer:', selectedAnswer);
    
    try {
      navigator.submitAnswer(selectedAnswer);
      updateCurrentNodeAndResult();
      setSelectedAnswer('');
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };
  
  // Function to go back
  const handleGoBack = () => {
    try {
      if (navigator.canGoBack()) {
        navigator.goBack();
        updateCurrentNodeAndResult();
        setSelectedAnswer('');
      }
    } catch (error) {
      console.error('Error going back:', error);
    }
  };
  
  // Function to restart
  const handleRestart = () => {
    try {
      navigator.restart();
      updateCurrentNodeAndResult();
      setSelectedAnswer('');
    } catch (error) {
      console.error('Error restarting:', error);
    }
  };
  
  // Get available algorithms for selection
  const algorithmOptions = Object.values(algorithms).map(algo => (
    <option key={algo.id} value={algo.id}>{algo.name}</option>
  ));
  
  // Get available modes for the selected algorithm
  const modeOptions = algorithmId && algorithms[algorithmId].modes ? 
    algorithms[algorithmId].modes.map(mode => (
      <option key={mode.id} value={mode.id}>{mode.name}</option>
    )) :
    [];
  
  // Safely get answers display
  const getAnswersDisplay = () => {
    try {
      return JSON.stringify(navigator.getAnswers() || {}, null, 2);
    } catch (error) {
      return '{}';
    }
  };
  
  // Safely check if we can go back
  const canGoBack = () => {
    try {
      return navigator.canGoBack();
    } catch (error) {
      return false;
    }
  };
  
  return (
    <>
      <Head>
        <title>Diastolic Function Calculator</title>
        <meta name="description" content="Calculate diastolic function using various medical algorithms" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="container">
        <article>
          <header>
            <h1>Diastolic Function Algorithm Solver</h1>
            <p>Select an algorithm and follow prompts to evaluate diastolic function</p>
          </header>
          
          {/* Algorithm Selection Form */}
          <section>
            <form onSubmit={handleAlgorithmStart}>
              <div className="grid">
                <label htmlFor="algorithm-select">
                  Select Algorithm
                  <select 
                    id="algorithm-select"
                    value={algorithmId}
                    onChange={(e) => setAlgorithmId(e.target.value)}
                    required
                  >
                    <option value="">--Select an Algorithm--</option>
                    {algorithmOptions}
                  </select>
                </label>
                
                {modeOptions.length > 0 && (
                  <label htmlFor="mode-select">
                    Select Mode
                    <select 
                      id="mode-select"
                      value={modeId}
                      onChange={(e) => setModeId(e.target.value)}
                    >
                      <option value="">--Select a Mode--</option>
                      {modeOptions}
                    </select>
                  </label>
                )}
              </div>
              
              <button type="submit">Start Assessment</button>
            </form>
          </section>
          
          
          {/* Question Panel */}
          {currentNode && currentNode.type === 'decision' && (
            <section>
              <h2>{currentNode.question}</h2>
              <select
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                required
              >
                <option value="">--Select an Option--</option>
                {currentNode.options.map((option: { value: string; text: string }) => (
                  <option key={option.value} value={option.value}>
                  {option.text}
                  </option>
                ))}
              </select>
              
              <div className="grid">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  aria-busy={!selectedAnswer}
                >
                  Next
                </button>
                
                {canGoBack() && (
                  <button
                    onClick={handleGoBack}
                    className="secondary"
                  >
                    Back
                  </button>
                )}
              </div>
            </section>
          )}
                    {/* Citation Panel */}
                    {algorithmId && (
            <details className="mb-4">
              <summary>Citation Information</summary>
              <div>
                <p><strong>{algorithms[algorithmId].citation.title}</strong></p>
                <p>{algorithms[algorithmId].citation.authors}</p>
                <p>{algorithms[algorithmId].citation.journal}</p>
                <p>
                  <a 
                    href={algorithms[algorithmId].citation.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View Publication
                  </a>
                </p>
              </div>
            </details>
          )}
          
          {/* Evaluator Node (just for debugging) */}
          {currentNode && currentNode.type === 'evaluator' && (
            <section>
              <h2>Processing Your Results</h2>
              <p>The system is analyzing your responses to determine the result.</p>
              <div className="grid">
                <button
                  onClick={() => {
                    // Force move to next node when on evaluator
                    try {
                      navigator.submitAnswer('');
                      updateCurrentNodeAndResult();
                    } catch (error) {
                      console.error('Error processing evaluator:', error);
                    }
                  }}
                >
                  Continue
                </button>
              </div>
            </section>
          )}
          
          {/* Result Panel */}
          {currentNode && currentNode.type === 'result' && currentResult && (
            <section>
              <article className={currentResult.class}>
                <header>
                  <h2>Assessment Result</h2>
                </header>
                <h3>{currentResult.message}</h3>
                <p>{currentResult.description}</p>
                <footer>
                  <button onClick={handleRestart} className="secondary">Start Over</button>
                </footer>
              </article>
            </section>
          )}
          
          {/* Debug Panel */}
          <details className="mt-8">
            <summary>Debug Information</summary>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
              {`Current Algorithm: ${algorithmId || 'None'}
Current Mode: ${modeId || 'None'}
Current Node ID: ${currentNode?.id || 'None'}
Node Type: ${currentNode?.type || 'None'}
Result: ${currentResult ? currentResult.message : 'None'}
Answers: ${getAnswersDisplay()}`}
            </pre>
          </details>
        </article>
      </main>
      
      <style jsx global>{`
        /* Additional custom styles */
        .result-normal {
          --background-color: var(--card-background-color);
          border-left: 5px solid #4caf50;
        }
        
        .result-impaired {
          --background-color: var(--card-background-color);
          border-left: 5px solid #ff9800;
        }
        
        .result-elevated {
          --background-color: var(--card-background-color);
          border-left: 5px solid #f44336;
        }
        
        article {
          margin-bottom: 2rem;
        }
        
        section {
          margin-bottom: 1.5rem;
        }
      `}</style>
    </>
  );
}