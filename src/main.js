import './lib/init.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);

app.get('/', (_, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
