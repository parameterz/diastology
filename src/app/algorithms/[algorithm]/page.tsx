// src/app/algorithms/[algorithm]/page.tsx
import { Metadata } from 'next'
import { readFile } from 'fs/promises'
import matter from 'gray-matter'
import path from 'path'
import { AlgorithmContent } from './components/AlgorithmContent'

interface PageProps {
  params: {
    algorithm: string
  }
}

interface CitationData {
  authors: string;
  title: string;
  journal: string;
  url: string;
}

interface FrontMatter {
  title: string;
  description: string;
  keywords: string[];
  citation: CitationData;
}

// This runs on the server at build/request time
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const contentPath = path.join(process.cwd(), `src/app/algorithms/${params.algorithm}/content.md`)
  const content = await readFile(contentPath, 'utf8')
  const { data } = matter<FrontMatter>(content)
  
  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
  }
}

// This is our main Server Component
export default async function Page({ params }: PageProps) {
  const contentPath = path.join(process.cwd(), `src/app/algorithms/${params.algorithm}/content.md`)
  const content = await readFile(contentPath, 'utf8')
  const { data, content: markdownContent } = matter<FrontMatter>(content)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Pass the parsed content to our client component */}
      <AlgorithmContent 
        content={markdownContent}
        frontmatter={data}
      />
      
      <div className="sticky top-4 self-start">
        <div className="p-4 bg-white dark:bg-dark-700 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Algorithm Navigator</h2>
          <p>Interactive navigator coming soon...</p>
        </div>
      </div>
    </div>
  )
}