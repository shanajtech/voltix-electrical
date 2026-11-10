"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Language } from "@/app/page";
import type { WorkMode } from "./three/WorkScene";
const WorkScene=dynamic(()=>import("./three/WorkScene"),{ssr:false});
function subscribeMotion(callback:()=>void){const mq=matchMedia("(prefers-reduced-motion: reduce)");mq.addEventListener("change",callback);return ()=>mq.removeEventListener("change",callback);}
const poster=(id:string)=>`https://images.pexels.com/videos/${id}/pexels-photo-${id}.jpeg?auto=compress&w=1600`;
const scenes=[
 {id:"building",en:"The whole building",bn:"পুরো বিল্ডিং",title:"From bare concrete.",accent:"To every connection.",btitle:"খালি বিল্ডিং থেকে,",baccent:"প্রতিটি সংযোগে।",copy:"A complete electrical contract—planned floor by floor, from the roof conduits to the final fittings.",bcopy:"ছাদের পাইপ থেকে শেষ সুইচবোর্ড—তলা অনুযায়ী পরিকল্পনা করে পুরো বিল্ডিংয়ের ইলেকট্রিক্যাল কাজ।",src:"https://videos.pexels.com/video-files/14143458/14143458-uhd_2560_1440_25fps.mp4",poster:poster("14143458"),ctaEn:"PLAN YOUR BUILDING",ctaBn:"বিল্ডিংয়ের কাজ নিয়ে কথা বলুন",mode:"building"},
 {id:"conduit",en:"Before the roof pour",bn:"ঢালাইয়ের আগে",title:"Before the concrete.",accent:"Plan the connection.",btitle:"ছাদ ঢালাইয়ের আগে,",baccent:"সংযোগের পরিকল্পনা।",copy:"Conduit routes, junction boxes, fan points and switch positions. Tell us your casting date before the site is ready to pour.",bcopy:"পাইপের রুট, জংশন বক্স, ফ্যান পয়েন্ট ও সুইচের জায়গা। ঢালাইয়ের তারিখ জানিয়ে আগেই যোগাযোগ করুন।",src:"https://videos.pexels.com/video-files/34572296/14649416_2560_1440_30fps.mp4",poster:poster("34572296"),ctaEn:"DISCUSS ROOF CONDUITS",ctaBn:"পাইপের কাজ নিয়ে কথা বলুন",mode:"conduit"},
 {id:"wiring",en:"Inside the walls",bn:"ওয়্যারিংয়ের কাজ",title:"The work you see.",accent:"The care behind it.",btitle:"দেয়ালের আড়ালে,",baccent:"কাজে যত্নের ছাপ।",copy:"Electrical routes, wiring and distribution boards. Plan the points, materials and labour around your building.",bcopy:"ওয়্যারিংয়ের রুট ও ডিস্ট্রিবিউশন বোর্ড। বিল্ডিং অনুযায়ী পয়েন্ট, মালামাল ও শ্রমের কাজ নিয়ে পরিকল্পনা।",src:"https://videos.pexels.com/video-files/34572318/14649389_3840_2160_30fps.mp4",poster:poster("34572318"),ctaEn:"DISCUSS THE WIRING",ctaBn:"ওয়্যারিংয়ের বিবরণ দিন",mode:undefined},
 {id:"fixtures",en:"Switchboards & fittings",bn:"সুইচবোর্ড ও ফিটিং",title:"Every switch.",accent:"Every room.",btitle:"প্রতিটি সুইচবোর্ড,",baccent:"প্রতিটি ঘরের কাজ।",copy:"Switches, sockets, regulators, lights and fans—discuss each room’s requirements before the finishing work.",bcopy:"সুইচ, সকেট, রেগুলেটর, লাইট ও ফ্যান—ফিনিশিংয়ের আগে ঘরভিত্তিক চাহিদা ঠিক করে নিন।",src:"/films/switchboard.mp4",poster:"/films/switchboard.jpg",ctaEn:"PLAN THE FITTINGS",ctaBn:"ফিটিংয়ের কাজ নিয়ে কথা বলুন",mode:undefined},
 {id:"repair",en:"Fan installation & service",bn:"ফ্যান লাগানো ও মেরামত",title:"From fitting a fan.",accent:"To keeping it running.",btitle:"ফ্যান লাগানো থেকে,",baccent:"মেরামতের সহায়তা।",copy:"Discuss fan installation or describe a fault. Inspection, parts and labour are agreed before the work begins.",bcopy:"নতুন ফ্যান লাগানো বা পুরোনো ফ্যানের সমস্যা জানান। যাচাই করে প্রয়োজনীয় পার্টস, শ্রম ও খরচ নিয়ে কথা বলুন।",src:"https://images.stockcake.com/public/1/8/6/18668f82-f7d0-4b57-9864-dd7f7aee180e.mp4",poster:"https://images.stockcake.com/public/9/1/d/91df80ca-bfda-4e5b-a514-061a0395ba04_large/installing-ceiling-fan-stockcake.jpg",ctaEn:"DESCRIBE THE FAULT",ctaBn:"সমস্যার বিবরণ পাঠান",mode:undefined},
 {id:"earthing",en:"Earthing & meter",bn:"আর্থিং ও মিটার",title:"Beyond the switches.",accent:"The complete scope.",btitle:"সুইচের বাইরেও,",baccent:"সম্পূর্ণ কাজের পরিধি।",copy:"Earthing, protective equipment and meter-related assistance. Scope and utility requirements are checked for your site.",bcopy:"আর্থিং, সুরক্ষা সরঞ্জাম ও মিটার সংক্রান্ত সহায়তা। সাইট ও বিতরণ সংস্থার প্রয়োজন অনুযায়ী কাজের পরিধি যাচাই হবে।",src:undefined,poster:undefined,ctaEn:"DISCUSS YOUR REQUIREMENTS",ctaBn:"প্রয়োজন নিয়ে আলোচনা করুন",mode:"earthing"},
 {id:"contract",en:"Let’s agree the work",bn:"কথা বলে কাজ ঠিক করুন",title:"Your work.",accent:"A clear conversation.",btitle:"আপনার কাজের কথা,",baccent:"সরাসরি আলোচনা।",copy:"Share your site, schedule and scope. Agree the materials, team, timing and price through a conversation.",bcopy:"স্থান, সময় ও কাজের বিবরণ জানান। কথা বলে মালামাল, কর্মী, সময়সূচি ও দামদর ঠিক করুন।",src:"/films/switchboard.mp4",poster:"/films/switchboard.jpg",ctaEn:"LET’S DISCUSS THE CONTRACT",ctaBn:"কন্ট্রাক্ট ও দামদর নিয়ে কথা বলুন",mode:undefined},
] as const;
function Film({src,poster:cover,active,paused,reduced,onFail}:{src:string;poster?:string;active:boolean;paused:boolean;reduced:boolean;onFail:()=>void}){
 const video=useRef<HTMLVideoElement>(null);
 useEffect(()=>{const el=video.current;if(!el)return;const update=()=>{if(active&&!paused&&!reduced&&!document.hidden)el.play().catch(()=>{});else el.pause();};update();document.addEventListener("visibilitychange",update);return ()=>document.removeEventListener("visibilitychange",update);},[active,paused,reduced]);
 return <video ref={video} src={active||src.startsWith("/")?src:undefined} poster={cover} muted playsInline loop preload={active?"auto":"none"} onError={onFail} aria-hidden="true"/>;
}
export default function Hero({language}:{language:Language}){
 const bn=language==="bn",root=useRef<HTMLElement>(null);const [active,setActive]=useState(0);const [paused,setPaused]=useState(false);const [inView,setInView]=useState(true);const [failed,setFailed]=useState<Record<number,boolean>>({});
 const reduced=useSyncExternalStore(subscribeMotion,()=>matchMedia("(prefers-reduced-motion: reduce)").matches,()=>false);
 useEffect(()=>{gsap.registerPlugin(ScrollTrigger);const media=gsap.matchMedia();media.add("(prefers-reduced-motion: no-preference)",()=>{const ctx=gsap.context(()=>{gsap.to(".work-progress-fill",{scaleX:1,ease:"none",scrollTrigger:{trigger:root.current,start:"top top",end:"bottom bottom",scrub:.5,onUpdate:self=>setActive(Math.min(6,Math.floor(self.progress*7)))}});gsap.utils.toArray<HTMLElement>(".work-film").forEach(el=>{gsap.fromTo(el,{scale:1.03},{scale:1.15,ease:"none",scrollTrigger:{trigger:root.current,start:"top top",end:"bottom bottom",scrub:1}});});},root);return ()=>ctx.revert();});return ()=>media.revert();},[]);
 useEffect(()=>{const observer=new IntersectionObserver(entries=>setInView(entries[0].isIntersecting));if(root.current)observer.observe(root.current);return ()=>observer.disconnect();},[]);
 const scene=scenes[active];
 function go(index:number){if(reduced){document.getElementById("services")?.scrollIntoView();return;}const el=root.current;if(!el)return;window.scrollTo({top:el.getBoundingClientRect().top+scrollY+(el.offsetHeight-innerHeight)*(index/7+.035),behavior:"smooth"});}
 function selectWork(id:string){window.dispatchEvent(new CustomEvent("khaja-select-service",{detail:id}));}
 return <section ref={root} id="home" className="work-journey" aria-label={bn?"ইলেকট্রিক্যাল কাজের গল্প":"The electrical work story"}><div className="work-sticky">
  <div className="work-blueprint" aria-hidden="true"/>
  {scenes.map((s,i)=><div className={`work-film ${i===active?"is-active":""}`} key={s.id}>{s.src&&!failed[i]&&<Film src={s.src} poster={s.poster} active={active===i} paused={paused||!inView} reduced={reduced} onFail={()=>setFailed(prev=>({...prev,[i]:true}))}/>}</div>)}
  {inView&&(scene.mode||failed[active])&&<div className={`work-model ${active<2&&!failed[active]?"model-inset":""}`} aria-hidden="true"><WorkScene mode={(scene.mode||"building") as WorkMode} paused={paused||reduced||!inView}/></div>}
  <div className="work-shade" aria-hidden="true"/>
  <div className="work-topline"><span>M/S KHAJA ENTERPRISE</span><span>{bn?"পূর্ণ বিল্ডিং কন্ট্রাক্ট · মেরামত · রক্ষণাবেক্ষণ":"BUILDING CONTRACTS · REPAIRS · MAINTENANCE"}</span></div>
  <div className="work-copy" key={scene.id}>
   <p className="work-eyebrow"><span/> 0{active+1} / {bn?scene.bn:scene.en}</p>
   <h1 className={bn?"work-bangla":""}>{bn?scene.btitle:scene.title}<br/><span>{bn?scene.baccent:scene.accent}</span></h1>
   <p className="work-description">{bn?scene.bcopy:scene.copy}</p>
   <a className="btn-primary" href="#quote" onClick={()=>selectWork(scene.id)}>{bn?scene.ctaBn:scene.ctaEn}<span>↗</span></a>
   {active===1&&<span className="casting-note">{bn?"ঢালাইয়ের তারিখ আগে জানাতে ভুলবেন না।":"Tell us the casting date before the pour."}</span>}
  </div>
  <div className="work-annotation"><span className="live-dot"/>{active===4?(bn?"ফ্যান লাগানোর ধারণামূলক স্টক ভিডিও":"ILLUSTRATIVE STOCK VIDEO OF FAN INSTALLATION"):scene.mode&&active>=4?(bn?"সেবার ধারণামূলক দৃশ্য":"ILLUSTRATIVE SERVICE VISUAL"):(bn?"স্টক ফুটেজে কাজের ধরন দেখানো হয়েছে":"WORK ILLUSTRATED WITH STOCK FOOTAGE")}</div>
  <div className="work-bottom"><div className="work-chapters">{scenes.map((s,i)=><button key={s.id} onClick={()=>go(i)} aria-current={i===active?"step":undefined} className={i===active?"active":""}><span>0{i+1}</span>{bn?s.bn:s.en}</button>)}</div><div className="work-utilities"><button onClick={()=>setPaused(!paused)} aria-pressed={paused} aria-label={bn?"ভিডিও থামান বা চালান":"Pause or play video"}>{paused?"▶":"Ⅱ"}</button><button onClick={()=>active<6?go(active+1):document.getElementById("services")?.scrollIntoView({behavior:reduced?"instant":"smooth"})}>{bn?"স্ক্রল করে দেখুন":"SCROLL TO EXPLORE"} ↓</button></div></div>
  <div className="work-progress"><div className="work-progress-fill"/></div>
 </div></section>;
}
