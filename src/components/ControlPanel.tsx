import React from 'react';

interface ControlPanelProps {
  servers: { id: number; name: string; load: number }[];
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ servers, onIncrease, onDecrease }) => {
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {servers.map(server => (
        <div key={server.id} className="flex flex-col items-center bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">{server.name}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => onIncrease(server.id)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              + Load
            </button>
            <button
              onClick={() => onDecrease(server.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              - Load
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ControlPanel;
