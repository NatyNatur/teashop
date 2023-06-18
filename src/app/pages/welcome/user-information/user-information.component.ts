import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.css']
})
export class UserInformationComponent implements OnInit {

  //userData: NewUser = new NewUser();
  userData: any;
  @ViewChild('editUserDataModal') editUserDataModal?: ModalDirective;
  isDone: boolean = false;

  userProfile!: FormGroup;
  constructor(private auth: AuthService, 
    private _formBuilder: FormBuilder, 
    private _toastr: ToastrService, 
    private _loader: LoaderService) { 

      this.createUserDataForm();
    }

  ngOnInit(): void {
  this.loadUserData()
  }

  private async loadUserData(): Promise<void> {
    const item = await this.waitForItemInLocalStorage('userData');
    //const userDataString = localStorage.getItem('userData');
    if (item) {
      this.userData = JSON.parse(item);
      this.isDone = true;
      this._loader.loaderOff();
    }
  }

  async waitForItemInLocalStorage(key: string): Promise<string> {
    return new Promise((resolve) => {
      const checkLocalStorage = () => {
        const item = localStorage.getItem(key);
        if (item) {
          resolve(item);
        } else {
          setTimeout(checkLocalStorage, 100); // Revisar nuevamente en 100 milisegundos
        }
      };
      checkLocalStorage();
    });
  }

  createUserDataForm() {
    this.userProfile = this._formBuilder.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      nombre: [{ value: '' }, [Validators.required, Validators.minLength(3)]],
      apellido: [{ value: '' }, [Validators.required, Validators.minLength(3)]],
      comuna: [{ value: '' }, [Validators.required, Validators.minLength(3)]],
      direccion: [{ value: '' }, [Validators.required, Validators.minLength(6)]],
      tipoUsuario: [{ value: '', disabled: true }, [Validators.required]]
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
      direccion: this.userData.direccion,
      tipoUsuario: this.userData.tipoUsuario
    })
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
}
