"use strict";(self.webpackChunksirius_tech_motors=self.webpackChunksirius_tech_motors||[]).push([[235],{85732:(e,t,n)=>{n.r(t),n.d(t,{default:()=>k});var r=n(72791),a=n(50390),c=n(47528),o=n(83099),s=n(87309),l=n(34571),i=n(89461),d=n(31752),u=n(82622),p=n(16030),f=n(77221),h=n(57689),m=n(80184);const x=e=>{let{data:t,deleteHandle:n}=e;const r=(0,p.I0)(),x=(0,h.s0)(),y=[{title:"\u0418\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435 \u0434\u043b\u044f \u0432\u0435\u0440\u0441\u0438\u0438 \u0434\u043b\u044f \u041f\u041a",dataIndex:"web_image_ru",id:"web_image_ru",render:e=>(0,m.jsx)(a.Z,{width:50,src:e})},{title:"\u0418\u0437\u043e\u0431\u0440\u0430\u0436\u0435\u043d\u0438\u0435 \u0434\u043b\u044f \u043c\u043e\u0431\u0438\u043b\u044c\u043d\u043e\u0439 \u0432\u0435\u0440\u0441\u0438\u0438",dataIndex:"rsp_image_ru",id:"rsp_image_ru",render:e=>(0,m.jsx)(a.Z,{width:50,src:e})},{title:"\u042d\u0442\u043e \u0440\u0435\u043a\u043b\u0430\u043c\u043d\u044b\u0439 \u0431\u0430\u043d\u043d\u0435\u0440?",dataIndex:"is_advertisement",id:"is_advertisement",render:e=>e?(0,m.jsx)(c.Z,{color:"#108ee9",children:"\u0414\u0430"}):(0,m.jsx)(c.Z,{color:"#f50",children:"\u041d\u0435\u0442"})},{title:"Action",id:"action",render:(e,t)=>(0,m.jsxs)(o.Z,{size:20,children:[(0,m.jsx)(s.Z,{onClick:()=>{return e=t.id,localStorage.setItem("editDataId",e),r({type:f.Pb,payload:e}),void x("/banner/add");var e},type:"primary",icon:(0,m.jsx)(d.Z,{}),children:"Edit"}),(0,m.jsx)(l.Z,{title:"Are you sure to delete this task?",description:"Delete the task ",onConfirm:()=>(async e=>{n("/banners",e)})(t.id),children:(0,m.jsx)(s.Z,{type:"danger",icon:(0,m.jsx)(u.Z,{}),children:"Delete"})})]})}];return(0,m.jsx)("div",{children:(0,m.jsx)(i.Z,{columns:y,dataSource:t,rowKey:e=>e.id})})};var y=n(50419),b=n(66106),v=n(30914),Z=n(49389),g=n(37083),j=n(79286),C=n(27169),w=n(91933);const k=()=>{const e=(0,h.s0)(),t=(0,p.I0)(),{mutate:n,isSuccess:a,isLoading:c}=(0,w.useMutation)((e=>{let{url:t,id:n}=e;return C.Z.deleteData(t,n)})),{data:l,isLoading:i,refetch:d}=(0,w.useQuery)("banner-get",(()=>C.Z.getData("/banner/")),{onError:e=>{for(let t in e.response.data)y.ZP.error("".concat(t,": ").concat(e.response.data[t][0]))}}),[u,k]=(0,r.useState)([]),[E,O]=(0,r.useState)(!1);(0,r.useEffect)((()=>{a&&d()}),[a]);return(0,m.jsx)("div",{className:"site-space-compact-wrapper",children:(0,m.jsxs)(o.Z,{direction:"vertical",style:{width:"100%"},children:[(0,m.jsxs)(b.Z,{gutter:20,children:[(0,m.jsx)(v.Z,{span:16,children:(0,m.jsx)(Z.default,{onChange:e=>(e=>{O(""!==e);const t=null===l||void 0===l?void 0:l.filter((t=>t.name_uz.toLowerCase().includes(e.toLowerCase())||t.name_ru.toLowerCase().includes(e.toLowerCase())));k(t)})(e.target.value)})}),(0,m.jsx)(v.Z,{span:8,children:(0,m.jsx)(s.Z,{type:"primary",icon:(0,m.jsx)(j.Z,{}),style:{width:"100%"},onClick:()=>{t({type:f.Pb,payload:""}),e("/banner/add")},children:"Add"})})]}),(0,m.jsx)(g.Z,{size:"medium",spinning:i||c,children:(0,m.jsx)(x,{data:E?u:l,deleteHandle:(e,t)=>{n({url:e,id:t})}})})]})})}},47528:(e,t,n)=>{n.d(t,{Z:()=>g});var r=n(4942),a=n(87462),c=n(29439),o=n(60732),s=n(81694),l=n.n(s),i=n(41818),d=n(72791),u=n(71929),p=n(54466),f=n(12833),h=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var a=0;for(r=Object.getOwnPropertySymbols(e);a<r.length;a++)t.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]])}return n};const m=function(e){var t=e.prefixCls,n=e.className,c=e.checked,o=e.onChange,s=e.onClick,i=h(e,["prefixCls","className","checked","onChange","onClick"]),p=(0,d.useContext(u.E_).getPrefixCls)("tag",t),f=l()(p,(0,r.Z)((0,r.Z)({},"".concat(p,"-checkable"),!0),"".concat(p,"-checkable-checked"),c),n);return d.createElement("span",(0,a.Z)({},i,{className:f,onClick:function(e){null===o||void 0===o||o(!c),null===s||void 0===s||s(e)}}))};var x=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var a=0;for(r=Object.getOwnPropertySymbols(e);a<r.length;a++)t.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]])}return n},y=new RegExp("^(".concat(p.Y.join("|"),")(-inverse)?$")),b=new RegExp("^(".concat(p.E.join("|"),")$")),v=function(e,t){var n=e.prefixCls,s=e.className,p=e.style,h=e.children,m=e.icon,v=e.color,Z=e.onClose,g=e.closeIcon,j=e.closable,C=void 0!==j&&j,w=x(e,["prefixCls","className","style","children","icon","color","onClose","closeIcon","closable"]),k=d.useContext(u.E_),E=k.getPrefixCls,O=k.direction,_=d.useState(!0),P=(0,c.Z)(_,2),I=P[0],S=P[1];d.useEffect((function(){"visible"in w&&S(w.visible)}),[w.visible]);var N=function(){return!!v&&(y.test(v)||b.test(v))},L=(0,a.Z)({backgroundColor:v&&!N()?v:void 0},p),D=N(),z=E("tag",n),A=l()(z,(0,r.Z)((0,r.Z)((0,r.Z)((0,r.Z)({},"".concat(z,"-").concat(v),D),"".concat(z,"-has-color"),v&&!D),"".concat(z,"-hidden"),!I),"".concat(z,"-rtl"),"rtl"===O),s),R=function(e){e.stopPropagation(),null===Z||void 0===Z||Z(e),e.defaultPrevented||"visible"in w||S(!1)},H="onClick"in w||h&&"a"===h.type,$=(0,i.Z)(w,["visible"]),F=m||null,K=F?d.createElement(d.Fragment,null,F,d.createElement("span",null,h)):h,M=d.createElement("span",(0,a.Z)({},$,{ref:t,className:A,style:L}),K,C?g?d.createElement("span",{className:"".concat(z,"-close-icon"),onClick:R},g):d.createElement(o.Z,{className:"".concat(z,"-close-icon"),onClick:R}):null);return H?d.createElement(f.Z,null,M):M},Z=d.forwardRef(v);Z.CheckableTag=m;const g=Z}}]);
//# sourceMappingURL=235.d8e6e8c5.chunk.js.map