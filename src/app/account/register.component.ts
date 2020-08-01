import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { first } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';


import { AccountService, AlertService } from '@app/_services';



/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {

    form: FormGroup;
    matcher = new MyErrorStateMatcher();
    pw_hide = true;
    loading = false;
    submitted = false;

    //playersArray: Player[] = [] ;


    USStates = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private http: HttpClient,
    ) {

      this.form = this.formBuilder.group({
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        email: ['', [
          Validators.required,
          Validators.email,
        ]],
        password: ['', [Validators.required]],
        confirmPassword: [''],
        phone_number: ['', [Validators.required]],
        street_address_1: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        zip: ['', [Validators.required]],

     }, { validator: this.checkPasswords });

     }

    ngOnInit() {

    }


    addLacrossePlayer()
    {

        //const modal = {} as Player;
        //this.playersArray.push(modal);

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
        this.accountService.register(this.form.getRawValue()).subscribe((r:any) => {
          this.loading = false;
            console.log(r);
            this.accountService.setUserValues(r.user);

            //navigate to next screen
            this.router.navigate(['account']);

        }, (e) => {
          console.log(e);
          this.loading = false;

          this.alertService.error(e);

        });
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


    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
      let pass = group.get('password').value;
      let confirmPass = group.get('confirmPassword').value;

      return pass === confirmPass ? null : { notSame: true }
    }
}
