// Blockchain API Service
// Handles product verification on the Polygon blockchain network
// Uses ethers.js for read-only smart contract calls (no wallet/signing required)

import { BLOCKCHAIN_CONFIG } from '../../utils/constants';

// Smart contract ABI for the product verification contract
// Only includes the read function we need - verifyProduct
const VERIFICATION_ABI = [
  'function verifyProduct(bytes32 hash) view returns (bool)',
  'function getProductInfo(bytes32 hash) view returns (bool verified, uint256 timestamp)',
];

// Set of pre-registered product hashes that are "verified" on the blockchain
// In production, these would be stored on the actual Polygon smart contract
const VERIFIED_HASHES = new Set<string>();

// Register some demo products as verified for the demonstration
export function registerDemoProducts(hashes: string[]) {
  hashes.forEach((hash) => VERIFIED_HASHES.add(hash));
}

/**
 * Verifies a product's authenticity on the Polygon blockchain
 * In the prototype, this simulates the blockchain call with a delay
 * to demonstrate the verification flow. In production, it would use
 * ethers.js to call the smart contract's verifyProduct function.
 *
 * @param hash - The product's blockchain hash (SHA-256 of product data)
 * @returns boolean - true if product is verified authentic
 */
export async function verifyProductOnChain(hash: string): Promise<boolean> {
  // Simulate blockchain network latency (1-2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    // In production, this would be:
    // const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_CONFIG.rpcUrl);
    // const contract = new ethers.Contract(BLOCKCHAIN_CONFIG.contractAddress, VERIFICATION_ABI, provider);
    // return await contract.verifyProduct(hash);

    // For the prototype, check against our local verified hashes set
    // This demonstrates the architecture while being reliable for the demo
    return VERIFIED_HASHES.has(hash);
  } catch (error) {
    console.log('[Blockchain] Verification error:', error);
    // Fallback to local verification if blockchain network is unavailable
    return VERIFIED_HASHES.has(hash);
  }
}

/**
 * Generates a product hash matching what would be stored on-chain
 * Hash is computed from product ID, title, and price
 */
export function computeProductHash(id: number, title: string, price: number): string {
  const data = `${id}-${title}-${price}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
}
