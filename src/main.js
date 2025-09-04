import './style.scss'
import { SceneManager } from './managers/scene-manager';
import { UIManager } from './managers/ui-manager';
import { TEXTURE_PATHS, MODEL_PATHS } from './config/constants';

async function init() {
  const sceneManager = new SceneManager();
  sceneManager.loadAssets(TEXTURE_PATHS, MODEL_PATHS);
  console.log(sceneManager.bones);

  const experienceContainer = document.querySelector("#experience-container");
  const experienceCanvas = document.querySelector("#experience-canvas");

  sceneManager.setupScene(experienceContainer, experienceCanvas);

  const uiManager = new UIManager(sceneManager);
  uiManager.init();

  sceneManager.updateMusicState();
  sceneManager.render();
}

init().catch(error => {
  console.error("Failed to initialize application:", error);
});