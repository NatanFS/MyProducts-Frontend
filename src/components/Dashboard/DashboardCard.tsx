import React, { useState } from "react";
import { DashboardCardProps } from "@/types";

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  message,
  gradient,
  className,
  style,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const gradientStyle: React.CSSProperties = isHovering
    ? {
        background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent)`,
        opacity: 1,
        transition: "opacity 0.2s ease-out",
      }
    : {
        background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent)`,
        opacity: 0,
        transition: "opacity 0.2s ease-in",
      };

  return (
    <div
      className={`relative bg-gray-900 p-4 sm:p-6 rounded-xl shadow-lg text-center border-t-4 max-h-[220px] w-full  ${gradient} ${className}`}
      style={style}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={gradientStyle}
      ></div>

      <div className="relative z-10">
        <div className="flex items-center justify-center mb-4">
          <span
            className={`text-white bg-gray-800 rounded-full p-3 shadow-md`}
          >
            {icon}
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2">{title}</h2>
        <p className="text-xl sm:text-2xl font-extrabold text-white">
          {value !== undefined ? value : "N/A"}
        </p>
        {message && (
          <p className="text-sm text-gray-400 mt-2">{message}</p>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
