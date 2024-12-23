/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */


// utils/atlasConverter.js
export function convertAtlas(originalAtlas) {
    const frames = [];
    
    originalAtlas.frames.forEach((frame, index) => {
        frames.push({
            filename: `frame_${index}`,
            frame: {
                x: frame[0],
                y: frame[1],
                w: frame[2],
                h: frame[3]
            },
            rotated: false,
            trimmed: false,
            spriteSourceSize: {
                x: 0,
                y: 0,
                w: frame[2],
                h: frame[3]
            },
            sourceSize: {
                w: frame[2],
                h: frame[3]
            }
        });
    });

    return {
        frames,
        meta: {
            image: originalAtlas.images[0],
            format: 'RGBA8888',
            size: { 
                w: 2048, // Set your atlas width
                h: 2048  // Set your atlas height
            },
            scale: 1
        }
    };
}
