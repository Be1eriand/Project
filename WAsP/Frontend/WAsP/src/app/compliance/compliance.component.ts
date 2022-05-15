import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ContractTaskView, RealTimeView, Specification, TaskView } from '@app/_models';
import { RealtimeService } from '@app/_services/realtime.service';
import { SpecificationService } from '@app/_services/specification.service';

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

  contractForm: FormGroup;

  tasks: string[];
  allTasks: TaskView[];
  filteredContracts: string[];

  contractID: string[];
  
  
  showTask: boolean = false;

  
  allContracts: ContractTaskView[];
  contracts: string[];


  @ViewChild('pdf')
  pdf!: ElementRef;

  constructor(private specificationService: SpecificationService,
    private realtimeSerivce: RealtimeService,
    ) {}

  ngOnInit(): void {
    this.specificationService.getAllContracts().subscribe(c => {
      this.allContracts = c;
      this.loadContracts();
      console.log(this.allContracts);
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
                                    fontSize: 18,
                                    color: '#374785',
                                    bold: true,
                                  },
                                  'html-td': {
                                    fontSize: 9,
                                  },
                                }
                              };
    pdfMake.createPdf(documentDefinition).download("Smart Fabrication Weld Compliance Report.pdf");
  }

}
