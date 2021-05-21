import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  constructor() {}

  sendDataSocket(): webSocket<any> {
    webSocket<any>('ws://192.168.20.85:9011/graph-batch');
  }
}
