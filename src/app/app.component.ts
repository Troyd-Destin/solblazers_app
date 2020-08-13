import { Component, } from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models';
import { Router } from '@angular/router';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    user: User;

    constructor(private accountService: AccountService, public router: Router) {
        this.accountService.user.subscribe(x => this.user = x);
        this.router = router;
    }

    logout() {
        this.accountService.logout();
    }
}