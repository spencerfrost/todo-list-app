import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.NODE_ENV);
console.log(process.env.PORT);
console.log(process.env.ALLOWED_ORIGINS);

export default {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development'
};