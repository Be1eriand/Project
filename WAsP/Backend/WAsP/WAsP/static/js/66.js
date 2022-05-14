"use strict";(self.webpackChunkWAsP=self.webpackChunkWAsP||[]).push([[66],{8066:(L,d,a)=>{a.r(d),a.d(d,{SpecificationModule:()=>J});var o=a(3075),l=a(9808),S=a(9224),p=a(3251),u=a(9815),m=a(7531),f=a(7322),g=a(9764),h=a(2074),_=a(3588),x=a(8675),N=a(4004),t=a(5e3),v=a(792),M=a(5826),I=a(508);function C(n,s){if(1&n&&(t.TgZ(0,"mat-option",11),t._uU(1),t.qZA()),2&n){const e=s.$implicit;t.Q6J("value",e.WPS_No),t.xp6(1),t.hij(" ",e.WPS_No," ")}}function b(n,s){if(1&n){const e=t.EpF();t.TgZ(0,"button",12),t.NdJ("click",function(){return t.CHM(e),t.oxw().editMode()}),t._uU(1,"Edit"),t.qZA()}}function T(n,s){if(1&n){const e=t.EpF();t.TgZ(0,"button",12),t.NdJ("click",function(){return t.CHM(e),t.oxw().onSubmit()}),t._uU(1,"Save"),t.qZA()}}function Z(n,s){if(1&n&&(t.TgZ(0,"mat-form-field",3)(1,"mat-label"),t._uU(2),t.qZA(),t._UZ(3,"input",19),t.qZA()),2&n){const e=s.$implicit,i=t.oxw().$implicit;t.xp6(2),t.Oqu(e),t.xp6(1),t.hYB("id","input_",e,"_",i.Run_No,""),t.s9C("value",i[e]),t.s9C("formControlName",e)}}function F(n,s){if(1&n&&(t.TgZ(0,"div")(1,"form",15)(2,"mat-tab",16)(3,"div",17)(4,"div"),t.YNc(5,Z,4,5,"mat-form-field",18),t.qZA()()()()()),2&n){const e=s.$implicit,i=t.oxw(2);t.xp6(1),t.Q6J("formGroup",i.createFormGroup(e)),t.xp6(1),t.MGl("label","Run ",e.Run_No,""),t.xp6(3),t.Q6J("ngForOf",i.SortedSpecList)}}function y(n,s){if(1&n&&(t.TgZ(0,"div")(1,"mat-tab-group",13),t.YNc(2,F,6,3,"div",14),t.qZA()()),2&n){const e=t.oxw();t.xp6(2),t.Q6J("ngForOf",e.Specifications)}}const A=[{path:"",component:(()=>{class n{constructor(e,i,r,c){this.fb=e,this.dataService=i,this.alertService=r,this.specificationService=c,this.forms=[],this.formSubs=[],this.specFilter=new o.NI,this.SpecLoaded=!1,this.Editing=!1,this.formLoaded=!1,this.Welders=[],this.SpecList=[],this.Specifications=[],this.SortedSpecList=["WPS_No","Welding_Code","Joint_type","Side","Position","Class","Size","Gas_Flux_Type","Current_Min","Current_Max","Voltage_Min","Voltage_Max","Polarity","TravelSpeed_Min","TravelSpeed_Max","InterpassTemp_Min","InterpassTemp_Max","HeatInput_Min","HeatInput_Max"]}ngOnInit(){this.loadData(),this.filteredOptions=this.specFilter.valueChanges.pipe((0,x.O)(""),(0,N.U)(e=>this._filter(e))),this.specFilter.valueChanges.subscribe({next:e=>{this.SpecLoaded=!1,this.Editing=!1,""!==e&&(this.loadSpecification(e),this.Specifications.forEach(i=>{this.createFormGroup(i)}),this.formLoaded=!0)},error:e=>{this.alertService.error(e)}})}_filter(e){return this.SpecList.filter(i=>i.WPS_No.toString().includes(e))}loadData(){this.dataService.getMachines().subscribe({next:e=>{this.Machines=e.reduce(function(i,r){return i.push(r),i},[])},error:e=>{this.alertService.error(e)}}),this.dataService.getWelders().subscribe({next:e=>{this.Welders=e.reduce(function(i,r){return i.push(r),i},[])},error:e=>{this.alertService.error(e)}}),this.dataService.getSpecList().subscribe({next:e=>{this.SpecList=e.reduce(function(i,r){return i.push(r),i},[])},error:e=>{this.alertService.error(e)}})}loadSpecification(e){this.specificationService.getSpec(e).subscribe({next:i=>{this.Specifications=[],this.Specifications=i.reduce(function(r,c){return r.push(c),r},[]),this.SpecLoaded=!0},error:i=>{this.alertService.error(i),this.Editing=!1,this.SpecLoaded=!1}})}onSubmit(){for(this.Editing=!this.Editing;this.forms.length;){let e=this.forms.pop();console.log(e.value),console.log(e),this.specificationService.updateSpecRun(e.value.WPS_No,e.value.WPS_No,e.value).subscribe({next:()=>{this.alertService.success("Succesfully Saved!")},error:c=>{this.alertService.error(c),this.SpecLoaded=!1}})}}createFormGroup(e){let i=this.getFormGroup(e.Run_No);return void 0===i&&(i=new o.cw({Run_No:new o.NI(e.Run_No),WPS_No:new o.NI(e.WPS_No),Welding_Code:new o.NI(e.Welding_Code),Joint_type:new o.NI(e.Joint_type),Side:new o.NI(e.Side),Position:new o.NI(e.Position),Class:new o.NI(e.Class),Size:new o.NI(e.Size),Gas_Flux_Type:new o.NI(e.Gas_Flux_Type),Current_Min:new o.NI(e.Current_Min),Current_Max:new o.NI(e.Current_Max),Voltage_Min:new o.NI(e.Voltage_Min),Voltage_Max:new o.NI(e.Voltage_Max),Polarity:new o.NI(e.Polarity),TravelSpeed_Min:new o.NI(e.TravelSpeed_Min),TravelSpeed_Max:new o.NI(e.TravelSpeed_Max),InterpassTemp_Min:new o.NI(e.InterpassTemp_Min),InterpassTemp_Max:new o.NI(e.InterpassTemp_Max),HeatInput_Min:new o.NI(e.HeatInput_Min),HeatInput_Max:new o.NI(e.HeatInput_Max)}),this.forms.length<this.Specifications.length&&(this.forms.push(i),this.formSubs.push(i.valueChanges.subscribe(r=>{console.log("This works unbelievably")})))),i}getFormGroup(e){return 0!=this.forms.length?this.forms.find(i=>i.value.Run_No===e):void 0}editMode(){this.Editing||(this.Editing=!this.Editing)}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(o.qu),t.Y36(v.Do),t.Y36(v.c9),t.Y36(M.S))},n.\u0275cmp=t.Xpm({type:n,selectors:[["ng-component"]],decls:25,vars:8,consts:[[1,"container"],[1,"row"],[1,"col-4"],["appearance","fill"],["type","text","placeholder","Select Specification","aria-label","Specification","matInput","",3,"formControl","matAutocomplete"],["autoActiveFirstOption",""],["auto","matAutocomplete"],[3,"value",4,"ngFor","ngForOf"],["mat-flat-button","","type","button",1,"btn","btn-warning","text-center"],["mat-flat-button","","class","btn btn-warning text-center","type","button",3,"click",4,"ngIf"],[4,"ngIf"],[3,"value"],["mat-flat-button","","type","button",1,"btn","btn-warning","text-center",3,"click"],["dynamicHeight",""],[4,"ngFor","ngForOf"],[3,"formGroup"],[3,"label"],[1,"mat-elevation-z4"],["appearance","fill",4,"ngFor","ngForOf"],["type","text","matInput","",3,"id","value","formControlName"]],template:function(e,i){if(1&e&&(t.TgZ(0,"div",0)(1,"div",1),t._UZ(2,"div",2),t.TgZ(3,"div",2)(4,"h1"),t._uU(5,"Specification View"),t.qZA()(),t._UZ(6,"div",2),t.qZA(),t.TgZ(7,"div",1)(8,"form")(9,"mat-form-field",3)(10,"mat-label"),t._uU(11,"Welding Procedure Specification"),t.qZA(),t._UZ(12,"input",4),t.TgZ(13,"mat-autocomplete",5,6),t.YNc(15,C,2,2,"mat-option",7),t.ALo(16,"async"),t.qZA()()()(),t.TgZ(17,"div",1)(18,"div",1)(19,"button",8),t._uU(20,"Add"),t.qZA(),t.YNc(21,b,2,0,"button",9),t.YNc(22,T,2,0,"button",9),t.qZA(),t.TgZ(23,"div",1),t.YNc(24,y,3,1,"div",10),t.qZA()()()),2&e){const r=t.MAs(14);t.xp6(12),t.Q6J("formControl",i.specFilter)("matAutocomplete",r),t.xp6(3),t.Q6J("ngForOf",t.lcZ(16,6,i.filteredOptions)),t.xp6(6),t.Q6J("ngIf",!i.Editing&&i.SpecLoaded),t.xp6(1),t.Q6J("ngIf",i.Editing),t.xp6(2),t.Q6J("ngIf",i.SpecLoaded&&i.formLoaded)}},directives:[o._Y,o.JL,f.KE,f.hX,m.Nt,o.Fj,u.ZL,o.JJ,o.oH,u.XC,l.sg,I.ey,l.O5,p.SP,o.sg,p.uX,o.u],pipes:[l.Ov],styles:[""]}),n})(),canActivate:[_.a1]}];let w=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[[h.Bz.forChild(A)],h.Bz]}),n})(),J=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[[l.ez,o.UX,w,S.QW,p.Nh,u.Bb,f.lN,m.c,g.o9]]}),n})()}}]);