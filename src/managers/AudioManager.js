/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */

export default class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.sounds = new Map();
        this.playingSounds = new Set(); // Track playing sounds
        this.pausedSounds = new Set(); // Track paused sounds
    }

    create() {
        // Create sound instances
        this.sounds.set('win', this.scene.sound.add('win'));
        this.sounds.set('onion', this.scene.sound.add('onion'));
        this.sounds.set('loose', this.scene.sound.add('loose'));
        this.sounds.set('pluspoints', this.scene.sound.add('pluspoints'));
        this.sounds.set('minuspoints', this.scene.sound.add('minuspoints'));
        this.sounds.set('background', this.scene.sound.add('background'));
        this.sounds.set('eating', this.scene.sound.add('eating'));
        this.sounds.set('eatingopp', this.scene.sound.add('eatingopp'));
        this.sounds.set('onionopp', this.scene.sound.add('onionopp'));
        this.sounds.set('statewin', this.scene.sound.add('statewin'));
        this.sounds.set('statewinopp', this.scene.sound.add('statewinopp'));
    }

    play(key, config = {}) {
        const sound = this.sounds.get(key);
        if (sound) {
            sound.play({
                volume: 1,
                rate: 1,
                detune: 0,
                seek: 0,
                loop: false,
                delay: 0,
                ...config
            });
        }
    }

    isPlaying(key) {
        const sound = this.scene.sound.get(key);
        return sound && sound.isPlaying;
    }
    // Pause all playing sounds
    pauseAll() {// In AudioManager.js
        class AudioManager {
            isPlaying(key) {
                return this.sounds[key] && this.sounds[key].isPlaying;
            }
        }

        this.playingSounds.forEach(sound => {
            if (sound.isPlaying) {
                sound.pause();
                this.pausedSounds.add(sound);
            }
        });
    }

    // Resume all paused sounds
    resumeAll() {
        this.pausedSounds.forEach(sound => {
            sound.resume();
        });
        this.pausedSounds.clear();
    }


    // Pause specific sound
    pause(key) {
        const sound = this.sounds.get(key);
        if (sound && sound.isPlaying) {
            sound.pause();
            this.pausedSounds.add(sound);
        }
    }

    // Resume specific sound
    resume(key) {
        const sound = this.sounds.get(key);
        if (sound && this.pausedSounds.has(sound)) {
            sound.resume();
            this.pausedSounds.delete(sound);
        }
    }

    // Method to stop all sounds with fade out
    stopAllWithFade(duration = 1000) {
        this.sounds.forEach(sound => {
            if (sound.isPlaying) {
                this.scene.tweens.add({
                    targets: sound,
                    volume: 0,
                    duration: duration,
                    onComplete: () => {
                        sound.stop();
                    }
                });
            }
        });
    }

    stop(key) {
        const sound = this.sounds.get(key);
        if (sound) {
            sound.stop();
        }
    }

    cleanup() {
        this.sounds.forEach(sound => {
            sound.stop();
            sound.destroy();
        });
        this.sounds.clear();
    }
}