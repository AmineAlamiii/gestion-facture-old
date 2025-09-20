import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

interface Option {
  id: string;
  name: string;
  email?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string | Option | null) => void;
  placeholder: string;
  label: string;
  required?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(option => option.id === value);

  useEffect(() => {
    const filtered = options.filter(option =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (option.email && option.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onChange(null);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleInputClick = () => {
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <div
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white cursor-pointer"
          onClick={handleInputClick}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {isOpen ? (
                <div className="flex items-center">
                  <Search className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full outline-none bg-transparent"
                    autoFocus
                  />
                </div>
              ) : (
                <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
                  {selectedOption ? selectedOption.name : placeholder}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              {selectedOption && !isOpen && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <ChevronDown 
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180' : ''
                }`} 
              />
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  className={`px-3 py-2 cursor-pointer transition-colors hover:bg-blue-50 ${
                    value === option.id ? 'bg-blue-100 text-blue-700' : 'text-gray-900'
                  }`}
                >
                  <div className="font-medium">{option.name}</div>
                  {option.email && (
                    <div className="text-sm text-gray-500">{option.email}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-center">
                Aucun résultat trouvé
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchableSelect;