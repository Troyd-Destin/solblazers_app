import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { first } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';


import { AccountService, AlertService } from '@app/_services';

interface Player {
  first_name: string;
  last_name: string;
  lacrosse_id: number;
  dob: Date;
  highschoolGradYear: number;
  jerseyNumber: number;
  currentSchool: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;

}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    form = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('',[]),
      confirmPassword: new FormControl('',[]),
      phone_number: new FormControl('', [Validators.required]),
      street_address_1: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      zip: new FormControl('', [Validators.required]),

   });

    pw_hide = true;
    loading = false;
    submitted = false;

    playersArray: Player[] = [] ;


    USStates = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private http: HttpClient,
    ) { }

    ngOnInit() {

    }


    addLacrossePlayer()
    {

        const modal = {} as Player;
        this.playersArray.push(modal);

    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    registerUser() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        const requestObj = {
          email: 'trboyce@ualberta.ca',
          phone_number: '',
          first_name: '',
          last_name: '',
          street_address_1: '',
          zip: '',
          state: '',
          city: '',
          password: '951951',
          role: ''
      };

        console.log(this.form.getRawValue());

        const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');


      this.loading = true;
        this.accountService.register(this.form.getRawValue()).subscribe((r) => {
          this.loading = false;
            console.log(r);

            //navigate to next screen


        }, (e) => { console.log(e);  this.loading = false; });
    //    this.loading = true;
       /*  this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                }); */
    }
}
