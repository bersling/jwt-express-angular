import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { environment } from '../environments/environment';

@Injectable()
export class AuthService {

  loggedIn = new BehaviorSubject<boolean>(false);
  token;

  buildHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (this.token) {
      headersConfig['Authorization'] = `Token ${this.token}`;
    }
    return new HttpHeaders(headersConfig);
  }


  login(email: string, password: string) {
    this.http.post(environment.apiUrl + '/login', {
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
