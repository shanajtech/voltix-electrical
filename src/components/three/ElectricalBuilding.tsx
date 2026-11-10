"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import * as THREE from "three";
import type { Language } from "@/app/page";

class SceneBoundary extends Component<{children: ReactNode; fallback: ReactNode}, {failed: boolean}> {
  state = {failed: false};
  static getDerivedStateFromError() { return {failed: true}; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
function Building({powered, reduced}: {powered: boolean; reduced: boolean}) {
  const root = useRef<THREE.Group>(null);
  const fan = useRef<THREE.Group>(null);
  const windows = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const energy = useRef<THREE.Mesh>(null);
  const speed = useRef({value: 0});
  useEffect(() => {
    const tl = gsap.timeline();
    windows.current.forEach((material, index) => {
      if (material) tl.to(material, {emissiveIntensity: powered ? 2.4 : 0, duration: reduced ? 0 : .45}, reduced ? 0 : index * .16 + .4);
    });
    tl.to(speed.current, {value: powered && !reduced ? 3.5 : 0, duration: reduced ? 0 : 1.4}, reduced ? 0 : .8);
    return () => {tl.kill();};
  }, [powered, reduced]);
  useFrame((state, delta) => {
    if (fan.current) fan.current.rotation.z -= Math.min(delta, .05) * speed.current.value;
    if(root.current && !reduced) root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, state.pointer.x * .12, .025);
    if(energy.current) {
      energy.current.visible = powered;
      energy.current.position.x = reduced ? 0 : -3.4 + ((state.clock.elapsedTime * 1.2) % 3.4);
    }
  });
  return <group ref={root}>
    <RoundedBox args={[5, .22, 3.8]} position={[0,-2.15,0]} radius={.08}><meshStandardMaterial color="#252e40" /></RoundedBox>
    <RoundedBox args={[4.3,4,2.3]} radius={.06}><meshStandardMaterial color="#1c293d" metalness={.35} roughness={.5}/></RoundedBox>
    {[0,1,2].map(floor => <group key={floor}>
      <mesh position={[0,-1.5+floor*1.25,1.18]}><boxGeometry args={[4.5,.1,.12]}/><meshStandardMaterial color="#a58b4d" metalness={.7} roughness={.3}/></mesh>
      {[0,1,2].map(col => <group key={col} position={[-1.4+col*1.4,-.95+floor*1.25,1.18]}>
        <mesh><boxGeometry args={[1.02,.85,.07]}/><meshStandardMaterial color="#263145" emissive="#ffbf53" ref={m=>{windows.current[floor*3+col]=m;}} emissiveIntensity={0}/></mesh>
        <mesh position={[0,0,.05]}><boxGeometry args={[.035,.85,.04]}/><meshStandardMaterial color="#151b28"/></mesh>
      </group>)}
    </group>)}
    <mesh position={[0,2.08,0]}><boxGeometry args={[4.8,.2,2.8]}/><meshStandardMaterial color="#354156"/></mesh>
    <mesh position={[-1.55,2.35,-.4]}><boxGeometry args={[.7,.4,.7]}/><meshStandardMaterial color="#182234"/></mesh>
    <mesh position={[2.18,0,0]}><boxGeometry args={[.12,4,2.4]}/><meshStandardMaterial color="#344057"/></mesh>
    <group position={[0,-.85,1.35]}>
      <mesh position={[0,.4,0]}><cylinderGeometry args={[.025,.025,.35,8]}/><meshStandardMaterial color="#fff1b8"/></mesh>
      <group ref={fan} position={[0,.25,.04]}>
        {[0,1,2].map(i=><mesh key={i} rotation={[0,0,i*Math.PI*2/3]} position={[0,0,.02]}><boxGeometry args={[.09,.9,.025]}/><meshStandardMaterial color="#101725"/></mesh>)}
        <mesh><sphereGeometry args={[.1,12,12]}/><meshStandardMaterial color="#e4b94c"/></mesh>
      </group>
    </group>
    <mesh position={[-2.8,-1.95,1.3]}><boxGeometry args={[1.3,.035,.035]}/><meshBasicMaterial color="#d7a632"/></mesh>
    <mesh ref={energy} position={[-3,-1.95,1.35]}><sphereGeometry args={[.09,12,12]}/><meshBasicMaterial color="#fff0aa"/></mesh>
    <gridHelper args={[14,20,"#65572d","#1a2435"]} position={[0,-2.3,0]}/>
  </group>;
}
export default function ElectricalBuilding({language}: {language: Language}) {
  const [powered,setPowered] = useState(true);
  const [replay,setReplay] = useState(0);
  const [reduced,setReduced] = useState(false);
  useEffect(()=>{const mq=matchMedia("(prefers-reduced-motion: reduce)"); const update=()=>setReduced(mq.matches); update(); mq.addEventListener("change",update); return ()=>mq.removeEventListener("change",update);},[]);
  const bn=language==="bn";
  const fallback=<div className="scene-fallback">⌂<p>{bn?"আপনার ঘরে আলোর সংযোগ":"Bringing your space to life"}</p></div>;
  return <div className="electrical-building">
    <div className="scene-label"><span/> {bn?"বিদ্যুতের ছোঁয়ায় প্রাণবন্ত":"SPACES, BROUGHT TO LIFE"}</div>
    <div className="scene-canvas" role="img" aria-label={bn?"ইন্টারেক্টিভ থ্রিডি বিল্ডিং, জানালার আলো ও ঘূর্ণায়মান ফ্যান":"Interactive 3D building with illuminated windows and rotating fan"}>
      <SceneBoundary fallback={fallback}><Canvas dpr={[1,1.5]} camera={{position:[7,4.5,9],fov:38}} gl={{antialias:true,alpha:true}} fallback={fallback}>
        <ambientLight intensity={1.4}/><directionalLight position={[4,8,5]} intensity={3} color="#c4d7ff"/>
        <pointLight position={[-3,2,4]} intensity={25} color="#ffd476"/>
        <Building key={replay} powered={powered} reduced={reduced}/>
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={.9} maxPolarAngle={1.4} minAzimuthAngle={-.7} maxAzimuthAngle={1.1} target={[0,0,0]}/>
      </Canvas></SceneBoundary>
    </div>
    <div className="scene-controls"><button aria-pressed={powered} onClick={()=>setPowered(!powered)}><span className={powered?"power-dot on":"power-dot"}/> {bn?(powered?"বিদ্যুৎ চালু":"বিদ্যুৎ বন্ধ"):(powered?"POWER ON":"POWER OFF")}</button><button onClick={()=>{setPowered(true);setReplay(replay+1);}}>{bn?"আবার দেখুন":"REPLAY"} ↻</button></div>
    <p className="scene-caption">{bn?"ঘুরিয়ে দেখতে টেনে নিন · ধারণামূলক থ্রিডি দৃশ্য":"DRAG TO EXPLORE · CONCEPTUAL 3D VISUAL"}</p>
  </div>;
}
