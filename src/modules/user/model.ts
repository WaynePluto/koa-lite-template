import { Knex } from 'knex';

interface UserModel {
  id: number;
  uuid: string;
  openid: string;
  unionid: string;
  name: string;
  created_time: Date;
}

export class UserRepository {
  constructor(readonly db: Knex) {
    this.queryBuilder = db<UserModel, UserModel[]>('user');
  }

  private queryBuilder;

  create(data: Partial<Omit<UserModel, 'id'>>) {
    return this.queryBuilder.insert(data);
  }

  getList() {
    return this.queryBuilder.select();
  }

  findById(id: number | string) {
    return this.queryBuilder.where('id', id).first();
  }

  updateById(id: number | string, data: Partial<Omit<UserModel, 'id'>>) {
    return this.queryBuilder.where('id', id).update(data);
  }

  deleteById(id: number | string) {
    return this.queryBuilder.where('id', id).delete();
  }
}