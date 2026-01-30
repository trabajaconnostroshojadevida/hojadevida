import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
    private previousState: string | null = localStorage.getItem('__localStorageState');
    private stateChange = new EventEmitter<void>();

    private ejecutarMetodoAppSource = new Subject<void>();
    ejecutarMetodoApp$ = this.ejecutarMetodoAppSource.asObservable();
  
    constructor() {
      setInterval(() => {
        const currentState = localStorage.getItem('__localStorageState');
        if (currentState !== this.previousState) {
          this.stateChange.emit();
          this.previousState = currentState;
        }
      }, 100); // Ajusta el intervalo según tus necesidades
    }
  
    onStateChange() {
      return this.stateChange.asObservable();
    }

    
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  ejecutarMetodoApp(){
    var isLoggedIn = false;
    var a = this.getItem('usuario')
    if(a){
      isLoggedIn = true;
    }else{
      isLoggedIn = false;
    }
    return isLoggedIn;
  }


  notificarAppComponent() {
    this.ejecutarMetodoAppSource.next();
  }

}