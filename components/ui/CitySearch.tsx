import React, { useState, useEffect } from 'react';

interface CitySearchProps {
  onSelect: (city: string) => void;
  placeholder: string;
  value: string;
}

export const CitySearch: React.FC<CitySearchProps> = ({ onSelect, placeholder, value }) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      const apiKey = import.meta.env.VITE_MAPTILER_KEY;
      const url = `https://api.maptiler.com/geocoding/${query}.json?key=${apiKey}&types=place,locality,region`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        setSuggestions(data.features);
      } catch (error) {
        console.error("Failed to fetch city suggestions:", error);
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [query]);

  const handleSelect = (city: any) => {
    setQuery(city.text);
    onSelect(city.text);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-md"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-md mt-1">
          {suggestions.map((city) => (
            <li
              key={city.id}
              onClick={() => handleSelect(city)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {city.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};