const {
  SOURCE_LOGIN,
  SOURCE_PASSWORD,
  SOURCE_USER_AGENT,
  TARGET_LOGIN,
  TARGET_PASSWORD,
  TARGET_USER_AGENT,
  DB_SERVER_HOST,
  DB_SERVER_PORT,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DIALECT
} = process.env;

export const config = {
  secrets: {
    sourceLogin: SOURCE_LOGIN,
    sourcePassword: SOURCE_PASSWORD,
    sourceUserAgent: SOURCE_USER_AGENT,

    targetLogin: TARGET_LOGIN,
    targetPassword: TARGET_PASSWORD,
    targetUserAgent: TARGET_USER_AGENT
  },
  db: {
    host: DB_SERVER_HOST,
    port: DB_SERVER_PORT,
    database: DB_DATABASE,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    dialect: DB_DIALECT,
    logging: true
  }
};
