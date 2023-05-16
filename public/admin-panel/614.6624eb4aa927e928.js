"use strict";(self.webpackChunkadmin_panel=self.webpackChunkadmin_panel||[]).push([[614],{7614:(Ce,A,a)=>{a.r(A),a.d(A,{SliderModule:()=>Ze});var m=a(6895),Z=a(529),l=a(4006),_=a(1048),v=a(5861),y=a(5120),e=a(4650),x=a(9812),S=a(2502);let b=(()=>{class r{constructor(t){this.http=t}uploadFiles(t,i){const o=new FormData;for(let u=0;u<t?.length;u++)o.append("images",t[u].file);let s=`${S.N.apiUrl}/slider`;return s+=i?"/long-file":"/short-file",console.log(s),this.http.post(`${s}`,o)}fetchSliders(){return this.http.get(`${S.N.apiUrl}/slider`)}addSlider(t,i){var o=this;return(0,v.Z)(function*(){try{let s=[],u=[],g=0;for(let c of t.slides)"object"==typeof c.image&&s.push({index:g,file:c.image}),g++;if(s.length){let c=(yield o.uploadFiles(s,i).toPromise())?.data;s=s.map((p,d)=>(p.image=c[d].Location,p))}return u=t.slides.map((c,p)=>{let d=s.find(f=>f.index==p);return c.image&&d&&(c.image=d.image),c}),o.http.post(`${S.N.apiUrl}/slider`,{tag:t.tag,slides:u}).toPromise()}catch(s){throw s}})()}updateSlider(t,i,o,s){var u=this;return(0,v.Z)(function*(){try{let g=[],c=[],p=0;for(let d of i.slides)"object"==typeof d.image&&null!=d.image&&g.push({index:p,file:d.image}),p++;if(g.length){let d=(yield u.uploadFiles(g,s).toPromise())?.data;g=g.map((f,h)=>(f.image={xlg:d[h].xlg,lg:d[h].lg,md:d[h].md,sm:d[h].sm,original:d[h].original},f))}return c=i.slides.map((d,f)=>{let h=g.find(N=>N.index==f);return d.image&&h&&(d.image=h.image),d}),c=c.map((d,f)=>(d.image||(d.image=t.slides[f].image),d)),u.http.put(`${S.N.apiUrl}/slider`,{[o]:{slides:c}}).toPromise()}catch(g){throw g}})()}deleteSlider(t){return this.http.delete(`${S.N.apiUrl}/slider/${t}`)}}return r.\u0275fac=function(t){return new(t||r)(e.LFG(Z.eN))},r.\u0275prov=e.Yz7({token:r,factory:r.\u0275fac,providedIn:"root"}),r})();var C=a(3877),I=a(8036),U=a(605),w=a(4654),F=a(3887),Q=a(6093);function Y(r,n){if(1&r){const t=e.EpF();e.TgZ(0,"div",22)(1,"button",23),e.NdJ("click",function(){e.CHM(t);const o=e.oxw();return e.KtG(o.removeSlide(o.fgIndex))}),e._UZ(2,"i",24),e.qZA()()}}function L(r,n){if(1&r){const t=e.EpF();e.TgZ(0,"button",25),e.NdJ("click",function(){e.CHM(t),e.oxw();const o=e.MAs(25);return e.KtG(o.click())}),e._UZ(1,"i",26),e._uU(2," Pick Image "),e.qZA()}}function k(r,n){if(1&r&&(e.TgZ(0,"div",20),e._UZ(1,"app-input-error",27),e.qZA()),2&r){const t=e.oxw();e.xp6(1),e.Q6J("control",t.fg.get("image"))("fieldName","Images")}}function O(r,n){if(1&r&&(e.ynx(0),e.TgZ(1,"a",33),e._UZ(2,"img",34),e.qZA(),e.BQk()),2&r){const t=e.oxw(2);e.xp6(1),e.Q6J("href",t.slideSrc.image,e.LSH),e.xp6(1),e.Q6J("src",t.slideSrc.image||"assets/error.png",e.LSH)}}function M(r,n){if(1&r&&(e.ynx(0),e._UZ(1,"video",35),e.BQk()),2&r){const t=e.oxw(2);e.xp6(1),e.Q6J("src",t.slideSrc.image||"assets/error.png",e.LSH)}}function q(r,n){if(1&r){const t=e.EpF();e.TgZ(0,"div",28)(1,"div",29),e.YNc(2,O,3,2,"ng-container",30),e.YNc(3,M,2,1,"ng-container",30),e.TgZ(4,"div",31),e.NdJ("click",function(){e.CHM(t);const o=e.oxw();return e.KtG(o.removeSlideSrc(o.fgIndex))}),e._UZ(5,"i",32),e.qZA()()()}if(2&r){const t=e.oxw();e.xp6(2),e.Q6J("ngIf",t.slideSrc.isImg),e.xp6(1),e.Q6J("ngIf",!t.slideSrc.isImg)}}let J=(()=>{class r{constructor(t,i){this.uiService=t,this.productService=i,this.removeOneSlide=new e.vpe,this.removeOneSlideSrc=new e.vpe,this.subCategories=[],this.childCategories=[],this.products=[]}ngOnInit(){this.setSlideInfo(),this.getProducts()}getProducts(){this.productService.fetchProducts().subscribe(t=>{this.products=t.data.docs})}setSlideInfo(){!this.slideInfo||(this.slideSrc={isImg:this.slideInfo?.isImg,image:this.slideInfo?.image.original})}chooseFile(t,i,o){const s=t.target?.files;if(console.log({fileInfo:s}),!s?.length)return void alert("Please enter valid Image Files like png,jpeg,jpg");if(!F.KL.includes(s[0].type))return void this.uiService.openSnackbar("Please enter valid image file");const g=window.URL||window.webkitURL,c=new Image;let p=F.KL.includes(s[0].type);for(let d=0;d<s.length;d++)if(F.KL.includes(s[d].type))c.src=g.createObjectURL(s[d]),c.onload=f=>{const h=new FileReader;h.onload=N=>this.slideSrc={isImg:p,image:h.result},h.readAsDataURL(s[d])};else{const f=new FileReader;f.onload=h=>this.slideSrc={isImg:p,image:f.result},f.readAsDataURL(s[d])}this.fg.get("isImg")?.patchValue(p),(0,Q.Y)(t,i,this.fg)}setSubCategories(t){var i=this;return(0,v.Z)(function*(){!t||(i.fg.get("subCategory")?.patchValue(""),i.subCategories=[],t&&(i.subCategories=i.categories.find(o=>o._id==t)?.subCategories||[]))})()}setChildCategories(t){this.fg.get("childCategory")?.patchValue([]),this.childCategories=[];let i=this.fg.get("category")?.value;t&&(this.childCategories=(this.categories.find(o=>o._id==i)?.subCategories||[]).find(o=>o._id==t)?.subCategories||[])}onSelectAll(){const t=this.subCategories.map(i=>i._id)||[];this.fg.get("childCategory")?.patchValue(t)}onClearAll(){this.fg.get("childCategory")?.patchValue([])}removeSlideSrc(t){this.slideSrc=null,this.fg.get("image")?.patchValue(null)}clearMainCategory(){this.fg.get("subCategory")?.patchValue(null),this.fg.get("childCategory")?.patchValue(null),this.subCategories=[],this.childCategories=[]}clearSubCategory(){this.fg.get("childCategory")?.patchValue(null),this.childCategories=[]}removeSlide(t){this.slideSrc=null,this.removeOneSlide.next(t)}}return r.\u0275fac=function(t){return new(t||r)(e.Y36(x.F),e.Y36(I.M))},r.\u0275cmp=e.Xpm({type:r,selectors:[["app-slide-form"]],inputs:{fgIndex:"fgIndex",fg:"fg",categories:"categories",slideInfo:"slideInfo",slideSrc:"slideSrc"},outputs:{removeOneSlide:"removeOneSlide",removeOneSlideSrc:"removeOneSlideSrc"},decls:32,vars:11,consts:[[3,"formGroup"],[1,"card"],[1,"card-header"],[1,"row"],[1,"col-sm-7","col-auto"],[1,"page-title"],[1,"col-sm-5","col-auto"],["class","float-right",4,"ngIf"],[1,"card-body"],[1,"col-12","col-md-12"],[1,"form-group"],["for","validationServer01",1,"required-label"],["maxlength","100","type","text","id","validationServer01","placeholder","Redirect Url","formControlName","redirectUrl","required","",1,"form-control",3,"ngClass"],[3,"control","fieldName","maxLength"],[1,"col-sm-5","col"],["type","file","id","validationServer02",1,"form-control",3,"hidden","focus","change"],["brandLogo",""],["type","button","class","btn btn-primary btn-sm float-right mt-2",3,"click",4,"ngIf"],[1,"row","m-1"],["class","col-12",4,"ngIf"],[1,"col-12"],["class","d-flex align-content-start pt-2",4,"ngIf"],[1,"float-right"],["type","button",1,"btn","btn-danger","btn-sm",3,"click"],[1,"fa","fa-close"],["type","button",1,"btn","btn-primary","btn-sm","float-right","mt-2",3,"click"],[1,"fa","fa-upload"],[3,"control","fieldName"],[1,"d-flex","align-content-start","pt-2"],[1,"d-flex"],[4,"ngIf"],[1,"mb-1","cursor","trashImage",3,"click"],[1,"fa","fa-trash-o","text-danger"],["download","slideSrc.image","data-fancybox","gallery",3,"href"],[1,"img-thumbnail",2,"height","100px",3,"src"],["height","200","controls","",3,"src"]],template:function(t,i){if(1&t&&(e.TgZ(0,"form",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"div",4)(5,"h5",5),e._uU(6),e.qZA()(),e.TgZ(7,"div",6),e.YNc(8,Y,3,0,"div",7),e.qZA()()(),e.TgZ(9,"div",8)(10,"div",3)(11,"div",9)(12,"div",10)(13,"label",11),e._uU(14,"Redirection Url "),e.qZA(),e._UZ(15,"input",12)(16,"app-input-error",13),e.qZA()()(),e.TgZ(17,"div",1)(18,"div",2)(19,"div",3)(20,"div",4)(21,"h5",5),e._uU(22,"Slide Image"),e.qZA()(),e.TgZ(23,"div",14)(24,"input",15,16),e.NdJ("focus",function(){let s;return null==(s=i.fg.get("image"))?null:s.markAsTouched()})("change",function(s){return i.chooseFile(s,"image",i.fgIndex)}),e.qZA(),e.YNc(26,L,3,0,"button",17),e.qZA()()(),e.TgZ(27,"div",8)(28,"div",18),e.YNc(29,k,2,2,"div",19),e.TgZ(30,"div",20),e.YNc(31,q,6,2,"div",21),e.qZA()()()()()()()),2&t){let o,s;e.Q6J("formGroup",i.fg),e.xp6(6),e.hij("Slide Info ",i.fgIndex+1,""),e.xp6(2),e.Q6J("ngIf",i.fgIndex>0),e.xp6(7),e.Q6J("ngClass",null!=(o=i.fg.get("redirectUrl"))&&o.touched?null!=(o=i.fg.get("redirectUrl"))&&o.errors?"is-invalid":"is-valid":""),e.xp6(1),e.Q6J("control",i.fg.get("redirectUrl"))("fieldName","Redirect Url")("maxLength",100),e.xp6(8),e.Q6J("hidden",!0),e.xp6(2),e.Q6J("ngIf",!i.slideSrc),e.xp6(3),e.Q6J("ngIf",null==(s=i.fg.get("image"))?null:s.errors),e.xp6(2),e.Q6J("ngIf",i.slideSrc)}},dependencies:[m.mk,m.O5,U.w,l._Y,l.Fj,l.JJ,l.JL,l.Q7,l.nD,l.sg,l.u],styles:[".trashImage[_ngcontent-%COMP%]{position:relative;right:25px;background:black;height:min-content;padding:0 6px}"]}),r})();function G(r,n){if(1&r){const t=e.EpF();e.ynx(0)(1,26),e.TgZ(2,"app-slide-form",27),e.NdJ("removeOneSlide",function(o){e.CHM(t);const s=e.oxw(2);return e.KtG(s.removeSlide(o))}),e.qZA(),e.BQk()()}if(2&r){const t=n.index,i=e.oxw(2);e.xp6(1),e.Q6J("formGroupName",t),e.xp6(1),e.Q6J("categories",i.categories)("fgIndex",t)("fg",i.getFormGroup(t))}}function P(r,n){1&r&&e._UZ(0,"span",28)}function V(r,n){if(1&r){const t=e.EpF();e.ynx(0),e.TgZ(1,"form",10),e.NdJ("ngSubmit",function(){e.CHM(t);const o=e.oxw();return e.KtG(o.onFormSubmit(o.form.value))}),e.TgZ(2,"div",3)(3,"div",11)(4,"div",12)(5,"div",13)(6,"app-image-guideline")(7,"li"),e._uU(8," Sample Image: "),e.TgZ(9,"a",14),e._uU(10,"Download Sample Image"),e.qZA()()()()()(),e.TgZ(11,"div",15)(12,"div",12)(13,"div",16)(14,"div",17)(15,"label"),e._uU(16,"Tag"),e.qZA(),e._UZ(17,"input",18)(18,"app-input-error",19),e.qZA()(),e.TgZ(19,"div",13),e.ynx(20,20),e.YNc(21,G,3,4,"ng-container",21),e.BQk(),e.qZA()(),e.TgZ(22,"button",22),e.YNc(23,P,1,0,"span",23),e._uU(24," Save "),e.qZA(),e.TgZ(25,"button",24),e.NdJ("click",function(){e.CHM(t);const o=e.oxw();return e.KtG(o.addNewSlide())}),e._UZ(26,"i",25),e._uU(27," Add New Slide "),e.qZA(),e._UZ(28,"br")(29,"br")(30,"br")(31,"br"),e.qZA()()(),e.BQk()}if(2&r){const t=e.oxw();let i;e.xp6(1),e.Q6J("formGroup",t.form),e.xp6(8),e.MGl("download","assets/img/",t.updateId,".png")("href","assets/img/",t.updateId,".png",e.LSH),e.xp6(8),e.Q6J("ngClass",null!=(i=t.form.get("tag"))&&i.touched?null!=(i=t.form.get("tag"))&&i.errors?"is-invalid":"is-valid":""),e.xp6(1),e.Q6J("control",t.form.get("tag"))("fieldName","Tag")("maxLength",100),e.xp6(3),e.Q6J("ngForOf",t.getFormArr.controls),e.xp6(1),e.Q6J("disabled",t.isFormSubmitted),e.xp6(1),e.Q6J("ngIf",t.isFormSubmitted),e.xp6(2),e.Q6J("disabled",t.isFormSubmitted)}}let D=(()=>{class r{constructor(t,i,o,s,u,g,c,p){this.fb=t,this.uiService=i,this.sliderService=o,this.categoryService=s,this.productService=u,this.router=g,this.route=c,this.location=p,this.isFormSubmitted=!1,this.dataIsLoaded=!1,this.categories=[]}ngOnInit(){this.route.paramMap.subscribe(t=>{this.updateId=t.get("sliderId"),console.log("cdvdd",t)}),this.getCategories(),this.initForm()}getSlide(){return this.fb.group({isImg:[!1],imageUrl:[null,[l.kI.required]],redirectUrl:[null,[l.kI.required,y.Pt]]})}initForm(){this.form=this.fb.group({tag:[null,[l.kI.required]],slides:this.fb.array([],[l.kI.min(1)])})}get getFormArr(){return this.form.get("slides")}getCategories(){this.categoryService.fetchCategories().subscribe(t=>this.categories=t.data.docs)}getFormGroup(t){return this.form.get("slides").controls[t]}removeSlideSrc(t){this.form.get("slides").controls[t]?.get("imageUrl")?.patchValue(null)}addNewSlide(){this.getFormArr.push(this.getSlide())}removeSlide(t){this.getFormArr.removeAt(t)}onFormSubmit(t){var i=this;return(0,v.Z)(function*(){if(i.form.getRawValue(),i.form.invalid)i.form.markAllAsTouched();else{i.isFormSubmitted=!0;try{i.isFormSubmitted=!1,i.location.back()}catch{i.isFormSubmitted=!1}}})()}ngOnDestroy(){this.subscription&&this.subscription.unsubscribe()}}return r.\u0275fac=function(t){return new(t||r)(e.Y36(l.qu),e.Y36(x.F),e.Y36(b),e.Y36(C.G),e.Y36(I.M),e.Y36(_.F0),e.Y36(_.gz),e.Y36(m.Ye))},r.\u0275cmp=e.Xpm({type:r,selectors:[["app-add-slider"]],decls:12,vars:1,consts:[[1,"page-wrapper"],[1,"content","container-fluid"],[1,"page-header"],[1,"row"],[1,"col-sm-7","col-auto"],[1,"page-title"],[1,"col-sm-5","col"],[1,"btn","btn-primary","btn-sm","float-right","mt-2",3,"click"],[1,"fa","fa-arrow-left"],[4,"ngIf"],[3,"formGroup","ngSubmit"],[1,"col-12"],[1,"card"],[1,"card-body"],[3,"download","href"],[1,"col-sm-12"],[1,"card-header"],[1,"col-4","p-0","m-0"],["maxlength","100","type","text","id","validationServer01","placeholder","Tag","formControlName","tag",1,"form-control",3,"ngClass"],[3,"control","fieldName","maxLength"],["formArrayName","slides"],[4,"ngFor","ngForOf"],["type","submit",1,"btn","btn-primary","float-right",3,"disabled"],["class","spinner-border spinner-border-sm mr-2","role","status",4,"ngIf"],["type","button",1,"btn","btn-info","float-right","mr-2",3,"disabled","click"],[1,"fa","fa-plus"],[3,"formGroupName"],[3,"categories","fgIndex","fg","removeOneSlide"],["role","status",1,"spinner-border","spinner-border-sm","mr-2"]],template:function(t,i){1&t&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"div",4)(5,"h3",5),e._uU(6,"Add Slider"),e.qZA()(),e.TgZ(7,"div",6)(8,"button",7),e.NdJ("click",function(){return i.location.back()}),e._UZ(9,"i",8),e._uU(10," Back "),e.qZA()()()(),e.YNc(11,V,32,11,"ng-container",9),e.qZA()()),2&t&&(e.xp6(11),e.Q6J("ngIf",i.form))},dependencies:[m.mk,m.sg,m.O5,U.w,l._Y,l.Fj,l.JJ,l.JL,l.nD,l.sg,l.u,l.x0,l.CE,w.I,J],styles:[".trashImage[_ngcontent-%COMP%]{position:relative;right:25px;background:black;height:min-content;padding:0 6px}"]}),r})();var T=a(5990),E=a(7341),R=a(3162),H=a(6129);const B=function(r){return["/slider/update",r]};function j(r,n){if(1&r&&(e.TgZ(0,"tr",20)(1,"td"),e._uU(2),e.qZA(),e.TgZ(3,"td",21)(4,"h2",22),e._uU(5),e.qZA()(),e.TgZ(6,"td",18)(7,"div",23)(8,"button",24),e._UZ(9,"i",25),e._uU(10," Edit "),e.qZA()()()()),2&r){const t=n.$implicit,i=n.index;e.Q6J("ngClass",i%2==0?"even":"odd"),e.xp6(2),e.hij(" ",0==i?"Short":"Long"," "),e.xp6(3),e.hij(" ",null==t||null==t.slides?null:t.slides.length," "),e.xp6(3),e.Q6J("routerLink",e.VKq(4,B,i))}}const K=function(r,n){return[r,n]};function z(r,n){if(1&r&&(e.TgZ(0,"div",3)(1,"div",7)(2,"div",13)(3,"table",14)(4,"thead")(5,"tr",15)(6,"th",16),e._uU(7,"Name"),e.qZA(),e.TgZ(8,"th",17),e._uU(9,"Slides"),e.qZA(),e.TgZ(10,"th",18),e._uU(11,"Actions \xa0"),e.qZA()()(),e.TgZ(12,"tbody"),e.YNc(13,j,11,6,"tr",19),e.qZA()()()()()),2&r){const t=e.oxw();e.xp6(13),e.Q6J("ngForOf",e.WLB(1,K,null==t.data?null:t.data.shortSlider,null==t.data?null:t.data.longSlider))}}function $(r,n){1&r&&e._UZ(0,"mat-progress-bar",26)}let X=(()=>{class r{constructor(t,i,o,s,u,g){this.sliderService=t,this.uiService=i,this.route=o,this.router=s,this.fb=u,this.authService=g,this.dataIsLoaded=!1,this.showFilter=!1,this.isFilterApplied=!1,this.authData=null,this.adminModules=T.W5}ngOnInit(){this.authData=this.authService.getAuthData,this.route.queryParams.subscribe(t=>{this.dataIsLoaded=!1,this.initForm(),this.fetchSliders()})}haveAccess(t,i){return(i?.adminRole?.permissions||[])?.findIndex(o=>o.module==T.W5.SLIDER&&o[t])>=0||i?.role==T.xZ.SUPER_ADMIN}initForm(){let t=localStorage.getItem("userFilter"),i={status:[!0],createdAt:[null]};if(t){this.isFilterApplied=!0;let o=JSON.parse(t);i.status=[o.status],i.createdAt=[o.createdAt]}this.filterForm=this.fb.group(i)}applyFilter(t){this.isFilterApplied=!0,localStorage.setItem("userFilter",JSON.stringify(t)),this.fetchSliders()}clearFilter(){this.filterForm.reset({status:!0}),this.isFilterApplied=!1,localStorage.removeItem("userFilter"),this.fetchSliders()}onChangePageSize(t){this.dataIsLoaded=!1,this.fetchSliders()}fetchSliders(){this.dataIsLoaded=!1,this.sliderService.fetchSliders().subscribe(t=>{this.data=t.data,this.dataIsLoaded=!0},t=>{this.dataIsLoaded=!1})}resetPagination(){this.router.navigate(["/admins"])}onDelete(t){this.uiService.openModal("#delete_modal").afterClose.subscribe(i=>{i&&(this.dataIsLoaded=!1,this.sliderService.deleteSlider(t).subscribe(o=>{this.fetchSliders(),this.uiService.openSnackbar(o.message),this.uiService.closeModal("#delete_modal",!0)},o=>{this.dataIsLoaded=!0}))})}onSearch(t){this.textSearch=t,this.fetchSliders()}}return r.\u0275fac=function(t){return new(t||r)(e.Y36(b),e.Y36(x.F),e.Y36(_.gz),e.Y36(_.F0),e.Y36(l.qu),e.Y36(E.e))},r.\u0275cmp=e.Xpm({type:r,selectors:[["app-list-slider"]],decls:16,vars:2,consts:[[1,"page-wrapper"],[1,"content","container-fluid"],[1,"page-header"],[1,"row"],[1,"col-sm-7","col-auto"],[1,"page-title"],[1,"col-sm-5","col"],[1,"col-sm-12"],[1,"card"],[1,"card-body"],["id","DataTables_Table_0_wrapper",1,"dataTables_wrapper","dt-bootstrap4","no-footer"],["class","row",4,"ngIf"],["mode","indeterminate",4,"ngIf"],[1,"table-responsive"],["id","DataTables_Table_0","role","grid","aria-describedby","DataTables_Table_0_info",1,"datatable","table","table-hover","table-center","mb-0","dataTable","no-footer"],["role","row"],[1,"sorting_1"],[1,"text-center"],[1,"text-right"],["role","row",3,"ngClass",4,"ngFor","ngForOf"],["role","row",3,"ngClass"],[1,"sorting_1","text-center"],[1,"table-avatar"],[1,"actions"],["data-toggle","modal",1,"btn","btn-sm","btn-outline-success",3,"routerLink"],[1,"fe","fe-pencil"],["mode","indeterminate"]],template:function(t,i){1&t&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"div",4)(5,"h3",5),e._uU(6,"Sliders"),e.qZA()(),e._UZ(7,"div",6),e.qZA()(),e.TgZ(8,"div",3)(9,"div",7)(10,"div",8)(11,"div",9)(12,"div",10),e.YNc(13,z,14,4,"div",11),e.YNc(14,$,1,0,"mat-progress-bar",12),e.qZA()()()()()()(),e._UZ(15,"app-delete-modal")),2&t&&(e.xp6(13),e.Q6J("ngIf",i.dataIsLoaded&&i.data),e.xp6(1),e.Q6J("ngIf",!i.dataIsLoaded))},dependencies:[m.mk,m.sg,m.O5,_.rH,R.pW,H.z]}),r})();function W(r,n){1&r&&(e.TgZ(0,"div"),e._uU(1,"Loading..."),e.qZA())}function ee(r,n){if(1&r){const t=e.EpF();e.ynx(0)(1,25),e.TgZ(2,"app-slide-form",26),e.NdJ("removeOneSlide",function(o){e.CHM(t);const s=e.oxw(4);return e.KtG(s.removeSlide(o))}),e.qZA(),e.BQk()()}if(2&r){const t=n.index,i=e.oxw(4);e.xp6(1),e.Q6J("formGroupName",t),e.xp6(1),e.Q6J("categories",i.categories)("fgIndex",t)("fg",i.getFormGroup(t))("slideInfo",i.slider.slides[t])}}function te(r,n){1&r&&e._UZ(0,"span",27)}function ie(r,n){if(1&r){const t=e.EpF();e.TgZ(0,"div",18),e.ynx(1,19),e.YNc(2,ee,3,5,"ng-container",20),e.BQk(),e.TgZ(3,"button",21),e.YNc(4,te,1,0,"span",22),e._uU(5," Save "),e.qZA(),e.TgZ(6,"button",23),e.NdJ("click",function(){e.CHM(t);const o=e.oxw(3);return e.KtG(o.addNewSlide())}),e._UZ(7,"i",24),e._uU(8," Add New Slide "),e.qZA(),e._UZ(9,"br")(10,"br")(11,"br")(12,"br"),e.qZA()}if(2&r){const t=e.oxw(3);e.xp6(2),e.Q6J("ngForOf",t.getFormArr.controls),e.xp6(1),e.Q6J("disabled",t.isFormSubmitted),e.xp6(1),e.Q6J("ngIf",t.isFormSubmitted),e.xp6(2),e.Q6J("disabled",t.isFormSubmitted)}}function re(r,n){if(1&r){const t=e.EpF();e.ynx(0),e.TgZ(1,"form",12),e.NdJ("ngSubmit",function(){e.CHM(t);const o=e.oxw(2);return e.KtG(o.onFormSubmit(o.form.value))}),e.TgZ(2,"div",3)(3,"div",13)(4,"div",14)(5,"div",15)(6,"app-image-guideline")(7,"li"),e._uU(8," Sample Image: "),e.TgZ(9,"a",16),e._uU(10,"Download Sample Image"),e.qZA()()()()()(),e.YNc(11,ie,13,4,"div",17),e.qZA()(),e.BQk()}if(2&r){const t=e.oxw(2);e.xp6(1),e.Q6J("formGroup",t.form),e.xp6(8),e.MGl("download","assets/img/",t.updateId,".png")("href","assets/img/",t.updateId,".png",e.LSH),e.xp6(2),e.Q6J("ngIf",t.slider)}}function oe(r,n){if(1&r&&e.YNc(0,re,12,4,"ng-container",11),2&r){const t=e.oxw();e.Q6J("ngIf",t.form)}}let ne=(()=>{class r{constructor(t,i,o,s,u,g,c,p){this.fb=t,this.uiService=i,this.sliderService=o,this.router=s,this.route=u,this.categoryService=g,this.productService=c,this.location=p,this.isFormSubmitted=!1,this.dataIsLoaded=!1,this.slideSrcs=[],this.categories=[]}ngOnInit(){this.getCategories()}getSliderInfo(t){this.sliderService.fetchSliders().subscribe(i=>{this.slider="0"==t?i.data.shortSlider:i.data.longSlider,this.initForm(t,this.slider)})}getCategories(){this.categoryService.fetchCategories().subscribe(t=>{this.categories=t.data.docs,this.route.paramMap.subscribe(i=>{this.updateId=i.get("sliderId"),i.get("sliderId")&&this.getSliderInfo(i.get("sliderId"))})})}getSlide(t){return this.fb.group({isImg:[t?.isImg??!1],image:[null],redirectUrl:[t?.redirectUrl??null,[l.kI.required,y.Pt]]})}initForm(t,i){let o=[];if(this.slideSrcs=[],this.formkey="0"==t?"shortSlider":"longSlider",i.slides.length)for(let s of i.slides)o.push(this.getSlide(s)),this.slideSrcs.push({isImg:s.isImg,image:s?.image?.original});else o.push(this.getSlide());this.form=this.fb.group({slides:this.fb.array(o)}),this.form.markAllAsTouched()}getFormGroup(t){return this.form.get("slides").controls[t]}removeSlideSrc(t){this.slideSrcs[t]=null,this.form.get("slides").controls[t]?.get("image")?.patchValue(null)}addNewSlide(){this.getFormArr.push(this.getSlide())}removeSlide(t){this.slideSrcs.splice(t),this.getFormArr.removeAt(t)}get getFormArr(){return this.form.get("slides")}onFormSubmit(t){var i=this;return(0,v.Z)(function*(){if(i.form.invalid)return void i.form.markAllAsTouched();let o=i.form.getRawValue();i.isFormSubmitted=!0;try{let s=yield i.sliderService.updateSlider(i.slider,o,i.formkey,"0"!=i.updateId);i.uiService.openSnackbar(s.message),i.isFormSubmitted=!1,i.location.back()}catch{i.isFormSubmitted=!1}})()}ngOnDestroy(){this.subscription&&this.subscription.unsubscribe()}}return r.\u0275fac=function(t){return new(t||r)(e.Y36(l.qu),e.Y36(x.F),e.Y36(b),e.Y36(_.F0),e.Y36(_.gz),e.Y36(C.G),e.Y36(I.M),e.Y36(m.Ye))},r.\u0275cmp=e.Xpm({type:r,selectors:[["app-slider-update"]],decls:14,vars:3,consts:[[1,"page-wrapper"],[1,"content","container-fluid"],[1,"page-header"],[1,"row"],[1,"col-sm-7","col-auto"],[1,"page-title"],[1,"col-sm-5","col"],[1,"btn","btn-primary","btn-sm","float-right","mt-2",3,"click"],[1,"fa","fa-arrow-left"],[4,"ngIf","ngIfElse"],["wait",""],[4,"ngIf"],[3,"formGroup","ngSubmit"],[1,"col-12"],[1,"card"],[1,"card-body"],[3,"download","href"],["class","col-sm-12",4,"ngIf"],[1,"col-sm-12"],["formArrayName","slides"],[4,"ngFor","ngForOf"],["type","submit",1,"btn","btn-primary","float-right",3,"disabled"],["class","spinner-border spinner-border-sm mr-2","role","status",4,"ngIf"],["type","button",1,"btn","btn-info","float-right","mr-2",3,"disabled","click"],[1,"fa","fa-plus"],[3,"formGroupName"],[3,"categories","fgIndex","fg","slideInfo","removeOneSlide"],["role","status",1,"spinner-border","spinner-border-sm","mr-2"]],template:function(t,i){if(1&t&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"div",4)(5,"h3",5),e._uU(6),e.qZA()(),e.TgZ(7,"div",6)(8,"button",7),e.NdJ("click",function(){return i.location.back()}),e._UZ(9,"i",8),e._uU(10," Back"),e.qZA()()()(),e.YNc(11,W,2,0,"div",9),e.YNc(12,oe,1,1,"ng-template",null,10,e.W1O),e.qZA()()),2&t){const o=e.MAs(13);e.xp6(6),e.hij("Update ","0"==i.updateId?"Short":"Long"," Slider"),e.xp6(5),e.Q6J("ngIf",!i.slider)("ngIfElse",o)}},dependencies:[m.sg,m.O5,l._Y,l.JL,l.sg,l.x0,l.CE,w.I,J],styles:[".trashImage[_ngcontent-%COMP%]{position:relative;right:25px;background:black;height:min-content;padding:0 6px}"]}),r})();function se(r,n){if(1&r&&(e.ynx(0),e._UZ(1,"img",21),e.BQk()),2&r){const t=e.oxw().$implicit;e.xp6(1),e.Q6J("src",t.image.md||"assets/error.png",e.LSH)}}function le(r,n){if(1&r&&(e.ynx(0),e._UZ(1,"video",22),e.BQk()),2&r){const t=e.oxw().$implicit;e.xp6(1),e.Q6J("src",(null==t.image?null:t.image.md)||"assets/error.png",e.LSH)}}function ae(r,n){if(1&r&&(e.TgZ(0,"div",19),e.YNc(1,se,2,1,"ng-container",20),e.YNc(2,le,2,1,"ng-container",20),e.qZA()),2&r){const t=n.$implicit;e.Q6J("ngClass",0==n.index?"active":""),e.xp6(1),e.Q6J("ngIf",t.isImg),e.xp6(1),e.Q6J("ngIf",!t.isImg)}}function de(r,n){if(1&r&&(e.TgZ(0,"div",11)(1,"div",12),e.YNc(2,ae,3,3,"div",13),e.qZA(),e.TgZ(3,"a",14),e._UZ(4,"span",15),e.TgZ(5,"span",16),e._uU(6,"Previous"),e.qZA()(),e.TgZ(7,"a",17),e._UZ(8,"span",18),e.TgZ(9,"span",16),e._uU(10,"Next"),e.qZA()()()),2&r){const t=e.oxw(2);e.xp6(2),e.Q6J("ngForOf",null==t.slider||null==t.slider.shortSlider?null:t.slider.shortSlider.slides)}}function ce(r,n){if(1&r&&(e.TgZ(0,"div",3),e.YNc(1,de,11,1,"div",10),e.qZA()),2&r){const t=e.oxw();e.xp6(1),e.Q6J("ngIf",t.slider)}}const ge=function(r){return["/slider/update",r]},me=[{path:"",component:X},{path:"add",component:D},{path:"view/:sliderId",component:(()=>{class r{constructor(t,i,o){this.sliderService=t,this.location=i,this.route=o,this.dataIsLoaded=!1}ngOnInit(){this.route.paramMap.subscribe(t=>{t.get("sliderId")&&this.getSliderInfo(t.get("sliderId"))})}getSliderInfo(t){this.sliderService.fetchSliders().subscribe(i=>{this.slider=i.data})}}return r.\u0275fac=function(t){return new(t||r)(e.Y36(b),e.Y36(m.Ye),e.Y36(_.gz))},r.\u0275cmp=e.Xpm({type:r,selectors:[["app-view-slider"]],decls:12,vars:4,consts:[[1,"page-wrapper"],[1,"content","container-fluid"],[1,"page-header"],[1,"row"],[1,"col-sm-7","col-auto"],[1,"page-title"],[1,"col-sm-5","col"],[1,"btn","btn-sm","float-right","btn-primary","mt-2",3,"routerLink"],[1,"fa","fa-edit"],["class","row",4,"ngIf"],["id","carouselExampleControls","class","carousel slide w-100 h-50","data-ride","carousel",4,"ngIf"],["id","carouselExampleControls","data-ride","carousel",1,"carousel","slide","w-100","h-50"],[1,"carousel-inner","w-100","h-50"],["class","carousel-item",3,"ngClass",4,"ngFor","ngForOf"],["href","#carouselExampleControls","role","button","data-slide","prev",1,"carousel-control-prev"],["aria-hidden","true",1,"carousel-control-prev-icon"],[1,"sr-only"],["href","#carouselExampleControls","role","button","data-slide","next",1,"carousel-control-next"],["aria-hidden","true",1,"carousel-control-next-icon"],[1,"carousel-item",3,"ngClass"],[4,"ngIf"],["alt","First slide",1,"d-block","w-100","h-50",3,"src"],["height","500","controls","",1,"d-block","w-100",3,"src"]],template:function(t,i){1&t&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"div",4)(5,"h3",5),e._uU(6,"Slider"),e.qZA()(),e.TgZ(7,"div",6)(8,"button",7),e._UZ(9,"i",8),e._uU(10," Update "),e.qZA()()()(),e.YNc(11,ce,2,1,"div",9),e.qZA()()),2&t&&(e.xp6(8),e.Q6J("routerLink",e.VKq(2,ge,null==i.slider?null:i.slider._id)),e.xp6(3),e.Q6J("ngIf",i.slider))},dependencies:[m.mk,m.sg,m.O5,_.rH],styles:[".carousel-item[_ngcontent-%COMP%] > img[_ngcontent-%COMP%]{height:25em!important;object-fit:fill}.carousel-inner[_ngcontent-%COMP%]{height:25em!important}@media only screen and (max-width: 600px){.carousel-item[_ngcontent-%COMP%] > img[_ngcontent-%COMP%]{height:10em!important;object-fit:fill}.carousel-inner[_ngcontent-%COMP%]{height:10em!important}}"]}),r})()},{path:"update/:sliderId",component:ne}];let ue=(()=>{class r{}return r.\u0275fac=function(t){return new(t||r)},r.\u0275mod=e.oAB({type:r}),r.\u0275inj=e.cJS({imports:[_.Bz.forChild(me),_.Bz]}),r})();var pe=a(508),fe=a(8796),he=a(7523),_e=a(1961),ve=a(6738),Se=a(2712),be=a(3677),xe=a(8173),Ie=a(1689);let Ze=(()=>{class r{}return r.\u0275fac=function(t){return new(t||r)},r.\u0275mod=e.oAB({type:r}),r.\u0275inj=e.cJS({providers:[b,C.G,I.M,{provide:Z.TP,useClass:_e.s,multi:!0}],imports:[m.ez,ue,ve.a,l.UX,Z.JF,Se.q,pe.m,xe.u,be.I,Ie.n,fe.A0,he.F]}),r})()}}]);