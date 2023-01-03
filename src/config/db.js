import dotenv from "dotenv";
import mongoose from "mongoose";
import logger from '../loggers/Log4jsLogger.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, (err) => {
  err
    ? logger.error('Error al conectarse a MongoDB')
    : logger.info("Conectados a MongoDB");
});

export default mongoose;
