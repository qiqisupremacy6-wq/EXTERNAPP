import React,{useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {addTeachingModel} from './modelBuilders';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {ArrowClockwise,Plus,Minus,Hand,ArrowLeft,ArrowRight} from '@phosphor-icons/react';

export function Scene({kind,angle=45}){
 const host=useRef(), api=useRef(),settings=useRef({rotate:false,wire:false,grid:true,paused:false,explode:1}); const [error,setError]=useState(false),[opts,setOpts]=useState(settings.current),[part,setPart]=useState('');
 function update(key,value){settings.current={...settings.current,[key]:value};setOpts(settings.current);} 
 useEffect(()=>{
  let renderer,frame,controls; const el=host.current;setError(false);setPart('');
  try{
   api.current=null;
   const scene=new THREE.Scene();scene.background=new THREE.Color('#edf3ff');
   const camera=new THREE.PerspectiveCamera(36,el.clientWidth/el.clientHeight,0.1,100);camera.position.set(8,5,10);
   renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(el.clientWidth,el.clientHeight);el.appendChild(renderer.domElement);
   renderer.outputColorSpace=THREE.SRGBColorSpace;
   scene.add(new THREE.AmbientLight(0xffffff,2.5));const light=new THREE.DirectionalLight(0xffffff,4);light.position.set(4,9,7);scene.add(light);
   controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=5;controls.maxDistance=22;
   const group=new THREE.Group();scene.add(group);
   const blue=new THREE.MeshPhysicalMaterial({color:0x2466ed,metalness:0.2,roughness:0.17,transparent:true,opacity:0.74,side:THREE.DoubleSide});
   const gold=new THREE.MeshStandardMaterial({color:0xffcc19,metalness:0.5,roughness:0.25});
   function sphere(radius,mat,pos){const m=new THREE.Mesh(new THREE.SphereGeometry(radius,32,24),mat);m.position.set(...pos);group.add(m);return m;}
   function rod(a,b,r,mat){const d=new THREE.Vector3().subVectors(b,a);const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),16),mat);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());group.add(m);}
   let animateModel=null;
   if(['solids','wave','dna','globe'].includes(kind)){animateModel=addTeachingModel(kind,group);
   }else if(kind==='geometry'){
    const shape=new THREE.Shape();shape.moveTo(-1.8,-1.3);shape.lineTo(1.8,-1.3);shape.lineTo(0,1.7);shape.closePath();const geo=new THREE.ExtrudeGeometry(shape,{depth:6,bevelEnabled:false});geo.translate(0,0,-3);group.add(new THREE.Mesh(geo,blue));
    group.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:0xe4b000})));
    for(const z of [-3,3])for(const [x,y] of [[-1.8,-1.3],[1.8,-1.3],[0,1.7]])sphere(.065,gold,[x,y,z]);group.rotation.y=-.28;
   }else if(kind==='chemistry'){
    sphere(.75,blue,[0,0,0]);for(const p of [[1,1,1],[-1,-1,1],[-1,1,-1],[1,-1,-1]]){const v=new THREE.Vector3(...p).multiplyScalar(1.6);sphere(.42,gold,v.toArray());rod(new THREE.Vector3(),v,.09,new THREE.MeshStandardMaterial({color:0xa0b6d3}));}
   }else if(kind==='physics'){
    const theta=angle*Math.PI/180,range=40*Math.sin(2*theta),points=[];for(let i=0;i<=70;i++){const x=range*i/70,y=x*Math.tan(theta)-10*x*x/(800*Math.cos(theta)**2);points.push(new THREE.Vector3(x/6-range/12,y/6-1,0));}
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0x125bde})));const m=sphere(.18,gold,points[0].toArray());api.current={ball:m,points};
   }else{
    sphere(2.2,new THREE.MeshPhysicalMaterial({color:0x9fcef0,transparent:true,opacity:.22,roughness:.4,side:THREE.DoubleSide}),[0,0,0]);sphere(.85,blue,[0,.2,0]);
    for(const p of [[1.3,.5,.7],[-1.1,-.9,.4],[.4,1.4,-.7],[-1.3,.8,-.4]]){const m=sphere(.4,gold,p);m.scale.set(1.5,.6,.8);m.rotation.z=.6;}
   }
   const grid=new THREE.GridHelper(16,16,0xc0d0e7,0xdce6f4);grid.position.y=-2.5;scene.add(grid);
   const ball=api.current?.ball,points=api.current?.points;api.current={camera,controls,group};
   group.children.forEach(o=>{o.userData.original=o.position.clone();});
   const ray=new THREE.Raycaster();ray.params.Line.threshold=.065;const pointer=new THREE.Vector2();let down;
   const startPick=e=>{down=[e.clientX,e.clientY];};
   const pick=e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(group.children).find(h=>h.object.isMesh||h.object.userData.label);if(!hit)return;const o=hit.object;setPart(o.userData.label||(kind==='geometry'?'Prisma triangular · 2 bases triangulares e 3 faces laterais':kind==='physics'?'Projétil · movimento sob ação da gravidade':kind==='chemistry'?(o.material===blue?'Carbono (C) · quatro ligações covalentes':o.material===gold?'Hidrogênio (H) · uma ligação covalente':'Ligação C–H · compartilhamento de elétrons'):(o.material===blue?'Núcleo · abriga o material genético':o.material===gold?'Mitocôndria · respiração celular e produção de ATP':'Membrana plasmática · delimita a célula')));};
   renderer.domElement.addEventListener('pointerdown',startPick);renderer.domElement.addEventListener('pointerup',pick);
   const resize=new ResizeObserver(()=>{if(!el.clientWidth||!el.clientHeight)return;camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();renderer.setSize(el.clientWidth,el.clientHeight);});resize.observe(el);
   let tick=0,last=performance.now();function animate(){frame=requestAnimationFrame(animate);const now=performance.now(),dt=Math.min(now-last,100);last=now;const o=settings.current;controls.update();grid.visible=o.grid;if(o.rotate)group.rotation.y+=dt*.00025;group.children.forEach(m=>{if(m.isMesh){m.material.wireframe=o.wire;if(kind==='biology'||kind==='chemistry')m.position.copy(m.userData.original).multiplyScalar(o.explode);}});if(!o.paused)tick+=dt;if(kind==='physics'&&ball){ball.position.copy(points[Math.floor(tick/45)%points.length]);}animateModel?.(tick);renderer.render(scene,camera);}animate();
   return ()=>{cancelAnimationFrame(frame);resize.disconnect();controls.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});renderer.dispose();renderer.domElement.remove();api.current=null;};
  }catch(e){setError(true);renderer?.dispose();}
 },[kind,angle]);
 const action=(type)=>{const a=api.current;if(!a)return;if(type==='reset'){a.camera.position.set(8,5,10);a.controls.target.set(0,0,0);a.group.rotation.set(0,kind==='geometry'?-.28:0,0);settings.current={rotate:false,wire:false,grid:true,paused:false,explode:1};setOpts(settings.current);setPart('');}else if(type==='front'){a.camera.position.set(0,0,13);}else if(type==='top'){a.camera.position.set(0,13,.01);}else if(type==='left'||type==='right'){a.group.rotation.y+=type==='left'?-.25:.25;}else a.camera.position.multiplyScalar(type==='in'?.85:1.15);};
 return <><div className="scene-wrap"><div className="scene" ref={host} role="img" aria-label={`Modelo 3D interativo: ${kind}. Use os controles para girar e ampliar.`}/>{error&&<div className="scene-fallback">Visualização 3D indisponível neste dispositivo. Use o roteiro e a descrição das estruturas. Em outro dispositivo com suporte a WebGL, o modelo poderá ser explorado.</div>}<div className="scene-tools">{[[ArrowClockwise,'reset','Restaurar vista'],[Plus,'in','Ampliar modelo'],[Minus,'out','Reduzir modelo'],[ArrowLeft,'left','Girar para esquerda'],[ArrowRight,'right','Girar para direita']].map(([Icon,t,label])=><button key={t} aria-label={label} title={label} onClick={()=>action(t)}><Icon size={20}/></button>)}</div><span className="scene-caption"><Hand size={15}/> Arraste para girar · clique em uma peça para investigar</span></div><details className="lab-options"><summary>Ferramentas de exploração</summary><div className="lab-option-buttons"><button aria-pressed={opts.rotate} onClick={()=>update('rotate',!opts.rotate)}>Rotação automática</button><button aria-pressed={opts.wire} onClick={()=>update('wire',!opts.wire)}>Ver estrutura</button><button aria-pressed={opts.grid} onClick={()=>update('grid',!opts.grid)}>Grade de referência</button><button onClick={()=>action('front')}>Vista frontal</button><button onClick={()=>action('top')}>Vista superior</button>{(kind==='physics'||kind==='wave')&&<button aria-pressed={opts.paused} onClick={()=>update('paused',!opts.paused)}>{opts.paused?'Retomar movimento':'Pausar movimento'}</button>}</div>{(kind==='biology'||kind==='chemistry')&&<label>Separar componentes · {opts.explode.toFixed(1)}×<input aria-label="Separar componentes" type="range" min="1" max="1.6" step="0.1" value={opts.explode} onChange={e=>update('explode',+e.target.value)}/><small>Vista esquemática ampliada; não representa novas proporções físicas.</small></label>}<p>Clique no modelo para identificar uma estrutura. Use a grade para comparar perspectivas.</p></details>{part&&<div className="part-info" role="status">{part}<button aria-label="Fechar identificação" onClick={()=>setPart('')}>×</button></div>}</>;
}
