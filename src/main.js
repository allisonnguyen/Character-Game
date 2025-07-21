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

const BASE_COLOR = 0xf0f0f0f0;

/**  -------------------------- Loader Preparations -------------------------- */
const textureLoader = new THREE.TextureLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const textures = new Map();
const models = new Map();

/**  ------------------------------- Textures ------------------------------- */
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

/**  -------------------------------- Models -------------------------------- */
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
            child.material = new THREE.MeshStandardMaterial({ color: BASE_COLOR });
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

/**  ---------------------------- Setup UI Panels ---------------------------- */
function initCategories() {
  const categoryButtons = document.querySelectorAll('.category-btn');
  const optionPanels = document.querySelectorAll('.options-content');

  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      optionPanels.forEach(panel => panel.classList.remove('active'));

      button.classList.add('active');

      const optionsType = button.dataset.options;
      const targetPanel = document.querySelector(`.options-content[data-options="${optionsType}"]`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

function createSkinGrid() {
    const skinOptionsContainer = document.querySelector('.skin-options');
    skinOptionsContainer.innerHTML = '';

    // Create first row
    const row1 = document.createElement('div');
    row1.className = 'skin-options-row';
    
    // Create second row
    const row2 = document.createElement('div');
    row2.className = 'skin-options-row';

    // Split skin codes into two groups
    const half = Math.ceil(skinCodes.length / 2);
    const firstRowColors = skinCodes.slice(0, half);
    const secondRowColors = skinCodes.slice(half);

    // Add buttons to first row
    firstRowColors.forEach((color, index) => {
        const button = createSkinButton(color, index === 0);
        row1.appendChild(button);
    });

    // Add buttons to second row
    secondRowColors.forEach((color, index) => {
        const button = createSkinButton(color, false);
        row2.appendChild(button);
    });

    skinOptionsContainer.appendChild(row1);
    skinOptionsContainer.appendChild(row2);

    initSkinOptions();
}

function createSkinButton(color, isActive) {
    const button = document.createElement('button');
    button.className = 'skin-option';
    if (isActive) button.classList.add('active');
    button.dataset.color = color;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', '0 -0.5 96 96');
    svg.setAttribute('shape-rendering', 'crispEdges');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke', color);
    path.setAttribute('d', 'M47 11h15M43 12h23M40 13h29M38 14h34M35 15h38M33 16h42M32 17h45M30 18h48M29 19h50M28 20h52M27 21h53M26 22h55M26 23h56M25 24h57M24 25h59M24 26h59M23 27h60M23 28h60M22 29h62M22 30h62M22 31h62M21 32h64M21 33h64M21 34h64M21 35h64M21 36h64M21 37h64M21 38h64M21 39h64M21 40h63M21 41h63M20 42h64M19 43h64M18 44h65M17 45h65M16 46h66M15 47h66M15 48h65M14 49h66M14 50h65M13 51h65M13 52h65M12 53h67M12 54h67M11 55h68M11 56h69M11 57h69M11 58h69M11 59h69M11 60h69M11 61h69M11 62h69M12 63h68M12 64h67M12 65h67M13 66h66M13 67h65M13 68h65M14 69h63M14 70h63M15 71h61M15 72h60M16 73h59M17 74h57M18 75h55M19 76h53M20 77h51M22 78h48M23 79h45M25 80h41M27 81h37M29 82h32M33 83h24M39 84h13');
    
    svg.appendChild(path);
    button.appendChild(svg);
    return button;
}

function initSkinOptions() {
  const skinOptions = document.querySelectorAll('.skin-option');
  
  skinOptions.forEach(option => {
    option.addEventListener('click', () => {
      skinOptions.forEach(opt => opt.classList.remove('active'));
      
      option.classList.add('active');

      const color = option.dataset.color;
            
      updateSkinColor(color);
    });
  });
}

function updateSkinColor(color) {
  const threeColor = new THREE.Color(color);
  
  const bodyParts = [
    models.get("Body"),
    models.get("Head"),
  ];
  
  bodyParts.forEach(part => {
    if (part && part.material) {
      part.material.color.copy(threeColor);
    }
  });
}

/**  ----------------------------- Setup Render ----------------------------- */
async function init() {
  // Load assets
  const texturePromises = texturePaths.map(loadTexture);
  const modelPromises = modelPaths.map(loadModel);
  try {
    await Promise.all([...texturePromises, ...modelPromises]);
  } catch(err) {
    console.error("Error loading assets: ", err);
  }

  createSkinGrid();
  //createEyeGrid();
  //createHairGrid();
  //createNoseGrid();
  //createMakeupGrid();

  // Environment
  const experienceContainer = document.querySelector("#experience-container");
  const canvas = document.querySelector("#experience-canvas")
  
  const sizes =  {
    width: experienceContainer.clientWidth,
    height: experienceContainer.clientHeight
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BASE_COLOR);

  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
  camera.position.set(0, 1, 5);

  // Directional
  const sun = new THREE.DirectionalLight(0xffffff);
  sun.castShadow = true;
  sun.shadow.mapSize = new THREE.Vector2(1024, 1024);
  sun.position.set(50, 50, 50);
  sun.shadow.normalBias = 0.1;
  scene.add(sun);

  // Ambient
  const ambient = new THREE.AmbientLight(0x404040, 50);
  scene.add(ambient);
 
  // Helpers
  const shadowHelper = new THREE.CameraHelper(sun.shadow.camera);
  scene.add(shadowHelper);
  const helper = new THREE.DirectionalLightHelper(sun, 5);
  scene.add(helper);

  // Floor
  var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
  var floorMaterial = new THREE.MeshPhongMaterial({
      color: BASE_COLOR,
      shininess: 0,
  });
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -0.5 * Math.PI;
  floor.receiveShadow = true;
  floor.position.y = 0;
  // scene.add(floor);

  // Body Meshes
  scene.add(models.get("Body"));
  scene.add(models.get("Left Iris"));
  scene.add(models.get("Left Pupil"));
  scene.add(models.get("Right Iris"));
  scene.add(models.get("Right Pupil"));
  scene.add(models.get("Eyebrows"));

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  // Orbit Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.75, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 3;
  controls.maxDistance = 10;
  controls.enablePan = false;
  controls.update();

  const settingsButton = document.getElementById('settings');
  settingsButton.addEventListener('click', () => {
    console.log("Settings");
  });

  const resetButton = document.getElementById('reset-view');
  resetButton.addEventListener('click', () => {
    camera.position.set(0, 1, 5);
    controls.target.set(0, 0.75, 0);
    controls.update();
  });

  // Event Listeners
  window.addEventListener("resize", () => {
    sizes.width = experienceContainer.clientWidth;
    sizes.height = experienceContainer.clientHeight;

    // Update Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update Renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  function render() {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
  }

  render();
  initCategories();
}

init();