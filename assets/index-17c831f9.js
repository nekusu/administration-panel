import{r as l,ah as Se,I as we,J as Ce,an as Le,a8 as Re,H as D,j as e,G as S,R as Ee,T as I,aI as ie,c as ze,d as Te,aJ as se,aK as oe,g as N,M as V,q as W,a3 as Y,L as le,aL as Ie,B as P,O as Pe,u as _e,h as O,i as q,A as G,l as Oe,m as Ae,p as De,t as Q,v as U,$ as Fe,x as He,y as Me,z as Ne,_ as We,D as F,E as ke,aM as Be}from"./index-5ff1983a.js";import{u as $e,z as Ve,k as Ye,l as qe,n as de,N as Ge,m as z,o as Qe}from"./index-a67f9d8b.js";import{L as Ue}from"./ListManager-ed59ad17.js";import{I as H,u as X,L as Xe}from"./useCollectionDataPersistent-3151dea0.js";import{L as J}from"./LabeledSegmentedControl-01309ecf.js";import{S as ce}from"./SelectValue-fc68a897.js";import{M as ue,d as _}from"./dayjs.min-c1d4d187.js";import{D as Je}from"./TimeRangeInput-f7df1e78.js";import{c as Ke,l as Ze,u as et}from"./localizedFormat-d9e5c86f.js";import{B as tt}from"./Badge-f1b67808.js";import"./use-input-props-04222ffb.js";import"./clamp-23377890.js";function rt(a,n){if(a==null)return{};var t={},r=Object.keys(a),i,o;for(o=0;o<r.length;o++)i=r[o],!(n.indexOf(i)>=0)&&(t[i]=a[i]);return t}var nt=l.useLayoutEffect,at=function(n){var t=l.useRef(n);return nt(function(){t.current=n}),t},K=function(n,t){if(typeof n=="function"){n(t);return}n.current=t},it=function(n,t){var r=l.useRef();return l.useCallback(function(i){n.current=i,r.current&&K(r.current,null),r.current=t,t&&K(t,i)},[t])},Z={"min-height":"0","max-height":"none",height:"0",visibility:"hidden",overflow:"hidden",position:"absolute","z-index":"-1000",top:"0",right:"0"},ee=function(n){Object.keys(Z).forEach(function(t){n.style.setProperty(t,Z[t],"important")})},f=null,st=function(n,t){var r=n.scrollHeight;return t.sizingStyle.boxSizing==="border-box"?r+t.borderSize:r-t.paddingSize};function ot(a,n,t,r){t===void 0&&(t=1),r===void 0&&(r=1/0),f||(f=document.createElement("textarea"),f.setAttribute("tabindex","-1"),f.setAttribute("aria-hidden","true"),ee(f)),f.parentNode===null&&document.body.appendChild(f);var i=a.paddingSize,o=a.borderSize,d=a.sizingStyle,p=d.boxSizing;Object.keys(d).forEach(function(v){var s=v;f.style[s]=d[s]}),ee(f),f.value=n;var h=st(f,a);f.value="x";var x=f.scrollHeight-i,j=x*t;p==="border-box"&&(j=j+i+o),h=Math.max(j,h);var c=x*r;return p==="border-box"&&(c=c+i+o),h=Math.min(c,h),[h,x]}var te=function(){},lt=function(n,t){return n.reduce(function(r,i){return r[i]=t[i],r},{})},dt=["borderBottomWidth","borderLeftWidth","borderRightWidth","borderTopWidth","boxSizing","fontFamily","fontSize","fontStyle","fontWeight","letterSpacing","lineHeight","paddingBottom","paddingLeft","paddingRight","paddingTop","tabSize","textIndent","textRendering","textTransform","width","wordBreak"],ct=!!document.documentElement.currentStyle,ut=function(n){var t=window.getComputedStyle(n);if(t===null)return null;var r=lt(dt,t),i=r.boxSizing;if(i==="")return null;ct&&i==="border-box"&&(r.width=parseFloat(r.width)+parseFloat(r.borderRightWidth)+parseFloat(r.borderLeftWidth)+parseFloat(r.paddingRight)+parseFloat(r.paddingLeft)+"px");var o=parseFloat(r.paddingBottom)+parseFloat(r.paddingTop),d=parseFloat(r.borderBottomWidth)+parseFloat(r.borderTopWidth);return{sizingStyle:r,paddingSize:o,borderSize:d}},pt=function(n){var t=at(n);l.useLayoutEffect(function(){var r=function(o){t.current(o)};return window.addEventListener("resize",r),function(){window.removeEventListener("resize",r)}},[])},ht=function(n,t){var r=n.cacheMeasurements,i=n.maxRows,o=n.minRows,d=n.onChange,p=d===void 0?te:d,h=n.onHeightChange,x=h===void 0?te:h,j=rt(n,["cacheMeasurements","maxRows","minRows","onChange","onHeightChange"]),c=j.value!==void 0,v=l.useRef(null),s=it(v,t),u=l.useRef(0),m=l.useRef(),w=function(){var y=v.current,C=r&&m.current?m.current:ut(y);if(C){m.current=C;var b=ot(C,y.value||y.placeholder||"x",o,i),g=b[0],L=b[1];u.current!==g&&(u.current=g,y.style.setProperty("height",g+"px","important"),x(g,{rowHeight:L}))}},R=function(y){c||w(),p(y)};return l.useLayoutEffect(w),pt(w),l.createElement("textarea",Se({},j,{onChange:R,ref:s}))},gt=l.forwardRef(ht);const mt=gt;var ft=we(a=>({input:{paddingTop:a.spacing.xs,paddingBottom:a.spacing.xs}}));const xt=ft;var jt=Object.defineProperty,vt=Object.defineProperties,bt=Object.getOwnPropertyDescriptors,A=Object.getOwnPropertySymbols,pe=Object.prototype.hasOwnProperty,he=Object.prototype.propertyIsEnumerable,re=(a,n,t)=>n in a?jt(a,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[n]=t,T=(a,n)=>{for(var t in n||(n={}))pe.call(n,t)&&re(a,t,n[t]);if(A)for(var t of A(n))he.call(n,t)&&re(a,t,n[t]);return a},M=(a,n)=>vt(a,bt(n)),yt=(a,n)=>{var t={};for(var r in a)pe.call(a,r)&&n.indexOf(r)<0&&(t[r]=a[r]);if(a!=null&&A)for(var r of A(a))n.indexOf(r)<0&&he.call(a,r)&&(t[r]=a[r]);return t};const St={autosize:!1,size:"sm",__staticSelector:"Textarea"},ge=l.forwardRef((a,n)=>{const t=Ce("Textarea",St,a),{autosize:r,maxRows:i,minRows:o,label:d,error:p,description:h,id:x,className:j,required:c,style:v,wrapperProps:s,classNames:u,styles:m,size:w,__staticSelector:R,sx:E,errorProps:y,descriptionProps:C,labelProps:b,inputWrapperOrder:g,inputContainer:L,unstyled:k,withAsterisk:fe}=t,xe=yt(t,["autosize","maxRows","minRows","label","error","description","id","className","required","style","wrapperProps","classNames","styles","size","__staticSelector","sx","errorProps","descriptionProps","labelProps","inputWrapperOrder","inputContainer","unstyled","withAsterisk"]),B=Le(x),{classes:je,cx:ve}=xt(),{systemStyles:be,rest:ye}=Re(xe),$=T({required:c,ref:n,invalid:!!p,id:B,classNames:M(T({},u),{input:ve(je.input,u==null?void 0:u.input)}),styles:m,__staticSelector:R,size:w,multiline:!0,unstyled:k},ye);return D.createElement(H.Wrapper,T(T({label:d,error:p,id:B,description:h,required:c,style:v,className:j,classNames:u,styles:m,size:w,__staticSelector:R,sx:E,errorProps:y,labelProps:b,descriptionProps:C,inputContainer:L,inputWrapperOrder:g,unstyled:k,withAsterisk:fe},be),s),r?D.createElement(H,M(T({},$),{component:mt,maxRows:i,minRows:o})):D.createElement(H,M(T({},$),{component:"textarea",rows:o})))});ge.displayName="@mantine/core/Textarea";function wt({tags:a,filters:n,updateFilter:t}){return e.jsxs(e.Fragment,{children:[e.jsx(J,{label:"Order by",data:[{label:e.jsxs(S,{spacing:"xs",position:"center",noWrap:!0,children:[e.jsx(Ee,{}),e.jsx(I,{children:"Amount"})]}),value:"amount"},{label:e.jsxs(S,{spacing:"xs",position:"center",noWrap:!0,children:[e.jsx(ie,{}),e.jsx(I,{children:"Date"})]}),value:"date"}],value:n.orderBy,onChange:r=>t({orderBy:r})}),e.jsx(J,{label:"Direction",data:[{label:e.jsxs(S,{spacing:"xs",position:"center",noWrap:!0,children:[e.jsx(ze,{}),e.jsx(I,{children:"Ascending"})]}),value:"asc"},{label:e.jsxs(S,{spacing:"xs",position:"center",noWrap:!0,children:[e.jsx(Te,{}),e.jsx(I,{children:"Descending"})]}),value:"desc"}],value:n.direction,onChange:r=>t({direction:r})}),e.jsx(ue,{label:"Filter by tags",data:(a==null?void 0:a.map(({id:r,name:i,color:o})=>({value:r,label:i,color:o})))??[],icon:e.jsx(se,{}),placeholder:"Select tags",nothingFound:"Tag not found",itemComponent:oe,valueComponent:ce,maxLength:18,searchable:!0,value:n.tags,onChange:r=>t({tags:r})})]})}const me=1e6,ne=z.object({tagIds:z.array(z.string()).nonempty({message:"Required"}),description:z.string().trim().optional(),amount:z.number().min(0).max(me).optional().default(0),date:z.date()});function Ct({opened:a,closeForm:n,values:t,tags:r}){const i=$e({initialValues:{tagIds:[],description:"",amount:0,date:new Date},validate:Ve(ne)}),[o,d]=N(!1),[p,h]=l.useState(!1),[x,j]=l.useState(""),[c,v]=l.useState("red");return l.useEffect(()=>{a&&(t?i.setValues({...t,date:_(t.date).toDate()}):i.reset())},[a]),e.jsx(V,{opened:a,title:e.jsx(W,{order:5,children:t?"Edit expense":"Add expense"}),size:520,trapFocus:!0,onClose:n,target:".modal-container",children:e.jsxs("form",{onSubmit:i.onSubmit(s=>{n();const u=ne.parse(s),m=_(u.date).format("YYYY-MM-DD");t?Ye(t.id,{...u,date:m}):qe({...u,date:m})}),children:[e.jsxs(Y,{align:"stretch",spacing:"sm",children:[e.jsx(ue,{label:"Tags",data:(r==null?void 0:r.map(({id:s,name:u,color:m})=>({value:s,label:u,color:m})))??[],icon:p?e.jsx(le,{size:16}):e.jsx(se,{}),placeholder:p?"Loading tag...":"Select tags",nothingFound:"Tag not found",itemComponent:oe,valueComponent:ce,initiallyOpened:!1,maxLength:18,creatable:!0,searchable:!0,"data-autofocus":t?void 0:!0,disabled:p,getCreateLabel:s=>`+ Add tag ${s}`,onCreate:s=>{j(s),d.open()},...i.getInputProps("tagIds")}),e.jsx(V,{opened:o,title:e.jsx(W,{order:5,children:"Select tag color"}),onClose:d.close,target:".modal-container",children:e.jsxs(Y,{children:[e.jsx(Ie,{value:c,setValue:v}),e.jsxs(S,{position:"right",spacing:"sm",children:[e.jsx(P,{variant:"default",onClick:d.close,children:"Cancel"}),e.jsx(P,{variant:"filled",onClick:async()=>{d.close(),h(!0);const s=await de({name:x,color:c}),u=await Pe(s);h(!1),i.setFieldValue("tagIds",[...i.values.tagIds,u.id])},children:"Confirm"})]})]})}),e.jsx(ge,{label:"Description",...i.getInputProps("description")}),e.jsxs(S,{align:"flex-start",spacing:"sm",grow:!0,children:[e.jsx(Ge,{label:"Amount",parser:s=>s==null?void 0:s.replace(/\$\s?|(,*)/g,""),formatter:s=>s&&!Number.isNaN(+s)?`$ ${s}`.replace(/\B(?=(\d{3})+(?!\d))/g,","):"$ ",placeholder:"Enter amount",min:0,max:me,precision:2,"data-autofocus":!0,...i.getInputProps("amount")}),e.jsx(Je,{label:"Date",icon:e.jsx(ie,{}),placeholder:"Pick date",...i.getInputProps("date")})]})]}),e.jsx(S,{position:"right",mt:"md",children:e.jsx(P,{type:"submit",children:"Confirm"})})]})})}_.extend(Ke);_.extend(Ze);function Lt({expense:a,tags:n,visibleNumbers:t,setFormValues:r,openExpenseForm:i}){const o=_e(),d=()=>De({title:e.jsx(W,{order:5,children:"Are you sure you want to delete this expense?"}),labels:{confirm:"Delete",cancel:"Cancel"},onConfirm:()=>Qe(a.id),confirmProps:{color:"red"},centered:!0,target:".modal-container"});return e.jsxs(O.Row,{layoutId:a.id,children:[e.jsx("td",{children:e.jsx(S,{spacing:8,noWrap:!0,children:n==null?void 0:n.map(p=>e.jsx(tt,{color:p.color,radius:"sm",children:p.name},p.id))})}),e.jsx("td",{children:a.description}),e.jsx("td",{style:{textAlign:"right"},children:t?`$${a.amount.toLocaleString()}`:"*****"}),e.jsx("td",{children:e.jsx(I,{children:_(a.date).format("L")})}),e.jsx("td",{children:e.jsxs(S,{position:"right",spacing:0,noWrap:!0,children:[e.jsx(q,{label:"Edit",withinPortal:!0,children:e.jsx(G,{color:o.primaryColor,onClick:()=>{r(a),i()},children:e.jsx(Oe,{})})}),e.jsx(q,{label:"Delete",withinPortal:!0,children:e.jsx(G,{color:"red",onClick:d,children:e.jsx(Ae,{})})})]})})]})}const ae=20;function Mt({visibleNumbers:a}){const n=Q(Fe,U("name","asc")),[t,r]=X(n),[i,o]=He({key:"expense-filters",defaultValue:{orderBy:"date",direction:"desc",tags:[]},getInitialValueInEffect:!1}),d=g=>{o(L=>({...L,...g}))},[p,h]=l.useState(ae),x=[U(i.orderBy,i.direction),Me(p)];i.tags.length&&x.push(Ne("tagIds","array-contains-any",i.tags));const j=Q(We,...x),[c,v]=X(j),[s,u]=N(!1),[m,w]=N(!1),[R,E]=l.useState(),y=l.useRef(),{ref:C,entry:b}=et({root:y.current,threshold:.5});return l.useEffect(()=>{b!=null&&b.isIntersecting&&!v&&h(g=>g+ae)},[b==null?void 0:b.isIntersecting]),e.jsxs(F,{children:[e.jsx(F.Header,{title:"Expenses",loading:r||v,buttons:e.jsxs(e.Fragment,{children:[e.jsx(P,{leftIcon:e.jsx(ke,{}),onClick:()=>{E(void 0),u.open()},children:"New expense"}),e.jsx(P,{variant:"light",leftIcon:e.jsx(Be,{}),onClick:w.open,children:"Manage tags"})]}),filters:e.jsx(wt,{tags:t,filters:i,updateFilter:d}),withNumbersToggle:!0}),e.jsxs(F.Body,{ref:C,children:[e.jsx(Ct,{opened:s,closeForm:u.close,values:R,tags:t}),e.jsx(Ue,{opened:m,close:w.close,label:"tag",items:t,addItem:de}),e.jsxs(Xe,{in:!!(t&&c),children:[e.jsxs(O,{children:[e.jsxs(O.Header,{children:[e.jsx("th",{style:{width:0},children:"Tags"}),e.jsx("th",{children:"Description"}),e.jsx("th",{style:{width:0,textAlign:"right"},children:"Amount"}),e.jsx("th",{style:{width:0,textAlign:"center"},children:"Date"}),e.jsx("th",{style:{width:0}})]}),e.jsx(O.Body,{children:c==null?void 0:c.map(g=>e.jsx(Lt,{expense:g,tags:t==null?void 0:t.filter(L=>g.tagIds.includes(L.id)),visibleNumbers:a,setFormValues:E,openExpenseForm:u.open},g.id))})]}),(c==null?void 0:c.length)===p&&e.jsx(S,{ref:C,pt:"xs",pb:"lg",position:"center",children:e.jsx(le,{})})]})]})]})}export{Mt as default};