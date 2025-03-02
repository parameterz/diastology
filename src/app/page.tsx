'use client';

import algorithms from '@/algorithms';
import Link from 'next/link';

// Define the display order for algorithms
const algorithmDisplayOrder = [
  'mayo2025',  // Display in reverese chronological order
  'bse2024',   
  'ase2016'    
  // Add more algorithm IDs in your preferred order
];

export default function HomePage() {
  // Create an ordered array of algorithms based on the defined order
  const orderedAlgorithms = algorithmDisplayOrder
    .map(id => algorithms[id])
    .filter(Boolean); // Filter out any undefined values (in case an ID doesn't exist)

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Select an algorithm to evaluate diastolic function
        </p>
      </div>

      {/* Changed from grid to flex with flex-col for single column layout */}
      <div className="flex flex-col space-y-6">
        {orderedAlgorithms.map((algo) => (
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