import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
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
  formForgotEmail: string = '';
  @ViewChild('forgotForm') forgotForm!: NgForm;
  @ViewChild('forgotFormModal') forgotFormModal?: ModalDirective;

  constructor(private _router: Router,
    private _authService: AuthService, private _loaderService: LoaderService) {
    if (localStorage.getItem('email')) {
      this.registeredUser.email = localStorage.getItem('email')!;
      this.rememberUser = true;
    }
  }

  async onSubmitLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.checkItemLs();
    this._loaderService.loaderOn();

    const user = await this._authService.login(this.registeredUser);
    if (user) {
      localStorage.setItem('email', this.registeredUser.email);
      // guard redirige si usuario no es admin
      setTimeout(() => {
        this._router.navigateByUrl('/cliente');
      }, 200);
      this._loaderService.loaderOff();
    }
  }

  showModalForgot() {
    this.forgotFormModal?.show();
  }

  onSubmitForgotForm(form: NgForm) {
    if (form.invalid) { return; }
    else {
      this.sendReset(this.formForgotEmail);
      form.resetForm();
    }
  }

  sendReset(email: string) {
    this._loaderService.loaderOn();
    this._authService.sendPasswordResetEmail(email).finally(() => {
      this._loaderService.loaderOff();
      this.forgotFormModal?.hide();
    });
  }

  checkItemLs() {
    if (localStorage.getItem('userData') != null) {
      localStorage.removeItem('userData');
    }
  }
}
