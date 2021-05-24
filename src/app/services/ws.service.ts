import { Injectable } from '@angular/core';
import { Observable, of, pipe, Subscription } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  constructor() {}
  dataGraph: any = [];
  private ws = webSocket('ws://192.168.20.85:9011/graph-batch');

  setDataGraph(socketMessage: any): void {
    this.ws.next(socketMessage);
  }

  getDataGraph(): Observable<any> {
    return this.ws.asObservable();
  }

  stopWebSocket() {
    this.ws.complete();
  }
}
