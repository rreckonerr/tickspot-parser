"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = _interopRequireDefault(require("./config"));

var _requestPromise = _interopRequireDefault(require("request-promise"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const fakeAuthResponse = [
//   {
//     subscription_id: 126919,
//     company: 'Some Inc.',
//     api_token: '5cdbec7bb9e3d2449696b565d157d248'
//   }
// ];
const getAuthToken = async params => {
  const {
    user,
    pass,
    userAgent
  } = params;
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
    const data = await (0, _requestPromise.default)(options); // suggesting, that user has only one role

    return data[0];
  } catch (error) {
    throw new Error(`Source auth failed:`, error.message || err);
  }
};

const getProjectsList = async (creds, auth) => {
  const options = {
    url: `https://www.tickspot.com/${creds.subscription_id}/api/v2/projects.json`,
    headers: {
      Authorization: `Token token=${creds.api_token}`,
      'User-Agent': auth.userAgent
    },
    json: true
  };

  try {
    const data = await (0, _requestPromise.default)(options);
    return data; // return data.map(({ id }) => id);
  } catch (error) {
    console.error(error);
  }
};

const getEntries = async (creds, auth, from, id) => {
  // TODO: add project id programmatically
  const options = {
    url: `https://www.tickspot.com/${creds.subscription_id}/api/v2/projects/${id}/entries.json?updated_at=${from}`,
    headers: {
      Authorization: `Token token=${creds.api_token}`,
      'User-Agent': auth.userAgent
    },
    json: true
  };

  try {
    const data = (0, _requestPromise.default)(options);
    return data;
  } catch (error) {
    console.error(error);
  }
}; // TODO: add logger


const init = async () => {
  const {
    sourceLogin,
    sourcePassword,
    sourceUserAgent
  } = _config.default.secrets;
  const authData = {
    user: sourceLogin,
    pass: sourcePassword,
    userAgent: sourceUserAgent
  };
  const credentials = await getAuthToken(authData);
  const projectsList = await getProjectsList(credentials, authData); // TODO: pass from date using argv

  const fromDate = '2019-06-01'; // TODO: refactor

  const entries = await projectsList.map(async ({
    id
  }) => {
    const data = await getEntries(credentials, authData, fromDate, id);
    return data;
  });
  Promise.all(entries).then(data => console.log(data));
  return entries;
};

var _default = init;
exports.default = _default;