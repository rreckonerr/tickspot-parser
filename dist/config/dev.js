"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
const config = {
  secrets: {
    sourceLogin: process.env.SOURCE_LOGIN,
    sourcePassword: process.env.SOURCE_PASSWORD
  }
};
exports.config = config;