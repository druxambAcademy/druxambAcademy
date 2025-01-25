import Image from "next/image";

export const Logo = () => {
  return (
    <div className="flex gap-1">
      <Image src="/onchainLearn-logo.png" alt="banner" width={24} height={20} className="h-6 mt-1" />
      <h1 className="text-2xl font-bold text-blue-600">
        <span className="text-blue-500">learn</span>Onchain
      </h1>
    </div>
  );
};
