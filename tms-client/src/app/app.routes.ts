import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProjectAddComponent } from './project/project-add/project-add.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  { path: 'projects/add', component: ProjectAddComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent }
];
