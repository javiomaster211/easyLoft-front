// Interfaces principales del proyecto

export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface Loft {
  _id: string;
  name: string;
  location?: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PigeonImages {
  body?: string;
  eye?: string;
  plumage?: string;
}

export interface OwnershipHistory {
  previousOwner: string;
  transferDate: string;
  notes?: string;
}

export interface Purchase {
  sellerName: string;
  date: string;
  price?: number;
  notes?: string;
}

export interface Sale {
  buyerName: string;
  date: string;
  price?: number;
  notes?: string;
}

export interface Pigeon {
  _id: string;
  loftId: string;
  ringNumber?: string;
  name: string;
  birthDate: string;
  sex: 'male' | 'female' | 'unknown';
  plumage: string;
  dimensions: string;
  images: PigeonImages;
  fatherId?: string;
  motherId?: string;
  isExternal: boolean;
  externalOwnerInfo?: string;
  originalBreeder: string;
  ownershipHistory: OwnershipHistory[];
  purchases: Purchase[];
  sales: Sale[];
  createdAt: string;
  updatedAt: string;
  // Relaciones pobladas opcionalmente
  father?: Pigeon;
  mother?: Pigeon;
  loft?: Loft;
}

export interface GenealogyNode {
  id: string;
  name: string;
  ringNumber?: string;
  children?: GenealogyNode[];
}

export interface DashboardStats {
  totalLofts: number;
  totalPigeons: number;
  maleCount: number;
  femaleCount: number;
  unknownCount: number;
  recentPigeons: Pigeon[];
}
