import request from 'request-promise';
import prompts from 'prompts';
import { logger } from '../helpers';

class TickApi {
  constructor(type = '') {
    const allowedTypes = ['source', 'target'];
    if (!type && !allowedTypes.includes(type)) {
      throw new Error(`Must include type 'source' or 'target'`);
    }
    this.type = type;
    this.apiRoot = `https://www.tickspot.com`;
    this.apiName = `api/v2`;
    this.hasOneRole = true;

    this.user = '';
    this.pass = '';
    this.agent = '';

    this.role = null;
    this.projects = null;
    this.entries = null;
    this.users = null;
    this.tasks = null;
    this.clients = null;
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

      const roles = await this.authorize();
      const role = await this.askUserRole(roles);

      this.role = role;

      logger.verbose(`TickApi for ${user} is ready and has roles.`);
      return [null, this.role];
    } catch (error) {
      console.error('Failed to init', error.message || error);
      return [error];
    }
  }

  getSubscriptionId() {
    if (!this.role) throw new Error(`Must init ${this.type} project first.`);
    const { subscription_id } = this.role;

    return subscription_id;
  }

  async createEntry(data = null) {
    if (!data) return ['No entry data provided'];

    const { subscription_id, api_token } = this.role;
    // TODO: add validation
    const { date, hours, notes, task_id, user_id } = data;

    const options = {
      url: `${this.apiRoot}/${subscription_id}/${this.apiName}/entries.json`,
      headers: {
        Authorization: `Token token=${api_token}`,
        'User-Agent': this.agent
      },
      body: {
        entry: {
          date,
          hours,
          notes,
          task_id,
          user_id
        }
      },
      json: true
    };

    try {
      const newEntry = await this.postRequest(options);

      return [null, newEntry];
    } catch (error) {
      logger.error(`Failed to POST entry ${notes}`, {
        reason: error.message || error
      });
    }
  }

  async createTask(data = null) {
    if (!data) return ['No task data provided'];

    const { subscription_id, api_token } = this.role;
    // TODO: add validation
    const { name, budget, project_id, billable } = data;

    const options = {
      url: `${this.apiRoot}/${subscription_id}/${this.apiName}/tasks.json`,
      headers: {
        Authorization: `Token token=${api_token}`,
        'User-Agent': this.agent
      },
      body: {
        task: {
          name,
          budget,
          project_id,
          billable
        }
      },
      json: true
    };

    try {
      const newTask = await this.postRequest(options);

      return [null, newTask];
    } catch (error) {
      logger.error(`Failed to POST task ${name}`, {
        reason: error.message || error
      });

      return [error.message || error];
    }
  }

  async createProject(data = null) {
    if (!data) return ['No data provided'];

    const { subscription_id, api_token } = this.role;
    // TODO: add validation
    const {
      name,
      budget,
      date_closed,
      notifications,
      billable,
      recurring,
      client_id,
      owner_id
    } = data;

    const options = {
      url: `${this.apiRoot}/${subscription_id}/${this.apiName}/projects.json`,
      headers: {
        Authorization: `Token token=${api_token}`,
        'User-Agent': this.agent
      },
      body: {
        project: {
          name,
          budget,
          date_closed,
          notifications,
          billable,
          recurring,
          client_id,
          owner_id
        }
      },
      json: true
    };

    try {
      const newProject = await this.postRequest(options);

      return [null, newProject];
    } catch (error) {
      logger.error(`Failed to post project ${data.id}`, {
        reason: error.message || error
      });
      return [error.message || error];
    }
  }

  async askUserRole(roles) {
    const choices = roles.reduce((acc, { subscription_id, company }) => {
      acc.push({ title: company, value: subscription_id });
      return acc;
    }, []);

    const response = await prompts(
      {
        type: 'select',
        name: 'selected_id',
        message: `Select subscription for the ${this.type}.`,
        choices
      },
      { onCancel: () => process.exit(1) }
    );

    const { selected_id } = response;

    return roles.find(({ subscription_id }) => subscription_id === selected_id);
  }

  async getAllClients() {
    const clients = [];

    try {
      for await (const clientsRaw of this.clientsGen()) {
        clients.push(...clientsRaw);
      }

      this.clients = clients;

      logger.verbose(
        `Successfully downloaded ${clients.length} clients for ${this.type} ${this.user}.`
      );

      return [null, clients];
    } catch (error) {
      logger.error(`Failed to fetch clients for ${this.type} ${this.user}`, {
        reason: error.message || error
      });
    }
  }

  async *clientsGen() {
    const { api_token, subscription_id } = this.role;

    const options = {
      subscription_id,
      api_token
    };

    try {
      yield await this.getClients(options);
    } catch (error) {
      console.error(`Failed to get clients`, error.message || error);
      yield [];
    }
  }

  async getClients({ subscription_id, api_token }) {
    const options = {
      url: `${this.apiRoot}/${subscription_id}/${this.apiName}/clients.json`,
      headers: {
        Authorization: `Token token=${api_token}`,
        'User-Agent': this.agent
      },
      json: true
    };

    try {
      const clients = await this.getRequest(options);

      return clients;
    } catch (error) {
      logger.error(`Failed to fetch clients :(`, {
        reason: error.message || error
      });
      return [];
    }
  }

  async getAllTasks() {
    const tasks = [];

    try {
      for await (const tasksRaw of this.tasksGen()) {
        tasks.push(...tasksRaw);
      }

      this.tasks = tasks;

      logger.verbose(
        `Successfully downloaded ${tasks.length} tasks for ${this.type} ${this.user}.`
      );

      return [null, tasks];
    } catch (err) {
      logger.error(`Failed to get tasks for ${this.type} ${this.user}`, {
        reason: err.message || err
      });
      return [err.message || err];
    }
  }

  async *tasksGen() {
    const { api_token, subscription_id } = this.role;

    const options = {
      subscription_id,
      api_token
    };

    try {
      yield await this.getTasks(options);
    } catch (error) {
      console.error(`Failed to get tasks`, error.message || error);
      yield [];
    }
  }

  async getTasks({ subscription_id, api_token }) {
    const options = {
      url: `${this.apiRoot}/${subscription_id}/${this.apiName}/tasks.json`,
      headers: {
        Authorization: `Token token=${api_token}`,
        'User-Agent': this.agent
      },
      json: true
    };

    try {
      const tasks = await this.getRequest(options);

      return tasks;
    } catch (error) {
      console.error(`Failed to fetch tasks :(`);
      return [];
    }
  }

  async createUsers(sourceUsers = null) {
    try {
      if (!sourceUsers) return [`No users provided`];
      const targetUsers = [];
      for await (const targetUser of this.createUsersGen(sourceUsers)) {
        if (targetUser) targetUsers.push(targetUser);
      }
      return [null, targetUsers];
    } catch (error) {
      return [error.message || error];
    }
  }

  async *createUsersGen(users) {
    let i = 0;
    while (i < users.length) {
      try {
        const sourceUser = users[i];

        const {
          first_name,
          last_name,
          email,
          admin,
          billable_rate
        } = sourceUser;

        const userToCreate = {
          first_name,
          last_name,
          email,
          admin: Boolean(admin),
          billable_rate
        };

        const [err, targetUser] = await this.createUser(userToCreate);
        if (err) throw Error(err.message || error);

        yield targetUser;
      } catch (error) {
        logger.error(`Failed to create target user for ${user[i].email}`, {
          reason: error.message || error
        });
        yield undefined;
      } finally {
        i++;
      }
    }
  }

  async createUser(user = null) {
    if (!user) return ['No user data provided'];

    const { subscription_id, api_token } = this.role;
    // TODO: add validation
    const { first_name, last_name, email, admin, billable_rate } = user;

    const options = {
      url: `${this.apiRoot}/${subscription_id}/${this.apiName}/users.json`,
      headers: {
        Authorization: `Token token=${api_token}`,
        'User-Agent': this.agent
      },
      body: {
        user: {
          first_name,
          last_name,
          email,
          admin,
          billable_rate
        }
      },
      json: true
    };

    try {
      const newUser = await this.postRequest(options);

      return [null, newUser];
    } catch (error) {
      logger.error(`Failed to POST user ${email} to target`, {
        reason: error.message || error
      });
      return [error.message || error];
    }
  }

  async createClient(client = null) {
    if (!client) return ['No client data provided'];

    const { subscription_id, api_token } = this.role;
    // TODO: add validation
    const { name, archive } = client;

    const options = {
      url: `${this.apiRoot}/${subscription_id}/${this.apiName}/clients.json`,
      headers: {
        Authorization: `Token token=${api_token}`,
        'User-Agent': this.agent
      },
      body: {
        client: {
          name,
          archive
        }
      },
      json: true
    };

    try {
      const newClient = await this.postRequest(options);

      return [null, newClient];
    } catch (error) {
      logger.error(`Failed to POST client ${name} to target`, {
        reason: error.message || error
      });
      return [error.message || error];
    }
  }

  async getAllUsers() {
    try {
      const users = [];
      try {
        for await (let usersRaw of this.usersGen()) {
          users.push(...usersRaw);
        }
      } catch (err) {
        console.error(
          `Failed to get users for ${this.user}`,
          err.message || err
        );
      }

      this.users = users;

      logger.verbose(
        `${this.user} ${this.type} has ${users.length} users available.`
      );

      return [null, users];
    } catch (error) {
      console.error(`Failed to get all users`, error.messsage || error);
      return [error.message || error];
    }
  }

  async *usersGen() {
    // TODO: add pages
    const { api_token, subscription_id } = this.role;

    const options = {
      subscription_id,
      api_token
    };

    try {
      yield await this.getUsers(options);
    } catch (error) {
      console.error(`Failed to get users`, error.message || error);
      yield [];
    }
  }

  async getUsers({ subscription_id, api_token }) {
    try {
      const options = {
        url: `${this.apiRoot}/${subscription_id}/${this.apiName}/users.json`,
        headers: {
          Authorization: `Token token=${api_token}`,
          'User-Agent': this.agent
        },
        json: true
      };

      const users = await this.getRequest(options);

      return users;
    } catch (error) {
      console.error(`Failed to fetch users`);
      return [];
    }
  }

  async getAllEntries(fromDate) {
    if (!this.projects) {
      try {
        await this.getAllProjects();
      } catch (error) {
        console.error(`Failed to init projects`);
        return [error];
      }
    }

    const entries = [];

    try {
      for await (let entriesRaw of this.entriesGen(fromDate)) {
        entries.push(...entriesRaw);
      }
    } catch (error) {
      console.error(`Failed to get entries for ${this.role.company}`);
    }

    this.entries = entries;
    logger.verbose(
      `Successfully downloaded ${entries.length} entries for ${this.type} ${this.user}.`
    );
    return [null, entries];
  }

  async *entriesGen(from_date) {
    const { subscription_id, api_token } = this.role;

    const options = {
      subscription_id,
      api_token,
      from_date
    };

    try {
      yield await this.getEntry(options);
    } catch (error) {
      console.error(
        `Failed to load entries for ${name}`,
        error.message || error
      );
      yield [];
    }
  }

  async getEntry({ subscription_id, api_token, from_date }) {
    const options = {
      url: `${this.apiRoot}/${subscription_id}/${this.apiName}/entries.json?updated_at=${from_date}`,
      headers: {
        Authorization: `Token token=${api_token}`,
        'User-Agent': this.agent
      },
      json: true
    };

    try {
      const data = await request(options);
      return data;
    } catch (error) {
      console.error(`Woooow...`, error.message || error);
      return [];
    }
  }

  // TODO: refactor to return [[subscription_id, {project_id: project}]]
  async getAllProjects() {
    try {
      const projects = [];

      for await (const projectsRaw of this.projectsGen()) {
        projects.push(...projectsRaw);
      }

      this.projects = projects;
      logger.verbose(
        `Successfully downloaded ${projects.length} projects for ${this.type} ${this.user}.`
      );
      return [null, projects];
    } catch (error) {
      console.error(`Failed to load projects`, error.message || error);
      return [error];
    }
  }

  async *projectsGen() {
    try {
      yield await this.getProject(this.role);
    } catch (error) {
      console.error(
        `Failed to get projects for ${company}`,
        error.message || error
      );
      return undefined;
    }
  }

  async getProject({ subscription_id, api_token, company }) {
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
      console.error(
        `Failed to get projects for ${company}`,
        error.message || error
      );
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

      return roles;
      // return roles.reduce((acc, val) => {
      //   acc[val.subscription_id] = val;

      //   return acc;
      // }, {});
    } catch (error) {
      console.error(`Failed to authorize`, error.message || error);
      return {};
    }
  }

  async getRequest(options = null) {
    if (!options) {
      logger.error(`No options provided`);
      return [];
    }
    try {
      const data = await request(options);

      return data;
    } catch (error) {
      logger.error(`GET request failed`, {
        reason: error.message || error,
        metadata: options
      });
      return [];
    }
  }

  async postRequest(options = null) {
    if (!options) {
      logger.error(`No options provided for post request`);
      return undefined;
    }
    try {
      const data = await request({ ...options, method: 'POST' });

      return data;
    } catch (error) {
      logger.error(`POST request failed`, {
        reason: error.message || error,
        metadata: options
      });
      return undefined;
    }
  }
}

const TickSource = new TickApi('source');
const TickTarget = new TickApi('target');

export { TickSource, TickTarget };
