import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <h2>Contact</h2>
    <p>For questions, feedback, or suggestions about TMS, please contact the
      project team through Bellevue University's WEB450 course communications.</p>
    <h3>Development Team</h3>
    <p>Jonathan Cantu</p>
    <p>Maxine Casillas</p>
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
export class ContactComponent {}
