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

const SWATCH_ICON_PATH = 'M47 11h15M43 12h23M40 13h29M38 14h34M35 15h38M33 16h42M32 17h45M30 18h48M29 19h50M28 20h52M27 21h53M26 22h55M26 23h56M25 24h57M24 25h59M24 26h59M23 27h60M23 28h60M22 29h62M22 30h62M22 31h62M21 32h64M21 33h64M21 34h64M21 35h64M21 36h64M21 37h64M21 38h64M21 39h64M21 40h63M21 41h63M20 42h64M19 43h64M18 44h65M17 45h65M16 46h66M15 47h66M15 48h65M14 49h66M14 50h65M13 51h65M13 52h65M12 53h67M12 54h67M11 55h68M11 56h69M11 57h69M11 58h69M11 59h69M11 60h69M11 61h69M11 62h69M12 63h68M12 64h67M12 65h67M13 66h66M13 67h65M13 68h65M14 69h63M14 70h63M15 71h61M15 72h60M16 73h59M17 74h57M18 75h55M19 76h53M20 77h51M22 78h48M23 79h45M25 80h41M27 81h37M29 82h32M33 83h24M39 84h13';

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

const hairstyles = {
  'Spikey': '/public/media/spikey_hair.png',
  'Wavy': '/public/media/wavy_hair.png',
}
const hairstyleNames = Object.keys(hairstyles);

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
    const eyeMap = {
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
            if (hairstyles[child.name]) {
              child.material.side = THREE.DoubleSide;
            }
            child.castShadow = true;
            child.receiveShadow = true;
            
            if (eyeMap[child.name]) {
              child.name = eyeMap[child.name];
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

/**
 * Creates a color swatch button with an SVG icon
 * @param {string} swatchClass - CSS class for the button
 * @param {string} color - Color value in hex format
 * @param {boolean} isActive - Whether the swatch should be active initially
 * @returns {HTMLButtonElement} The created swatch button
 */
function createSwatch(swatchClass, color, isActive) {
    const button = document.createElement('button');
    button.className = swatchClass;
    button.dataset.color = color;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', '0 -0.5 96 96');
    svg.setAttribute('shape-rendering', 'crispEdges');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke', color);
    path.setAttribute('d', SWATCH_ICON_PATH);
    
    svg.appendChild(path);
    button.appendChild(svg);
    return button;
}

/**
 * Creates a grid of color swatches in the specified container
 * @param {string} containerSelector - Selector for the container element
 * @param {string[]} colors - Array of color values
 * @param {THREE.Object3D[]} targetParts - Array of THREE.js objects to apply color to
 */
function createSwatchGrid(containerSelector, colorCodes, targetParts) {
  const optionsContainer = document.querySelector(containerSelector);
  optionsContainer.innerHTML = '';

  // Create rows
  const row1 = document.createElement('div');
  row1.className = 'options-row';

  const row2 = document.createElement('div');
  row2.className = 'options-row';

  // Split color codes into two groups
  const half = Math.ceil(colorCodes.length / 2);
  const [firstRowColors, secondRowColors] = [colorCodes.slice(0, half), colorCodes.slice(half)];

  const optionClass = optionsContainer.className.slice(0, -1);

  // Create buttons for each row
  [firstRowColors, secondRowColors].forEach((rowColors, index) => {
    const row = index === 0 ? row1 : row2;
    rowColors.forEach(color => {
      row.appendChild(createSwatch(optionClass, color, false));
    });
  });

  optionsContainer.append(row1, row2);

  initColorSwatches(optionClass, targetParts);
}

/**
 * Initializes event listeners for color swatches
 * @param {string} swatchClass - CSS class for the swatch buttons
 * @param {THREE.Object3D[]} targetParts - Array of THREE.js objects to apply color to
 */
function initColorSwatches(swatchClass, targetParts) {
  const swatches = document.querySelectorAll(swatchClass.replace(/^/, "."));

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      updateModelColor(swatch.dataset.color, targetParts);
    });
  });
}

/**
 * Updates the color of target THREE.js model parts
 * @param {string} color - Color value in hex format
 * @param {THREE.Object3D[]} targetParts - Array of THREE.js objects to apply color to
 */
function updateModelColor(color, targetParts) {
  const threeColor = new THREE.Color(color);

  targetParts.forEach(part => {
    if (part?.material) {
      part.material.color.copy(threeColor);
    }
  });
}

function createMeshButtons(buttonClass, path, style, scene) {
  const button = document.createElement('button');
  button.className = buttonClass;

  const image = document.createElement('img');
  image.src = path;
  image.alt = style;

  button.appendChild(image);

  button.addEventListener('click', () => {
    const currentHair = scene.children.filter(child => 
      hairstyleNames.includes(child.name)
    );
    
    currentHair.forEach(hair => scene.remove(hair));
    
    const hairModel = models.get(style);
    if (hairModel) {
      scene.add(hairModel);

      const activeSwatch = document.querySelector('.hair-color.active');
      if (activeSwatch) {
        updateModelColor(activeSwatch.dataset.color, [hairModel]);
      }
    }
  })
  return button;
}

function createStyle(containerSelector, scene, colorCodes) {
  const styleContainer = document.querySelector(containerSelector);
  styleContainer.innerHTML = '';

  const styleRow = document.createElement('div');
  styleRow.className = 'hair-styles';

  Object.entries(hairstyles).forEach(([style, path]) => {
    styleRow.appendChild(createMeshButtons('hairstyle-button', path, style, scene));
  });

  const colorRow = document.createElement('div');
  colorRow.className = 'hair-colors';

  const optionClass = colorRow.className.slice(0, -1);
  colorCodes.forEach(color => {
      colorRow.appendChild(createSwatch(optionClass, color, false));
    });

  styleContainer.appendChild(styleRow);
  styleContainer.appendChild(colorRow);

  initColorSwatches(optionClass, [models.get('Spikey'), models.get('Wavy')].filter(Boolean));
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
  /**
  const shadowHelper = new THREE.CameraHelper(sun.shadow.camera);
  scene.add(shadowHelper);
  const helper = new THREE.DirectionalLightHelper(sun, 5);
  scene.add(helper);
  */

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
  //scene.add(floor);

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

  // Experience Panel Buttons
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

  // Customization Panel Buttons
  const skinMeshGroup = [models.get("Body"), models.get("Hair")];
  const eyeMeshGroup = [models.get("Left Iris"), models.get("Right Iris")];

  createSwatchGrid(".skin-options", skinCodes, skinMeshGroup);
  createSwatchGrid(".eye-options", eyeCodes, eyeMeshGroup);
  createStyle(".hair-options", scene, hairCodes);
  //createNoseGrid();
  //createMakeupGrid();


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