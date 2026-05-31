import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Signup } from './signup/signup';
import { Login } from './login/login';

export const routes: Routes = [
  {path: "signup", component: Signup},
  {path: "login", component: Login}
];
