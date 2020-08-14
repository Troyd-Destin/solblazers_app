import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ErrorStateMatcher} from '@angular/material/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountService, AlertService, } from '@app/_services';
import { EventsService } from '@app/_services/events.service';

import { environment } from '@environments/environment';

import { Player, User } from '@app/_models';

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


  id;
  player: Player = new Player;
  newPlayer = false;
  form: FormGroup;
  matcher = new MyErrorStateMatcher();
  loadingIcon = false;
  user: User;
  events;
  hideEventTable = false;
  eventRegisterLoadingCircle = false;
  USStates = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];


  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private http: HttpClient,
              private account: AccountService,
              private eventsService: EventsService ) {


                this.eventsService.fetchEvents().subscribe();
         this.eventsService.events.subscribe(x => this.events = x);
               }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.fetchPlayerInfo();
    });

    this.user = this.account.userValue;
    console.log(this.user);

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
        //this.player.first_name = 'Tyson';

        //check if in user array user

        this.user = this.account.userValue;
        const filteredPlayers = this.user.data.players.filter((el)=>{
          return this.id == el.id;
        })

        if(!filteredPlayers[0])
        {
        //if not in user object, fetch from database.
        this.http.get(`${environment.apiUrl}wp-json/jwt-auth/v1/player/${this.id}`).subscribe((r:Player)=>{
          this.player = r;
          if(typeof this.player.diff_address !== 'boolean' && this.player.diff_address === "0" ){ this.player.diff_address = false; }
        });
        }
        else{

            this.player = filteredPlayers[0];
            if(typeof this.player.diff_address !== 'boolean' && this.player.diff_address === "0" ){ this.player.diff_address = false; }
        }


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


    this.loadingIcon = true;
    this.account.addPlayer(this.player).subscribe((r:any)=>{
        console.log(r);
        this.account.addPlayerToPlayerArray(r);
        this.newPlayer = false;
        this.loadingIcon = false;

        //update url

        this.alertService.success('Player registration successful. ', { keepAfterRouteChange: false });


    },
    (e)=>{ console.log(e);     this.loadingIcon = false;
      this.alertService.error('Something went wrong, contact us.', { keepAfterRouteChange: false });});



  }

  checkIfPlayerRegisteredInEvent(player_id, event_id)
  {
    const check = this.user.data.player_events.filter((r:any)=>{
        return player_id === r.player_id && event_id === r.event_id;

    })
   // console.log('registration_check',check);
    if(check[0]){ return true; }

    return false;



  }

  registerPlayerInEvent(event)
  {

    //post request to register
    this.eventRegisterLoadingCircle = true;
    this.hideEventTable = true;
    this.http.post(`${environment.apiUrl}wp-json/jwt-auth/v1/player/event`,
    {"event_thing": {"player_id":this.player.id, "user_id": this.user.ID, "event_id": event.id}})
    .subscribe((r:any)=>{

      this.account.addPlayerEvent(r);
      this.eventRegisterLoadingCircle = false;
      this.hideEventTable = false;
      this.alertService.success('Player registration successful for '+event.name+'. An email was sent to '+this.user.data.user_email, { keepAfterRouteChange: false });

    });

    //add to user to thing and update

  }

  update_player()
  {


  }

}
