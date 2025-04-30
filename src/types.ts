// src/types.ts
export interface EventData {
  id: number; // Crucial for identifying which event to book
  name: string;
  date: Date; // Consider using Date object if needed, but string is often simpler for data transfer
  location: string;
  description: string;
  price: number;
  image?: string; // Optional image URL
}