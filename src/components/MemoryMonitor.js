/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */
class MemoryMonitor {
  constructor(game) {
    this.game = game;
    this.previousMemory = 0;
    this.warningThreshold = 100 * 1024 * 1024; // 100MB
    this.criticalThreshold = 200 * 1024 * 1024; // 200MB
    this.leakThreshold = 5 * 1024 * 1024; // 5MB per check
  }

  start(interval = 5000) {
    this.intervalId = setInterval(() => this.checkMemory(), interval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  checkMemory() {
    if (!performance || !performance.memory) {
      console.warn('Performance API not available');
      return;
    }

    const currentMemory = performance.memory.usedJSHeapSize;
    const memoryDiff = currentMemory - this.previousMemory;
    
    console.log('Current memory usage:', Math.round(currentMemory / 1024 / 1024) + 'MB');
    console.log('Memory change:', Math.round(memoryDiff / 1024 / 1024) + 'MB');

    // Check for memory leaks
    if (memoryDiff > this.leakThreshold) {
      console.warn('Possible memory leak detected');
      this.checkForCommonLeaks();
    }

    // Warning levels
    if (currentMemory > this.criticalThreshold) {
      console.error('Critical memory usage!');
    } else if (currentMemory > this.warningThreshold) {
      console.warn('High memory usage');
    }

    this.previousMemory = currentMemory;
  }

  checkForCommonLeaks() {
    try {
      // Check texture memory
      if (this.game.textures && this.game.textures.list) {
        console.log('Textures in cache:', Object.keys(this.game.textures.list).length);
      }
      
      // Check active scenes
      if (this.game.scene && this.game.scene.scenes) {
        console.log('Active scenes:', this.game.scene.scenes.length);
        
        // Check game objects in each scene
        this.game.scene.scenes.forEach(scene => {
          if (scene && scene.children && scene.children.list) {
            console.log(`Scene ${scene.scene?.key || 'unknown'} objects:`, scene.children.list.length);
          }
        });
      }

      // Check event listeners
      this.checkEventListeners();
    } catch (error) {
      console.error('Error checking for memory leaks:', error);
    }
  }

  checkEventListeners() {
    try {
      if (this.game.scene && this.game.scene.scenes) {
        this.game.scene.scenes.forEach(scene => {
          if (scene && scene.events && scene.events.listeners) {
            const eventCount = Object.keys(scene.events.listeners).length;
            console.log(`Scene ${scene.scene?.key || 'unknown'} event listeners:`, eventCount);
          }
        });
      }
    } catch (error) {
      console.error('Error checking event listeners:', error);
    }
  }

  // Helper method to get detailed scene information
  getSceneInfo(scene) {
    if (!scene) return null;

    try {
      return {
        key: scene.scene?.key || 'unknown',
        objects: scene.children?.list?.length || 0,
        events: scene.events?.listeners ? Object.keys(scene.events.listeners).length : 0,
        textures: scene.textures ? Object.keys(scene.textures).length : 0
      };
    } catch (error) {
      console.error('Error getting scene info:', error);
      return null;
    }
  }

  // Get detailed memory usage
  getDetailedMemoryUsage() {
    try {
      return {
        jsHeapSize: performance.memory?.usedJSHeapSize || 0,
        totalJSHeapSize: performance.memory?.totalJSHeapSize || 0,
        jsHeapSizeLimit: performance.memory?.jsHeapSizeLimit || 0
      };
    } catch (error) {
      console.error('Error getting detailed memory usage:', error);
      return null;
    }
  }

  // Format bytes to human readable format
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get complete system status
  getSystemStatus() {
    try {
      const memory = this.getDetailedMemoryUsage();
      const scenes = this.game.scene?.scenes?.map(scene => this.getSceneInfo(scene)) || [];
      const textureCount = this.game.textures?.list ? Object.keys(this.game.textures.list).length : 0;

      return {
        memory: {
          used: this.formatBytes(memory?.jsHeapSize || 0),
          total: this.formatBytes(memory?.totalJSHeapSize || 0),
          limit: this.formatBytes(memory?.jsHeapSizeLimit || 0)
        },
        scenes: scenes.filter(scene => scene !== null),
        textureCount,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting system status:', error);
      return null;
    }
  }
}

  export default MemoryMonitor 