import { Component, OnInit } from '@angular/core';
//import { FormControl, FormGroup } from '@angular/forms';
import { FormBuilder , FormGroup, Validators,FormArray} from '@angular/forms';
import { passwordValidator } from './shared/password.validator';
import { forbiddenNameValidator } from './shared/user-name.validator';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  registrationForm!: FormGroup; 

  get userName(){
    return this.registrationForm.get('userName');
  }

  get email(){
    return this.registrationForm.get('email');
  }
  get alternateEmails(){
    return this.registrationForm.get('alternateEmails') as FormArray;
  }
  addAlternateEmails(){
    this.alternateEmails.push(this.fb.control(''));
  }

  constructor(private fb : FormBuilder, private _registrationService:RegistrationService){}
  

ngOnInit(){
  this.registrationForm = this.fb.group({
    userName : ['',[Validators.required,Validators.minLength(5),forbiddenNameValidator(/password/)]], //[Validators.required] is necessary if multiple validation is required
    email : [''],
    subscribe : [true],
    password : [''],
   confirmPassword : [''],
   address:this.fb.group({
    city:[''],
    state:[''],
    postalCode:['']
   }), 
   alternateEmails: this.fb.array([])
  }, 
  {validator:passwordValidator});

  this.registrationForm.get('subscribe')?.valueChanges
  .subscribe(checkedValue => {
    const email = this.registrationForm.get('email');
    if(checkedValue){
      email?.setValidators(Validators.required);
    }else{
      email?.clearValidators();
    }
    email?.updateValueAndValidity();
  });
}
  

//  registrationForm = new FormGroup({  // define a form model  and form group class is represent a entire form
//   userName :new FormControl(''),  //FormControl class is for individual form element(access value, validation)
//   password :new FormControl(''),
//   confirmPassword :new FormControl(''),
//   address :new FormGroup({
//     city :new FormControl(''),  
//   state :new FormControl(''),
//   postalCode :new FormControl('')

//   })
//  });
 loadApiData(){
  this.registrationForm.patchValue({ //setValue is strict means a all key(name,address..) is must required & patchValue is  a all key(name,address..) is not  must required (address key is remove then it will work ) 
    userName: 'Ruchita',  
    password: 'abc',
    confirmPassword:'abc',
    address: {
      city : 'City',
      state : 'State',
      postalCode : '123456'

    }
  });

 }
 onSubmit(){
  console.log(this.registrationForm.value);
  this._registrationService.register(this.registrationForm.value)
  .subscribe(
    (    response: any) => console.log('success!',response),
    (    error: any) => console.log('error!',error)

    

  )
   



  
 }
 
}
