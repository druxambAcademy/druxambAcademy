import { ClerkLoaded, ClerkLoading, Waitlist } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function Page() {
  return (
    <div>
      <ClerkLoaded>
        <Waitlist />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className="animate-spin text-muted-foreground" />
      </ClerkLoading>
    </div>
  );
}
