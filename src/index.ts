import * as express from 'express';
import bodyParser = require('body-parser');
import { connectToDatabase } from './config/db.config';

import teacherRoutes from './routes/teacher.routes';
import questionRoutes from './routes/question.routes'
import testRouter from './routes/test.routes';
import * as cors from 'cors';

const app = express();

// Connect to database
connectToDatabase().then(() => {
  console.log('Connected to database');
}).catch((error) => {
  console.error('Error connecting to database:', error);
});

// Middleware for parsing request bodies
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/teacher', teacherRoutes);
app.use('/question', questionRoutes);
app.use('/test', testRouter);

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
