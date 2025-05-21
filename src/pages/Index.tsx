
import React from 'react';
import { SearchBox } from '@/components/SearchBox';
import { BusinessResults } from '@/components/BusinessResults';
import { MapPin, Search } from 'lucide-react';

const Index = () => {
  const [results, setResults] = React.useState<Business[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchPerformed, setSearchPerformed] = React.useState(false);

  const handleSearch = (query: string, location: string) => {
    setLoading(true);
    setSearchPerformed(true);
    
    // Simulação de resultados de busca
    setTimeout(() => {
      const mockResults = [
        { id: 1, name: 'Restaurante Sabor Local', hasWebsite: false, address: 'Rua das Flores, 123', type: 'Restaurante', rating: 4.5 },
        { id: 2, name: 'Salão de Beleza Estilo', hasWebsite: false, address: 'Av. Principal, 456', type: 'Beleza', rating: 4.2 },
        { id: 3, name: 'Padaria Pão Quentinho', hasWebsite: true, address: 'Praça Central, 78', type: 'Alimentação', rating: 4.8 },
        { id: 4, name: 'Mercadinho da Esquina', hasWebsite: false, address: 'Rua Lateral, 90', type: 'Mercearia', rating: 3.9 },
        { id: 5, name: 'Auto Peças Silva', hasWebsite: false, address: 'Av. Industrial, 1020', type: 'Automotivo', rating: 4.0 },
        { id: 6, name: 'Farmácia Saúde Total', hasWebsite: true, address: 'Rua da Saúde, 456', type: 'Saúde', rating: 4.6 },
        { id: 7, name: 'Loja de Roupas Fashion', hasWebsite: false, address: 'Shopping Centro, Loja 45', type: 'Moda', rating: 4.3 },
      ];
      
      // Filtra apenas empresas sem site
      const filteredResults = query.toLowerCase().includes('todos') 
        ? mockResults 
        : mockResults.filter(business => !business.hasWebsite);
      
      setResults(filteredResults);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="py-6 px-4">
        <div className="container mx-auto flex items-center justify-center">
          <MapPin className="text-blue-600 mr-2" size={28} />
          <h1 className="text-2xl font-bold text-blue-600">BuscaSemSite</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className={`transition-all duration-500 ${searchPerformed ? 'transform -translate-y-4' : 'py-20'}`}>
            <h2 className={`text-center ${searchPerformed ? 'text-xl mb-6' : 'text-3xl mb-8'}`}>
              Encontre empresas sem presença digital
            </h2>
            <SearchBox onSearch={handleSearch} />
          </div>
          
          {searchPerformed && (
            <div className="mt-8 animate-fadeIn">
              <BusinessResults results={results} loading={loading} />
            </div>
          )}
        </div>
      </main>
      
      <footer className="mt-auto py-6 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © 2023 BuscaSemSite - Encontre oportunidades digitais
        </div>
      </footer>
    </div>
  );
};

export default Index;
