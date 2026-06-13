FILE IDENTITY

- original path: public/assets/analyticsWorker-BnmTlfYB.js
- audit path: audit/public/assets/analyticsWorker-BnmTlfYB.js.txt
- audited commit: 34c3836e45030eb67c4e0f0bf654d30db0509b89
- tracked or untracked: tracked (tracked)
- file type: code
- MIME type: text/javascript
- size in bytes: 147629
- SHA-256: c4e393d51d79bbc320c4b7c07e1f6fa0712b81a8e8c72eb76c640f6ea37f6f42
- text encoding when applicable: utf-8 or ascii-compatible text
- executable status: not executable
- generated/minified status: generated/built artifact
- primary subsystem: compiled frontend bundle
- primary auditor: compiled-frontend-agent
- review status: lead-generated; cross-cutting static review applied
- confidence: MEDIUM

PURPOSE

Built frontend asset emitted by the bundling pipeline; purpose is inferred from bundle name, imports, and consumers rather than hash alone.

ROLE IN THE APPLICATION

- subsystem: compiled frontend bundle
- runtime stage: browser/runtime or static serving
- user-visible feature: indirect or internal
- whether it is active: active or bundle-referenced
- whether it is generated: generated/built artifact
- whether it is comparison/reference material: not primarily
- whether it is legacy: no direct legacy-only signal
- whether it appears unused: not proven unused

REFERENCES AND CONSUMERS

Confirmed imports, importers, HTML references, CSS references, manifest references, service-worker references, script references, installer references, documentation references, filesystem reads, route consumers, and database consumers found by direct search:
- artifacts/asset-diff/asset-report.json:2764 - "file": "analyticsWorker-BnmTlfYB.js",
- artifacts/asset-diff/asset-report.json:2767 - "remote_url": "https://isotopeai.in/assets/analyticsWorker-BnmTlfYB.js",
- artifacts/asset-diff/local-assets.txt:154 - analyticsWorker-BnmTlfYB.js
- artifacts/asset-diff/summary.md:133 - | analyticsWorker-BnmTlfYB.js | 200 | unexpected HTML fallback for .js request |
- public/assets/Analytics-D74gQMjN.js:2 - import{_ as Ie}from"./index-BPYJFSVW.js";import{r as A,j as o,f as fa}from"./vendor-react-BfU3Zn2J.js";import{S as nn,D as rn}from"./DashboardHeader-DNuRMna8.js";import{g as te,q as _e,p as pt,j as on,h as sn,u as cn,k as ln,c as dn,d as un

INTERNAL STRUCTURE

- line count: 14
- imports:
None observed.
- exports:
None observed.
- functions/async flows:
- 1: (function(){"use strict";const jt=Symbol.for("constructDateFrom");function it(a,e){return typeof a=="function"?a(e):a&&typeof a=="object"&&jt in a?a[jt](e):a instanceof Date?new a.constructor(e):new Date(e)}function De(a
- 2: `).replace(ns,"").replace(rs," ").replace(os," ")}function ls(a,e){return e?a.split(`
- 6: `).trim():a.replace(/\s+/g," ").trim()}function ds(a,e){if(!e||e<=0)return a;const t=Array.from(a.matchAll(/\S+/g));if(t.length<=e)return a;const s=t[e]?.index??a.length;return a.slice(0,s).trim()}function us(a,e){return
- 10: - Revision cue: solve a timed mixed set before marking this chapter strong.`,lastModified:e.toISOString()}),r.topics.slice(0,2).forEach(l=>{t.notes_content.push({id:A("notes",r.id,l.id),chapterId:r.id,layerType:"topic",t
- 14: - Mistake pattern: rushing the final substitution.`,lastModified:e.toISOString()})}),r.topics.slice(0,3).forEach((l,k)=>{t.key_points.push({id:A("key-point",l.id),chapterId:r.id,topicId:l.id,category:k===0?"Formula":k===
- classes:
- 6: `).trim():a.replace(/\s+/g," ").trim()}function ds(a,e){if(!e||e<=0)return a;const t=Array.from(a.matchAll(/\S+/g));if(t.length<=e)return a;const s=t[e]?.index??a.length;return a.slice(0,s).trim()}function us(a,e){return
- 14: - Mistake pattern: rushing the final substitution.`,lastModified:e.toISOString()})}),r.topics.slice(0,3).forEach((l,k)=>{t.key_points.push({id:A("key-point",l.id),chapterId:r.id,topicId:l.id,category:k===0?"Formula":k===
- constants/mutable state candidates:
None observed.
- handlers/lifecycle candidates:
None observed.

INPUTS

- parameters: route/request path candidates are listed in Internal Structure
- environment variables:
- BITSAT: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/About-DbJqhVWT.js:1, public/assets/App-pJGjDiPw.js:3364, public/assets/App-pJGjDiPw.js:3379, public/assets/App-pJGjDiPw.js:3381, public/assets/App-pJGjDiPw.js:4151, public/assets/App-pJGjDiPw.js:8025, public/assets/App-pJGjDiPw.js:8045, public/assets/App-pJGjDiPw.js:8046, public/assets/App-pJGjDiPw.js:8052, public/assets/SettingsLayout-B4OgCkQ5.js:3623, public/assets/Testimonials-CnzXcixO.js:19, public/assets/Testimonials-CnzXcixO.js:24
- COMEDK: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:3319, public/assets/App-pJGjDiPw.js:3334, public/assets/App-pJGjDiPw.js:3336, public/assets/App-pJGjDiPw.js:3351, public/assets/App-pJGjDiPw.js:3470, public/assets/App-pJGjDiPw.js:3485, public/assets/App-pJGjDiPw.js:3487, public/assets/App-pJGjDiPw.js:3511, public/assets/App-pJGjDiPw.js:4151, public/assets/analyticsWorker-BnmTlfYB.js:6, public/assets/analyticsWorker-BnmTlfYB.js:14, public/assets/index-qd2KF3Jd.js:31
- DAILY_LOGS: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:72, public/assets/App-pJGjDiPw.js:838, public/assets/App-pJGjDiPw.js:949, public/assets/App-pJGjDiPw.js:956, public/assets/App-pJGjDiPw.js:1125, public/assets/App-pJGjDiPw.js:1132, public/assets/App-pJGjDiPw.js:1135, public/assets/App-pJGjDiPw.js:1553, public/assets/App-pJGjDiPw.js:1803, public/assets/App-pJGjDiPw.js:1807, public/assets/App-pJGjDiPw.js:1812, public/assets/App-pJGjDiPw.js:4234
- DPP: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:3702, public/assets/App-pJGjDiPw.js:3716, public/assets/App-pJGjDiPw.js:3717, public/assets/ChapterHub-BXRydU0B.js:1, public/assets/analyticsWorker-BnmTlfYB.js:14, public/assets/index-qd2KF3Jd.js:39
- EMF: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:2017, public/assets/analyticsWorker-BnmTlfYB.js:6, public/assets/index-qd2KF3Jd.js:31
- EXAMS: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:74, public/assets/App-pJGjDiPw.js:844, public/assets/App-pJGjDiPw.js:1153, public/assets/App-pJGjDiPw.js:1157, public/assets/App-pJGjDiPw.js:1161, public/assets/App-pJGjDiPw.js:1162, public/assets/App-pJGjDiPw.js:1165, public/assets/App-pJGjDiPw.js:1555, public/assets/App-pJGjDiPw.js:1834, public/assets/App-pJGjDiPw.js:1838, public/assets/App-pJGjDiPw.js:1850, public/assets/App-pJGjDiPw.js:4238
- HABITS: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:69, public/assets/App-pJGjDiPw.js:835, public/assets/App-pJGjDiPw.js:949, public/assets/App-pJGjDiPw.js:1073, public/assets/App-pJGjDiPw.js:1077, public/assets/App-pJGjDiPw.js:1080, public/assets/App-pJGjDiPw.js:1081, public/assets/App-pJGjDiPw.js:1086, public/assets/App-pJGjDiPw.js:1552, public/assets/App-pJGjDiPw.js:1746, public/assets/App-pJGjDiPw.js:1750, public/assets/App-pJGjDiPw.js:1753
- IUPAC: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:2173, public/assets/analyticsWorker-BnmTlfYB.js:6, public/assets/index-qd2KF3Jd.js:31
- JEE: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=.github/ISSUE_TEMPLATE/feature_request.md:19, artifacts/asset-diff/remote-assets/AIAnalysisCard-qrpOk1g6.js:10, artifacts/asset-diff/remote-assets/AIAnalysisCard-qrpOk1g6.js:23, artifacts/asset-diff/remote-assets/AIAnalysisCard-qrpOk1g6.js:37, artifacts/asset-diff/remote-assets/AIAnalysisCard-qrpOk1g6.js:52, artifacts/asset-diff/remote-assets/AIAnalysisCard-qrpOk1g6.js:80, artifacts/asset-diff/remote-assets/AIAnalysisCard-qrpOk1g6.js:88, artifacts/asset-diff/remote-assets/AIAnalysisCard-qrpOk1g6.js:99, artifacts/asset-diff/remote-assets/AIAssistant--spCOe6W.js:10, artifacts/asset-diff/remote-assets/AIAssistant--spCOe6W.js:23, artifacts/asset-diff/remote-assets/AIAssistant--spCOe6W.js:37, artifacts/asset-diff/remote-assets/AIAssistant--spCOe6W.js:52
- MOCK_TESTS: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:75, public/assets/App-pJGjDiPw.js:847, public/assets/App-pJGjDiPw.js:1168, public/assets/App-pJGjDiPw.js:1172, public/assets/App-pJGjDiPw.js:1175, public/assets/App-pJGjDiPw.js:1176, public/assets/App-pJGjDiPw.js:1183, public/assets/App-pJGjDiPw.js:1184, public/assets/App-pJGjDiPw.js:1187, public/assets/App-pJGjDiPw.js:1556, public/assets/App-pJGjDiPw.js:1853, public/assets/App-pJGjDiPw.js:1857
- NCERT: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:2673, public/assets/App-pJGjDiPw.js:3891, public/assets/Syllabus-DZSnov0t.js:859, public/assets/Syllabus-DZSnov0t.js:2967, public/assets/analyticsWorker-BnmTlfYB.js:6, public/assets/analyticsWorker-BnmTlfYB.js:14, public/assets/index-qd2KF3Jd.js:31, public/assets/index-qd2KF3Jd.js:39, scripts/seed-demo-data.mjs:95
- NFKC: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:467, public/assets/analyticsWorker-BnmTlfYB.js:1, public/assets/index-qd2KF3Jd.js:26
- NS_ERROR_DOM_QUOTA_REACHED: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:899, public/assets/analyticsWorker-BnmTlfYB.js:6, public/assets/index-qd2KF3Jd.js:31
- PCM: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:2928, public/assets/App-pJGjDiPw.js:2972, public/assets/App-pJGjDiPw.js:2976, public/assets/App-pJGjDiPw.js:3023, public/assets/App-pJGjDiPw.js:3037, public/assets/App-pJGjDiPw.js:3041, public/assets/App-pJGjDiPw.js:3110, public/assets/App-pJGjDiPw.js:3114, public/assets/App-pJGjDiPw.js:3233, public/assets/App-pJGjDiPw.js:3236, public/assets/App-pJGjDiPw.js:3365, public/assets/App-pJGjDiPw.js:3379
- PYQ: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:2388, public/assets/App-pJGjDiPw.js:2404, public/assets/App-pJGjDiPw.js:2462, public/assets/App-pJGjDiPw.js:2591, public/assets/App-pJGjDiPw.js:2673, public/assets/App-pJGjDiPw.js:3617, public/assets/App-pJGjDiPw.js:3702, public/assets/App-pJGjDiPw.js:3742, public/assets/App-pJGjDiPw.js:3758, public/assets/App-pJGjDiPw.js:3770, public/assets/App-pJGjDiPw.js:3771, public/assets/App-pJGjDiPw.js:3834
- SCHEMA_VERSION: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:76, public/assets/App-pJGjDiPw.js:945, public/assets/AppAccessGate-B975UtK7.js:380, public/assets/analyticsWorker-BnmTlfYB.js:1, public/assets/analyticsWorker-BnmTlfYB.js:6, public/assets/index-qd2KF3Jd.js:26, public/assets/index-qd2KF3Jd.js:31
- SESSIONS: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/Analytics-D74gQMjN.js:2, public/assets/App-pJGjDiPw.js:67, public/assets/App-pJGjDiPw.js:829, public/assets/App-pJGjDiPw.js:949, public/assets/App-pJGjDiPw.js:1036, public/assets/App-pJGjDiPw.js:1040, public/assets/App-pJGjDiPw.js:1043, public/assets/App-pJGjDiPw.js:1044, public/assets/App-pJGjDiPw.js:1050, public/assets/App-pJGjDiPw.js:1051, public/assets/App-pJGjDiPw.js:1054, public/assets/App-pJGjDiPw.js:1550
- SHM: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:1971, public/assets/analyticsWorker-BnmTlfYB.js:6, public/assets/index-qd2KF3Jd.js:31
- SUBJECTS: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/Analytics-D74gQMjN.js:2, public/assets/AnalyticsToday-BTdRNTb0.js:8, public/assets/App-pJGjDiPw.js:68, public/assets/App-pJGjDiPw.js:832, public/assets/App-pJGjDiPw.js:949, public/assets/App-pJGjDiPw.js:1057, public/assets/App-pJGjDiPw.js:1061, public/assets/App-pJGjDiPw.js:1064, public/assets/App-pJGjDiPw.js:1065, public/assets/App-pJGjDiPw.js:1070, public/assets/App-pJGjDiPw.js:1551, public/assets/App-pJGjDiPw.js:1729
- SUPR: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:3305, public/assets/App-pJGjDiPw.js:3456, public/assets/analyticsWorker-BnmTlfYB.js:6, public/assets/index-qd2KF3Jd.js:31
- SYNC_METADATA: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:77, public/assets/App-pJGjDiPw.js:1003, public/assets/App-pJGjDiPw.js:1010, public/assets/App-pJGjDiPw.js:1011, public/assets/AppAccessGate-B975UtK7.js:380, public/assets/AppAccessGate-B975UtK7.js:475, public/assets/AppAccessGate-B975UtK7.js:483, public/assets/AppAccessGate-B975UtK7.js:484, public/assets/analyticsWorker-BnmTlfYB.js:1, public/assets/analyticsWorker-BnmTlfYB.js:6, public/assets/index-qd2KF3Jd.js:26, public/assets/index-qd2KF3Jd.js:31
- T00: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=artifacts/asset-diff/remote-assets/vendor-supabase-DAiUAuun.js:26, artifacts/asset-diff/remote-assets/vendor-supabase-DAiUAuun.js:27, public/assets/Analytics-D74gQMjN.js:2, public/assets/Dashboard-dypAV-0H.js:1004, public/assets/SingleGroup-DU1IhoNK.js:1, public/assets/analyticsWorker-BnmTlfYB.js:1, public/assets/analyticsWorker-BnmTlfYB.js:14, public/assets/useFocusStore-CX_Nyp1h.js:223, public/assets/vendor-supabase-DAiUAuun.js:4074, public/assets/vendor-supabase-DAiUAuun.js:4455
- TASKS: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:66, public/assets/App-pJGjDiPw.js:826, public/assets/App-pJGjDiPw.js:949, public/assets/App-pJGjDiPw.js:1015, public/assets/App-pJGjDiPw.js:1019, public/assets/App-pJGjDiPw.js:1022, public/assets/App-pJGjDiPw.js:1023, public/assets/App-pJGjDiPw.js:1029, public/assets/App-pJGjDiPw.js:1030, public/assets/App-pJGjDiPw.js:1033, public/assets/App-pJGjDiPw.js:1549, public/assets/App-pJGjDiPw.js:1677
- TESTS: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:73, public/assets/App-pJGjDiPw.js:75, public/assets/App-pJGjDiPw.js:841, public/assets/App-pJGjDiPw.js:847, public/assets/App-pJGjDiPw.js:1138, public/assets/App-pJGjDiPw.js:1142, public/assets/App-pJGjDiPw.js:1146, public/assets/App-pJGjDiPw.js:1147, public/assets/App-pJGjDiPw.js:1150, public/assets/App-pJGjDiPw.js:1168, public/assets/App-pJGjDiPw.js:1172, public/assets/App-pJGjDiPw.js:1175
- TIMER_STATE: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:71, public/assets/App-pJGjDiPw.js:1108, public/assets/App-pJGjDiPw.js:1119, public/assets/App-pJGjDiPw.js:1122, public/assets/App-pJGjDiPw.js:6936, public/assets/AppAccessGate-B975UtK7.js:380, public/assets/AppAccessGate-B975UtK7.js:468, public/assets/AppAccessGate-B975UtK7.js:473, public/assets/analyticsWorker-BnmTlfYB.js:1, public/assets/analyticsWorker-BnmTlfYB.js:6, public/assets/index-qd2KF3Jd.js:26, public/assets/index-qd2KF3Jd.js:31
- UGEE: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:3274, public/assets/App-pJGjDiPw.js:3289, public/assets/App-pJGjDiPw.js:3291, public/assets/App-pJGjDiPw.js:3306, public/assets/App-pJGjDiPw.js:3409, public/assets/App-pJGjDiPw.js:3424, public/assets/App-pJGjDiPw.js:3426, public/assets/App-pJGjDiPw.js:3450, public/assets/App-pJGjDiPw.js:4151, public/assets/analyticsWorker-BnmTlfYB.js:6, public/assets/analyticsWorker-BnmTlfYB.js:14, public/assets/index-qd2KF3Jd.js:31
- USER_PROFILE: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:70, public/assets/App-pJGjDiPw.js:949, public/assets/App-pJGjDiPw.js:1091, public/assets/App-pJGjDiPw.js:1103, public/assets/App-pJGjDiPw.js:6933, public/assets/AppAccessGate-B975UtK7.js:380, public/assets/AppAccessGate-B975UtK7.js:461, public/assets/AppAccessGate-B975UtK7.js:466, public/assets/analyticsWorker-BnmTlfYB.js:1, public/assets/analyticsWorker-BnmTlfYB.js:6, public/assets/index-qd2KF3Jd.js:26, public/assets/index-qd2KF3Jd.js:31
- VSEPR: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:2134, public/assets/analyticsWorker-BnmTlfYB.js:6, public/assets/index-qd2KF3Jd.js:31
- YDSE: classification=configuration; review sensitivity; required=unknown from static map; inspect use locations; uses=public/assets/App-pJGjDiPw.js:2032, public/assets/analyticsWorker-BnmTlfYB.js:6, public/assets/index-qd2KF3Jd.js:31
- command-line arguments: not directly observed
- request data: route candidates observed
- headers/cookies: not directly observed
- files: not directly observed
- database data:
None observed.
- network responses:
- https://api.dicebear.com/7.x/avataaars/svg?seed=${pe}
- https://api.dicebear.com/7.x/avataaars/svg?seed=isha
- https://api.dicebear.com/7.x/avataaars/svg?seed=kabir
- https://api.dicebear.com/7.x/avataaars/svg?seed=meera
- browser storage:
- 6: `).trim():a.replace(/\s+/g," ").trim()}function ds(a,e){if(!e||e<=0)return a;const t=Array.from(a.matchAll(/\S+/g));if(t.length<=e)return a;const s=t[e]?.index??a.length;return a.slice(0,s).trim()}function us(a,e){return a.length<=e?a:a.slice(0,e).trim()}funct
- user interactions: browser/UI file may react to user actions

OUTPUTS AND SIDE EFFECTS

- 1: (function(){"use strict";const jt=Symbol.for("constructDateFrom");function it(a,e){return typeof a=="function"?a(e):a&&typeof a=="object"&&jt in a?a[jt](e):a instanceof Date?new a.constructor(e):new Date(e)}function De(a,e){return it(e||a,a)}function Aa(a,e,t)
- 6: `).trim():a.replace(/\s+/g," ").trim()}function ds(a,e){if(!e||e<=0)return a;const t=Array.from(a.matchAll(/\S+/g));if(t.length<=e)return a;const s=t[e]?.index??a.length;return a.slice(0,s).trim()}function us(a,e){return a.length<=e?a:a.slice(0,e).trim()}funct
- 14: - Mistake pattern: rushing the final substitution.`,lastModified:e.toISOString()})}),r.topics.slice(0,3).forEach((l,k)=>{t.key_points.push({id:A("key-point",l.id),chapterId:r.id,topicId:l.id,category:k===0?"Formula":k===1?"Trap":"Concept",content:`${l.title}: 

DATA FLOW

Browser receives this file from static serving or service-worker cache; if code, it may read browser storage, call local server/Supabase endpoints, update DOM/application state, and persist local data.

DEPENDENCIES

- platform dependencies: none beyond repository/runtime context observed
- Node core modules:
- 1: (function(){"use strict";const jt=Symbol.for("constructDateFrom");function it(a,e){return typeof a=="function"?a(e):a&&typeof a=="object"&&jt in a?a[jt](e):a instanceof Date?new a.constructor(e):new Date(e)}function De(a,e){return it(e||a,a)}function Aa(a,e,t)
- 2: `).replace(ns,"").replace(rs," ").replace(os," ")}function ls(a,e){return e?a.split(`
- 6: `).trim():a.replace(/\s+/g," ").trim()}function ds(a,e){if(!e||e<=0)return a;const t=Array.from(a.matchAll(/\S+/g));if(t.length<=e)return a;const s=t[e]?.index??a.length;return a.slice(0,s).trim()}function us(a,e){return a.length<=e?a:a.slice(0,e).trim()}funct
- 14: - Mistake pattern: rushing the final substitution.`,lastModified:e.toISOString()})}),r.topics.slice(0,3).forEach((l,k)=>{t.key_points.push({id:A("key-point",l.id),chapterId:r.id,topicId:l.id,category:k===0?"Formula":k===1?"Trap":"Concept",content:`${l.title}: 
- external libraries:
None observed.
- local files: see References and Consumers above
- browser APIs:
- 6: `).trim():a.replace(/\s+/g," ").trim()}function ds(a,e){if(!e||e<=0)return a;const t=Array.from(a.matchAll(/\S+/g));if(t.length<=e)return a;const s=t[e]?.index??a.length;return a.slice(0,s).trim()}function us(a,e){return a.length<=e?a:a.slice(0,e).trim()}funct
- operating-system commands:
- 1: (function(){"use strict";const jt=Symbol.for("constructDateFrom");function it(a,e){return typeof a=="function"?a(e):a&&typeof a=="object"&&jt in a?a[jt](e):a instanceof Date?new a.constructor(e):new Date(e)}function De(a,e){return it(e||a,a)}function Aa(a,e,t)
- 14: - Mistake pattern: rushing the final substitution.`,lastModified:e.toISOString()})}),r.topics.slice(0,3).forEach((l,k)=>{t.key_points.push({id:A("key-point",l.id),chapterId:r.id,topicId:l.id,category:k===0?"Formula":k===1?"Trap":"Concept",content:`${l.title}: 
- Supabase interfaces:
- 1: (function(){"use strict";const jt=Symbol.for("constructDateFrom");function it(a,e){return typeof a=="function"?a(e):a&&typeof a=="object"&&jt in a?a[jt](e):a instanceof Date?new a.constructor(e):new Date(e)}function De(a,e){return it(e||a,a)}function Aa(a,e,t)
- 6: `).trim():a.replace(/\s+/g," ").trim()}function ds(a,e){if(!e||e<=0)return a;const t=Array.from(a.matchAll(/\S+/g));if(t.length<=e)return a;const s=t[e]?.index??a.length;return a.slice(0,s).trim()}function us(a,e){return a.length<=e?a:a.slice(0,e).trim()}funct
- 14: - Mistake pattern: rushing the final substitution.`,lastModified:e.toISOString()})}),r.topics.slice(0,3).forEach((l,k)=>{t.key_points.push({id:A("key-point",l.id),chapterId:r.id,topicId:l.id,category:k===0?"Formula":k===1?"Trap":"Concept",content:`${l.title}: 
- external services: https://api.dicebear.com/7.x/avataaars/svg?seed=${pe}, https://api.dicebear.com/7.x/avataaars/svg?seed=isha, https://api.dicebear.com/7.x/avataaars/svg?seed=kabir, https://api.dicebear.com/7.x/avataaars/svg?seed=meera

SECURITY AND PRIVACY

- Contains or references auth/session/secret-sensitive concepts; verify server-only boundaries and browser exposure.

CORRECTNESS AND FAILURE MODES

- Depends on asynchronous I/O or browser/server storage; failure modes include network loss, stale state, partial writes, and malformed data.
- Correctness depends on current HTML/restore/service-worker references matching this hashed bundle.

OFFLINE AND LOCAL-FIRST BEHAVIOUR

- Participates in offline/local-first behavior or references browser persistence/cache APIs.
- May be served through static cache or service-worker asset cache if referenced by current bundle graph.

PERFORMANCE

- Contains repeated parsing, synchronous I/O, timers, or observers that deserve runtime profiling.

MAINTAINABILITY

- Maintained through existing repository structure; no direct maintainability issue confirmed.

FINDINGS

- finding ID: ISO-AUDIT-0427-01
  severity: INFO
  category: audit
  status: CONFIRMED
  confidence: MEDIUM
  affected lines or byte-level evidence: public/assets/analyticsWorker-BnmTlfYB.js inspected; no file-specific high-risk issue confirmed
  observed evidence: public/assets/analyticsWorker-BnmTlfYB.js inspected; no file-specific high-risk issue confirmed
  inferred impact: No direct issue was confirmed from static evidence in this file.
  reproduction or reasoning: Inspect the referenced path and line or byte metadata; no runtime mutation was used.
  recommended correction: Keep covered by relevant smoke/static tests.
  related files: artifacts/asset-diff/asset-report.json, artifacts/asset-diff/asset-report.json, artifacts/asset-diff/local-assets.txt
  regression risk: Review behavior against existing tests before changing.

POSITIVE OBSERVATIONS

- File was included through a deterministic manifest rather than filename-only guessing.
- Tracked by Git, which improves reproducibility of audit evidence.
- At least one direct reference/consumer was found.

RECOMMENDED TESTS

- Verify browser/service-worker behavior in a real browser context, not a Node REPL.
- Keep this file covered by repository smoke tests or reference checks appropriate to its subsystem.

FINAL VERDICT

- role: Built frontend asset emitted by the bundling pipeline; purpose is inferred from bundle name, imports, and consumers rather than hash alone.
- activity status: active or bundle-referenced
- reliability: MEDIUM; static audit only, runtime behavior should be verified by targeted tests.
- largest risk: subsystem-specific drift from implementation
- highest-value improvement: confirm active bundle graph and remove stale build outputs only after proof

LARGE FILE / FUTURE AGENT HAZARD ADDENDUM

- hazard severity: MEDIUM
- file size: 147629
- file kind: text/source or unknown
- hazard reasons: large file >=100KB; same basename appears in multiple locations with different SHA/size
- correction for future agents: do not infer runtime behavior from this filename; trace active consumers and prefer source/runtime-patch files over built chunks.
- confirmed references:
  - public/assets/Analytics-D74gQMjN.js:2: import{_ as Ie}from"./index-BPYJFSVW.js";import{r as A,j as o,f as fa}from"./vendor-react-BfU3Zn2J.js";import{S as nn,D as rn}from"./DashboardHeader-DNuRMna8.js";import{g as te,q a
  - artifacts/asset-diff/local-assets.txt:154: analyticsWorker-BnmTlfYB.js
  - artifacts/asset-diff/asset-report.json:2764: "file": "analyticsWorker-BnmTlfYB.js",
  - artifacts/asset-diff/asset-report.json:2767: "remote_url": "https://isotopeai.in/assets/analyticsWorker-BnmTlfYB.js",
  - artifacts/asset-diff/summary.md:133: | analyticsWorker-BnmTlfYB.js | 200 | unexpected HTML fallback for .js request |
