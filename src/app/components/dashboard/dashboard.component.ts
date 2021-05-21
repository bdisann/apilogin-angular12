import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { webSocket } from 'rxjs/webSocket';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  dataAccount: any;
  dataAccountName: string = '';
  socketMessage: Object = {
    message: 'graph',
    access_token:
      '86120884ae4b272458ab430724f32da238a6256c7f5b772b0989f885a9e483dc',
    workspace: 'topic-overall',
    delay: '1',
    size: '100',
  };
  constructor(private route: Router) {}

  ngOnInit(): void {
    this.dataAccount = JSON.parse(window.localStorage.getItem('account'));
  }

  handleLogout() {
    window.localStorage.clear();
    this.route.navigate(['/']);
  }

  handleSocket() {
    const ws = webSocket('ws://192.168.20.85:9011/graph-batch');
    ws.next(this.socketMessage);
    ws.subscribe();
    ws.complete();
  }
}
