import { Injectable } from '@angular/core';

const AUTH_KEY = 'poissy_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = false;

  constructor() {
    this.loggedIn = !!localStorage.getItem(AUTH_KEY);
  }

  login(username: string, password: string): boolean {
    if (username === 'poissy' && password === 'poissy2024') {
      this.loggedIn = true;
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    this.loggedIn = false;
    localStorage.removeItem(AUTH_KEY);
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
