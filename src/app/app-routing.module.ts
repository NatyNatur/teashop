import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'inicio',
    title: 'naturtea',
    component: HomeComponent
  },
  {
    path: 'bienvenido',
    title: 'Bienvenido a naturtea',
    component: WelcomeComponent
  },
  {
    path: 'registro',
    title: 'Regístrate',
    component: SignupComponent
  },
  {
    path: 'ingresa',
    title: 'Ingresa',
    component: LoginComponent
  },
  {
    path: 'no-encontrado',
    title: 'Ups',
    component: NotFoundComponent
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'inicio',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
