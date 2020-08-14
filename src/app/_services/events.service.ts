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

    this.eventsSubject = new BehaviorSubject<any>([]);
    this.events = this.eventsSubject.asObservable();

  }

  public setEventsValues(obj){
    this.eventsSubject.next(obj);
  }

  fetchEvents(){

    if(this.eventsSubject.value[0])
    {
      console.log('testswteste');
    }
    return this.http.get(`${environment.apiUrl}/wp-json/jwt-auth/v1/events `)
    .pipe(map((data:any) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes

        this.eventsSubject.next(data);
        return data;
    }));

  }

  fetchEvent(id)
  {
    console.log(this.eventsSubject.value);
    const search = this.eventsSubject.value.filter((r)=>{
      return r.id === id;
    })
    console.log(id,'test',search);
    return search[0];
  }

}
