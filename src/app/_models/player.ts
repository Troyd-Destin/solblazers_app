export class  Player {
  first_name: string; //required
  last_name: string; //required
  lacrosse_id: string; //required
  birthdate: Date;  //required
  high_school_grad_year: number;
  jersey_number: number;
  current_school: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  diff_address: boolean = false;
  primary_insured: string;
  health_insurance_company: string;
  medical_needs: Text;

}
