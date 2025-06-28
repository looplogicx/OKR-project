import { Department } from "./department.model";

export interface Organization {
    id: number;
    name: string;
    departments: Department[];
  }
  