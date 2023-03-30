import { type Knex } from 'knex';
import { db } from './libs/knex';

class Dependency {
  db: Knex;

  constructor() {
    this.db = db;
  }

  init() {
    console.log('DI inited');
  }
}

export const DI = new Dependency();
