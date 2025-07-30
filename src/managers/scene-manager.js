// managers/scene-manager.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SCENE_SETTINGS, BASE_COLOR, MODEL_PARTS, HAIR_STYLES, NOSE_STYLES } from '../config/constants';

export class SceneManager {
    constructor() {
        this.models = new Map();
        this.textures = new Map();
        this.scene = new THREE.Scene();
        this.render = this.render.bind(this);   // Bind to SceneManager instance for passing to requestAnimationFrame
        this.initLoaders();
    }

    initLoaders() {
        this.textureLoader = new THREE.TextureLoader();
        
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath("/draco/");
        
        this.gtfLoader = new GLTFLoader();
        this.gtfLoader.setDRACOLoader(this.dracoLoader);
    }

    async loadAssets(texturePaths, modelPaths) {
        try {
            const texturePromises = texturePaths.map(path => this.loadTexture(path));
            const modelPromises = modelPaths.map(path => this.loadModel(path));
            
            await Promise.all([...modelPromises, ...texturePromises]);
        } catch(err) {
            console.error("Error loading assets: ", err);
            throw err;
        }
    }

    loadTexture(path) {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
              path,
              (texture) => {
                const name = path.split('/').pop().split('.')[0];
                texture.flipY = false;
                texture.colorSpace = THREE.SRGBColorSpace;
                this.textures.set(name, texture);
                resolve(texture);
              },
              undefined,
              (error) => reject(error)
            );
        });
    }

    loadModel(path) {
      return new Promise((resolve, reject) => {
        const nameMap = {
          "Sphere016": MODEL_PARTS.LEFT_PUPIL,
          "Sphere016_1": MODEL_PARTS.LEFT_IRIS,
          "Sphere015": MODEL_PARTS.RIGHT_PUPIL,
          "Sphere015_1": MODEL_PARTS.RIGHT_IRIS,
          "Triangle_Nose": MODEL_PARTS.NOSE_TRIANGLE,
          "Oval_Nose": MODEL_PARTS.NOSE_OVAL,
          "Cube_Nose": MODEL_PARTS.NOSE_CUBE,
        };
    
        this.gtfLoader.load(
          path,
          (gltf) => {
            gltf.scene.traverse((child) => {
              if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({ color: BASE_COLOR });

                if (child.name in HAIR_STYLES) {
                  child.material.side = THREE.DoubleSide;
                }

                child.castShadow = true;
                child.receiveShadow = true;
                
                if (nameMap[child.name]) {
                  child.name = nameMap[child.name];
                }
                this.models.set(child.name, child);
              }
            });
            resolve(gltf);
          },
          undefined,
          (error) => reject(error)
        );
      });
    }

    setupScene(experienceContainer, experienceCanvas) {
        this.scene.background = new THREE.Color(BASE_COLOR);

        this.sizes =  {
            width: experienceContainer.clientWidth,
            height: experienceContainer.clientHeight
        }

        // Setup Camera
        this.camera = new THREE.PerspectiveCamera(
            SCENE_SETTINGS.CAMERA.fov,
            this.sizes.width / this.sizes.height,
            SCENE_SETTINGS.CAMERA.near,
            SCENE_SETTINGS.CAMERA.far);
        this.camera.position.copy(SCENE_SETTINGS.CAMERA.position);

        // Setup Lights
        const sun = new THREE.DirectionalLight(
            SCENE_SETTINGS.LIGHTS.directional.color,
            SCENE_SETTINGS.LIGHTS.directional.intensity
        );
        sun.position.copy(SCENE_SETTINGS.LIGHTS.directional.position);
        sun.castShadow = true;
        sun.shadow.mapSize.set(
            SCENE_SETTINGS.LIGHTS.directional.shadow.mapSize,
            SCENE_SETTINGS.LIGHTS.directional.shadow.mapSize
        );
        sun.shadow.normalBias = SCENE_SETTINGS.LIGHTS.directional.shadow.normalBias;
        this.scene.add(sun);

        const ambient = new THREE.AmbientLight(
        SCENE_SETTINGS.LIGHTS.ambient.color,
        SCENE_SETTINGS.LIGHTS.ambient.intensity
        );
        this.scene.add(ambient);

        /**
        const shadowHelper = new THREE.CameraHelper(sun.shadow.camera);
        this.scene.add(shadowHelper);
        const helper = new THREE.DirectionalLightHelper(sun, 5);
        this.scene.add(helper);
        */

        // Setup Floor
        var floorGeometry = new THREE.PlaneGeometry(
            SCENE_SETTINGS.FLOOR.geometry.width,
            SCENE_SETTINGS.FLOOR.geometry.height,
            SCENE_SETTINGS.FLOOR.geometry.widthSegments,
            SCENE_SETTINGS.FLOOR.geometry.heightSegments
        );
        var floorMaterial = new THREE.MeshPhongMaterial({
            color: SCENE_SETTINGS.FLOOR.material.color,
            shininess: SCENE_SETTINGS.FLOOR.material.shininess
        });
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -0.5 * Math.PI;
        floor.receiveShadow = true;
        floor.position.y = 0;
        this.scene.add(floor);

        // Setup Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: experienceCanvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;

        // Setup Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.copy(SCENE_SETTINGS.CAMERA.target);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 10;
        this.controls.enablePan = false;

        // Add Default Models
        this.addModelToScene(MODEL_PARTS.BODY);
        this.addModelToScene(MODEL_PARTS.LEFT_IRIS);
        this.addModelToScene(MODEL_PARTS.LEFT_PUPIL);
        this.addModelToScene(MODEL_PARTS.RIGHT_IRIS);
        this.addModelToScene(MODEL_PARTS.RIGHT_PUPIL);
        this.addModelToScene(MODEL_PARTS.EYEBROWS);
        this.addModelToScene(MODEL_PARTS.NOSE_TRIANGLE);

        // Resize
        window.addEventListener("resize", () => {
            this.sizes.width = experienceContainer.clientWidth;
            this.sizes.height = experienceContainer.clientHeight;

            // Update Camera
            this.camera.aspect = this.sizes.width / this.sizes.height;
            this.camera.updateProjectionMatrix();

            // Update Renderer
            this.renderer.setSize(this.sizes.width, this.sizes.height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    }

    addModelToScene(modelName) {
        const model = this.models.get(modelName);
        if (model && !this.scene.children.includes(model)) {
            this.scene.add(model);
        }
    }

    removeModelFromScene(modelName) {
        const model = this.models.get(modelName);
        if (model && this.scene.children.includes(model)) {
            this.scene.remove(model);
        }
    }

    updateModelColor(color, targetParts) {
        const threeColor = new THREE.Color(color);
        targetParts.forEach(part => {
            const model = this.models.get(part);
            if (model?.material) {
                model.material.color.copy(threeColor);
            }
        })
    }

    setHairstyle(styleName) {
        Object.keys(HAIR_STYLES).forEach(style => {
            this.removeModelFromScene(style);
        })
        this.addModelToScene(styleName);
    }

    setNosestyle(styleName) {
        Object.keys(NOSE_STYLES).forEach(style => {
            this.removeModelFromScene(style);
        })
        this.addModelToScene(styleName);
    }

    resetCamera() {
        this.camera.position.copy(SCENE_SETTINGS.CAMERA.position);
        this.controls.target.copy(SCENE_SETTINGS.CAMERA.target);
        this.controls.update();
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.render);
    }
}