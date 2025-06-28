import { Component, inject } from '@angular/core';
import { DataService } from '../services/data.service';
import { Organization } from '../models/organization.model';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OKR } from '../models/okr.model';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../services/auth.service.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [NgFor, NgIf,FormsModule, RouterModule, LoginComponent],
})
export class DashboardComponent {
  org: Organization = inject(DataService).getOrganization();
  selectedProgress: number = 0;
  newOKR: string[][] = []; // an array for [deptIndex][teamIndex] — double dimension
  descOpen: boolean[][][] = [];
  editDesc: string[][][] = [];
  selectedUserFilter: String | null = null; // null = show all
  searchText: string = '';
  searchKeyword: string = '';
  sortByProgress: boolean = false;
  newMemberName: { [key: string]: string } = {};
  newMemberRole: { [key: string]: string } = {};
  currentUser = this.authService.getCurrentUser();
  

  constructor(private dataService: DataService, private authService: AuthService, private router: Router) {
     this.currentUser = this.authService.getCurrentUser();

  // 👮‍♀️ Redirect if not logged in
  if (!this.currentUser) {
    this.router.navigate(['/login']); 
    return;
  }
    this.org.departments.forEach((dept, d) => {
      this.newOKR[d] = [];
      this.descOpen[d] = [];
      this.editDesc[d] = [];
    
      dept.teams.forEach((team, t) => {
        this.newOKR[d][t] = '';
        this.descOpen[d][t] = [];
        this.editDesc[d][t] = [];
        this.newOKRData[`${d}-${t}`] = { title: '', dueDate: '' }; //  Safe initialization
    
        team.okrs.forEach((okr, o) => {
          this.descOpen[d][t][o] = false;
          this.editDesc[d][t][o] = okr.description;
        });
      });
    });
    
  }
  newOKRData: { [key: string]: { title: string; dueDate: string } } = {};

  addOKR(deptIndex: number, teamIndex: number) {
    
    const key = `${deptIndex}-${teamIndex}`;
    const data = this.newOKRData[key];
    if (!data?.title?.trim()) return;
  
  
    const newOKR = {
      id: Date.now(),
      title: data.title,
      progress: 0,
      description: '',
      assignedTo: null,
      dueDate: data.dueDate || '', // number | null
    };
  
    this.dataService.addOKR(deptIndex, teamIndex, newOKR);
    this.newOKRData[key] = { title: '', dueDate: '' }; 
    this.newOKR[deptIndex][teamIndex] = '';
  }
  
  updateProgress(deptIndex: number, teamIndex: number, okrIndex: number, progress: number) {
    this.dataService.updateOKRProgress(deptIndex, teamIndex, okrIndex, progress);
  }

  deleteOKR(deptIndex: number, teamIndex: number, okrIndex: number) {
    this.dataService.deleteOKR(deptIndex, teamIndex, okrIndex);
  }
 
  updateAssigned(deptIndex: number, teamIndex: number, okrIndex: number, assignedTo: number | null) {
    if (assignedTo !== null) {
      this.org.departments[deptIndex].teams[teamIndex].okrs[okrIndex].assignedTo = assignedTo;
    }
  }
  
  getUserNameById(d: number, t: number, userId: number): string {
    const users = this.org.departments[d].teams[t].users;
    return users.find(user => user.id === userId)?.name || 'Unassigned';
  }
  
  
  toggleDesc(d: number, t: number, o: number) {
    this.descOpen[d][t][o] = !this.descOpen[d][t][o];
  }
  
  saveDesc(d: number, t: number, o: number) {
    this.dataService.updateOKRDescription(d, t, o, this.editDesc[d][t][o]);
    this.descOpen[d][t][o] = false;
  }
  
  
  getFilteredOKRs(team: { okrs: OKR[] }): OKR[] {

    let okrs: OKR[] = team.okrs;
  
    // 🎯 Filter by assigned user
    if (this.selectedUserFilter !== null) {
      okrs = okrs.filter((o: OKR) => o.assignedTo === this.selectedUserFilter);
    }
  
    // 🔍 Search by title
    if (this.searchText.trim()) {
      const keyword = this.searchText.toLowerCase();
      okrs = okrs.filter((o: OKR) => o.title.toLowerCase().includes(keyword));
    }
  
    // 📊 Sort by progress
    if (this.sortByProgress) {
      okrs = okrs.slice().sort((a: OKR, b: OKR) => b.progress - a.progress);
    }
  
    return okrs;
  }
  
  getTeamProgress(d: number, t: number): number {
    const okrs = this.org.departments[d].teams[t].okrs;
    if (okrs.length === 0) return 0;
    const total = okrs.reduce((sum, okr) => sum + okr.progress, 0);
    return Math.round(total / okrs.length);
  }
  
  addMember(deptIndex: number, teamIndex: number) {
    const key = `${deptIndex}-${teamIndex}`;
    const name = this.newMemberName[key]?.trim();
    const role = this.newMemberRole[key]?.trim() || 'Member';
  
    if (!name) return;
  
    const newId = this.org.departments[deptIndex].teams[teamIndex].users.length;
  
    this.org.departments[deptIndex].teams[teamIndex].users.push({
      id: newId,
      name,
      role: role === 'Admin' ? 'Admin' : 'Member', 
      email: ''
    });
  
    this.newMemberName[key] = '';
    this.newMemberRole[key] = '';
  }
  
  
  removeMember(deptIndex: number, teamIndex: number, userIndex: number) {
    this.org.departments[deptIndex].teams[teamIndex].users.splice(userIndex, 1);
  }
  
  logout() {
  this.authService.logout();
  this.router.navigate(['/login']); // Take them back to login
}


}
