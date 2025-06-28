import { Injectable } from '@angular/core';
import { Organization } from '../models/organization.model';
import { Department } from '../models/department.model';
import { Team } from '../models/team.model';
import { User } from '../models/user.model';
import { OKR } from '../models/okr.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private organization: Organization = {
    id: 1, // ✅
    name: 'ABEX Corp',
    departments: [
      {
        id: 1, // ✅
        name: 'Engineering',
        teams: [
          {
            id: 1, // ✅
            name: 'Frontend Team',
            users: [
              {
                name: 'Sophia', role: 'Admin',
                id: 1,
                email: ''
              },
              {
                name: 'Devon', role: 'Member',
                id: 2,
                email: ''
              },
            ],
            okrs: [
              {
                title: 'Build Login UI', progress: 100,
                id: 1,
                description: '',
                assignedTo: 1,
                dueDate:''
              },
              {
                title: 'Setup Routing', progress: 75,
                id: 2,
                description: '',
                assignedTo: 2,
                dueDate:''
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: 'Marketing',
        teams: [
          {
            id: 2,
            name: 'SEO Team',
            users: [{
              name: 'Ella', role: 'Member',
              id: 3,
              email: ''
            }],
            okrs: [{
              title: 'Boost Page Visibility', progress: 50,
              id: 3,
              description: '',
              assignedTo: 3,
              dueDate:'',
            }],
          },
        ],
      },
    ],
  };
  
  getOrganization(): Organization {
    return this.organization;
  }

  addOKR(deptIndex: number, teamIndex: number, newOKR: OKR) {
    this.organization.departments[deptIndex].teams[teamIndex].okrs.push(newOKR);
  }

  updateOKRProgress(deptIndex: number, teamIndex: number, okrIndex: number, newProgress: number) {
    this.organization.departments[deptIndex].teams[teamIndex].okrs[okrIndex].progress = newProgress;
  }

  deleteOKR(deptIndex: number, teamIndex: number, okrIndex: number) {
    this.organization.departments[deptIndex].teams[teamIndex].okrs.splice(okrIndex, 1);
  }
  assignOKRToUser(deptIndex: number, teamIndex: number, okrIndex: number, assignedTo: number) {
    this.organization.departments[deptIndex]
      .teams[teamIndex]
      .okrs[okrIndex]
      .assignedTo = assignedTo;
  }
  // In src/app/services/data.service.ts
updateOKRDescription(
  deptIndex: number,
  teamIndex: number,
  okrIndex: number,
  description: string
) {
  this.organization.departments[deptIndex]
    .teams[teamIndex]
    .okrs[okrIndex]
    .description = description;
}

}