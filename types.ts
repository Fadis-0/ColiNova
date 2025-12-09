export enum UserRole {
  GUEST = 'GUEST',
  SENDER = 'SENDER',
  TRANSPORTER = 'TRANSPORTER',
  RECEIVER = 'RECEIVER',
}

export enum ParcelStatus {
  PENDING = 'PENDING',
  MATCHED = 'MATCHED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Coordinates {
  lat?: number | null;
  lng?: number | null;
  label?: string;
}

export interface Parcel {
  id: string;
  senderId: string;
  transporter_id?: string;
  receiverName: string;
  title: string;
  description: string;
  weight_kg: number; // kg
  size: 'S' | 'M' | 'L' | 'XL';
  price: number;
  origin: Coordinates;
  destination: Coordinates;
  status: ParcelStatus;
  trackingCode: string;
}

export interface Trip {
  id: string;
  transporterId: string;
  origin: Coordinates;
  destination: Coordinates;
  date: string;
  capacity: 'S' | 'M' | 'L' | 'XL';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}