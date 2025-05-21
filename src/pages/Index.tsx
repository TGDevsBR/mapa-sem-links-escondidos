
import React, { useState, useEffect } from 'react';
import { SearchBox } from '@/components/SearchBox';
import { BusinessResults } from '@/components/BusinessResults';
import { MapPin, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PDFExport } from '@/components/PDFExport';
import type { Business } from '../types/business';

// Add type definition for the Google Maps API
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          PlacesService: any;
          PlacesServiceStatus: {
            OK: string;
          };
        };
      };
    };
  }
}

const Index = () => {
  const [results, setResults] = React.useState<Business[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchPerformed, setSearchPerformed] = React.useState(false);
  const [searchLocation, setSearchLocation] = React.useState('');
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);
  // Set the Google API key directly
  const [googleApiKey] = useState('AIzaSyDv4AAQx97nmXgGZNlficTVyiJEL0ZLoHk');

  // Function to load Google Places API script
  useEffect(() => {
    if (!googleApiKey) return;
    
    const loadGoogleMapsApi = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
      script.defer = true;
      script.async = true;
      script.onload = () => {
        setGoogleApiLoaded(true);
        console.log("Google Places API loaded successfully");
      };
      script.onerror = () => {
        toast({
          title: "Erro",
          description: "Não foi possível carregar a API do Google Maps. Verifique sua chave API.",
          variant: "destructive",
        });
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsApi();
  }, [googleApiKey]);

  const searchBusinesses = (location: string, locationType: string) => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps API not loaded");
      return;
    }

    // Create a PlacesService with a temporary div (required by the API)
    const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));
    
    // Construct the query
    let query = '';
    if (locationType === 'neighborhood') {
      query = `empresas em ${location}`;
    } else {
      query = `empresas na cidade de ${location}`;
    }

    const request = {
      query,
      fields: ['name', 'place_id', 'formatted_address', 'website', 'rating', 'types', 'formatted_phone_number'],
    };

    placesService.textSearch(request, (results: any, status: string) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        console.log("Places API results:", results);
        
        // Process results to get detailed information including phone numbers
        const processedResults: Business[] = [];
        let processedCount = 0;
        
        results.forEach((place: any, index: number) => {
          // Get details for each place to retrieve phone number
          placesService.getDetails(
            { placeId: place.place_id, fields: ['formatted_phone_number'] },
            (placeDetails: any, detailStatus: string) => {
              processedCount++;
              
              const business: Business = {
                id: place.place_id || Math.random().toString(),
                name: place.name || 'Sem nome',
                hasWebsite: !!place.website,
                address: place.formatted_address || 'Sem endereço',
                type: place.types?.length ? mapGoogleType(place.types[0]) : 'Negócio',
                rating: place.rating || 0,
                phone: placeDetails && placeDetails.formatted_phone_number || 'Sem telefone'
              };
              
              processedResults.push(business);
              
              // When all places are processed
              if (processedCount === results.length) {
                // Filter businesses without websites
                const filteredResults = processedResults.filter(business => !business.hasWebsite);
                setResults(filteredResults);
                setLoading(false);
              }
            }
          );
        });
      } else {
        console.error("Places API error:", status);
        toast({
          title: "Erro na busca",
          description: `Não foi possível realizar a busca: ${status}`,
          variant: "destructive",
        });
        setResults([]);
        setLoading(false);
      }
    });
  };

  // Map Google place types to more readable business types
  const mapGoogleType = (googleType: string): string => {
    const typeMap: Record<string, string> = {
      'restaurant': 'Restaurante',
      'cafe': 'Café',
      'bar': 'Bar',
      'store': 'Loja',
      'food': 'Alimentação',
      'health': 'Saúde',
      'beauty_salon': 'Beleza',
      'clothing_store': 'Moda',
      'grocery_or_supermarket': 'Mercado',
      'establishment': 'Estabelecimento',
      'local_business': 'Negócio Local'
      // Add more mappings as needed
    };
    
    return typeMap[googleType] || 'Negócio';
  };

  const handleSearch = (query: string, location: string, locationType: string) => {
    setLoading(true);
    setSearchPerformed(true);
    setSearchLocation(location);
    
    if (!googleApiLoaded) {
      toast({
        title: "API não carregada",
        description: "A API do Google ainda não foi carregada. Aguarde um momento e tente novamente.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    searchBusinesses(location, locationType);
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
          <div className={`transition-all duration-500 ${searchPerformed ? 'transform -translate-y-4' : 'py-12'}`}>
            <h2 className={`text-center ${searchPerformed ? 'text-xl mb-6' : 'text-3xl mb-8'}`}>
              {searchPerformed ? `Empresas sem site em ${searchLocation}` : 'Encontre empresas sem presença digital'}
            </h2>
            <SearchBox onSearch={handleSearch} isLoading={loading} />
          </div>
          
          {searchPerformed && (
            <div className="mt-8 animate-fadeIn">
              {results.length > 0 && (
                <div className="mb-4 flex justify-end">
                  <PDFExport businesses={results} location={searchLocation} />
                </div>
              )}
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
