import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { ApiStatus } from '../common/ApiStatus';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4 ml-0 lg:ml-0">
      <div className="flex items-center justify-between">
        <div className="ml-12 lg:ml-0">
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-800">{title}</h2>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          <ApiStatus />
          
          <div className="relative hidden md:block">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32 lg:w-auto"
            />
          </div>
          
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="flex items-center space-x-1 lg:space-x-2">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
            </div>
            <span className="text-xs lg:text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;