import express from 'express';

const app = express();

// middlewares
app.use(express.json());

// health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export default app;
