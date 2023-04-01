import { Knex } from 'knex';

interface CompanyModel {
  id: number;
  uuid: string;
  name: string;
  created_time: Date;
  deleted_time: Date;
}

export class CompanyRepository {
  constructor(private readonly db: Knex) {}

  private readonly queryBuilder = this.db<CompanyModel, CompanyModel[]>('company');

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