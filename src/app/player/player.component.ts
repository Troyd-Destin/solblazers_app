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
              private http: HttpClient,
              private account: AccountService ) { }

  id;
  player: Player = new Player;
  newPlayer = false;
  form: FormGroup;
  matcher = new MyErrorStateMatcher();

  USStates = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];


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

  register_player()
  {

    //check for address difference
    if(!this.player.diff_address)
    {
        console.log('test');
        //set fields = to account address. 
        let user = this.account.userValue;        
        this.player.zip = user.data.zip;
        this.player.city = user.data.city;
        this.player.state = user.data.state;
        this.player.street_address = user.data.street_address_1;
    }

    //check for required fields
    const requiredFields = ['first_name', 'last_name', 'birthdate','lacrosse_id','high_school_grad_year','current_school','state','zip','city','street_address','primary_insured','health_insurance_company','medical_needs'];

    //loop through properties, and make sure they have a value, or else throw error



    //this.account.addPlayer(this.player).subscribe((r)=>{ });

    console.log(this.player);

  }


  update_player()
  {


  }

}
