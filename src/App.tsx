import React from 'react';
import Treemap from './components/Treemap';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Treemap Bar Visualization</h1>
        <Treemap />
      </div>
    </div>
  );
}

export default App;