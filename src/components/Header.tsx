import React from 'react';
import { BarChart3 } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <BarChart3 className="h-8 w-8 mr-3" />
        <h1 className="text-2xl font-bold">Financial Dashboard</h1>
      </div>
    </header>
  );
};