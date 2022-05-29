import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormArray, FormBuilder} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { AlertService, DataService } from '@app/_services';

import { Machine, Spec, Specification, Welder } from '@app/_models';
import { SpecificationService } from '@app/_services/specification.service';

@Component({
  templateUrl: './specification.component.html',
  styleUrls: ['./specification.component.sass']
})
export class SpecificationComponent implements OnInit {

  forms: FormGroup[] = [];
  formSubs: Subscription[] = [];

  specFilter = new FormControl();
  filteredOptions: string[] = [];

  SpecLoaded = false;
  Editing = false;
  formLoaded = false;

  Machines: Machine[];
  Welders: Welder[] = [];
  SpecList: Spec[] = [];
  Specifications: Specification[] = [];

  SortedSpecList = [
    'WPS_No',
    'Welding_Code',
    'Joint_type', 
    'Side',
    'Position',
    'Class',
    'Size',
    'Gas_Flux_Type',
    'Current_Min',
    'Current_Max',
    'Voltage_Min',
    'Voltage_Max',
    'Polarity',
    'TravelSpeed_Min',
    'TravelSpeed_Max',
    'InterpassTemp_Min',
    'InterpassTemp_Max',
    'HeatInput_Min',
    'HeatInput_Max',
  ]

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private alertService: AlertService,
    private specificationService: SpecificationService,
  ) { 
    this.loadData();
  }

  ngOnInit(): void {
  this.specFilter.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    ).subscribe({
      next: (value) => {
        this.filteredOptions = [];
        for (const v of value){
          this.filteredOptions.push(v.WPS_No);
        }
      }
    });
  }

  SpecOnKey(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    console.log(target);

    this.SpecLoaded = false;
    this.Editing = false;
    if (target.value !== '') {
      this.loadSpecification(target.value);

      this.forms = [];
              
      this.Specifications.forEach( spec => {
        this.createFormGroup(spec);
      });
      
      this.formLoaded = true;
    }

    console.log(this.Specifications);
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

    this.dataService.getSpecList()
      .subscribe({
        next: (specifications) => { 
          this.filteredOptions = specifications.reduce( function (arr, spec) {
            arr.push(spec.WPS_No);
            return arr;
          }, [])
        },
        error: error => {
            this.alertService.error(error);
            }
        });
  }


  loadSpecification(specID: string) {

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
        this.Editing = false;
        this.SpecLoaded = false;
        }
    });
  }

  onSubmit(){
    this.Editing = !this.Editing;

    while (this.forms.length) {
      let popped = this.forms.pop();
      let spec = popped.value['WPS_No'];
      let run = popped.value['WPS_No'];
      this.specificationService.updateSpecRun(spec, run, popped.value).subscribe({
        next: () =>{
          this.alertService.success('Succesfully Saved!');
        },

        error: error => {
          this.alertService.error(error);
          this.SpecLoaded = false;
          }
      })
    }

  }

  createFormGroup(Spec: Specification){

    let form = this.getFormGroup(Spec.Run_No);

    if (form === undefined){

      form = new FormGroup({
        Run_No: new FormControl(Spec.Run_No),
        WPS_No: new FormControl(Spec.WPS_No),
        Welding_Code: new FormControl(Spec.Welding_Code),
        Joint_type: new FormControl(Spec.Joint_type), 
        Side: new FormControl(Spec.Side),
        Position: new FormControl(Spec.Position),
        Class: new FormControl(Spec.Class),
        Size: new FormControl(Spec.Size),
        Gas_Flux_Type: new FormControl(Spec.Gas_Flux_Type),
        Current_Min: new FormControl(Spec.Current_Min),
        Current_Max: new FormControl(Spec.Current_Max),
        Voltage_Min: new FormControl(Spec.Voltage_Min),
        Voltage_Max: new FormControl(Spec.Voltage_Max),
        Polarity: new FormControl(Spec.Polarity),
        TravelSpeed_Min: new FormControl(Spec.TravelSpeed_Min),
        TravelSpeed_Max: new FormControl(Spec.TravelSpeed_Max),
        InterpassTemp_Min: new FormControl(Spec.InterpassTemp_Min),
        InterpassTemp_Max: new FormControl(Spec.InterpassTemp_Max),
        HeatInput_Min: new FormControl(Spec.HeatInput_Min),
        HeatInput_Max: new FormControl(Spec.HeatInput_Max),
        });

      if (this.forms.length < this.Specifications.length){
        this.forms.push(form);
        this.formSubs.push(form.valueChanges.subscribe( x => {
            console.log('This works unbelievably')
          })
        );
      
      }
    }

    return form;
  }

  getFormGroup(RunNo: string) {
    return this.forms.length != 0 ? this.forms.find(form => form.value.Run_No === RunNo) : undefined;
  }

  editMode() {
    if (!this.Editing) {
      this.Editing = !this.Editing
    }
  }
}
