import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import ACCOUNT_INTERFACE from '../models/accountInterface';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private httpOptions: Object = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  constructor(private http: HttpClient) {}

  createAccount(account: ACCOUNT_INTERFACE): Observable<any> {
    return this.http.post<ACCOUNT_INTERFACE>(
      '/api/v1/apps/1.0/api/v1/account/create',
      account,
      this.httpOptions
    );
  }

  accountLogin(account: Object): Observable<any> {
    return this.http.post<Object>(
      '/api/v1/apps/1.0/api/v1/account/login',
      account,
      this.httpOptions
    );
  }
}
