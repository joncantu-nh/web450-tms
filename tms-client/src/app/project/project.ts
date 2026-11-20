export interface Project {
  _id: string;
  projectId: number;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  dateCreated: string;
  dateModified: string;
}

export type AddProjectDTO = Omit<Project, '_id' | 'projectId' | 'dateCreated' | 'dateModified'>;

export interface AddProjectResponse {
  message: string;
  projectId: number;
}
