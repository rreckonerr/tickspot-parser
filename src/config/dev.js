export const config = {
  secrets: {
    sourceLogin: process.env.SOURCE_LOGIN,
    sourcePassword: process.env.SOURCE_PASSWORD,
    sourceUserAgent: process.env.SOURCE_USER_AGENT,

    targetLogin: process.env.TARGET_LOGIN,
    targetPassword: process.env.TARGET_PASSWORD,
    targetUserAgent: process.env.TARGET_USER_AGENT
  }
};
