import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ProjectAddComponent } from './project-add.component';

describe('ProjectAddComponent', () => {
  let component: ProjectAddComponent;
  let http: HttpTestingController;
  const url = `${environment.apiBaseUrl}/api/projects`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectAddComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });
    component = TestBed.createComponent(ProjectAddComponent).componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('posts the project form and displays the returned project ID', () => {
    component.projectForm.setValue({
      name: 'Project Alpha', description: '', startDate: '2026-01-01', endDate: ''
    });
    component.onSubmit();
    const request = http.expectOne(url);
    expect(request.request.method).toBe('POST');
    expect(request.request.body.startDate).toBe('2026-01-01T00:00:00.000Z');
    expect(request.request.body.endDate).toBeUndefined();
    request.flush({ message: 'Project created successfully', projectId: 1000 });
    expect(component.successMessage).toContain('1000');
  });

  it('prevents submission when the end date is not after the start date', () => {
    component.projectForm.setValue({
      name: 'Project Alpha', description: '', startDate: '2026-02-01', endDate: '2026-01-01'
    });
    component.onSubmit();
    expect(component.projectForm.hasError('dateOrder')).toBeTrue();
    http.expectNone(url);
  });

  it('displays a server error and preserves the form for retry', () => {
    component.projectForm.setValue({
      name: 'Project Alpha', description: '', startDate: '2026-01-01', endDate: ''
    });
    component.onSubmit();

    http.expectOne(url).flush(
      { message: 'Unable to create the project.' },
      { status: 500, statusText: 'Internal Server Error' }
    );

    expect(component.errorMessage).toBe('Unable to create the project.');
    expect(component.successMessage).toBe('');
    expect(component.projectForm.controls.name.value).toBe('Project Alpha');
    expect(component.saving).toBeFalse();
  });
});
