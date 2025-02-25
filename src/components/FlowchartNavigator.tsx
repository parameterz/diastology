'use client'

import React, { useState, useEffect } from 'react';
import { ChevronRight, Check, AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import algorithms from '@/algorithms';
import { AlgorithmNavigator } from '@/services/AlgorithmNavigator';
import { Node, DecisionNode, EvaluatorNode, ResultNode, OptionValue } from '@/types/algorithm';

interface FlowchartNavigatorProps {
  algorithmId: string;
  modeId?: string;
}

const FlowchartNavigator: React.FC<FlowchartNavigatorProps> = ({ algorithmId, modeId }) => {
  // Initialize navigator with all algorithms
  const [navigator] = useState(() => new AlgorithmNavigator(algorithms));
  
  // Track visible nodes and their state
  const [visibleNodes, setVisibleNodes] = useState<string[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [currentNodeId, setCurrentNodeId] = useState<string>('');
  const [selections, setSelections] = useState<Record<string, { value: OptionValue, display: string }>>({});
  
  // Result state
  const [result, setResult] = useState<any>(null);
  const [citation, setCitation] = useState<any>(null);

  // Start algorithm when component mounts
  useEffect(() => {
    try {
      navigator.startAlgorithm(algorithmId, modeId);
      const startNode = navigator.getCurrentNode();
      setCurrentNodeId(startNode.id);
      setVisibleNodes([startNode.id]);
      setExpandedNodes(new Set([startNode.id]));
      setCitation(navigator.getCitation());
    } catch (error) {
      console.error("Error starting algorithm:", error);
    }
  }, [algorithmId, modeId]);

  // Handle option selection
  const handleSelection = (nodeId: string, displayValue: string, value: OptionValue) => {
    try {
      // Store selection for display purposes
      setSelections(prev => ({
        ...prev,
        [nodeId]: { value, display: displayValue }
      }));

      // Submit answer to navigator
      navigator.submitAnswer(value);
      
      // Get next node
      const nextNode = navigator.getCurrentNode();
      
      // Check if we've reached a result
      if (nextNode.type === 'result') {
        setResult(navigator.getResult());
      } else {
        // Add next node to visible and expanded sets
        setVisibleNodes(prev => [...prev, nextNode.id]);
        setExpandedNodes(prev => new Set([...prev, nextNode.id]));
        
        // Set focus to next node
        setCurrentNodeId(nextNode.id);
      }
    } catch (error) {
      console.error("Error processing selection:", error);
    }
  };

  // Handle going back to a previous node
  const handleGoBack = () => {
    if (navigator.canGoBack()) {
      // Get current node before going back (to remove it from visible nodes)
      const currentNode = navigator.getCurrentNode();
      
      // Go back to previous node
      navigator.goBack();
      
      // Get the node we went back to
      const previousNode = navigator.getCurrentNode();
      
      // Update UI state
      setCurrentNodeId(previousNode.id);
      setVisibleNodes(prev => prev.filter(id => id !== currentNode.id));
      
      // Remove the selection for the node we're removing
      setSelections(prev => {
        const newSelections = { ...prev };
        delete newSelections[currentNode.id];
        return newSelections;
      });
      
      // Clear result if we had one
      setResult(null);
    }
  };

  // Handle restart
  const handleRestart = () => {
    navigator.restart();
    const startNode = navigator.getCurrentNode();
    setCurrentNodeId(startNode.id);
    setVisibleNodes([startNode.id]);
    setExpandedNodes(new Set([startNode.id]));
    setSelections({});
    setResult(null);
  };

  // Render a single node in the flowchart
  const NodeComponent = ({ id }: { id: string }) => {
    try {
      if (!visibleNodes.includes(id)) return null;
      
      const node = algorithms[algorithmId].nodes[id];
      if (!node) return null;

      const isExpanded = expandedNodes.has(id);
      const isActive = currentNodeId === id;
      const selectedOption = selections[id];
      const isCompleted = !!selectedOption;
      
      // Only decision nodes have options
      const options = node.type === 'decision' ? node.options : [];

      return (
        <div className="mb-2">
          <div 
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors
              ${isActive ? 'bg-blue-100 border-2 border-blue-500' : 
                isCompleted ? 'bg-green-50 hover:bg-green-100' : 
                'bg-gray-50 hover:bg-gray-100 dark:bg-dark-700 dark:hover:bg-dark-600'}`}
            onClick={() => {
              if (!result) { // Only allow changing focus if not at result
                setCurrentNodeId(id);
                setExpandedNodes(prev => {
                  const newSet = new Set(prev);
                  if (newSet.has(id)) {
                    if (!isActive) {
                      // Don't collapse if just activating
                    } else {
                      newSet.delete(id);
                    }
                  } else {
                    newSet.add(id);
                  }
                  return newSet;
                });
              }
            }}
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm dark:text-white">
                  {node.type === 'decision' ? node.question : (node.type === 'result' ? 'Result' : 'Evaluation')}
                </h3>
                {isCompleted && (
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <Check className="w-4 h-4 mr-1" />
                    <span className="truncate max-w-xs">{selectedOption.display}</span>
                  </div>
                )}
              </div>
              {node.type === 'decision' && isActive && !result && (
                <div className="mt-2 space-y-1">
                  {options.map((option, index) => (
                    <button
                      key={index}
                      className={`block w-full text-left px-3 py-1 text-sm rounded 
                        ${selectedOption && selectedOption.value === option.value
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white hover:bg-blue-50 border border-gray-200 dark:bg-dark-600 dark:border-dark-500 dark:hover:bg-dark-500 dark:text-white'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelection(id, option.text, option.value);
                      }}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error(`Error rendering node ${id}:`, error);
      return <div>Error rendering node</div>;
    }
  };

  return (
    <div className="space-y-4 bg-white dark:bg-dark-700 p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold dark:text-white">Algorithm Navigator</h2>
        <div className="flex space-x-2">
          {navigator.canGoBack() && !result && (
            <button 
              onClick={handleGoBack}
              className="flex items-center text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-dark-600 dark:hover:bg-dark-500"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
          )}
          {(result || visibleNodes.length > 1) && (
            <button 
              onClick={handleRestart}
              className="flex items-center text-sm px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-dark-600 dark:hover:bg-dark-500"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Restart
            </button>
          )}
        </div>
      </div>

      {/* Flowchart nodes */}
      <div className="space-y-1">
        {visibleNodes.map(nodeId => (
          <NodeComponent key={nodeId} id={nodeId} />
        ))}
      </div>

      {/* Results Panel */}
      {result && (
        <div className={`p-4 rounded-lg ${
          result.class === 'result-normal' ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500' : 
          result.class === 'result-impaired' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500' : 
          'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
        }`}>
          <div className="flex items-start">
            <AlertCircle className={`w-5 h-5 mr-2 mt-0.5 ${
              result.class === 'result-normal' ? 'text-green-600 dark:text-green-400' : 
              result.class === 'result-impaired' ? 'text-yellow-600 dark:text-yellow-400' : 
              'text-red-600 dark:text-red-400'
            }`} />
            <div>
              <h3 className="font-bold text-lg dark:text-white">{result.message}</h3>
              <p className="text-sm mt-1 dark:text-gray-300">{result.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Citation */}
      {citation && (
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 border-t pt-3">
          <p className="font-semibold">Reference:</p>
          <p className="mt-1">{citation.authors}</p>
          <p className="mt-1 italic">{citation.title}</p>
          <p className="mt-1">
            <a href={citation.url} 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-blue-600 dark:text-blue-400 hover:underline">
              {citation.journal}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default FlowchartNavigator;