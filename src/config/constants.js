// config/constants.js
import { normalizeColor } from '../utils/colorUtils';

export const SWATCH_ICON_PATH = 'M47 11h15M43 12h23M40 13h29M38 14h34M35 15h38M33 16h42M32 17h45M30 18h48M29 19h50M28 20h52M27 21h53M26 22h55M26 23h56M25 24h57M24 25h59M24 26h59M23 27h60M23 28h60M22 29h62M22 30h62M22 31h62M21 32h64M21 33h64M21 34h64M21 35h64M21 36h64M21 37h64M21 38h64M21 39h64M21 40h63M21 41h63M20 42h64M19 43h64M18 44h65M17 45h65M16 46h66M15 47h66M15 48h65M14 49h66M14 50h65M13 51h65M13 52h65M12 53h67M12 54h67M11 55h68M11 56h69M11 57h69M11 58h69M11 59h69M11 60h69M11 61h69M11 62h69M12 63h68M12 64h67M12 65h67M13 66h66M13 67h65M13 68h65M14 69h63M14 70h63M15 71h61M15 72h60M16 73h59M17 74h57M18 75h55M19 76h53M20 77h51M22 78h48M23 79h45M25 80h41M27 81h37M29 82h32M33 83h24M39 84h13';

export const TRIANGLE_NOSE_PATH = 'M48 16h1M48 17h1M47 18h3M47 19h3M47 20h3M46 21h5M46 22h5M45 23h6M45 24h7M45 25h7M44 26h8M44 27h9M44 28h9M43 29h11M43 30h11M43 31h11M42 32h13M42 33h13M41 34h14M41 35h15M41 36h15M40 37h16M40 38h17M40 39h17M39 40h18M39 41h19M39 42h19M38 43h20M38 44h21M37 45h22M37 46h22M37 47h23M36 48h24M36 49h25M36 50h25M35 51h26M35 52h27M34 53h28M34 54h28M34 55h29M33 56h30M33 57h30M33 58h31M32 59h32M32 60h32M32 61h33M31 62h34M31 63h34M30 64h36M30 65h36M30 66h36M29 67h38M29 68h38M29 69h39M28 70h40M28 71h40M28 72h41M27 73h42M27 74h42M26 75h44M26 76h44M26 77h44M25 78h46M25 79h46';
export const OVAL_NOSE_PATH = 'M40 22h16M35 23h26M32 24h32M29 25h38M27 26h42M25 27h46M24 28h48M22 29h52M21 30h54M20 31h56M19 32h58M18 33h60M17 34h62M16 35h64M15 36h66M14 37h68M14 38h68M13 39h70M13 40h70M12 41h72M12 42h72M11 43h74M11 44h74M11 45h74M11 46h74M11 47h74M11 48h74M11 49h74M11 50h74M11 51h74M11 52h74M12 53h72M12 54h72M13 55h70M13 56h70M14 57h68M14 58h68M15 59h66M16 60h64M17 61h62M18 62h60M19 63h58M20 64h56M21 65h54M22 66h52M24 67h48M25 68h46M27 69h42M29 70h38M32 71h32M35 72h26M40 73h16';
export const CUBE_NOSE_PATH = 'M20 24h56M18 25h60M17 26h62M17 27h62M16 28h64M16 29h64M16 30h64M16 31h64M16 32h64M16 33h64M16 34h64M16 35h64M16 36h64M16 37h64M16 38h64M16 39h64M16 40h64M16 41h64M16 42h64M16 43h64M16 44h64M16 45h64M16 46h64M16 47h64M16 48h64M16 49h64M16 50h64M16 51h64M16 52h64M16 53h64M16 54h64M16 55h64M16 56h64M16 57h64M16 58h64M16 59h64M16 60h64M16 61h64M16 62h64M16 63h64M16 64h64M16 65h64M16 66h64M16 67h64M17 68h62M17 69h62M18 70h60M20 71h56';

export const MOUTH_1_PATH = 'M13 33h4M79 33h4M11 34h7M78 34h7M11 35h8M77 35h8M10 36h9M77 36h9M10 37h10M76 37h10M10 38h10M76 38h10M10 39h11M75 39h11M10 40h11M75 40h11M10 41h11M75 41h11M11 42h11M74 42h11M11 43h12M73 43h12M12 44h12M72 44h12M12 45h12M72 45h12M13 46h12M71 46h12M14 47h12M70 47h12M14 48h13M69 48h13M15 49h13M68 49h13M16 50h13M67 50h13M16 51h14M66 51h14M17 52h15M64 52h15M18 53h17M61 53h17M20 54h18M58 54h18M21 55h21M54 55h21M23 56h50M25 57h46M28 58h40M30 59h36M33 60h30M36 61h24M40 62h16';
export const MOUTH_2_PATH = 'M6 42h4M86 42h4M5 43h7M84 43h7M5 44h8M42 44h12M83 44h8M4 45h10M39 45h18M82 45h10M4 46h11M34 46h28M81 46h11M4 47h13M32 47h32M79 47h13M4 48h18M30 48h36M74 48h18M4 49h88M5 50h86M6 51h84M7 52h82M8 53h80M10 54h33M53 54h33M12 55h28M56 55h28M15 56h20M61 56h20M18 57h12M66 57h12';
export const MOUTH_3_PATH = 'M35 31h13M34 32h16M33 33h20M32 34h22M31 35h25M30 36h28M29 37h31M28 38h33M27 39h36M26 40h39M25 41h14M44 41h23M24 42h14M47 42h21M23 43h14M49 43h22M22 44h14M51 44h22M21 45h14M53 45h22M20 46h14M55 46h22M19 47h14M56 47h23M18 48h15M58 48h23M17 49h15M59 49h24M15 50h16M61 50h23M15 51h15M63 51h22M13 52h16M64 52h22M13 53h16M65 53h22M12 54h16M67 54h20M12 55h16M68 55h19M12 56h15M69 56h18M12 57h14M71 57h16M12 58h14M73 58h13M12 59h13M75 59h11M12 60h12M77 60h8M12 61h12M79 61h5M12 62h11M13 63h9M14 64h6M15 65h3';

export const THEMES = {
  DEFAULT: {
    name: 'Default',
    primary: '#00ced1',
    primaryDark: '#007c74',
    secondary: '#73654b',
    accent: '#f7d359',
    background: '#f8eebb',
    lightBackground: '#fff9e6'
  },
  PINK: {
    name: 'Pink',
    primary: '#febdc3',
    primaryDark: '#ef758a',
    secondary: '#73654b',
    accent: '#32624c',
    background: '#88c9a1',
    lightBackground: '#e5ffe4'
  },
  GREEN: {
    name: 'Green',
    primary: '#88C9A1',
    primaryDark: '#32624C',
    secondary: '#73654B',
    accent: '#EF758A',
    background: '#FEBDC3',
    lightBackground: '#FFEBED'
  },
  BLUE: {
    name: 'Blue',
    primary: '#6AB7CA',
    primaryDark: '#15353C',
    secondary: '#73654B',
    accent: '#8F1300',
    background: '#E4A79E',
    lightBackground: '#FFE8DC'
  }
};

export const COLORS = {
    BACKGROUND: '#f8eebb',
    BASE: '#f0f0f0',
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
    NOSE: [
        '#f0f0f0',
        '#ffc5d3',
        '#fc6c85',
        '#ff007f',
        '#a94064',
    ],
    MOUTH: '#725147'
};

export const TEXTURE_PATHS = [
    'textures/mouth_1_mask.png',
    'textures/mouth_2_mask.png',
    'textures/mouth_3_mask.png',
];

export const MODEL_PATHS = [
  'models/body/base.glb',
  'models/body/body.glb',
  'models/body/eyebrows.glb',
  'models/body/left_iris.glb',
  'models/body/left_pupil.glb',
  'models/body/right_iris.glb',
  'models/body/right_pupil.glb',
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
  'bald': '/media/bald.png',
  'spikey': '/media/spikey.png',
  'wavy': '/media/wavy.png',
}

export const NOSE_STYLES = {
    'triangle_nose': TRIANGLE_NOSE_PATH,
    'oval_nose': OVAL_NOSE_PATH,
    'cube_nose': CUBE_NOSE_PATH,
}

export const MOUTH_STYLES = {
    'mouth 1': MOUTH_1_PATH,
    'mouth 2': MOUTH_2_PATH,
    'mouth 3': MOUTH_3_PATH,
}

export const TOP_STYLES = {
  'tshirt': '/media/tshirt.png',
  'yshirt': '/media/yshirt.png',
}

export const BOTTOM_STYLES = {
  'askirt': '/media/askirt.png',
  'lskirt': '/media/lskirt.png',
  'shorts': '/media/shorts.png',
  'pants': '/media/pants.png',
}

export const SCENE_SETTINGS = {
  BACKGROUND: normalizeColor(COLORS.BACKGROUND),
  CAMERA: {
    position: { x: 0, y: 1, z: 5 },
    lookUpPosition: { x: 4, y: 3.5, z: 2.5  },
    target: { x: 0, y: 0.9, z: 0 },
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
        color: normalizeColor(COLORS.BACKGROUND),
        shininess: 0
    }
  }
};

export const MODEL_PARTS = {
  BODY: 'body',
  EYEBROWS: 'eyebrows',
  LEFT_IRIS: 'left_iris',
  RIGHT_IRIS: 'right_iris',
  LEFT_PUPIL: 'left_pupil',
  RIGHT_PUPIL: 'right_pupil',
  HAIR_SPIKEY: 'spikey',
  HAIR_WAVY: 'wavy',
  NOSE_TRIANGLE: 'triangle_nose',
  NOSE_OVAL: 'oval_nose',
  NOSE_CUBE: 'cube_nose',
  MOUTH_1: 'mouth 1',
  MOUTH_2: 'mouth 2',
  MOUTH_3: 'mouth 3',
};

export const MODEL_CLOTHING = {
  ASKIRT: 'askirt',
  LSKIRT: 'lskirt',
  SHORTS: 'shorts',
  PANTS: 'pants',
  TSHIRT: 'tshirt',
  YSHIRT: 'yshirt',
}

export const FULL_BODY = [
  MODEL_PARTS.BODY,
  MODEL_PARTS.LEFT_IRIS,
  MODEL_PARTS.RIGHT_IRIS,
  MODEL_PARTS.LEFT_PUPIL,
  MODEL_PARTS.RIGHT_PUPIL,
  MODEL_PARTS.EYEBROWS,
  MODEL_PARTS.HAIR_SPIKEY,
  MODEL_PARTS.HAIR_WAVY,
  MODEL_PARTS.NOSE_TRIANGLE,
  MODEL_PARTS.NOSE_OVAL,
  MODEL_PARTS.NOSE_CUBE,
  MODEL_CLOTHING.ASKIRT,
  MODEL_CLOTHING.LSKIRT,
  MODEL_CLOTHING.SHORTS,
  MODEL_CLOTHING.PANTS,
  MODEL_CLOTHING.TSHIRT,
  MODEL_CLOTHING.YSHIRT,
]