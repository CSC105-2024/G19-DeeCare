import { Hono } from 'hono';
import { getUsers } from '../controllers/controller.js';

const router = new Hono();

router.get('/users', getUsers);

export  {router};
