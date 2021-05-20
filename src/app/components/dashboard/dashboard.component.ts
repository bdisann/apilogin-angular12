import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  dataAccount: any;
  dataAccountName: string = '';
  constructor(private route: Router) {}

  ngOnInit(): void {
    this.dataAccount = JSON.parse(window.localStorage.getItem('account'));
  }

  handleLogout() {
    window.localStorage.clear();
    this.route.navigate(['/']);
  }
}
