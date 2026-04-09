import React from 'react';

interface ServerCardProps {
  server: { id: number; name: string; load: number };
}

const ServerCard: React.FC<ServerCardProps> = ({ server }) => {
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-2">{server.name}</h2>
      <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
        <div
          className="bg-blue-500 h-6 rounded-full"
          style={{ width: `${server.load}%` }}
        />
      </div>
      <p>{server.load}% Load</p>
    </div>
  );
};

export default ServerCard;
