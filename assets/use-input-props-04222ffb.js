import{J as A,an as E,a8 as W}from"./index-5ff1983a.js";var J=Object.defineProperty,R=Object.defineProperties,V=Object.getOwnPropertyDescriptors,a=Object.getOwnPropertySymbols,u=Object.prototype.hasOwnProperty,y=Object.prototype.propertyIsEnumerable,f=(r,e,t)=>e in r?J(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,n=(r,e)=>{for(var t in e||(e={}))u.call(e,t)&&f(r,t,e[t]);if(a)for(var t of a(e))y.call(e,t)&&f(r,t,e[t]);return r},k=(r,e)=>R(r,V(e)),B=(r,e)=>{var t={};for(var s in r)u.call(r,s)&&e.indexOf(s)<0&&(t[s]=r[s]);if(r!=null&&a)for(var s of a(r))e.indexOf(s)<0&&y.call(r,s)&&(t[s]=r[s]);return t};function G(r,e,t){const s=A(r,e,t),{label:O,description:m,error:l,required:d,classNames:o,styles:p,className:v,unstyled:i,__staticSelector:_,sx:w,errorProps:b,labelProps:S,descriptionProps:g,wrapperProps:h,id:j,size:P,style:x,inputContainer:N,inputWrapperOrder:I,withAsterisk:C}=s,D=B(s,["label","description","error","required","classNames","styles","className","unstyled","__staticSelector","sx","errorProps","labelProps","descriptionProps","wrapperProps","id","size","style","inputContainer","inputWrapperOrder","withAsterisk"]),c=E(j),{systemStyles:q,rest:z}=W(D);return k(n({},z),{classNames:o,styles:p,unstyled:i,wrapperProps:n(n({label:O,description:m,error:l,required:d,classNames:o,className:v,__staticSelector:_,sx:w,errorProps:b,labelProps:S,descriptionProps:g,unstyled:i,styles:p,id:c,size:P,style:x,inputContainer:N,inputWrapperOrder:I,withAsterisk:C},h),q),inputProps:{required:d,classNames:o,styles:p,unstyled:i,id:c,size:P,__staticSelector:_,invalid:!!l}})}export{G as u};
