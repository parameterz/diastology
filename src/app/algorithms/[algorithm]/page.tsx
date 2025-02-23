'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlgorithmNavigator } from '@/services/AlgorithmNavigator';
import { algorithms } from '@/algorithms';
import { results } from '@/data/results';

export default function AlgorithmPage({ params }: { params: { algorithm: string } }) {
  const searchParams = useSearchParams();
  const modeId = searchParams.get('mode');
  const algorithmId = params.algorithm;

  const [navigator] = useState<AlgorithmNavigator>(
    () => new AlgorithmNavigator(algorithms)
  );
  const [currentNode, setCurrentNode] = useState<any>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [currentResult, setCurrentResult] = useState<any>(null);

  useEffect(() => {
    // Start the algorithm when the component mounts
    if (algorithmId) {
      navigator.startAlgorithm(algorithmId, modeId || undefined);
      updateCurrentNodeAndResult();
    }
  }, [algorithmId, modeId]);

  // The rest of your existing logic from index.tsx...
  const updateCurrentNodeAndResult = () => {
    if (!algorithmId) {
      setCurrentNode(null);
      setCurrentResult(null);
      return;
    }

    try {
      const node = navigator.getCurrentNode();
      setCurrentNode(node);

      if (node.type === 'evaluator') {
        navigator.submitAnswer('');
        const nextNode = navigator.getCurrentNode();
        setCurrentNode(nextNode);

        if (nextNode.type === 'result') {
          setCurrentResult(results[nextNode.resultKey]);
        } else {
          setCurrentResult(null);
        }
      } else if (node.type === 'result') {
        setCurrentResult(results[node.resultKey]);
      } else {
        setCurrentResult(null);
      }
    } catch (error) {
      console.error('Error updating node and result:', error);
      setCurrentNode(null);
      setCurrentResult(null);
    }
  };

  // Rest of your component logic...
  // Include handleSubmitAnswer, handleGoBack, handleRestart functions

  return (
    <div className="mx-auto max-w-4xl">
      {/* Question Panel */}
      {currentNode && currentNode.type === 'decision' && (
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-dark-700">
          {/* Your existing question panel JSX */}
        </div>
      )}

      {/* Result Panel */}
      {currentNode && currentNode.type === 'result' && currentResult && (
        <div className={`mb-8 rounded-lg p-6 shadow-md ${currentResult.class}`}>
          {/* Your existing result panel JSX */}
        </div>
      )}

      {/* Debug Panel */}
      <div className="mt-12 rounded-lg border border-gray-200 dark:border-dark-600">
        {/* Your existing debug panel JSX */}
      </div>
    </div>
  );
}