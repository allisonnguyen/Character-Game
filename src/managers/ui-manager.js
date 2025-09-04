// managers/ui-manager.js
import * as THREE from 'three';
import { gsap } from 'gsap';
import { Howl } from 'howler';
import { normalizeColor } from '../utils/colorUtils';
import { SWATCH_ICON_PATH, THEMES, COLORS, MODEL_PARTS, MODEL_CLOTHING, FULL_BODY, HAIR_STYLES, NOSE_STYLES, MOUTH_STYLES, TOP_STYLES, BOTTOM_STYLES } from '../config/constants';

export class UIManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.sceneManager.uiManager = this;

        this.audioInitialized = false;
        this.sfx = null;
    }

    init() {
        this.initSFX();
        this.initThemeButtons();
        this.initCategories();
        this.initColorSwatches();
        this.initStyleButtons('.hair-styles', HAIR_STYLES);
        this.initStyleButtons('.nose-styles', NOSE_STYLES);
        this.initStyleButtons('.mouth-styles', MOUTH_STYLES);
        this.initStyleButtons('.top-styles', TOP_STYLES);
        this.initStyleButtons('.bottom-styles', BOTTOM_STYLES);
        this.initControlButtons();
    }

    initSFX() {
        try {
            this.sfx = {
                zoomIn: new Howl ({
                    src: ['/audio/sfx/System_Camera_Move_Zoom_In.wav'],
                    volume: 0,
                    html5: true,
                }),
                zoomOut: new Howl ({
                    src: ['/audio/sfx/System_Camera_Move_Zoom_Out.wav'],
                    volume: 0,
                    html5: true,
                }),
                dragStart: new Howl ({
                    src: ['/audio/sfx/UI_DragStart.wav'],
                    volume: 0,
                    html5: true,
                }),
                dragEnd: new Howl ({
                    src: ['/audio/sfx/UI_DragEnd.wav'],
                    volume: 0,
                    html5: true,
                }),
                click: new Howl ({
                    src: ['/audio/sfx/UI_Interior_MultiSelect_On.wav'],
                    volume: 0,
                    html5: true,
                }),
                category: new Howl ({
                    src: ['/audio/sfx/UI_Interior_ChangeMode.wav'],
                    volume: 0,
                    html5: true,
                }),
                open: new Howl ({
                    src: ['/audio/sfx/UI_RingMenu_Open.wav'],
                    volume: 0,
                    html5: true,
                }),
                close: new Howl ({
                    src: ['/audio/sfx/UI_RingMenu_Close.wav'],
                    volume: 0,
                    html5: true,
                }),
                confirm: new Howl ({
                    src: ['/audio/sfx/UI_Decide.wav'],
                    volume: 0,
                    html5: true,
                }),
            }
            this.audioInitialized = true;
        } catch (error) {
            console.error('SFX initialization failed:', error);
            this.sfx = {};
            this.audioInitialized = false;
        }
    }

    playSound(soundName) {
        if (!this.audioInitialized) return;

        const isSoundEnabled = localStorage.getItem('soundEnabled') === 'true';
        const sfxVolume = parseFloat(localStorage.getItem('sfxVolume') || 0);
        
        if (isSoundEnabled && sfxVolume > 0 && this.sfx[soundName]) {
            this.sfx[soundName].stop();
            this.sfx[soundName].volume(sfxVolume / 100);
            this.sfx[soundName].play();
        }
    }

    initThemeButtons() {
        const themeContainer = document.querySelector('.theme-options');
        if (!themeContainer) return;

        themeContainer.innerHTML = '';
        
        Object.entries(THEMES).forEach(([key, theme]) => {
            const button = document.createElement('button');
            button.className = 'theme-btn';
            button.dataset.theme = key;
            button.style.backgroundColor = theme.accent;
            button.title = theme.name;
            
            button.addEventListener('click', () => {
                this.playSound('click');
                this.applyTheme(theme);
            });
            
            themeContainer.appendChild(button);
        });
    }

      applyTheme(theme) {
        document.documentElement.style.setProperty('--color-primary', theme.primary);
        document.documentElement.style.setProperty('--color-primary-dark', theme.primaryDark);
        document.documentElement.style.setProperty('--color-secondary', theme.secondary);
        document.documentElement.style.setProperty('--color-accent', theme.accent);
        document.documentElement.style.setProperty('--color-dark-tan', theme.background);
        document.documentElement.style.setProperty('--color-light-tan', theme.lightBackground);
        
        this.sceneManager.scene.background = new THREE.Color(normalizeColor(theme.background));
        this.sceneManager.updateFloorColor(normalizeColor(theme.primary));
        
        localStorage.setItem('selectedTheme', JSON.stringify(theme));
    }

    initCategories() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const optionPanels = document.querySelectorAll('.options-content');
        let currentCategory = null;

        categoryButtons.forEach(button => {
            button.addEventListener("click", () => {
                this.playSound('category');
                const newCategory = button.dataset.options;

                if (newCategory == currentCategory) return;

                categoryButtons.forEach(btn => btn.classList.remove('active'));
                optionPanels.forEach(panel => panel.classList.remove('active'));

                button.classList.add('active');

                const optionsType = button.dataset.options;
                const targetPanel = document.querySelector(`.options-content[data-options="${optionsType}"]`);
                 
                if (optionsType === 'hair') {
                    if (currentCategory !== 'hair') {
                        this.sceneManager.playAnimation(FULL_BODY, 'LookUp');
                    }
                } else if (currentCategory === 'hair') {
                    this.sceneManager.playAnimation(FULL_BODY, 'LookBack');
                }

                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
                
                currentCategory = newCategory;
            });
        });
    }

    initColorSwatches() {
        this.createSwatchGrid(
        '.skin-options',
        COLORS.SKIN,
        [MODEL_PARTS.BODY]
        );

        this.createSwatchGrid(
        '.eye-options',
        COLORS.EYES,
        [MODEL_PARTS.LEFT_IRIS, MODEL_PARTS.RIGHT_IRIS]
        );

        this.createStylePanel(
        '.hair-options',
        COLORS.HAIR,
        [MODEL_PARTS.HAIR_SPIKEY, MODEL_PARTS.HAIR_WAVY, MODEL_PARTS.EYEBROWS]
        );

        this.createStylePanel(
            '.nose-options',
            COLORS.NOSE,
            [MODEL_PARTS.NOSE_TRIANGLE, MODEL_PARTS.NOSE_OVAL, MODEL_PARTS.NOSE_CUBE]
        );

        this.createStylePanel(
            '.mouth-options',
            null,
            [MODEL_PARTS.MOUTH_1, MODEL_PARTS.MOUTH_2, MODEL_PARTS.MOUTH_3]
        );

        this.createStylePanel(
            '.top-options',
            null,
            [MODEL_CLOTHING.TSHIRT, MODEL_CLOTHING.YSHIRT]
        );

        this.createStylePanel(
            '.bottom-options',
            null,
            [MODEL_CLOTHING.ASKIRT, MODEL_CLOTHING.LSKIRT, MODEL_CLOTHING.SHORTS, MODEL_CLOTHING.PANTS]
        );
    }

    createSwatchGrid(containerSelector, colorCodes, targetParts) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        container.innerHTML = '';
        const category = containerSelector.slice(1, -1);

        // Create rows
        const row1 = document.createElement('div');
        row1.className = 'options-row';

        const row2 = document.createElement('div');
        row2.className = 'options-row';

        // Split color codes into two groups
        const half = Math.ceil(colorCodes.length / 2);
        const [firstRowColors, secondRowColors] = [colorCodes.slice(0, half), colorCodes.slice(half)];

        // Create buttons for each row
        [firstRowColors, secondRowColors].forEach((rowColors, index) => {
            const row = index === 0 ? row1 : row2;
            rowColors.forEach(color => {
            row.appendChild(this.createSwatch(category, color));
            });
        });

        container.append(row1, row2);

        this.initSwatchEvents(category, targetParts);
    }

    createSVG(color, data) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('viewBox', '0 -0.5 96 96');
        svg.setAttribute('shape-rendering', 'crispEdges');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('stroke', color);
        path.setAttribute('d', data);
        
        svg.appendChild(path);
        return svg;
    }

    createSwatch(category, color) {
        const button = document.createElement('button');
        button.className = category;
        button.dataset.color = color;
        button.appendChild(this.createSVG(color, SWATCH_ICON_PATH));
        return button;
    }

    initSwatchEvents(category, targetParts) {
        const swatches = document.querySelectorAll(category.replace(/^/, "."));

        swatches.forEach(swatch => {            
            swatch.addEventListener('click', () => {
                this.playSound('click');
                swatches.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
                this.sceneManager.updateModelColor(swatch.dataset.color, targetParts);
            });
        });
    }

    createStylePanel(containerSelector, colorCodes, targetParts) {
        const styleContainer = document.querySelector(containerSelector);
        styleContainer.innerHTML = '';

        const styleSelector = containerSelector.replace(/\.([^.]+)-options/, "$1");

        /** Styles */
        const styleRow = document.createElement('div');
        styleRow.className = styleSelector + '-styles';
        styleContainer.appendChild(styleRow);

        if (colorCodes) {
            /** Style Colors */
            const colorRow = document.createElement('div');
            colorRow.className = styleSelector + '-colors';

            const optionClass = colorRow.className.slice(0, -1);
            colorCodes.forEach(color => {
                colorRow.appendChild(this.createSwatch(optionClass, color));
            });
            styleContainer.appendChild(colorRow);
            this.initSwatchEvents(optionClass, targetParts);
        }
    }

    initStyleButtons(containerSelector, styles) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.innerHTML = '';
        const buttonClass = container.className.slice(0, -1);
        Object.entries(styles).forEach(([name, path]) => {
            container.appendChild(this.createMeshButtons(buttonClass, name, path));
        });
    }

    createMeshButtons (buttonClass, style, path) {
        const button = document.createElement('button');
        button.className = buttonClass;

        if (buttonClass.includes('hair') || buttonClass.includes('top') || buttonClass.includes('bottom')) {
            const image = document.createElement('img');
            image.src = path;
            image.alt = style;

            button.appendChild(image);
        }

        if (buttonClass.includes('nose')) {
            button.appendChild(this.createSVG('#F0F0F0', path))
        }

        if (buttonClass.includes('mouth')) {
            button.appendChild(this.createSVG('#725147', path))
        }

        button.addEventListener('click', () => {
            this.playSound('click');

            document.querySelectorAll(`.${buttonClass}`).forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');

            if (buttonClass.includes('hair')) {
                this.sceneManager.setStyle(HAIR_STYLES, style);
            }

            if (buttonClass.includes('nose')) {
               this.sceneManager.setStyle(NOSE_STYLES, style);
            }

            if (buttonClass.includes('mouth')) {
                this.sceneManager.setStyle(MOUTH_STYLES, style);
            }

            if (buttonClass.includes('top')) {
                this.sceneManager.setStyle(TOP_STYLES, style);
            }

            if (buttonClass.includes('bottom')) {
                this.sceneManager.setStyle(BOTTOM_STYLES, style);
            }
        })
        
        return button;
    }

    initControlButtons() {
        document.getElementById('reset-view').addEventListener('click', () => {
            this.playSound('click');
            this.sceneManager.resetCamera();
        });

        /* Audio Sliders */
        const sfxSlider = document.getElementById('sfxRange');
        sfxSlider.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            localStorage.setItem('sfxVolume', volume);

            if (volume > 0 || musicSlider.value > 0) {
                localStorage.setItem('soundEnabled', 'true');
            } else {
                localStorage.setItem('soundEnabled', 'false');
            }
        });
        
        const musicSlider = document.getElementById('musicRange');
        musicSlider.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            localStorage.setItem('musicVolume', volume);

            if (volume > 0 || sfxSlider.value > 0) {
                localStorage.setItem('soundEnabled', 'true');
                this.sceneManager.initAudio();
            } else {
                localStorage.setItem('soundEnabled', 'false');
            }
            this.sceneManager.updateMusicState();
        });

        /* Settings Modal */
        const dialog = document.getElementById('modal');
        const showDialog = document.getElementById('open-settings');
        const closeDialog = document.getElementById('close-settings');

        showDialog.addEventListener('click', () => {
            this.playSound('open');
            dialog.showModal();
            gsap.set(modal, {
                opacity: 0,
                scale: 0,
                transform: 'translate(-50%, -50%)'
            });
            gsap.to(modal, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "back.out(2)",
                transform: 'translate(-50%, -50%)'
            });
        });

        closeDialog.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleModalExit(e, dialog);
        }, { passive: false });

        document.getElementById('confirm-button').addEventListener('click', () => {
            this.playSound('confirm');

            document.getElementById('customization-panel').style.display = 'none';
            
            const mainContent = document.getElementById('main-content');
            mainContent.style.gridTemplateRows = '100%';
            mainContent.style.gridTemplateColumns = '100%';

            window.dispatchEvent(new Event('resize'));
        });
    }

    handleModalExit(e, modal) {
        const button = document.getElementById('close-settings');
        
        if (!button) return;
        
        this.playSound('close');
        
        // GSAP animation for the button
        gsap.to(button, {
            scale: 1.5,
            duration: 0.2,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                gsap.set(button, { clearProps: "all" });
            }
        });
        
        // Animation for modal and overlay
        gsap.to(modal, {
            opacity: 0,
            scale: 0.9,
            duration: 0.3,
            ease: "back.in(1.7)",
            transform: 'translate(-50%, -50%)',
            onComplete: () => {
                modal.close();
                gsap.set(modal, {
                    opacity: 1,
                    scale: 1,
                    transform: 'translate(-50%, -50%)'
                });
            }
        });
    }
}