export class Model {
  id = '';
  name = '';
}
export class CompanyRepository {
  async getAll(){
    return [{id:1,name:"Company"}]
  }

  async getById(id:string){
    return {id,name:'test'}
  }

}
