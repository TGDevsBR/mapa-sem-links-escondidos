
import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBoxProps {
  onSearch: (query: string, location: string) => void;
}

export function SearchBox({ onSearch }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query || 'empresas sem site', location || 'próximo');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center border-b border-gray-200 pb-4">
          <Search className="text-gray-400 mr-2" size={20} />
          <Input
            type="text"
            placeholder="O que você está procurando? (ex: restaurantes, salões)"
            className="flex-1 border-none shadow-none focus-visible:ring-0 text-lg placeholder:text-gray-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center">
          <MapPin className="text-gray-400 mr-2" size={20} />
          <Input
            type="text"
            placeholder="Localização (ex: São Paulo, Rio de Janeiro)"
            className="flex-1 border-none shadow-none focus-visible:ring-0 text-lg placeholder:text-gray-400"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full text-lg"
          >
            Buscar Empresas Sem Site
          </Button>
        </div>
      </form>
    </div>
  );
}
