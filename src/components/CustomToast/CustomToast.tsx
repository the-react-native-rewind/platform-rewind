import React from "react";
import { toast } from "react-hot-toast";

type ToastType = "success" | "error";

interface CustomToastProps {
  title: string;
  description: string;
  type?: ToastType;
}

export const CustomToast: React.FC<CustomToastProps> = ({
  title,
  description,
  type = "error",
}) => {
  const isSuccess = type === "success";
  const borderColor = isSuccess ? "border-success" : "border-primary";
  const bgColor = isSuccess ? "bg-success" : "bg-primary";
  const iconBgColor = isSuccess ? "bg-success" : "bg-error";
  const icon = isSuccess ? "✓" : "✖";

  return (
    <div
      className={`flex items-center ${bgColor} border-2 ${borderColor} shadow-lg rounded-lg sm:max-w-xs p-4 animate-slide-in`}
    >
      <div
        className={`w-5 h-5 flex-shrink-0 ${iconBgColor} text-white rounded-full flex items-center justify-center`}
      >
        <span className="text-lg">{icon}</span>
      </div>
      <div className="ml-4">
        <strong className="text-white text-lg font-bold block">{title}</strong>
        <span className="text-white text-sm block">{description}</span>
      </div>
    </div>
  );
};

// Utility function
export function showToast(
  title: string,
  description: string,
  type: ToastType = "error",
  duration: number = 5000,
) {
  toast.custom(
    <CustomToast title={title} description={description} type={type} />,
    {
      duration: duration,
    },
  );
}
