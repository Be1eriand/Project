"use strict";(self.webpackChunkWAsP=self.webpackChunkWAsP||[]).push([[764],{9042:(qt,Z,M)=>{function t(D){for(let G in D){let _=D[G]||"";switch(G){case"display":D.display="flex"===_?["-webkit-flex","flex"]:"inline-flex"===_?["-webkit-inline-flex","inline-flex"]:_;break;case"align-items":case"align-self":case"align-content":case"flex":case"flex-basis":case"flex-flow":case"flex-grow":case"flex-shrink":case"flex-wrap":case"justify-content":D["-webkit-"+G]=_;break;case"flex-direction":_=_||"row",D["-webkit-flex-direction"]=_,D["flex-direction"]=_;break;case"order":D.order=D["-webkit-"+G]=isNaN(+_)?"0":_}}return D}M.d(Z,{Ar:()=>R,GK:()=>t,iQ:()=>A,kt:()=>nt,tj:()=>I});const m="inline",A=["row","column","row-reverse","column-reverse"];function R(D){let[G,_,E]=Q(D);return function $(D,G=null,_=!1){return{display:_?"inline-flex":"flex","box-sizing":"border-box","flex-direction":D,"flex-wrap":G||null}}(G,_,E)}function Q(D){var G;D=null!==(G=null==D?void 0:D.toLowerCase())&&void 0!==G?G:"";let[_,E,b]=D.split(" ");return A.find(rt=>rt===_)||(_=A[0]),E===m&&(E=b!==m?b:"",b=m),[_,P(E),!!b]}function I(D){let[G]=Q(D);return G.indexOf("row")>-1}function P(D){if(D)switch(D.toLowerCase()){case"reverse":case"wrap-reverse":case"reverse-wrap":D="wrap-reverse";break;case"no":case"none":case"nowrap":D="nowrap";break;default:D="wrap"}return D}function nt(D,...G){if(null==D)throw TypeError("Cannot convert undefined or null to object");for(let _ of G)if(null!=_)for(let E in _)_.hasOwnProperty(E)&&(D[E]=_[E]);return D}},3270:(qt,Z,M)=>{M.d(Z,{Bs:()=>K,FL:()=>Yt,IR:()=>E,Ot:()=>kt,QI:()=>At,RK:()=>ot,WU:()=>z,g5:()=>pt,iR:()=>It,wY:()=>J,yB:()=>Vt});var t=M(5e3),m=M(9808),A=M(1135),R=M(8306),Q=M(6451),I=M(7579),P=M(9042),$=M(9300),nt=M(8505);const G={provide:t.tb,useFactory:function D(g,c){return()=>{if((0,m.NF)(c)){const i=Array.from(g.querySelectorAll(`[class*=${_}]`)),s=/\bflex-layout-.+?\b/g;i.forEach(n=>{n.classList.contains(`${_}ssr`)&&n.parentNode?n.parentNode.removeChild(n):n.className.replace(s,"")})}}},deps:[m.K0,t.Lbi],multi:!0},_="flex-layout-";let E=(()=>{class g{}return g.\u0275fac=function(i){return new(i||g)},g.\u0275mod=t.oAB({type:g}),g.\u0275inj=t.cJS({providers:[G]}),g})();class b{constructor(c=!1,i="all",s="",n="",u=0){this.matches=c,this.mediaQuery=i,this.mqAlias=s,this.suffix=n,this.priority=u,this.property=""}clone(){return new b(this.matches,this.mediaQuery,this.mqAlias,this.suffix)}}let rt=(()=>{class g{constructor(){this.stylesheet=new Map}addStyleToElement(i,s,n){const u=this.stylesheet.get(i);u?u.set(s,n):this.stylesheet.set(i,new Map([[s,n]]))}clearStyles(){this.stylesheet.clear()}getStyleForElement(i,s){const n=this.stylesheet.get(i);let u="";if(n){const y=n.get(s);("number"==typeof y||"string"==typeof y)&&(u=y+"")}return u}}return g.\u0275fac=function(i){return new(i||g)},g.\u0275prov=t.Yz7({token:g,factory:g.\u0275fac,providedIn:"root"}),g})();const pt={addFlexToParent:!0,addOrientationBps:!1,disableDefaultBps:!1,disableVendorPrefixes:!1,serverLoaded:!1,useColumnBasisZero:!0,printWithBreakpoints:[],mediaTriggerAutoRestore:!0,ssrObserveBreakpoints:[],multiplier:void 0,defaultUnit:"px",detectLayoutDisplay:!1},z=new t.OlP("Flex Layout token, config options for the library",{providedIn:"root",factory:()=>pt}),J=new t.OlP("FlexLayoutServerLoaded",{providedIn:"root",factory:()=>!1}),K=new t.OlP("Flex Layout token, collect all breakpoints into one provider",{providedIn:"root",factory:()=>null});function at(g,c){return g=g?g.clone():new b,c&&(g.mqAlias=c.alias,g.mediaQuery=c.mediaQuery,g.suffix=c.suffix,g.priority=c.priority),g}class At{constructor(){this.shouldCache=!0}sideEffect(c,i,s){}}let ot=(()=>{class g{constructor(i,s,n,u){this._serverStylesheet=i,this._serverModuleLoaded=s,this._platformId=n,this.layoutConfig=u}applyStyleToElement(i,s,n=null){let u={};"string"==typeof s&&(u[s]=n,s=u),u=this.layoutConfig.disableVendorPrefixes?s:(0,P.GK)(s),this._applyMultiValueStyleToElement(u,i)}applyStyleToElements(i,s=[]){const n=this.layoutConfig.disableVendorPrefixes?i:(0,P.GK)(i);s.forEach(u=>{this._applyMultiValueStyleToElement(n,u)})}getFlowDirection(i){const s="flex-direction";let n=this.lookupStyle(i,s);return[n||"row",this.lookupInlineStyle(i,s)||(0,m.PM)(this._platformId)&&this._serverModuleLoaded?n:""]}hasWrap(i){return"wrap"===this.lookupStyle(i,"flex-wrap")}lookupAttributeValue(i,s){var n;return null!==(n=i.getAttribute(s))&&void 0!==n?n:""}lookupInlineStyle(i,s){return(0,m.NF)(this._platformId)?i.style.getPropertyValue(s):function W(g,c){var i;return null!==(i=X(g)[c])&&void 0!==i?i:""}(i,s)}lookupStyle(i,s,n=!1){let u="";return i&&((u=this.lookupInlineStyle(i,s))||((0,m.NF)(this._platformId)?n||(u=getComputedStyle(i).getPropertyValue(s)):this._serverModuleLoaded&&(u=this._serverStylesheet.getStyleForElement(i,s)))),u?u.trim():""}_applyMultiValueStyleToElement(i,s){Object.keys(i).sort().forEach(n=>{const u=i[n],y=Array.isArray(u)?u:[u];y.sort();for(let w of y)w=w?w+"":"",(0,m.NF)(this._platformId)||!this._serverModuleLoaded?(0,m.NF)(this._platformId)?s.style.setProperty(n,w):dt(s,n,w):this._serverStylesheet.addStyleToElement(s,n,w)})}}return g.\u0275fac=function(i){return new(i||g)(t.LFG(rt),t.LFG(J),t.LFG(t.Lbi),t.LFG(z))},g.\u0275prov=t.Yz7({token:g,factory:g.\u0275fac,providedIn:"root"}),g})();function dt(g,c,i){c=c.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase();const s=X(g);s[c]=null!=i?i:"",function vt(g,c){let i="";for(const s in c)c[s]&&(i+=`${s}:${c[s]};`);g.setAttribute("style",i)}(g,s)}function X(g){const c={},i=g.getAttribute("style");if(i){const s=i.split(/;+/g);for(let n=0;n<s.length;n++){const u=s[n].trim();if(u.length>0){const y=u.indexOf(":");if(-1===y)throw new Error(`Invalid CSS style: ${u}`);c[u.substr(0,y).trim()]=u.substr(y+1).trim()}}}return c}function j(g,c){return(c&&c.priority||0)-(g&&g.priority||0)}function gt(g,c){return(g.priority||0)-(c.priority||0)}let q=(()=>{class g{constructor(i,s,n){this._zone=i,this._platformId=s,this._document=n,this.source=new A.X(new b(!0)),this.registry=new Map,this.pendingRemoveListenerFns=[],this._observable$=this.source.asObservable()}get activations(){const i=[];return this.registry.forEach((s,n)=>{s.matches&&i.push(n)}),i}isActive(i){var s;const n=this.registry.get(i);return null!==(s=null==n?void 0:n.matches)&&void 0!==s?s:this.registerQuery(i).some(u=>u.matches)}observe(i,s=!1){if(i&&i.length){const n=this._observable$.pipe((0,$.h)(y=>!s||i.indexOf(y.mediaQuery)>-1)),u=new R.y(y=>{const w=this.registerQuery(i);if(w.length){const r=w.pop();w.forEach(h=>{y.next(h)}),this.source.next(r)}y.complete()});return(0,Q.T)(u,n)}return this._observable$}registerQuery(i){const s=Array.isArray(i)?i:[i],n=[];return function Ct(g,c){const i=g.filter(s=>!wt[s]);if(i.length>0){const s=i.join(", ");try{const n=c.createElement("style");n.setAttribute("type","text/css"),n.styleSheet||n.appendChild(c.createTextNode(`\n/*\n  @angular/flex-layout - workaround for possible browser quirk with mediaQuery listeners\n  see http://bit.ly/2sd4HMP\n*/\n@media ${s} {.fx-query-test{ }}\n`)),c.head.appendChild(n),i.forEach(u=>wt[u]=n)}catch(n){console.error(n)}}}(s,this._document),s.forEach(u=>{const y=r=>{this._zone.run(()=>this.source.next(new b(r.matches,u)))};let w=this.registry.get(u);w||(w=this.buildMQL(u),w.addListener(y),this.pendingRemoveListenerFns.push(()=>w.removeListener(y)),this.registry.set(u,w)),w.matches&&n.push(new b(!0,u))}),n}ngOnDestroy(){let i;for(;i=this.pendingRemoveListenerFns.pop();)i()}buildMQL(i){return function Ft(g,c){return c&&window.matchMedia("all").addListener?window.matchMedia(g):{matches:"all"===g||""===g,media:g,addListener:()=>{},removeListener:()=>{},onchange:null,addEventListener(){},removeEventListener(){},dispatchEvent:()=>!1}}(i,(0,m.NF)(this._platformId))}}return g.\u0275fac=function(i){return new(i||g)(t.LFG(t.R0b),t.LFG(t.Lbi),t.LFG(m.K0))},g.\u0275prov=t.Yz7({token:g,factory:g.\u0275fac,providedIn:"root"}),g})();const wt={},Dt=[{alias:"xs",mediaQuery:"screen and (min-width: 0px) and (max-width: 599.98px)",priority:1e3},{alias:"sm",mediaQuery:"screen and (min-width: 600px) and (max-width: 959.98px)",priority:900},{alias:"md",mediaQuery:"screen and (min-width: 960px) and (max-width: 1279.98px)",priority:800},{alias:"lg",mediaQuery:"screen and (min-width: 1280px) and (max-width: 1919.98px)",priority:700},{alias:"xl",mediaQuery:"screen and (min-width: 1920px) and (max-width: 4999.98px)",priority:600},{alias:"lt-sm",overlapping:!0,mediaQuery:"screen and (max-width: 599.98px)",priority:950},{alias:"lt-md",overlapping:!0,mediaQuery:"screen and (max-width: 959.98px)",priority:850},{alias:"lt-lg",overlapping:!0,mediaQuery:"screen and (max-width: 1279.98px)",priority:750},{alias:"lt-xl",overlapping:!0,priority:650,mediaQuery:"screen and (max-width: 1919.98px)"},{alias:"gt-xs",overlapping:!0,mediaQuery:"screen and (min-width: 600px)",priority:-950},{alias:"gt-sm",overlapping:!0,mediaQuery:"screen and (min-width: 960px)",priority:-850},{alias:"gt-md",overlapping:!0,mediaQuery:"screen and (min-width: 1280px)",priority:-750},{alias:"gt-lg",overlapping:!0,mediaQuery:"screen and (min-width: 1920px)",priority:-650}],tt="(orientation: portrait) and (max-width: 599.98px)",St="(orientation: landscape) and (max-width: 959.98px)",et="(orientation: portrait) and (min-width: 600px) and (max-width: 839.98px)",it="(orientation: landscape) and (min-width: 960px) and (max-width: 1279.98px)",st="(orientation: portrait) and (min-width: 840px)",_t="(orientation: landscape) and (min-width: 1280px)",B={HANDSET:`${tt}, ${St}`,TABLET:`${et} , ${it}`,WEB:`${st}, ${_t} `,HANDSET_PORTRAIT:`${tt}`,TABLET_PORTRAIT:`${et} `,WEB_PORTRAIT:`${st}`,HANDSET_LANDSCAPE:`${St}`,TABLET_LANDSCAPE:`${it}`,WEB_LANDSCAPE:`${_t}`},Mt=[{alias:"handset",priority:2e3,mediaQuery:B.HANDSET},{alias:"handset.landscape",priority:2e3,mediaQuery:B.HANDSET_LANDSCAPE},{alias:"handset.portrait",priority:2e3,mediaQuery:B.HANDSET_PORTRAIT},{alias:"tablet",priority:2100,mediaQuery:B.TABLET},{alias:"tablet.landscape",priority:2100,mediaQuery:B.TABLET_LANDSCAPE},{alias:"tablet.portrait",priority:2100,mediaQuery:B.TABLET_PORTRAIT},{alias:"web",priority:2200,mediaQuery:B.WEB,overlapping:!0},{alias:"web.landscape",priority:2200,mediaQuery:B.WEB_LANDSCAPE,overlapping:!0},{alias:"web.portrait",priority:2200,mediaQuery:B.WEB_PORTRAIT,overlapping:!0}],Rt=/(\.|-|_)/g;function Gt(g){let c=g.length>0?g.charAt(0):"",i=g.length>1?g.slice(1):"";return c.toUpperCase()+i}const ut=new t.OlP("Token (@angular/flex-layout) Breakpoints",{providedIn:"root",factory:()=>{const g=(0,t.f3M)(K),c=(0,t.f3M)(z),i=[].concat.apply([],(g||[]).map(n=>Array.isArray(n)?n:[n]));return function Lt(g,c=[]){const i={};return g.forEach(s=>{i[s.alias]=s}),c.forEach(s=>{i[s.alias]?(0,P.kt)(i[s.alias],s):i[s.alias]=s}),function jt(g){return g.forEach(c=>{c.suffix||(c.suffix=function Pt(g){return g.replace(Rt,"|").split("|").map(Gt).join("")}(c.alias),c.overlapping=!!c.overlapping)}),g}(Object.keys(i).map(s=>i[s]))}((c.disableDefaultBps?[]:Dt).concat(c.addOrientationBps?Mt:[]),i)}});let U=(()=>{class g{constructor(i){this.findByMap=new Map,this.items=[...i].sort(gt)}findByAlias(i){return i?this.findWithPredicate(i,s=>s.alias===i):null}findByQuery(i){return this.findWithPredicate(i,s=>s.mediaQuery===i)}get overlappings(){return this.items.filter(i=>i.overlapping)}get aliases(){return this.items.map(i=>i.alias)}get suffixes(){return this.items.map(i=>{var s;return null!==(s=null==i?void 0:i.suffix)&&void 0!==s?s:""})}findWithPredicate(i,s){var n;let u=this.findByMap.get(i);return u||(u=null!==(n=this.items.find(s))&&void 0!==n?n:null,this.findByMap.set(i,u)),null!=u?u:null}}return g.\u0275fac=function(i){return new(i||g)(t.LFG(ut))},g.\u0275prov=t.Yz7({token:g,factory:g.\u0275fac,providedIn:"root"}),g})();const V="print",Et={alias:V,mediaQuery:V,priority:1e3};let bt=(()=>{class g{constructor(i,s,n){this.breakpoints=i,this.layoutConfig=s,this._document=n,this.registeredBeforeAfterPrintHooks=!1,this.isPrintingBeforeAfterEvent=!1,this.beforePrintEventListeners=[],this.afterPrintEventListeners=[],this.formerActivations=null,this.isPrinting=!1,this.queue=new Ot,this.deactivations=[]}withPrintQuery(i){return[...i,V]}isPrintEvent(i){return i.mediaQuery.startsWith(V)}get printAlias(){var i;return[...null!==(i=this.layoutConfig.printWithBreakpoints)&&void 0!==i?i:[]]}get printBreakPoints(){return this.printAlias.map(i=>this.breakpoints.findByAlias(i)).filter(i=>null!==i)}getEventBreakpoints({mediaQuery:i}){const s=this.breakpoints.findByQuery(i);return(s?[...this.printBreakPoints,s]:this.printBreakPoints).sort(j)}updateEvent(i){var s;let n=this.breakpoints.findByQuery(i.mediaQuery);return this.isPrintEvent(i)&&(n=this.getEventBreakpoints(i)[0],i.mediaQuery=null!==(s=null==n?void 0:n.mediaQuery)&&void 0!==s?s:""),at(i,n)}registerBeforeAfterPrintHooks(i){if(!this._document.defaultView||this.registeredBeforeAfterPrintHooks)return;this.registeredBeforeAfterPrintHooks=!0;const s=()=>{this.isPrinting||(this.isPrintingBeforeAfterEvent=!0,this.startPrinting(i,this.getEventBreakpoints(new b(!0,V))),i.updateStyles())},n=()=>{this.isPrintingBeforeAfterEvent=!1,this.isPrinting&&(this.stopPrinting(i),i.updateStyles())};this._document.defaultView.addEventListener("beforeprint",s),this._document.defaultView.addEventListener("afterprint",n),this.beforePrintEventListeners.push(s),this.afterPrintEventListeners.push(n)}interceptEvents(i){return s=>{this.isPrintEvent(s)?s.matches&&!this.isPrinting?(this.startPrinting(i,this.getEventBreakpoints(s)),i.updateStyles()):!s.matches&&this.isPrinting&&!this.isPrintingBeforeAfterEvent&&(this.stopPrinting(i),i.updateStyles()):this.collectActivations(i,s)}}blockPropagation(){return i=>!(this.isPrinting||this.isPrintEvent(i))}startPrinting(i,s){this.isPrinting=!0,this.formerActivations=i.activatedBreakpoints,i.activatedBreakpoints=this.queue.addPrintBreakpoints(s)}stopPrinting(i){i.activatedBreakpoints=this.deactivations,this.deactivations=[],this.formerActivations=null,this.queue.clear(),this.isPrinting=!1}collectActivations(i,s){if(!this.isPrinting||this.isPrintingBeforeAfterEvent){if(!this.isPrintingBeforeAfterEvent)return void(this.deactivations=[]);if(!s.matches){const n=this.breakpoints.findByQuery(s.mediaQuery);if(n){const u=this.formerActivations&&this.formerActivations.includes(n),y=!this.formerActivations&&i.activatedBreakpoints.includes(n);(u||y)&&(this.deactivations.push(n),this.deactivations.sort(j))}}}}ngOnDestroy(){this._document.defaultView&&(this.beforePrintEventListeners.forEach(i=>this._document.defaultView.removeEventListener("beforeprint",i)),this.afterPrintEventListeners.forEach(i=>this._document.defaultView.removeEventListener("afterprint",i)))}}return g.\u0275fac=function(i){return new(i||g)(t.LFG(U),t.LFG(z),t.LFG(m.K0))},g.\u0275prov=t.Yz7({token:g,factory:g.\u0275fac,providedIn:"root"}),g})();class Ot{constructor(){this.printBreakpoints=[]}addPrintBreakpoints(c){return c.push(Et),c.sort(j),c.forEach(i=>this.addBreakpoint(i)),this.printBreakpoints}addBreakpoint(c){c&&void 0===this.printBreakpoints.find(s=>s.mediaQuery===c.mediaQuery)&&(this.printBreakpoints=function Bt(g){var c;return null!==(c=null==g?void 0:g.mediaQuery.startsWith(V))&&void 0!==c&&c}(c)?[c,...this.printBreakpoints]:[...this.printBreakpoints,c])}clear(){this.printBreakpoints=[]}}let Vt=(()=>{class g{constructor(i,s,n){this.matchMedia=i,this.breakpoints=s,this.hook=n,this._useFallbacks=!0,this._activatedBreakpoints=[],this.elementMap=new Map,this.elementKeyMap=new WeakMap,this.watcherMap=new WeakMap,this.updateMap=new WeakMap,this.clearMap=new WeakMap,this.subject=new I.x,this.observeActivations()}get activatedAlias(){var i,s;return null!==(s=null===(i=this.activatedBreakpoints[0])||void 0===i?void 0:i.alias)&&void 0!==s?s:""}set activatedBreakpoints(i){this._activatedBreakpoints=[...i]}get activatedBreakpoints(){return[...this._activatedBreakpoints]}set useFallbacks(i){this._useFallbacks=i}onMediaChange(i){const s=this.findByQuery(i.mediaQuery);if(s){i=at(i,s);const n=this.activatedBreakpoints.indexOf(s);i.matches&&-1===n?(this._activatedBreakpoints.push(s),this._activatedBreakpoints.sort(j),this.updateStyles()):!i.matches&&-1!==n&&(this._activatedBreakpoints.splice(n,1),this._activatedBreakpoints.sort(j),this.updateStyles())}}init(i,s,n,u,y=[]){ct(this.updateMap,i,s,n),ct(this.clearMap,i,s,u),this.buildElementKeyMap(i,s),this.watchExtraTriggers(i,s,y)}getValue(i,s,n){const u=this.elementMap.get(i);if(u){const y=void 0!==n?u.get(n):this.getActivatedValues(u,s);if(y)return y.get(s)}}hasValue(i,s){const n=this.elementMap.get(i);if(n){const u=this.getActivatedValues(n,s);if(u)return void 0!==u.get(s)||!1}return!1}setValue(i,s,n,u){var y;let w=this.elementMap.get(i);if(w){const h=(null!==(y=w.get(u))&&void 0!==y?y:new Map).set(s,n);w.set(u,h),this.elementMap.set(i,w)}else w=(new Map).set(u,(new Map).set(s,n)),this.elementMap.set(i,w);const r=this.getValue(i,s);void 0!==r&&this.updateElement(i,s,r)}trackValue(i,s){return this.subject.asObservable().pipe((0,$.h)(n=>n.element===i&&n.key===s))}updateStyles(){this.elementMap.forEach((i,s)=>{const n=new Set(this.elementKeyMap.get(s));let u=this.getActivatedValues(i);u&&u.forEach((y,w)=>{this.updateElement(s,w,y),n.delete(w)}),n.forEach(y=>{if(u=this.getActivatedValues(i,y),u){const w=u.get(y);this.updateElement(s,y,w)}else this.clearElement(s,y)})})}clearElement(i,s){const n=this.clearMap.get(i);if(n){const u=n.get(s);u&&(u(),this.subject.next({element:i,key:s,value:""}))}}updateElement(i,s,n){const u=this.updateMap.get(i);if(u){const y=u.get(s);y&&(y(n),this.subject.next({element:i,key:s,value:n}))}}releaseElement(i){const s=this.watcherMap.get(i);s&&(s.forEach(u=>u.unsubscribe()),this.watcherMap.delete(i));const n=this.elementMap.get(i);n&&(n.forEach((u,y)=>n.delete(y)),this.elementMap.delete(i))}triggerUpdate(i,s){const n=this.elementMap.get(i);if(n){const u=this.getActivatedValues(n,s);u&&(s?this.updateElement(i,s,u.get(s)):u.forEach((y,w)=>this.updateElement(i,w,y)))}}buildElementKeyMap(i,s){let n=this.elementKeyMap.get(i);n||(n=new Set,this.elementKeyMap.set(i,n)),n.add(s)}watchExtraTriggers(i,s,n){if(n&&n.length){let u=this.watcherMap.get(i);if(u||(u=new Map,this.watcherMap.set(i,u)),!u.get(s)){const w=(0,Q.T)(...n).subscribe(()=>{const r=this.getValue(i,s);this.updateElement(i,s,r)});u.set(s,w)}}}findByQuery(i){return this.breakpoints.findByQuery(i)}getActivatedValues(i,s){for(let u=0;u<this.activatedBreakpoints.length;u++){const w=i.get(this.activatedBreakpoints[u].alias);if(w&&(void 0===s||w.has(s)&&null!=w.get(s)))return w}if(!this._useFallbacks)return;const n=i.get("");return void 0===s||n&&n.has(s)?n:void 0}observeActivations(){const i=this.breakpoints.items.map(s=>s.mediaQuery);this.hook.registerBeforeAfterPrintHooks(this),this.matchMedia.observe(this.hook.withPrintQuery(i)).pipe((0,nt.b)(this.hook.interceptEvents(this)),(0,$.h)(this.hook.blockPropagation())).subscribe(this.onMediaChange.bind(this))}}return g.\u0275fac=function(i){return new(i||g)(t.LFG(q),t.LFG(U),t.LFG(bt))},g.\u0275prov=t.Yz7({token:g,factory:g.\u0275fac,providedIn:"root"}),g})();function ct(g,c,i,s){var n;if(void 0!==s){const u=null!==(n=g.get(c))&&void 0!==n?n:new Map;u.set(i,s),g.set(c,u)}}let It=(()=>{class g{constructor(i,s,n,u){this.elementRef=i,this.styleBuilder=s,this.styler=n,this.marshal=u,this.DIRECTIVE_KEY="",this.inputs=[],this.mru={},this.destroySubject=new I.x,this.styleCache=new Map}get parentElement(){return this.elementRef.nativeElement.parentElement}get nativeElement(){return this.elementRef.nativeElement}get activatedValue(){return this.marshal.getValue(this.nativeElement,this.DIRECTIVE_KEY)}set activatedValue(i){this.marshal.setValue(this.nativeElement,this.DIRECTIVE_KEY,i,this.marshal.activatedAlias)}ngOnChanges(i){Object.keys(i).forEach(s=>{if(-1!==this.inputs.indexOf(s)){const n=s.split(".").slice(1).join(".");this.setValue(i[s].currentValue,n)}})}ngOnDestroy(){this.destroySubject.next(),this.destroySubject.complete(),this.marshal.releaseElement(this.nativeElement)}init(i=[]){this.marshal.init(this.elementRef.nativeElement,this.DIRECTIVE_KEY,this.updateWithValue.bind(this),this.clearStyles.bind(this),i)}addStyles(i,s){const n=this.styleBuilder,u=n.shouldCache;let y=this.styleCache.get(i);(!y||!u)&&(y=n.buildStyles(i,s),u&&this.styleCache.set(i,y)),this.mru=Object.assign({},y),this.applyStyleToElement(y),n.sideEffect(i,y,s)}clearStyles(){Object.keys(this.mru).forEach(i=>{this.mru[i]=""}),this.applyStyleToElement(this.mru),this.mru={},this.currentValue=void 0}triggerUpdate(){this.marshal.triggerUpdate(this.nativeElement,this.DIRECTIVE_KEY)}getFlexFlowDirection(i,s=!1){if(i){const[n,u]=this.styler.getFlowDirection(i);if(!u&&s){const y=(0,P.Ar)(n);this.styler.applyStyleToElements(y,[i])}return n.trim()}return"row"}hasWrap(i){return this.styler.hasWrap(i)}applyStyleToElement(i,s,n=this.nativeElement){this.styler.applyStyleToElement(n,i,s)}setValue(i,s){this.marshal.setValue(this.nativeElement,this.DIRECTIVE_KEY,i,s)}updateWithValue(i){this.currentValue!==i&&(this.addStyles(i),this.currentValue=i)}}return g.\u0275fac=function(i){return new(i||g)(t.Y36(t.SBq),t.Y36(At),t.Y36(ot),t.Y36(Vt))},g.\u0275dir=t.lG2({type:g,features:[t.TTD]}),g})();function kt(g,c="1",i="1"){let s=[c,i,g],n=g.indexOf("calc");if(n>0){s[2]=mt(g.substring(n).trim());let u=g.substr(0,n).trim().split(" ");2==u.length&&(s[0]=u[0],s[1]=u[1])}else if(0==n)s[2]=mt(g.trim());else{let u=g.split(" ");s=3===u.length?u:[c,i,g]}return s}function mt(g){return g.replace(/[\s]/g,"").replace(/[\/\*\+\-]/g," $& ")}function Yt(g,c){if(void 0===c)return g;const i=s=>{const n=+s.slice(0,-"x".length);return g.endsWith("x")&&!isNaN(n)?`${n*c.value}${c.unit}`:g};return g.includes(" ")?g.split(" ").map(i).join(" "):i(g)}},7093:(qt,Z,M)=>{M.d(Z,{SQ:()=>J,ae:()=>w,xw:()=>G,yH:()=>Ft});var t=M(5e3),m=M(226),A=M(3270),R=M(9042),Q=M(7579),I=M(2722);let P=(()=>{class r extends A.QI{buildStyles(o,{display:f}){const x=(0,R.Ar)(o);return Object.assign(Object.assign({},x),{display:"none"===f?f:x.display})}}return r.\u0275fac=function(){let h;return function(f){return(h||(h=t.n5z(r)))(f||r)}}(),r.\u0275prov=t.Yz7({token:r,factory:r.\u0275fac,providedIn:"root"}),r})();const $=["fxLayout","fxLayout.xs","fxLayout.sm","fxLayout.md","fxLayout.lg","fxLayout.xl","fxLayout.lt-sm","fxLayout.lt-md","fxLayout.lt-lg","fxLayout.lt-xl","fxLayout.gt-xs","fxLayout.gt-sm","fxLayout.gt-md","fxLayout.gt-lg"];let D=(()=>{class r extends A.iR{constructor(o,f,x,p,S){super(o,x,f,p),this._config=S,this.DIRECTIVE_KEY="layout",this.init()}updateWithValue(o){var f;const p=this._config.detectLayoutDisplay?this.styler.lookupStyle(this.nativeElement,"display"):"";this.styleCache=null!==(f=_.get(p))&&void 0!==f?f:new Map,_.set(p,this.styleCache),this.currentValue!==o&&(this.addStyles(o,{display:p}),this.currentValue=o)}}return r.\u0275fac=function(o){return new(o||r)(t.Y36(t.SBq),t.Y36(A.RK),t.Y36(P),t.Y36(A.yB),t.Y36(A.WU))},r.\u0275dir=t.lG2({type:r,features:[t.qOj]}),r})(),G=(()=>{class r extends D{constructor(){super(...arguments),this.inputs=$}}return r.\u0275fac=function(){let h;return function(f){return(h||(h=t.n5z(r)))(f||r)}}(),r.\u0275dir=t.lG2({type:r,selectors:[["","fxLayout",""],["","fxLayout.xs",""],["","fxLayout.sm",""],["","fxLayout.md",""],["","fxLayout.lg",""],["","fxLayout.xl",""],["","fxLayout.lt-sm",""],["","fxLayout.lt-md",""],["","fxLayout.lt-lg",""],["","fxLayout.lt-xl",""],["","fxLayout.gt-xs",""],["","fxLayout.gt-sm",""],["","fxLayout.gt-md",""],["","fxLayout.gt-lg",""]],inputs:{fxLayout:"fxLayout","fxLayout.xs":"fxLayout.xs","fxLayout.sm":"fxLayout.sm","fxLayout.md":"fxLayout.md","fxLayout.lg":"fxLayout.lg","fxLayout.xl":"fxLayout.xl","fxLayout.lt-sm":"fxLayout.lt-sm","fxLayout.lt-md":"fxLayout.lt-md","fxLayout.lt-lg":"fxLayout.lt-lg","fxLayout.lt-xl":"fxLayout.lt-xl","fxLayout.gt-xs":"fxLayout.gt-xs","fxLayout.gt-sm":"fxLayout.gt-sm","fxLayout.gt-md":"fxLayout.gt-md","fxLayout.gt-lg":"fxLayout.gt-lg"},features:[t.qOj]}),r})();const _=new Map,E={"margin-left":null,"margin-right":null,"margin-top":null,"margin-bottom":null};let b=(()=>{class r extends A.QI{constructor(o,f){super(),this._styler=o,this._config=f}buildStyles(o,f){return o.endsWith(W)?(o=o.slice(0,o.indexOf(W)),function vt(r,h){const[o,f]=r.split(" "),p=H=>`-${H}`;let S="0px",C=p(null!=f?f:o),k="0px";return"rtl"===h?k=p(o):S=p(o),{margin:`0px ${S} ${C} ${k}`}}(o=(0,A.FL)(o,this._config.multiplier),f.directionality)):{}}sideEffect(o,f,x){const p=x.items;if(o.endsWith(W)){o=o.slice(0,o.indexOf(W));const S=function dt(r,h){const[o,f]=r.split(" ");let p="0px",C="0px";return"rtl"===h?C=o:p=o,{padding:`0px ${p} ${null!=f?f:o} ${C}`}}(o=(0,A.FL)(o,this._config.multiplier),x.directionality);this._styler.applyStyleToElements(S,x.items)}else{o=(0,A.FL)(o,this._config.multiplier),o=this.addFallbackUnit(o);const S=p.pop(),C=function j(r,h){const o=X(h.directionality,h.layout),f=Object.assign({},E);return f[o]=r,f}(o,x);this._styler.applyStyleToElements(C,p),this._styler.applyStyleToElements(E,[S])}}addFallbackUnit(o){return isNaN(+o)?o:`${o}${this._config.defaultUnit}`}}return r.\u0275fac=function(o){return new(o||r)(t.LFG(A.RK),t.LFG(A.WU))},r.\u0275prov=t.Yz7({token:r,factory:r.\u0275fac,providedIn:"root"}),r})();const rt=["fxLayoutGap","fxLayoutGap.xs","fxLayoutGap.sm","fxLayoutGap.md","fxLayoutGap.lg","fxLayoutGap.xl","fxLayoutGap.lt-sm","fxLayoutGap.lt-md","fxLayoutGap.lt-lg","fxLayoutGap.lt-xl","fxLayoutGap.gt-xs","fxLayoutGap.gt-sm","fxLayoutGap.gt-md","fxLayoutGap.gt-lg"];let z=(()=>{class r extends A.iR{constructor(o,f,x,p,S,C){super(o,S,p,C),this.zone=f,this.directionality=x,this.styleUtils=p,this.layout="row",this.DIRECTIVE_KEY="layout-gap",this.observerSubject=new Q.x;const k=[this.directionality.change,this.observerSubject.asObservable()];this.init(k),this.marshal.trackValue(this.nativeElement,"layout").pipe((0,I.R)(this.destroySubject)).subscribe(this.onLayoutChange.bind(this))}get childrenNodes(){const o=this.nativeElement.children,f=[];for(let x=o.length;x--;)f[x]=o[x];return f}ngAfterContentInit(){this.buildChildObservable(),this.triggerUpdate()}ngOnDestroy(){super.ngOnDestroy(),this.observer&&this.observer.disconnect()}onLayoutChange(o){const x=o.value.split(" ");this.layout=x[0],R.iQ.find(p=>p===this.layout)||(this.layout="row"),this.triggerUpdate()}updateWithValue(o){const f=this.childrenNodes.filter(x=>1===x.nodeType&&this.willDisplay(x)).sort((x,p)=>{const S=+this.styler.lookupStyle(x,"order"),C=+this.styler.lookupStyle(p,"order");return isNaN(S)||isNaN(C)||S===C?0:S>C?1:-1});if(f.length>0){const x=this.directionality.value,p=this.layout;"row"===p&&"rtl"===x?this.styleCache=K:"row"===p&&"rtl"!==x?this.styleCache=At:"column"===p&&"rtl"===x?this.styleCache=at:"column"===p&&"rtl"!==x&&(this.styleCache=ot),this.addStyles(o,{directionality:x,items:f,layout:p})}}clearStyles(){const o=Object.keys(this.mru).length>0,f=o?"padding":X(this.directionality.value,this.layout);o&&super.clearStyles(),this.styleUtils.applyStyleToElements({[f]:""},this.childrenNodes)}willDisplay(o){const f=this.marshal.getValue(o,"show-hide");return!0===f||void 0===f&&"none"!==this.styleUtils.lookupStyle(o,"display")}buildChildObservable(){this.zone.runOutsideAngular(()=>{"undefined"!=typeof MutationObserver&&(this.observer=new MutationObserver(o=>{o.some(x=>x.addedNodes&&x.addedNodes.length>0||x.removedNodes&&x.removedNodes.length>0)&&this.observerSubject.next()}),this.observer.observe(this.nativeElement,{childList:!0}))})}}return r.\u0275fac=function(o){return new(o||r)(t.Y36(t.SBq),t.Y36(t.R0b),t.Y36(m.Is),t.Y36(A.RK),t.Y36(b),t.Y36(A.yB))},r.\u0275dir=t.lG2({type:r,features:[t.qOj]}),r})(),J=(()=>{class r extends z{constructor(){super(...arguments),this.inputs=rt}}return r.\u0275fac=function(){let h;return function(f){return(h||(h=t.n5z(r)))(f||r)}}(),r.\u0275dir=t.lG2({type:r,selectors:[["","fxLayoutGap",""],["","fxLayoutGap.xs",""],["","fxLayoutGap.sm",""],["","fxLayoutGap.md",""],["","fxLayoutGap.lg",""],["","fxLayoutGap.xl",""],["","fxLayoutGap.lt-sm",""],["","fxLayoutGap.lt-md",""],["","fxLayoutGap.lt-lg",""],["","fxLayoutGap.lt-xl",""],["","fxLayoutGap.gt-xs",""],["","fxLayoutGap.gt-sm",""],["","fxLayoutGap.gt-md",""],["","fxLayoutGap.gt-lg",""]],inputs:{fxLayoutGap:"fxLayoutGap","fxLayoutGap.xs":"fxLayoutGap.xs","fxLayoutGap.sm":"fxLayoutGap.sm","fxLayoutGap.md":"fxLayoutGap.md","fxLayoutGap.lg":"fxLayoutGap.lg","fxLayoutGap.xl":"fxLayoutGap.xl","fxLayoutGap.lt-sm":"fxLayoutGap.lt-sm","fxLayoutGap.lt-md":"fxLayoutGap.lt-md","fxLayoutGap.lt-lg":"fxLayoutGap.lt-lg","fxLayoutGap.lt-xl":"fxLayoutGap.lt-xl","fxLayoutGap.gt-xs":"fxLayoutGap.gt-xs","fxLayoutGap.gt-sm":"fxLayoutGap.gt-sm","fxLayoutGap.gt-md":"fxLayoutGap.gt-md","fxLayoutGap.gt-lg":"fxLayoutGap.gt-lg"},features:[t.qOj]}),r})();const K=new Map,at=new Map,At=new Map,ot=new Map,W=" grid";function X(r,h){switch(h){case"column":return"margin-bottom";case"column-reverse":return"margin-top";case"row":default:return"rtl"===r?"margin-left":"margin-right";case"row-reverse":return"rtl"===r?"margin-right":"margin-left"}}let gt=(()=>{class r extends A.QI{constructor(o){super(),this.layoutConfig=o}buildStyles(o,f){let[x,p,...S]=o.split(" "),C=S.join(" ");const k=f.direction.indexOf("column")>-1?"column":"row",H=(0,R.tj)(k)?"max-width":"max-height",yt=(0,R.tj)(k)?"min-width":"min-height",Y=String(C).indexOf("calc")>-1,Xt=Y||"auto"===C,Ut=String(C).indexOf("%")>-1&&!Y,Nt=String(C).indexOf("px")>-1||String(C).indexOf("rem")>-1||String(C).indexOf("em")>-1||String(C).indexOf("vw")>-1||String(C).indexOf("vh")>-1;let lt=Y||Nt;x="0"==x?0:x,p="0"==p?0:p;const Wt=!x&&!p;let L={};const N={"max-width":null,"max-height":null,"min-width":null,"min-height":null};switch(C||""){case"":const te=!1!==this.layoutConfig.useColumnBasisZero;C="row"===k?"0%":te?"0.000000001px":"auto";break;case"initial":case"nogrow":x=0,C="auto";break;case"grow":C="100%";break;case"noshrink":p=0,C="auto";break;case"auto":break;case"none":x=0,p=0,C="auto";break;default:!lt&&!Ut&&!isNaN(C)&&(C+="%"),"0%"===C&&(lt=!0),"0px"===C&&(C="0%"),L=(0,R.kt)(N,Y?{"flex-grow":x,"flex-shrink":p,"flex-basis":lt?C:"100%"}:{flex:`${x} ${p} ${lt?C:"100%"}`})}return L.flex||L["flex-grow"]||(L=(0,R.kt)(N,Y?{"flex-grow":x,"flex-shrink":p,"flex-basis":C}:{flex:`${x} ${p} ${C}`})),"0%"!==C&&"0px"!==C&&"0.000000001px"!==C&&"auto"!==C&&(L[yt]=Wt||lt&&x?C:null,L[H]=Wt||!Xt&&p?C:null),L[yt]||L[H]?f.hasWrap&&(L[Y?"flex-basis":"flex"]=L[H]?Y?L[H]:`${x} ${p} ${L[H]}`:Y?L[yt]:`${x} ${p} ${L[yt]}`):L=(0,R.kt)(N,Y?{"flex-grow":x,"flex-shrink":p,"flex-basis":C}:{flex:`${x} ${p} ${C}`}),(0,R.kt)(L,{"box-sizing":"border-box"})}}return r.\u0275fac=function(o){return new(o||r)(t.LFG(A.WU))},r.\u0275prov=t.Yz7({token:r,factory:r.\u0275fac,providedIn:"root"}),r})();const q=["fxFlex","fxFlex.xs","fxFlex.sm","fxFlex.md","fxFlex.lg","fxFlex.xl","fxFlex.lt-sm","fxFlex.lt-md","fxFlex.lt-lg","fxFlex.lt-xl","fxFlex.gt-xs","fxFlex.gt-sm","fxFlex.gt-md","fxFlex.gt-lg"];let Ct=(()=>{class r extends A.iR{constructor(o,f,x,p,S){super(o,p,f,S),this.layoutConfig=x,this.marshal=S,this.DIRECTIVE_KEY="flex",this.direction=void 0,this.wrap=void 0,this.flexGrow="1",this.flexShrink="1",this.init()}get shrink(){return this.flexShrink}set shrink(o){this.flexShrink=o||"1",this.triggerReflow()}get grow(){return this.flexGrow}set grow(o){this.flexGrow=o||"1",this.triggerReflow()}ngOnInit(){this.parentElement&&(this.marshal.trackValue(this.parentElement,"layout").pipe((0,I.R)(this.destroySubject)).subscribe(this.onLayoutChange.bind(this)),this.marshal.trackValue(this.nativeElement,"layout-align").pipe((0,I.R)(this.destroySubject)).subscribe(this.triggerReflow.bind(this)))}onLayoutChange(o){const x=o.value.split(" ");this.direction=x[0],this.wrap=void 0!==x[1]&&"wrap"===x[1],this.triggerUpdate()}updateWithValue(o){void 0===this.direction&&(this.direction=this.getFlexFlowDirection(this.parentElement,!1!==this.layoutConfig.addFlexToParent)),void 0===this.wrap&&(this.wrap=this.hasWrap(this.parentElement));const x=this.direction,p=x.startsWith("row"),S=this.wrap;p&&S?this.styleCache=St:p&&!S?this.styleCache=Dt:!p&&S?this.styleCache=et:!p&&!S&&(this.styleCache=tt);const C=String(o).replace(";",""),k=(0,A.Ot)(C,this.flexGrow,this.flexShrink);this.addStyles(k.join(" "),{direction:x,hasWrap:S})}triggerReflow(){const o=this.activatedValue;if(void 0!==o){const f=(0,A.Ot)(o+"",this.flexGrow,this.flexShrink);this.marshal.updateElement(this.nativeElement,this.DIRECTIVE_KEY,f.join(" "))}}}return r.\u0275fac=function(o){return new(o||r)(t.Y36(t.SBq),t.Y36(A.RK),t.Y36(A.WU),t.Y36(gt),t.Y36(A.yB))},r.\u0275dir=t.lG2({type:r,inputs:{shrink:["fxShrink","shrink"],grow:["fxGrow","grow"]},features:[t.qOj]}),r})(),Ft=(()=>{class r extends Ct{constructor(){super(...arguments),this.inputs=q}}return r.\u0275fac=function(){let h;return function(f){return(h||(h=t.n5z(r)))(f||r)}}(),r.\u0275dir=t.lG2({type:r,selectors:[["","fxFlex",""],["","fxFlex.xs",""],["","fxFlex.sm",""],["","fxFlex.md",""],["","fxFlex.lg",""],["","fxFlex.xl",""],["","fxFlex.lt-sm",""],["","fxFlex.lt-md",""],["","fxFlex.lt-lg",""],["","fxFlex.lt-xl",""],["","fxFlex.gt-xs",""],["","fxFlex.gt-sm",""],["","fxFlex.gt-md",""],["","fxFlex.gt-lg",""]],inputs:{fxFlex:"fxFlex","fxFlex.xs":"fxFlex.xs","fxFlex.sm":"fxFlex.sm","fxFlex.md":"fxFlex.md","fxFlex.lg":"fxFlex.lg","fxFlex.xl":"fxFlex.xl","fxFlex.lt-sm":"fxFlex.lt-sm","fxFlex.lt-md":"fxFlex.lt-md","fxFlex.lt-lg":"fxFlex.lt-lg","fxFlex.lt-xl":"fxFlex.lt-xl","fxFlex.gt-xs":"fxFlex.gt-xs","fxFlex.gt-sm":"fxFlex.gt-sm","fxFlex.gt-md":"fxFlex.gt-md","fxFlex.gt-lg":"fxFlex.gt-lg"},features:[t.qOj]}),r})();const Dt=new Map,tt=new Map,St=new Map,et=new Map;let w=(()=>{class r{}return r.\u0275fac=function(o){return new(o||r)},r.\u0275mod=t.oAB({type:r}),r.\u0275inj=t.cJS({imports:[[A.IR,m.vT]]}),r})()},9764:(qt,Z,M)=>{M.d(Z,{o9:()=>be});var t=M(5e3),m=M(3270),A=M(9808);M(3191),M(2722),M(2313);let et=(()=>{class e{}return e.\u0275fac=function(l){return new(l||e)},e.\u0275mod=t.oAB({type:e}),e.\u0275inj=t.cJS({imports:[[m.IR]]}),e})();var it=M(7093);let se=(()=>{class e{}return e.\u0275fac=function(l){return new(l||e)},e.\u0275mod=t.oAB({type:e}),e.\u0275inj=t.cJS({imports:[[m.IR]]}),e})(),be=(()=>{class e{constructor(l,d){(0,A.PM)(d)&&!l&&console.warn("Warning: Flex Layout loaded on the server without FlexLayoutServerModule")}static withConfig(l,d=[]){return{ngModule:e,providers:l.serverLoaded?[{provide:m.WU,useValue:Object.assign(Object.assign({},m.g5),l)},{provide:m.Bs,useValue:d,multi:!0},{provide:m.wY,useValue:!0}]:[{provide:m.WU,useValue:Object.assign(Object.assign({},m.g5),l)},{provide:m.Bs,useValue:d,multi:!0}]}}}return e.\u0275fac=function(l){return new(l||e)(t.LFG(m.wY),t.LFG(t.Lbi))},e.\u0275mod=t.oAB({type:e}),e.\u0275inj=t.cJS({imports:[[it.ae,et,se],it.ae,et,se]}),e})()}}]);