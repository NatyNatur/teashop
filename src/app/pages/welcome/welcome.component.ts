import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NewUser } from 'src/app/models/new-user.model';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  role: string = '';
  constructor(private auth: AuthService, 
    private _router: Router,
    private _loader: LoaderService) {}


  ngOnInit(): void {
    this.role = localStorage.getItem('rolInterno')!;
  }
  
  logOut() {
    this.auth.logout();
    this._loader.loaderOn();
    setTimeout(() => {
      this._router.navigate(['/']);
      this._loader.loaderOff();
    }, 200);
  }

}
