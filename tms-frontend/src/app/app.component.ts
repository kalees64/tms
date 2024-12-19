import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { DummyComponent } from './components/dummy/dummy.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, DummyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'tms-frontend';
}
