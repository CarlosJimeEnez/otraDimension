import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  GeoPoint,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Item } from '../interfaces/ImagePost';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private itemsCollection: any; // Referencia a la colección 'items'

  constructor(private firestore: Firestore) {
    this.itemsCollection = collection(this.firestore, 'items');
  }

  // Obtener todos los items de la colección
  getItems(): Observable<Item[]> {
    return collectionData(this.itemsCollection, {
      idField: 'id',
    }) as Observable<Item[]>;
  }

  // Agregar un nuevo item a la colección
  addItem(
    Nombre: string,
    BackgroundPrompt: string,
    Center: GeoPoint | null,
    Descripcion: string,
    OriginalImageUrl: string,
    TransformedImageUrl: string
  ) {
    const newItem: Item = {
      Nombre,
      BackgroundPrompt,
      Center,
      Descripcion,
      OriginalImageUrl,
      TransformedImageUrl,
    };
    return addDoc(this.itemsCollection, newItem); // Agregar el nuevo documento
  }

  // Actualizar el campo 'nombre' de un item existente
  updateItem(itemId: string, newName: string) {
    const itemDocRef = doc(this.firestore, `items/${itemId}`); // Referencia al documento con el id `itemId`
    return updateDoc(itemDocRef, { nombre: newName }); // Actualizar el campo 'nombre'
  }

  // Eliminar un item de la colección
  deleteItem(itemId: string) {
    const itemDocRef = doc(this.firestore, `items/${itemId}`);
    return deleteDoc(itemDocRef);
  }
}
