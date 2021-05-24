import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { WsService } from 'src/app/services/ws.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy, OnChanges {
  dataAccount: any;
  dataAccountName: string = '';
  dataGraph: any = [];

  constructor(private route: Router, as: AccountService, wSc: WsService) {
    if (!window.localStorage.getItem('account')) route.navigate(['login']);
  }

  ngOnInit(): void {
    this.dataAccount = JSON.parse(window.localStorage.getItem('account'));
  }

  ngOnDestroy(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataGraph.previousValue !== changes.dataGraph.currentValue) {
      console.log(this.dataGraph.curruentValue);
    }
  }

  handleLogout() {
    window.localStorage.clear();
    this.route.navigate(['/']);
  }

  handleSocket() {}
}
