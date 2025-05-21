
import React from 'react';
import { MapPin, Star, Globe, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Business {
  id: number;
  name: string;
  hasWebsite: boolean;
  address: string;
  type: string;
  rating: number;
}

interface BusinessResultsProps {
  results: Business[];
  loading: boolean;
}

export function BusinessResults({ results, loading }: BusinessResultsProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="text-center py-10">
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-2">
            <AlertCircle className="text-gray-400" size={48} />
            <h3 className="text-xl font-medium text-gray-900">Nenhum resultado encontrado</h3>
            <p className="text-gray-500">Tente mudar a sua busca ou localização</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          {results.length} empresas encontradas
        </h3>
      </div>

      {results.map((business) => (
        <Card key={business.id} className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${!business.hasWebsite ? 'border-l-4 border-l-blue-600' : ''}`}>
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{business.name}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Star className="text-yellow-400 mr-1" size={16} />
                      <span>{business.rating}</span>
                    </div>
                    <span className="mx-2">•</span>
                    <span>{business.type}</span>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <MapPin className="mr-1" size={14} />
                    <span>{business.address}</span>
                  </div>
                </div>
                <div>
                  {!business.hasWebsite ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Globe className="mr-1" size={12} />
                      Sem site
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <Globe className="mr-1" size={12} />
                      Com site
                    </span>
                  )}
                </div>
              </div>
              
              {!business.hasWebsite && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600">Esta empresa não possui site - uma potencial oportunidade de negócio!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
