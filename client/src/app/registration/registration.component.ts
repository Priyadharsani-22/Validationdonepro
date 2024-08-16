import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  itemForm!: FormGroup;
  formModel: any = { role: null, email: '', password: '', username: '' };
  showMessage: boolean = false;
  responseMessage: any;

  constructor(public router:Router, private httpService:HttpService, private formBuilder: FormBuilder) { 
    
    this.itemForm = this.formBuilder.group({
      email: [this.formModel.email,[ Validators.required,this.emailValidator]],
      password: [this.formModel.password,[ Validators.required,this.passwordValidator]],
      role: [this.formModel.userType,[ Validators.required]],
      username: [this.formModel.username,[ Validators.required]],
  });
}

ngOnInit(): void {
}
onRegister()
{
  if(this.itemForm.valid)
  {
    this.showMessage=false;
    this.httpService.registerUser(this.itemForm.value).subscribe(data=>{    
      debugger;
      this.showMessage=true;
      this.responseMessage='Welcome '+data.name +" you are successfully registered";
      this.itemForm.reset();
      
    },error=>{ })
  }
  else{
    this.itemForm.markAllAsTouched();
  }
}
emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const email = control.value;
  const regexPattern = /^[a-z][a-z0-9._%+-]*@[a-z2-9.-]+\.[a-z]{2,4}$/;





  if (!regexPattern.test(email)) {
    return { invalidEmail: true };
  }

  return null;
}

passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.value;
  const regexPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;


  if (!regexPattern.test(password)) {
    return { invalidPassword: true };
  }

  return null;
}
}
