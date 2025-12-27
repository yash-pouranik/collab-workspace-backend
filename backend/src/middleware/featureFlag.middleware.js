import { featureFlags } from '../services/featureFlags.service.js';

export const checkFeature = (flagName) => {
    return async (req, res, next) => {
        const enabled = await featureFlags.isEnabled(flagName);
        if (!enabled) {
            return res.status(403).json({
                message: `Feature '${flagName}' is currently disabled`
            });
        }
        next();
    };
};
