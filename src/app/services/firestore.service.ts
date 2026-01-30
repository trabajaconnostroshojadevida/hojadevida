import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface Ropa {
  genero: string;
  tipo: string;
  url: string;
  nombre:string;
}

@Injectable({
  providedIn: 'root'
})



export class FirestoreService {

  constructor(private firestore: Firestore) {}

  getRopa(): Observable<Ropa[]> {
    const ropaCollection = collection(this.firestore, 'urlRopa');
    return collectionData(ropaCollection, { idField: 'id' }) as Observable<Ropa[]>;
  }
  
  addUser(email: string, password: string): Promise<void> {
    const usersCollection = collection(this.firestore, 'users');
    return addDoc(usersCollection, { email, password })
      .then(() => console.log('Usuario'))
      .catch(error => console.error('Error al agregar usuario:', error));
  }
}

