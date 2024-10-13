/*
 * Title: Satkhira CCTV House Backend Application
 * Description: It's a ecommerce application.
 * Author: Md Naim Uddin
 * Date: 26/09/2024
 *
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import routes from './app/routes';
import { globalErrorHandler, notFound } from './app/utils';

const app: Application = express();

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://green-society-client.vercel.app'],
  })
);
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

//Testing
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: 'Green Society Backend API Running...' });
});

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use(notFound);

export default app;
