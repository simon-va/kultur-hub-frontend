export interface Organization {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: Address;
  foundedYear?: number;
  categories: string[];
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}
