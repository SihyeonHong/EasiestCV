import { FaSpinner } from "react-icons/fa";

export const LoadingIcon = () => {
  return (
    <div className="flex justify-center">
      <FaSpinner className="animate-spin text-gray-400" />
    </div>
  );
};
