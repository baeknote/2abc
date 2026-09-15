import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js';

const host=document.querySelector('#canvasHost');
const speed=document.querySelector('#speed');
const speedValue=document.querySelector('#speedValue');
const speedReadout=document.querySelector('#speedReadout');
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(34,1,.1,100);
camera.position.set(8,4.7,11);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;
host.append(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.enablePan=false;controls.target.set(0,.3,0);
scene.add(new THREE.HemisphereLight(0xb8c9ff,0x1b1420,2.2));
const key=new THREE.DirectionalLight(0xffd8c3,3);key.position.set(-6,8,7);key.castShadow=true;scene.add(key);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.ShadowMaterial({color:0x080b13,opacity:.52}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.5;floor.receiveShadow=true;scene.add(floor);
const root=new THREE.Group();root.rotation.y=-.47;scene.add(root);
const cream=new THREE.MeshStandardMaterial({color:0xf1c99d,roughness:.8});
const orange=new THREE.MeshStandardMaterial({color:0xc85d38,roughness:.76});
const dark=new THREE.MeshStandardMaterial({color:0x392925,roughness:.72});
const metal=new THREE.MeshStandardMaterial({color:0xd9b49a,metalness:.65,roughness:.35});
const black=new THREE.MeshStandardMaterial({color:0x16161d,roughness:.4});
function add(g,m,p,s=[1,1,1],parent=root){const x=new THREE.Mesh(g,m);x.position.set(...p);x.scale.set(...s);x.castShadow=x.receiveShadow=true;parent.add(x);return x}
add(new THREE.SphereGeometry(1,32,20),cream,[0,.18,0],[2.72,1.32,1.28]);
add(new THREE.SphereGeometry(1,32,20),orange,[-.65,.65,1.04],[.9,.58,.3]);
const head=new THREE.Group();root.add(head);
add(new THREE.SphereGeometry(1,32,20),cream,[-2.25,.62,0],[1.45,1.3,1.2],head);
add(new THREE.ConeGeometry(.48,.95,3),orange,[-2.93,1.9,.57],[1,1,1],head).rotation.z=-.24;
add(new THREE.ConeGeometry(.48,.95,3),cream,[-1.86,1.94,.55],[1,1,1],head).rotation.z=.18;
const eyeL=add(new THREE.SphereGeometry(1,16,12),black,[-2.67,.83,1.15],[.17,.23,.09],head);
const eyeR=add(new THREE.SphereGeometry(1,16,12),black,[-1.93,.83,1.15],[.17,.23,.09],head);
const chimney=add(new THREE.CylinderGeometry(.27,.27,.85,24),metal,[1.35,1.68,0]);
const wheels=[];for(const x of[-1.65,.15,1.8,3.15])for(const z of[-1.2,1.2]){const w=new THREE.Group();w.position.set(x,-1.05,z);w.rotation.x=Math.PI/2;add(new THREE.TorusGeometry(.58,.15,12,28),dark,[0,0,0],[1,1,1],w);add(new THREE.CylinderGeometry(.18,.18,.27,18),metal,[0,0,0],[1,1,1],w);root.add(w);wheels.push(w)}
for(const z of[-1.6,1.6])add(new THREE.BoxGeometry(16,.08,.08),metal,[0,-1.47,z],[1,1,1],scene);for(let x=-7;x<8;x+=.55)add(new THREE.BoxGeometry(.13,.07,3.7),dark,[x,-1.54,0],[1,1,1],scene);
let exploded=0,targetExplode=0,soundOn=false,audio;
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1900)}
function sound(meow=false){if(!soundOn)return;if(!audio)audio=new AudioContext();const t=audio.currentTime,o=audio.createOscillator(),g=audio.createGain();o.connect(g).connect(audio.destination);o.frequency.setValueAtTime(meow?480:58,t);o.frequency.exponentialRampToValueAtTime(meow?190:52,t+(meow ? .42 : .16));g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(meow ? .13 : .018,t+.05);g.gain.exponentialRampToValueAtTime(.001,t+(meow ? .48 : .16));o.start(t);o.stop(t+(meow ? .5 : .18))}
function resize(){const r=host.getBoundingClientRect();camera.aspect=r.width/r.height;camera.updateProjectionMatrix();renderer.setSize(r.width,r.height)}
addEventListener('resize',resize);resize();
speed.addEventListener('input',()=>{speedValue.textContent=speed.value;speedReadout.textContent=speed.value+' KM/H';sound()});
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{const views={side:[8,4.7,11],front:[.2,2.7,14],above:[7,11,7]};camera.position.fromArray(views[b.dataset.view]);document.querySelectorAll('[data-view]').forEach(x=>x.classList.toggle('active',x===b))}));
document.querySelector('#orbitButton').addEventListener('click',e=>{controls.autoRotate=!controls.autoRotate;e.currentTarget.setAttribute('aria-pressed',controls.autoRotate);toast(controls.autoRotate?'Orbit engaged.':'Orbit paused.')});
document.querySelector('#explodeButton').addEventListener('click',e=>{targetExplode=targetExplode?0:1;e.currentTarget.setAttribute('aria-pressed',!!targetExplode);toast(targetExplode?'A soft machine, unmade.':'Back on the rails.')});
document.querySelector('#soundToggle').addEventListener('click',e=>{soundOn=!soundOn;e.currentTarget.setAttribute('aria-pressed',soundOn);document.querySelector('#soundState').textContent=soundOn?'ON':'OFF';sound()});
document.querySelector('#meowButton').addEventListener('click',()=>{sound(true);toast('Mrrp.')});document.querySelector('#hintButton').addEventListener('click',()=>toast('Drag, scroll, or use the views below.'));
const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime(),v=Number(speed.value)/80;wheels.forEach(w=>w.rotation.z-=.016+v*.22);head.rotation.y=Math.sin(t*1.3)*.035;eyeL.scale.y=eyeR.scale.y=Math.max(.08,Math.sin(t*2.3)>.995?.1:1);chimney.position.y=1.68+Math.sin(t*2.2)*.02;exploded+=(targetExplode-exploded)*.055;head.position.x=-exploded*1.8;wheels.forEach((w,i)=>w.position.y=-exploded*.65+(i%2?0:.1));controls.update();renderer.render(scene,camera)}animate();
