const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/useAuthStore-Aw1au7RF.js","assets/vendor-supabase-D_TSSuUW.js","assets/vendor-react-BWKHxYQy.js"])))=>i.map(i=>d[i]);
import{r as m,R as C,j as e}from"./vendor-react-BWKHxYQy.js";import{u as fe,L as v,a as B}from"./vendor-router-C2sFoTjv.js";const we="modulepreload",Me=function(s){return"/"+s},G={},Ne=function(t,n,o){let i=Promise.resolve();if(n&&n.length>0){let u=function(p){return Promise.all(p.map(x=>Promise.resolve(x).then(c=>({status:"fulfilled",value:c}),c=>({status:"rejected",reason:c}))))};document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),g=d?.nonce||d?.getAttribute("nonce");i=u(n.map(p=>{if(p=Me(p),p in G)return;G[p]=!0;const x=p.endsWith(".css"),c=x?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${c}`))return;const h=document.createElement("link");if(h.rel=x?"stylesheet":we,x||(h.as="script"),h.crossOrigin="",h.href=p,g&&h.setAttribute("nonce",g),document.head.appendChild(h),x)return new Promise((l,A)=>{h.addEventListener("load",l),h.addEventListener("error",()=>A(new Error(`Unable to preload CSS for ${p}`)))})}))}function r(u){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=u,window.dispatchEvent(d),!d.defaultPrevented)throw u}return i.then(u=>{for(const d of u||[])d.status==="rejected"&&r(d.reason);return t().catch(r)})};/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _e=s=>s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Ie=s=>s.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,n,o)=>o?o.toUpperCase():n.toLowerCase()),Z=s=>{const t=Ie(s);return t.charAt(0).toUpperCase()+t.slice(1)},oe=(...s)=>s.filter((t,n,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===n).join(" ").trim(),Ee=s=>{for(const t in s)if(t.startsWith("aria-")||t==="role"||t==="title")return!0};/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Ae={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Se=m.forwardRef(({color:s="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:o,className:i="",children:r,iconNode:u,...d},g)=>m.createElement("svg",{ref:g,...Ae,width:t,height:t,stroke:s,strokeWidth:o?Number(n)*24/Number(t):n,className:oe("lucide",i),...!r&&!Ee(d)&&{"aria-hidden":"true"},...d},[...u.map(([p,x])=>m.createElement(p,x)),...Array.isArray(r)?r:[r]]));/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const a=(s,t)=>{const n=m.forwardRef(({className:o,...i},r)=>m.createElement(Se,{ref:r,iconNode:t,className:oe(`lucide-${_e(Z(s))}`,`lucide-${s}`,o),...i}));return n.displayName=Z(s),n};/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Te=[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]],Di=a("activity",Te);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $e=[["rect",{width:"20",height:"5",x:"2",y:"3",rx:"1",key:"1wp1u1"}],["path",{d:"M4 8v11a2 2 0 0 0 2 2h2",key:"tvwodi"}],["path",{d:"M20 8v11a2 2 0 0 1-2 2h-2",key:"1gkqxj"}],["path",{d:"m9 15 3-3 3 3",key:"1pd0qc"}],["path",{d:"M12 12v9",key:"192myk"}]],Hi=a("archive-restore",$e);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qe=[["rect",{width:"20",height:"5",x:"2",y:"3",rx:"1",key:"1wp1u1"}],["path",{d:"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",key:"1s80jp"}],["path",{d:"M10 12h4",key:"a56b0p"}]],Ri=a("archive",qe);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ce=[["path",{d:"m3 16 4 4 4-4",key:"1co6wj"}],["path",{d:"M7 20V4",key:"1yoxec"}],["path",{d:"M20 8h-5",key:"1vsyxs"}],["path",{d:"M15 10V6.5a2.5 2.5 0 0 1 5 0V10",key:"ag13bf"}],["path",{d:"M15 14h5l-5 6h5",key:"ur5jdg"}]],Vi=a("arrow-down-a-z",Ce);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Le=[["path",{d:"m7 7 10 10",key:"1fmybs"}],["path",{d:"M17 7v10H7",key:"6fjiku"}]],Fi=a("arrow-down-right",Le);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pe=[["path",{d:"m3 16 4 4 4-4",key:"1co6wj"}],["path",{d:"M7 20V4",key:"1yoxec"}],["path",{d:"m21 8-4-4-4 4",key:"1c9v7m"}],["path",{d:"M17 4v16",key:"7dpous"}]],Yi=a("arrow-down-up",Pe);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ze=[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]],Oi=a("arrow-down",ze);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const De=[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]],Ui=a("arrow-left",De);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const He=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],N=a("arrow-right",He);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Re=[["path",{d:"m21 16-4 4-4-4",key:"f6ql7i"}],["path",{d:"M17 20V4",key:"1ejh1v"}],["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}]],Bi=a("arrow-up-down",Re);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ve=[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]],Fe=a("arrow-up-right",Ve);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ye=[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]],Ji=a("arrow-up",Ye);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oe=[["path",{d:"m3 8 4-4 4 4",key:"11wl7u"}],["path",{d:"M7 4v16",key:"1glfcx"}],["path",{d:"M15 4h5l-5 6h5",key:"8asdl1"}],["path",{d:"M15 20v-3.5a2.5 2.5 0 0 1 5 0V20",key:"r6l5cz"}],["path",{d:"M20 18h-5",key:"18j1r2"}]],Wi=a("arrow-up-z-a",Oe);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ue=[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["path",{d:"M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z",key:"1l2ple"}],["path",{d:"M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z",key:"1wam0m"}]],Gi=a("atom",Ue);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Be=[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]],Zi=a("award",Be);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Je=[["path",{d:"M4.929 4.929 19.07 19.071",key:"196cmz"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],Qi=a("ban",Je);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const We=[["path",{d:"M22 14v-4",key:"14q9d5"}],["path",{d:"M6 14v-4",key:"14a6bd"}],["rect",{x:"2",y:"6",width:"16",height:"12",rx:"2",key:"13zb55"}]],Ki=a("battery-low",We);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ge=[["path",{d:"M10 14v-4",key:"suye4c"}],["path",{d:"M22 14v-4",key:"14q9d5"}],["path",{d:"M6 14v-4",key:"14a6bd"}],["rect",{x:"2",y:"6",width:"16",height:"12",rx:"2",key:"13zb55"}]],Xi=a("battery-medium",Ge);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ze=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M22 8c0-2.3-.8-4.3-2-6",key:"5bb3ad"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}],["path",{d:"M4 2C2.8 3.7 2 5.7 2 8",key:"tap9e0"}]],er=a("bell-ring",Ze);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qe=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]],Ke=a("bell",Qe);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xe=[["path",{d:"M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8",key:"mg9rjx"}]],ar=a("bold",Xe);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ea=[["path",{d:"M10 2v8l3-3 3 3V2",key:"sqw3rj"}],["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",key:"k3hazp"}]],sr=a("book-marked",ea);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aa=[["path",{d:"M12 21V7",key:"gj6g52"}],["path",{d:"m16 12 2 2 4-4",key:"mdajum"}],["path",{d:"M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3",key:"8arnkb"}]],sa=a("book-open-check",aa);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ta=[["path",{d:"M12 7v14",key:"1akyts"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",key:"ruj8y"}]],H=a("book-open",ta);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const na=[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}]],tr=a("bookmark",na);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oa=[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]],nr=a("bot",oa);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ia=[["path",{d:"M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z",key:"lc1i9w"}],["path",{d:"m7 16.5-4.74-2.85",key:"1o9zyk"}],["path",{d:"m7 16.5 5-3",key:"va8pkn"}],["path",{d:"M7 16.5v5.17",key:"jnp8gn"}],["path",{d:"M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z",key:"8zsnat"}],["path",{d:"m17 16.5-5-3",key:"8arw3v"}],["path",{d:"m17 16.5 4.74-2.85",key:"8rfmw"}],["path",{d:"M17 16.5v5.17",key:"k6z78m"}],["path",{d:"M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z",key:"1xygjf"}],["path",{d:"M12 8 7.26 5.15",key:"1vbdud"}],["path",{d:"m12 8 4.74-2.85",key:"3rx089"}],["path",{d:"M12 13.5V8",key:"1io7kd"}]],or=a("boxes",ia);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ra=[["path",{d:"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",key:"l5xja"}],["path",{d:"M9 13a4.5 4.5 0 0 0 3-4",key:"10igwf"}],["path",{d:"M6.003 5.125A3 3 0 0 0 6.401 6.5",key:"105sqy"}],["path",{d:"M3.477 10.896a4 4 0 0 1 .585-.396",key:"ql3yin"}],["path",{d:"M6 18a4 4 0 0 1-1.967-.516",key:"2e4loj"}],["path",{d:"M12 13h4",key:"1ku699"}],["path",{d:"M12 18h6a2 2 0 0 1 2 2v1",key:"105ag5"}],["path",{d:"M12 8h8",key:"1lhi5i"}],["path",{d:"M16 8V5a2 2 0 0 1 2-2",key:"u6izg6"}],["circle",{cx:"16",cy:"13",r:".5",key:"ry7gng"}],["circle",{cx:"18",cy:"3",r:".5",key:"1aiba7"}],["circle",{cx:"20",cy:"21",r:".5",key:"yhc1fs"}],["circle",{cx:"20",cy:"8",r:".5",key:"1e43v0"}]],ir=a("brain-circuit",ra);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ca=[["path",{d:"M12 18V5",key:"adv99a"}],["path",{d:"M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4",key:"1e3is1"}],["path",{d:"M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5",key:"1gqd8o"}],["path",{d:"M17.997 5.125a4 4 0 0 1 2.526 5.77",key:"iwvgf7"}],["path",{d:"M18 18a4 4 0 0 0 2-7.464",key:"efp6ie"}],["path",{d:"M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517",key:"1gq6am"}],["path",{d:"M6 18a4 4 0 0 1-2-7.464",key:"k1g0md"}],["path",{d:"M6.003 5.125a4 4 0 0 0-2.526 5.77",key:"q97ue3"}]],ie=a("brain",ca);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const da=[["path",{d:"M12 12h.01",key:"1mp3jc"}],["path",{d:"M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",key:"1ksdt3"}],["path",{d:"M22 13a18.15 18.15 0 0 1-20 0",key:"12hx5q"}],["rect",{width:"20",height:"14",x:"2",y:"6",rx:"2",key:"i6l2r4"}]],rr=a("briefcase-business",da);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const la=[["path",{d:"M12 20v-9",key:"1qisl0"}],["path",{d:"M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z",key:"uouzyp"}],["path",{d:"M14.12 3.88 16 2",key:"qol33r"}],["path",{d:"M21 21a4 4 0 0 0-3.81-4",key:"1b0z45"}],["path",{d:"M21 5a4 4 0 0 1-3.55 3.97",key:"5cxbf6"}],["path",{d:"M22 13h-4",key:"1jl80f"}],["path",{d:"M3 21a4 4 0 0 1 3.81-4",key:"1fjd4g"}],["path",{d:"M3 5a4 4 0 0 0 3.55 3.97",key:"1d7oge"}],["path",{d:"M6 13H2",key:"82j7cp"}],["path",{d:"m8 2 1.88 1.88",key:"fmnt4t"}],["path",{d:"M9 7.13V6a3 3 0 1 1 6 0v1.13",key:"1vgav8"}]],cr=a("bug",la);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ha=[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",key:"1nb95v"}],["line",{x1:"8",x2:"16",y1:"6",y2:"6",key:"x4nwl0"}],["line",{x1:"16",x2:"16",y1:"14",y2:"18",key:"wjye3r"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M8 18h.01",key:"lrp35t"}]],dr=a("calculator",ha);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pa=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"m9 16 2 2 4-4",key:"19s6y9"}]],lr=a("calendar-check",pa);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ya=[["path",{d:"M16 14v2.2l1.6 1",key:"fo4ql5"}],["path",{d:"M16 2v4",key:"4m81vk"}],["path",{d:"M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5",key:"1osxxc"}],["path",{d:"M3 10h5",key:"r794hk"}],["path",{d:"M8 2v4",key:"1cmpym"}],["circle",{cx:"16",cy:"16",r:"6",key:"qoo3c4"}]],hr=a("calendar-clock",ya);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ua=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]],R=a("calendar-days",ua);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ma=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],pr=a("calendar",ma);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ka=[["path",{d:"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",key:"18u6gg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]],yr=a("camera",ka);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xa=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]],V=a("chart-column",xa);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ga=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"m19 9-5 5-4-4-3 3",key:"2osh9i"}]],ur=a("chart-line",ga);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const va=[["path",{d:"M5 21v-6",key:"1hz6c0"}],["path",{d:"M12 21V3",key:"1lcnhd"}],["path",{d:"M19 21V9",key:"unv183"}]],mr=a("chart-no-axes-column",va);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ba=[["path",{d:"M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",key:"pzmjnu"}],["path",{d:"M21.21 15.89A10 10 0 1 1 8 2.83",key:"k2fpak"}]],kr=a("chart-pie",ba);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ja=[["path",{d:"M18 6 7 17l-5-5",key:"116fxf"}],["path",{d:"m22 10-7.5 7.5L13 16",key:"ke71qq"}]],xr=a("check-check",ja);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fa=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],b=a("check",fa);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wa=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],re=a("chevron-down",wa);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ma=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],gr=a("chevron-left",Ma);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Na=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],_a=a("chevron-right",Na);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ia=[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]],vr=a("chevron-up",Ia);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ea=[["path",{d:"m6 17 5-5-5-5",key:"xnjwq"}],["path",{d:"m13 17 5-5-5-5",key:"17xmmf"}]],br=a("chevrons-right",Ea);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Aa=[["path",{d:"M10.88 21.94 15.46 14",key:"xkve6t"}],["path",{d:"M21.17 8H12",key:"19dcdn"}],["path",{d:"M3.95 6.06 8.54 14",key:"g8jz9m"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}]],jr=a("chromium",Aa);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sa=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],fr=a("circle-alert",Sa);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ta=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],wr=a("circle-check-big",Ta);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $a=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],qa=a("circle-check",$a);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ca=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}]],Mr=a("circle-dot",Ca);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const La=[["path",{d:"M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",key:"kmsa83"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],Nr=a("circle-play",La);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pa=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]],_r=a("circle-plus",Pa);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const za=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]],Ir=a("circle-question-mark",za);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Da=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],Er=a("circle-x",Da);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ha=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],Ar=a("circle",Ha);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ra=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"m9 14 2 2 4-4",key:"df797q"}]],Sr=a("clipboard-check",Ra);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Va=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]],Tr=a("clipboard-list",Va);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fa=[["path",{d:"M12 6v6h4",key:"135r8i"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],F=a("clock-3",Fa);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ya=[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],$r=a("clock",Ya);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oa=[["path",{d:"M12 13v8l-4-4",key:"1f5nwf"}],["path",{d:"m12 21 4-4",key:"1lfcce"}],["path",{d:"M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284",key:"ui1hmy"}]],qr=a("cloud-download",Oa);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ua=[["path",{d:"m2 2 20 20",key:"1ooewy"}],["path",{d:"M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193",key:"yfwify"}],["path",{d:"M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07",key:"jlfiyv"}]],Cr=a("cloud-off",Ua);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ba=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M16 14v6",key:"1j4efv"}],["path",{d:"M8 14v6",key:"17c4r9"}],["path",{d:"M12 16v6",key:"c8a4gj"}]],Lr=a("cloud-rain",Ba);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ja=[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",key:"p7xjir"}]],Pr=a("cloud",Ja);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wa=[["path",{d:"m18 16 4-4-4-4",key:"1inbqp"}],["path",{d:"m6 8-4 4 4 4",key:"15zrgr"}],["path",{d:"m14.5 4-5 16",key:"e7oirm"}]],zr=a("code-xml",Wa);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ga=[["path",{d:"m16 18 6-6-6-6",key:"eg8j8"}],["path",{d:"m8 6-6 6 6 6",key:"ppft3o"}]],Dr=a("code",Ga);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Za=[["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M14 2v2",key:"6buw04"}],["path",{d:"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",key:"pwadti"}],["path",{d:"M6 2v2",key:"colzsn"}]],Hr=a("coffee",Za);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qa=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M12 3v18",key:"108xh3"}]],Rr=a("columns-2",Qa);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ka=[["path",{d:"M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3",key:"11bfej"}]],Vr=a("command",Ka);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xa=[["path",{d:"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",key:"9ktpf1"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],Fr=a("compass",Xa);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const es=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]],Yr=a("copy",es);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const as=[["path",{d:"M20 4v7a4 4 0 0 1-4 4H4",key:"6o5b7l"}],["path",{d:"m9 10-5 5 5 5",key:"1kshq7"}]],Or=a("corner-down-left",as);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ss=[["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M17 20v2",key:"1rnc9c"}],["path",{d:"M17 2v2",key:"11trls"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M2 17h2",key:"7oei6x"}],["path",{d:"M2 7h2",key:"asdhe0"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"M20 17h2",key:"1fpfkl"}],["path",{d:"M20 7h2",key:"1o8tra"}],["path",{d:"M7 20v2",key:"4gnj0m"}],["path",{d:"M7 2v2",key:"1i4yhu"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1",key:"z9xiuo"}]],Ur=a("cpu",ss);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ts=[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]],Br=a("credit-card",ts);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ns=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"22",x2:"18",y1:"12",y2:"12",key:"l9bcsi"}],["line",{x1:"6",x2:"2",y1:"12",y2:"12",key:"13hhkx"}],["line",{x1:"12",x2:"12",y1:"6",y2:"2",key:"10w3f3"}],["line",{x1:"12",x2:"12",y1:"22",y2:"18",key:"15g9kq"}]],Jr=a("crosshair",ns);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const os=[["path",{d:"M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",key:"1vdc57"}],["path",{d:"M5 21h14",key:"11awu3"}]],is=a("crown",os);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rs=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],Wr=a("database",rs);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cs=[["path",{d:"m10 16 1.5 1.5",key:"11lckj"}],["path",{d:"m14 8-1.5-1.5",key:"1ohn8i"}],["path",{d:"M15 2c-1.798 1.998-2.518 3.995-2.807 5.993",key:"80uv8i"}],["path",{d:"m16.5 10.5 1 1",key:"696xn5"}],["path",{d:"m17 6-2.891-2.891",key:"xu6p2f"}],["path",{d:"M2 15c6.667-6 13.333 0 20-6",key:"1pyr53"}],["path",{d:"m20 9 .891.891",key:"3xwk7g"}],["path",{d:"M3.109 14.109 4 15",key:"q76aoh"}],["path",{d:"m6.5 12.5 1 1",key:"cs35ky"}],["path",{d:"m7 18 2.891 2.891",key:"1sisit"}],["path",{d:"M9 22c1.798-1.998 2.518-3.995 2.807-5.993",key:"q3hbxp"}]],Gr=a("dna",cs);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ds=[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]],Zr=a("download",ds);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ls=[["path",{d:"M21.54 15H17a2 2 0 0 0-2 2v4.54",key:"1djwo0"}],["path",{d:"M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",key:"1tzkfa"}],["path",{d:"M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05",key:"14pb5j"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],Qr=a("earth",ls);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hs=[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}]],Kr=a("ellipsis-vertical",hs);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ps=[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}]],Xr=a("ellipsis",ps);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ys=[["path",{d:"m15 15 6 6",key:"1s409w"}],["path",{d:"m15 9 6-6",key:"ko1vev"}],["path",{d:"M21 16v5h-5",key:"1ck2sf"}],["path",{d:"M21 8V3h-5",key:"1qoq8a"}],["path",{d:"M3 16v5h5",key:"1t08am"}],["path",{d:"m3 21 6-6",key:"wwnumi"}],["path",{d:"M3 8V3h5",key:"1ln10m"}],["path",{d:"M9 9 3 3",key:"v551iv"}]],ec=a("expand",ys);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const us=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]],ac=a("external-link",us);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ms=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],sc=a("eye-off",ms);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ks=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],tc=a("eye",ks);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xs=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1",key:"1oajmo"}],["path",{d:"M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1",key:"mpwhp6"}]],nc=a("file-braces",xs);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gs=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["circle",{cx:"10",cy:"12",r:"2",key:"737tya"}],["path",{d:"m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22",key:"wt3hpn"}]],oc=a("file-image",gs);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vs=[["path",{d:"M11.35 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5.35",key:"17jvcc"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M14 19h6",key:"bvotb8"}],["path",{d:"M17 16v6",key:"18yu1i"}]],ic=a("file-plus-corner",vs);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bs=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["circle",{cx:"11.5",cy:"14.5",r:"2.5",key:"1bq0ko"}],["path",{d:"M13.3 16.3 15 18",key:"2quom7"}]],rc=a("file-search",bs);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const js=[["path",{d:"M11 21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1",key:"likhh7"}],["path",{d:"M16 16a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1",key:"17ky3x"}],["path",{d:"M21 6a2 2 0 0 0-.586-1.414l-2-2A2 2 0 0 0 17 2h-3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1z",key:"1hyeo0"}]],cc=a("file-stack",js);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fs=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],dc=a("file-text",fs);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ws=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M11 18h2",key:"12mj7e"}],["path",{d:"M12 12v6",key:"3ahymv"}],["path",{d:"M9 13v-.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v.5",key:"qbrxap"}]],lc=a("file-type",ws);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ms=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M12 12v6",key:"3ahymv"}],["path",{d:"m15 15-3-3-3 3",key:"15xj92"}]],hc=a("file-up",Ms);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ns=[["path",{d:"M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528",key:"1jaruq"}]],pc=a("flag",Ns);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _s=[["path",{d:"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",key:"1slcih"}]],yc=a("flame",_s);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Is=[["path",{d:"M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2",key:"18mbvz"}],["path",{d:"M6.453 15h11.094",key:"3shlmq"}],["path",{d:"M8.5 2h7",key:"csnxdl"}]],uc=a("flask-conical",Is);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Es=[["path",{d:"M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1",key:"3pnvol"}],["circle",{cx:"12",cy:"8",r:"2",key:"1822b1"}],["path",{d:"M12 10v12",key:"6ubwww"}],["path",{d:"M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z",key:"9hd38g"}],["path",{d:"M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z",key:"ufn41s"}]],mc=a("flower-2",Es);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const As=[["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}],["path",{d:"M3 7V5a2 2 0 0 1 2-2h2",key:"aa7l1z"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2",key:"4qcy5o"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2",key:"6vwrx8"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2",key:"ioqczr"}]],Ss=a("focus",As);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ts=[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]],kc=a("funnel",Ts);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $s=[["path",{d:"m12 14 4-4",key:"9kzdfg"}],["path",{d:"M3.34 19a10 10 0 1 1 17.32 0",key:"19p75a"}]],qs=a("gauge",$s);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cs=[["path",{d:"M9 10h.01",key:"qbtxuw"}],["path",{d:"M15 10h.01",key:"1qmjsl"}],["path",{d:"M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z",key:"uwwb07"}]],xc=a("ghost",Cs);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ls=[["rect",{x:"3",y:"8",width:"18",height:"4",rx:"1",key:"bkv52"}],["path",{d:"M12 8v13",key:"1c76mn"}],["path",{d:"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7",key:"6wjy6b"}],["path",{d:"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",key:"1ihvrl"}]],gc=a("gift",Ls);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ps=[["line",{x1:"6",x2:"6",y1:"3",y2:"15",key:"17qcm7"}],["circle",{cx:"18",cy:"6",r:"3",key:"1h7g24"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["path",{d:"M18 9a9 9 0 0 1-9 9",key:"n2h4wq"}]],vc=a("git-branch",Ps);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zs=[["path",{d:"M5.116 4.104A1 1 0 0 1 6.11 3h11.78a1 1 0 0 1 .994 1.105L17.19 20.21A2 2 0 0 1 15.2 22H8.8a2 2 0 0 1-2-1.79z",key:"p55z4y"}],["path",{d:"M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0",key:"mjntcy"}]],bc=a("glass-water",zs);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ds=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]],jc=a("globe",Ds);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hs=[["path",{d:"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",key:"j76jl0"}],["path",{d:"M22 10v6",key:"1lu8f3"}],["path",{d:"M6 12.5V16a6 3 0 0 0 12 0v-3.5",key:"1r8lef"}]],ce=a("graduation-cap",Hs);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rs=[["path",{d:"M12 3v18",key:"108xh3"}],["path",{d:"M3 12h18",key:"1i2n21"}],["rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",key:"h1oib"}]],fc=a("grid-2x2",Rs);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vs=[["circle",{cx:"9",cy:"12",r:"1",key:"1vctgf"}],["circle",{cx:"9",cy:"5",r:"1",key:"hp0tcf"}],["circle",{cx:"9",cy:"19",r:"1",key:"fkjjf6"}],["circle",{cx:"15",cy:"12",r:"1",key:"1tmaij"}],["circle",{cx:"15",cy:"5",r:"1",key:"19l28e"}],["circle",{cx:"15",cy:"19",r:"1",key:"f4zoj3"}]],Fs=a("grip-vertical",Vs);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ys=[["path",{d:"m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9",key:"1hayfq"}],["path",{d:"m18 15 4-4",key:"16gjal"}],["path",{d:"m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5",key:"15ts47"}]],wc=a("hammer",Ys);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Os=[["line",{x1:"22",x2:"2",y1:"12",y2:"12",key:"1y58io"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}],["line",{x1:"6",x2:"6.01",y1:"16",y2:"16",key:"sgf278"}],["line",{x1:"10",x2:"10.01",y1:"16",y2:"16",key:"1l4acy"}]],Mc=a("hard-drive",Os);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Us=[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]],Nc=a("hash",Us);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bs=[["path",{d:"M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",key:"1xhozi"}]],Js=a("headphones",Bs);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ws=[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",key:"mvr1a0"}]],_c=a("heart",Ws);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gs=[["path",{d:"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",key:"yt0hxn"}]],Ic=a("hexagon",Gs);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zs=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]],Ec=a("history",Zs);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qs=[["path",{d:"M5 22h14",key:"ehvnwv"}],["path",{d:"M5 2h14",key:"pdyrp9"}],["path",{d:"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22",key:"1d314k"}],["path",{d:"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2",key:"1vvvr6"}]],Ac=a("hourglass",Qs);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ks=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"r6nss1"}]],Sc=a("house",Ks);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xs=[["path",{d:"M16 5h6",key:"1vod17"}],["path",{d:"M19 2v6",key:"4bpg5p"}],["path",{d:"M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5",key:"1ue2ih"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}]],Tc=a("image-plus",Xs);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const et=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],$c=a("image",et);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const at=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],st=a("info",at);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tt=[["line",{x1:"19",x2:"10",y1:"4",y2:"4",key:"15jd3p"}],["line",{x1:"14",x2:"5",y1:"20",y2:"20",key:"bu0au3"}],["line",{x1:"15",x2:"9",y1:"4",y2:"20",key:"uljnxc"}]],qc=a("italic",tt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nt=[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]],Cc=a("key",nt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ot=[["path",{d:"M10 8h.01",key:"1r9ogq"}],["path",{d:"M12 12h.01",key:"1mp3jc"}],["path",{d:"M14 8h.01",key:"1primd"}],["path",{d:"M16 12h.01",key:"1l6xoz"}],["path",{d:"M18 8h.01",key:"emo2bl"}],["path",{d:"M6 8h.01",key:"x9i8wu"}],["path",{d:"M7 16h10",key:"wp8him"}],["path",{d:"M8 12h.01",key:"czm47f"}],["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}]],Lc=a("keyboard",ot);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const it=[["path",{d:"M10 18v-7",key:"wt116b"}],["path",{d:"M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z",key:"1m329m"}],["path",{d:"M14 18v-7",key:"vav6t3"}],["path",{d:"M18 18v-7",key:"aexdmj"}],["path",{d:"M3 22h18",key:"8prr45"}],["path",{d:"M6 18v-7",key:"1ivflk"}]],Pc=a("landmark",it);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rt=[["path",{d:"m5 8 6 6",key:"1wu5hv"}],["path",{d:"m4 14 6-6 2-3",key:"1k1g8d"}],["path",{d:"M2 5h12",key:"or177f"}],["path",{d:"M7 2h1",key:"1t2jsx"}],["path",{d:"m22 22-5-10-5 10",key:"don7ne"}],["path",{d:"M14 18h6",key:"1m8k6r"}]],zc=a("languages",rt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ct=[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]],Dc=a("layers",ct);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dt=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],de=a("layout-dashboard",dt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lt=[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}],["path",{d:"M14 4h7",key:"3xa0d5"}],["path",{d:"M14 9h7",key:"1icrd9"}],["path",{d:"M14 15h7",key:"1mj8o2"}],["path",{d:"M14 20h7",key:"11slyb"}]],Hc=a("layout-list",lt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht=[["rect",{width:"7",height:"7",x:"3",y:"3",rx:"1",key:"1g98yp"}],["rect",{width:"7",height:"7",x:"14",y:"3",rx:"1",key:"6d4xhi"}],["rect",{width:"7",height:"7",x:"14",y:"14",rx:"1",key:"nxv5o0"}],["rect",{width:"7",height:"7",x:"3",y:"14",rx:"1",key:"1bb6yr"}]],Rc=a("layout-grid",ht);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pt=[["path",{d:"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",key:"nnexq3"}],["path",{d:"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",key:"mt58a7"}]],Vc=a("leaf",pt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yt=[["path",{d:"m16 6 4 14",key:"ji33uf"}],["path",{d:"M12 6v14",key:"1n7gus"}],["path",{d:"M8 8v12",key:"1gg7y9"}],["path",{d:"M4 4v16",key:"6qkkli"}]],Fc=a("library",yt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ut=[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]],Yc=a("lightbulb",ut);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mt=[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]],Oc=a("link-2",mt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kt=[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]],Uc=a("link",kt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xt=[["path",{d:"M13 5h8",key:"a7qcls"}],["path",{d:"M13 12h8",key:"h98zly"}],["path",{d:"M13 19h8",key:"c3s6r1"}],["path",{d:"m3 17 2 2 4-4",key:"1jhpwq"}],["path",{d:"m3 7 2 2 4-4",key:"1obspn"}]],gt=a("list-checks",xt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vt=[["path",{d:"M2 5h20",key:"1fs1ex"}],["path",{d:"M6 12h12",key:"8npq4p"}],["path",{d:"M9 19h6",key:"456am0"}]],Bc=a("list-filter",vt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bt=[["path",{d:"M13 5h8",key:"a7qcls"}],["path",{d:"M13 12h8",key:"h98zly"}],["path",{d:"M13 19h8",key:"c3s6r1"}],["path",{d:"m3 17 2 2 4-4",key:"1jhpwq"}],["rect",{x:"3",y:"4",width:"6",height:"6",rx:"1",key:"cif1o7"}]],Jc=a("list-todo",bt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jt=[["path",{d:"M3 5h.01",key:"18ugdj"}],["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M3 19h.01",key:"noohij"}],["path",{d:"M8 5h13",key:"1pao27"}],["path",{d:"M8 12h13",key:"1za7za"}],["path",{d:"M8 19h13",key:"m83p4d"}]],Wc=a("list",jt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ft=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],Gc=a("loader-circle",ft);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wt=[["path",{d:"M12 2v4",key:"3427ic"}],["path",{d:"m16.2 7.8 2.9-2.9",key:"r700ao"}],["path",{d:"M18 12h4",key:"wj9ykh"}],["path",{d:"m16.2 16.2 2.9 2.9",key:"1bxg5t"}],["path",{d:"M12 18v4",key:"jadmvz"}],["path",{d:"m4.9 19.1 2.9-2.9",key:"bwix9q"}],["path",{d:"M2 12h4",key:"j09sii"}],["path",{d:"m4.9 4.9 2.9 2.9",key:"giyufr"}]],Zc=a("loader",wt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mt=[["circle",{cx:"12",cy:"16",r:"1",key:"1au0dj"}],["rect",{x:"3",y:"10",width:"18",height:"12",rx:"2",key:"6s8ecr"}],["path",{d:"M7 10V7a5 5 0 0 1 10 0v3",key:"1pqi11"}]],Qc=a("lock-keyhole",Mt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nt=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]],Kc=a("lock",Nt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _t=[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]],Xc=a("log-out",_t);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const It=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],ed=a("mail",It);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Et=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"m21 3-7 7",key:"1l2asr"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M9 21H3v-6",key:"wtvkvv"}]],ad=a("maximize-2",Et);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const At=[["path",{d:"M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15",key:"143lza"}],["path",{d:"M11 12 5.12 2.2",key:"qhuxz6"}],["path",{d:"m13 12 5.88-9.8",key:"hbye0f"}],["path",{d:"M8 7h8",key:"i86dvs"}],["circle",{cx:"12",cy:"17",r:"5",key:"qbz8iq"}],["path",{d:"M12 18v-2h-.5",key:"fawc4q"}]],sd=a("medal",At);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const St=[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]],Tt=a("menu",St);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $t=[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]],td=a("message-circle-question-mark",$t);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qt=[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]],Q=a("message-circle",qt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ct=[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",key:"18887p"}],["path",{d:"M12 8v6",key:"1ib9pf"}],["path",{d:"M9 11h6",key:"1fldmi"}]],nd=a("message-square-plus",Ct);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lt=[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",key:"18887p"}],["path",{d:"M7 11h10",key:"1twpyw"}],["path",{d:"M7 15h6",key:"d9of3u"}],["path",{d:"M7 7h8",key:"af5zfr"}]],od=a("message-square-text",Lt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pt=[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",key:"18887p"}]],id=a("message-square",Pt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zt=[["path",{d:"M6 18h8",key:"1borvv"}],["path",{d:"M3 22h18",key:"8prr45"}],["path",{d:"M14 22a7 7 0 1 0 0-14h-1",key:"1jwaiy"}],["path",{d:"M9 14h2",key:"197e7h"}],["path",{d:"M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z",key:"1bmzmy"}],["path",{d:"M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3",key:"1drr47"}]],rd=a("microscope",zt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dt=[["path",{d:"M12 13v8",key:"1l5pq0"}],["path",{d:"M12 3v3",key:"1n5kay"}],["path",{d:"M4 6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h13a2 2 0 0 0 1.152-.365l3.424-2.317a1 1 0 0 0 0-1.635l-3.424-2.318A2 2 0 0 0 17 6z",key:"1btarq"}]],cd=a("milestone",Dt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ht=[["path",{d:"m14 10 7-7",key:"oa77jy"}],["path",{d:"M20 10h-6V4",key:"mjg0md"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M4 14h6v6",key:"rmj7iw"}]],dd=a("minimize-2",Ht);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rt=[["path",{d:"M5 12h14",key:"1ays0h"}]],ld=a("minus",Rt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vt=[["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"m14.305 7.53.923-.382",key:"1mlnsw"}],["path",{d:"m15.228 4.852-.923-.383",key:"82mpwg"}],["path",{d:"m16.852 3.228-.383-.924",key:"ln4sir"}],["path",{d:"m16.852 8.772-.383.923",key:"1dejw0"}],["path",{d:"m19.148 3.228.383-.924",key:"192kgf"}],["path",{d:"m19.53 9.696-.382-.924",key:"fiavlr"}],["path",{d:"m20.772 4.852.924-.383",key:"1j8mgp"}],["path",{d:"m20.772 7.148.924.383",key:"zix9be"}],["path",{d:"M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7",key:"1tnzv8"}],["path",{d:"M8 21h8",key:"1ev6f3"}],["circle",{cx:"18",cy:"6",r:"3",key:"1h7g24"}]],hd=a("monitor-cog",Vt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ft=[["path",{d:"m9 10 3-3 3 3",key:"11gsxs"}],["path",{d:"M12 13V7",key:"h0r20n"}],["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["path",{d:"M12 17v4",key:"1riwvh"}],["path",{d:"M8 21h8",key:"1ev6f3"}]],pd=a("monitor-up",Ft);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yt=[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]],yd=a("monitor",Yt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ot=[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]],Ut=a("moon",Ot);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bt=[["path",{d:"M8 18L12 22L16 18",key:"cskvfv"}],["path",{d:"M12 2V22",key:"r89rzk"}]],ud=a("move-down",Bt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jt=[["path",{d:"M18 8L22 12L18 16",key:"1r0oui"}],["path",{d:"M2 12H22",key:"1m8cig"}]],md=a("move-right",Jt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wt=[["path",{d:"M8 6L12 2L16 6",key:"1yvkyx"}],["path",{d:"M12 2V22",key:"r89rzk"}]],kd=a("move-up",Wt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gt=[["path",{d:"M12 2v20",key:"t6zp3m"}],["path",{d:"m15 19-3 3-3-3",key:"11eu04"}],["path",{d:"m19 9 3 3-3 3",key:"1mg7y2"}],["path",{d:"M2 12h20",key:"9i4pu4"}],["path",{d:"m5 9-3 3 3 3",key:"j64kie"}],["path",{d:"m9 5 3-3 3 3",key:"l8vdw6"}]],xd=a("move",Gt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zt=[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]],gd=a("music",Zt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qt=[["rect",{x:"16",y:"16",width:"6",height:"6",rx:"1",key:"4q2zg0"}],["rect",{x:"2",y:"16",width:"6",height:"6",rx:"1",key:"8cvhb9"}],["rect",{x:"9",y:"2",width:"6",height:"6",rx:"1",key:"1egb70"}],["path",{d:"M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3",key:"1jsf9p"}],["path",{d:"M12 12V8",key:"2874zd"}]],vd=a("network",Qt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kt=[["path",{d:"M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4",key:"re6nr2"}],["path",{d:"M2 6h4",key:"aawbzj"}],["path",{d:"M2 10h4",key:"l0bgd4"}],["path",{d:"M2 14h4",key:"1gsvsf"}],["path",{d:"M2 18h4",key:"1bu2t1"}],["path",{d:"M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",key:"pqwjuv"}]],bd=a("notebook-pen",Kt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xt=[["path",{d:"M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",key:"e79jfc"}],["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"qy21gx"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"fotxhn"}]],jd=a("palette",Xt);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const en=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"m16 15-3-3 3-3",key:"14y99z"}]],fd=a("panel-left-close",en);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const an=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}],["path",{d:"m14 9 3 3-3 3",key:"8010ee"}]],wd=a("panel-left-open",an);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sn=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M9 3v18",key:"fh3hqa"}]],Md=a("panel-left",sn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tn=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}]],Nd=a("panel-top",tn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nn=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M3 9h18",key:"1pudct"}],["path",{d:"M9 21V9",key:"1oto5p"}]],_d=a("panels-top-left",nn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const on=[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1",key:"kaeet6"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1",key:"1wsw3u"}]],Id=a("pause",on);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rn=[["path",{d:"M13 21h8",key:"1jsn5i"}],["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]],Ed=a("pen-line",rn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cn=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]],Ad=a("pen",cn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dn=[["path",{d:"M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13",key:"orapub"}],["path",{d:"m8 6 2-2",key:"115y1s"}],["path",{d:"m18 16 2-2",key:"ee94s4"}],["path",{d:"m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17",key:"cfq27r"}],["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]],Sd=a("pencil-ruler",dn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ln=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]],Td=a("pencil",ln);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hn=[["path",{d:"M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4",key:"daa4of"}],["rect",{width:"10",height:"7",x:"12",y:"13",rx:"2",key:"1nb8gs"}]],$d=a("picture-in-picture-2",hn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pn=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]],yn=a("play",pn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const un=[["path",{d:"M12 22v-5",key:"1ega77"}],["path",{d:"M9 8V2",key:"14iosj"}],["path",{d:"M15 8V2",key:"18g5xt"}],["path",{d:"M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z",key:"osxo6l"}]],qd=a("plug",un);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mn=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],Cd=a("plus",mn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kn=[["path",{d:"M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",key:"rib7q0"}],["path",{d:"M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",key:"1ymkrd"}]],xn=a("quote",kn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gn=[["path",{d:"M16.247 7.761a6 6 0 0 1 0 8.478",key:"1fwjs5"}],["path",{d:"M19.075 4.933a10 10 0 0 1 0 14.134",key:"ehdyv1"}],["path",{d:"M4.925 19.067a10 10 0 0 1 0-14.134",key:"1q22gi"}],["path",{d:"M7.753 16.239a6 6 0 0 1 0-8.478",key:"r2q7qm"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]],Ld=a("radio",gn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vn=[["path",{d:"m15 14 5-5-5-5",key:"12vg1m"}],["path",{d:"M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",key:"6uklza"}]],Pd=a("redo-2",vn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bn=[["path",{d:"M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"14sxne"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",key:"1hlbsb"}],["path",{d:"M16 16h5v5",key:"ccwih5"}]],zd=a("refresh-ccw",bn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jn=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],Dd=a("refresh-cw",jn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fn=[["path",{d:"m2 9 3-3 3 3",key:"1ltn5i"}],["path",{d:"M13 18H7a2 2 0 0 1-2-2V6",key:"1r6tfw"}],["path",{d:"m22 15-3 3-3-3",key:"4rnwn2"}],["path",{d:"M11 6h6a2 2 0 0 1 2 2v10",key:"2f72bc"}]],Hd=a("repeat-2",fn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wn=[["path",{d:"m17 2 4 4-4 4",key:"nntrym"}],["path",{d:"M3 11v-1a4 4 0 0 1 4-4h14",key:"84bu3i"}],["path",{d:"m7 22-4-4 4-4",key:"1wqhfi"}],["path",{d:"M21 13v1a4 4 0 0 1-4 4H3",key:"1rx37r"}]],Rd=a("repeat",wn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mn=[["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",key:"m3kijz"}],["path",{d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",key:"1fmvmk"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",key:"1f8sc4"}],["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}]],Vd=a("rocket",Mn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nn=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]],le=a("rotate-ccw",Nn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _n=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M21 9H3",key:"1338ky"}],["path",{d:"M21 15H3",key:"9uk58r"}]],Fd=a("rows-3",_n);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const In=[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]],Yd=a("save",In);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const En=[["path",{d:"m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",key:"7g6ntu"}],["path",{d:"m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",key:"ijws7r"}],["path",{d:"M7 21h10",key:"1b0cd5"}],["path",{d:"M12 3v18",key:"108xh3"}],["path",{d:"M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2",key:"3gwbw2"}]],Od=a("scale",En);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const An=[["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M18 5v16",key:"1ethyx"}],["path",{d:"m4 6 7.106-3.79a2 2 0 0 1 1.788 0L20 6",key:"zywc2d"}],["path",{d:"m6 11-3.52 2.147a1 1 0 0 0-.48.854V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a1 1 0 0 0-.48-.853L18 11",key:"1d4ql0"}],["path",{d:"M6 5v16",key:"1sn0nx"}],["circle",{cx:"12",cy:"9",r:"2",key:"1092wv"}]],Ud=a("school",An);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sn=[["path",{d:"M19 17V5a2 2 0 0 0-2-2H4",key:"zz82l3"}],["path",{d:"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",key:"1ph1d7"}]],Bd=a("scroll",Sn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tn=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],$n=a("search",Tn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qn=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],Jd=a("send",qn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cn=[["rect",{width:"20",height:"8",x:"2",y:"2",rx:"2",ry:"2",key:"ngkwjq"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",ry:"2",key:"iecqi9"}],["line",{x1:"6",x2:"6.01",y1:"6",y2:"6",key:"16zg32"}],["line",{x1:"6",x2:"6.01",y1:"18",y2:"18",key:"nzw8ys"}]],Wd=a("server",Cn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ln=[["path",{d:"M14 17H5",key:"gfn3mx"}],["path",{d:"M19 7h-9",key:"6i9tg"}],["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["circle",{cx:"7",cy:"7",r:"3",key:"dfmy0x"}]],Gd=a("settings-2",Ln);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pn=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],zn=a("settings",Pn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dn=[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]],Zd=a("share-2",Dn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hn=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]],Qd=a("shield-alert",Hn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rn=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],Kd=a("shield-check",Rn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vn=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m14.5 9.5-5 5",key:"17q4r4"}],["path",{d:"m9.5 9.5 5 5",key:"18nt4w"}]],Xd=a("shield-x",Vn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fn=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]],e1=a("shield",Fn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yn=[["path",{d:"m18 14 4 4-4 4",key:"10pe0f"}],["path",{d:"m18 2 4 4-4 4",key:"pucp1d"}],["path",{d:"M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22",key:"1ailkh"}],["path",{d:"M2 6h1.972a4 4 0 0 1 3.6 2.2",key:"km57vx"}],["path",{d:"M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45",key:"os18l9"}]],a1=a("shuffle",Yn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const On=[["path",{d:"M18 7V5a1 1 0 0 0-1-1H6.5a.5.5 0 0 0-.4.8l4.5 6a2 2 0 0 1 0 2.4l-4.5 6a.5.5 0 0 0 .4.8H17a1 1 0 0 0 1-1v-2",key:"wuwx1p"}]],s1=a("sigma",On);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Un=[["path",{d:"M21 4v16",key:"7j8fe9"}],["path",{d:"M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",key:"zs4d6"}]],t1=a("skip-forward",Un);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bn=[["path",{d:"M10 5H3",key:"1qgfaw"}],["path",{d:"M12 19H3",key:"yhmn1j"}],["path",{d:"M14 3v4",key:"1sua03"}],["path",{d:"M16 17v4",key:"1q0r14"}],["path",{d:"M21 12h-9",key:"1o4lsq"}],["path",{d:"M21 19h-5",key:"1rlt1p"}],["path",{d:"M21 5h-7",key:"1oszz2"}],["path",{d:"M8 10v4",key:"tgpxqk"}],["path",{d:"M8 12H3",key:"a7s4jb"}]],n1=a("sliders-horizontal",Bn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jn=[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]],o1=a("smartphone",Jn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wn=[["path",{d:"m10 20-1.25-2.5L6 18",key:"18frcb"}],["path",{d:"M10 4 8.75 6.5 6 6",key:"7mghy3"}],["path",{d:"m14 20 1.25-2.5L18 18",key:"1chtki"}],["path",{d:"m14 4 1.25 2.5L18 6",key:"1b4wsy"}],["path",{d:"m17 21-3-6h-4",key:"15hhxa"}],["path",{d:"m17 3-3 6 1.5 3",key:"11697g"}],["path",{d:"M2 12h6.5L10 9",key:"kv9z4n"}],["path",{d:"m20 10-1.5 2 1.5 2",key:"1swlpi"}],["path",{d:"M22 12h-6.5L14 15",key:"1mxi28"}],["path",{d:"m4 10 1.5 2L4 14",key:"k9enpj"}],["path",{d:"m7 21 3-6-1.5-3",key:"j8hb9u"}],["path",{d:"m7 3 3 6h4",key:"1otusx"}]],i1=a("snowflake",Wn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gn=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],Zn=a("sparkles",Gn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qn=[["path",{d:"M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",key:"2acyp4"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],r1=a("square-check-big",Qn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kn=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],he=a("square-check",Kn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xn=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M9 17c2 0 2.8-1 2.8-2.8V10c0-2 1-3.3 3.2-3",key:"m1af9g"}],["path",{d:"M9 11.2h5.7",key:"3zgcl2"}]],c1=a("square-function",Xn);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eo=[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]],d1=a("square-pen",eo);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ao=[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]],l1=a("star",ao);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const so=[["path",{d:"M11 2v2",key:"1539x4"}],["path",{d:"M5 2v2",key:"1yf1q8"}],["path",{d:"M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1",key:"rb5t3r"}],["path",{d:"M8 15a6 6 0 0 0 12 0v-3",key:"x18d4x"}],["circle",{cx:"20",cy:"10",r:"2",key:"ts1r5v"}]],h1=a("stethoscope",so);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const to=[["path",{d:"M21 9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z",key:"1dfntj"}],["path",{d:"M15 3v5a1 1 0 0 0 1 1h5",key:"6s6qgf"}]],p1=a("sticky-note",to);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const no=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],oo=a("sun",no);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const io=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]],q=a("target",io);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ro=[["path",{d:"M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2",key:"125lnx"}],["path",{d:"M8.5 2h7",key:"csnxdl"}],["path",{d:"M14.5 16h-5",key:"1ox875"}]],y1=a("test-tube",ro);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const co=[["path",{d:"M3 5h18",key:"1u36vt"}],["path",{d:"M3 12h18",key:"1i2n21"}],["path",{d:"M3 19h18",key:"awlh7x"}]],u1=a("text-align-justify",co);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lo=[["path",{d:"M21 5H3",key:"1fi0y6"}],["path",{d:"M15 12H3",key:"6jk70r"}],["path",{d:"M17 19H3",key:"z6ezky"}]],m1=a("text-align-start",lo);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ho=[["path",{d:"M10 2h4",key:"n1abiw"}],["path",{d:"M12 14v-4",key:"1evpnu"}],["path",{d:"M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6",key:"1ts96g"}],["path",{d:"M9 17H4v5",key:"8t5av"}]],po=a("timer-reset",ho);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yo=[["line",{x1:"10",x2:"14",y1:"2",y2:"2",key:"14vaq8"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11",key:"17fdiu"}],["circle",{cx:"12",cy:"14",r:"8",key:"1e1u0o"}]],uo=a("timer",yo);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mo=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],k1=a("trash-2",mo);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ko=[["path",{d:"M16 17h6v-6",key:"t6n2it"}],["path",{d:"m22 17-8.5-8.5-5 5L2 7",key:"x473p"}]],x1=a("trending-down",ko);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xo=[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]],go=a("trending-up",xo);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vo=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],g1=a("triangle-alert",vo);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bo=[["path",{d:"M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",key:"14u9p9"}]],v1=a("triangle",bo);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jo=[["path",{d:"M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978",key:"1n3hpd"}],["path",{d:"M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978",key:"rfe1zi"}],["path",{d:"M18 9h1.5a1 1 0 0 0 0-5H18",key:"7xy6bh"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",key:"1mhfuq"}],["path",{d:"M6 9H4.5a1 1 0 0 1 0-5H6",key:"tex48p"}]],b1=a("trophy",jo);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fo=[["path",{d:"M12 4v16",key:"1654pz"}],["path",{d:"M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2",key:"e0r10z"}],["path",{d:"M9 20h6",key:"s66wpe"}]],j1=a("type",fo);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wo=[["path",{d:"M9 14 4 9l5-5",key:"102s5s"}],["path",{d:"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",key:"f3b9sd"}]],f1=a("undo-2",wo);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mo=[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]],w1=a("upload",Mo);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const No=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]],M1=a("user-plus",No);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _o=[["circle",{cx:"12",cy:"8",r:"5",key:"1hypcn"}],["path",{d:"M20 21a8 8 0 0 0-16 0",key:"rfgkzh"}]],N1=a("user-round",_o);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Io=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],_1=a("user",Io);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Eo=[["path",{d:"M18 21a8 8 0 0 0-16 0",key:"3ypg7q"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3",key:"10s06x"}]],I1=a("users-round",Eo);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ao=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],J=a("users",Ao);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const So=[["path",{d:"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",key:"ftymec"}],["rect",{x:"2",y:"6",width:"14",height:"12",rx:"2",key:"158x01"}]],E1=a("video",So);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const To=[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]],A1=a("volume-2",To);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $o=[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]],S1=a("volume-x",$o);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qo=[["path",{d:"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",key:"ul74o6"}],["path",{d:"m14 7 3 3",key:"1r5n42"}],["path",{d:"M5 6v4",key:"ilb8ba"}],["path",{d:"M19 14v4",key:"blhpug"}],["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M7 8H3",key:"zfb6yr"}],["path",{d:"M21 16h-4",key:"1cnmox"}],["path",{d:"M11 3H9",key:"1obp7u"}]],T1=a("wand-sparkles",qo);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Co=[["path",{d:"M12 10v2.2l1.6 1",key:"n3r21l"}],["path",{d:"m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05",key:"18k57s"}],["path",{d:"m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05",key:"16ny36"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}]],$1=a("watch",Co);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lo=[["path",{d:"M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",key:"knzxuh"}],["path",{d:"M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",key:"2jd2cc"}],["path",{d:"M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",key:"rd2r6e"}]],q1=a("waves",Lo);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Po=[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}],["path",{d:"M5 12.859a10 10 0 0 1 5.17-2.69",key:"1dl1wf"}],["path",{d:"M19 12.859a10 10 0 0 0-2.007-1.523",key:"4k23kn"}],["path",{d:"M2 8.82a15 15 0 0 1 4.177-2.643",key:"1grhjp"}],["path",{d:"M22 8.82a15 15 0 0 0-11.288-3.764",key:"z3jwby"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],C1=a("wifi-off",Po);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zo=[["path",{d:"M12.8 19.6A2 2 0 1 0 14 16H2",key:"148xed"}],["path",{d:"M17.5 8a2.5 2.5 0 1 1 2 4H2",key:"1u4tom"}],["path",{d:"M9.8 4.4A2 2 0 1 1 11 8H2",key:"75valh"}]],L1=a("wind",zo);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Do=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],pe=a("x",Do);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ho=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],P1=a("zap",Ho);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ro=[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"11",x2:"11",y1:"8",y2:"14",key:"1vmskp"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]],z1=a("zoom-in",Ro);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vo=[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["line",{x1:"21",x2:"16.65",y1:"21",y2:"16.65",key:"13gj7c"}],["line",{x1:"8",x2:"14",y1:"11",y2:"11",key:"durymu"}]],D1=a("zoom-out",Vo),Fo={BASE_URL:"/",DEV:!1,MODE:"production",PROD:!0,SSR:!1,VITE_FIREBASE_VAPID_KEY:"BIYVkmTA7tGrbpyGIbxuSfj4xrBgpGL27e5Yo_uPo3JSbRR_syzZ9q6BbB_b9nNbNaCnC56Y8LuItVsaLQwdhZ8",VITE_GA_MEASUREMENT_ID:"G-TFTXYXXEJ6",VITE_GOOGLE_CLIENT_ID:"801132168802-j8a7hetf3d6ke6ljb8tftb68sm0roqa5.apps.googleusercontent.com",VITE_SUPABASE_ANON_KEY:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjbmVrZ3piZGx3aGNwbXBvb2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MjU4MjQsImV4cCI6MjA4MDQwMTgyNH0.4s85XfWCetX1DDE3H7XdyRLogvrtAzpk0CAADaapEUo",VITE_SUPABASE_URL:"https://rcnekgzbdlwhcpmpoogz.supabase.co"},L="₹105",P="₹899",K="₹1,260",U=(s,t)=>{const n=Fo[s];return typeof n=="string"&&n.trim().length>0?n.trim():t},ye=()=>{if(typeof navigator>"u")return{hasIndiaDeviceSignal:!1,timeZone:"",languages:[]};const s=[navigator.language,...navigator.languages||[]].filter(Boolean).map(n=>n.toLowerCase()),t=typeof Intl<"u"?Intl.DateTimeFormat().resolvedOptions().timeZone?.toLowerCase():"";return{hasIndiaDeviceSignal:s.some(n=>n.endsWith("-in"))||t==="asia/kolkata",timeZone:t,languages:s}},ue=()=>ye().hasIndiaDeviceSignal?"india":"international",Yo=s=>{const t=s.split(`
`).map(n=>n.trim()).find(n=>n.startsWith("loc="));return t?t.replace("loc=","").trim().toUpperCase():null},Oo=async()=>{const t=ye().hasIndiaDeviceSignal?"india":"international";if(typeof fetch!="function")return t;try{const n=await fetch("/cdn-cgi/trace",{cache:"no-store"});if(!n.ok)return t;const o=Yo(await n.text());return o?o==="IN"?"india":"international":t}catch{return t}},Uo=(s=ue())=>{if(s==="india"){const i={price:L,period:"/month",secondaryPrice:"Cancel anytime",checkoutLabel:`${L}/month`},r={price:P,period:"/year",secondaryPrice:"Just ₹75/month, billed yearly",originalPrice:K,priceNote:"Save ₹361 · 29% off",checkoutLabel:`${P}/year`};return{market:s,label:"India pricing",indiaMonthly:i,indiaYearly:r,internationalMonthly:{price:"US$1.49",period:"/month",checkoutLabel:"US$1.49/month"},internationalYearly:{price:"US$9.99",period:"/year",checkoutLabel:"US$9.99/year"}}}const t=U("VITE_INTL_MONTHLY_PRICE_LABEL","US$1.49"),n=U("VITE_INTL_YEARLY_PRICE_LABEL","US$9.99"),o=U("VITE_INTL_YEARLY_ORIGINAL_PRICE_LABEL","US$17.88");return{market:s,label:"Pro pricing",indiaMonthly:{price:L,period:"/month",checkoutLabel:`${L}/month`},indiaYearly:{price:P,period:"/year",originalPrice:K,priceNote:"Save ₹361 · 29% off",checkoutLabel:`${P}/year`},internationalMonthly:{price:t,period:"/month",secondaryPrice:"Cancel anytime",checkoutLabel:`${t}/month`},internationalYearly:{price:n,period:"/year",secondaryPrice:"Just US$0.83/month, billed yearly",originalPrice:o,priceNote:"Best value",checkoutLabel:`${n}/year`}}},Bo=(s,t)=>s.market==="india"?t==="monthly"?s.indiaMonthly:s.indiaYearly:t==="monthly"?s.internationalMonthly:s.internationalYearly,Jo=[{question:"What makes the IsotopeAI focus timer different from a basic timer?",answer:"A session can carry its task, subject, chapter, and topic with it. When the session is complete, that record can update task time, syllabus study maps, daily goals, analytics, and live community presence instead of leaving the time in a separate timer app."},{question:"Can I use Pomodoro and a stopwatch?",answer:"Yes. Use Pomodoro for planned focus and break intervals, or use the stopwatch when you want an open-ended session. Pomodoro controls also let you add or remove five minutes, skip a phase, reset, pause, and complete the session."},{question:"Can I track questions during a study session?",answer:"Yes. Question-enabled focus types can track attempted, correct, incorrect, and skipped questions, a target count, average time per question, and whether you are on pace. You can undo the last result and use keyboard shortcuts while the timer runs."},{question:"Can IsotopeAI remind me when I spend too long on one question?",answer:"Yes. Question time nudges can use three custom time thresholds, your own messages, and optional sound. The per-question clock resets when you mark a question correct, incorrect, or skipped, and the Focus page can offer to turn nudges on during a long question."},{question:"Does the focus timer keep running if I open another page?",answer:"Yes. The global timer continues when you move around IsotopeAI, and the sidebar shows the active session. Supported browsers can also open a small Picture-in-Picture timer with optional question controls."},{question:"How much can I customise the timer?",answer:"You can change focus and break lengths, long-break frequency, auto-start breaks, daily goals, late-night day boundaries, focus types, question targets, pause and completion prompts, sounds, notification behaviour, Picture-in-Picture question controls, and a local-only background image with adjustable blur."},{question:"Can I use the focus timer without an internet connection?",answer:"The core Focus route is available as part of IsotopeAI’s offline-ready PWA. Features that depend on the network, such as live community presence or remotely hosted ambient audio, still need a connection."},{question:"Which study methods and exams can I use it for?",answer:"The timer is not tied to one exam. Students can use it for theory, lectures, revision, practice, question sessions, or their own custom focus types across JEE, NEET, CUET, IAT, BITSAT, boards, SAT, AP, university, and other exam preparation."}],Wo=[{question:"What makes IsotopeAI different from a normal to-do list?",answer:"A task can keep its subject, chapter, topic, exam, effort, energy, subtasks, priority, and schedule attached. You can then start Focus from that task, see it in Today, place it on the study calendar, and review its time and completion history in Analytics."},{question:"Which task views are available?",answer:"You can work in a Kanban board, a sortable table, a day, week, or month planning calendar, a quiet Zen view, or an Eisenhower matrix. Your preferred task experience, view, sorting, grouping, and density can be saved."},{question:"Can I plan JEE or NEET revision tasks by chapter?",answer:"Yes. Tasks can link to subjects, chapters, and topics from your syllabus. Exam and syllabus workflows can create revision or result-review work, while the task calendar and Today dashboard help you fit it into the time available."},{question:"Can tasks repeat automatically?",answer:"Yes. A task can repeat daily, weekly, or on a custom interval. You can choose an end date, limit the number of occurrences, and control how early the next task is created. Habits are also available for lighter routines that do not need full task detail."},{question:"Can the IsotopeAI assistant create or reschedule tasks?",answer:"Yes. The assistant can create, break down, update, move, complete, reopen, restore, schedule, and explain tasks, including bulk changes. It uses the relevant task, syllabus, focus, exam, or analytics context only when needed, and destructive or large actions require confirmation."},{question:"Does the student task manager work offline?",answer:"Core task and habit editing is local-first and remains available without a connection. An offline banner makes the state clear, and changes can sync after you reconnect. Live cloud integrations and other online services still need internet access."},{question:"Can I use the Tasks page with only a keyboard?",answer:"Yes. Shortcuts can create a task, focus search, switch between the main views, open Zen mode, undo the latest action, and close open panels. The page also provides a shortcut reference from its command bar."}],Go=[{question:"What can I plan on the IsotopeAI Exams page?",answer:"You can schedule a D-Day exam, full mock, sectional test, or practice attempt. Each exam can include a date, start time, duration, priority, description, tags, color, mapped syllabus chapters, marking scheme, result date, and result link."},{question:"Can I connect mock tests to my main exam?",answer:"Yes. Link mocks, sectional tests, or practice attempts to a D-Day exam. IsotopeAI can then show the number of linked attempts, average and best scores, score trajectory, readiness signals, and the difference between mock performance and the final result."},{question:"What can I record after an exam?",answer:"You can log the score, total marks, accuracy, rank, percentile, cutoff, time taken, negative marks, subject scores, correct, incorrect and unattempted questions, error themes, and post-exam notes. Optional cohort and topper scores add more context."},{question:"Does the exam planner connect to my syllabus?",answer:"Yes. Map an exam to syllabus chapters and see coverage based on the topics completed inside those chapters. Weak mapped chapters can open directly in Syllabus or Chapter Hub for notes, mistakes, questions, flashcards, and revision work."},{question:"How does IsotopeAI help after a mock test?",answer:"Logged results feed score trends, rolling averages, subject performance, accuracy, consistency, exam pressure, error patterns, D-Day readiness, and the subject mastery heatmap. You can then create revision tasks or open the weak chapter that needs work."},{question:"Can I filter and customise the Exams page?",answer:"Yes. Choose grid, list, or calendar view; filter by lifecycle, exam type, priority, and tag; search titles, descriptions, and tags; and sort by date, title, priority, or score. The chosen main view is saved on the device. Exams can also use custom colors and tag colors."},{question:"Will IsotopeAI remind me when a result is available?",answer:"You can add a result declaration date and result page URL. When the result is due, the Exams page can prompt you to log it, open the result page, snooze the reminder for one, three, or seven days, or dismiss it."},{question:"Can the IsotopeAI assistant manage exams?",answer:"Yes. The assistant can create and update exams, handle safe bulk changes, link D-Day attempts, map syllabus chapters, log or clear results, manage result reminders, archive or restore exams, and create revision tasks. Destructive and large actions use confirmation."},{question:"Which exams can I use it for?",answer:"The planner is not tied to one exam board. You can use it for JEE, NEET, CUET, IAT, BITSAT, boards, SAT, AP, university exams, school tests, coaching mocks, and your own practice schedule."},{question:"Does the Exams workspace work offline?",answer:"The core Exams route is part of IsotopeAI’s offline-ready app shell and stores exam work locally. Online result pages, community features, cloud sync, and other network services still need an internet connection."}],Zo=[{question:"What is the IsotopeAI syllabus tracker?",answer:"It is a subject, chapter, topic, and subtopic tracker that keeps coverage, priorities, revision marks, study time, question results, tasks, exams, and chapter work connected. The syllabus becomes the shared academic structure used across IsotopeAI."},{question:"Can I use it as a JEE or NEET syllabus tracker?",answer:"Yes. IsotopeAI includes selectable syllabus templates for supported exams such as JEE and NEET. You can choose the subjects you need, change the structure, or create a completely custom syllabus for another exam or course."},{question:"Can I create my own subjects, chapters, and topics?",answer:"Yes. Templates are optional. You can create custom subjects, add and reorder chapters, add topics and subtopics, rename items, and remove anything that does not match your course."},{question:"Can I choose what progress means for each subject?",answer:"Yes. Each subject can have its own tracking columns. A column can be a checkbox or a repeat counter with an optional target. You can name it, choose its color and icon, reorder it, update a full column or chapter at once, and copy the setup to other subjects."},{question:"Does the syllabus tracker record study time and questions?",answer:"Completed Focus sessions can write study time and question records against the selected subject, chapter, and topic. Syllabus then shows those signals beside the relevant work when enough data exists."},{question:"Can I schedule a syllabus chapter or topic?",answer:"Yes. You can create a linked task from a chapter or topic. The task keeps the syllabus context, and starting Focus from that task can carry the same subject, chapter, and topic into the study session."},{question:"How does Syllabus connect with exams and analytics?",answer:"Exams map to syllabus chapter IDs and use topic completion to calculate coverage. Focus and question records use the same subject, chapter, and topic IDs, which lets Analytics explain time and performance in the right academic context."},{question:"What is inside a Chapter Hub?",answer:"A Chapter Hub is the deeper workspace opened from a syllabus chapter. It can hold notes, questions, resources, flashcards, revision planning, mistakes, concept maps, collaboration, and chapter-level analytics."},{question:"Does the syllabus tracker work offline?",answer:"Core syllabus organization is local-first, so subjects, chapters, topics, and tracking remain useful through a weak connection. Live community features and optional account sync still need an internet connection."},{question:"Do I have to use AI to manage my syllabus?",answer:"No. The complete syllabus tracker works without AI. Optional assistant actions can help create or update structured syllabus work, map chapters to exams, or turn existing chapters into tasks, but you remain in control."}],Qo=[{question:"What is the IsotopeAI Study page?",answer:"Study is an exam planning workspace. It brings together exam dates, syllabus coverage, focused time, dated tasks, review topics, revision schedules, and mock results so you can see what needs work before the next exam."},{question:"Can I use Study as a JEE or NEET study planner?",answer:"Yes. IsotopeAI includes ready-made JEE and NEET syllabus templates. You can choose the subjects you need, keep the structure editable, and connect it to exam dates, tasks, focus sessions, revision, and mock analysis."},{question:"Can I plan for another exam or my own course?",answer:"Yes. Create your own subjects, chapters, and topics for boards, university courses, or another exam. Custom subjects can have their own name, icon, and color. Ready-made templates are currently available for JEE and NEET."},{question:"How does the revision planner work?",answer:"Topics with a review date appear in the due queue and full revision schedule. During a recall session, you can rate a topic Again, Hard, Good, or Easy. That rating updates its mastery and next review date so the queue changes with your recall."},{question:"Does Study include spaced repetition?",answer:"Yes. Study includes a due-today review queue, topic mastery, review intervals, a searchable schedule, and guidance for quadratic and exponential revision spacing. The review flow uses your rating to schedule the next review."},{question:"How do Focus sessions connect to Study?",answer:"Completed Focus sessions add real study time to the linked subjects. Study uses that history in its syllabus coverage area and calendar, including daily focused minutes, subject breakdowns, session types, and tracked question counts."},{question:"Can I create tasks and exams from the Study calendar?",answer:"Yes. Select a date in the Study calendar to create a task or schedule an exam for that day. The calendar also shows existing tasks, exams, completed focus sessions, study intensity, subject time, and question totals."},{question:"What does mock test analysis show?",answer:"Study combines logged mock and exam results into an average score, subject comparison, and recent-performance list. Marks, percentages, dates, and movement become visible when the saved result contains that data."},{question:"What is the seven-day study strategy?",answer:"The Study page can generate a seven-day plan from your upcoming exams, tasks, syllabus, focus history, and saved results. You can open the full plan or regenerate it after your workspace changes. This feature needs an available AI service and an internet connection."},{question:"What can I customize?",answer:"You can choose ready-made or custom subjects, subject icons and colors, theme, accent color, accessibility font, daily focus goal, preferred timer method, timer lengths, and the hour at which a new study day begins. Focus behavior and notifications have their own settings too."},{question:"Does the Study page work offline?",answer:"Core local planning data can remain available through IsotopeAI’s local-first app shell. Live AI generation, cloud sync, and online community services still need a connection."}],Ko=["study planner for students","exam study planner","JEE study planner","NEET study planner","revision planner for students","JEE revision planner","NEET revision planner","spaced repetition study planner","study calendar for students","mock test analysis for students","syllabus progress tracker","exam countdown study planner","subject wise study time tracker"],Xo=[{question:"What does IsotopeAI study analytics track?",answer:"Analytics brings together focus sessions, questions, tasks, subjects, chapters, topics, daily logs, exams, and mock tests. It shows study time, consistency, efficiency, question performance, task completion, subject balance, break patterns, and the session history behind those numbers."},{question:"Can I use Analytics for JEE or NEET preparation?",answer:"Yes. JEE and NEET students can compare study time across subjects, review question accuracy and volume, find weak chapters, track mock-test signals, and see whether the current plan matches the remaining syllabus and exam timeline. The same system works for other exams and custom syllabus structures."},{question:"Does Analytics connect with the Focus timer?",answer:"Yes. Completed Focus sessions supply the time, subject, chapter, topic, task type, questions, pauses, efficiency, and productivity information used across Analytics. The Activity Log keeps the individual sessions available for review and editing."},{question:"Can I see daily, weekly, monthly, and yearly study reports?",answer:"Yes. Today gives a detailed daily view. Weekly, Monthly, and Yearly views show longer patterns, comparisons, consistency, subject distribution, questions, and session history. Period controls let you move backwards and forwards without losing the selected view."},{question:"Can I customize the Analytics dashboard?",answer:"Yes. You can reorder or hide tabs, move supported blocks and cards, change card width and corner radius, choose cinematic, balanced, or compact density, set the page to standard, wide, or edge-to-edge width, and show or hide the IsotopeAI watermark. Changes have a live preview and can be saved, discarded, or reset."},{question:"Does Analytics include question and mock-test analysis?",answer:"Yes. Question analytics can show attempt volume, targets, accuracy, subject and chapter breakdowns, fatigue by session length, and the time of day when answers are strongest. Exam and mock data can add performance and weak-area context so the numbers lead to better revision decisions."},{question:"Can I share or export my study analytics?",answer:"Yes. You can create an Analytics image to share, copy, or download. Session logs can be copied for a day or selected period, and an optional AI share summary is available when AI is configured. Isotope Wrapped can also create a shareable weekly, monthly, or yearly study edition."},{question:"Does Analytics work when I have very little data?",answer:"Yes, but it does not pretend a weak sample is a strong trend. Empty and sparse views explain what is missing, while the Activity Log lets you add a manual session. Longer-term patterns become more useful as you record more focus, question, task, and mock-test data."},{question:"Can Analytics follow my own study-day and week timing?",answer:"Yes. Analytics uses the logical study-day offset and the configured week start day, hour, and minute. This keeps late-night sessions and custom study weeks grouped the way you expect instead of forcing every student into a midnight-to-midnight calendar."},{question:"Is my study data private?",answer:"Analytics is built from your IsotopeAI study records and does not require a public profile. Core study data is local-first, with optional account and sync features according to your setup. Sharing only happens when you choose a share, copy, or download action."}],ei=[{question:"What can an IsotopeAI study buddy see?",answer:"An accepted buddy can see only the fields you share: live status, current subject or task, today’s tasks, exact study time, subject-wise time, question counts, and streak. You can switch off any field or use stealth mode at any time."},{question:"Are public study groups public profiles?",answer:"No. Public means a group can appear in Discover. Before joining, a student sees the group name, exam, subjects, member count, and aggregate activity—not member names, tasks, or live status."},{question:"Does Community include chat or direct messages?",answer:"No. IsotopeAI Community is built for study accountability, not conversation. There are no direct messages, group chat, posts, reactions, or feeds."},{question:"How many buddies and group members can I have?",answer:"Your buddy circle holds up to four accepted people. A study group holds up to 30 members, with owner, admin, and member roles."},{question:"How do study group leaderboards work?",answer:"Rankings use exact completed Focus time for today, this week, or this month. Equal times receive equal ranks. Group totals and average time per active member are shown separately."},{question:"Can I use study groups for JEE, NEET, or another exam?",answer:"Yes. Groups can be labelled with any exam, target year, and subjects. Discover helps students find groups that match those real details."},{question:"Is Community included in the free plan?",answer:"Community is a paid IsotopeAI feature. The existing pricing and plans apply; this feature page does not change them."}],ai=["JEE study group app","NEET study buddy","online study accountability partner","study with friends app India","study group leaderboard","study buddy app for students","exam accountability group","private study progress sharing"],w=[{id:"today",path:"/features/today-dashboard",navLabel:"Today",title:"Today dashboard",stage:"Decide",description:"See the next useful task, exam pressure, revision signals, and study progress.",searchIntent:"Daily study dashboard"},{id:"tasks",path:"/features/student-task-manager",navLabel:"Tasks",title:"Student task manager",stage:"Plan",description:"Turn chapters, mocks, habits, and revision into work you can schedule and start.",searchIntent:"Student task manager"},{id:"focus",path:"/features/focus-timer",navLabel:"Focus",title:"Focus timer",stage:"Focus",description:"Study with the task, subject, chapter, questions, and session result attached.",searchIntent:"Focus timer for students"},{id:"syllabus",path:"/features/syllabus-tracker",navLabel:"Syllabus",title:"Syllabus tracker",stage:"Map",description:"Track every subject, chapter, topic, revision date, and weak area in one map.",searchIntent:"JEE and NEET syllabus tracker"},{id:"exams",path:"/features/exam-planner",navLabel:"Exams",title:"Exam planner",stage:"Prepare",description:"Connect countdowns, mocks, mapped syllabus, scores, mistakes, and readiness.",searchIntent:"Exam planner and mock test analyzer"},{id:"study",path:"/features/study-planner",navLabel:"Study",title:"Study planner",stage:"Revise",description:"Shape the next seven days from real deadlines, coverage, recall, and study history.",searchIntent:"Study and revision planner"},{id:"analytics",path:"/features/study-analytics",navLabel:"Analytics",title:"Study analytics",stage:"Review",description:"Understand time, questions, subjects, mocks, consistency, and focus quality.",searchIntent:"Study analytics for students"},{id:"community",path:"/features/study-groups",navLabel:"Community",title:"Study buddies and groups",stage:"Together",description:"Share today with trusted buddies and join exam groups ranked by exact focus time.",searchIntent:"Study buddy and exam study group app"}],si="/landingpage.jpg",ti=1600,ni=965,j="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",z="noindex, nofollow, noarchive, nosnippet, noimageindex",$="IsotopeAI",M="https://isotopeai.in",Y="Plan JEE, NEET, CUET, IAT, BITSAT, SAT, boards, university, and other exam preparation with a syllabus tracker, focus timer, tasks, mock analysis, and study analytics.",X="isotopeai@icloud.com",ee={discord:"https://discord.gg/QfmQGmKJUD",reddit:"https://www.reddit.com/r/Isotope/"},me=`${M}${si}`,oi=["AI study planner for JEE and NEET aspirants","syllabus tracker for subjects, chapters, and topics","focus timer with Pomodoro, stopwatch, and custom sessions","study time tracker with session history and subject-wise logs","question tracker and question analytics","mock test analyzer and exam analytics","revision planner with spaced repetition support","task manager with boards, lists, habits, recurring tasks, and subtasks","exam countdowns, D-day tracking, and prep insights","dashboard with daily overview and study progress","calendar planning and study scheduling","study buddies, exam groups, live study status, and exact-time leaderboards","AI insights and AI task planning based on study data","offline-ready PWA with optional cloud sync"],ke=["jee study tracker","jee syllabus tracker","neet study tracker","neet syllabus tracker","website to record study time for jee","website to record study time for neet","jee mock test analyzer","neet mock test analyzer","jee question tracker","neet question tracker","jee revision planner","neet revision planner","jee task planner","neet task planner","jee focus timer","neet focus timer","jee study planner","neet study planner"],xe=["AI study planner","student productivity app","focus timer for students","study tracker","study analytics","JEE preparation app","NEET preparation app","BITSAT preparation app","CUET preparation app","IAT preparation app","SAT study tracker","student dashboard","study planner India","exam preparation platform","jee study tracker","jee syllabus tracker","neet study tracker","neet syllabus tracker","bitsat study tracker","bitsat study planner","cuet study tracker","iat study tracker","sat study planner","university exam study planner","study time tracker for students","website to record study time","online study planner for jee","online study planner for neet","online study planner for bitsat","focus timer for study","study tracker for neet","study tracker for bitsat","syllabus tracking website","mock test analyzer","jee mock test analyzer","neet mock test analyzer","bitsat mock test analyzer","mock analysis for students","study analytics for jee","study analytics for neet","study analytics for bitsat","revision planner for jee","revision planner for neet","revision planner for bitsat","task planner for students","study task manager","website to record study time for neet","website to record study time for bitsat","neet syllabus tracking website","bitsat syllabus tracking website",...ke],ge=[{question:"Is IsotopeAI really free?",answer:"Yes. The core product stays free for everyone, while paid plans unlock premium community access, sync, and extra perks."},{question:"Which exams does this support?",answer:"Students can use IsotopeAI for JEE, NEET, CUET, IAT, BITSAT, boards, SAT, AP, university exams, and other curriculum-based exams by creating their own syllabus structure."},{question:"Do I have to join a study group?",answer:"No. IsotopeAI works for solo study. Paid Community access adds a small buddy circle and exam groups when you want accountability."},{question:"How secure is my performance data?",answer:"Student performance data is kept private, and IsotopeAI does not sell personal student profiles to advertisers or coaching institutes."},{question:"Can I use IsotopeAI as a JEE study tracker?",answer:"Yes. Students can use IsotopeAI to track JEE study time, plan daily work, manage tasks, review study analytics, and monitor preparation progress across subjects."},{question:"Can I use IsotopeAI as a NEET study tracker?",answer:"Yes. Students preparing for NEET can use IsotopeAI to track study hours, manage syllabus coverage, plan revision, review question and mock performance, and analyze preparation across Physics, Chemistry, and Biology."},{question:"Can I use IsotopeAI for BITSAT preparation?",answer:"Yes. IsotopeAI can be used for BITSAT preparation as a study planner, study time tracker, syllabus tracker, and focus system for PCM practice and revision."},{question:"Does IsotopeAI include mock test analysis?",answer:"Yes. Students can use IsotopeAI to review mock performance alongside study tracking, question analytics, planning, and exam insights so test results are easier to act on."},{question:"Does IsotopeAI work as a syllabus tracker?",answer:"Yes. Students can organize subjects, chapters, and topics, then use the platform as a syllabus tracker for JEE, NEET, BITSAT, boards, and other exams."},{question:"Can I record study time online with IsotopeAI?",answer:"Yes. IsotopeAI can be used as a study time tracker to record focus sessions, manual sessions, and subject-wise study hours in one place."},{question:"Does IsotopeAI help with revision planning for JEE and NEET?",answer:"Yes. IsotopeAI supports revision planning with syllabus organization, study tracking, and spaced repetition-oriented workflows so students can revisit weak topics more systematically."},{question:"Does IsotopeAI include task planning and daily study management?",answer:"Yes. Students can manage tasks with boards, lists, habits, recurring tasks, subtasks, and AI-assisted planning inside the same platform used for focus and analytics."},{question:"Can I track questions, not just hours?",answer:"Yes. IsotopeAI includes question tracking and question analytics so JEE and NEET aspirants can review attempt volume and performance alongside study time."}],ii=[{question:"What is the IsotopeAI Today dashboard?",answer:"Today is a daily study dashboard that brings together your next task, active exam, syllabus progress, focus time, revision signals, upcoming work, and useful warnings. It is designed to help you choose and start the right work without checking several pages first."},{question:"Does Today connect tasks with the focus timer?",answer:"Yes. Starting a planned task from Today can carry its task, subject, chapter, topic, and useful timer duration into Focus. The completed session then updates focused time and later analytics."},{question:"How does the dashboard decide what needs attention?",answer:"It checks tracked signals such as overdue tasks, unfinished mock reviews, revision dates, question accuracy, subject workload, recent focus time, and mock trends. Each recommendation shows its reason and evidence, and no warning appears when there is not enough reliable data."},{question:"Can I customize the Today dashboard?",answer:"Yes. You can choose compact or comfortable density, reorder sections, hide optional sections, choose visible subjects, switch between weekly and monthly context, and restore the recommended layout. Preferences are saved for each exam workspace."},{question:"Can I use the dashboard for JEE or NEET preparation?",answer:"Yes. Today can combine JEE or NEET tasks, subject and chapter progress, exam countdowns, focus sessions, revisions, question performance, and mock review work. The same dashboard also works with other exams and custom syllabus structures."},{question:"Does the Today dashboard work offline?",answer:"Core planning and focus tools use local-first storage and remain useful through a weak connection. The header also shows offline and storage status. Live community, cloud sync, and other online services still need a connection."}];[...w.map(s=>({path:s.path,changeFrequency:"weekly",priority:"0.8"}))];const ve=`${M}/#website`,O=`${M}/#organization`,ri=`${M}/#application`,W=s=>{if(!s||s==="/")return"/";const t=s.replace(/\/+$/,"");return t.startsWith("/")?t:`/${t}`},y=s=>{const t=W(s);return t==="/"?`${M}/`:`${M}${t}`},ae=()=>({"@context":"https://schema.org","@type":"Organization","@id":O,name:$,url:M,logo:`${M}/icons/icon-512x512.png`,email:X,description:Y,sameAs:[ee.discord,ee.reddit],contactPoint:[{"@type":"ContactPoint",contactType:"customer support",email:X,availableLanguage:["en","hi"]}]}),ci=()=>({"@context":"https://schema.org","@type":"WebSite","@id":ve,name:$,url:M,description:Y,inLanguage:"en-IN",publisher:{"@id":O},keywords:ke.join(", ")}),_=()=>({"@context":"https://schema.org","@type":"SoftwareApplication","@id":ri,name:$,url:M,description:Y,applicationCategory:"EducationalApplication",applicationSubCategory:"JEE and NEET study planner",operatingSystem:"Web",image:me,featureList:[...oi],audience:{"@type":"Audience",audienceType:"JEE and NEET aspirants"},offers:{"@type":"Offer",price:"0",priceCurrency:"INR",availability:"https://schema.org/InStock"},publisher:{"@id":O}}),I=(s=ge)=>({"@context":"https://schema.org","@type":"FAQPage",mainEntity:s.map(t=>({"@type":"Question",name:t.question,acceptedAnswer:{"@type":"Answer",text:t.answer}}))}),di=()=>({"@context":"https://schema.org","@type":"ItemList","@id":`${M}/#feature-guides`,name:"IsotopeAI feature guides",description:`${w.length} connected guides covering daily decisions, tasks, focus, syllabus, exams, revision planning, study analytics, and study groups.`,numberOfItems:w.length,itemListOrder:"https://schema.org/ItemListOrderAscending",itemListElement:w.map((s,t)=>({"@type":"ListItem",position:t+1,name:s.title,description:s.description,url:y(s.path)}))}),E=(s,t,n,o)=>({"@context":"https://schema.org","@type":t,name:n,description:o,url:y(s),isPartOf:{"@id":ve},about:{"@id":O},...s.startsWith("/features/")?{relatedLink:w.filter(i=>i.path!==s).map(i=>y(i.path))}:{}}),D=(s,t,n,o)=>[E(s,t,n,o)],li=[{match:/^\/$/,build:()=>({title:"JEE & NEET Study Tracker, Syllabus & Focus Timer | IsotopeAI",description:Y,canonicalPath:"/",keywords:xe,robots:j,ogType:"website",structuredData:[ci(),ae(),_(),di(),I()]})},{match:/^\/about\/?$/,build:()=>{const s="About IsotopeAI | A Study System Built by Students",t="Read how IsotopeAI grew from a student project into one connected place to plan study, track syllabus, focus, review mocks, and study with others.";return{title:s,description:t,canonicalPath:"/about",keywords:["about IsotopeAI","student productivity platform","all-in-one study app","exam preparation system","study analytics for students","study planner built by students"],robots:j,ogType:"website",structuredData:[...D("/about","AboutPage",s,t),ae()]}}},{match:/^\/features\/today-dashboard\/?$/,build:()=>{const s="Daily Study Dashboard & Student Planner | IsotopeAI",t="Plan today’s study, continue focused work, track exam and syllabus progress, and act on clear evidence with the IsotopeAI Today dashboard.";return{title:s,description:t,canonicalPath:"/features/today-dashboard",keywords:["daily study dashboard","student dashboard","daily study planner","JEE daily study planner","NEET daily study planner","study task dashboard","exam preparation dashboard","study progress dashboard","what to study today","student productivity dashboard"],robots:j,ogType:"website",structuredData:[E("/features/today-dashboard","WebPage",s,t),{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:y("/")},{"@type":"ListItem",position:2,name:"Features",item:`${y("/")}#features`},{"@type":"ListItem",position:3,name:"Today dashboard",item:y("/features/today-dashboard")}]},I(ii),_()]}}},{match:/^\/features\/focus-timer\/?$/,build:()=>{const s="Focus Timer for Students with Question Tracking | IsotopeAI",t="Use a Pomodoro or stopwatch focus timer with linked tasks, chapters, question tracking, custom pacing nudges, Zen mode, PiP, and study analytics.";return{title:s,description:t,canonicalPath:"/features/focus-timer",keywords:["focus timer for students","study focus timer","Pomodoro timer for students","JEE focus timer","NEET focus timer","question tracking timer","study stopwatch","study time tracker","Pomodoro timer with question tracker","exam preparation timer","chapter wise study timer","focus timer with analytics"],robots:j,ogType:"website",structuredData:[E("/features/focus-timer","WebPage",s,t),{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:y("/")},{"@type":"ListItem",position:2,name:"Features",item:`${y("/")}#features`},{"@type":"ListItem",position:3,name:"Focus timer",item:y("/features/focus-timer")}]},I(Jo),_()]}}},{match:/^\/features\/student-task-manager\/?$/,build:()=>{const s="Student Task Manager & Study Planner | IsotopeAI",t="Plan study tasks in a board, list, planning calendar, Zen view, or priority matrix with linked subjects, chapters, exams, habits, recurring work, Focus, and analytics.";return{title:s,description:t,canonicalPath:"/features/student-task-manager",keywords:["student task manager","study task planner","JEE task planner","NEET task planner","study planner with calendar","student Kanban board","exam task manager","chapter wise study planner","study habit tracker","recurring study tasks","student Eisenhower matrix","offline study planner","task manager with focus timer"],robots:j,ogType:"website",structuredData:[E("/features/student-task-manager","WebPage",s,t),{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:y("/")},{"@type":"ListItem",position:2,name:"Features",item:`${y("/")}#features`},{"@type":"ListItem",position:3,name:"Student task manager",item:y("/features/student-task-manager")}]},I(Wo),_()]}}},{match:/^\/features\/syllabus-tracker\/?$/,build:()=>{const s="Syllabus Tracker for Students, JEE & NEET | IsotopeAI",t="Track subjects, chapters, topics, revision, study time, questions, priorities, and custom progress for JEE, NEET, and any exam with IsotopeAI.";return{title:s,description:t,canonicalPath:"/features/syllabus-tracker",keywords:["syllabus tracker for students","JEE syllabus tracker","NEET syllabus tracker","BITSAT syllabus tracker","chapter wise progress tracker","exam syllabus planner","revision tracker for students","custom syllabus tracker","topic wise study tracker","chapter completion tracker","syllabus coverage tracker","study planner with syllabus","syllabus tracker with focus timer"],robots:j,ogType:"website",structuredData:[E("/features/syllabus-tracker","WebPage",s,t),{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:y("/")},{"@type":"ListItem",position:2,name:"Features",item:`${y("/")}#features`},{"@type":"ListItem",position:3,name:"Syllabus tracker",item:y("/features/syllabus-tracker")}]},I(Zo),_()]}}},{match:/^\/features\/exam-planner\/?$/,build:()=>{const s="Exam Planner, Countdown & Mock Test Analyzer | IsotopeAI",t="Plan D-Day exams and mocks, map syllabus chapters, track result dates, log scores and errors, compare linked attempts, and find weak chapters with IsotopeAI.";return{title:s,description:t,canonicalPath:"/features/exam-planner",keywords:["exam planner for students","exam countdown planner","mock test analyzer","JEE mock test analysis","NEET mock test analysis","D-Day exam tracker","exam syllabus tracker","mock test score tracker","exam result analysis","weak chapter tracker","student exam calendar","exam readiness tracker","exam result reminder"],robots:j,ogType:"website",structuredData:[E("/features/exam-planner","WebPage",s,t),{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:y("/")},{"@type":"ListItem",position:2,name:"Features",item:`${y("/")}#features`},{"@type":"ListItem",position:3,name:"Exam planner",item:y("/features/exam-planner")}]},I(Go),_()]}}},{match:/^\/features\/study-planner\/?$/,build:()=>{const s="Study Planner for Students, JEE & NEET Revision | IsotopeAI",t="Plan exams, syllabus coverage, tasks, focus time, spaced revision, mock results, and the next seven days in one connected IsotopeAI Study workspace.";return{title:s,description:t,canonicalPath:"/features/study-planner",keywords:[...Ko],robots:j,ogType:"website",structuredData:[E("/features/study-planner","WebPage",s,t),{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:y("/")},{"@type":"ListItem",position:2,name:"Features",item:`${y("/")}#features`},{"@type":"ListItem",position:3,name:"Study planner",item:y("/features/study-planner")}]},I(Qo),_()]}}},{match:/^\/features\/study-analytics\/?$/,build:()=>{const s="Study Analytics for Students, JEE & NEET | IsotopeAI",t="Review study time, questions, subjects, chapters, tasks, mocks, focus quality, consistency, session history, and shareable reports with IsotopeAI Analytics.";return{title:s,description:t,canonicalPath:"/features/study-analytics",keywords:["study analytics for students","JEE study analytics","NEET study analytics","study time tracker for students","student productivity tracker","question analytics for students","subject wise study tracker","chapter wise study analytics","mock test analysis for students","focus time analytics","study session history","study consistency tracker","student performance dashboard"],robots:j,ogType:"website",structuredData:[E("/features/study-analytics","WebPage",s,t),{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:y("/")},{"@type":"ListItem",position:2,name:"Features",item:`${y("/")}#features`},{"@type":"ListItem",position:3,name:"Study analytics",item:y("/features/study-analytics")}]},I(Xo),_()]}}},{match:/^\/features\/study-groups\/?$/,build:()=>{const s="Study Buddy & JEE/NEET Study Group App | IsotopeAI",t="Study with trusted buddies and exam groups using live study status, shared tasks, subject time, question counts, privacy controls, and exact-time leaderboards.";return{title:s,description:t,canonicalPath:"/features/study-groups",keywords:[...ai],robots:j,ogType:"website",structuredData:[E("/features/study-groups","WebPage",s,t),{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:y("/")},{"@type":"ListItem",position:2,name:"Features",item:`${y("/")}#features`},{"@type":"ListItem",position:3,name:"Study buddies and groups",item:y("/features/study-groups")}]},I(ei),_()]}}},{match:/^\/privacy\/?$/,build:()=>{const s="Privacy Policy | IsotopeAI",t="Read the IsotopeAI privacy policy, including how student data, analytics, subscriptions, and AI-powered features are handled.";return{title:s,description:t,canonicalPath:"/privacy",keywords:["IsotopeAI privacy policy","student data privacy","AI privacy policy"],robots:j,ogType:"article",structuredData:D("/privacy","PrivacyPolicy",s,t)}}},{match:/^\/terms\/?$/,build:()=>{const s="Terms of Service | IsotopeAI",t="Review the IsotopeAI terms of service covering eligibility, subscriptions, acceptable use, and platform access.";return{title:s,description:t,canonicalPath:"/terms",keywords:["IsotopeAI terms","terms of service","student app terms"],robots:j,ogType:"article",structuredData:D("/terms","TermsOfService",s,t)}}},{match:/^\/(?:auth|reset-password)\/?$/,build:()=>({title:"Sign In to IsotopeAI",description:"Create your IsotopeAI account or sign in to access your study dashboard.",canonicalPath:"/auth",robots:z,ogType:"website",structuredData:[]})},{match:/^\/invite\/[^/]+\/?$/,build:()=>({title:"Study Group Invite | IsotopeAI",description:"Open your private IsotopeAI group invite and continue inside the app.",canonicalPath:"/",robots:z,ogType:"website",structuredData:[]})},{match:/^\/(dashboard|onboarding|community|focus|analytics|study|syllabus|exams|tasks|settings|subscription)(\/.*)?$/,build:s=>({title:"IsotopeAI App",description:"Private IsotopeAI application workspace.",canonicalPath:W(s),robots:z,ogType:"website",structuredData:[]})}],hi=s=>{const t=W(s),n=li.find(r=>r.match.test(t));if(n)return n.build(t);const o="Page Not Found | IsotopeAI",i="The page you requested could not be found. Explore IsotopeAI to plan study sessions, track progress, and stay focused.";return{title:o,description:i,canonicalPath:t,robots:z,ogType:"website",structuredData:D(t,"WebPage",o,i)}},pi=()=>({url:me,alt:"IsotopeAI landing page preview",width:String(ti),height:String(ni)}),yi=s=>{const t=window;if(typeof t.requestIdleCallback=="function"){const o=t.requestIdleCallback(s,{timeout:2500});return()=>t.cancelIdleCallback?.(o)}const n=window.setTimeout(s,1200);return()=>window.clearTimeout(n)},be=()=>{const[s,t]=m.useState(!1);return m.useEffect(()=>{let n=!0,o;const i=yi(()=>{Ne(async()=>{const{useAuthStore:r}=await import("./useAuthStore-Aw1au7RF.js").then(u=>u.a9);return{useAuthStore:r}},__vite__mapDeps([0,1,2])).then(({useAuthStore:r})=>{n&&(t(r.getState().isAuthenticated),o=r.subscribe(u=>{n&&t(u.isAuthenticated)}))})});return()=>{n=!1,i(),o?.()}},[]),{isAuthenticated:s}},se=s=>{let t;const n=new Set,o=(p,x)=>{const c=typeof p=="function"?p(t):p;if(!Object.is(c,t)){const h=t;t=x??(typeof c!="object"||c===null)?c:Object.assign({},t,c),n.forEach(l=>l(t,h))}},i=()=>t,d={setState:o,getState:i,getInitialState:()=>g,subscribe:p=>(n.add(p),()=>n.delete(p))},g=t=s(o,i,d);return d},ui=(s=>s?se(s):se),mi=s=>s;function ki(s,t=mi){const n=C.useSyncExternalStore(s.subscribe,C.useCallback(()=>t(s.getState()),[s,t]),C.useCallback(()=>t(s.getInitialState()),[s,t]));return C.useDebugValue(n),n}const te=s=>{const t=ui(s),n=o=>ki(t,o);return Object.assign(n,t),n},xi=(s=>s?te(s):te),gi=xi(s=>({isOpen:!1,openModal:()=>s({isOpen:!0}),closeModal:()=>s({isOpen:!1})})),H1=()=>{const s=fe(),{isAuthenticated:t}=be(),[n,o]=m.useState(()=>ue()),[i,r]=m.useState("yearly"),u=Uo(n),d=Bo(u,i);m.useEffect(()=>{let c=!0;return Oo().then(h=>{c&&o(h)}),()=>{c=!1}},[]);const g={name:"The Aspirant",description:"Everything you need to study, track and stay accountable.",price:n==="india"?"₹0":"$0",period:"/forever",features:[{label:n==="india"?"Free access to all core features":"Free access to core study tools",included:!0},{label:"Advanced analytics",included:!0},{label:"Daily goals and streaks",included:!0},{label:"Community server access",included:!0},{label:"Cloud sync",included:!1,note:"Local-first only"},{label:"Premium community access",included:!1,note:"Pro only"}],action:"free"},p=n==="india"?[g,{name:"Pro",description:"Cloud sync, the closest community circle and stronger accountability.",price:d.price,period:d.period,secondaryPrice:d.secondaryPrice,originalPrice:d.originalPrice,priceNote:d.priceNote,features:[{label:"Everything in Aspirant",included:!0},{label:"Cloud sync across devices",included:!0},{label:"Complete premium community access",included:!0},{label:"Pro badge and Discord role",included:!0},{label:"Pro WhatsApp group",included:!0},{label:"Study Buddy and custom themes",included:!0},{label:"Top-priority support",included:!0},{label:"Early access to premium drops",included:!0},{label:"3 monthly JEE/NEET mentorship sessions",included:!0,note:"Coming soon"}],action:"scholar",featured:!0}]:[g,{name:"Pro",description:"Premium sync, community access and the Discord role.",price:d.price,period:d.period,secondaryPrice:d.secondaryPrice,originalPrice:d.originalPrice,priceNote:d.priceNote,features:[{label:"Everything in Aspirant",included:!0},{label:"Cloud sync and backup",included:!0},{label:"Premium community access",included:!0},{label:"Premium Discord role",included:!0},{label:i==="yearly"?"2 months free vs monthly":"Flexible monthly access",included:!0}],action:"scholar",featured:!0}],x=c=>{if(c==="free"){s("/auth?mode=signup");return}const h=`&cycle=${i}`,l=`/subscription?upgrade=${c}${h}`;s(t?l:`/auth?mode=signup&redirect=${encodeURIComponent(l)}`)};return e.jsx("section",{className:"marketing-section pricing-section",id:"pricing","aria-labelledby":"pricing-heading",children:e.jsxs("div",{className:"marketing-shell",children:[e.jsxs("div",{className:"section-heading pricing-heading",children:[e.jsxs("div",{children:[e.jsx("span",{className:"section-index",children:"07 / PRICING"}),e.jsx("h2",{id:"pricing-heading",children:"The core study system stays free."})]}),e.jsxs("div",{children:[e.jsx("p",{children:"Upgrade only if you want cloud sync and closer community access."}),e.jsxs("button",{type:"button",className:"pricing-why",onClick:()=>gi.getState().openModal(),children:[e.jsx(st,{})," Why are there paid plans?"]})]})]}),e.jsx("div",{className:"billing-cycle","aria-label":"Billing period",children:["monthly","yearly"].map(c=>e.jsxs("button",{type:"button",className:i===c?"is-active":"",onClick:()=>r(c),"aria-pressed":i===c,children:[c==="monthly"?"Monthly":"Yearly"," ",c==="yearly"&&e.jsx("small",{children:n==="india"?"save 29%":"best value"})]},c))}),e.jsx("div",{className:`pricing-grid ${p.length===2?"pricing-grid-two":""}`,children:p.map(c=>e.jsxs("article",{className:`price-tier ${c.featured?"is-featured":""}`,children:[e.jsxs("div",{className:"price-tier-top",children:[e.jsxs("span",{className:"price-plan-label",children:[c.featured?e.jsx(is,{"aria-hidden":"true"}):null,c.name]}),e.jsx("p",{children:c.description}),e.jsxs("div",{className:"price-line","aria-live":c.featured?"polite":void 0,children:[e.jsx("strong",{children:c.price}),e.jsx("span",{children:c.period})]}),c.originalPrice&&e.jsxs("p",{className:"price-original",children:["Usually ",e.jsx("s",{children:c.originalPrice})," ",c.priceNote&&e.jsx("b",{children:c.priceNote})]}),c.secondaryPrice&&e.jsx("small",{className:"price-secondary",children:c.secondaryPrice})]}),e.jsx("ul",{children:c.features.map(h=>e.jsxs("li",{className:h.included?"":"is-muted",children:[h.included?e.jsx(b,{"aria-hidden":"true"}):e.jsx(pe,{"aria-hidden":"true"}),e.jsxs("span",{children:[h.label,h.note&&e.jsx("small",{children:h.note})]})]},h.label))}),e.jsx("button",{type:"button",onClick:()=>x(c.action),children:c.action==="free"?"Start free":`Choose ${c.name.replace("The ","")}`})]},c.name))}),n==="india"&&e.jsxs("p",{className:"pricing-note",children:[e.jsx("strong",{children:"Pro mentorship:"})," 3 free monthly JEE/NEET mentorship slots are planned and clearly marked as coming soon."]})]})})},vi=[["Disha (DishTV)","NEET 2026","Isotope helps me track test accuracy and preparation levels clearly. The streak feature is a huge motivator for daily consistency, and the AI overview constantly pushes me to stay on track. Perfectly designed for maintaining daily targets.",!0],["u/MovieImpressive8549","BITSAT 2025: 3XX marks","It was 90% of my success. I used to get motivated due to the time I studied a day and it gave me fuel for the next day. It has like such a good ui.",!1],["Sanidhya (ZenitsuAckerman)","JEE & BITSAT 2026","Goated tool for tracking productivity. The test charts and clear-cut stats are incredibly useful for any aspirant looking to improve their performance with real data.",!0],["Samarth (lemniscate)","JEE 2026","Finally a tool that makes study tracking crystal clear. The subject-wise analytics show exactly where you're messing up, and the focus timer is clutch for staying locked in. The progress graphs make prep feel real and push you to improve daily.",!0],["Anshul","NEET 2024: 655 marks","Found Isotope late during my prep. Tho it helped in managing and tracking the syllabus. Also the community was really great and fun.",!1],["Ayush","JEE 2025: MNIT Allahabad","The great UI, and seeing the analytics at the end of the day with such good UI, aur padhne ka man karta tha. Thanks",!1],["Shrey","JEE 2027","I love isotope very much . Thanks for making it. ❤️🩷🧡💛💚💙🩵💜",!1],["u/DotRich4099","Aspirant","man thanks a LOTTT. U might never realize how much u helped me in my drop year. Best website for productivity that has ever existed, I have many others like ypt, regain etc. They all were shitty as hell",!1],["u/Dizzy-Attitude-8174","Aspirant","Love ur app's design bro",!1],["u/Own-Catch-1268","Aspirant","BRO HONESTLY THANKS FOR PROVIDING THE WEBSITE BIG W FOR U DUDE THANKS ❤️❤️",!1],["u/IllustriousWeight862","Aspirant","thanks bhai loveyou. amazing site.",!1],["u/Top_Search1980","Aspirant","isotopeai is freaking insane crazy good app. holy shit this shit is so peak bro",!1]],R1=()=>e.jsx("section",{className:"marketing-section student-voices","aria-labelledby":"voices-heading",children:e.jsxs("div",{className:"marketing-shell",children:[e.jsxs("div",{className:"section-heading voices-heading",children:[e.jsxs("div",{children:[e.jsx("span",{className:"section-index",children:"08 / STUDENT NOTES"}),e.jsx("h2",{id:"voices-heading",children:"Real students. Their words."})]}),e.jsx("p",{children:"No polished case-study script. Just the feedback students sent."})]}),e.jsx("div",{className:"voice-strip",tabIndex:0,"aria-label":"Student testimonials. Scroll horizontally to read more.",children:vi.map(([s,t,n,o],i)=>e.jsxs("figure",{className:`voice-note note-${i%4+1}`,children:[e.jsx(xn,{"aria-hidden":"true"}),e.jsxs("blockquote",{children:["“",n,"”"]}),e.jsxs("figcaption",{children:[e.jsx("strong",{children:s}),e.jsx("span",{children:t}),o&&e.jsx("small",{children:"Shortened with AI"})]})]},s))})]})}),V1=()=>e.jsx("section",{className:"marketing-section faq-section",id:"faq","aria-labelledby":"faq-heading",children:e.jsxs("div",{className:"marketing-shell faq-layout",children:[e.jsxs("div",{className:"faq-intro",children:[e.jsx("span",{className:"section-index",children:"09 / FAQ"}),e.jsx("h2",{id:"faq-heading",children:"Before you begin."}),e.jsx("p",{children:"Simple answers about plans, exams, privacy and how the product works."}),e.jsx("a",{href:"mailto:isotopeai@icloud.com?subject=Isotope%20Support",children:"Still have a question? Email support."})]}),e.jsx("div",{className:"faq-list",children:ge.map((s,t)=>e.jsxs("details",{children:[e.jsxs("summary",{children:[e.jsx("span",{children:String(t+1).padStart(2,"0")}),s.question,e.jsx(re,{"aria-hidden":"true"})]}),e.jsx("p",{children:s.answer})]},s.question))})]})}),F1=()=>e.jsx("section",{className:"marketing-section marketing-feature-directory",id:"feature-guides","aria-labelledby":"feature-guides-heading",children:e.jsxs("div",{className:"marketing-shell",children:[e.jsxs("div",{className:"marketing-feature-directory-heading",children:[e.jsxs("div",{children:[e.jsx("span",{className:"section-index",children:"ALL FEATURE GUIDES"}),e.jsx("h2",{id:"feature-guides-heading",children:"Follow the complete study loop."})]}),e.jsx("p",{children:"Each guide goes deep on one part of IsotopeAI. Together they show how a decision becomes a plan, a focused session, useful progress, and a better next decision."})]}),e.jsx("ol",{className:"marketing-feature-directory-list",children:w.map((s,t)=>e.jsx("li",{children:e.jsxs(v,{to:s.path,children:[e.jsx("span",{className:"marketing-feature-number",children:String(t+1).padStart(2,"0")}),e.jsx("span",{className:"marketing-feature-stage",children:s.stage}),e.jsxs("span",{className:"marketing-feature-copy",children:[e.jsx("strong",{children:s.title}),e.jsx("small",{children:s.description})]}),e.jsx("span",{className:"marketing-feature-intent",children:s.searchIntent}),e.jsx(N,{"aria-hidden":"true"})]})},s.path))})]})}),Y1=({currentPath:s})=>e.jsx("section",{className:"marketing-connected-journey","aria-labelledby":"connected-guides-heading",children:e.jsxs("div",{className:"marketing-shell",children:[e.jsxs("div",{className:"marketing-connected-journey-heading",children:[e.jsx("span",{children:"THE CONNECTED SYSTEM"}),e.jsx("h2",{id:"connected-guides-heading",children:"Explore every step of the study workflow."}),e.jsx("p",{children:"Move between the seven public guides to see how planning, focused work, syllabus, exams, revision, and review share the same study context."})]}),e.jsx("nav",{"aria-label":"Connected IsotopeAI feature guides",children:e.jsx("ol",{className:"marketing-connected-journey-list",children:w.map((t,n)=>{const o=s===t.path;return e.jsx("li",{className:o?"is-current":void 0,children:e.jsxs(v,{to:t.path,"aria-current":o?"page":void 0,children:[e.jsx("span",{children:String(n+1).padStart(2,"0")}),e.jsx("small",{children:t.stage}),e.jsx("strong",{children:t.title}),!o&&e.jsx(N,{"aria-hidden":"true"}),o&&e.jsx("em",{children:"Current guide"})]})},t.path)})})})]})}),O1=()=>e.jsx("div",{className:"marketing-hero-free","aria-hidden":"true",children:e.jsx("span",{children:"FREE"})}),je=()=>e.jsxs("span",{className:"marketing-logo","aria-label":"IsotopeAI",children:[e.jsxs("span",{className:"marketing-logo-mark","aria-hidden":"true",children:[e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{})]}),e.jsxs("span",{children:["ISOTOPE",e.jsx("i",{children:"AI"})]})]}),U1=({isDark:s,toggleTheme:t})=>{const[n,o]=m.useState(!1),[i,r]=m.useState(!1),[u,d]=m.useState(!1),g=m.useRef(null),p=B(),{isAuthenticated:x}=be(),c=x?"/dashboard":"/auth?mode=signup";m.useEffect(()=>{const l=()=>d(window.scrollY>24);return l(),window.addEventListener("scroll",l,{passive:!0}),()=>window.removeEventListener("scroll",l)},[]),m.useEffect(()=>{if(!n&&!i)return;const l=A=>{A.key==="Escape"&&(o(!1),r(!1))};return window.addEventListener("keydown",l),()=>window.removeEventListener("keydown",l)},[i,n]),m.useEffect(()=>{if(!i)return;const l=A=>{g.current?.contains(A.target)||r(!1)};return window.addEventListener("pointerdown",l),()=>window.removeEventListener("pointerdown",l)},[i]),m.useEffect(()=>{o(!1),r(!1)},[p.pathname]);const h=()=>o(!1);return e.jsxs("header",{className:`marketing-nav ${u?"is-scrolled":""}`,children:[e.jsxs("div",{className:"marketing-nav-inner",children:[e.jsx(v,{to:"/",className:"marketing-brand-link",onClick:h,children:e.jsx(je,{})}),e.jsxs("nav",{className:"marketing-nav-links","aria-label":"Main navigation",children:[e.jsx("a",{href:"/#workflow",children:"How it works"}),e.jsxs("div",{className:"marketing-feature-menu",ref:g,children:[e.jsxs("button",{type:"button",className:i?"is-open":void 0,onClick:()=>r(l=>!l),"aria-expanded":i,"aria-controls":"marketing-feature-menu-panel","aria-haspopup":"true",children:["Features ",e.jsx(re,{"aria-hidden":"true"})]}),e.jsxs("div",{id:"marketing-feature-menu-panel",className:`marketing-feature-menu-panel ${i?"is-open":""}`,hidden:!i,children:[e.jsxs("div",{className:"marketing-feature-menu-intro",children:[e.jsxs("span",{children:[w.length," connected guides"]}),e.jsx("strong",{children:"From choosing the work to reviewing the result."}),e.jsxs("a",{href:"/#feature-guides",onClick:()=>r(!1),children:["See the complete workflow ",e.jsx(N,{"aria-hidden":"true"})]})]}),e.jsx("div",{className:"marketing-feature-menu-links",children:w.map((l,A)=>e.jsxs(v,{to:l.path,"aria-current":p.pathname===l.path?"page":void 0,onClick:()=>r(!1),children:[e.jsx("span",{children:String(A+1).padStart(2,"0")}),e.jsxs("span",{children:[e.jsx("strong",{children:l.title}),e.jsx("small",{children:l.stage})]}),e.jsx(N,{"aria-hidden":"true"})]},l.path))})]})]}),e.jsx("a",{href:"/#pricing",children:"Pricing"}),e.jsx(v,{to:"/about",children:"About"})]}),e.jsxs("div",{className:"marketing-nav-actions",children:[e.jsx("button",{type:"button",className:"marketing-icon-button",onClick:t,"aria-label":s?"Switch to light mode":"Switch to dark mode",children:s?e.jsx(oo,{"aria-hidden":"true"}):e.jsx(Ut,{"aria-hidden":"true"})}),e.jsx(v,{to:c,className:"marketing-nav-cta",children:x?"Open dashboard":"Start free"}),e.jsx("button",{type:"button",className:"marketing-menu-button",onClick:()=>o(l=>!l),"aria-expanded":n,"aria-controls":"marketing-mobile-menu","aria-label":n?"Close navigation":"Open navigation",children:n?e.jsx(pe,{"aria-hidden":"true"}):e.jsx(Tt,{"aria-hidden":"true"})})]})]}),e.jsxs("nav",{id:"marketing-mobile-menu",className:`marketing-mobile-menu ${n?"is-open":""}`,"aria-label":"Mobile navigation",children:[e.jsxs("div",{className:"marketing-mobile-menu-primary",children:[e.jsx("a",{href:"/#workflow",onClick:h,children:"How it works"}),e.jsx("a",{href:"/#feature-guides",onClick:h,children:"All features"}),e.jsx("a",{href:"/#pricing",onClick:h,children:"Pricing"}),e.jsx(v,{to:"/about",onClick:h,children:"About"})]}),e.jsx("span",{className:"marketing-mobile-menu-label",children:"Feature guides"}),e.jsx("div",{className:"marketing-mobile-feature-links",children:w.map(l=>e.jsxs(v,{to:l.path,"aria-current":p.pathname===l.path?"page":void 0,onClick:h,children:[e.jsx("span",{children:l.stage}),l.title]},l.path))}),e.jsxs("div",{className:"marketing-mobile-menu-secondary",children:[e.jsx("a",{href:"/#community",onClick:h,children:"Community"}),e.jsx("a",{href:"/#faq",onClick:h,children:"FAQ"})]}),e.jsx(v,{to:c,className:"marketing-mobile-cta",onClick:h,children:x?"Open dashboard":"Create free account"})]})]})},B1=()=>{const s=[{title:"Product",links:[...w.map(t=>[t.title,t.path]),["Product tour","/#product-tour"]]},{title:"Start here",links:[["All features","/#feature-guides"],["Pricing","/#pricing"],["FAQ","/#faq"],["Try the demo","/demo"]]},{title:"Company",links:[["About","/about"],["Support","mailto:isotopeai@icloud.com?subject=Isotope%20Support"],["Privacy","/privacy"],["Terms","/terms"],["Sitemap","/sitemap.xml"]]},{title:"Community",links:[["Discord","https://discord.gg/QfmQGmKJUD"],["Reddit","https://www.reddit.com/r/Isotope/"]]}];return e.jsxs("footer",{className:"marketing-footer",children:[e.jsxs("div",{className:"marketing-shell marketing-footer-grid",children:[e.jsxs("div",{className:"marketing-footer-lead",children:[e.jsx(je,{}),e.jsx("p",{children:"One connected place to plan, focus, track and improve."}),e.jsxs(v,{to:"/auth?mode=signup",className:"marketing-text-link",children:["Start studying free ",e.jsx(Fe,{"aria-hidden":"true"})]})]}),e.jsx("div",{className:"marketing-footer-links",children:s.map(t=>e.jsxs("div",{children:[e.jsx("h2",{children:t.title}),e.jsx("ul",{children:t.links.map(([n,o])=>{const i=o.startsWith("http");return e.jsx("li",{children:e.jsx("a",{href:o,target:i?"_blank":void 0,rel:i?"noreferrer":void 0,children:n})},n)})})]},t.title))})]}),e.jsxs("div",{className:"marketing-shell marketing-footer-bottom",children:[e.jsx("span",{children:"© 2026 IsotopeAI. Focus. Track. Achieve."}),e.jsxs("span",{children:["v","0.9.0"]})]})]})},f=[{id:"today",label:"Today dashboard",shortLabel:"Today",description:"See tasks, focus time, syllabus progress and the next exam in one daily view.",icon:de},{id:"focus",label:"Focus timer",shortLabel:"Focus",description:"Run Pomodoro, stopwatch or custom sessions with task and syllabus context attached.",icon:F},{id:"syllabus",label:"Syllabus tracker",shortLabel:"Syllabus",description:"Track subjects, chapters and topics, then open a Chapter Hub for deeper work.",icon:H},{id:"exams",label:"Exams and mocks",shortLabel:"Exams",description:"Keep D-Day, exam syllabus, mock results and the next review action together.",icon:ce},{id:"analytics",label:"Study analytics",shortLabel:"Analytics",description:"Review study time, question pace, completion and subject balance without guesswork.",icon:V},{id:"community",label:"Study community",shortLabel:"Groups",description:"Use groups, chat, leaderboards, events and challenges for useful accountability.",icon:J}],bi=({activeId:s})=>e.jsxs("div",{className:"product-rail","aria-hidden":"true",children:[e.jsx("span",{className:"product-rail-logo",children:"I"}),f.map(t=>{const n=t.icon;return e.jsx("span",{className:s===t.id?"is-active":"",children:e.jsx(n,{})},t.id)})]}),ji=()=>e.jsxs("div",{className:"product-canvas product-today-view",children:[e.jsxs("div",{className:"product-view-heading",children:[e.jsxs("div",{children:[e.jsx("span",{className:"product-kicker",children:"Tuesday · 7 April"}),e.jsx("h3",{children:"Good morning."})]}),e.jsx("div",{className:"product-streak",children:"7 day streak"})]}),e.jsxs("div",{className:"today-layout",children:[e.jsxs("div",{className:"today-main",children:[e.jsxs("div",{className:"today-progress",children:[e.jsx("span",{children:"Today’s plan"}),e.jsx("strong",{children:"3 of 5"}),e.jsx("div",{children:e.jsx("i",{style:{width:"60%"}})})]}),[["Revise electrostatics","Physics · 45 min",!0],["Organic reaction sheet","Chemistry · 30 questions",!1],["Mock analysis","JEE Main mock 06",!1],["Formula recall","Daily habit · 12 cards",!1]].map(([s,t,n])=>e.jsxs("div",{className:`today-task ${n?"is-done":""}`,children:[e.jsx("span",{children:n?e.jsx(b,{}):null}),e.jsxs("div",{children:[e.jsx("strong",{children:s}),e.jsx("small",{children:t})]}),e.jsx("button",{type:"button",tabIndex:-1,children:"Focus"})]},String(s)))]}),e.jsxs("aside",{className:"today-aside",children:[e.jsxs("div",{className:"dday-note",children:[e.jsx("span",{children:"JEE Main"}),e.jsx("strong",{children:"42"}),e.jsx("small",{children:"days to go"})]}),e.jsxs("div",{className:"subject-note",children:[e.jsx("span",{children:"Syllabus"}),e.jsx("strong",{children:"64%"}),e.jsx("div",{children:e.jsx("i",{style:{width:"64%"}})}),e.jsx("small",{children:"Physics is leading"})]}),e.jsxs("div",{className:"today-brief-note",children:[e.jsx("span",{children:"AI briefing"}),e.jsx("strong",{children:"Maths needs one more revision block this week."}),e.jsx("small",{children:"Based on time split and Mock 06."})]})]})]})]}),fi=()=>e.jsxs("div",{className:"product-canvas product-focus-view",children:[e.jsxs("div",{className:"focus-context",children:[e.jsx("span",{children:"Current task"}),e.jsx("strong",{children:"Revise electrostatics"}),e.jsx("small",{children:"Physics / Electrostatics / Revision 02"})]}),e.jsxs("div",{className:"focus-mode-switch",children:[e.jsx("span",{className:"is-active",children:"Pomodoro"}),e.jsx("span",{children:"Stopwatch"}),e.jsx("span",{children:"Custom"})]}),e.jsxs("div",{className:"focus-timer",children:[e.jsx("small",{children:"Focus session"}),e.jsx("strong",{children:"24:18"}),e.jsx("span",{children:"of 25 minutes"})]}),e.jsxs("button",{className:"focus-play",type:"button",tabIndex:-1,children:[e.jsx(yn,{fill:"currentColor"})," Resume"]}),e.jsxs("div",{className:"focus-tool-grid",children:[e.jsxs("div",{children:[e.jsx(q,{}),e.jsx("span",{children:"Session goal"}),e.jsx("strong",{children:"Finish Gauss’s law examples"})]}),e.jsxs("div",{children:[e.jsx(he,{}),e.jsx("span",{children:"Question counter"}),e.jsx("strong",{children:"18 attempted · 14 correct"})]}),e.jsxs("div",{children:[e.jsx(Js,{}),e.jsx("span",{children:"Ambient sound"}),e.jsx("strong",{children:"Brown noise · 35%"})]}),e.jsxs("div",{children:[e.jsx(po,{}),e.jsx("span",{children:"Next"}),e.jsx("strong",{children:"5 minute break"})]})]}),e.jsxs("div",{className:"focus-stats",children:[e.jsxs("span",{children:[e.jsx("b",{children:"18"})," questions"]}),e.jsxs("span",{children:[e.jsx("b",{children:"1"})," distraction"]}),e.jsxs("span",{children:[e.jsx("b",{children:"3h 20m"})," today"]})]})]}),wi=()=>e.jsxs("div",{className:"product-canvas product-syllabus-view",children:[e.jsxs("div",{className:"product-view-heading",children:[e.jsxs("div",{children:[e.jsx("span",{className:"product-kicker",children:"JEE preparation"}),e.jsx("h3",{children:"Syllabus"})]}),e.jsx("button",{type:"button",tabIndex:-1,children:"Add subject"})]}),e.jsxs("div",{className:"syllabus-overview",children:[e.jsx("strong",{children:"64%"}),e.jsx("span",{children:"covered across 3 subjects"}),e.jsx("div",{children:e.jsx("i",{style:{width:"64%"}})})]}),e.jsx("div",{className:"syllabus-table",children:[["Physics","Electrostatics","12 / 16 topics","75%"],["Chemistry","Organic chemistry","9 / 15 topics","60%"],["Mathematics","Calculus","8 / 17 topics","47%"]].map(([s,t,n,o])=>e.jsxs("div",{children:[e.jsx("span",{className:`subject-dot ${s.toLowerCase()}`}),e.jsx("strong",{children:s}),e.jsx("span",{children:t}),e.jsx("small",{children:n}),e.jsx("b",{children:o})]},s))}),e.jsxs("div",{className:"chapter-hub-link",children:[e.jsx(H,{}),e.jsxs("div",{children:[e.jsx("strong",{children:"Open Chapter Hub"}),e.jsx("span",{children:"Notes · formulas · mistakes · questions · flashcards · revision"})]})]}),e.jsxs("div",{className:"syllabus-quick-grid",children:[e.jsxs("div",{children:[e.jsx(le,{}),e.jsx("span",{children:"Due today"}),e.jsx("strong",{children:"8 topics"})]}),e.jsxs("div",{children:[e.jsx(q,{}),e.jsx("span",{children:"Weak chapter"}),e.jsx("strong",{children:"Calculus"})]}),e.jsxs("div",{children:[e.jsx(H,{}),e.jsx("span",{children:"Chapter Hubs"}),e.jsx("strong",{children:"12 active"})]})]})]}),Mi=()=>e.jsxs("div",{className:"product-canvas product-exam-view",children:[e.jsxs("div",{className:"product-view-heading",children:[e.jsxs("div",{children:[e.jsx("span",{className:"product-kicker",children:"Exam command centre"}),e.jsx("h3",{children:"JEE Main · Mock 06"})]}),e.jsx("span",{className:"exam-date",children:"17 Apr"})]}),e.jsxs("div",{className:"exam-score",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Score"}),e.jsxs("strong",{children:["168",e.jsx("span",{children:"/300"})]})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Accuracy"}),e.jsx("strong",{children:"72%"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Attempted"}),e.jsx("strong",{children:"62"})]})]}),e.jsxs("div",{className:"exam-analysis",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Physics"}),e.jsx("i",{style:{width:"78%"}}),e.jsx("b",{children:"78%"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Chemistry"}),e.jsx("i",{style:{width:"69%"}}),e.jsx("b",{children:"69%"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Mathematics"}),e.jsx("i",{style:{width:"55%"}}),e.jsx("b",{children:"55%"})]})]}),e.jsxs("div",{className:"exam-action",children:[e.jsx(q,{}),e.jsxs("div",{children:[e.jsx("span",{children:"Next useful action"}),e.jsx("strong",{children:"Review 11 incorrect questions from Calculus and Organic Chemistry."})]})]}),e.jsxs("div",{className:"exam-mini-history",children:[e.jsx("span",{children:"Recent mocks"}),e.jsxs("div",{children:[e.jsx("i",{children:"04"}),e.jsx("b",{children:"151"}),e.jsx("small",{children:"64% accuracy"})]}),e.jsxs("div",{children:[e.jsx("i",{children:"05"}),e.jsx("b",{children:"159"}),e.jsx("small",{children:"68% accuracy"})]}),e.jsxs("div",{className:"is-current",children:[e.jsx("i",{children:"06"}),e.jsx("b",{children:"168"}),e.jsx("small",{children:"72% accuracy"})]})]})]}),Ni=()=>e.jsxs("div",{className:"product-canvas product-analytics-view",children:[e.jsxs("div",{className:"product-view-heading",children:[e.jsxs("div",{children:[e.jsx("span",{className:"product-kicker",children:"This week"}),e.jsx("h3",{children:"Study balance"})]}),e.jsx("span",{className:"analytics-total",children:"23h 40m"})]}),e.jsx("div",{className:"analytics-chart","aria-label":"Weekly study time bar chart",children:[42,68,53,86,72,48,64].map((s,t)=>e.jsx("i",{style:{height:`${s}%`},children:e.jsx("span",{children:["M","T","W","T","F","S","S"][t]})},t))}),e.jsxs("div",{className:"analytics-summary",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Question pace"}),e.jsx("strong",{children:"31 / hour"}),e.jsx("small",{children:"up from last week"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Task completion"}),e.jsx("strong",{children:"82%"}),e.jsx("small",{children:"18 of 22 tasks"})]}),e.jsxs("div",{children:[e.jsx("span",{children:"Needs attention"}),e.jsx("strong",{children:"Mathematics"}),e.jsx("small",{children:"lowest time share"})]})]}),e.jsxs("div",{className:"analytics-detail-row",children:[e.jsxs("div",{children:[e.jsx("span",{children:"Subject split"}),e.jsx("i",{children:e.jsx("b",{style:{width:"43%"}})}),e.jsx("small",{children:"Physics 43% · Chemistry 34% · Maths 23%"})]}),e.jsxs("div",{className:"study-heatmap",children:[e.jsx("span",{children:"Study consistency"}),e.jsx("div",{children:Array.from({length:28},(s,t)=>e.jsx("i",{className:`level-${(t*7+3)%5}`},t))})]})]})]}),_i=()=>e.jsxs("div",{className:"product-canvas product-community-view",children:[e.jsxs("div",{className:"product-view-heading",children:[e.jsxs("div",{children:[e.jsx("span",{className:"product-kicker",children:"Community hub"}),e.jsx("h3",{children:"Study with people who show up."})]}),e.jsx("span",{className:"presence-dot",children:"Online"})]}),e.jsxs("div",{className:"community-columns",children:[e.jsxs("div",{className:"community-groups",children:[e.jsx("span",{children:"Your groups"}),["JEE 2026","Morning focus room","IsotopeTards"].map((s,t)=>e.jsxs("div",{children:[e.jsx("span",{children:s.slice(0,1)}),e.jsx("strong",{children:s}),e.jsxs("small",{children:[[8,14,17][t]," members"]}),e.jsx(Q,{})]},s))]}),e.jsxs("div",{className:"community-challenge",children:[e.jsx("span",{children:"Active challenge"}),e.jsx("strong",{children:"Momentum Builder"}),e.jsx("small",{children:"Build 30 focused hours this week."}),e.jsx("div",{children:e.jsx("i",{style:{width:"73%"}})}),e.jsx("b",{children:"21h 54m / 30h"})]}),e.jsxs("div",{className:"community-rank",children:[e.jsx("span",{children:"Group leaderboard"}),[["01","Aryaman","7h 32m"],["02","Shrey","4h 15m"],["03","Sankar","3h 48m"]].map(s=>e.jsxs("div",{children:[e.jsx("b",{children:s[0]}),e.jsx("strong",{children:s[1]}),e.jsx("small",{children:s[2]})]},s[0]))]})]}),e.jsxs("div",{className:"community-activity-row",children:[e.jsxs("div",{children:[e.jsx(Ke,{}),e.jsxs("span",{children:[e.jsx("b",{children:"Announcement"})," Sunday mock discussion starts at 7 PM."]})]}),e.jsxs("div",{children:[e.jsx(J,{}),e.jsxs("span",{children:[e.jsx("b",{children:"Live room"})," 14 students are focusing now."]})]}),e.jsxs("div",{children:[e.jsx(Q,{}),e.jsxs("span",{children:[e.jsx("b",{children:"New chat"})," 6 messages in JEE 2026."]})]})]})]}),Ii=({viewId:s})=>{switch(s){case"focus":return e.jsx(fi,{});case"syllabus":return e.jsx(wi,{});case"exams":return e.jsx(Mi,{});case"analytics":return e.jsx(Ni,{});case"community":return e.jsx(_i,{});default:return e.jsx(ji,{})}},J1=()=>{const[s,t]=m.useState(f[0].id),n=m.useId(),o=f.find(r=>r.id===s)??f[0],i=(r,u)=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(r.key))return;r.preventDefault();let d=u;r.key==="ArrowRight"&&(d=(u+1)%f.length),r.key==="ArrowLeft"&&(d=(u-1+f.length)%f.length),r.key==="Home"&&(d=0),r.key==="End"&&(d=f.length-1),t(f[d].id),document.getElementById(`${n}-${f[d].id}`)?.focus()};return e.jsxs("div",{className:"product-stage",children:[e.jsx("div",{className:"product-tabs",role:"tablist","aria-label":"Explore IsotopeAI",children:f.map((r,u)=>{const d=r.icon,g=s===r.id;return e.jsxs("button",{id:`${n}-${r.id}`,type:"button",role:"tab","aria-selected":g,"aria-controls":`${n}-panel`,tabIndex:g?0:-1,className:g?"is-active":"",onClick:()=>t(r.id),onKeyDown:p=>i(p,u),children:[e.jsx(d,{"aria-hidden":"true"}),e.jsx("span",{children:r.shortLabel})]},r.id)})}),e.jsxs("div",{className:"product-window",children:[e.jsxs("div",{className:"product-window-bar","aria-hidden":"true",children:[e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{}),e.jsxs("b",{children:["isotopeai.in/",o.id]})]}),e.jsxs("div",{className:"product-window-body",children:[e.jsx(bi,{activeId:s}),e.jsx("div",{id:`${n}-panel`,role:"tabpanel","aria-labelledby":`${n}-${s}`,className:"product-panel",children:e.jsx(Ii,{viewId:s})})]})]}),e.jsxs("p",{className:"product-caption",children:[e.jsxs("strong",{children:[o.label,"."]})," ",o.description]})]})},T=[{title:"Dashboard",description:"See today’s tasks, study progress, streaks and the next exam together.",path:"/dashboard",imageSrc:"/screenshots/showcase/dashboard-1440.webp",icon:de},{title:"Focus Timer",description:"Run a focused session with the task, subject and chapter already attached.",path:"/focus",imageSrc:"/screenshots/showcase/focus-1440.webp",icon:uo},{title:"Syllabus",description:"Map subjects, chapters and topics, then see what is complete or due.",path:"/syllabus",imageSrc:"/screenshots/showcase/syllabus-1440.webp",icon:H},{title:"Tasks",description:"Plan revision, practice and mock review with boards, lists and a calendar.",path:"/tasks",imageSrc:"/screenshots/showcase/tasks-1440.webp",icon:he},{title:"Study Planner",description:"See exam countdowns, syllabus coverage and your study calendar in one place.",path:"/study",imageSrc:"/screenshots/showcase/study-1440.webp",icon:R},{title:"Exams",description:"Keep D-Day, mapped syllabus, mocks and exam progress in one view.",path:"/exams",imageSrc:"/screenshots/showcase/exams-1440.webp",icon:ce},{title:"Analytics",description:"Review study time, questions, focus quality and subject performance.",path:"/analytics",imageSrc:"/screenshots/showcase/analytics-1440.webp",icon:V},{title:"Community",description:"Find groups, challenges, leaderboards, events and shared accountability.",path:"/community",imageSrc:"/screenshots/showcase/community-1440.webp",icon:J},{title:"Settings",description:"Control appearance, notifications, storage, sync and study preferences.",path:"/settings",imageSrc:"/screenshots/showcase/settings-1440.webp",icon:zn}],ne=({screen:s,priority:t=!1})=>e.jsxs("div",{className:"real-screen-image",children:[e.jsxs("div",{className:"real-screen-fallback",children:[e.jsx(s.icon,{"aria-hidden":"true"}),e.jsxs("span",{children:[s.title," screen"]})]}),e.jsx("img",{src:s.imageSrc,srcSet:`${s.imageSrc.replace("-1440.webp","-720.webp")} 720w, ${s.imageSrc} 1440w`,sizes:"(max-width: 820px) calc(100vw - 40px), 900px",alt:`IsotopeAI ${s.title} product screen`,width:"1440",height:"900",loading:t?"eager":"lazy",fetchPriority:t?"high":"auto",decoding:"async",referrerPolicy:"no-referrer",onError:n=>{n.currentTarget.style.display="none"}})]}),W1=()=>{const[s,t]=m.useState(0),n=T[s],o=m.useMemo(()=>[1,2].map(i=>T[(s+i)%T.length]),[s]);return e.jsx("section",{className:"marketing-section real-product-section",id:"real-product","aria-labelledby":"real-product-heading",children:e.jsxs("div",{className:"marketing-shell",children:[e.jsxs("div",{className:"section-heading real-product-heading",children:[e.jsxs("div",{children:[e.jsx("span",{className:"section-index",children:"REAL PRODUCT SCREENS"}),e.jsx("h2",{id:"real-product-heading",children:"See the actual IsotopeAI workspace."})]}),e.jsx("p",{children:"Fresh screenshots from the live demo workspace. Pick any area to see how IsotopeAI looks while you plan, study and review your preparation."})]}),e.jsx("div",{className:"real-product-selector",role:"tablist","aria-label":"Choose a product screen",children:T.map((i,r)=>{const u=i.icon;return e.jsxs("button",{type:"button",role:"tab","aria-selected":s===r,className:s===r?"is-active":"",onClick:()=>t(r),children:[e.jsx(u,{"aria-hidden":"true"}),e.jsx("span",{children:i.title})]},i.title)})}),e.jsxs("div",{className:"real-product-gallery",children:[e.jsxs("article",{className:"real-screen-featured",role:"tabpanel",children:[e.jsxs("div",{className:"real-browser-bar","aria-hidden":"true",children:[e.jsx("i",{}),e.jsx("i",{}),e.jsx("i",{}),e.jsxs("span",{children:["isotopeai.in",n.path]}),e.jsx("b",{children:"REAL SCREEN"})]}),e.jsx(ne,{screen:n},n.title),e.jsxs("div",{className:"real-screen-caption",children:[e.jsxs("span",{children:[String(s+1).padStart(2,"0")," / ",T.length]}),e.jsxs("div",{children:[e.jsx("h3",{children:n.title}),e.jsx("p",{children:n.description})]}),e.jsx(v,{to:"/demo",children:"Open the demo"})]})]}),e.jsx("div",{className:"real-screen-previews","aria-label":"Next product screens",children:o.map(i=>{const r=T.findIndex(u=>u.title===i.title);return e.jsxs("button",{type:"button",onClick:()=>t(r),children:[e.jsx(ne,{screen:i}),e.jsxs("span",{children:[e.jsx("b",{children:i.title}),"View screen"]})]},i.title)})})]})]})})},G1=()=>e.jsx("section",{className:"border-b border-[var(--mk-line-strong)] py-20 sm:py-24 lg:py-32","aria-labelledby":"tasks-spotlight-heading",children:e.jsxs("div",{className:"marketing-shell grid items-center gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20",children:[e.jsxs("div",{children:[e.jsx("p",{className:"font-mono text-[0.69rem] font-extrabold tracking-[0.14em] text-[var(--mk-blue)] uppercase",children:"Feature guide · Tasks"}),e.jsxs("h2",{id:"tasks-spotlight-heading",className:"mt-4 max-w-2xl font-[var(--mk-display)] text-4xl leading-[0.98] font-medium tracking-[-0.04em] sm:text-5xl lg:text-6xl",children:["The task list remembers"," ",e.jsx("em",{className:"text-[var(--mk-blue)]",children:"what the work belongs to."})]}),e.jsx("p",{className:"mt-6 max-w-xl leading-7 text-[var(--mk-muted)]",children:"Plan by subject, chapter, topic, exam, effort and energy. Then see the same task in Today, start it in Focus, and review the result in Analytics."}),e.jsxs(v,{to:"/features/student-task-manager",className:"mt-7 inline-flex min-h-11 items-center gap-2 border-b border-[var(--mk-line-strong)] font-extrabold",children:["Explore every Tasks feature ",e.jsx(N,{className:"h-4 w-4","aria-hidden":"true"})]}),e.jsxs("div",{className:"mt-8 grid gap-3 text-sm font-bold sm:grid-cols-2",children:[e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx(b,{className:"h-4 w-4 text-[var(--mk-green)]"})," Five task views"]}),e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx(b,{className:"h-4 w-4 text-[var(--mk-green)]"})," Habits and recurrence"]}),e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx(b,{className:"h-4 w-4 text-[var(--mk-green)]"})," Calendar time slots"]}),e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx(b,{className:"h-4 w-4 text-[var(--mk-green)]"})," Offline edits and undo"]})]})]}),e.jsxs("div",{className:"border border-[var(--mk-line-strong)] bg-[var(--mk-paper-raised)] shadow-[12px_14px_0_var(--mk-paper-deep)]",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-[var(--mk-line-strong)] bg-[var(--mk-ink)] px-4 py-3 font-mono text-[0.65rem] font-bold tracking-wider text-[var(--mk-paper-raised)]",children:[e.jsx("span",{children:"WED 15 JUL · TASK PLAN"}),e.jsx("span",{children:"3H 20M / 4H 30M"})]}),e.jsxs("div",{className:"grid sm:grid-cols-[110px_1fr]",children:[e.jsxs("div",{className:"hidden border-r border-[var(--mk-line)] p-5 sm:block",children:[e.jsx(gt,{className:"h-5 w-5 text-[var(--mk-blue)]"}),e.jsx("p",{className:"mt-10 font-mono text-[0.62rem] tracking-wider text-[var(--mk-muted)]",children:"VIEW"}),e.jsx("strong",{className:"mt-2 block font-[var(--mk-display)] text-2xl font-medium",children:"Week"}),e.jsx("p",{className:"mt-8 font-mono text-[0.62rem] tracking-wider text-[var(--mk-muted)]",children:"OPEN"}),e.jsx("strong",{className:"mt-2 block font-[var(--mk-display)] text-2xl font-medium",children:"08"})]}),e.jsxs("div",{className:"space-y-2 p-4 sm:p-6",children:[[["P1","Physics · Electrostatics","Revise Gauss’s law examples","25 min"],["P2","Chemistry · Organic","Solve conversion practice set","45 min"],["P2","Mock 08 · Review","Turn mistakes into revision work","30 min"]].map(([s,t,n,o],i)=>e.jsxs("div",{className:`grid grid-cols-[auto_1fr_auto] items-center gap-3 border p-3 ${i===0?"border-[var(--mk-blue)]":"border-[var(--mk-line)]"}`,children:[e.jsx("span",{className:"self-start font-mono text-[0.61rem] font-black text-[var(--mk-orange)]",children:s}),e.jsxs("div",{children:[e.jsx("span",{className:"font-mono text-[0.59rem] tracking-wide text-[var(--mk-muted)] uppercase",children:t}),e.jsx("strong",{className:"mt-1 block text-sm leading-snug",children:n}),e.jsxs("small",{className:"mt-1 block text-[var(--mk-muted)]",children:[o," · linked study context"]})]}),i===0?e.jsx(Ss,{className:"h-4 w-4 text-[var(--mk-blue)]"}):e.jsx(Fs,{className:"h-4 w-4 text-[var(--mk-muted)]"})]},n)),e.jsxs("div",{className:"mt-4 flex items-center justify-between border-t border-[var(--mk-line)] pt-4 text-xs font-bold",children:[e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx(R,{className:"h-4 w-4 text-[var(--mk-blue)]"})," Put these tasks into the week"]}),e.jsx(N,{className:"h-4 w-4"})]})]})]})]})]})}),Z1=()=>e.jsx("section",{className:"marketing-section study-home-spotlight","aria-labelledby":"study-home-heading",children:e.jsxs("div",{className:"marketing-shell study-home-grid",children:[e.jsxs("div",{className:"study-home-copy",children:[e.jsx("span",{children:"FEATURE GUIDE / STUDY"}),e.jsx("h2",{id:"study-home-heading",children:"Plan the whole exam from one working desk."}),e.jsx("p",{children:"Study puts exam dates, syllabus coverage, focused time, revision, mock results, and your next seven days beside each other. Use it to see the full preparation picture before you choose the next task."}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx(b,{})," JEE and NEET syllabus templates"]}),e.jsxs("li",{children:[e.jsx(b,{})," Calendar with tasks, exams, focus, and questions"]}),e.jsxs("li",{children:[e.jsx(b,{})," Recall queue, revision schedule, and mock analysis"]})]}),e.jsxs(v,{to:"/features/study-planner",children:["Explore the complete Study planner ",e.jsx(N,{"aria-hidden":"true"})]})]}),e.jsxs("div",{className:"study-home-desk","aria-label":"Study planner overview",children:[e.jsxs("div",{className:"study-home-desk-head",children:[e.jsx("span",{children:"JEE MAIN · PREPARATION REGISTER"}),e.jsx("b",{children:"15 JUL 2026"})]}),e.jsxs("div",{className:"study-home-countdown",children:[e.jsxs("div",{children:[e.jsx("small",{children:"NEXT MOCK"}),e.jsx("strong",{children:"Mock 08"}),e.jsx("span",{children:"22 July · 09:00"})]}),e.jsx("b",{children:"D−07"})]}),e.jsxs("div",{className:"study-home-signals",children:[e.jsxs("article",{children:[e.jsx(q,{}),e.jsxs("span",{children:[e.jsx("b",{children:"63%"}),e.jsx("small",{children:"Syllabus covered"})]})]}),e.jsxs("article",{children:[e.jsx(F,{}),e.jsxs("span",{children:[e.jsx("b",{children:"114h"}),e.jsx("small",{children:"Focused by subject"})]})]}),e.jsxs("article",{children:[e.jsx(ie,{}),e.jsxs("span",{children:[e.jsx("b",{children:"6"}),e.jsx("small",{children:"Reviews due today"})]})]}),e.jsxs("article",{children:[e.jsx(R,{}),e.jsxs("span",{children:[e.jsx("b",{children:"3"}),e.jsx("small",{children:"Dated tasks left"})]})]})]}),e.jsxs("div",{className:"study-home-next",children:[e.jsx("span",{children:"TODAY / NEXT USEFUL MOVE"}),e.jsx("strong",{children:"Review electrostatics errors from Mock 07."}),e.jsx("small",{children:"Physics · 25 min · 12 questions marked for review"})]})]})]})}),Q1=()=>e.jsx("section",{className:"border-y border-[var(--mk-line-strong)] bg-[var(--mk-paper-raised)]","aria-labelledby":"today-feature-spotlight-heading",children:e.jsxs("div",{className:"marketing-shell grid lg:grid-cols-[0.92fr_1.08fr]",children:[e.jsxs("div",{className:"border-b border-[var(--mk-line)] py-14 pr-0 sm:py-20 lg:border-b-0 lg:border-r lg:pr-16",children:[e.jsx("span",{className:"section-index",children:"FEATURE GUIDE / 01"}),e.jsx("h2",{id:"today-feature-spotlight-heading",className:"mt-5 max-w-[13ch] font-[var(--mk-display)] text-[clamp(2.4rem,5vw,4.8rem)] font-semibold leading-[0.94] tracking-[-0.055em]",children:"Start with the whole day in view."}),e.jsx("p",{className:"mt-7 max-w-xl text-base leading-7 text-[var(--mk-muted)] sm:text-lg sm:leading-8",children:"Today is the working front page of IsotopeAI. It brings the next task, active exam, syllabus pace, focused time, upcoming work and useful warnings into one calm brief."}),e.jsxs(v,{to:"/features/today-dashboard",className:"marketing-button marketing-button-primary mt-8",children:["Explore the Today dashboard ",e.jsx(N,{"aria-hidden":"true"})]})]}),e.jsxs("div",{className:"py-10 pl-0 sm:py-14 lg:pl-16",children:[e.jsxs("div",{className:"mb-5 flex items-center justify-between gap-4 border-b border-[var(--mk-line)] pb-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--mk-muted)]",children:[e.jsx("span",{children:"What it keeps together"}),e.jsx("span",{children:"Live product guide"})]}),e.jsx("ol",{className:"divide-y divide-[var(--mk-line)]",children:[[qa,"The next useful task","Continue the work already in progress or start a planned task with its study context attached."],[F,"The real shape of today","Compare planned time, focused time, work left, completed tasks and your daily capacity."],[qs,"Signals worth acting on","See overdue work, revision dates, mock review gaps, subject imbalance and exam pace with evidence."],[$n,"A route into the whole workspace","Search tasks, subjects, chapters and exams, then move into Focus, Syllabus, Tasks or Analytics."]].map(([s,t,n],o)=>{const i=s;return e.jsxs("li",{className:"grid gap-4 py-5 sm:grid-cols-[42px_0.58fr_1fr] sm:items-start",children:[e.jsx("span",{className:"flex h-10 w-10 items-center justify-center border border-[var(--mk-line-strong)] text-[var(--mk-orange)]",children:e.jsx(i,{className:"h-4 w-4","aria-hidden":"true"})}),e.jsx("strong",{className:"text-base leading-6",children:String(t)}),e.jsx("span",{className:"text-sm leading-6 text-[var(--mk-muted)]",children:String(n)})]},String(t))})})]})]})}),K1=()=>e.jsx("section",{className:"border-b border-[var(--mk-line-strong)] bg-[var(--mk-paper-deep)] py-20 sm:py-24 lg:py-32","aria-labelledby":"analytics-spotlight-heading",children:e.jsxs("div",{className:"marketing-shell grid items-center gap-12 lg:grid-cols-[1.18fr_0.82fr] lg:gap-20",children:[e.jsxs("div",{className:"border border-[var(--mk-line-strong)] bg-[var(--mk-paper-raised)] shadow-[14px_16px_0_color-mix(in_srgb,var(--mk-blue)_10%,transparent)]",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-[var(--mk-line-strong)] bg-[var(--mk-ink)] px-4 py-3 font-mono text-[0.62rem] font-bold tracking-wider text-[var(--mk-paper-raised)]",children:[e.jsx("span",{children:"WEEK 29 · STUDY REVIEW"}),e.jsxs("span",{className:"flex items-center gap-2 text-[#a6dd43]",children:[e.jsx(go,{className:"h-3.5 w-3.5","aria-hidden":"true"})," +12%"]})]}),e.jsxs("div",{className:"grid border-b border-[var(--mk-line)] sm:grid-cols-2",children:[e.jsxs("div",{className:"border-b border-[var(--mk-line)] p-6 sm:border-r sm:border-b-0 lg:p-8",children:[e.jsx("span",{className:"font-mono text-[0.62rem] tracking-wider text-[var(--mk-muted)] uppercase",children:"Focused this week"}),e.jsx("strong",{className:"mt-5 block font-[var(--mk-display)] text-6xl leading-none font-medium tracking-[-0.06em] sm:text-7xl",children:"42h"}),e.jsx("p",{className:"mt-3 text-sm text-[var(--mk-muted)]",children:"18 sessions · 84% efficiency"})]}),e.jsxs("div",{className:"p-6 lg:p-8",children:[e.jsx("span",{className:"font-mono text-[0.62rem] tracking-wider text-[var(--mk-muted)] uppercase",children:"Strongest signal"}),e.jsx("strong",{className:"mt-5 block font-[var(--mk-display)] text-3xl leading-tight font-medium",children:"Physics time is up. Organic accuracy still needs work."})]})]}),e.jsxs("div",{className:"grid grid-cols-[auto_1fr_auto] items-center gap-3 p-4 text-sm sm:px-6",children:[e.jsx(V,{className:"h-4 w-4 text-[var(--mk-blue)]","aria-hidden":"true"}),e.jsx("span",{className:"font-bold",children:"Hours → questions → weak chapter → next revision task"}),e.jsx(N,{className:"h-4 w-4","aria-hidden":"true"})]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"font-mono text-[0.69rem] font-extrabold tracking-[0.14em] text-[var(--mk-blue)] uppercase",children:"Feature guide · Analytics"}),e.jsxs("h2",{id:"analytics-spotlight-heading",className:"mt-4 max-w-2xl font-[var(--mk-display)] text-4xl leading-[0.98] font-medium tracking-[-0.04em] sm:text-5xl lg:text-6xl",children:["See what the work is ",e.jsx("em",{className:"text-[var(--mk-blue)]",children:"actually changing."})]}),e.jsx("p",{className:"mt-6 max-w-xl leading-7 text-[var(--mk-muted)]",children:"Review focus time, questions, tasks, subjects, chapters, mocks, breaks and study patterns. Then turn the useful signal into the next decision."}),e.jsxs(v,{to:"/features/study-analytics",className:"mt-7 inline-flex min-h-11 items-center gap-2 border-b border-[var(--mk-line-strong)] font-extrabold",children:["Explore every Analytics feature ",e.jsx(N,{className:"h-4 w-4","aria-hidden":"true"})]}),e.jsxs("div",{className:"mt-8 grid gap-3 text-sm font-bold sm:grid-cols-2",children:[e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx(b,{className:"h-4 w-4 text-[var(--mk-green)]"})," Daily to yearly reports"]}),e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx(b,{className:"h-4 w-4 text-[var(--mk-green)]"})," Question and mock signals"]}),e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx(b,{className:"h-4 w-4 text-[var(--mk-green)]"})," Custom dashboard layout"]}),e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx(b,{className:"h-4 w-4 text-[var(--mk-green)]"})," Shareable study editions"]})]})]})]})}),Ei=[{id:"command",label:"Command desk",note:"Exams, coverage, plan"},{id:"calendar",label:"Study calendar",note:"Dates, work, focus"},{id:"recall",label:"Recall queue",note:"Reviews and mastery"},{id:"results",label:"Mock results",note:"Scores and weak areas"}],Ai=()=>e.jsxs("div",{className:"study-preview-command","aria-label":"Example Study command desk",children:[e.jsxs("article",{className:"study-command-exams",children:[e.jsxs("div",{className:"study-preview-card-title",children:[e.jsx(R,{"aria-hidden":"true"}),e.jsx("span",{children:"Exam countdown"}),e.jsx("b",{children:"2 ACTIVE"})]}),e.jsxs("div",{className:"study-exam-slip is-urgent",children:[e.jsxs("div",{children:[e.jsx("strong",{children:"JEE Main · Mock 08"}),e.jsx("span",{children:"22 July 2026"})]}),e.jsxs("p",{children:[e.jsx("b",{children:"07"})," days"]})]}),e.jsxs("div",{className:"study-exam-slip",children:[e.jsxs("div",{children:[e.jsx("strong",{children:"JEE Main"}),e.jsx("span",{children:"28 January 2027"})]}),e.jsxs("p",{children:[e.jsx("b",{children:"197"})," days"]})]})]}),e.jsxs("article",{className:"study-command-coverage",children:[e.jsxs("div",{className:"study-preview-card-title",children:[e.jsx(q,{"aria-hidden":"true"}),e.jsx("span",{children:"Syllabus coverage"}),e.jsx("b",{children:"63%"})]}),[["Physics","72%","42 / 58 topics","38h 20m"],["Chemistry","61%","39 / 64 topics","34h 05m"],["Mathematics","56%","35 / 62 topics","41h 40m"]].map(([s,t,n,o])=>e.jsxs("div",{className:"study-coverage-row",children:[e.jsxs("div",{children:[e.jsx("strong",{children:s}),e.jsx("b",{children:t})]}),e.jsx("i",{children:e.jsx("span",{style:{width:t}})}),e.jsxs("small",{children:[n," ",e.jsx("em",{children:"·"})," ",o," focused"]})]},s))]}),e.jsxs("article",{className:"study-command-plan",children:[e.jsxs("div",{className:"study-preview-card-title",children:[e.jsx(Zn,{"aria-hidden":"true"}),e.jsx("span",{children:"Seven-day plan"}),e.jsx("b",{children:"UPDATED"})]}),e.jsx("h3",{children:"Make the mock useful before taking another one."}),e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"01"}),e.jsx("span",{children:"Review missed electrostatics questions."})]}),e.jsxs("li",{children:[e.jsx("b",{children:"02"}),e.jsx("span",{children:"Finish the pending organic reaction map."})]}),e.jsxs("li",{children:[e.jsx("b",{children:"03"}),e.jsx("span",{children:"Run a timed calculus practice block."})]})]}),e.jsxs("span",{className:"study-preview-action",children:["Open full plan ",e.jsx(_a,{})]})]})]}),Si=()=>{const s=Array.from({length:21},(t,n)=>n+7);return e.jsxs("div",{className:"study-preview-calendar","aria-label":"Example connected Study calendar",children:[e.jsxs("div",{className:"study-calendar-sheet",children:[e.jsxs("div",{className:"study-calendar-heading",children:[e.jsxs("div",{children:[e.jsx("small",{children:"STUDY CALENDAR"}),e.jsx("h3",{children:"July 2026"})]}),e.jsx("span",{children:"Tasks · exams · focused time"})]}),e.jsx("div",{className:"study-calendar-weekdays","aria-hidden":"true",children:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(t=>e.jsx("span",{children:t},t))}),e.jsx("div",{className:"study-calendar-grid",children:s.map(t=>{const n=t===15,o=t===22,i=t%5;return e.jsxs("div",{className:`${n?"is-selected":""} ${o?"has-exam":""}`,children:[e.jsx("b",{children:t}),t<23&&e.jsx("i",{style:{opacity:.14+i*.14}}),t%3===0&&e.jsx("span",{children:t%2===0?"2 tasks":"Focus"}),o&&e.jsx("em",{children:"MOCK 08"})]},t)})})]}),e.jsxs("aside",{className:"study-day-brief",children:[e.jsx("small",{children:"WEDNESDAY · 15 JULY"}),e.jsx("h3",{children:"A full day, still readable."}),e.jsxs("div",{className:"study-day-total",children:[e.jsx(F,{"aria-hidden":"true"}),e.jsxs("span",{children:[e.jsx("b",{children:"3h 20m"})," focused"]}),e.jsx("strong",{children:"42 questions"})]}),e.jsxs("div",{className:"study-day-item is-task",children:[e.jsx("i",{}),e.jsxs("div",{children:[e.jsx("small",{children:"TASK · PHYSICS"}),e.jsx("strong",{children:"Review Gauss’s law errors"}),e.jsx("span",{children:"25 min planned · P1"})]})]}),e.jsxs("div",{className:"study-day-item is-session",children:[e.jsx("i",{}),e.jsxs("div",{children:[e.jsx("small",{children:"FOCUS · CHEMISTRY"}),e.jsx("strong",{children:"Organic conversions"}),e.jsx("span",{children:"1h 10m · 26 questions"})]})]}),e.jsxs("div",{className:"study-day-actions",children:[e.jsx("span",{children:"+ Task on this date"}),e.jsx("span",{children:"+ Exam on this date"})]})]})]})},Ti=()=>e.jsxs("div",{className:"study-preview-recall","aria-label":"Example RecallMaster review queue",children:[e.jsxs("aside",{className:"study-recall-summary",children:[e.jsx(ie,{"aria-hidden":"true"}),e.jsx("small",{children:"RECALLMASTER"}),e.jsx("strong",{children:"6 due today"}),e.jsx("p",{children:"Review the topic, reveal what you remember, then rate the recall."}),e.jsxs("div",{children:[e.jsx("span",{children:"Retention target"}),e.jsx("b",{children:"90%"})]}),e.jsx("i",{children:e.jsx("span",{})})]}),e.jsxs("div",{className:"study-recall-sheet",children:[e.jsxs("div",{className:"study-recall-question",children:[e.jsx("span",{children:"PHYSICS · ELECTROSTATICS"}),e.jsx("h3",{children:"Why is the electric field inside a conductor zero at equilibrium?"}),e.jsx("p",{children:"Recall the explanation before revealing your notes."})]}),e.jsxs("div",{className:"study-recall-ratings","aria-label":"Example recall ratings",children:[e.jsxs("span",{children:[e.jsx("b",{children:"Again"}),e.jsx("small",{children:"1 day"})]}),e.jsxs("span",{children:[e.jsx("b",{children:"Hard"}),e.jsx("small",{children:"3 days"})]}),e.jsxs("span",{className:"is-picked",children:[e.jsx("b",{children:"Good"}),e.jsx("small",{children:"7 days"})]}),e.jsxs("span",{children:[e.jsx("b",{children:"Easy"}),e.jsx("small",{children:"14 days"})]})]}),e.jsxs("div",{className:"study-recall-next",children:[e.jsx(le,{"aria-hidden":"true"}),e.jsxs("span",{children:[e.jsx("b",{children:"Up next"})," Chemical bonding · Hybridisation"]}),e.jsx("strong",{children:"Mastery 80%"})]})]})]}),$i=()=>e.jsxs("div",{className:"study-preview-results","aria-label":"Example Study mock result analysis",children:[e.jsxs("div",{className:"study-results-lead",children:[e.jsx("small",{children:"RECENT PERFORMANCE"}),e.jsx("strong",{children:"164 / 300"}),e.jsx("span",{children:"Mock 07 · 55%"}),e.jsx("p",{children:"The score matters. The subject split shows what to change next."})]}),e.jsx("div",{className:"study-results-subjects",children:[["Physics",68,"68%"],["Chemistry",57,"57%"],["Mathematics",41,"41%"]].map(([s,t,n])=>e.jsxs("div",{children:[e.jsxs("span",{children:[e.jsx("b",{children:s}),e.jsx("strong",{children:n})]}),e.jsx("i",{children:e.jsx("em",{style:{width:`${t}%`}})})]},s))}),e.jsxs("div",{className:"study-results-history",children:[e.jsxs("div",{className:"study-preview-card-title",children:[e.jsx(V,{"aria-hidden":"true"}),e.jsx("span",{children:"Last three results"}),e.jsx("b",{children:"+7 PTS"})]}),[["Mock 07","55%","164 / 300"],["Mock 06","51%","153 / 300"],["Mock 05","48%","144 / 300"]].map(([s,t,n],o)=>e.jsxs("div",{className:o===0?"is-latest":"",children:[e.jsx(sa,{"aria-hidden":"true"}),e.jsxs("span",{children:[e.jsx("b",{children:s}),e.jsx("small",{children:n})]}),e.jsx("strong",{children:t})]},s))]})]}),X1=()=>{const[s,t]=m.useState("command");return e.jsxs("div",{className:"study-product-stage",children:[e.jsxs("div",{className:"study-stage-bar",children:[e.jsxs("span",{children:[e.jsx("i",{})," ISOTOPEAI / STUDY"]}),e.jsx("span",{children:"CONNECTED EXAM WORKSPACE"})]}),e.jsx("div",{className:"study-stage-tabs","aria-label":"Study product preview",children:Ei.map(n=>e.jsxs("button",{type:"button",className:s===n.id?"is-active":"","aria-pressed":s===n.id,onClick:()=>t(n.id),children:[e.jsx("span",{children:n.label}),e.jsx("small",{children:n.note})]},n.id))}),e.jsxs("div",{className:"study-stage-body",children:[s==="command"&&e.jsx(Ai,{}),s==="calendar"&&e.jsx(Si,{}),s==="recall"&&e.jsx(Ti,{}),s==="results"&&e.jsx($i,{})]}),e.jsxs("div",{className:"study-stage-caption",children:[e.jsx(b,{"aria-hidden":"true"}),e.jsx("span",{children:"Built from the real Study workflow. Example data is used to explain the interface."})]})]})},S=pi(),k=(s,t)=>{if(!t)return;const n=s.name?`meta[name="${s.name}"]`:`meta[property="${s.property}"]`;let o=document.head.querySelector(n);o||(o=document.createElement("meta"),s.name&&o.setAttribute("name",s.name),s.property&&o.setAttribute("property",s.property),document.head.appendChild(o)),o.setAttribute("content",t)},qi=(s,t)=>{let n=document.head.querySelector(`link[rel="${s}"]`);n||(n=document.createElement("link"),n.setAttribute("rel",s),document.head.appendChild(n)),n.setAttribute("href",t)},Ci=s=>{document.querySelectorAll('script[data-seo-structured-data="true"]').forEach(t=>t.remove()),s.forEach((t,n)=>{const o=document.createElement("script");o.type="application/ld+json",o.dataset.seoStructuredData="true",o.id=`seo-structured-data-${n}`,o.text=JSON.stringify(t),document.head.appendChild(o)})},el=()=>{const s=B();return m.useEffect(()=>{const t=hi(s.pathname),n=y(t.canonicalPath),o=t.keywords??xe;document.title=t.title,document.documentElement.lang="en",k({name:"description"},t.description),k({name:"keywords"},o.join(", ")),k({name:"robots"},t.robots),k({name:"googlebot"},t.robots),k({name:"author"},$),k({property:"og:type"},t.ogType),k({property:"og:site_name"},$),k({property:"og:locale"},"en_IN"),k({property:"og:title"},t.title),k({property:"og:description"},t.description),k({property:"og:url"},n),k({property:"og:image"},S.url),k({property:"og:image:secure_url"},S.url),k({property:"og:image:alt"},S.alt),k({property:"og:image:width"},S.width),k({property:"og:image:height"},S.height),k({name:"twitter:card"},"summary_large_image"),k({name:"twitter:title"},t.title),k({name:"twitter:description"},t.description),k({name:"twitter:url"},n),k({name:"twitter:image"},S.url),k({name:"twitter:image:alt"},S.alt),qi("canonical",n),Ci(t.structuredData)},[s.pathname]),null},Li=s=>s==="/"||s==="/about"||s==="/privacy"||s==="/terms"||s.startsWith("/features/"),al=()=>{const{pathname:s,hash:t}=B();return m.useEffect(()=>{if(!Li(s)||t)return;const n=window.requestAnimationFrame(()=>{window.scrollTo({top:0,left:0,behavior:"auto"})});return()=>window.cancelAnimationFrame(n)},[t,s]),null};export{Ne as $,N as A,nr as B,_a as C,Yr as D,tc as E,Xr as F,jc as G,re as H,kc as I,pc as J,sc as K,Kc as L,al as M,Gi as N,Qc as O,Cd as P,fr as Q,Dd as R,el as S,q as T,M1 as U,Gc as V,jd as W,pe as X,k1 as Y,Yd as Z,xi as _,U1 as a,J1 as a$,s1 as a0,Gr as a1,Bd as a2,Yc as a3,ie as a4,P1 as a5,q1 as a6,v1 as a7,y1 as a8,Od as a9,t1 as aA,pr as aB,is as aC,r1 as aD,Jc as aE,go as aF,N1 as aG,Tc as aH,gr as aI,Q as aJ,zn as aK,_r as aL,wc as aM,cc as aN,yn as aO,Qi as aP,Jd as aQ,cr as aR,Ic as aS,Nc as aT,O1 as aU,W1 as aV,F1 as aW,Q1 as aX,G1 as aY,Z1 as aZ,K1 as a_,Td as aa,rd as ab,Vc as ac,zc as ad,Ec as ae,dc as af,Wr as ag,Ur as ah,Dr as ai,yr as aj,gd as ak,uc as al,dr as am,C1 as an,Sc as ao,uo as ap,Fs as aq,Ji as ar,ld as as,st as at,b1 as au,mr as av,sd as aw,po as ax,ir as ay,Er as az,b,Xo as b$,he as b0,R as b1,Hd as b2,qs as b3,Mr as b4,od as b5,Pr as b6,hd as b7,Zr as b8,gi as b9,Nd as bA,Bc as bB,T1 as bC,Or as bD,Hc as bE,Cr as bF,f1 as bG,Pd as bH,Ss as bI,Wo as bJ,Di as bK,rc as bL,Sr as bM,Hi as bN,Oc as bO,Go as bP,l1 as bQ,or as bR,sr as bS,vd as bT,Zo as bU,X1 as bV,Qo as bW,xd as bX,Fd as bY,oc as bZ,Zd as b_,H1 as ba,R1 as bb,V1 as bc,de as bd,g1 as be,Ir as bf,md as bg,n1 as bh,ii as bi,Y1 as bj,$1 as bk,le as bl,Id as bm,zd as bn,Hr as bo,er as bp,pd as bq,Lc as br,$c as bs,$d as bt,ec as bu,Ut as bv,Js as bw,L1 as bx,Jo as by,Vr as bz,J as c,S1 as c$,x1 as c0,yc as c1,Tt as c2,Rc as c3,nd as c4,Kr as c5,_c as c6,Wd as c7,p1 as c8,c1 as c9,xn as cA,cd as cB,kr as cC,Qd as cD,Bo as cE,e1 as cF,gc as cG,ye as cH,ue as cI,Uo as cJ,Oo as cK,Br as cL,Tr as cM,Xc as cN,fd as cO,wd as cP,Ed as cQ,Uc as cR,br as cS,xr as cT,hr as cU,Vi as cV,Wi as cW,Wc as cX,qr as cY,Lr as cZ,A1 as c_,ac as ca,Ad as cb,Fe as cc,Fi as cd,Zi as ce,h1 as cf,Vd as cg,Ud as ch,Pc as ci,rr as cj,sa as ck,zr as cl,Qr as cm,ur as cn,oo as co,_d as cp,Rd as cq,m1 as cr,vc as cs,kd as ct,ud as cu,Ri as cv,wr as cw,Ac as cx,vr as cy,xc as cz,F as d,bc as d0,dd as d1,ad as d2,bd as d3,d1 as d4,ic as d5,td as d6,Fc as d7,Ki as d8,Xi as d9,E1 as dA,lc as dB,Nr as dC,Rr as dD,ar as dE,qc as dF,D1 as dG,Mc as dH,nc as dI,Sd as da,_1 as db,ed as dc,I1 as dd,a1 as de,Cc as df,jr as dg,yd as dh,j1 as di,Md as dj,o1 as dk,Ld as dl,qd as dm,Xd as dn,hc as dp,i1 as dq,id as dr,w1 as ds,Ar as dt,fc as du,Bi as dv,u1 as dw,z1 as dx,mc as dy,Yi as dz,Jr as e,Kd as f,$n as g,ei as h,B1 as i,Oi as j,V as k,gt as l,Dc as m,lr as n,qa as o,Fr as p,Zn as q,H as r,$r as s,ce as t,be as u,tr as v,Zc as w,Gd as x,Ui as y,Ke as z};
