"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = _interopRequireDefault(require("./config"));

var _helpers = require("./helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: add logger
const init = async () => {
  const {
    sourceLogin,
    sourcePassword,
    sourceUserAgent
  } = _config.default.secrets;
  const [err0, roles] = await _helpers.TickSource.init(sourceLogin, sourcePassword, sourceUserAgent);
  if (err0) console.error(`Wooo`, err0.message || err0);
  console.log('---roles-available', roles);
  const [err1, projects] = await _helpers.TickSource.getProjects();
  if (err1) console.error(`Tatata`, err1.message || err1);
  console.log('---projects-available', projects);
  const fromDate = '2019-06-01'; // TODO: refactor to return  [ subscrition_id, { project_id: [entries] } ]
  // TODO: currently it's { project_id: [entries] }

  const [err2, entries] = await _helpers.TickSource.getEntries(fromDate);
  if (err2) console.error(`Atata`, err2.message || err2);
  console.log('---entries', entries);
};

var _default = init;
exports.default = _default;