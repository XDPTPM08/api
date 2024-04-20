import { config } from 'dotenv';
import { cwd } from 'process';

config({
  path: cwd() + '/.env'
});
