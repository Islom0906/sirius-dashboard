"use strict";(self.webpackChunkevolution_motors=self.webpackChunkevolution_motors||[]).push([[578],{11578:(e,t,i)=>{i.r(t),i.d(t,{default:()=>k});var d=i(50390),r=i(83099),s=i(87309),a=i(34571),n=i(89461),l=i(31752),o=i(82622),c=i(16030),u=i(77221),x=i(57689),h=i(80184);const p=e=>{let{data:t,deleteHandle:i}=e;const p=(0,c.I0)(),j=(0,x.s0)(),g=[{title:"Title Uz",dataIndex:"title_uz",id:"title_uz",render:e=>(0,h.jsx)("p",{children:e})},{title:"Title Ru",dataIndex:"title_ru",id:"title_ru",render:e=>(0,h.jsx)("p",{children:e})},{title:"Image",dataIndex:"image",id:"image",render:e=>(0,h.jsx)(d.Z,{width:50,src:e})},{title:"Action",id:"action",render:(e,t)=>(0,h.jsxs)(r.Z,{size:20,children:[(0,h.jsx)(s.Z,{onClick:()=>{return e=null===t||void 0===t?void 0:t.id,localStorage.setItem("editDataId",e),p({type:u.Pb,payload:e}),void j("/index-category/add");var e},type:"primary",icon:(0,h.jsx)(l.Z,{}),children:"Edit"}),(0,h.jsx)(a.Z,{title:"Are you sure to delete this task?",description:"Delete the task ",onConfirm:()=>(async e=>{i("/index-categories",e)})(t.id),children:(0,h.jsx)(s.Z,{type:"danger",icon:(0,h.jsx)(o.Z,{}),children:"Delete"})})]})}];return(0,h.jsx)("div",{children:(0,h.jsx)(n.Z,{columns:g,dataSource:t,rowKey:e=>null===e||void 0===e?void 0:e.id})})};var j=i(50419),g=i(66106),y=i(30914),Z=i(49389),v=i(37083),m=i(79286),w=i(27169),C=i(91933),f=i(72791);const k=()=>{const e=(0,x.s0)(),t=(0,c.I0)(),{mutate:i,isSuccess:d,isLoading:a}=(0,C.useMutation)((e=>{let{url:t,id:i}=e;return w.Z.deleteData(t,i)})),{data:n,isLoading:l,refetch:o}=(0,C.useQuery)("index-category-get",(()=>w.Z.getData("/index-categories/")),{onError:e=>{j.ZP.error(e)}}),[k,I]=(0,f.useState)([]),[_,z]=(0,f.useState)(!1);(0,f.useEffect)((()=>{d&&o()}),[d]);return(0,h.jsx)("div",{className:"site-space-compact-wrapper",children:(0,h.jsxs)(r.Z,{direction:"vertical",style:{width:"100%"},children:[(0,h.jsxs)(g.Z,{gutter:20,children:[(0,h.jsx)(y.Z,{span:16,children:(0,h.jsx)(Z.default,{onChange:e=>(e=>{z(""!==e);const t=null===n||void 0===n?void 0:n.filter((t=>t.title_ru.toLowerCase().includes(e.toLowerCase())||t.title_uz.toLowerCase().includes(e.toLowerCase())));I(t)})(e.target.value)})}),(0,h.jsx)(y.Z,{span:8,children:(0,h.jsx)(s.Z,{type:"primary",icon:(0,h.jsx)(m.Z,{}),style:{width:"100%"},onClick:()=>{t({type:u.Pb,payload:""}),e("/index-category/add")},children:"Add"})})]}),(0,h.jsx)(v.Z,{size:"medium",spinning:l||a,children:(0,h.jsx)(p,{data:_?k:n,deleteHandle:(e,t)=>{i({url:e,id:t})}})})]})})}}}]);
//# sourceMappingURL=578.30397644.chunk.js.map