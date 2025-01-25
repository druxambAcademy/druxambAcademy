import { useUser } from "@clerk/nextjs";
import { Badge, Name, Identity } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";
export default function Basename() {
  const { user } = useUser();

  const primaryWeb3Wallet = user?.primaryWeb3Wallet;
  const address = primaryWeb3Wallet?.web3Wallet;

  // Type guard function to check if the address is valid
  function isValidAddress(addr: string | undefined): addr is `0x${string}` {
    return typeof addr === "string" && addr.startsWith("0x");
  }
  return (
    <>
      <main className="m-auto">
        <p>
          {primaryWeb3Wallet ? (
            <Identity
              address={isValidAddress(address) ? address : undefined} // Pass undefined instead of null
              schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
              chain={base as any}
            >
              <Name className="text-black">
                <Badge className="badge" />
                {/* Displaying badge alongside the name */}
              </Name>
            </Identity>
          ) : (
            ""
          )}
        </p>
      </main>
    </>
  );
}
