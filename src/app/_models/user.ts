﻿export class User {
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
    first_name: string;
    last_name: string;
    street_address_1: string;
    zip: string;
    phone_number: string;
    city: string;
    token: string;
    }
  filter ;
  roles:[];
}
