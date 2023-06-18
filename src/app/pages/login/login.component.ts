import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisteredUser } from 'src/app/models/registered-user.model';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  registeredUser: RegisteredUser = new RegisteredUser();
  rememberUser: boolean = false;

  constructor(private _router: Router, 
    private _authService: AuthService, private _loaderService: LoaderService) {
      if (localStorage.getItem('email')) {
        this.registeredUser.email = localStorage.getItem('email')!;
        this.rememberUser = true;
      }
  }

  async onSubmitLogin(form: NgForm) {
    if (form.invalid) { return; }
    this._loaderService.loaderOn();
    const user = await this._authService.login(this.registeredUser);
    if (user) {
      localStorage.setItem('email', this.registeredUser.email);
      // guard redirige si usuario no es admin
      this._router.navigateByUrl('/cliente');
    }
    this._loaderService.loaderOff();
  }
}
