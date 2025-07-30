// utils/colorUtils.js
export function normalizeColor(color) {
    if (typeof color === 'string' && color.startsWith('#')) {
        return parseInt(color.replace('#', '0x'));
    }
    return color;
}