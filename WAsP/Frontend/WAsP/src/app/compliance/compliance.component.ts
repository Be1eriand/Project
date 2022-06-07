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

  // Used to load all contracts, then used to filter the selected contract
  allContracts: ContractTaskView[];
  // Used for filterable and searchable list
  filteredContracts: string[];
  // Sorted Contract list
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

  // Loading Contract Names and making them auto complete and filterable
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

  // On Run Report submit
  contractSubmit() {
     if (!this.contractForm.value.contractName || !(this.filteredContracts.includes(this.contractForm.value.contractName))) {
      alert('Please select a valid contract');
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


  // Export pdf div to PDF
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
