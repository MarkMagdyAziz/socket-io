import {HttpClient} from '@angular/common/http';
import {inject,Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {io,Socket} from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  httpClient = inject(HttpClient)
  private socket: Socket;

  constructor () {
    // initialize socket server connection
    this.socket = io('http://localhost:8080');
  }

  // send a new event with value
  // send-message
  emitSocketEvent (event: string,text: string) {
    this.socket.emit(event,text);
  }


  /*
   * Listens to a socket event and returns an Observable.
   * Automatically handles cleanup when the subscription ends.
   * @param event The event name to listen for.
   * @returns Observable emitting event data.
   */

  // recieve-message
  onSocketEvent (event: string): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket.on(event,(data) => {
        observer.next(data);
      });
      // Handle cleanup, and close the server after message send
      return () => {
        this.socket.off(event);
      };
    });
  }
}
