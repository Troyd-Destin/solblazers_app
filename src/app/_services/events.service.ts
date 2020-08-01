import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private eventsSubject: BehaviorSubject<any>;
  public events: Observable<any>;

  constructor(  private http: HttpClient) {

    this.eventsSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user')));
    this.events = this.eventsSubject.asObservable();

  }

  public setEventsValues(obj){
    this.eventsSubject.next(obj);
  }

  fetchEvents(){


    return this.http.get(`${environment.apiUrl}/wp-json/jwt-auth/v1/events `)
    .pipe(map((data:any) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes

        this.eventsSubject.next(data);
        return data;
    }));

  }

}
