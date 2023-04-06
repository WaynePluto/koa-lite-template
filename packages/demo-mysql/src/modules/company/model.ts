import { Knex } from 'knex';

interface CompanyModel {
  id: number;
  uuid: string;
  name: string;
  created_time: Date;
  deleted_time: Date;
}

export class CompanyRepository {
  constructor(readonly db: Knex) {
    this.queryBuilder = db<CompanyModel, CompanyModel[]>('company');
  }

  private queryBuilder;

  create(data: Partial<Omit<CompanyModel, 'id'>>) {
    return this.queryBuilder.insert(data);
  }

  getList() {
    return this.queryBuilder.select();
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