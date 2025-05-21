
import React, { useState } from 'react';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchBoxProps {
  onSearch: (query: string, location: string, locationType: string) => void;
  isLoading: boolean;
}

export function SearchBox({ onSearch, isLoading }: SearchBoxProps) {
  const [location, setLocation] = useState('');
  const [locationType, setLocationType] = useState('neighborhood'); // neighborhood ou city

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location.trim()) {
      toast({
        title: "Localização necessária",
        description: "Por favor, digite um bairro ou cidade para pesquisar",
        variant: "destructive",
      });
      return;
    }
    
    onSearch('empresas sem site', location, locationType);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">Encontre empresas sem site no Google Maps</h3>
        
        <div className="flex items-center gap-2">
          <Select 
            value={locationType} 
            onValueChange={setLocationType}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neighborhood">Bairro</SelectItem>
              <SelectItem value="city">Cidade</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center flex-1 border border-gray-200 rounded-md">
            <MapPin className="text-gray-400 ml-3 mr-2" size={20} />
            <Input
              type="text"
              placeholder={locationType === 'neighborhood' ? "Digite um bairro (ex: Copacabana)" : "Digite uma cidade (ex: São Paulo)"}
              className="flex-1 border-none shadow-none focus-visible:ring-0 text-lg placeholder:text-gray-400"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-center pt-2">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full text-lg gap-2"
            disabled={!location.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/>
                Buscando...
              </>
            ) : (
              <>
                Buscar Empresas <ArrowRight size={18} />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
