import './style.scss'
import { SceneManager } from './managers/scene-manager';
import { UIManager } from './managers/ui-manager';
import { MODEL_PATHS } from './config/constants';

async function init() {
  const sceneManager = new SceneManager();
  await sceneManager.loadAssets(MODEL_PATHS);
  
  const experienceContainer = document.querySelector("#experience-container");
  const experienceCanvas = document.querySelector("#experience-canvas")

  sceneManager.setupScene(experienceContainer, experienceCanvas);

  const uiManager = new UIManager(sceneManager);
  uiManager.init();

  sceneManager.render();
}

init().catch(error => {
  console.error("Failed to initialize application:", error);
});