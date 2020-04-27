const env = process.env.NODE_ENV || 'development';
const isDevelopment = env !== 'production';

if (isDevelopment) {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

const config = {
  firebase: {
    alg: 'RS256',
    projectId: 'triton-exchange',
    publicKeyUrl:
      'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com',
  },
};

export default config;
