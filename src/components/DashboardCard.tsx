import React from "react";

interface DashboardCardProps {
  title: string;
  value: string | number | undefined;
  icon: React.ReactNode;
  borderColor: string;
  gradient?: string;
  className?: string;
  message?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, borderColor, message, gradient, className }) => {
    return (
      <div className={`bg-gray-900 p-4 sm:p-6 rounded-xl shadow-lg text-center border-t-4 max-h-[220px] w-full ${borderColor} ${gradient} ${className} `}>
        <div className="flex items-center justify-center mb-4">
          <span className={`text-white bg-gray-800 rounded-full p-3 shadow-md`}>{icon}</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2">{title}</h2>
        <p className="text-xl sm:text-2xl font-extrabold text-white">{value !== undefined ? value : "N/A"}</p>
        {/* {message && <p className="text-sm sm:text-base text-gray-300 mt-4">{message}</p>} */}
      </div>
    );
  };
  
  

export default DashboardCard;
