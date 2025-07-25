// config/constants.js
export const SWATCH_ICON_PATH = 'M47 11h15M43 12h23M40 13h29M38 14h34M35 15h38M33 16h42M32 17h45M30 18h48M29 19h50M28 20h52M27 21h53M26 22h55M26 23h56M25 24h57M24 25h59M24 26h59M23 27h60M23 28h60M22 29h62M22 30h62M22 31h62M21 32h64M21 33h64M21 34h64M21 35h64M21 36h64M21 37h64M21 38h64M21 39h64M21 40h63M21 41h63M20 42h64M19 43h64M18 44h65M17 45h65M16 46h66M15 47h66M15 48h65M14 49h66M14 50h65M13 51h65M13 52h65M12 53h67M12 54h67M11 55h68M11 56h69M11 57h69M11 58h69M11 59h69M11 60h69M11 61h69M11 62h69M12 63h68M12 64h67M12 65h67M13 66h66M13 67h65M13 68h65M14 69h63M14 70h63M15 71h61M15 72h60M16 73h59M17 74h57M18 75h55M19 76h53M20 77h51M22 78h48M23 79h45M25 80h41M27 81h37M29 82h32M33 83h24M39 84h13';

export const BASE_COLOR = 0xf0f0f0f0;

export const COLORS = {
    SKIN: [
        '#f0f0f0',              // base
        '#f8d6bf',              // light
        '#e7b292',              // medium
        '#a45f41',              // tan
        '#6e442a',              // dark
        '#2c1c11',              // deep
    ],
    EYES: [
        '#686867',
        '#9a7356',
        '#59b3ae',
        '#91a57b',
        '#577fd8',
        '#9a95a9',
    ],
    HAIR: [
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
    ]
};

export const MODEL_PATHS = [
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

export const HAIR_STYLES = {
  'Spikey': '/media/spikey_model.png',
  'Wavy': '/media/wavy_model.png',
}

export const SCENE_SETTINGS = {
  BACKGROUND: 0xf0f0f0,
  CAMERA: {
    position: { x: 0, y: 1, z: 5 },
    target: { x: 0, y: 0.75, z: 0 },
    fov: 45,
    near: 0.1,
    far: 1000
  },
  LIGHTS: {
    directional: {
      color: 0xffffff,
      position: { x: 50, y: 50, z: 50 },
      intensity: 1,
      shadow: {
        mapSize: 1024,
        normalBias: 0.1
      }
    },
    ambient: {
      color: 0x404040,
      intensity: 50
    }
  },
  FLOOR: {
    geometry: {
        width: 5000,
        height: 5000,
        widthSegments: 1,
        heightSegments: 1
    },
    material: {
        color: BASE_COLOR,
        shininess: 0
    }
  }
};

export const MODEL_PARTS = {
  BODY: 'Body',
  EYEBROWS: 'Eyebrows',
  LEFT_IRIS: 'Left Iris',
  RIGHT_IRIS: 'Right Iris',
  LEFT_PUPIL: 'Left Pupil',
  RIGHT_PUPIL: 'Right Pupil',
  HAIR_SPIKEY: 'Spikey',
  HAIR_WAVY: 'Wavy'
};