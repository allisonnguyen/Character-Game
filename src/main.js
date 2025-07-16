import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const texturePaths = [];

const modelPaths = [
  'models/body/head.glb',
  'models/body/base.glb',
  'models/body/eyebrows.glb',
  'models/body/left-eye.glb',
  'models/body/right-eye.glb',
  'models/clothing/askirt.glb',
  'models/clothing/lskirt.glb',
  'models/clothing/pants.glb',
  'models/clothing/shorts.glb',
  'models/clothing/tshirt.glb',
  'models/clothing/yshirt.glb',
  'models/hair/spikey.glb',
  'models/hair/wavy.glb',
];

const skinCodes = [ 
  '#f0f0f0',              // base
  '#f8d6bf',              // light
  '#e7b292',              // medium
  '#a45f41',              // tan
  '#6e442a',              // dark
  '#2c1c11',              // deep
];

const eyeCodes = [
  '#686867',
  '#9a7356',
  '#59b3ae',
  '#91a57b',
  '#577fd8',
  '#9a95a9',
];

const hairCodes = [
  '#edeb2f',
  '#583c36',
  '#814043',
  '#bf502f',
  '#f1ce34',
  '#92908f',
  '#cfc9b7',
  '#3087d0',
  '#9dbcca',
  '#34984f',
  '#57cbb5',
  '#f54e4c',
  '#ff874c',
  '#dd98cf',
  '#f7aebd',
];

// Loaders
const textureLoader = new THREE.TextureLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

// Maps
const textures = new Map();
const models = new Map();

function loadTexture(path) {
  return new Promise((resolve, reject) => {
    textureLoader.load(
      path,
      (texture) => {
        const name = path.split('/').pop();
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;
        textures.set(name, texture);
        resolve(texture);
      },
      undefined,
      (error) => reject(error)
    );
  });
}

function loadModel(path) {
  return new Promise((resolve, reject) => {
    const nameMap = {
      "Sphere016": "Left Pupil",
      "Sphere016_1": "Left Iris",
      "Sphere015": "Right Pupil",
      "Sphere015_1": "Right Iris",
    };

    loader.load(
      path,
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ color: 0xf0f0f0 });
            child.castShadow = true;
            child.receiveShadow = true;
            
            if (nameMap[child.name]) {
              child.name = nameMap[child.name];
            }
            models.set(child.name, child);
          }
        });
        resolve(gltf);
      },
      undefined,
      (error) => reject(error)
    );
  });
}

async function init() {
  // Load assets
  const texturePromises = texturePaths.map(loadTexture);
  const modelPromises = modelPaths.map(loadModel);
  try {
    await Promise.all([...texturePromises, ...modelPromises]);
  } catch(err) {
    console.error("Error loading assets: ", err);
  }

  // console.log(textures);
  // console.log(models);

  // Environment
  const canvas = document.querySelector("#experience-canvas");
  const sizes =  {
    height: window.innerHeight,
    width: window.innerWidth
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  const camera = new THREE.PerspectiveCamera( 45, sizes.width / sizes.height, 0.1, 1000 );
  camera.position.set(0, 1, 5);

  const sun = new THREE.DirectionalLight(0xffffff);
  sun.castShadow = true;
  sun.position.set(50, 50, 50);
  sun.shadow.normalBias = 0.1;
  scene.add(sun);
 
  const shadowHelper = new THREE.CameraHelper(sun.shadow.camera);
  scene.add(shadowHelper);
  const helper = new THREE.DirectionalLightHelper(sun, 5);
  scene.add(helper);

  const ambient = new THREE.AmbientLight(0x404040, 50);
  scene.add(ambient);

  // Add base body meshes
  scene.add(models.get("Body"));
  scene.add(models.get("Left Iris"));
  scene.add(models.get("Left Pupil"));
  scene.add(models.get("Right Iris"));
  scene.add(models.get("Right Pupil"));
  scene.add(models.get("Eyebrows"));

  // Renderer
  const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
  renderer.setSize( sizes.width, sizes.height );
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  // Orbit Controls
  const controls = new OrbitControls( camera, renderer.domElement );
  controls.target.set(0, 0.75, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 3;
  controls.maxDistance = 10;
  controls.update();

  // Event Listeners
  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update Renderer
    renderer.setSize( sizes.width, sizes.height );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  const render = () => {
    controls.update();

    renderer.render( scene, camera );
    window.requestAnimationFrame(render);
  }

  render();
}

init();