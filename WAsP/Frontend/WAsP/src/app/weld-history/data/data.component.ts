import { Component, OnInit, Input } from '@angular/core';
import { Specification } from '@app/_models';
import { RealTimeView } from '@app/_models';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.sass']
})
export class DataComponent implements OnInit {

  @Input() specification: Specification;
  @Input() realtime: RealTimeView;

  constructor() { }

  ngOnInit(): void {
  }

}
