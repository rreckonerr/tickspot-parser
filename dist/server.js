"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = _interopRequireDefault(require("./config"));

var _requestPromise = _interopRequireDefault(require("request-promise"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fakeAuthResponse = [{
  subscription_id: 126919,
  company: 'Some Inc.',
  api_token: '5cdbec7bb9e3d2449696b565d157d248'
}];

const authRequest = async params => {
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
  const {
    api_token
  } = await authRequest(authData);
};

var _default = init;
exports.default = _default;