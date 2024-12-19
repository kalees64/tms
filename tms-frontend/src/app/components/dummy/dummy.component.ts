import { Component } from '@angular/core';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { fas, faTicketSimple } from '@fortawesome/free-solid-svg-icons';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-dummy',
  imports: [FontAwesomeModule, DataTablesModule],
  templateUrl: './dummy.component.html',
  styleUrl: './dummy.component.css',
})
export class DummyComponent {
  constructor(icons: FaIconLibrary) {
    icons.addIconPacks(fas);
  }
}
