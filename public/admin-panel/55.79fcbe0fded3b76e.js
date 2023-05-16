"use strict";(self.webpackChunkadmin_panel=self.webpackChunkadmin_panel||[]).push([[55],{1055:(_,h,a)=>{a.r(h),a.d(h,{CategoryHeadingModule:()=>U});var c=a(6895),v=a(1048),e=a(4650),m=a(2502),f=a(9808),g=a(529);let l=(()=>{class n{constructor(t){this.http=t}addHeading(t,i){return(0,f.n)(this.http.patch(`${m.N.apiUrl}/dynamic-heading/${t}`,i))}getHeading(){return this.http.get(`${m.N.apiUrl}/dynamic-heading`)}}return n.\u0275fac=function(t){return new(t||n)(e.LFG(g.eN))},n.\u0275prov=e.Yz7({token:n,factory:n.\u0275fac,providedIn:"root"}),n})();var s=a(9812),u=a(5861),o=a(4006),p=a(605);function b(n,r){1&n&&e._UZ(0,"span",18)}function C(n,r){if(1&n){const t=e.EpF();e.TgZ(0,"div",8)(1,"form",9),e.NdJ("ngSubmit",function(){e.CHM(t);const d=e.oxw();return e.KtG(d.onFormSubmit(d.form.value))}),e.TgZ(2,"div",10)(3,"div",11)(4,"div",12)(5,"label",13),e._uU(6,"Heading Name"),e.qZA(),e._UZ(7,"input",14)(8,"app-input-error",15),e.qZA()()(),e._UZ(9,"br"),e.TgZ(10,"button",16),e.YNc(11,b,1,0,"span",17),e._uU(12," Save "),e.qZA()()()}if(2&n){const t=e.oxw();let i;e.xp6(1),e.Q6J("formGroup",t.form),e.xp6(6),e.Q6J("ngClass",null!=(i=t.form.get("name"))&&i.touched?null!=(i=t.form.get("heading"))&&i.hasError("required")?"is-invalid":"is-valid":""),e.xp6(1),e.Q6J("control",t.form.get("heading"))("fieldName","Heading Name"),e.xp6(2),e.Q6J("disabled",t.isFormSubmitted),e.xp6(1),e.Q6J("ngIf",t.isFormSubmitted)}}let y=(()=>{class n{constructor(t,i,d){this.fb=t,this.headingService=i,this.uiService=d,this.isFormSubmitted=!1}ngOnInit(){this.initForm()}initForm(){this.form=this.fb.group({_id:[null],heading:[null,[o.kI.required,o.kI.maxLength(50)]]}),this.subscription=this.uiService.onModalDataChange().subscribe(t=>{t?.category?._id&&this.form.setValue({_id:t?.category?._id??null,heading:t?.category?.heading})})}onFormSubmit(t){var i=this;return(0,u.Z)(function*(){if(i.form.invalid)i.form.markAllAsTouched();else{i.isFormSubmitted=!0;try{let d=yield i.headingService.addHeading(t._id,t);i.form.reset({status:!1}),i.uiService.openSnackbar(d.message),i.onModalClose(!0)}catch{}finally{i.isFormSubmitted=!1}}})()}onModalClose(t){this.uiService.closeModal("#edit_specialities_details",t)}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(o.qu),e.Y36(l),e.Y36(s.F))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-update-heading"]],decls:10,vars:1,consts:[["id","edit_specialities_details","aria-hidden","true","role","dialog",1,"modal","fade"],["role","document",1,"modal-dialog","modal-lg","modal-dialog-centered"],[1,"modal-content"],[1,"modal-header"],[1,"modal-title"],["type","button","data-dismiss","modal","aria-label","Close",1,"close",3,"click"],["aria-hidden","true"],["class","modal-body",4,"ngIf"],[1,"modal-body"],[3,"formGroup","ngSubmit"],[1,"row","form-row"],[1,"col-12"],[1,"form-group"],["for","validationServer01",1,"required-label"],["maxlength","50","type","text","id","validationServer01","placeholder","Heading Name","required","","formControlName","heading",1,"form-control",3,"ngClass"],[3,"control","fieldName"],["type","submit",1,"btn","btn-primary","btn-block",3,"disabled"],["class","spinner-border spinner-border-sm mr-2","role","status",4,"ngIf"],["role","status",1,"spinner-border","spinner-border-sm","mr-2"]],template:function(t,i){1&t&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"h5",4),e._uU(5,"Edit Heading"),e.qZA(),e.TgZ(6,"button",5),e.NdJ("click",function(){return i.onModalClose(!1)}),e.TgZ(7,"span",6),e._uU(8,"\xd7"),e.qZA()()(),e.YNc(9,C,13,6,"div",7),e.qZA()()()),2&t&&(e.xp6(9),e.Q6J("ngIf",i.form))},dependencies:[c.mk,c.O5,o._Y,o.Fj,o.JJ,o.JL,o.Q7,o.nD,o.sg,o.u,p.w]}),n})();function Z(n,r){if(1&n){const t=e.EpF();e.TgZ(0,"tr",15)(1,"td",19),e._uU(2),e.qZA(),e.TgZ(3,"td",19),e._uU(4),e.qZA(),e.TgZ(5,"td",17)(6,"div",20)(7,"button",21),e.NdJ("click",function(){const x=e.CHM(t).$implicit,F=e.oxw();return e.KtG(F.onEdit(x))}),e._UZ(8,"i",22),e._uU(9," Edit "),e.qZA()()()()}if(2&n){const t=r.$implicit,i=r.index;e.xp6(2),e.Oqu(i+1),e.xp6(2),e.Oqu(null==t?null:t.heading)}}const T=[{path:"",component:(()=>{class n{constructor(t,i){this.headdingService=t,this.uiService=i}ngOnInit(){this.getHeading()}getHeading(){this.headdingService.getHeading().subscribe(t=>{this.headingData=t.data})}onEdit(t){let i;i=this.uiService.openModal("#edit_specialities_details",{category:t}),i.afterClose.subscribe(d=>{d&&this.getHeading()})}}return n.\u0275fac=function(t){return new(t||n)(e.Y36(l),e.Y36(s.F))},n.\u0275cmp=e.Xpm({type:n,selectors:[["app-list"]],decls:31,vars:1,consts:[[1,"page-wrapper"],[1,"content","container-fluid"],[1,"page-header"],[1,"row"],[1,"col-sm-7","col-auto"],[1,"page-title"],[1,"col-sm-12"],[1,"card"],[1,"card-body"],["id","DataTables_Table_0_wrapper",1,"dataTables_wrapper","dt-bootstrap4","no-footer"],[1,"row","w-100"],[1,"col"],[1,"d-flex","align-content-center","float-right"],[1,"table-responsive"],["id","DataTables_Table_0","role","grid","aria-describedby","DataTables_Table_0_info",1,"table","table-hover","table-center","mb-0","dataTable","no-footer","table-bordered","table-bordered"],["role","row"],[1,"text-center",2,"width","200px"],[1,"text-right"],["role","row",4,"ngFor","ngForOf"],[1,"text-center"],[1,"actions"],["data-toggle","modal",1,"btn","btn-sm","btn-outline-success",3,"click"],[1,"fe","fe-pencil"]],template:function(t,i){1&t&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"div",4)(5,"h3",5),e._uU(6,"Heading"),e.qZA()()()(),e.TgZ(7,"div",3)(8,"div",6)(9,"div",7)(10,"div",8)(11,"div",9)(12,"div",10)(13,"div",11),e._UZ(14,"div",12),e.qZA()(),e.TgZ(15,"div",3)(16,"div",6)(17,"div",13)(18,"table",14)(19,"thead")(20,"tr",15)(21,"th",16),e._uU(22,"Sr. No."),e.qZA(),e.TgZ(23,"th",16),e._uU(24,"Heading"),e.qZA(),e.TgZ(25,"th",17),e._uU(26,"Actions \xa0"),e.qZA()()(),e.TgZ(27,"tbody"),e.ynx(28),e.YNc(29,Z,10,2,"tr",18),e.BQk(),e.qZA()()()()()()()()()()()(),e._UZ(30,"app-update-heading")),2&t&&(e.xp6(29),e.Q6J("ngForOf",null==i.headingData?null:i.headingData.docs))},dependencies:[c.sg,y]}),n})()},{path:"update",component:y}];let H=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[v.Bz.forChild(T),v.Bz]}),n})();var S=a(6738);let U=(()=>{class n{}return n.\u0275fac=function(t){return new(t||n)},n.\u0275mod=e.oAB({type:n}),n.\u0275inj=e.cJS({imports:[c.ez,o.UX,S.a,H]}),n})()},9808:(_,h,a)=>{a.d(h,{n:()=>v});var c=a(6805);function v(e,m){const f="object"==typeof m;return new Promise((g,l)=>{let u,s=!1;e.subscribe({next:o=>{u=o,s=!0},error:l,complete:()=>{s?g(u):f?g(m.defaultValue):l(new c.K)}})})}},5861:(_,h,a)=>{function c(e,m,f,g,l,s,u){try{var o=e[s](u),p=o.value}catch(b){return void f(b)}o.done?m(p):Promise.resolve(p).then(g,l)}function v(e){return function(){var m=this,f=arguments;return new Promise(function(g,l){var s=e.apply(m,f);function u(p){c(s,g,l,u,o,"next",p)}function o(p){c(s,g,l,u,o,"throw",p)}u(void 0)})}}a.d(h,{Z:()=>v})}}]);