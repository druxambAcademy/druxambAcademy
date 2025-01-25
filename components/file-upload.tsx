"use client";

import { uploadFileToPinata } from "@/pinata/uploadFileToPinanta";
import { FileUploader } from "react-drag-drop-files";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
  fileTypes: string[];

};

export const FileUpload = ({
  onChange,
  fileTypes
}: FileUploadProps) => {
  const handleChange = async (file: File) => {
   try {
    const url = await uploadFileToPinata(file)
    console.log(url)
    if(url) {
      onChange(url)
    }
   } catch (error) {
    console.log("Error")
    toast.error("Failed to upload, Try again")
   }
  };
    return (
      <FileUploader handleChange={handleChange}  name="file" types={fileTypes} />
    );

}