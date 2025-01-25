import { LoaderIcon } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div>
      <LoaderIcon className="text-blue-600 h-screen animate-spin m-auto" />
    </div>
  );
};

export default Loading;
