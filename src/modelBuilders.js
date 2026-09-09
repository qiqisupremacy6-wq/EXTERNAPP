import * as THREE from 'three';

// Modelos geométricos de ensino. Retorna uma atualização opcional de animação.
export function addTeachingModel(kind,group) {
  const material=(color,opacity=1)=>new THREE.MeshStandardMaterial({color,transparent:opacity<1,opacity,roughness:.38,side:THREE.DoubleSide});
  function mesh(geo,mat,label,pos=[0,0,0]){const m=new THREE.Mesh(geo,mat);m.position.set(...pos);m.userData.label=label;group.add(m);return m;}
  function line(points,color,label){const m=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color}));m.userData.label=label;group.add(m);return m;}
  function rod(a,b,mat,label){const delta=b.clone().sub(a);const m=mesh(new THREE.CylinderGeometry(.065,.065,delta.length(),12),mat,label);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());}
  if(kind==='solids'){
    mesh(new THREE.CylinderGeometry(1.15,1.15,3.8,64),material(0x2775eb,.55),'Cilindro · V = πr²h',[-1.6,0,0]);
    mesh(new THREE.ConeGeometry(1.15,3.8,64),material(0xffc621,.9),'Cone · V = πr²h/3',[1.6,0,0]);
  }else if(kind==='wave'){
    const positions=Array.from({length:121},(_,i)=>new THREE.Vector3(-4+i/15,0,0));
    const wave=line(positions,0x1763dc,'Onda transversal · a perturbação se propaga horizontalmente');
    const marker=mesh(new THREE.SphereGeometry(.17,24,16),material(0xffbf00),'Ponto do meio · oscila verticalmente sem acompanhar o avanço da onda');
    line([new THREE.Vector3(-4,0,0),new THREE.Vector3(4,0,0)],0x9aacc4,'Posição de equilíbrio');
    return time=>{const phase=time*.002,attr=wave.geometry.attributes.position;for(let i=0;i<121;i++){const x=-4+i/15;attr.setY(i,Math.sin(x*1.7-phase)*1.1);}attr.needsUpdate=true;wave.geometry.computeBoundingSphere();marker.position.y=Math.sin(-phase)*1.1;};
  }else if(kind==='dna'){
    const backbone=[material(0x246ceb),material(0x13a7a0)],baseMaterials=[material(0xffbc21),material(0xf07751),material(0xa779e2),material(0x43beb3)];
    const point=(t,side)=>new THREE.Vector3(Math.cos(t*.52+side*Math.PI)*1.2,(t-8.5)*.32,Math.sin(t*.52+side*Math.PI)*1.2);
    for(let side=0;side<2;side++){
      const curve=new THREE.CatmullRomCurve3(Array.from({length:69},(_,i)=>point(i/4,side)));
      mesh(new THREE.TubeGeometry(curve,100,.1,10,false),backbone[side],`Cadeia ${side+1} · esqueleto de açúcar e fosfato`);
    }
    for(let i=0;i<18;i++){
      const a=point(i,0),b=point(i,1),mid=a.clone().add(b).multiplyScalar(.5),pair=i%2===0?['Adenina (A) · complementar à timina','Timina (T) · complementar à adenina']:['Citosina (C) · complementar à guanina','Guanina (G) · complementar à citosina'];
      rod(a,mid,baseMaterials[(i%2)*2],pair[0]);rod(mid,b,baseMaterials[(i%2)*2+1],pair[1]);
    }
  }else if(kind==='globe'){
    mesh(new THREE.SphereGeometry(2.2,48,32),material(0x2879d5,.38),'Globo de referência · paralelos e meridianos');
    const p=(lat,lon)=>new THREE.Vector3(2.22*Math.cos(lat)*Math.sin(lon),2.22*Math.sin(lat),2.22*Math.cos(lat)*Math.cos(lon));
    for(const degrees of [-60,-30,0,30,60]){
      const latitude=degrees*Math.PI/180;
      line(Array.from({length:97},(_,i)=>p(latitude,i/96*Math.PI*2)),degrees===0?0xf3ae00:0x629acb,degrees===0?'Equador · latitude 0°':`Paralelo · latitude ${Math.abs(degrees)}° ${degrees>0?'N':'S'}`);
    }
    for(let degrees=0;degrees<360;degrees+=30){
      line(Array.from({length:49},(_,i)=>p(-Math.PI/2+i/48*Math.PI,degrees*Math.PI/180)),degrees===0?0xde493d:0x629acb,degrees===0?'Greenwich · longitude 0°':`Meridiano · ${degrees<=180?degrees+'° L':(360-degrees)+'° O'}`);
    }
  }
  return null;
}
