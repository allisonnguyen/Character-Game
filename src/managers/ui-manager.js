// managers/ui-manager.js
import { COLORS, HAIR_STYLES, NOSE_STYLES, MOUTH_STYLES, MODEL_PARTS, FULL_BODY, SWATCH_ICON_PATH } from '../config/constants';

export class UIManager {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.activeSwatches = new Map();
    }

    init() {
        this.initCategories();
        this.initColorSwatches();
        this.initStyleButtons('.hair-styles', HAIR_STYLES);
        this.initStyleButtons('.nose-styles', NOSE_STYLES);
        this.initStyleButtons('.mouth-styles', MOUTH_STYLES);
        this.initControlButtons();
    }

    initCategories() {
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

                if (optionsType === 'hair') {
                    this.sceneManager.playAnimation(FULL_BODY, 'LookUp');
                }
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
            COLORS.BLUSH,
            [MODEL_PARTS.NOSE_TRIANGLE, MODEL_PARTS.NOSE_OVAL, MODEL_PARTS.NOSE_CUBE]
        );

        this.createStylePanel(
            '.mouth-options',
            null,
            [MODEL_PARTS.MOUTH_1, MODEL_PARTS.MOUTH_2, MODEL_PARTS.MOUTH_3]
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
                swatches.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
                this.activeSwatches.set(category, swatch.dataset.color);
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

        if (buttonClass.includes('hair')) {
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
        })
        
        return button;
    }

    initControlButtons() {
        document.getElementById('reset-view').addEventListener('click', () => {
            this.sceneManager.resetCamera();
        });

        document.getElementById('settings').addEventListener('click', () => {
            console.log("Settings button clicked");
        });
    }
}