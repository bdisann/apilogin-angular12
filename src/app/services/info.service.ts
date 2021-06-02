import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import INFO_INTERFACE from '../models/infoInterface';

@Injectable({
  providedIn: 'root',
})
export class InfoService {
  private httpOptions: Object = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  getNodePostByName(message: INFO_INTERFACE): Observable<any> {
    const { acces_token, platform, query, analisis, size } = message;
    const url = `http://192.168.20.85:9010/1.0/api/graph/statistics/getNodePostByName?access_token=${acces_token}&platform=${platform}&query=${query}&analisis=${analisis}&page=1&size=${size}&order=desc&sortBy=created_at&startAt=*&endAt=*`;
    return this.http.get<INFO_INTERFACE>(url);
  }
}
