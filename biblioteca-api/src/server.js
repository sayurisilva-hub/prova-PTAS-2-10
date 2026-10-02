import express from 'express';
import loansRoutes from './routes/loansRoutes.js';
import { logger } from './middlewares/logMiddleware.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(logger);

app.use('/emprestimos', loansRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API de Emprestimos rodando em http://localhost:${PORT}`);
});
