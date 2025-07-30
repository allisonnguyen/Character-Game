// config/constants.js
export const SWATCH_ICON_PATH = 'M47 11h15M43 12h23M40 13h29M38 14h34M35 15h38M33 16h42M32 17h45M30 18h48M29 19h50M28 20h52M27 21h53M26 22h55M26 23h56M25 24h57M24 25h59M24 26h59M23 27h60M23 28h60M22 29h62M22 30h62M22 31h62M21 32h64M21 33h64M21 34h64M21 35h64M21 36h64M21 37h64M21 38h64M21 39h64M21 40h63M21 41h63M20 42h64M19 43h64M18 44h65M17 45h65M16 46h66M15 47h66M15 48h65M14 49h66M14 50h65M13 51h65M13 52h65M12 53h67M12 54h67M11 55h68M11 56h69M11 57h69M11 58h69M11 59h69M11 60h69M11 61h69M11 62h69M12 63h68M12 64h67M12 65h67M13 66h66M13 67h65M13 68h65M14 69h63M14 70h63M15 71h61M15 72h60M16 73h59M17 74h57M18 75h55M19 76h53M20 77h51M22 78h48M23 79h45M25 80h41M27 81h37M29 82h32M33 83h24M39 84h13';
export const TRIANGLE_NOSE_PATH = 'M48 16h1M48 17h1M47 18h3M47 19h3M47 20h3M46 21h5M46 22h5M45 23h6M45 24h7M45 25h7M44 26h8M44 27h9M44 28h9M43 29h11M43 30h11M43 31h11M42 32h13M42 33h13M41 34h14M41 35h15M41 36h15M40 37h16M40 38h17M40 39h17M39 40h18M39 41h19M39 42h19M38 43h20M38 44h21M37 45h22M37 46h22M37 47h23M36 48h24M36 49h25M36 50h25M35 51h26M35 52h27M34 53h28M34 54h28M34 55h29M33 56h30M33 57h30M33 58h31M32 59h32M32 60h32M32 61h33M31 62h34M31 63h34M30 64h36M30 65h36M30 66h36M29 67h38M29 68h38M29 69h39M28 70h40M28 71h40M28 72h41M27 73h42M27 74h42M26 75h44M26 76h44M26 77h44M25 78h46M25 79h46';
export const OVAL_NOSE_PATH = 'M40 22h16M35 23h26M32 24h32M29 25h38M27 26h42M25 27h46M24 28h48M22 29h52M21 30h54M20 31h56M19 32h58M18 33h60M17 34h62M16 35h64M15 36h66M14 37h68M14 38h68M13 39h70M13 40h70M12 41h72M12 42h72M11 43h74M11 44h74M11 45h74M11 46h74M11 47h74M11 48h74M11 49h74M11 50h74M11 51h74M11 52h74M12 53h72M12 54h72M13 55h70M13 56h70M14 57h68M14 58h68M15 59h66M16 60h64M17 61h62M18 62h60M19 63h58M20 64h56M21 65h54M22 66h52M24 67h48M25 68h46M27 69h42M29 70h38M32 71h32M35 72h26M40 73h16';
export const CUBE_NOSE_PATH = 'M20 24h56M18 25h60M17 26h62M17 27h62M16 28h64M16 29h64M16 30h64M16 31h64M16 32h64M16 33h64M16 34h64M16 35h64M16 36h64M16 37h64M16 38h64M16 39h64M16 40h64M16 41h64M16 42h64M16 43h64M16 44h64M16 45h64M16 46h64M16 47h64M16 48h64M16 49h64M16 50h64M16 51h64M16 52h64M16 53h64M16 54h64M16 55h64M16 56h64M16 57h64M16 58h64M16 59h64M16 60h64M16 61h64M16 62h64M16 63h64M16 64h64M16 65h64M16 66h64M16 67h64M17 68h62M17 69h62M18 70h60M20 71h56';

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
    ],
    BLUSH: [
        '#ffc5d3',
        '#fc6c85',
        '#ff007f',
        '#a94064',
    ]
};

export const TEXTURE_PATHS = [
    'textures/blush_mask.png',
];

export const MODEL_PATHS = [
  'models/body/base.glb',
  'models/body/eyebrows.glb',
  'models/body/left_eye.glb',
  'models/body/right_eye.glb',
  'models/body/cube_nose.glb',
  'models/body/oval_nose.glb',
  'models/body/triangle_nose.glb',
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
  'Spikey': '/media/spikey.png',
  'Wavy': '/media/wavy.png',
}

/*
export const NOSE_STYLES = {
    'Triangle Nose': '/media/triangle_nose.png',
    'Oval Nose': '/media/oval_nose.png',
    'Cube Nose': '/media/cube_nose.png',
}
*/

export const NOSE_STYLES = {
    'Triangle Nose': TRIANGLE_NOSE_PATH,
    'Oval Nose': OVAL_NOSE_PATH,
    'Cube Nose': CUBE_NOSE_PATH,
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
  HAIR_WAVY: 'Wavy',
  NOSE_TRIANGLE: 'Triangle Nose',
  NOSE_OVAL: 'Oval Nose',
  NOSE_CUBE: 'Cube Nose',
};