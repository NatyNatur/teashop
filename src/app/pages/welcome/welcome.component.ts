import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NewUser } from 'src/app/models/new-user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  role: string = '';
  constructor(private auth: AuthService) {}


  ngOnInit(): void {
    this.role = localStorage.getItem('rolInterno')!;
  }
  
  logOut() {
    this.auth.logout();
  }

}
