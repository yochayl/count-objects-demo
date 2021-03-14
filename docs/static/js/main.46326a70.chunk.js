(this["webpackJsonpcount-objects-demo"]=this["webpackJsonpcount-objects-demo"]||[]).push([[0],{200:function(e,t,n){},243:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(16),i=n.n(c),s=(n(200),n(96)),o=n.n(s),u=n(138),l=n(23),d=n(7),j=n(139),p=n(31),f=n(293),h=n(53),b=n(296),m=n(252),O=n(290),g=n(291),x=n(140),y=n(145),S=n(22),w=n(292),v=n(14),C=n(231).CountObjects,N="2021-01-01",k=function(e){var t=new Date(e);return new Date(t.setDate(t.getDate()+1)).toISOString().split("T")[0]},D=[{headerName:"Key",field:"key",width:300,headerClassName:"super-app-theme--header"},{headerName:"Value",field:"value",width:300,headerClassName:"super-app-theme--header"},{headerName:"Count",field:"count",width:300,headerClassName:"super-app-theme--header"}],T=function(e){var t=e.startTime,n=k(t);return encodeURI("https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=".concat(t,"&endtime=").concat(n))},F=Object(p.a)((function(e){return{root:{flexGrow:1,"& .super-app-theme--header":{backgroundColor:"beige",fontSize:"medium"}},header:{padding:e.spacing(1),textAlign:"center",color:e.palette.text.secondary},chip:{background:"#eadce6"},chipContainer:{display:"flex",justifyContent:"center",flexWrap:"wrap",listStyle:"none",paddingRight:e.spacing(.5),paddingLeft:e.spacing(.5),paddingBottom:e.spacing(1),paddingTop:e.spacing(.5)},queryMore:{paddingBottom:e.spacing(1),paddingTop:e.spacing(.5)},circularProgress:{textAlign:"center"},datePickerContainer:{display:"flex",flexWrap:"wrap"},datePickerTextField:{marginLeft:e.spacing(1),marginRight:e.spacing(1),width:200}}})),J=function(e){return e.features.map((function(e){var t=e.properties,n=t.status,a=t.mag,r=t.place,c=t.type,i=t.alert,s=t.tsunami,o=t.time,u=t.sources,l=new Date(o).toISOString().split("T")[0];return{status:n.toLowerCase(),mag:Math.round(10*a)/10,place:r.split(", ").pop().toLowerCase(),type:c,tsunami:s,alert:i,date:l,sources:u.split(",").reduce((function(e,t){return t&&(e[t]=t),e}),{})}}))};function M(){var e=Object(a.useState)(new C([])),t=Object(d.a)(e,2),n=t[0],c=t[1],i=Object(a.useState)(0),s=Object(d.a)(i,2),p=s[0],M=s[1],P=Object(a.useState)(N),q=Object(d.a)(P,2),z=q[0],I=q[1],L=Object(a.useState)([]),B=Object(d.a)(L,2),A=B[0],E=B[1],R=Object(a.useState)([]),W=Object(d.a)(R,2),H=W[0],K=W[1],_=Object(a.useState)(!0),G=Object(d.a)(_,2),Q=G[0],U=G[1],V=r.a.useState(new Date(N)),X=Object(d.a)(V,2),Y=X[0],Z=X[1],$=function(e){Z(e),I((function(){return new Date(e).toISOString().split("T")[0]})),M(0),c(new C([])),U(!0)},ee=function(){U((function(){return!0})),I((function(){return k(z)}))};Object(a.useEffect)((function(){E((function(){return n.table().filter((function(e){return 0!==e.count})).map((function(e,t){return e.id=t,e}))})),K((function(){return function(e){var t,n=[],a=Object(j.a)(e);try{for(a.s();!(t=a.n()).done;){var r=t.value,c=JSON.stringify(r),i=r.pop(),s=r.join("."),o="".concat(s," - ").concat(i);n.push({key:c,label:o})}}catch(u){a.e(u)}finally{a.f()}return n}(JSON.parse(JSON.stringify(n.getFilters())))}))}),[n]),Object(a.useEffect)((function(){(function(){var e=Object(u.a)(o.a.mark((function e(){var t,a,r,i;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=T({startTime:z}),e.next=3,fetch(t);case 3:return a=e.sent,e.next=6,a.json();case 6:r=e.sent,i=J(r),M((function(e){return e+i.length})),c(n.add(i).clone()),U(!1);case 11:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}})()()}),[z,Y]);var te=F(),ne=function(){return Object(v.jsx)(f.a,{style:{height:400,width:900},children:Object(v.jsx)(x.a,{rows:A,columns:D,pageSize:50,onRowSelected:function(e){!function(e,t){var n=[].concat(Object(l.a)(e.split(".")),[t]),a=JSON.stringify(n);c((function(e){return e.getFilters().map((function(e){return JSON.stringify(e)})).some((function(e){return e===a}))?e:e.addFilter(n).clone()}))}(e.data.key,e.data.value)},HorizontalAlignment:"Stretch",HorizontalContentAlignment:"Stretch",ColumnWidth:"*"})})},ae=function(){return Object(v.jsx)(f.a,{className:te.queryMore,children:Object(v.jsx)(h.a,{size:"small",variant:"contained",color:"primary",onClick:ee,children:"Query More"})})},re=function(){return H.map((function(e){return Object(v.jsx)(f.a,{component:"li",className:te.chipContainer,children:Object(v.jsx)(b.a,{label:e.label,onDelete:(t=e,function(){c((function(e){return e.removeFilter(JSON.parse(t.key)).clone()}))}),className:te.chip})},e.label);var t}))},ce=function(){return Object(v.jsx)(S.a,{utils:y.a,children:Object(v.jsx)(w.a,{margin:"normal",id:"date-picker-dialog",label:"Start Date",format:"dd/MM/yyyy",value:Y,onChange:$,KeyboardButtonProps:{"aria-label":"change date"}})})},ie=function(){return Q?null:Object(v.jsxs)(f.a,{children:[Object(v.jsx)(f.a,{component:"span",children:"Total Count: "}),Object(v.jsxs)(f.a,{component:"span",children:[" ",p]})]})},se=function(){return Object(v.jsxs)(f.a,{children:[Object(v.jsx)(f.a,{component:"label",children:"Data Source: "}),Object(v.jsx)(f.a,{component:"a",href:"https://earthquake.usgs.gov/fdsnws/event/1/",target:"_blank",rel:"noreferrer",children:"Earthquake Hazards"})]})},oe=function(){return Object(v.jsxs)(f.a,{children:[Object(v.jsx)(f.a,{component:"h1",className:te.header,children:"Count Objects Demo"}),Object(v.jsx)(f.a,{component:"h5",className:te.header,children:Object(v.jsx)("a",{href:"https://www.npmjs.com/package/count-objects",target:"_blank",rel:"noreferrer",children:"NPM"})})]})},ue=function(){return Object(v.jsx)(f.a,{className:te.circularProgress,children:Object(v.jsx)(m.a,{})})};return Object(v.jsxs)(O.a,{maxWidth:"md",className:te.root,children:[Object(v.jsx)(oe,{}),Object(v.jsx)(ce,{}),Q?Object(v.jsx)(ue,{}):Object(v.jsxs)(f.a,{children:[Object(v.jsxs)(g.a,{container:!0,children:[Object(v.jsx)(g.a,{item:!0,xs:2,children:Object(v.jsx)(ae,{})}),Object(v.jsx)(g.a,{item:!0,xs:10,children:Object(v.jsx)(g.a,{container:!0,children:Object(v.jsx)(re,{})})})]}),Object(v.jsx)(ie,{}),Object(v.jsx)(ne,{}),Object(v.jsx)(se,{})]})]})}var P=function(){return Object(v.jsx)(M,{})},q=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,298)).then((function(t){var n=t.getCLS,a=t.getFID,r=t.getFCP,c=t.getLCP,i=t.getTTFB;n(e),a(e),r(e),c(e),i(e)}))};i.a.render(Object(v.jsx)(r.a.StrictMode,{children:Object(v.jsx)(P,{})}),document.getElementById("root")),q()}},[[243,1,2]]]);
//# sourceMappingURL=main.46326a70.chunk.js.map