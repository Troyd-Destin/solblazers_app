import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Player } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
      console.log(this.userSubject.value);
      return this.userSubject.value;
    }

    public setUserValues(obj){
      this.userSubject.next(obj);
    }

    login(email, password) {



      return this.http.post<User>(`${environment.apiUrl}/wp-json/jwt-auth/v1/token `, {username: email, password: password})
            .pipe(map((data: any) => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(data.user));
                this.userSubject.next(data.user);
                return data.user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {

      const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
      return this.http.post(`${environment.apiUrl}wp-json/wp/v2/users/register`, user, { headers });
    }

    addPlayer(player: Player){
        //console.log(player);
        const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
       // console.log('add player triger');
        const user = this.userValue;
        //console.log(user);
        player.user_id = user.ID;
        const payload = {'player': player, };
        return this.http.post(`${environment.apiUrl}wp-json/jwt-auth/v1/player`, payload, { headers });

    }

    addPlayerToPlayerArray(player: Player){

         const user = this.userValue;
         user.data.players.push(player);
         localStorage.setItem('user', JSON.stringify(user));
         this.userSubject.next(user);

    }

    addPlayerEvent(event:any)
    {
      const user = this.userValue;
      user.data.player_events.push(event);
      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.data.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.ID) {
                    this.logout();
                }
                return x;
            }));
    }
}
