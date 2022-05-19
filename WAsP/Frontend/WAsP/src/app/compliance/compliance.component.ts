import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ContractTaskView } from '@app/_models';
import { SpecificationService } from '@app/_services/specification.service';
import { MatAccordion } from '@angular/material/expansion';

const pdfMake = require('pdfmake/build/pdfmake.js');
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

const pdfMake = require('pdfmake/build/pdfmake.js');
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-compliance',
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.sass']
})
export class ComplianceComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  contractForm: FormGroup;
<<<<<<< HEAD

  tasks: string[];
  allTasks: TaskView[];
  filteredContracts: string[];

  contractID: string[];
  
  
=======
>>>>>>> origin/reports4
  showTask: boolean = false;
  allContracts: ContractTaskView[];
  filteredContracts: string[];
  contracts: string[];
<<<<<<< HEAD


  @ViewChild('pdf')
  pdf!: ElementRef;

  constructor(private specificationService: SpecificationService,
    private realtimeSerivce: RealtimeService,
=======

  @ViewChild('pdf')
  pdf!: ElementRef;

  constructor(private specificationService: SpecificationService
>>>>>>> origin/reports4
    ) {}

  ngOnInit(): void {
    this.specificationService.getAllContracts().subscribe(c => {
      this.allContracts = c;
      this.loadContracts();
    })

    this.contractForm = new FormGroup({
      contractName: new FormControl('')
    })
  }

  loadContracts(): void {
    let contracts = []
    for (let i = 0; i < this.allContracts.length; i++){
      contracts.push(String(this.allContracts[i].ContractName));
    }
    let uniqueContracts = [...new Set(contracts)];
    this.contracts = uniqueContracts.sort();

    this.filteredContracts = this.contracts;
  }
  contractOnKey(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.filteredContracts = this.contractSearch(target.value);
  }
  contractSearch(value: string) {
    let filter = value.toLocaleLowerCase();
    return this.contracts.filter(option => option.toLocaleLowerCase().includes(filter));
  }

<<<<<<< HEAD

=======
>>>>>>> origin/reports4
  contractSubmit() {
    console.log(this.contractForm);
    if (!this.contractForm.value.contractName) {
      alert('Please select a contract');
      return;
    }

    // A contract can have many tasks assigned
    let contracts = []
    for(var i in this.allContracts) {
      if (this.allContracts[i].ContractName === this.contractForm.value.contractName){
        contracts.push(this.allContracts[i])
      }
    }
<<<<<<< HEAD
    console.log(contracts);
    this.contracts = contracts;

    /* Get WPS data
    if (contracts.length > 0) {
      let wps: Specification[][] = [];
      for (var j in contracts) {
        this.specificationService.getSpec(contracts[j].WPS_No).subscribe(w => wps.push(w));
      }
      this.wps = wps;
      console.log(this.wps);

      // Get realtime data
      var realtime: RealTimeView[][] = []
      let test: any = []
      for (var k in contracts) {
        var taskID: RealTimeView[] = []
        console.log(contracts[k].TaskID);
        let id = String(contracts[k].TaskID);
        console.log(id);
        //this.realtimeSerivce.getRTTask(id).subscribe(t => {taskID.push(t);realtime.push(taskID);})
        this.realtimeSerivce.getRTTask('1').subscribe(t => test = t)
      }
      console.log(test);
      console.log(realtime);

    } */

    //this.realtimeSerivce.getRTTask(id).subscribe((rt) => this.RTtask = rt);


    //this.getRealtimeTask(this.taskForm.value.taskID);
    //this.showTask = true;
    //console.log(this.RTtask);

=======
    this.allContracts = contracts;
>>>>>>> origin/reports4
    this.showTask = true;
  }

  exportPDF(header: string) {
    const pdf = this.pdf.nativeElement;
    var html = htmlToPdfmake(pdf.innerHTML);
    console.log(html);
    const documentDefinition = {pageOrientation: 'landscape',
                                content: [
                                  {text: header, style: 'header'}, 
                                  html
                                ],
                                styles: {
                                  header: {
<<<<<<< HEAD
                                    fontSize: 18,
                                    color: '#374785',
=======
                                    fontSize: 16,
                                    color: '#4B4276',
>>>>>>> origin/reports4
                                    bold: true,
                                  },
                                  'html-td': {
                                    fontSize: 9,
                                  },
<<<<<<< HEAD
=======
                                  'html-th': {
                                    fontSize: 10,
                                  },
                                  'html-mat-panel-title': {
                                    fontSize: 14,
                                  },
>>>>>>> origin/reports4
                                }
                              };
    pdfMake.createPdf(documentDefinition).download("Smart Fabrication Weld Compliance Report.pdf");
  }

<<<<<<< HEAD
}
=======
}
>>>>>>> origin/reports4
