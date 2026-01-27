import React from "react";

const MobileCard = ({ name, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white border-2 border-gray-200 rounded-xl p-8
                 hover:border-blue-500 hover:shadow-lg transition
                 flex items-center gap-4 w-full"
    >
      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
        📱
      </div>

      <div className="text-xl font-semibold text-gray-900">
        {name}
      </div>
    </button>
  );
};

export default MobileCard;
