import { ulid } from 'ulid'
import { CompanyModel } from '@models/company.model.js'

async function getCompaniesByUserId(user_id: string) {
  return await CompanyModel.query().where('saas_client_id', user_id)
}

async function getCompaniesByName(name: string, user_id: string) {
  return await CompanyModel.query().where('name', name).andWhere('saas_client_id', user_id)
}

async function createCompany(name: string, user_id: string) {
  const company = await CompanyModel.query().insert({
    id: ulid().toString(),
    name,
    saas_client_id: user_id,
    icon: '',
  })
  return company
}

async function updateCompany(id: string, name: string, icon: string) {
  //TODO ADD REALISATION
}


export const CompanyRepository = {
  getCompaniesByUserId,
  getCompaniesByName,
  createCompany,
}
