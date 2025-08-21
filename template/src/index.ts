import { Faster, Models } from 'faster-auto';

const app = Faster({
  modelDir: './models',
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

Models.User.findAll().then((user) => {console.log(user)});