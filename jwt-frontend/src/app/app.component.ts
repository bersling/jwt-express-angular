import { Component } from '@angular/core';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  email = '';
  password = '';
  loggedIn;

  constructor(
    private authService: AuthService
  ) {
    this.authService.loggedIn.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    });
  }

  doLogin() {
    this.authService.login(this.email, this.password)
  }
}
