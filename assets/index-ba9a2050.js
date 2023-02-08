import{r as h,j as e,A as p,ar as te,E as z,N as Q,a7 as le,G as j,as as _,T as C,at as H,c as ie,d as de,u as $,t as W,i as k,au as ce,M as ue,q as U,av as xe,L as he,aw as ge,O as X,B as F,g as D,ax as me,h as S,P as I,ay as je,k as fe,m as pe,p as be,v as q,w as E,$ as ye,X as Ce,D as L,az as we,aA as Se}from"./index-5e2edfad.js";import{N as v,T as Y,u as J,z as K,h as Ie,i as Z,m,j as O,k as Le}from"./index-a5831603.js";import{L as Re}from"./ListManager-e0fc105a.js";import{u as A,L as ke}from"./useCollectionDataPersistent-d403fc62.js";import{L as B}from"./LabeledSegmentedControl-41c67f9f.js";import{t as G}from"./tinycolor-fc7bd882.js";import{C as Fe,M as w,u as De,T as R}from"./Tabs-a4903f5e.js";import{S as Pe}from"./Select-17f88182.js";import"./use-input-state-d6524906.js";import"./HueSlider-65ab6440.js";const Te=Q(n=>({wrapper:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:4,borderRadius:n.radius[n.defaultRadius],backgroundColor:n.colorScheme==="dark"?n.colors.dark[8]:n.colors.gray[1],"&:focus-within":{borderColor:n.colors[n.primaryColor][6]}},control:{backgroundColor:n.colorScheme==="dark"?n.colors.dark[5]:n.white,boxShadow:n.shadows.xs,transition:"color 200ms","&:disabled":{opacity:.8,backgroundColor:"transparent",boxShadow:"none"},"&:hover":{color:n.colorScheme==="dark"?n.white:n.black}},input:{width:70,textAlign:"center",paddingRight:`${n.spacing.sm}px !important`,paddingLeft:`${n.spacing.sm}px !important`,height:28,flex:1}}));function Me({min:n,max:r,value:i,onChange:o}){const{classes:s}=Te(),a=h.useRef(null);return e.jsxs("div",{className:s.wrapper,children:[e.jsx(p,{size:28,variant:"transparent",onClick:()=>{var t;return(t=a.current)==null?void 0:t.decrement()},disabled:i===n,className:s.control,onMouseDown:t=>t.preventDefault(),children:e.jsx(te,{})}),e.jsx(v,{variant:"unstyled",min:n,max:r,handlersRef:a,value:i,onChange:o,classNames:{input:s.input}}),e.jsx(p,{size:28,variant:"transparent",onClick:()=>{var t;return(t=a.current)==null?void 0:t.increment()},disabled:i===r,className:s.control,onMouseDown:t=>t.preventDefault(),children:e.jsx(z,{})})]})}function qe({setSearchValue:n,filters:r,updateFilter:i}){return e.jsxs(e.Fragment,{children:[e.jsx(Y,{label:"Search",icon:e.jsx(le,{}),placeholder:"Search items",maxLength:20,"data-autofocus":!0,onChange:({target:{value:o}})=>n(o)}),e.jsx(B,{label:"Order by",data:[{label:e.jsxs(j,{spacing:"xs",position:"center",noWrap:!0,children:[e.jsx(_,{}),e.jsx(C,{children:"Code"})]}),value:"code"},{label:e.jsxs(j,{spacing:"xs",position:"center",noWrap:!0,children:[e.jsx(H,{}),e.jsx(C,{children:"Quantity"})]}),value:"quantity"}],value:r.orderBy,onChange:o=>i({orderBy:o})}),e.jsx(B,{label:"Direction",data:[{label:e.jsxs(j,{spacing:"xs",position:"center",noWrap:!0,children:[e.jsx(ie,{}),e.jsx(C,{children:"Ascending"})]}),value:"asc"},{label:e.jsxs(j,{spacing:"xs",position:"center",noWrap:!0,children:[e.jsx(de,{}),e.jsx(C,{children:"Descending"})]}),value:"desc"}],value:r.direction,onChange:o=>i({direction:o})})]})}const Ee=["hex","rgb","hsl"];function ee({menuPosition:n,...r}){const i=$(),[o,s]=W({key:"preferred-color-format",defaultValue:"rgb"});return e.jsx(Fe,{placeholder:"Select color",format:o,fixOnBlur:!1,rightSection:e.jsxs(w,{position:n,children:[e.jsx(w.Target,{children:e.jsx(k,{label:"Color format",children:e.jsx(p,{size:"md",children:e.jsx(ce,{})})})}),e.jsx(w.Dropdown,{children:Ee.map(a=>e.jsx(w.Item,{color:o===a?i.fn.primaryColor():void 0,onClick:()=>s(a),children:a.toUpperCase()},a))})]}),...r})}const ne=20,se=1e6,N=m.object({stockGroupId:m.string({invalid_type_error:"Required"}).trim().min(1,{message:"Required"}),code:m.string().trim().min(1,{message:"Required"}).max(ne),quantity:m.number({invalid_type_error:"Required"}).min(0).max(se),color:m.string().refine(n=>!n||["hex","rgb","hsl"].includes(G(n).getFormat()),{message:"Invalid color"})});function Oe({opened:n,closeForm:r,activeGroup:i,stockGroups:o,setActiveGroup:s}){const a=J({initialValues:{stockGroupId:"",code:"",quantity:0,color:""},validate:K(N)}),[t,g]=h.useState(!1);return h.useEffect(()=>{n&&(a.reset(),i&&a.setValues({stockGroupId:i.id}))},[n]),e.jsx(ue,{opened:n,title:e.jsx(U,{order:5,children:"Add item"}),size:520,trapFocus:!0,onClose:r,target:".modal-container",children:e.jsxs("form",{onSubmit:a.onSubmit(({stockGroupId:d,...u})=>{r(),Ie(d,N.omit({stockGroupId:!0}).parse(u))}),children:[e.jsxs(xe,{cols:2,spacing:"sm",children:[e.jsx(Pe,{label:"Group",data:(o==null?void 0:o.map(({id:d,name:u})=>({value:d,label:u})))??[],icon:t?e.jsx(he,{size:16}):e.jsx(ge,{}),placeholder:t?"Loading group...":"Select group",nothingFound:"Group not found",initiallyOpened:!1,maxLength:36,creatable:!0,searchable:!0,selectOnBlur:!0,"data-autofocus":o!=null&&o.length&&i?void 0:!0,disabled:t,getCreateLabel:d=>`+ Add group ${d}`,onCreate:async d=>{g(!0);const u=await Z({name:d}),x=await X(u);g(!1),s({id:x.id,name:d}),a.setFieldValue("stockGroupId",x.id)},...a.getInputProps("stockGroupId")}),e.jsx(Y,{label:"Code",icon:e.jsx(_,{}),placeholder:"Enter code",maxLength:ne,"data-autofocus":!0,...a.getInputProps("code")}),e.jsx(v,{label:"Quantity",icon:e.jsx(H,{}),placeholder:"Enter quantity",min:0,max:se,...a.getInputProps("quantity")}),e.jsx(ee,{label:"Color",menuPosition:"right",...a.getInputProps("color")})]}),e.jsx(j,{position:"right",mt:"md",children:e.jsx(F,{type:"submit",children:"Confirm"})})]})})}const V=m.object({color:m.string().refine(n=>!n||["hex","rgb","hsl"].includes(G(n).getFormat()),{message:"Invalid color"})});function Ae({item:n,activeGroup:r}){const i=$(),o=J({initialValues:{color:""},validate:K(V)}),[s,a]=D(!1),[t,g]=h.useState(n.quantity),[d,u]=me(t,500);h.useEffect(()=>{s&&(o.reset(),n.color&&o.setFieldValue("color",n.color))},[s]),h.useEffect(()=>{u(),g(n.quantity)},[n.quantity]),h.useEffect(()=>{r&&n.quantity!==d&&O(r.id,n.id,{quantity:d})},[d]);const x=()=>be({title:e.jsx(U,{order:5,children:"Are you sure you want to delete this item?"}),labels:{confirm:"Delete",cancel:"Cancel"},onConfirm:()=>{r&&Le(r.id,n.id)},confirmProps:{color:"red"},centered:!0,target:".modal-container"});return e.jsxs(S.Row,{layoutId:n.id,children:[e.jsx("td",{children:e.jsxs(I,{position:"right",trapFocus:!0,opened:s,onChange:a.toggle,withinPortal:!0,children:[e.jsx(I.Target,{children:e.jsx(k,{label:"Click to change color",position:"right",disabled:s,children:e.jsx(je,{color:n.color,onClick:a.open,sx:{cursor:"pointer",zIndex:0}})})}),e.jsx(I.Dropdown,{children:e.jsx("form",{onSubmit:o.onSubmit(f=>{r&&(a.close(),O(r.id,n.id,V.parse(f)))}),children:e.jsxs(j,{spacing:"sm",align:"flex-start",children:[e.jsx(ee,{withinPortal:!1,...o.getInputProps("color")}),e.jsx(p,{variant:"filled",color:i.primaryColor,my:1,type:"submit",children:e.jsx(fe,{})})]})})})]})}),e.jsx("td",{children:n.code}),e.jsx("td",{children:e.jsx(Me,{min:0,max:999999,value:t,onChange:f=>g(f??0)})}),e.jsx("td",{children:e.jsx(k,{label:"Delete",withinPortal:!0,children:e.jsx(p,{color:"red",onClick:x,children:e.jsx(pe,{})})})})]})}const Be=Q(n=>({tab:{"&[data-active]":{backgroundColor:n.fn.variant({variant:"light",color:n.primaryColor}).background,color:n.fn.variant({variant:"light",color:n.primaryColor}).color}}}));function ve({activeGroup:n,setActiveGroup:r}){const{classes:i}=Be(),o=q(ye,E("name","asc")),[s,a]=A(o),[t,g]=W({key:"stock-filters",defaultValue:{orderBy:"code",direction:"asc"},getInitialValueInEffect:!1}),d=l=>{g(c=>({...c,...l}))},u=n?q(Ce(n.id),E(t.orderBy,t.direction)):null,[x,f]=A(u),[P,oe]=De("",200),b=h.useMemo(()=>x==null?void 0:x.filter(l=>l.code.match(new RegExp(P,"gi"))),[x,P]),[ae,T]=D(!1),[re,M]=D(!1);return h.useEffect(()=>{const l=s==null?void 0:s.find(({id:c})=>(n==null?void 0:n.id)===c);l&&l.name!==(n==null?void 0:n.name)&&r(l),s!=null&&s.some(({id:c})=>(n==null?void 0:n.id)===c)||a||r(s==null?void 0:s[0])},[s]),e.jsxs(L,{children:[e.jsx(L.Header,{title:"Stock",loading:a||f,buttons:e.jsxs(e.Fragment,{children:[e.jsx(F,{leftIcon:e.jsx(z,{}),onClick:T.open,children:"New item"}),e.jsx(F,{variant:"light",leftIcon:e.jsx(we,{}),onClick:M.open,children:"Manage groups"})]}),filters:e.jsx(qe,{setSearchValue:oe,filters:t,updateFilter:d}),pb:s!=null&&s.length?0:"lg",withBorder:!(s!=null&&s.length),children:e.jsx(Se,{in:!!(s!=null&&s.length),children:e.jsx(R,{mx:"-lg",pt:"lg",value:n==null?void 0:n.id,onTabChange:l=>r(s==null?void 0:s.find(({id:c})=>l===c)),children:e.jsx(R.List,{children:s==null?void 0:s.map(({id:l,name:c},y)=>e.jsx(R.Tab,{className:i.tab,value:l,ml:y===0?"lg":void 0,mr:y===(s==null?void 0:s.length)-1?"lg":void 0,children:c},l))})})})}),e.jsxs(L.Body,{children:[e.jsx(Oe,{opened:ae,closeForm:T.close,stockGroups:s,activeGroup:n,setActiveGroup:r}),e.jsx(Re,{opened:re,close:M.close,label:"group",items:s,addItem:async l=>{const c=await Z(l),y=await X(c);r({id:y.id,name:l.name})}}),e.jsx(ke,{in:!!b,children:e.jsxs(S,{children:[e.jsxs(S.Header,{children:[e.jsx("th",{style:{width:0},children:"Color"}),e.jsx("th",{children:"Code"}),e.jsx("th",{style:{width:0,textAlign:"center"},children:"Quantity"}),e.jsx("th",{style:{width:0}})]}),e.jsx(S.Body,{children:b==null?void 0:b.map(l=>e.jsx(Ae,{item:l,activeGroup:n},l.id))})]})})]})]})}export{ve as default};
