class UserModel {
  id = '';
  name = '';
}
export class UserRepository {
  async getAll(){
    return [{id:1,name:"1"}]
  }

  async getById(id:string){
    return {id,name:'test'}
  }

}
