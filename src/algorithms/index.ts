// src/algorithms/index.ts - Combine all algorithms
import { Algorithm } from '../types/algorithm';
import ase2016Algorithm from './ASE2016';
import bseAlgorithm from './BSE2024';

// Export all algorithms as a collection
const algorithms: Record<string, Algorithm> = {
  ase2016: ase2016Algorithm,
  bse: bseAlgorithm,
  // Add more algorithms as needed
};

export default algorithms;