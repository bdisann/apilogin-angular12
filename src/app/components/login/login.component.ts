import { Component, OnInit } from '@angular/core';
import ACCOUNT_INTERFACE from 'src/app/data/accountInterface';
import { AccountService } from 'src/app/services/account.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  showLogin: boolean = true;
  showRegister: boolean = false;
  account_email: string;
  account_username: string;
  account_password: string;
  account_fullname: string;
  role: string;
  workspace: number;

  accountData: any;

  constructor(private account: AccountService, private route: Router) {}

  ngOnInit(): void {
    console.log(this.accountData);
    if (window.localStorage.getItem('account')) {
      this.route.navigate(['dashboard']);
    }
  }

  handleShowLogin(): void {
    this.showLogin = true;
    this.showRegister = false;
  }

  handleShowRegister(): void {
    this.showRegister = true;
    this.showLogin = false;
  }

  handleRegisterSubmit(): void {
    const newAccount: ACCOUNT_INTERFACE = {
      account_password: this.account_password,
      account_username: this.account_username,
      account_email: this.account_email,
      account_fullname: this.account_fullname,
      workspace: this.workspace,
      role: this.role,
    };

    if (
      !this.account_email &&
      !this.account_fullname &&
      !this.account_password &&
      !this.account_username &&
      !this.workspace &&
      !this.role
    ) {
      return;
    }
    this.account.createAccount(newAccount).subscribe((res) => console.log(res));
  }

  handleLoginSubmit() {
    if (!this.account_username && !this.account_password) {
      window.alert('Isi form dengan benar :)');
      return;
    }

    const accountLogin: Object = {
      username: this.account_username,
      password: this.account_password,
    };

    this.account.accountLogin(accountLogin).subscribe((res) => {
      if (!res.status) {
        window.alert(res.message);
        return;
      }
      window.localStorage.setItem('account', JSON.stringify(res.data));
      this.accountData = JSON.parse(window.localStorage.getItem('account'));

      this.route.navigate(['dashboard']);

      this.account_username = '';
      this.account_password = '';
    });
  }
}
