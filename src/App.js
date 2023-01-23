import * as THREE from 'three'
import ThreeGlobe from 'three-globe'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {useEffect} from 'react'
import Footer from './footer'
import './App.css';
import countries from './custom.geo.json'
import map from './map.json'
import lines from './lines.json' 

function App() {
  useEffect(()=>{
  var renderer , camera,scene,controls,canvas
 let mouseX = 0
 let mouseY = 0 
 let windowHalfX = window.innerWidth/2
 let windowHalfY = window.innerHeight/2
 var Globe
 canvas = document.getElementById('myGlobe')
 renderer = new THREE.WebGLRenderer({canvas,antialias:true})
 renderer.setPixelRatio(window.devicePixelRatio)
 renderer.setSize(window.innerWidth, window.innerHeight)



 scene = new THREE.Scene()

 var ambientLight = new THREE.AmbientLight(0xbbbbbb,0.3)
 scene.add(ambientLight)
 scene.background = new THREE.Color(0x040d21)


 camera = new THREE.PerspectiveCamera()
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()

var dLight = new THREE.DirectionalLight(0xffffff,0.8)
dLight.position.set(-800,2000,400)
camera.add(dLight)

var dLight2 = new THREE.DirectionalLight(0x7982f6,1)
dLight2.position.set(-200,500,200)
camera.add(dLight2)

var dLight3 = new THREE.PointLight(0x8566cc,0.5)
dLight3.position.set(-200,500,200)
camera.add(dLight3)

camera.position.z = 400
camera.position.x = 0
camera.position.y = 0

scene.add(camera)
scene.fog = new THREE.Fog(0x535ef3,400,2000)
controls = new OrbitControls(camera,renderer.domElement)
controls.enableDamping = true
controls.dynamicDampingFactor = 0.01
controls.enablePan = false
controls.minDistance=200
controls.maxDistance=500
controls.rotateSpeed=0.5
controls.autoRotate = true

controls.minPolarAngle = Math.PI/3.5
controls.maxPolarAngle = Math.PI - Math.PI/3

const onWindowResize = () =>{
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  windowHalfX = window.innerWidth / 1.5
  windowHalfY = window.innerHeight / 1.5
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const onMouseMove = (event) =>{
  mouseX = event.clientX - windowHalfX
  mouseY = event.clientY - windowHalfY
}

window.addEventListener('resize',onWindowResize,false)
document.addEventListener('mousemove',onMouseMove)


Globe = new ThreeGlobe({
  waitForGlobeReady:true,
  animateIn:true,
})

.hexPolygonsData(countries.features)
.hexPolygonResolution(3)
.hexPolygonMargin(0.7)
.showAtmosphere(true)
.atmosphereColor('#3a228a')
.atmosphereAltitude(0.25)

setTimeout(()=>{
  Globe.arcsData(lines.pulls)
    .arcColor((e)=>{
      return e.status ? '#9cff00':'#ff4000' 
    })
    .arcAltitude((e)=>{
      return e.arcAlt
    })
    .arcStroke((e)=>{
      return e.status ? 0.5:0.3
    })
    .arcDashLength(0.9)
    .arcDashGap(4)
    .arcDashAnimateTime(1000)
    .arcsTransitionDuration(1000)
    .arcDashInitialGap((e)=>e.order*1)
    .labelsData(map.Maps)
    .labelColor(()=>"#ffcb21")

    .labelDotRadius(0.3)
    .labelSize((e)=>e.size)
    .labelText("city")
    .labelResolution(6)
    .labelAltitude(0.01)
    .pointsData(map.Maps)
    .pointColor(()=>"#ffffff")
    .pointsMerge(true)
    .pointAltitude(0.07)
    .pointRadius(0.05)
},1000)


Globe.rotateY(-Math.PI*(5/9))
Globe.rotateZ(-Math.PI/6)
const globeMaterial = Globe.globeMaterial()
globeMaterial.color = new THREE.Color(0x3a228a)
globeMaterial.emissive = new THREE.Color(0x220038)
globeMaterial.emissiveIntensity = 0.1
globeMaterial.shininess = 0.7


scene.add(Globe)





const animate = () =>{
  //camera.position.x += Math.abs(mouseX) <= windowHalfX/2 ? (mouseX/2 - camera.position.x)*0.005:0
  //camera.position.y += (-mouseY/2-camera.position.y)*0.005 <=windowHalfY/2?Math.abs(mouseY):0
  //camera.lookAt(scene.position)
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}
animate()
},[])

  return (
    <>
    <canvas id = 'myGlobe' />
    <Footer />
    </>
  );
}

export default App;
