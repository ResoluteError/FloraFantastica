import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  pass : string;
  loggingIn : boolean = false;
  loggingOut : boolean = false;
  loggedIn : boolean = localStorage.getItem("auth") != null;

  constructor(
    private alertService : AlertService,
    private authService : AuthService
  ) { }

  ngOnInit() {

  }

  login(){

    if(this.pass){
      this.loggingIn = true;
      this.authService.login(this.pass).subscribe( result => {
        if(result){
          this.alertService.success("Login Successfull!", "You may now use the full functionality.");
          this.loggedIn = true;
        } else {
          this.alertService.warning("Login Failed!", "The password was incorrect, please try again.");
          this.pass = "";
        }
        this.loggingIn = false;
      }, err => {
        if(err.status === 401){
          this.alertService.warning("Login Failed!", "The password was incorrect, please try again.");
          this.pass = "";
        } else {
          this.alertService.warning("Auth API Failed!", "Something went wrong, please try again in a moment.");
        }
        this.loggingIn = false;
      });
    } else {
      this.alertService.warning("Empty Password!", "Please enter a password to proceed.");
    }

  }

  logout(){

    this.authService.logout().subscribe( result => {
      this.loggingOut = true;
      if(result){
        this.alertService.success("Logged out!", "You are now visiting as a guest.");
        this.loggedIn = false;
        this.loggingOut = false;
      }
    }, err => {
      this.alertService.warning("Auth API Error", "Failed logging out, please try again");
      this.loggingOut = false;
    })

  }

}
