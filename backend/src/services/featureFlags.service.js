import { redis } from '../config/redis.js';

class FeatureFlagService {
    constructor() {
        // Default flags (fallback)
        this.defaults = {
            'BETA_FEATURE': false,
            'NEW_DASHBOARD': true,
            'MAINTENANCE_MODE': false
        };
    }

    async isEnabled(flagName) {
        try {
            // Check Redis First
            const val = await redis.get(`feature:${flagName}`);
            if (val !== null) {
                return val === 'true';
            }
            // Fallback to defaults
            return this.defaults[flagName] || false;
        } catch (err) {
            console.error('Feature Flag Error:', err);
            return this.defaults[flagName] || false;
        }
    }

    async setFlag(flagName, isEnabled) {
        await redis.set(`feature:${flagName}`, String(isEnabled));
    }
}

export const featureFlags = new FeatureFlagService();
