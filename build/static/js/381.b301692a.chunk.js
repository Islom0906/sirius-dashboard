"use strict";(self.webpackChunkevolution_motors=self.webpackChunkevolution_motors||[]).push([[381],{13381:(e,t,i)=>{i.r(t),i.d(t,{default:()=>k});var s=i(50390),d=i(83099),r=i(87309),a=i(34571),l=i(89461),n=i(31752),o=i(82622),c=i(16030),u=i(77221),h=i(57689),x=i(80184);const v=e=>{let{data:t,deleteHandle:i}=e;const v=(0,c.I0)(),p=(0,h.s0)(),j=[{title:"Title Uz",dataIndex:"title_uz",id:"title_uz",render:e=>(0,x.jsx)("p",{children:e})},{title:"Title Ru",dataIndex:"title_ru",id:"title_ru",render:e=>(0,x.jsx)("p",{children:e})},{title:"Image",dataIndex:"image",id:"image",render:e=>(0,x.jsx)(s.Z,{width:50,src:e})},{title:"Action",id:"action",render:(e,t)=>(0,x.jsxs)(d.Z,{size:20,children:[(0,x.jsx)(r.Z,{onClick:()=>{return e=null===t||void 0===t?void 0:t.id,localStorage.setItem("editDataId",e),v({type:u.Pb,payload:e}),void p("/service/add");var e},type:"primary",icon:(0,x.jsx)(n.Z,{}),children:"Edit"}),(0,x.jsx)(a.Z,{title:"Are you sure to delete this task?",description:"Delete the task ",onConfirm:()=>(async e=>{i("/about/services",e)})(t.id),children:(0,x.jsx)(r.Z,{type:"danger",icon:(0,x.jsx)(o.Z,{}),children:"Delete"})})]})}];return(0,x.jsx)("div",{children:(0,x.jsx)(l.Z,{columns:j,dataSource:t,rowKey:e=>null===e||void 0===e?void 0:e.id})})};var p=i(50419),j=i(66106),Z=i(30914),m=i(49389),y=i(37083),g=i(79286),w=i(27169),C=i(91933),f=i(72791);const k=()=>{const e=(0,h.s0)(),t=(0,c.I0)(),{mutate:i,isSuccess:s,isLoading:a}=(0,C.useMutation)((e=>{let{url:t,id:i}=e;return w.Z.deleteData(t,i)})),{data:l,isLoading:n,refetch:o}=(0,C.useQuery)("service-get",(()=>w.Z.getData("/about/services/")),{onError:e=>{p.ZP.error(e)}}),[k,I]=(0,f.useState)([]),[_,b]=(0,f.useState)(!1);(0,f.useEffect)((()=>{s&&o()}),[s]);return(0,x.jsx)("div",{className:"site-space-compact-wrapper",children:(0,x.jsxs)(d.Z,{direction:"vertical",style:{width:"100%"},children:[(0,x.jsxs)(j.Z,{gutter:20,children:[(0,x.jsx)(Z.Z,{span:16,children:(0,x.jsx)(m.default,{onChange:e=>(e=>{b(""!==e);const t=null===l||void 0===l?void 0:l.filter((t=>t.title_ru.toLowerCase().includes(e.toLowerCase())||t.title_uz.toLowerCase().includes(e.toLowerCase())));I(t)})(e.target.value)})}),(0,x.jsx)(Z.Z,{span:8,children:(0,x.jsx)(r.Z,{type:"primary",disabled:(null===l||void 0===l?void 0:l.length)>3,icon:(0,x.jsx)(g.Z,{}),style:{width:"100%"},onClick:()=>{t({type:u.Pb,payload:""}),e("/service/add")},children:"Add"})})]}),(0,x.jsx)(y.Z,{size:"medium",spinning:n||a,children:(0,x.jsx)(v,{data:_?k:l,deleteHandle:(e,t)=>{i({url:e,id:t})}})})]})})}}}]);
//# sourceMappingURL=381.b301692a.chunk.js.map