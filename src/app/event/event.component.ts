import { Component, OnInit } from '@angular/core';
import { Player, User } from '@app/_models';
import { AccountService, AlertService, } from '@app/_services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventsService } from '@app/_services/events.service';
import { environment } from '@environments/environment';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.less']
})
export class EventComponent implements OnInit {

  user: User;
  event;
  events;
  eventRegisterLoadingCircle = false;
  hideEventTable = false;

  constructor(
    private account: AccountService,
    private eventsService: EventsService,
    private http: HttpClient,
    private alertService: AlertService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.user = this.account.userValue;

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      this.eventsService.fetchEvents().subscribe();
      this.eventsService.events.subscribe(x => {
        this.events = x;
        this.event = this.eventsService.fetchEvent(id);
        console.log(this.event);
      });
    });

    // fetch current event

  }


  checkIfPlayerRegisteredInEvent(player_id, event_id)
  {
    //console.log(player_id,event_id);
    const check = this.user.data.player_events.filter((r:any)=>{
        return player_id === r.player_id && event_id === r.event_id;

    })
   // console.log('registration_check',check);
    if(check[0]){ return true; }

    return false;



  }

  registerPlayerInEvent(player)
  {

    //post request to register
    if(confirm('are you sure?'))
    {
      this.eventRegisterLoadingCircle = true;
      this.hideEventTable = true;
      console.log(player);
      this.http.post(`${environment.apiUrl}wp-json/jwt-auth/v1/player/event`,
      {"event_thing": {"player_id":player.id, "user_id": this.user.ID, "event_id": this.event.id}})
      .subscribe((r:any)=>{

        this.account.addPlayerEvent(r);
        this.eventRegisterLoadingCircle = false;
        this.hideEventTable = false;
        this.alertService.success('Player registration successful for <b>'+this.event.name+'</b>. An email was sent to '+this.user.data.user_email, { keepAfterRouteChange: false });

      });
    }
    //add to user to thing and update

  }



}
