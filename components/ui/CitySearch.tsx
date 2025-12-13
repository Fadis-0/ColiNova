import React, { useState, useEffect } from 'react';
import { guelmaCities } from '../../utils/guelma_cities';

interface CitySearchProps {
  onSelect: (city: string) => void;
  placeholder: string;
  value: string;
}

export const CitySearch: React.FC<CitySearchProps> = ({ onSelect, placeholder, value }) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = guelmaCities.filter(city =>
      city.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filteredSuggestions);

  }, [query]);

  const handleSelect = (city: string) => {
    setQuery(city);
    onSelect(city);
    setShowSuggestions(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSelect(e.target.value);
    setShowSuggestions(true);
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-md"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-md mt-1">
          {suggestions.map((city) => (
            <li
              key={city}
              onClick={() => handleSelect(city)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
