import React from 'react';

interface CitationProps {
  algorithmId: string;
}

const Citation: React.FC<CitationProps> = ({ algorithmId }) => {
  // Map algorithm IDs to citation information
  const citations: Record<string, { title: string; authors: string; journal: string; year: string; url?: string }> = {
    'ase2016-standard': {
      title: 'Recommendations for the Evaluation of Left Ventricular Diastolic Function by Echocardiography: An Update from the American Society of Echocardiography and the European Association of Cardiovascular Imaging',
      authors: 'Nagueh SF, Smiseth OA, Appleton CP, et al.',
      journal: 'Journal of the American Society of Echocardiography',
      year: '2016',
      url: 'https://doi.org/10.1016/j.echo.2016.01.011'
    },
    'ase2016-dysfunction': {
      title: 'Recommendations for the Evaluation of Left Ventricular Diastolic Function by Echocardiography: An Update from the American Society of Echocardiography and the European Association of Cardiovascular Imaging',
      authors: 'Nagueh SF, Smiseth OA, Appleton CP, et al.',
      journal: 'Journal of the American Society of Echocardiography',
      year: '2016',
      url: 'https://doi.org/10.1016/j.echo.2016.01.011'
    },
    'bse-standard': {
      title: 'A Practical Guideline for Performing a Comprehensive Transthoracic Echocardiogram in Adults',
      authors: 'Robinson S, Rana B, Oxborough D, et al.',
      journal: 'British Society of Echocardiography',
      year: '2020',
      url: 'https://doi.org/10.1530/ERP-20-0026'
    },
    'bse-dysfunction': {
      title: 'A Practical Guideline for Performing a Comprehensive Transthoracic Echocardiogram in Adults',
      authors: 'Robinson S, Rana B, Oxborough D, et al.',
      journal: 'British Society of Echocardiography',
      year: '2020',
      url: 'https://doi.org/10.1530/ERP-20-0026'
    },
    'bse-afib': {
      title: 'A Practical Guideline for Performing a Comprehensive Transthoracic Echocardiogram in Adults',
      authors: 'Robinson S, Rana B, Oxborough D, et al.',
      journal: 'British Society of Echocardiography',
      year: '2020',
      url: 'https://doi.org/10.1530/ERP-20-0026'
    }
  };

  if (!algorithmId || !citations[algorithmId]) return null;

  const citation = citations[algorithmId];

  return (
    <div className="text-sm text-gray-600 mt-6 pt-4 border-t border-gray-200">
      <h3 className="font-bold mb-2">Citation:</h3>
      <p className="mb-1">{citation.authors} ({citation.year})</p>
      <p className="mb-1 italic">{citation.title}</p>
      <p className="mb-1">{citation.journal}</p>
      {citation.url && (
        <a 
          href={citation.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline"
        >
          {citation.url}
        </a>
      )}
    </div>
  );
};

export default Citation;