export interface OKR {
    id: number;
    title: string;
    description: string;
    progress: number; // 0–100%
    assignedTo: number|null; // user ID
    dueDate: string;
  }
  