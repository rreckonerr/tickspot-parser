"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TickTarget = exports.TickSource = void 0;

var _requestPromise = _interopRequireDefault(require("request-promise"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TickApi {
  constructor() {
    this.apiRoot = `https://www.tickspot.com`;
    this.apiName = `api/v2`;
    this.hasOneRole = true;
    this.user = '';
    this.pass = '';
    this.agent = '';
    this.roles = null;
    this.projects = null;
  }

  async init(user = '', pass = '', agent = '') {
    try {
      if (!user || !pass || !agent) {
        console.error(`No credentials provided`);
        return;
      }

      this.user = user;
      this.pass = pass;
      this.agent = agent;
      this.roles = await this.authorize();
      console.log('---init-success', this.roles);
      return [null, this.roles];
    } catch (error) {
      console.error('Failed to init', error.message || error);
      return [error];
    }
  } // returns [ [ subscrition_id, { project_id: [entries] } ] ]


  async getAllEntries(fromDate) {
    if (!this.projects) {
      try {
        await this.getProjects();
      } catch (error) {
        console.error(`Failed to init projects`);
        return [error];
      }
    }

    let i = 0;
    const roles = Object.values(this.roles);
    let result = [];

    while (i < roles.length) {
      let entries = {};
      const {
        subscription_id
      } = roles[i];

      try {
        for await (let entriesKeyVal of this.entriesGen(subscription_id, fromDate)) {
          const [project_id, entriesArr] = entriesKeyVal;
          entries[project_id] = entriesArr;
        }

        result.push([subscription_id, entries]);
      } catch (error) {
        console.error(`Failed to get entries for ${this.roles[subscription_id].company}`);
      } finally {
        i++;
      }
    }

    return [null, result];
  }

  async *entriesGen(subscription_id, from_date) {
    let i = 0;
    const projects = this.projects[subscription_id];
    console.log('---projects', projects);

    while (i < projects.length) {
      const {
        id: project_id,
        name
      } = projects[i];
      const {
        api_token
      } = this.roles[subscription_id];
      const options = {
        subscription_id,
        project_id,
        api_token,
        from_date
      };

      try {
        yield [project_id, await this.getEntry(options)];
      } catch (error) {
        console.error(`Failed to load entries for ${name}`, error.message || error);
        yield [undefined, undefined];
      } finally {
        i++;
      }
    }
  }

  async getEntry({
    subscription_id,
    project_id,
    api_token,
    from_date
  }) {
    const options = {
      url: `${this.apiRoot}/${subscription_id}/${this.apiName}/projects/${project_id}/entries.json?updated_at=${from_date}`,
      headers: {
        Authorization: `Token token=${api_token}`,
        'User-Agent': this.agent
      },
      json: true
    };

    try {
      const data = await (0, _requestPromise.default)(options);
      return data;
    } catch (error) {
      console.error(`Woooow...`, error.message || error);
      return [];
    }
  }

  async getProjects() {
    try {
      let projects = {};

      for await (let projectKeyVal of this.projectsGen()) {
        const [subscription_id, projArr] = projectKeyVal;
        projects[subscription_id] = projArr;
      }

      this.projects = projects;
      return [null, projects];
    } catch (error) {
      console.error(`Ooops`, error.message || error);
      return [error];
    }
  }

  async *projectsGen() {
    let i = 0;
    const roles = Object.entries(this.roles);

    while (i < roles.length) {
      const [, role] = roles[i];
      const {
        subscription_id,
        company
      } = role;

      try {
        yield [subscription_id, await this.getProject(role)];
      } catch (error) {
        console.error(`Failed to get projects for ${company}`, error.message || error);
        return [undefined, undefined];
      } finally {
        i++;
      }
    }
  }

  async getProject({
    subscription_id,
    api_token,
    company
  }) {
    try {
      const options = {
        url: `${this.apiRoot}/${subscription_id}/${this.apiName}/projects.json`,
        headers: {
          Authorization: `Token token=${api_token}`,
          'User-Agent': this.agent
        },
        json: true
      };
      return await this.getRequest(options);
    } catch (error) {
      console.error(`Failed to get projects for ${company}`, error.message || error);
      return [];
    }
  }

  async authorize() {
    try {
      const options = {
        url: `${this.apiRoot}/${this.apiName}/roles.json`,
        headers: {
          'User-Agent': this.agent
        },
        auth: {
          user: this.user,
          pass: this.pass
        },
        json: true
      };
      const roles = await this.getRequest(options);
      return roles.reduce((acc, val) => {
        acc[val.subscription_id] = val;
        return acc;
      }, {});
    } catch (error) {
      console.error(`Failed to authorize`, error.message || error);
      return {};
    }
  }

  async getRequest(options = null) {
    if (!options) {
      console.error(`No options provided`);
      return [];
    }

    try {
      const data = await (0, _requestPromise.default)(options);
      return data;
    } catch (error) {
      console.error(`Ooops... request failed`, error.message || error);
      return [];
    }
  }

}

const TickSource = new TickApi();
exports.TickSource = TickSource;
const TickTarget = new TickApi();
exports.TickTarget = TickTarget;