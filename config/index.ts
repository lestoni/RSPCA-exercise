/**
 * Load Module dependencies.
 */
const env = process.env;

export interface IConfig {
 DB_URL: string;
 ENV: string;
 PORT: number;
 HOST: string;
 API_URL: string;
 OPEN_ENDPOINTS: any;
 SALT_FACTOR: number;
};


const config = {
  API_URL: env.API_URL || "http://127.0.0.1:8090",

  ENV: env.NODE_ENV || "development",

  PORT: env.PORT || 8090,

  HOST: env.HOST_IP || "localhost",

  DB_URL: env.DB_URL || "sqlite:./datastore.db",

  OPEN_ENDPOINTS: [
    "/users/login",
    "/users/create"
  ],
  SALT_FACTOR: 11

};

export { config };
