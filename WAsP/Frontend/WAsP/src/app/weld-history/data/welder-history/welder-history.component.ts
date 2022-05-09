import { Component, Input, OnInit } from '@angular/core';
import { Specification } from '@app/_models';

@Component({
  selector: 'app-welder-history',
  templateUrl: './welder-history.component.html',
  styleUrls: ['./welder-history.component.sass']
})
export class WelderHistoryComponent implements OnInit {

  @Input() item: string;
  @Input() specification: Specification;

  constructor() { }

  ngOnInit(): void {
  }

}
