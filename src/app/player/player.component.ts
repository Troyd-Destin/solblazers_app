import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ErrorStateMatcher} from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountService, AlertService } from '@app/_services';

import { Player } from '@app/_models';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.less']
})
export class PlayerComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private http: HttpClient, ) { }

  id;
  player: Player = new Player;
  newPlayer = false;
  form: FormGroup;
  matcher = new MyErrorStateMatcher();

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.fetchPlayerInfo();
    });


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

   });



  }

  fetchPlayerInfo()
  {
    if (this.id === 'new')
    {
      this.newPlayer = true;
    }
    else
    {

        // http request that fetches the player using the ID
      this.player.first_name = 'Tyson';


    }

  }

}
