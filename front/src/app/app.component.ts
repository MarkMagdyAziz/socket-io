import {Component,inject,OnDestroy,signal} from '@angular/core';
import {SocketService} from './services/socket.service';
import {Subscription} from 'rxjs';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [FormsModule]
})
export class AppComponent implements OnDestroy {
  title = 'socket-demo';

  socketService = inject(SocketService)

  private messageSubscription: Subscription;
  messages = signal<string[]>([])
  newMessage = signal<string>('');

  constructor () {
    this.messageSubscription = this.socketService
      .onSocketEvent('receive-message')
      .subscribe((message) => {
        console.log(message);
        this.messages.update((prev) => [...prev,message]);
      });
  }

  sendMessage () {
    const text = this.newMessage()
    this.socketService.emitSocketEvent('send-message',text);
    this.newMessage.set('');
  }
  get newMessageValue () {
    return this.newMessage();
  }

  set newMessageValue (value: string) {
    this.newMessage.set(value);
  }
  ngOnDestroy () {
    this.messageSubscription.unsubscribe();
  }
}
