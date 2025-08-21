import { Request, Response } from 'express';
import path from 'path';
import { Faster, Models } from '../src';

const app = Faster({
  modelDir: path.join(__dirname, 'models'),
  db: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123456',
    database: 'test'
  },
  swagger: true,
  redoc: true,
  logStartupInfo: true
});
app.listen(3000, () => {
  // console.log('http://localhost:3000');
});

app.get('/hello', (req: Request, res: Response) => {
  res.send('Hello Faster Auto!');
});

Models.User.findAll().then((user) => {console.log(user)});