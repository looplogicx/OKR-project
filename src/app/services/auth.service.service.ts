// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';

interface User {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Member' | 'TeamLead';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private users: User[] = [];
  private currentUser: User | null = null;

  register(user: User): boolean {
    const exists = this.users.find(u => u.email === user.email);
    if (exists) return false;
    this.users.push(user);
    return true;
  }
  login(email: string, password: string, role: User['role']): boolean {
  const found = this.users.find(u => u.email === email && u.password === password && u.role === role);
  if (found) {
    this.currentUser = found;
    localStorage.setItem('loggedInUser', JSON.stringify(found)); // Save user session
    return true;
  }
  return false;
}

getCurrentUser(): User | null {
  if (this.currentUser) return this.currentUser;

  const stored = localStorage.getItem('loggedInUser');
  if (stored) {
    this.currentUser = JSON.parse(stored);
    return this.currentUser;
  }

  return null;
}

logout() {
  this.currentUser = null;
  localStorage.removeItem('loggedInUser'); // End session
}

}
