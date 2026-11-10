"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
export type WorkMode="building"|"conduit"|"repair"|"earthing";
function Cable({points,color="#eabf54",radius=.035}:{points:[number,number,number][];color?:string;radius?:number}){
 const curve=useMemo(()=>new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,"catmullrom",.1),[points]);
 return <mesh><tubeGeometry args={[curve,40,radius,8,false]}/><meshStandardMaterial color={color} metalness={.6} roughness={.3} emissive={color} emissiveIntensity={.22}/></mesh>;
}
function Model({mode,paused}:{mode:WorkMode;paused:boolean}){
 const root=useRef<THREE.Group>(null);const rotor=useRef<THREE.Group>(null);
 useFrame((state,dt)=>{if(root.current&&!paused)root.current.rotation.y=THREE.MathUtils.lerp(root.current.rotation.y,state.pointer.x*.08,.03);if(rotor.current&&!paused)rotor.current.rotation.z+=Math.min(dt,.04)*.35;});
 if(mode==="repair")return <group ref={root} position={[2,0,0]} rotation={[.15,-.25,0]}>
  <mesh position={[0,-1.65,0]} receiveShadow><boxGeometry args={[7,.2,4]}/><meshStandardMaterial color="#262a2d" roughness={.6}/></mesh>
  <group rotation={[Math.PI/2,0,0]} position={[0,-.3,0]}>
   <mesh position={[0,0,-.8]}><cylinderGeometry args={[.95,.95,.13,40]}/><meshStandardMaterial color="#798089" metalness={.9} roughness={.25}/></mesh>
   <mesh position={[0,0,-.2]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.68,.2,12,48]}/><meshStandardMaterial color="#b66533" metalness={.8} roughness={.25}/></mesh>
   {Array.from({length:16},(_,i)=><mesh key={i} position={[Math.sin(i*Math.PI/8)*.7,Math.cos(i*Math.PI/8)*.7,-.2]} rotation={[Math.PI/2,0,i*Math.PI/8]}><torusGeometry args={[.18,.035,6,14]}/><meshStandardMaterial color="#d98740" metalness={.9} roughness={.22}/></mesh>)}
   <mesh position={[0,0,.6]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.12,.12,2.2,24]}/><meshStandardMaterial color="#adb5bc" metalness={1} roughness={.2}/></mesh>
   <group ref={rotor} position={[0,0,1.7]}>
    <mesh><sphereGeometry args={[.2,20,16]}/><meshStandardMaterial color="#cabf9c" metalness={.7} roughness={.35}/></mesh>
    {[0,1,2].map(i=><group rotation={[0,0,i*Math.PI*2/3]} key={i}><mesh position={[0,.95,0]} scale={[.2,1.15,.04]}><sphereGeometry args={[1,20,10]}/><meshStandardMaterial color="#c9c7ba" metalness={.6} roughness={.3}/></mesh></group>)}
   </group>
  </group>
  <Cable color="#edc452" points={[[-2,-1.5,1],[-1.6,-1.45,.6],[-1,-.8,0],[0,-.3,0]]}/>
 </group>;
 if(mode==="earthing")return <group ref={root} position={[2,0,0]}>
  <mesh position={[0,-1,0]}><boxGeometry args={[5,2,4]}/><meshStandardMaterial color="#40372d" transparent opacity={.75}/></mesh>
  <mesh position={[0,-.2,0]}><cylinderGeometry args={[.07,.07,4,20]}/><meshStandardMaterial color="#cd8e45" metalness={.9} roughness={.25}/></mesh>
  <Cable color="#d3b951" points={[[0,1.5,0],[0,1.7,.4],[1.5,1.7,.6],[2,1,.6],[2,1,2.5]]}/>
  <mesh position={[0,1.4,0]}><boxGeometry args={[.3,.13,.22]}/><meshStandardMaterial color="#d2bd76" metalness={.8}/></mesh>
  <gridHelper args={[8,16,"#d7b855","#5a513c"]} position={[0,.05,0]}/>
 </group>;
 return <group ref={root} position={[2,-.5,0]}>
  {[0,1,2].map(f=><group key={f}>
   <mesh position={[0,f*2.2,0]} receiveShadow><boxGeometry args={[7,.15,5]}/><meshStandardMaterial color="#69717a" roughness={.9}/></mesh>
   {f<2&&[-3,3].flatMap(x=>[-2,2].map(z=><mesh key={`${x}-${z}`} position={[x,f*2.2+1.1,z]}><boxGeometry args={[.3,2.2,.3]}/><meshStandardMaterial color="#6d7378" roughness={.9}/></mesh>))}
  </group>)}
  <group position={[0,4.52,0]}>
   {Array.from({length:12},(_,i)=><mesh key={i} position={[-3.2+i*.58,.02,0]}><boxGeometry args={[.015,.015,4.8]}/><meshStandardMaterial color="#675342" metalness={.6}/></mesh>)}
   {[-1.3,0,1.3].map((z,i)=><group key={i}><Cable points={[[-3,.1,z],[-1.5,.1,z],[-1,.1,0],[1,.1,0],[2.8,.1,z]]}/><mesh position={[2.8,.1,z]}><cylinderGeometry args={[.18,.18,.14,12]}/><meshStandardMaterial color="#d1ac46" metalness={.3}/></mesh></group>)}
   <Cable color="#f3cc64" points={[[0,.1,0],[0,.1,2],[0,-.8,2.3],[0,-2.5,2.3]]}/>
  </group>
  <gridHelper args={[18,24,"#6d6549","#19242b"]} position={[0,-.2,0]}/>
 </group>;
}
function Camera({mode}:{mode:WorkMode}){useFrame(({camera},dt)=>{const target=mode==="conduit"?new THREE.Vector3(9,11,10):mode==="building"?new THREE.Vector3(12,7,14):new THREE.Vector3(7,4,9);camera.position.lerp(target,Math.min(dt*3,1));camera.lookAt(2,mode==="building"||mode==="conduit"?2:0,0);});return null;}
export default function WorkScene({mode,paused=false}:{mode:WorkMode;paused?:boolean}){return <Canvas dpr={[1,1.25]} camera={{position:[12,7,14],fov:42}} gl={{alpha:true,antialias:true}}><ambientLight intensity={1.5}/><directionalLight position={[3,9,7]} intensity={3} color="#c4d6ef"/><pointLight position={[3,2,4]} intensity={30} color="#ffc363"/><Model mode={mode} paused={paused}/><Camera mode={mode}/></Canvas>;}
