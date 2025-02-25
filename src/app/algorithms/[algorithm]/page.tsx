// src/app/algorithms/[algorithm]/page.tsx
import { Metadata } from 'next'
import { readFile } from 'fs/promises'
import matter from 'gray-matter'
import path from 'path'
import { AlgorithmContent } from './components/AlgorithmContent'
import { AlgorithmNavigator } from './components/AlgorithmNavigator'

interface PageProps {
  params: {
    algorithm: string
  },
  searchParams: {
    mode?: string
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
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  // Await the params object before accessing its properties
  const params = await props.params;
  const algorithm = params.algorithm;
  
  const contentPath = path.join(process.cwd(), `src/app/algorithms/${algorithm}/content.md`)
  try {
    const content = await readFile(contentPath, 'utf8')
    const { data } = matter<FrontMatter>(content)
    
    return {
      title: data.title,
      description: data.description,
      keywords: data.keywords,
    }
  } catch (error) {
    console.error(`Error loading metadata for algorithm ${algorithm}:`, error)
    return {
      title: 'Algorithm Details',
      description: 'Diastolic function assessment algorithm',
    }
  }
}

// This is our main Server Component
export default async function Page(props: PageProps) {
  // Await both params and searchParams before accessing properties
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const algorithm = params.algorithm;
  const mode = searchParams?.mode;
  
  try {
    const contentPath = path.join(process.cwd(), `src/app/algorithms/${algorithm}/content.md`)
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
          <AlgorithmNavigator 
            algorithmId={algorithm} 
            modeId={mode}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error(`Error loading algorithm ${algorithm}:`, error)
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-lg">
        <h2 className="text-xl font-bold">Error Loading Algorithm</h2>
        <p>There was a problem loading this algorithm. Please try again or select a different algorithm.</p>
      </div>
    )
  }
}