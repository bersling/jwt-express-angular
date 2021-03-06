import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {

  api = 'http://localhost:5000/api';
  loggedIn = new BehaviorSubject<boolean>(false);
  token;

  login(email: string, password: string) {
    this.http.post(this.api + '/login', {
      email: email,
      password: password
    }).subscribe((resp: any) => {
      this.loggedIn.next(true);
      this.token = resp.token;
      console.log(this.token);
      this.toastr.success(resp && resp.user && resp.user.name ? `Welcome ${resp.user.name}` : 'Logged in!');
    }, (errorResp) => {
      this.loggedIn.next(undefined);
      errorResp.error ? this.toastr.error(errorResp.error.errorMessage) : this.toastr.error('An unknown error has occured.');
    });
  }

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

}
