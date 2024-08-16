import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
 
 
@Component({
  selector: 'app-addcargo',
  templateUrl: './addcargo.component.html'
 
})
export class AddcargoComponent implements OnInit {
  itemForm: FormGroup;
  formModel:any={status:null};
  showError:boolean=false;
  errorMessage:any;
  cargList:any=[];
  assignModel: any={};
  driverList:any=[]
  showMessage: any;
  responseMessage: any;
  constructor(public router:Router, public httpService:HttpService, private formBuilder: FormBuilder, private authService:AuthService)
    {
      this.itemForm = this.formBuilder.group({
        content: [this.formModel.username,[ Validators.required]],
        size: [this.formModel.password,[ Validators.required,this.nonNegativeValidator]],
        status: [this.formModel.password,[ Validators.required]],
        pickupAddress: [this.formModel.pickupAddress, [Validators.required]],
        deliveryAddress: [this.formModel.deliveryAddress, [Validators.required]],
        estimatedDeliveryDate: [this.formModel.estimatedDeliveryDate, [Validators.required]],
        customerName: [this.formModel.customerName, [Validators.required]],
        senderName: [this.formModel.senderName, [Validators.required]]
       
    });
  }
  ngOnInit(): void {
   this.getCargo();
   this.getDrivers();
   this.assignModel.driverId=null;
  }
  getCargo() {
    this.cargList=[];
    this.httpService.getCargo().subscribe((data: any) => {
      this.cargList=data;
      console.log(this.cargList);
    }, error => {
      // Handle error
      this.showError = true;
      this.errorMessage = "An error occurred while logging in. Please try again later.";
      console.error('Login error:', error);
    });;
  }
  getDrivers() {
    this.driverList=[];
    this.httpService.getDrivers().subscribe((data: any) => {
      this.driverList=data;
      console.log(this.driverList);
    }, error => {
      // Handle error
      this.showError = true;
      this.errorMessage = "An error occurred while logging in. Please try again later.";
      console.error('Login error:', error);
    });;
  }
 
  onSubmit()
  {
    if(this.itemForm.valid)
    {
      if (this.itemForm.valid) {
        this.showError = false;
        this.httpService.addCargo(this.itemForm.value).subscribe((data: any) => {
          this.itemForm.reset();
          this.getCargo();
         
        }, error => {
          // Handle error
          this.showError = true;
          this.errorMessage = "An error occurred while logging in. Please try again later.";
          console.error('Login error:', error);
        });;
      } else {
        this.itemForm.markAllAsTouched();
      }
    }
    else{
      this.itemForm.markAllAsTouched();
    }
  }
  addDriver(value:any)
  {
    this.assignModel.cargoId=value.id
  }
  assignDriver()
  {
    if(this.assignModel.driverId!=null)
    {
      this.showMessage = false;
      this.httpService.assignDriver(this.assignModel.driverId,this.assignModel.cargoId).subscribe((data: any) => {
        debugger;
        this.showMessage = true;
        this.responseMessage=data.message;
        const cargo = this.cargList.find((c: { id: any; }) => c.id === this.assignModel.cargoId);
        if (cargo) {
          cargo.assigned = true;
        }
      }, error => {
        // Handle error
        this.showError = true;
        this.errorMessage = "An error occurred while logging in. Please try again later.";
        console.error('Login error:', error);
      });;
    }
  }
  nonNegativeValidator(control:AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value < 1) {
      return { 'negativeValue': true };
    }
    return null;
  }
  
 
}
 