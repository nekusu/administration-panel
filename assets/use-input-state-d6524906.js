import{r as o}from"./index-5e2edfad.js";function r(t){return e=>{if(!e)t(e);else if(typeof e=="function")t(e);else if(typeof e=="object"&&"nativeEvent"in e){const{currentTarget:n}=e;n.type==="checkbox"?t(n.checked):t(n.value)}else t(e)}}function f(t){const[e,n]=o.useState(t);return[e,r(n)]}export{f as u};