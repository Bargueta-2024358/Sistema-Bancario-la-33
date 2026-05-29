import rateLimit from "express-rate-limit";

const isDev = process.env.NODE_ENV !== 'production';
const maxRequests = Number(process.env.RATE_LIMIT_MAX) || (isDev ? 500 : 120);

export const requestLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: maxRequests,
    standardHeaders: true,
    handler: (req, res) => {
        console.log(`Peticiones excedidas desde IP: ${req.ip}, Endpoint: ${req.path}`)
        res.status(429).json({
            success: false,
            message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde',
            error: 'RATE_LIMIT_EXCEEDED',
            retryAfter: Math.round((req.rateLimit.resetTime - Date.now())/1000)
        })
    }
})