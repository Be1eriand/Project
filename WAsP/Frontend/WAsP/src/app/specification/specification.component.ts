import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { AlertService, DataService } from '@app/_services';

import { Machine, Spec, Specification, Welder } from '@app/_models';
import { SpecificationService } from '@app/_services/specification.service';

@Component({
  templateUrl: './specification.component.html',
  styleUrls: ['./specification.component.sass']
})
export class SpecificationComponent implements OnInit {
  specFilter = new FormControl();
  filteredOptions: Observable<Spec[]>;

  SpecLoaded = false;

  Machines: Machine[];
  Welders: Welder[] = [];
  SpecList: Spec[] = [];
  Specifications: Specification[] = [];

  constructor(
    private dataService: DataService,
    private alertService: AlertService,
    private specificationService: SpecificationService,
  ) { 
  }

  ngOnInit(): void {
    this.loadData();

    this.filteredOptions = this.specFilter.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    this.specFilter.valueChanges.subscribe({
      next: (value) => {
        this.SpecLoaded = false;
        if (value !== '') {
        this.loadSpecification(value);
        console.log(this.Specifications);
        }
      },
      error: error => {
        this.alertService.error(error);
        }
    })
  }

  private _filter(value: string): Spec[] {
    return this.SpecList.filter(spec => spec.WPS_No.toString().includes(value));
  }

  private loadData() {
    this.dataService.getMachines()
    .subscribe({
    next: (machines) => { 
      this.Machines = machines.reduce( function (arr, machine) {
        arr.push(machine);
        return arr;
      }, [])
    },
    error: error => {
        this.alertService.error(error);
        }
    
      });

    this.dataService.getWelders().subscribe({
      next: (welders) => { 
        this.Welders = welders.reduce( function (arr, welder) {
          arr.push(welder);
          return arr;
        }, [])
      },
      error: error => {
          this.alertService.error(error);
          }
      
        });

    this.dataService.getSpecList()
        .subscribe({
        next: (specifications) => { 
          this.SpecList = specifications.reduce( function (arr, spec) {
            arr.push(spec);
            return arr;
          }, [])
        },
        error: error => {
            this.alertService.error(error);
            }
          });
  }


  public loadSpecification(specID: string) {

    this.specificationService.getSpec(specID).subscribe({
      next: (specifications) => { 
        this.Specifications = [];
        this.Specifications = specifications.reduce( function (arr, spec) {
          arr.push(spec);
          return arr;
        }, [])
        this.SpecLoaded = true;
      },
      error: error => {
        this.alertService.error(error);
        this.SpecLoaded = false;
        }
    });
  }
}
