// Setup: npm install alchemy-sdk
import { Alchemy, Network } from "alchemy-sdk";
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

const config = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.SCROLL_SEPOLIA,
};
const alchemy = new Alchemy(config);

export const getAllMyNft = async (address: string) => {
  // Get all NFTs
  const nfts = await alchemy.nft.getNftsForOwner(address);
  // Print NFTs
  return nfts;
};
