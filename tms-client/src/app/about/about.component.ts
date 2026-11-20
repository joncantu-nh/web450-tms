import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <h2>About</h2>
    <p>The Task Management System (TMS) helps individuals and teams organize
      projects and track their tasks, priorities, and progress.</p>
    <p>We are developing TMS as a greenfield project for Bellevue University's
      WEB450 course using MongoDB, Express, Angular, and Node.js.</p>
    <p>Developed by Jonathan Cantu and Maxine Casillas.</p>
  `,
  styles: `
    :host {
      display: block;
      max-width: 42rem;
      margin: 2rem auto;
      padding: 0 1rem;
    }
  `
})
export class AboutComponent {}
