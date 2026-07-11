// src/pages/OrderDetails/components/WinHeader.jsx
import React from 'react';

const WinHeader = () => {
  return (
    <div className="bg-yellow-400 text-black p-6 rounded-xl flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center text-3xl">
        🏆
      </div>
      <div>
        <h2 className="text-2xl font-bold">Congratulations, Julian!</h2>
        <p className="text-lg">You have successfully won the auction for the Patek Philippe Nautilus.</p>
      </div>
    </div>
  );
};

export default WinHeader;