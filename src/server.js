import config from './config';
import request from 'request-promise';

const fakeAuthResponse = [
  {
    subscription_id: 126919,
    company: 'Some Inc.',
    api_token: '5cdbec7bb9e3d2449696b565d157d248'
  }
];

const authRequest = async params => {
  const { user, pass, userAgent } = params;
  const sourceAuthUrl = 'https://www.tickspot.com/api/v2/roles.json';

  const options = {
    url: sourceAuthUrl,
    headers: {
      'User-Agent': userAgent
    },
    auth: {
      user,
      pass
    },
    json: true
  };

  try {
    const data = await request(options);

    // suggesting, that user has only one role
    return data[0];
  } catch (error) {
    throw new Error(`Source auth failed:`, error.message || err);
  }
};

const init = async () => {
  const { sourceLogin, sourcePassword, sourceUserAgent } = config.secrets;

  const authData = {
    user: sourceLogin,
    pass: sourcePassword,
    userAgent: sourceUserAgent
  };

  const { api_token } = await authRequest(authData);
};

export default init;
