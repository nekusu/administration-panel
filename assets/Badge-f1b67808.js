import{I as E,r as j,J as k,H as c,a5 as B,a9 as C}from"./index-5ff1983a.js";var R=Object.defineProperty,I=Object.defineProperties,D=Object.getOwnPropertyDescriptors,S=Object.getOwnPropertySymbols,H=Object.prototype.hasOwnProperty,V=Object.prototype.propertyIsEnumerable,y=(r,e,t)=>e in r?R(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,p=(r,e)=>{for(var t in e||(e={}))H.call(e,t)&&y(r,t,e[t]);if(S)for(var t of S(e))V.call(e,t)&&y(r,t,e[t]);return r},W=(r,e)=>I(r,D(e));const g={xs:{fontSize:9,height:16},sm:{fontSize:10,height:18},md:{fontSize:11,height:20},lg:{fontSize:13,height:26},xl:{fontSize:16,height:32}},L={xs:4,sm:4,md:6,lg:8,xl:10};function T({theme:r,variant:e,color:t,size:o,gradient:s}){if(e==="dot"){const a=r.fn.size({size:o,sizes:L});return{backgroundColor:"transparent",color:r.colorScheme==="dark"?r.colors.dark[0]:r.colors.gray[7],border:`1px solid ${r.colorScheme==="dark"?r.colors.dark[3]:r.colors.gray[3]}`,paddingLeft:r.fn.size({size:o,sizes:r.spacing})/1.5-a/2,"&::before":{content:'""',display:"block",width:a,height:a,borderRadius:a,backgroundColor:r.fn.themeColor(t,r.colorScheme==="dark"?4:r.fn.primaryShade("light"),!0),marginRight:a}}}const n=r.fn.variant({color:t,variant:e,gradient:s});return{background:n.background,color:n.color,border:`${e==="gradient"?0:1}px solid ${n.border}`}}var J=E((r,{color:e,size:t,radius:o,gradient:s,fullWidth:n,variant:a})=>{const{fontSize:f,height:i}=t in g?g[t]:g.md;return{leftSection:{marginRight:`calc(${r.spacing.xs}px / 2)`},rightSection:{marginLeft:`calc(${r.spacing.xs}px / 2)`},inner:{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},root:p(W(p(p({},r.fn.focusStyles()),r.fn.fontStyles()),{fontSize:f,height:i,WebkitTapHighlightColor:"transparent",lineHeight:`${i-2}px`,textDecoration:"none",padding:`0 ${r.fn.size({size:t,sizes:r.spacing})/1.5}px`,boxSizing:"border-box",display:n?"flex":"inline-flex",alignItems:"center",justifyContent:"center",width:n?"100%":"auto",textTransform:"uppercase",borderRadius:r.fn.radius(o),fontWeight:700,letterSpacing:.25,cursor:"inherit",textOverflow:"ellipsis",overflow:"hidden"}),T({theme:r,variant:a,color:e,size:t,gradient:s}))}});const q=J;var A=Object.defineProperty,d=Object.getOwnPropertySymbols,v=Object.prototype.hasOwnProperty,h=Object.prototype.propertyIsEnumerable,m=(r,e,t)=>e in r?A(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,F=(r,e)=>{for(var t in e||(e={}))v.call(e,t)&&m(r,t,e[t]);if(d)for(var t of d(e))h.call(e,t)&&m(r,t,e[t]);return r},G=(r,e)=>{var t={};for(var o in r)v.call(r,o)&&e.indexOf(o)<0&&(t[o]=r[o]);if(r!=null&&d)for(var o of d(r))e.indexOf(o)<0&&h.call(r,o)&&(t[o]=r[o]);return t};const K={variant:"light",size:"md",radius:"xl"},x=j.forwardRef((r,e)=>{const t=k("Badge",K,r),{className:o,color:s,variant:n,fullWidth:a,children:f,size:i,leftSection:u,rightSection:_,radius:O,gradient:b,classNames:P,styles:w,unstyled:z}=t,$=G(t,["className","color","variant","fullWidth","children","size","leftSection","rightSection","radius","gradient","classNames","styles","unstyled"]),{classes:l,cx:N}=q({size:i,fullWidth:a,color:s,radius:O,variant:n,gradient:b},{classNames:P,styles:w,name:"Badge",unstyled:z});return c.createElement(B,F({className:N(l.root,o),ref:e},$),u&&c.createElement("span",{className:l.leftSection},u),c.createElement("span",{className:l.inner},f),_&&c.createElement("span",{className:l.rightSection},_))});x.displayName="@mantine/core/Badge";const Q=C(x);export{Q as B};