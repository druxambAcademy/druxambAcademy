import { AxiosResponse } from "axios";
import axios from "axios";

const PINATA_SECRET_API_KEY = process.env
  .NEXT_PUBLIC_PINATA_SECRET_API_KEY as string;
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY as string;
export const pinJSONToIPFS = async (JSONBody: Object) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  //making axios POST request to Pinata ⬇️
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    })
    .then(function (response: AxiosResponse) {
      return {
        success: true,
        pinataUrl:
          "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
      };
    })
    .catch(function (error: any) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};
interface NFTMetaData {
  name: string;
  image: string;
  description: string;
}
export const uploadNFT = async (
  url: string,
  name: string,
  description: string
) => {
  //error handling
  if (url.trim() == "" || name.trim() == "" || description.trim() == "") {
    return {
      success: false,
      status: "❗Please make sure all fields are completed before minting.",
      data: {},
    };
  }

  //make metadata
  const metadata = new Object() as NFTMetaData;
  metadata.name = name;
  metadata.image = url;
  metadata.description = description;

  //make pinata call
  const pinataResponse = (await pinJSONToIPFS(metadata)) as {
    success: boolean;
    pinataUrl: string;
  };
  console.log("Pinata response:", pinataResponse);
  if (!pinataResponse.success) {
    return {
      success: false,
      status: "😢 Something went wrong while uploading your tokenURI.",
      data: {},
    };
  }

  return {
    success: true,
    status: "success",
    data: pinataResponse.pinataUrl,
  };
};
