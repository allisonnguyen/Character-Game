// managers/scene-manager.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Howl } from 'howler';
import { normalizeColor } from '../utils/colorUtils';
import { SCENE_SETTINGS, COLORS, MODEL_PARTS, HAIR_STYLES, THEMES } from '../config/constants';

export class SceneManager {
    constructor() {
        this.bones = new Map();
        this.models = new Map();
        this.textures = new Map();
        this.scene = new THREE.Scene();

        this.floorMaterial = null;

        this.animationsMap = new Map();
        this.gltfAnimations = new THREE.AnimationClip;
        this.clock = new THREE.Clock();

        this.loadingAnimation = {
            element: null
        };
        this.loadingManager = new THREE.LoadingManager(
            () => this.onLoad(),
            () => this.onProgress(),
            (url) => {
                console.error('Error loading:', url);
                this.stopLoadingAnimation();
            }
        );

        this.audioInitialized = false;
        this.backgroundMusic = null;

        this.render = this.render.bind(this);                                                           // Bind to SceneManager instance for passing to requestAnimationFrame
        this.initLoaders();
    }

    /**  -------------------------- Loading Screen -------------------------- */

    startLoadingAnimation() {
        const loader = this.loadingAnimation.element;
        if (loader) {
            loader.style.display = 'flex';
            loader.style.opacity = '1';
        }
    }

    stopLoadingAnimation() {
        const loader = this.loadingAnimation.element;
        if (loader) {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s ease-out';
            
            loader.addEventListener('transitionend', () => {
                loader.style.display = 'none';
            }, { once: true });
        }
    }

    onProgress() {
        if (this.loadingAnimation.element) {
            this.startLoadingAnimation();
        }
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

        this.stopLoadingAnimation();
        this.render();
        this.showSoundOptions();

        // Add confirm button here to prevent flash of unstyled content
        const confirmBtn = document.getElementById('confirm-button');
        confirmBtn.style.display = 'flex';
    }

    showSoundOptions() {
        const loadingElement = document.getElementById('loader'); 
        const soundOptions = document.getElementById('sound-options');
        const textElement = document.querySelector('h2');
        const enableSoundBtn = document.getElementById('enable-sound');
        const disableSoundBtn = document.getElementById('disable-sound');
        
        if (loadingElement && soundOptions && textElement && enableSoundBtn && disableSoundBtn) {
            const isSmallScreen = window.innerWidth <= 480;

            // Show sound options container
            soundOptions.style.display = 'flex';
            soundOptions.style.opacity = '0';
            soundOptions.style.transition = 'opacity 0.5s ease-in';
            
            soundOptions.offsetHeight;
            
            // Fade loading element out
            loadingElement.style.opacity = '0';
            loadingElement.style.transition = 'opacity 0.5s ease-out';

            // Hide sound buttons
            enableSoundBtn.style.opacity = '0';
            enableSoundBtn.style.transform = 'scale(0.5)';
            enableSoundBtn.style.transition = 'none';
            
            disableSoundBtn.style.opacity = '0';
            disableSoundBtn.style.transform = 'scale(0.5)';
            disableSoundBtn.style.transition = 'none';
            
            // After loading element
            loadingElement.addEventListener('transitionend', () => {
                loadingElement.style.display = 'none';

                soundOptions.style.opacity = '1';

                if (isSmallScreen) {
                    // No text animation
                    textElement.style.animation = 'none';
                    textElement.style.whiteSpace = 'normal';
                    
                    enableSoundBtn.style.transition = 'transform 0.3s ease-out';
                    enableSoundBtn.style.opacity = '1';
                    enableSoundBtn.style.transform = 'scale(1)';
                    
                    disableSoundBtn.style.transition = 'transform 0.3s ease-out';
                    disableSoundBtn.style.opacity = '1';
                    disableSoundBtn.style.transform = 'scale(1)';
                } else {
                    // Play text animation
                    textElement.style.animationPlayState = 'running';
                    textElement.addEventListener('animationend', () => {
                        setTimeout(() => {
                            enableSoundBtn.style.transition = 'transform 0.2s';
                            enableSoundBtn.style.opacity = '1';
                            enableSoundBtn.style.transitionTimingFunction = 'cubic-bezier(0.64, 0.57, 0.67, 1.53)';
                            enableSoundBtn.style.transform = 'scale(1)';
                        }, 150);

                        setTimeout(() => {
                            disableSoundBtn.style.transition = 'transform 0.2s';
                            disableSoundBtn.style.opacity = '1';
                            disableSoundBtn.style.transitionTimingFunction = 'cubic-bezier(0.64, 0.57, 0.67, 1.53)';
                            disableSoundBtn.style.transform = 'scale(1)';
                        }, 450);
                    }, { once: true })
                }
                enableSoundBtn.addEventListener('click', () => {
                    this.handleSoundChoice(true);
                });
                    
                disableSoundBtn.addEventListener('click', () => {
                    this.handleSoundChoice(false);
                });
            }, { once: true });
        }
    }

    handleSoundChoice(enableSound) {
        localStorage.setItem('soundEnabled', enableSound);

        if (enableSound && !this.audioInitialized) {
            this.initAudio();
        }

        this.updateAudioSliders(enableSound);

        const loadingElement = document.getElementById('loading-screen');
        const mainContent = document.getElementById('main-content');
        
        if (loadingElement && mainContent) {
            loadingElement.style.opacity = '0';
            loadingElement.style.transition = 'opacity 0.5s ease-out';
            
            loadingElement.addEventListener('transitionend', () => {
                loadingElement.style.display = 'none';
            }, { once: true });
        } 
    }

    /**  -------------------------- Audio -------------------------- */

    initAudio () {
        if (this.audioInitialized) return;
        
        this.backgroundMusic = new Howl({
            src: ['/audio/music/Fishing Log.mp3'],
            loop: true,
            volume: 0,
            html5: true,
        });
        
        this.audioInitialized = true;
        this.updateMusicState();
    }

    updateAudioSliders(enableSound) {
        const sfxSlider = document.getElementById('sfxRange');
        const musicSlider = document.getElementById('musicRange');
        
        if (sfxSlider && musicSlider) {
            const value = enableSound ? 100 : 0;
            sfxSlider.value = value;
            musicSlider.value = value;
            
            sfxSlider.dispatchEvent(new Event('input'));
            musicSlider.dispatchEvent(new Event('input'));
        }
    }

    updateMusicState() {
        if (!this.audioInitialized) return;

        const isSoundEnabled = localStorage.getItem('soundEnabled') === 'true';
        const musicVolume = parseFloat(localStorage.getItem('musicVolume') || 0);

        if (isSoundEnabled && musicVolume > 0) {
            this.backgroundMusic.volume((musicVolume / 100) * 0.5);
            if (!this.backgroundMusic.playing()) {
                this.backgroundMusic.play();
            }
        } else {
            this.backgroundMusic.stop();
        }
    }

    /**  -------------------------- Load Models and Textures -------------------------- */

    initLoaders() {
        this.textureLoader = new THREE.TextureLoader(this.loadingManager);
        
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath("/draco/");
        
        this.gtfLoader = new GLTFLoader(this.loadingManager);
        this.gtfLoader.setDRACOLoader(this.dracoLoader);

        this.loadingAnimation.element = document.getElementById('loader');
    }


    loadAssets(texturePaths, modelPaths) {
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
                    if (child.isBone) {
                        this.bones.set(child.name, child);
                    }
                    
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
        this.scene.background = new THREE.Color(SCENE_SETTINGS.BACKGROUND);

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
        var floorGeometry = new THREE.CircleGeometry(
            SCENE_SETTINGS.FLOOR.geometry.radius,
            SCENE_SETTINGS.FLOOR.geometry.segments
        );

        const savedTheme = localStorage.getItem('selectedTheme');
        const themeColor = savedTheme ? JSON.parse(savedTheme).primary : THEMES.DEFAULT.primary;

        this.floorMaterial = new THREE.MeshPhongMaterial({
            //side: THREE.DoubleSide,
            color: themeColor,
            shininess: SCENE_SETTINGS.FLOOR.material.shininess
        });

        var floor = new THREE.Mesh(floorGeometry, this.floorMaterial);
        floor.rotation.x = -0.5 * Math.PI;
        floor.receiveShadow = true;
        floor.position.y = -0.01;
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
        //this.controls.dampingFactor = 0.05;
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

    updateFloorColor(color) {
        if (this.floorMaterial) {
            this.floorMaterial.color = new THREE.Color(color);
        }
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

    /**  ---------------------------------- Camera ---------------------------------- */

    moveCamera(actionName) {
        let startPosition, endPosition;
        let soundEffect = null;
        if (actionName === 'LookUp') {
            startPosition = new THREE.Vector3().copy(SCENE_SETTINGS.CAMERA.position);
            endPosition = new THREE.Vector3().copy(SCENE_SETTINGS.CAMERA.lookUpPosition);
            soundEffect = 'zoomIn';
        } else if (actionName === 'LookBack') {
            startPosition = new THREE.Vector3().copy(SCENE_SETTINGS.CAMERA.lookUpPosition);
            endPosition = new THREE.Vector3().copy(SCENE_SETTINGS.CAMERA.position);
            soundEffect = 'zoomOut';
        }

        if (soundEffect && this.uiManager) {
            this.uiManager.playSound(soundEffect);
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

    async playAnimation(targetParts, actionName) {
        this.moveCamera(actionName);
        
        // Prepare all animations first
        const actions = [];
        
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
                    action.reset();
                    
                    actions.push(action);
                }
            }
        });
        
        // Wait for next frame to ensure all animations are prepared
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        // Start all animations simultaneously
        actions.forEach(action => {
            action.play();
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