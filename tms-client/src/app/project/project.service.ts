import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AddProjectDTO, AddProjectResponse } from './project';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private http: HttpClient) {}

  addProject(project: AddProjectDTO) {
    return this.http.post<AddProjectResponse>(`${environment.apiBaseUrl}/api/projects`, project);
  }
}
