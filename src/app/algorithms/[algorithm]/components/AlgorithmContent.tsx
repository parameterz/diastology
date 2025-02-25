// src/app/algorithms/[algorithm]/components/AlgorithmContent.tsx
'use client'

import MarkdownIt from 'markdown-it'

// Citation data interface
interface CitationData {
  authors: string;
  title: string;
  journal: string;
  url: string;
}

// Full frontmatter interface
interface Frontmatter {
  title: string;
  description?: string;
  keywords?: string[];
  citation: CitationData;
  [key: string]: any; // For any additional fields that might be present
}

// Props interface for the AlgorithmContent component
interface AlgorithmContentProps {
  content: string;
  frontmatter: Frontmatter;
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

export function AlgorithmContent({ content, frontmatter }: AlgorithmContentProps) {
  const htmlContent = md.render(content)
  
  // Handle both old and new frontmatter formats
  const citation = frontmatter.citation || {
    authors: frontmatter.authors || '',
    title: frontmatter.title || '',
    journal: frontmatter.citation || '',
    url: frontmatter.url || ''
  };

  return (
    <div className="algorithm-content">
      {/* Citation information card */}
      <div className="mb-8 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
          {frontmatter.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          <strong>Authors:</strong> {citation.authors}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          <strong>Publication:</strong> {citation.title}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <a 
            href={citation.url} 
            target='_blank' 
            rel='noopener noreferrer'
            className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            {citation.journal}
          </a>
        </p>
      </div>
      
      {/* Markdown content */}
      <div 
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
    </div>
  )
}