import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="container">
      <header>
        <h1>Welcome to the MEAN Task Management System!</h1>
      </header>
      <nav>
        <ul>
          <li><a routerLink="/">Home</a></li>
          <li><a routerLink="/projects/add">Add Project</a></li>
          <li><a routerLink="/about">About</a></li>
          <li><a routerLink="/contact">Contact</a></li>
        </ul>
      </nav>
      <main>
        <section>
          <router-outlet />
        </section>
      </main>
      <footer>
        <p>&copy; Cantu & Casillas Consulting</p>
      </footer>
    </div>
  `,
  styles: `
    .container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      text-align: center;
      padding: 0;
      margin: 0 auto;
    }

    header, footer {
      background-color: #f8f9fa;
      padding: 10px 0;
    }

    nav ul {
      list-style-type: none;
      padding: 0;
    }

    nav ul li {
      display: inline;
      margin-right: 10px;
    }

    main {
      flex: 1;
    }
  `
})
export class AppComponent {
  title = 'tms-client';
}
