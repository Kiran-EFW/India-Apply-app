export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  aadhaar?: string;
  profile?: any;
}

export interface Application {
  id: string;
  service: string;
  status: string;
  date: string;
  statusDetails?: string;
  progress?: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}

export interface UTR {
  id: string;
  utrNumber: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
}
