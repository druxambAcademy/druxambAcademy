import Image from "next/image";
import React from "react";

export default function WelcomeBanner() {
  return (
    <div className="flex gap-5 items-center bg-white rounded-xl p-5">
      <Image src="/onchainLearn-logo.png" alt="banner" width={100} height={100} />
      <div>
        <h2 className="font-bold text-[27px]">
          Welcome to <span className=" text-blue-600">learnOnchain</span>
        </h2>
        <h2 className="text-gray-500">
          Explore, Learn, Build and Contribute to <span className="font-bold">Base</span>
        </h2>
      </div>
    </div>
  );
}
