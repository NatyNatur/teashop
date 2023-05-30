import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NewUser } from 'src/app/models/new-user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user: NewUser = new NewUser();
  rememberNewUser: boolean = false;

  constructor(private _router: Router, private _authService: AuthService,) {

  }

  async onSubmitSignUp(form: NgForm) {
    if (form.invalid) { return; }
    // agregar loader

    const user = await this._authService.signUp(this.user);
    // quitar loader

    if (user) {
      localStorage.setItem('email', this.user.email)
      this._authService.uploadAditionalUserInfo(this.user);
      this._router.navigateByUrl('/bienvenido');
    }
  }
}
