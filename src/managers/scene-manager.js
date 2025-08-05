// managers/scene-manager.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { normalizeColor } from '../utils/colorUtils';
import { SCENE_SETTINGS, COLORS, MODEL_PARTS, MODEL_CLOTHING, HAIR_STYLES } from '../config/constants';

export class SceneManager {
    constructor() {
        this.models = new Map();
        this.textures = new Map();
        this.scene = new THREE.Scene();

        this.animationsMap = new Map();
        this.gltfAnimations = new THREE.AnimationClip;
        this.clock = new THREE.Clock();

        /*
        this.mouse = new THREE.Vector2();
        this.setupMouseTracking();
        */

        this.loadingAnimation = {
            active: false,
            angle: 0,
            speed: 0.1,
            element: null
        };
        this.loadingManager = new THREE.LoadingManager(
            () => this.onLoad(),
            (url, itemsLoaded, itemsTotal) => this.onProgress(url, itemsLoaded, itemsTotal),
            (url) => {
                console.error('Error loading:', url);
                this.stopLoadingAnimation();
            }
        );

        this.render = this.render.bind(this);                                                           // Bind to SceneManager instance for passing to requestAnimationFrame
        this.initLoaders();
    }

    /**  -------------------------- Load Models and Textures -------------------------- */

    initLoaders() {
        this.textureLoader = new THREE.TextureLoader(this.loadingManager);
        
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath("/draco/");
        
        this.gtfLoader = new GLTFLoader(this.loadingManager);
        this.gtfLoader.setDRACOLoader(this.dracoLoader);

        this.loadingAnimation.element = document.querySelector('.loader');
    }

    startLoadingAnimation() {
        this.loadingAnimation.active = true;
        this.loadingAnimation.angle = 0;
        this.animateLoader();
    }

    stopLoadingAnimation() {
        this.loadingAnimation.active = false;
    }

    animateLoader() {
        if (!this.loadingAnimation.active) return;
        
        this.loadingAnimation.angle += this.loadingAnimation.speed;
        
        const cube = this.loadingAnimation.element;
        const angle = this.loadingAnimation.angle;
        
        if (angle % Math.PI < Math.PI/2) {
            cube.style.transform = `rotateY(${angle}rad)`;
        } else {
            cube.style.transform = `rotateY(${angle}rad) rotateX(${angle}rad)`;
        }
        
        requestAnimationFrame(() => this.animateLoader());
    }

    onProgress(url, itemsLoaded, itemsTotal) {
        if (!this.loadingAnimation.active) {
            this.startLoadingAnimation();
        }
        
        /*
        const percent = Math.round((itemsLoaded / itemsTotal) * 100);
        console.log(`Loading ${percent}%: ${url}`);
        */
    }

    onLoad() {
        // Add default models
        this.addModelToScene(MODEL_PARTS.BODY);
        this.addModelToScene(MODEL_PARTS.LEFT_IRIS);
        this.addModelToScene(MODEL_PARTS.LEFT_PUPIL);
        this.addModelToScene(MODEL_PARTS.RIGHT_IRIS);
        this.addModelToScene(MODEL_PARTS.RIGHT_PUPIL);
        this.addModelToScene(MODEL_PARTS.EYEBROWS);
        this.addModelToScene(MODEL_PARTS.NOSE_TRIANGLE);
        this.addModelToScene(MODEL_CLOTHING.TSHIRT);
        this.addModelToScene(MODEL_CLOTHING.SHORTS);

        this.stopLoadingAnimation();
        
        this.render();

        const loadingElement = document.getElementById('js-loader');
        const mainContent = document.getElementById('main-content');
        
        if (loadingElement && mainContent) {
            loadingElement.style.opacity = '0';
            loadingElement.style.transition = 'opacity 0.5s ease-out';
            
            loadingElement.addEventListener('transitionend', () => {
                loadingElement.style.display = 'none';
            }, { once: true });
        }
    }

    loadAssets(texturePaths, modelPaths) {
        this.startLoadingAnimation();
        
        texturePaths.forEach(path => this.loadTexture(path));
        modelPaths.forEach(path => this.loadModel(path));
    }

    loadTexture(path) {
        this.textureLoader.load(
            path,
            (texture) => {
            const name = path.split('/').pop().split('.')[0];
            texture.flipY = false;
            texture.colorSpace = THREE.SRGBColorSpace;
            this.textures.set(name, texture);
            },
            undefined,
            (error) => console.error('Texture load error:', error)
        );
    }

    loadModel(path) {
        this.gtfLoader.load(
            path,
            (gltf) => {
                const modelName = path.split('/').pop().replace('.glb', '');
                
                // Create a group to contain the original scene
                const modelGroup = new THREE.Group();
                modelGroup.add(gltf.scene);
                
                // Process materials for all meshes
                gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({ 
                    color: normalizeColor(COLORS.BASE),
                    side: child.name.toLowerCase() in HAIR_STYLES ? THREE.DoubleSide : THREE.FrontSide,
                    });
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
                });

                this.models.set(modelName, modelGroup);

                if (gltf.animations && gltf.animations.length) {
                    this.gltfAnimations = gltf.animations;
                    
                    // Create mixer with the original scene (not the group)
                    const mixer = new THREE.AnimationMixer(gltf.scene);
                    const modelActions = {};
                    const additiveClips = {};
                    
                    for (const clip of this.gltfAnimations) {
                        let processedClip = clip;

                        // Additive animations
                        if (clip.name.includes('LookUp')) {
                            processedClip = THREE.AnimationUtils.makeClipAdditive(clip);
                            additiveClips[clip.name] = true;
                        }

                        const action = mixer.clipAction(processedClip);
                        modelActions[clip.name] = action;

                        // Play base animations
                        if (clip.name.includes('Blinking') || clip.name.includes('Idle')) {
                            action.play();
                        }
                    }
                    
                    this.animationsMap.set(modelName, {
                        mixer: mixer,
                        actions: modelActions,
                        additiveClips: additiveClips
                    });
                }
            },
            undefined,
            (error) => console.error('Model load error:', error)
        );
    }

    /**  -------------------------------------- Scene -------------------------------------- */

    setupScene(experienceContainer, experienceCanvas) {
        this.scene.background = new THREE.Color(normalizeColor(COLORS.BASE));

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
            if (model) {
                model.traverse(child => {
                    if (child.isMesh && child.material) {
                        child.material.color.copy(threeColor);
                    }
                });
            }
        });
    }

    setStyle(category, styleName) {
        Object.keys(category).forEach(style => {
            this.removeModelFromScene(style);
        })

        if (styleName.toLowerCase().includes("mouth")) {
            let mouthMesh = this.models.get(styleName);
            if (!mouthMesh) {
                mouthMesh = this.createMask("mouth", styleName);
            }
        }
        
        this.addModelToScene(styleName);
    }

    createMask(targetPart, styleName) {
        // Create mouth mask as skinned mesh using body skeleton
        const textureName = styleName.replace(' ', '_') + '_mask';
        const bodyModel = this.models.get(MODEL_PARTS.BODY);
        
        // Find body mesh and skeleton
        let bodyMesh = null;
        let skeleton = null;
        
        bodyModel.traverse(child => {
            if (child.isSkinnedMesh && !bodyMesh) {
                bodyMesh = child;
                skeleton = child.skeleton;
            }
        });

        if (!bodyMesh || !skeleton) {
            console.error("Could not find skinned body mesh or skeleton");
            return null;
        }

        if (targetPart === 'mouth') {
            const mouthMesh = this.createMouthMesh(textureName, bodyMesh, skeleton);

            const mouthGroup = new THREE.Group();
            mouthGroup.add(mouthMesh);
            this.models.set(styleName, mouthGroup);
            
            return mouthGroup;
        }
    }

    createMouthMesh(textureName, bodyMesh, skeleton) {
        const mouthMaterial = new THREE.MeshStandardMaterial({
            map: this.textures.get(textureName),
            alphaMap: this.textures.get(textureName),
            transparent: true,
            blending: THREE.CustomBlending,
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneMinusSrcAlphaFactor,
            color: normalizeColor(COLORS.MOUTH),
            opacity: 1,
            depthWrite: false,
        });

        const mouthMesh = new THREE.SkinnedMesh(
            bodyMesh.geometry.clone().translate(0, 0, 0.01),
            mouthMaterial
        );

        mouthMesh.bind(skeleton, bodyMesh.bindMatrix);

        return mouthMesh;
    }

    /*
    setupMouseTracking() {
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const anchor = document.getElementById('experience-container');
            const rect = anchor.getBoundingClientRect();
            const anchorX = rect.left + rect.width / 2;
            const anchorY = rect.right + rect.height / 2;

            const angleDeg = this.angle(mouseX, mouseY, anchorX, anchorY);
            console.log(angleDeg);
        })
    }

    angle(cx, cy, ex, ey) {
        const dy = ey - cy;
        const dx = ex - cx;
        const rad = Math.atan2(dy, dx);
        const deg = rad * 180 / Math.PI;
        return deg;
    }
    */

    /**  ---------------------------------- Camera ---------------------------------- */

    moveCamera(actionName) {
        let startPosition, endPosition;
        if (actionName === 'LookUp') {
            startPosition = new THREE.Vector3().copy(SCENE_SETTINGS.CAMERA.position);
            endPosition = new THREE.Vector3().copy(SCENE_SETTINGS.CAMERA.lookUpPosition);
        } else if (actionName === 'LookBack') {
            startPosition = new THREE.Vector3().copy(SCENE_SETTINGS.CAMERA.lookUpPosition);
            endPosition = new THREE.Vector3().copy(SCENE_SETTINGS.CAMERA.position);
        }

        const duration = 0.5;
        const startTime = this.clock.getElapsedTime();
        
        const animateCamera = () => {
            const currentTime = this.clock.getElapsedTime();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smooth camera movement
            const easeProgress = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            // Interpolate position
            this.camera.position.lerpVectors(startPosition, endPosition, easeProgress);
            this.controls.target.copy(SCENE_SETTINGS.CAMERA.target);
            this.controls.update();
            
            if (progress < 1) {
                requestAnimationFrame(animateCamera);
            }
        };
        
        animateCamera();
    }

    resetCamera() {
        this.camera.position.copy(SCENE_SETTINGS.CAMERA.position);
        this.controls.target.copy(SCENE_SETTINGS.CAMERA.target);
        this.controls.update();
    }

    playAnimation(targetParts, actionName) {
        this.moveCamera(actionName);

        targetParts.forEach(part => {
            const animationData = this.animationsMap.get(part);
            if (animationData) {
                const action = animationData.actions[actionName];
                
                if (action) {
                    Object.entries(animationData.actions).forEach(([name, otherAction]) => {
                        if (animationData.additiveClips[name] && name !== actionName) {
                            otherAction.stop();
                        }
                    });

                    action.blending = THREE.NormalAnimationBlendMode;
                    action.setLoop(THREE.LoopOnce);
                    action.clampWhenFinished = true;
                    action.setEffectiveWeight(1.0);

                    action.reset().play();
                }
            }
        });
    }

    render() {
        const delta = this.clock.getDelta();
        this.animationsMap.forEach((animationData) => {
            animationData.mixer.update(delta);
        });
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.render);
    }
}