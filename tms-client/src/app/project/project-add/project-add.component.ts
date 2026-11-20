import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ProjectService } from '../project.service';

function validDate(control: AbstractControl) {
  const value = control.value;
  if (!value) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
    ? null : { invalidDate: true };
}

function dateOrder(control: AbstractControl) {
  const start = control.get('startDate')?.value;
  const end = control.get('endDate')?.value;
  return start && end && end <= start ? { dateOrder: true } : null;
}

@Component({
  selector: 'app-project-add',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './project-add.component.html',
  styleUrl: './project-add.component.css'
})
export class ProjectAddComponent {
  projectForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/\S/)]],
    description: [''],
    startDate: ['', [Validators.required, validDate]],
    endDate: ['', validDate]
  }, { validators: dateOrder });

  saving = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private projectService: ProjectService) {}

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';
    if (this.projectForm.invalid || this.saving) {
      this.projectForm.markAllAsTouched();
      return;
    }

    const { name, description, startDate, endDate } = this.projectForm.getRawValue();
    this.saving = true;
    this.projectService.addProject({
      name: name.trim(),
      description: description.trim() || undefined,
      startDate: new Date(startDate).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : undefined
    }).pipe(finalize(() => this.saving = false)).subscribe({
      next: (result) => {
        this.successMessage = `${result.message} (Project ID: ${result.projectId})`;
        this.projectForm.reset();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Unable to create the project. Please try again.';
      }
    });
  }
}
