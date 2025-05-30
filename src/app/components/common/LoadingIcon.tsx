import { FaSpinner } from "react-icons/fa";

export const LoadingIcon = () => {
  return (
    <div className="flex justify-center">
      <FaSpinner className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  );
};
