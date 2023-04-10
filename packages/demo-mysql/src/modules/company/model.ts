import { Knex } from 'knex';

interface CompanyModel {
  id: number;
  uuid: string;
  name: string;
  created_time: Date;
  deleted_time: Date;
}

export class CompanyRepository {
  constructor(readonly db: Knex) {}

  private get queryBuilder() {
    return this.db<CompanyModel, CompanyModel[]>('company');
  }

  create(data: Partial<Omit<CompanyModel, 'id'>>) {
    return this.queryBuilder.insert(data);
  }

  getList(page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
    return this.queryBuilder.select().limit(pageSize).offset(offset);
  }

  findById(id: number | string) {
    return this.queryBuilder.where('id', id).first();
  }

  updateById(id: number | string, data: Partial<Omit<CompanyModel, 'id'>>) {
    return this.queryBuilder.where('id', id).update(data);
  }

  deleteById(id: number | string) {
    return this.queryBuilder.where('id', id).delete();
  }
}