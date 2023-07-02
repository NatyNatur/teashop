import { Injectable } from '@angular/core';
import { Auth, User, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { docData, doc, Firestore, setDoc, updateDoc, deleteDoc, getDoc, } from '@angular/fire/firestore';

import { RegisteredUser } from '../models/registered-user.model';
import { NewUser } from '../models/new-user.model';

import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User | null | undefined;
  userCredentials: UserCredential | undefined;
  userToken: string = '';
  roleAs: string = '';
  userData: any;

  constructor(private _auth: Auth, private _firestore: Firestore, private _toastr: ToastrService) {
    this.readToken();
  }


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rolInterno');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userData');
    localStorage.removeItem('userId');
    return signOut(this._auth);
  }
  // Ingresar
  async login(userModel: RegisteredUser) {
    try {
      const user = await signInWithEmailAndPassword(this._auth, userModel.email, userModel.password);
      let token = await this._auth.currentUser?.getIdToken(false);
      this.userCredentials = user;
      const isAdmin = await this.checkIfIsAdmin(user);
      localStorage.setItem('userId', this.userCredentials.user.uid);
      if (isAdmin) {
        localStorage.setItem('rolInterno', 'admin');
      }
      else {
        localStorage.setItem('rolInterno', 'cliente');

      }
      this.getUserProfile().subscribe((res) => {
        localStorage.setItem('userData', JSON.stringify(res));
        this.userData = res;
      })
      this.saveToken(token!);
      return user;
    } catch (error: any) {
      //this.toastService.showToast(this.firebaseErrors(error.code), 'danger');
      this._toastr.error(this.firebaseErrors(error.code), 'Error')
      return null;
    }
  }


  // Registrar
  async signUp(newUser: NewUser) {
    try {
      const user = await createUserWithEmailAndPassword(this._auth, newUser.email, newUser.password);
      let token = await this._auth.currentUser?.getIdToken(false)
      localStorage.setItem('rolInterno', 'cliente');
      this.saveToken(token!);
      return user;
    } catch (error: any) {
      //this.toastService.showToast(this.firebaseErrors(error.code), 'danger');
      this._toastr.error(this.firebaseErrors(error.code), 'Error')
      return null;
    }
  }
  // Insertar la información del usuario en DB
  async uploadAditionalUserInfo(newUser: NewUser) {
    const user = this._auth.currentUser;
    const userDocRef = doc(this._firestore, `usuarios/${user?.uid}`);
    try {
      await setDoc(userDocRef, {
        nombre: newUser['nombre'],
        apellido: newUser['apellido'],
        email: newUser['email'],
        direccion: newUser['direccion'],
        comuna: newUser['comuna'],
        region: newUser['region'],
        tipoUsuario: newUser['tipoUsuario']
      })
      return true;
    }
    catch (error) {
      console.log(error);
      return false;
    }
  }

  async updateUserData(userForm: NewUser) {
    try {
      const user = this._auth.currentUser;
      const userDocRef = doc(this._firestore, `usuarios/${user?.uid}`);
      await updateDoc(userDocRef, {
        nombre: userForm['nombre'],
        apellido: userForm['apellido'],
        email: userForm['email'],
        direccion: userForm['direccion'],
        comuna: userForm['comuna'],
        region: userForm['region'],
        tipoUsuario: userForm['tipoUsuario'],
        telefono: userForm['telefono']
      });
      this._toastr.success('Información actualizada correctamente', 'Listo');
      return true;
    }
    catch (error) {
      console.log(error);
      this._toastr.error('Hubo un error, Información no actualizada', 'Error')
      return false;
    }
  }

  async updatePhone(userForm: NewUser) {
    try {
      const user = this._auth.currentUser;
      const userDocRef = doc(this._firestore, `usuarios/${user?.uid}`);
      await updateDoc(userDocRef, {
        telefono: userForm['telefono']
      });
      this._toastr.success('Teléfono actualizado correctamente', 'Listo');
      return true;
    } catch (error) {
      console.log(error);
      this._toastr.error('Hubo un error, Teléfono no actualizado', 'Error');
      return false;
    }
  }

  // Recuperar información del usuario autenticado
  getUserProfile() {
    const user = this._auth.currentUser;
    const userDocRef = doc(this._firestore, `usuarios/${user?.uid}`);
    return docData(userDocRef);
  }

  loadUserProfile() {
    this.userData = JSON.parse(localStorage.getItem('userData') as any) || [];
  }

  saveUserProfile() {
    localStorage.setItem('userData', JSON.stringify(this.userData));
  }

  getUserData() {
    return this.userData;
  }

  // Ingresar como admin
  async loginAdmin(userModel: RegisteredUser) {
    try {
      const user = await signInWithEmailAndPassword(this._auth, userModel.email, userModel.password);
      let token = await this._auth.currentUser?.getIdToken(false);
      const isAdmin = await this.checkIfIsAdmin(user);
      if (isAdmin) {
        localStorage.setItem('rolInterno', 'admin');
        this.saveToken(token!);
      }
      else {
        //this.toastService.showToast('No figuras como administrador. Si es un error, contáctate con Soporte.', 'danger');
        this._toastr.error('No figuras como administrador. Si es un error, contáctate con Soporte.', 'Error')

      }
      this.userCredentials = user;
      return user && isAdmin;
    } catch (error: any) {
      this._toastr.error(this.firebaseErrors(error.code), 'Error')
      return null;
    }
  }

  async checkIfIsAdmin(user: UserCredential) {
    const docRef = doc(this._firestore, "admin", user.user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //console.log("Document data:", docSnap.data());
      return true
    } else {
      // docSnap.data() will be undefined in this case
      //console.log("No such document!");
      return false
    }
  }

  getRole() {
    this.roleAs = localStorage.getItem('rolInterno')!;
    return this.roleAs;
  }

  firebaseErrors(code: string) {
    console.log(code);
    switch (code) {
      case 'auth/email-already-in-use':
        return 'El usuario ya existe.';
      case 'auth/weak-password':
        return 'Contraseña poco segura.'
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.'
      case 'auth/user-not-found':
        return 'Usuario no registrado.'
      case 'auth/too-many-requests':
        return 'Demasiados intentos.'
      case 'permission-denied':
        return 'Permiso denegado. Póngase en contacto con Soporte.'
      default:
        return 'Error desconocido';
    }
  }

  private saveToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let today = new Date();
    today.setSeconds(3600);

    localStorage.setItem('expiration', today.getTime().toString())
  }

  readToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token') || '';
    }
    else {
      this.userToken = '';
    }
    return this.userToken;
  }

  isAuthenticated(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }
    // obtengo fecha de expiración del token
    const expiration = parseInt(localStorage.getItem('expiration')!) || 0;
    const expirationDate = new Date();
    expirationDate.setTime(expiration);

    if (expirationDate > new Date()) {
      return true;
    } else {
      this.logout();
      return false;
    }
  }

  getUser() {
    const user = this._auth.currentUser;
    //console.log(user);
    return user;
  }


}
