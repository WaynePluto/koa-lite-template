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
  constructor(readonly db: Knex) {}

  private get queryBuilder() {
    return this.db<UserModel, UserModel[]>('user');
  }

  create(data: Partial<Omit<UserModel, 'id'>>) {
    return this.queryBuilder.insert(data);
  }

  getList(page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
    return this.queryBuilder.select().limit(pageSize).offset(offset);
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