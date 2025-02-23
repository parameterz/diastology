'use client';

import algorithms from '@/algorithms';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Select an algorithm to evaluate diastolic function
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {Object.values(algorithms).map((algo) => (
          <div key={algo.id} className="rounded-lg bg-white p-6 shadow-md dark:bg-dark-700">
            <h2 className="mb-3 text-xl font-semibold">{algo.name}</h2>
            {algo.description && (
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                {algo.description}
              </p>
            )}
            
            {algo.modes ? (
              <div className="space-y-3">
                {algo.modes.map((mode) => (
                  <Link
                    key={mode.id}
                    href={`/algorithms/${algo.id}?mode=${mode.id}`}
                    className="btn-primary block w-full px-4 py-2 text-center text-sm"
                  >
                    {mode.name}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                href={`/algorithms/${algo.id}`}
                className="btn-primary block w-full px-4 py-2 text-center"
              >
                Start Assessment
              </Link>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}