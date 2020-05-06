const env = process.env.NODE_ENV || 'development';
const isDevelopment = env !== 'production';

if (isDevelopment) {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

const config = {
  firebase: {
    alg: process.env.ALG!,
    projectId: process.env.PROJECT_ID!,
    publicKeyUrl: process.env.PUBLIC_KEY_URL!,
    issUrl: process.env.ISS_URL!,
  },
};

export default config;
