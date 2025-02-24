// src/algorithms/index.ts - Combine all algorithms
import { Algorithm } from '../types/algorithm';
import ase2016Algorithm from '../app/algorithms/ase2016/ASE2016';
import bseAlgorithm from '../app/algorithms/bse2024/BSE2024';
import young2025Algorithm from '../app/algorithms/mayo2025/Young2025';

// Export all algorithms as a collection
const algorithms: Record<string, Algorithm> = {
  ase2016: ase2016Algorithm,
  bse: bseAlgorithm,
  young2025: young2025Algorithm,
  
  // Add more algorithms as needed
};

export default algorithms;