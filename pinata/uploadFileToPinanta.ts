import axios from "axios";


export const uploadFileToPinata = async (file: File): Promise<string | null> => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY as string;
  const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY as string;

  // Prepare the form data to send the file to Pinata
  const formData = new FormData();
  formData.append("file", file);
  try {
    // Send the request to Pinata with the necessary headers
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": `multipart/form-data`,
        pinata_api_key: PINATA_API_KEY ,
        pinata_secret_api_key: PINATA_SECRET_API_KEY ,
      },
    });

    // The IPFS hash is returned in the response
    const ipfsHash = response.data.IpfsHash;

    // Construct the URL to access the file on IPFS via Pinata's gateway
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    return ipfsUrl;
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    throw new Error("Fail to upload")
  }
};
