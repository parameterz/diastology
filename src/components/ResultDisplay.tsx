import React from 'react';

export type ResultType = 'normal' | 'impaired' | 'elevated' | null;

interface ResultDisplayProps {
  result: ResultType;
  resultText: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, resultText }) => {
  if (!result) return null;

  const resultClasses = {
    normal: 'result result-normal',
    impaired: 'result result-impaired',
    elevated: 'result result-elevated'
  };

  const resultClass = result ? resultClasses[result] : '';

  return (
    <div className={resultClass}>
      {resultText}
    </div>
  );
};

export default ResultDisplay;