import { fas } from '@fortawesome/free-solid-svg-icons';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { Component, OnInit } from '@angular/core';
import { Config } from 'datatables.net';
import { DataTablesModule } from 'angular-datatables';

@Component({
  selector: 'app-dashboard',
  imports: [FontAwesomeModule, DataTablesModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(icons: FaIconLibrary) {
    icons.addIconPacks(fas);
  }

  dtOptions: Config = {};

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
    };
  }
}
