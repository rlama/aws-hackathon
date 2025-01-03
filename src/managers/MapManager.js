/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */


import { MAP_CONFIG, MAX_MOBILE_WIDTH } from "../config/gameConfig";

export default class MapManager {
    constructor(scene, scaleOffset = 1, yOffset = 0, idleColor) {

        this.scene = scene;
        this.states = [];
        this.stateData = null;
        this.gameWidth = this.scene.cameras.main.width;
        this.gameHeight = this.scene.cameras.main.height;

        // Initialize properties
        this.minLong = Infinity;
        this.maxLong = -Infinity;
        this.minLat = Infinity;
        this.maxLat = -Infinity;
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;

        this.scaleOffset = scaleOffset;
        this.yOffset = yOffset;

        this.idleColor = idleColor || MAP_CONFIG;

        this.statePolygons = new Map(); // Initialize the Map
        this.stateLabels = new Map();   // Initialize the Map for labels
    }


    createStateMap() {
        this.stateData = this.scene.cache.json.get('mapData');

        if (!this.stateData || !this.stateData.features) {
            console.error('Map data not loaded correctly!');
            return;
        }

        this.calculateMapBounds();
        this.calculateMapDimensions();
        this.drawStates();

        // this.addDebugElements();

        // console.log("Map bounds:", {
        //     minLong: this.minLong,
        //     maxLong: this.maxLong,
        //     minLat: this.minLat,
        //     maxLat: this.maxLat
        // });
        // console.log("States created:", this.states.map(s => s.id));
    }

    calculateMapBounds() {
        this.stateData.features.forEach((feature, index) => {
            if (!feature.geometry || !feature.geometry.coordinates || !feature.geometry.coordinates[0]) {
                console.error(`Invalid feature at index ${index}`);
                return;
            }

            const coordinates = feature.geometry.coordinates[0];
            coordinates.forEach(coord => {
                const longitude = Number(coord[0]);
                const latitude = Number(coord[1]);

                if (!isNaN(longitude) && !isNaN(latitude)) {
                    this.minLong = Math.min(this.minLong, longitude);
                    this.maxLong = Math.max(this.maxLong, longitude);
                    this.minLat = Math.min(this.minLat, latitude);
                    this.maxLat = Math.max(this.maxLat, latitude);
                }
            });
        });
    }

    calculateMapDimensions() {
        const centerLat = (this.minLat + this.maxLat) / 2;
        const latitudeCorrection = Math.cos((centerLat * Math.PI) / 180);
        const mapWidth = (this.maxLong - this.minLong) * latitudeCorrection;
        const mapHeight = this.maxLat - this.minLat;

        const padding = 80;
        const scaleX = ((this.gameWidth - padding * 2) / mapWidth) / this.scaleOffset;
        const scaleY = ((this.gameHeight - padding * 2) / mapHeight) / this.scaleOffset;
        this.scale = Math.min(scaleX, scaleY) * (this.gameWidth < MAX_MOBILE_WIDTH ? 1.7 : 1);

        this.offsetX = (this.gameWidth - mapWidth * this.scale) / 2;
        this.offsetY = (this.gameHeight - mapHeight * this.scale) / 2;
    }

    drawStates() {
        this.states = [];
        const centerLat = (this.minLat + this.maxLat) / 2;
        const latitudeCorrection = Math.cos((centerLat * Math.PI) / 180);

        this.stateData.features.forEach((feature, index) => {
            const graphics = this.scene.add.graphics();
            const coordinates = feature.geometry.coordinates[0];

            graphics.lineStyle(this.idleColor.idle.lineStyle, this.idleColor.idle.lineColor, 1);
            graphics.fillStyle(this.idleColor.idle.fillStyle, 1);
            graphics.beginPath();

            coordinates.forEach((coord, i) => {
                const longitude = coord[0];
                const latitude = coord[1];

                const adjustedX = (longitude - this.minLong) * latitudeCorrection * this.scale + this.offsetX;
                const adjustedY = (this.gameHeight - ((latitude - this.minLat) * this.scale + this.offsetY)) + this.yOffset;

                if (i === 0) {
                    graphics.moveTo(adjustedX, adjustedY);
                } else {
                    graphics.lineTo(adjustedX, adjustedY);
                }
            });

            graphics.closePath();
            graphics.fillPath();
            graphics.strokePath();

            this.states.push({
                graphics,
                id: feature.properties.name
            });

            // Store the graphics object in the Map with state name as key
            this.statePolygons.set(feature.properties.name, graphics);
        });
    }

    addDebugElements() {
        const debugGraphics = this.scene.add.graphics();
        debugGraphics.lineStyle(2, 0xff0000);
        debugGraphics.strokeRect(0, 0, this.gameWidth, this.gameHeight);

        const coordText = this.scene.add.text(10, 50, '', {
            color: '#000000',
            backgroundColor: '#ffffff'
        });
        coordText.setDepth(5);
        this.scene.input.on('pointermove', (pointer) => {
            coordText.setText(`X: ${pointer.x}\nY: ${pointer.y}`);
        });
    }

    highlightState(stateId, abbre, highlightColor = 0xff0000, opacity=0.3) {

        const state = this.states.find(state => state.id === stateId);
        if (state) {
            const graphics = state.graphics;
            graphics.clear();
            graphics.lineStyle(1, highlightColor, 1);
            graphics.fillStyle(highlightColor, opacity);

            const feature = this.stateData.features.find(f => f.properties.name === stateId);
            if (!feature) {
                console.error('Feature not found for state:', stateId);
                return;
            }

            const coordinates = feature.geometry.coordinates[0];
            const centerLat = (this.maxLat + this.minLat) / 2;
            const latitudeCorrection = Math.cos((centerLat * Math.PI) / 180);

            graphics.beginPath();

            coordinates.forEach((coord, i) => {
                const longitude = coord[0];
                const latitude = coord[1];

                const adjustedX = (longitude - this.minLong) * latitudeCorrection * this.scale + this.offsetX;
                const adjustedY = (this.gameHeight - ((latitude - this.minLat) * this.scale + this.offsetY)) + this.yOffset;

                if (i === 0) {
                    graphics.moveTo(adjustedX, adjustedY);
                } else {
                    graphics.lineTo(adjustedX, adjustedY);
                }
            });

            graphics.closePath();
            graphics.fillPath();
            graphics.strokePath();
            graphics.setDepth(4);


            if (abbre) {

                // Calculate center of the state for label placement
                let minX = Infinity, maxX = -Infinity;
                let minY = Infinity, maxY = -Infinity;

                coordinates.forEach(coord => {
                    const x = (coord[0] - this.minLong) * latitudeCorrection * this.scale + this.offsetX;
                    const y = (this.gameHeight - ((coord[1] - this.minLat) * this.scale + this.offsetY)) + this.yOffset;
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x);
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                });

                const centerX = (minX + maxX) / 2;
                const centerY = (minY + maxY) / 2;

                // Remove existing label if there is one
                if (this.stateLabels.has(stateId)) {
                    this.stateLabels.get(stateId).destroy();
                }

                // Add the state abbreviation text
                const label = this.scene.add.text(centerX, centerY, abbre, {
                    fontSize: '16px',
                    fontStyle: 'bold',
                    color: '#FFFFFF',
                    stroke: '#000000',
                    strokeThickness: 2,
                }).setOrigin(0.5);

                // Store the label reference
                this.stateLabels.set(stateId, label);
                label.setDepth(5); // Make sure label is above the highlighted state
            }

        }
    }

    resetStateHighlight(stateId) {
        const state = this.states.find(state => state.id === stateId);
        if (state) {
            const graphics = state.graphics;
            graphics.clear();
            graphics.lineStyle(2, 0x000000, 1);
            graphics.fillStyle(0x666666, 1);

            const feature = this.stateData.features.find(f => f.properties.name === stateId);
            const coordinates = feature.geometry.coordinates[0];
            const centerLat = (this.maxLat + this.minLat) / 2;
            const latitudeCorrection = Math.cos((centerLat * Math.PI) / 180);

            graphics.beginPath();

            coordinates.forEach((coord, i) => {
                const longitude = coord[0];
                const latitude = coord[1];

                const adjustedX = (longitude - this.minLong) * latitudeCorrection * this.scale + this.offsetX;
                const adjustedY = this.gameHeight - ((latitude - this.minLat) * this.scale + this.offsetY);

                if (i === 0) {
                    graphics.moveTo(adjustedX, adjustedY);
                } else {
                    graphics.lineTo(adjustedX, adjustedY);
                }
            });

            graphics.closePath();
            graphics.fillPath();
            graphics.strokePath();
            graphics.setDepth(0);
        }
    }
}
