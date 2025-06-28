import { Team } from './team.model';

export interface Department {
  id: number;
  name: string;
  teams: Team[];
}
