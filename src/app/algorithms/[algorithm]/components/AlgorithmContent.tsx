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
    <div>
      <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <strong>Authors:</strong> {citation.authors}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <strong>Title:</strong> {citation.title}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          <a href={citation.url} target='_blank' rel='noopener noreferrer'>
            <strong>Citation:</strong> {citation.journal}
          </a>
        </p>
      </div>
      
      <div 
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
    </div>
  )
}