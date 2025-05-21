
export interface Business {
  id: number | string;
  name: string;
  hasWebsite: boolean;
  address: string;
  type: string;
  rating: number;
  phone?: string;
}
