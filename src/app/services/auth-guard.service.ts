import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from  'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate {
  destination: any;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isLogged) {
      this.destination = route.url;
      this.router.navigate(["usuario/ingresar"]);
      return false;
    }
    return true;
  }
  isActive(): boolean {
    if (!this.auth.isLogged) {
      this.router.navigate(["usuario/ingresar"]);
      return false;
    }
    return true;
  }
}
