"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Stars, useGLTF } from "@react-three/drei";
import { Component, Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { publicUrl } from "@/lib/public-url";
import * as THREE from "three";

export type JourneyState = {progress:number};
class RenderBoundary extends Component<{children:ReactNode;fallback?:ReactNode},{failed:boolean}> {
 state={failed:false}; static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?(this.props.fallback??null):this.props.children;}
}
function Box({position,size,color="#202735",roughness=.6,metalness=.05,rotation}: {position:[number,number,number];size:[number,number,number];color?:string;roughness?:number;metalness?:number;rotation?:[number,number,number]}){
 return <RoundedBox args={size} radius={Math.min(.045,...size.map(n=>n/4))} smoothness={3} position={position} rotation={rotation} castShadow receiveShadow><meshStandardMaterial color={color} roughness={roughness} metalness={metalness}/></RoundedBox>;
}
function useWoodTexture(){
 return useMemo(()=>{
  const canvas=document.createElement("canvas");canvas.width=128;canvas.height=512;
  const ctx=canvas.getContext("2d")!;
  ctx.fillStyle="#6f4226";ctx.fillRect(0,0,128,512);
  for(let i=0;i<160;i++){const x=(i*43.71)%128;ctx.strokeStyle=`rgba(${i%2?28:209},${i%2?16:144},${i%2?8:79},${.03+(i%7)*.012})`;ctx.lineWidth=.3+(i%4)*.4;ctx.beginPath();ctx.moveTo(x,0);ctx.bezierCurveTo(x+Math.sin(i)*9,170,x-7,320,x+3,512);ctx.stroke();}
  const map=new THREE.CanvasTexture(canvas);map.wrapS=map.wrapT=THREE.RepeatWrapping;map.colorSpace=THREE.SRGBColorSpace;return map;
 },[]);
}
function Plant({position,scale=1}:{position:[number,number,number];scale?:number}) {
 return <group position={position} scale={scale}>
  <mesh position={[0,.25,0]} castShadow><cylinderGeometry args={[.27,.19,.5,12]}/><meshStandardMaterial color="#242b2d" roughness={.85}/></mesh>
  {[0,1,2,3,4,5].map(i=><group key={i} rotation={[0,i*1.047,0]}>
    <mesh position={[.17,.68,0]} rotation={[0,0,-.4]} castShadow><cylinderGeometry args={[.012,.017,.9,5]}/><meshStandardMaterial color="#3b4b24"/></mesh>
    <mesh position={[.32,1.05,0]} rotation={[0,0,-.6]} scale={[.2,.52,.08]} castShadow><sphereGeometry args={[1,10,8]}/><meshStandardMaterial color={i%2?"#31482b":"#456039"} roughness={.7}/></mesh>
  </group>)}
 </group>;
}
function Sofa(){return <group position={[2.8,.3,-1.6]}>
 <Box position={[0,.1,0]} size={[3.5,.3,1.4]} color="#453d34"/>
 <Box position={[0,.55,-.52]} size={[3.5,.95,.32]} color="#a79a82"/>
 {[-1.15,0,1.15].map(x=><group key={x}><Box position={[x,.35,.05]} size={[1.08,.4,1.25]} color="#c7baa0"/><Box position={[x,.8,-.32]} size={[1.03,.65,.2]} color="#c1b39b" rotation={[-.15,0,0]}/></group>)}
 {[-1.75,1.75].map(x=><Box key={x} position={[x,.5,0]} size={[.25,.8,1.5]} color="#a79a82"/>)}
 {[-1.2,1.1].map(x=><Box key={x} position={[x,.95,-.05]} size={[.48,.5,.18]} color="#6b6358" rotation={[0,0,x*.12]}/>)}
 </group>}
function AssetSofa(){
 const {scene}=useGLTF(publicUrl("/models/sofa.glb"));
 const model=useMemo(()=>{
  const object=scene.clone(true);
  const bounds=new THREE.Box3().setFromObject(object);
  const center=bounds.getCenter(new THREE.Vector3());
  const size=bounds.getSize(new THREE.Vector3());
  const scale=3.5/size.x;
  object.scale.setScalar(scale);
  object.position.set(-center.x*scale,-bounds.min.y*scale,-center.z*scale);
  object.traverse(child=>{if(child instanceof THREE.Mesh){child.castShadow=true;child.receiveShadow=true;}});
  return object;
 },[scene]);
 return <group position={[2.8,.1,-1.6]}><primitive object={model}/></group>;
}
function Tree({position,scale=1}:{position:[number,number,number];scale?:number}) {return <group position={position} scale={scale}>
 <mesh position={[0,2,0]} castShadow><cylinderGeometry args={[.08,.18,4,7]}/><meshStandardMaterial color="#34352e"/></mesh>
 {[0,1,2,3,4].map(i=><mesh key={i} position={[Math.sin(i*2.4)*1.1,3.5+(i%3)*.6,Math.cos(i*2.4)*.8]} scale={[1.5,.8,1.3]} castShadow><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color={i%2?"#1b302b":"#233d31"} roughness={1}/></mesh>)}
 </group>}
function Villa({journey}: {journey:MutableRefObject<JourneyState>}){
 const wood=useWoodTexture();
 const group=useRef<THREE.Group>(null);
 const strips=useRef<THREE.MeshBasicMaterial[]>([]);
 const glass=useRef<THREE.MeshStandardMaterial[]>([]);
 const lamps=useRef<THREE.PointLight[]>([]);
 const fan=useRef<THREE.Group>(null);
 const current=useRef<THREE.Mesh>(null);
 const pulse=useRef<THREE.MeshBasicMaterial>(null);
 const speed=useRef(0);
 const wireCurve=useMemo(()=>new THREE.CatmullRomCurve3([new THREE.Vector3(-13,.05,7),new THREE.Vector3(-8,.05,7),new THREE.Vector3(-6,.1,5.4),new THREE.Vector3(-6,2.8,5.4),new THREE.Vector3(-3,3.2,5.4),new THREE.Vector3(0,3.2,5.4),new THREE.Vector3(5,3.2,5.4),new THREE.Vector3(5,5.7,5.4)]),[]);
 useEffect(()=>()=>wood.dispose(),[wood]);
 useFrame((state,delta)=>{
  const p=journey.current.progress;
  const power=THREE.MathUtils.smoothstep(p,.19,.4);
  strips.current.forEach((m,i)=>{if(m)m.color.setRGB(1,.62,.2).multiplyScalar(.06+THREE.MathUtils.smoothstep(p,.23+i*.009,.31+i*.009)*3);});
  glass.current.forEach((m,i)=>{if(m)m.emissiveIntensity=THREE.MathUtils.smoothstep(p,.22+i*.015,.3+i*.015)*.7;});
  lamps.current.forEach(l=>{if(l)l.intensity=power*35;});
  speed.current=THREE.MathUtils.lerp(speed.current,power*4,Math.min(delta*2,1));
  if(fan.current)fan.current.rotation.y-=Math.min(delta,.05)*speed.current;
  if(current.current){current.current.visible=p>.12&&p<.42;current.current.position.copy(wireCurve.getPointAt((state.clock.elapsedTime*.28)%1));}
  if(pulse.current)pulse.current.opacity=p>.12&&p<.42?.55:0;
  if(group.current)group.current.rotation.y=THREE.MathUtils.lerp(group.current.rotation.y,state.pointer.x*.012, .02);
 });
 const strip=(pos:[number,number,number],size:[number,number,number],i:number)=><mesh key={`strip-${i}`} position={pos}><boxGeometry args={size}/><meshBasicMaterial ref={m=>{if(m)strips.current[i]=m;}} color="#ffb45d" toneMapped={false}/></mesh>;
 return <group ref={group}>
  <Box position={[0,-.2,0]} size={[15,.4,11]} color="#3d4247" roughness={.35}/>
  <Box position={[0,.01,0]} size={[14,.08,10]} color="#766d60" roughness={.38}/>
  <Box position={[0,4,-4.8]} size={[14,8,.22]} color="#323945"/>
  <Box position={[-6.8,4,0]} size={[.3,8,10]} color="#282f3a"/>
  <Box position={[6.8,4,0]} size={[.3,8,10]} color="#282f3a"/>
  <Box position={[0,8.2,0]} size={[14.8,.25,10.8]} color="#202630" metalness={.3}/>
  <mesh position={[0,8.04,0]} rotation={[Math.PI/2,0,0]}><planeGeometry args={[14.4,10.4]}/><meshStandardMaterial map={wood} side={THREE.DoubleSide}/></mesh>
  <Box position={[4.9,4.2,0]} size={[3.7,.25,10]} color="#242c38"/>
  <Box position={[-5.1,4.2,0]} size={[3.3,.25,10]} color="#242c38"/>
  {/* Deep teak facade fins, stone piers and recessed glazing. */}
  {[-5.9,-3.5,3.2,5.9].map(x=><group key={x}><Box position={[x,4,4.7]} size={[.45,8,.65]} color="#30343b"/>{[0,1,2,3].map(i=><mesh key={i} position={[x-.25+i*.16,4,5.12]} castShadow><boxGeometry args={[.075,8,.16]}/><meshStandardMaterial map={wood} roughness={.48}/></mesh>)}</group>)}
  {[-5.1,-2.2,1.2,4.7].map((x,i)=><group key={x}>
   <mesh position={[x,6.2,4.88]}><planeGeometry args={[i===1||i===2?2.5:1.5,3.5]}/><meshStandardMaterial ref={m=>{if(m)glass.current[i]=m;}} color="#52636d" emissive="#ffb454" emissiveIntensity={0} transparent opacity={.22} metalness={.6} roughness={.15} side={THREE.DoubleSide}/></mesh>
   <Box position={[x,6.2,4.99]} size={[.055,3.8,.07]} color="#111a22" metalness={.7}/>
   <Box position={[x,4.4,5]} size={[2.5,.08,.08]} color="#111a22"/>
  </group>)}
  {[-5,4.7].map(x=><mesh key={x} position={[x,2,4.91]}><planeGeometry args={[2,3.8]}/><meshPhysicalMaterial color="#849fa7" transparent opacity={.12} roughness={.05} metalness={.3} side={THREE.DoubleSide}/></mesh>)}
  {[-3.1,2.7].map(x=><Box key={x} position={[x,2,4.96]} size={[.07,4,.12]} color="#131c25" metalness={.7}/>)}
  <Box position={[0,4.15,5.1]} size={[14.5,.22,.5]} color="#28313c"/>
  {strip([0,8.08,5.43],[14.5,.045,.04],0)}
  {strip([0,4.04,5.35],[14.5,.035,.04],1)}
  {strip([0,.08,5.3],[14.6,.035,.04],2)}
  {strip([-6.5,3.9,5.3],[.035,7.7,.04],3)}
  {strip([6.5,3.9,5.3],[.035,7.7,.04],4)}
  {/* Entrance treads with inset linear lights. */}
  {[0,1,2].map(i=><group key={i}><Box position={[0,-.1-i*.11,5.5+i*.4]} size={[7.4,.2,.65]} color="#5f6263" roughness={.4}/>{strip([0,-.05-i*.11,5.83+i*.4],[7.2,.025,.025],5+i)}</group>)}
  {/* Living room: furniture, stone table, rug, illuminated shelving. */}
  <RenderBoundary fallback={<Sofa/>}><Suspense fallback={<Sofa/>}><AssetSofa/></Suspense></RenderBoundary>
  <Box position={[1.7,.07,.4]} size={[5.3,.025,3.8]} color="#746c5c" roughness={1}/>
  <Box position={[1.6,.45,.7]} size={[2.2,.65,1.15]} color="#a4977b" roughness={.5}/>
  <Box position={[1.2,.8,.6]} size={[.65,.05,.42]} color="#2b2f31"/>
  <mesh position={[2,.85,.7]}><cylinderGeometry args={[.16,.1,.18,18]}/><meshStandardMaterial color="#292c2c" roughness={.35}/></mesh>
  <Box position={[5.9,2.1,-2.9]} size={[.55,4.2,3.5]} color="#634127"/>
  {[0,1,2,3].map(i=><group key={i}>
   <Box position={[5.53,.4+i*1.05,-2.9]} size={[.7,.065,3.4]} color="#846044"/>
   {strip([5.3,.48+i*1.05,-2.9],[.035,.025,3.3],8+i)}
   {[0,1,2,3].map(j=><Box key={j} position={[5.53,.72+i*1.05,-3.6+j*.18]} size={[.38,.5-(j%2)*.08,.11]} color={["#e1d5b7","#343a40","#958068","#b6b0a2"][j]}/>)}
   <mesh position={[5.53,.75+i*1.05,-2]}><sphereGeometry args={[.18,14,12]}/><meshStandardMaterial color="#91846d" metalness={.5} roughness={.25}/></mesh>
  </group>)}
  <Box position={[0,4.65,-1]} size={[6,.1,6.8]} color="#3a332b"/>
  {strip([0,4.56,2.35],[5.8,.025,.03],12)}
  {strip([-2.85,4.56,-1],[.03,.025,6.6],13)}
  <group position={[.4,4.35,-.1]}>
   <mesh position={[0,-.2,0]}><cylinderGeometry args={[.025,.025,.4,8]}/><meshStandardMaterial color="#39342d" metalness={.8}/></mesh>
   <group ref={fan} position={[0,-.43,0]}>
    <mesh><sphereGeometry args={[.16,18,12]}/><meshStandardMaterial color="#4e3421" map={wood}/></mesh>
    {[0,1,2].map(i=><group key={i} rotation={[0,i*Math.PI*2/3,0]}><mesh position={[.62,0,.02]} rotation={[.08,0,.05]} scale={[.95,.035,.16]} castShadow><sphereGeometry args={[1,18,10]}/><meshStandardMaterial map={wood} color="#b38c63" roughness={.4}/></mesh></group>)}
   </group>
  </group>
  {/* Pendant with physical warm light. */}
  <group position={[-1.8,3.7,-2.3]}><mesh position={[0,.6,0]}><cylinderGeometry args={[.012,.012,1.2,6]}/><meshStandardMaterial color="#a18a54" metalness={.8}/></mesh><mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[.55,.025,8,40]}/><meshBasicMaterial color="#ffca82" toneMapped={false}/></mesh></group>
  {[[-1.5,3.3,1],[4,2.7,-1],[-4.5,2.5,1],[1,6.5,3]].map((pos,i)=><pointLight key={i} ref={l=>{if(l)lamps.current[i]=l;}} position={pos as [number,number,number]} color="#ffd498" intensity={0} distance={11} decay={2}/>)}
  <Plant position={[-2.5,.08,-2.8]} scale={1.5}/><Plant position={[5.8,.08,3.7]} scale={1.4}/><Plant position={[-5.8,.08,3.8]} scale={1.5}/>
  {/* Landscape and stone approach. */}
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.42,0]} receiveShadow><planeGeometry args={[120,120]}/><meshStandardMaterial color="#17211f" roughness={.95}/></mesh>
  <Box position={[0,-.38,12]} size={[12,.05,14]} color="#373d42" roughness={.4}/>
  {Array.from({length:9},(_,i)=><Box key={i} position={[0,-.34,6+i*1.5]} size={[12,.008,.018]} color="#141d24"/>)}
  {[-7.8,8].map(x=><group key={x}><Box position={[x,-.05,4]} size={[1.2,.5,4]} color="#333c3c"/><Plant position={[x,.2,3]} scale={1.1}/><Plant position={[x,.2,4.8]} scale={.8}/></group>)}
  {[[11,0,-2],[-11,0,-3],[-10,0,8],[13,0,7],[-14,0,-9],[8,0,-12]].map((pos,i)=><Tree key={i} position={pos as [number,number,number]} scale={1.4+(i%3)*.25}/>)}
  <mesh><tubeGeometry args={[wireCurve,70,.018,6,false]}/><meshBasicMaterial ref={pulse} color="#ffc85c" transparent opacity={0} toneMapped={false}/></mesh>
  <mesh ref={current}><sphereGeometry args={[.07,12,10]}/><meshBasicMaterial color="#fff1c2" toneMapped={false}/><pointLight intensity={2} color="#ffce79" distance={2}/></mesh>
 </group>;
}
const cameraStops=[
 {at:0,pos:[16,8,24],look:[0,3,0]},
 {at:.17,pos:[12,6,21],look:[0,3,1]},
 {at:.38,pos:[7,4.8,17],look:[0,3,1]},
 {at:.49,pos:[.3,2.4,3.8],look:[2,2,-2]},
 {at:.66,pos:[-1.7,2.3,1.7],look:[3.8,2.3,-1.6]},
 {at:.82,pos:[-1.2,2.6,2],look:[1,4,-.1]},
 {at:1,pos:[-.8,2.2,3.3],look:[2.8,1.6,-1.8]},
];
function CameraRig({journey}:{journey:MutableRefObject<JourneyState>}){
 const look=useMemo(()=>new THREE.Vector3(),[]);
 useFrame(({camera,pointer},delta)=>{
  const p=journey.current.progress;
  let idx=cameraStops.findIndex((s,i)=>i<cameraStops.length-1&&p>=s.at&&p<=cameraStops[i+1].at);if(idx<0)idx=p<=0?0:cameraStops.length-2;
  const a=cameraStops[idx],b=cameraStops[idx+1];const t=THREE.MathUtils.smoothstep(p,a.at,b.at);
  const goal=new THREE.Vector3(...a.pos as [number,number,number]).lerp(new THREE.Vector3(...b.pos as [number,number,number]),t);
  goal.x+=pointer.x*(p<.45?.18:.045);goal.y+=pointer.y*.04;
  camera.position.lerp(goal,Math.min(1,delta*6));
  look.set(...a.look as [number,number,number]).lerp(new THREE.Vector3(...b.look as [number,number,number]),t);
  camera.lookAt(look);camera.updateProjectionMatrix();
 });return null;
}
export default function VillaExperience({journey}:{journey:MutableRefObject<JourneyState>}){
 const surface=useRef<HTMLDivElement>(null);
 const [visible,setVisible]=useState(true);
 useEffect(()=>{const observer=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting),{rootMargin:"100px"});if(surface.current)observer.observe(surface.current);return ()=>observer.disconnect();},[]);
 return <div ref={surface} style={{width:"100%",height:"100%"}}><RenderBoundary><Canvas frameloop={visible?"always":"never"} shadows={{type:THREE.PCFShadowMap}} dpr={[1,1.5]} camera={{position:[16,8,24],fov:44,near:.1,far:140}} gl={{antialias:true,alpha:false,powerPreference:"high-performance"}} onCreated={({gl,scene})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.3;scene.fog=new THREE.FogExp2("#07101b",.018);}}>
 <color attach="background" args={["#07101b"]}/><hemisphereLight args={["#98b7df","#282218",.8]}/>
 <directionalLight position={[-10,15,10]} color="#a1c4ff" intensity={2} castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20} shadow-bias={-.0003}/>
 <directionalLight position={[12,7,-8]} color="#759fd6" intensity={1.8}/>
 <Stars radius={70} depth={20} count={500} factor={2} saturation={0} fade speed={.15}/>
 <Villa journey={journey}/><CameraRig journey={journey}/>
 </Canvas></RenderBoundary></div>;
}
