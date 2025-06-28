import { OKR } from './okr.model';
import { User } from './user.model';

export interface Team {
  id: number;
  name: string;
  users: User[];
  okrs: OKR[];  
}
