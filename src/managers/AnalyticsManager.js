
export default class AnalyticsManager {
    constructor(scene) {
        this.scene = scene;
        this.metrics = {
            responseTime: [],
            accuracy: [],
            sessionDuration: 0,
            actionsPerMinute: [],
            sessionStartTime: Date.now()
        };
        this.currentSequence = {
            startTime: 0,
            actions: 0,
            hits: 0,
            misses: 0
        };
    }

    startAction() {
        this.currentSequence.startTime = Date.now();
    }

    recordResponse(success) {
        const responseTime = Date.now() - this.currentSequence.startTime;
        this.metrics.responseTime.push(responseTime);
        
        // Record accuracy
        this.currentSequence.actions++;
        if (success) {
            this.currentSequence.hits++;
        } else {
            this.currentSequence.misses++;
        }
        
        // Calculate current accuracy
        const accuracy = (this.currentSequence.hits / this.currentSequence.actions) * 100;
        this.metrics.accuracy.push(accuracy);
        
        // Calculate actions per minute
        const sessionDurationMinutes = (Date.now() - this.metrics.sessionStartTime) / 60000;
        const apm = this.currentSequence.actions / sessionDurationMinutes;
        this.metrics.actionsPerMinute.push(apm);
    }

    getAverageResponseTime() {
        if (this.metrics.responseTime.length === 0) return 0;
        const sum = this.metrics.responseTime.reduce((a, b) => a + b, 0);
        return sum / this.metrics.responseTime.length;
    }

    getCurrentAccuracy() {
        if (this.currentSequence.actions === 0) return 0;
        return (this.currentSequence.hits / this.currentSequence.actions) * 100;
    }

    getSessionDuration() {
        return (Date.now() - this.metrics.sessionStartTime) / 1000; // in seconds
    }

    getAnalyticsSummary() {
        return {
            averageResponseTime: this.getAverageResponseTime(),
            accuracy: this.getCurrentAccuracy(),
            sessionDuration: this.getSessionDuration(),
            totalActions: this.currentSequence.actions,
            averageAPM: this.metrics.actionsPerMinute.length > 0 ? 
                this.metrics.actionsPerMinute[this.metrics.actionsPerMinute.length - 1] : 0
        };
    }
}
