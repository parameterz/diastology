// src/app/algorithms/layout.tsx

export default function AlgorithmLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <nav className="sticky top-4">
              <h2 className="mb-4 text-lg font-semibold">Algorithms</h2>
              {/* We can add algorithm navigation here later */}
            </nav>
          </aside>
  
          <div className="lg:col-span-9">
            {children}
          </div>
        </div>
      </div>
    )
  }