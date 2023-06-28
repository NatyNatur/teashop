import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageFunctionsService } from 'src/app/local-storage-functions.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

import regionesData from  'src/assets/rsc/comunas-regiones.json';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.css']
})
export class UserInformationComponent implements OnInit {
  regions: any[] = regionesData.regiones;
  communes: string[] = [];
  //userData: NewUser = new NewUser();
  userData: any;
  @ViewChild('editUserDataModal') editUserDataModal?: ModalDirective;
  isDone: boolean = false;

  userProfile!: FormGroup;
  constructor(private auth: AuthService, 
    private _formBuilder: FormBuilder, 
    private _toastr: ToastrService, 
    private _loader: LoaderService,
    private _ls: LocalStorageFunctionsService) { 

      this.createUserDataForm();
    }

  ngOnInit(): void {
  this.loadUserData()
  }

  private async loadUserData(): Promise<void> {
    const item = await this._ls.waitForItemInLocalStorage('userData');
    //const userDataString = localStorage.getItem('userData');
    if (item) {
      this.userData = JSON.parse(item);
      this.isDone = true;
      this._loader.loaderOff();
    }
  }



  createUserDataForm() {
    this.userProfile = this._formBuilder.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      nombre: [{ value: '' }, [Validators.required, Validators.minLength(3)]],
      apellido: [{ value: '' }, [Validators.required, Validators.minLength(3)]],
      region: [{ value: '' }, [Validators.required, Validators.minLength(3)]],
      comuna: [{ value: '' }, [Validators.required, Validators.minLength(3)]],
      direccion: [{ value: '' }, [Validators.required, Validators.minLength(6)]],
      tipoUsuario: [{ value: '', disabled: true }, [Validators.required]],
      telefono: [{ value: 0 }, [Validators.required, Validators.minLength(3), Validators.pattern("[0-9 ]{9}")]]
    })
  }

  openEditUserModal() {
    this.fillUserDataForm();
    setTimeout(() => {
      this.editUserDataModal!.show()
    }, 200);
  }

  fillUserDataForm() {
    this.userProfile.patchValue({
      email: this.userData.email,
      nombre: this.userData.nombre,
      apellido: this.userData.apellido,
      comuna: this.userData.comuna,
      region: this.userData.region,
      direccion: this.userData.direccion,
      tipoUsuario: this.userData.tipoUsuario,
      telefono: this.userData.telefono
    })
    this.setCommune(this.userData.region)
  }

  get name() {
    return this.userProfile?.get('nombre');
  }

  get lastname() {
    return this.userProfile?.get('apellido');
  }


  get address() {
    return this.userProfile?.get('direccion');
  }

  get commune() {
    return this.userProfile?.get('comuna');
  }

  get region() {
    return this.userProfile?.get('region');
  }

  get phone() {
    return this.userProfile?.get('telefono');
  }

  async onSubmitEditUserData() {
    if (!this.userProfile.valid) {
      this._toastr.error('Recuerda completar todos los campos.', 'Información no actualizada');
      return;
    }
    else {
      this._loader.loaderOn();
      this.auth.updateUserData(this.userProfile.getRawValue()).finally(()=>{
        this.auth.getUserProfile().subscribe((res)=> {
          this.userData = res;
          localStorage.setItem('userData', JSON.stringify(res));
          this.auth.loadUserProfile();
          });
          this.editUserDataModal?.hide();
          this._loader.loaderOff();
      })
    }
  }

  onChangeRegion(event: any) {
    const regionName = event.target.value;
    const region = this.regions.find(region => region.region === regionName);
    this.communes = region ? [...region.comunas] : [];
  }

  setCommune(userRegion: string) {
    const regionName = userRegion;
    const region = this.regions.find(region => region.region === regionName);
    this.communes = region ? [...region.comunas] : [];
  }
}
