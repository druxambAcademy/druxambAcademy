import { useUser } from "@clerk/nextjs";

export default function useClerkAccount() {
  const { user } = useUser();
  const primaryWeb3Wallet = user?.primaryWeb3Wallet;
  const address = primaryWeb3Wallet?.web3Wallet;
  function isValidAddress(addr: string | undefined): addr is `0x${string}` {
    return typeof addr === "string" && addr.startsWith("0x");
  }

  return { address: isValidAddress(address) ? address : undefined };
}
