import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NewUser } from 'src/app/models/new-user.model';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

import regionesData from  'src/assets/rsc/comunas-regiones.json';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user: NewUser = new NewUser();
  rememberNewUser: boolean = false;
  regions: any[] = regionesData.regiones;
  communes: string[] = [];

  constructor(private _router: Router, 
    private _authService: AuthService,
    private _loader: LoaderService,
    private _toastr: ToastrService) {

  }

  async onSubmitSignUp(form: NgForm) {
    console.log(form);
    if (form.invalid) { return; }
    this._loader.loaderOn();
    const user = await this._authService.signUp(this.user);

    if (user) {
      if (this.rememberNewUser) {
        localStorage.setItem('email', this.user.email)
      }
      this._authService.uploadAditionalUserInfo(this.user);
      this._toastr.success('Por favor inicia sesión', '¡Registro exitoso!')
      this._router.navigateByUrl('/ingresa');
    }
    this._loader.loaderOff();
  }
  onChangeRegion(event: any) {
    const regionName = event.target.value;
    console.log(regionName)
    const region = this.regions.find(region => region.region === regionName);
    this.communes = region ? [...region.comunas] : [];
  }
}
