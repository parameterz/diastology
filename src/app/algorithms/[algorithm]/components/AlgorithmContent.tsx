// src/app/algorithms/[algorithm]/components/AlgorithmContent.tsx
'use client'

import MarkdownIt from 'markdown-it'

interface AlgorithmContentProps {
  content: string
  frontmatter: {
    authors: string
    citation: string
    [key: string]: any
  }
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

export function AlgorithmContent({ content, frontmatter }: AlgorithmContentProps) {
  const htmlContent = md.render(content)

  return (
    <div>
      <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <p className="text-sm text-gray-600 dark:text-gray-300">
          <strong>Authors:</strong> {frontmatter.authors}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <strong>Title:</strong> {frontmatter.title}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            <a href={frontmatter.url} target='_blank' rel='noopener noreferrer'>
          <strong>Citation:</strong> {frontmatter.citation}</a>
        </p>
      </div>
      
      <div 
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
    </div>
  )
}