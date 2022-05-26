import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ContractTaskView } from '@app/_models';
import { SpecificationService } from '@app/_services/specification.service';
import { MatAccordion } from '@angular/material/expansion';

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
  showTask: boolean = false;
  allContracts: ContractTaskView[];
  filteredContracts: string[];
  contracts: string[];

  @ViewChild('pdf')
  pdf!: ElementRef;

  constructor(private specificationService: SpecificationService
    ) {}

  ngOnInit(): void {
    this.specificationService.getAllContracts().subscribe({
      next: c => {
        this.allContracts = c;
        this.loadContracts();
      },
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
    this.allContracts = contracts;
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
                                    fontSize: 16,
                                    color: '#4B4276',
                                    bold: true,
                                  },
                                  'html-td': {
                                    fontSize: 9,
                                  },
                                  'html-th': {
                                    fontSize: 10,
                                  },
                                  'html-mat-panel-title': {
                                    fontSize: 14,
                                  },
                                }
                              };
    pdfMake.createPdf(documentDefinition).download("Smart Fabrication Weld Compliance Report.pdf");
  }

}
