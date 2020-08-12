
import { Player } from '@app/_models';

export class User {
  ID;
  allcaps: {
    read: boolean;
    customer: boolean;
  };
  caps:{
    customer:boolean;
  };
    data:{
    id: string;
    display_name: string;
    username: string;
    email: string;
    user_email: string;
    first_name: string;
    last_name: string;
    street_address_1: string;
    zip: string;
    phone_number: string;
    state: string;
    city: string;
    token: string;
    players: Player[];
    player_events: string[];
    }

  filter ;
  roles:[];
}
