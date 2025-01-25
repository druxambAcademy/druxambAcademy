"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import useClerkAccount from "@/hooks/useClerkAccount";
import { uploadNFT } from "@/pinata/uploadNFTMetaData";

const MintButton = ({
  courseId,
  videoNftUrl,
  title,
  description,
}: {
  courseId: string;
  videoNftUrl: string;
  title: string;
  description: string;
}) => {
  const [nftName, setNftName] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);
  const [openseaUrl, setOpenseaUrl] = useState<string | null>(null);
  const { address } = useClerkAccount();

  useEffect(() => {
    const fetchNftInfo = async () => {
      setIsLoading(true);
      try {
        const nameResponse = await axios.get(`/api/courses/${courseId}/mint`);
        setNftName(nameResponse.data.name);

        if (address) {
          const mintStatusResponse = await axios.put(
            `/api/courses/${courseId}/mint`,
            { userAddress: address }
          );
          setHasMinted(mintStatusResponse.data.hasMinted);
          setOpenseaUrl(mintStatusResponse.data.openseaUrl);
        }
      } catch (error) {
        console.error("Failed to fetch NFT info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNftInfo();
  }, [courseId, address]);

  const handleMintClick = async () => {
    console.log("connected address", address);
    if (!address) {
      toast.error(
        "Please connect your wallet from your profile to mint a certificate."
      );
      return;
    }

    setIsMinting(true);
    try {
      const nftMetadata = await uploadNFT(videoNftUrl, title, description);
      const response = await axios.post(`/api/courses/${courseId}/mint`, {
        userAddress: address,
        nftMetadata: nftMetadata.data,
      });

      console.log("Minting response:", response.data);

      toast.success("Certificate minted successfully!");
      setHasMinted(true);
      setOpenseaUrl(response.data.openseaUrl);
    } catch (error) {
      console.error("Failed to mint certificate:", error);
      toast.error("Failed to mint certificate. Please try again.");
    } finally {
      setIsMinting(false);
    }
  };

  const handleViewClick = () => {
    if (openseaUrl) {
      window.open(openseaUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <button className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 cursor-not-allowed">
        Loading...
      </button>
    );
  }

  if (hasMinted) {
    return (
      <button
        className="px-4 py-2 rounded-md bg-green-200 text-green-700 hover:bg-green-300"
        onClick={handleViewClick}
      >
        View NFT on OpenSea
      </button>
    );
  }

  return (
    <button
      className={`px-4 py-2 rounded-md ${
        isMinting
          ? "bg-gray-300 text-gray-700 cursor-not-allowed"
          : "bg-sky-200 text-sky-700 hover:bg-sky-300"
      }`}
      onClick={handleMintClick}
      disabled={isMinting}
    >
      {isMinting ? "Minting..." : `Mint ${nftName ? `(${nftName})` : ""} NFT`}
    </button>
  );
};

export default MintButton;
