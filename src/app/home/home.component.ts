import { Component } from '@angular/core';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { EventsService } from '@app/_services/events.service';

@Component({ templateUrl: 'home.component.html',styleUrls: ['home.component.css']})
export class HomeComponent {
    user: User;
    events;

    constructor(private accountService: AccountService, private eventsService: EventsService) {
       // this.user = this.accountService.userValue;
        this.accountService.user.subscribe(x => this.user = x);
        this.eventsService.fetchEvents().subscribe();
        this.eventsService.events.subscribe(x => this.events = x);
    }

    logout() {
      this.accountService.logout();
    }


    playerRegisterDialog() {


    }
}
