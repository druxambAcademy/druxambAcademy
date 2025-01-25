import contractAbi from "../constant/abi.json";
import { createWalletClient, http, getContract, publicActions } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { COURSE_NFT_ADDRESS } from "@/constant/deployedContract";

export const contracts: Record<string, any> = {};

const account = privateKeyToAccount(
  process.env.WALLET_PRIVATE_KEY as `0x${string}`
);

export const client = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(),
}).extend(publicActions);
export function initalizeContracts() {
  contracts.courseNFT = getContract({
    address: COURSE_NFT_ADDRESS as `0x${string}`,
    abi: contractAbi,
    client: client,
  });
}
