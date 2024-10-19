import { GeoPoint } from 'firebase/firestore';

export interface ImagePost {
  id?: string;
  originalImageUrl: string;
  transformedImageUrl: string;
  backgroundPrompt: string;
  createdAt: Date;
}

export interface Item {
  id?: string; // Opcional para manejar el ID del documento
  Nombre: string;
  BackgroundPrompt: string;
  Center: GeoPoint | null;
  Descripcion: string;
  OriginalImageUrl: string;
  TransformedImageUrl: string;
}
