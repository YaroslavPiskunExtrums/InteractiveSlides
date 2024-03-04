import { ulid } from 'ulid'
import { CompanyModel } from '@models/company.model.js'
import { SalesModel } from '@models/sales.model.js'
import { HubspotService } from '@lib/services/hubspot.service.js'
import * as hubspot from '@hubspot/api-client'
import * as console from 'console'

interface ISales {
  name: string,
  company_name: string,
  user_id: string,
  hs_company_id?: string,
}

async function createSales(sales: ISales) {

  console.log('sales', sales)

  let company;


  if(sales.hs_company_id) {
    company = await CompanyModel.query().where({ hubspot_id: sales.hs_company_id }).first()
  }
  else {
    company = await CompanyModel.query().where({ name: sales.company_name }).andWhere({saas_client_id: sales.user_id}).first()
  }


  if (!company) {
    company = await CompanyModel.query().insert({
      id: ulid().toString(),
      name: sales.company_name,
      saas_client_id: sales.user_id,
      icon: '',
      hubspot_id: sales.hs_company_id,
    })

  }
  if(!company.hubspot_id) {
    console.log("WANT TO CREATE COMPANY IN HUBSPOT")

    const hsTokens = await HubspotService.getUsersTokens(sales.user_id)



    if(hsTokens && hsTokens.access_token && hsTokens.refresh_token) {
      const hubspotClient = new hubspot.Client({ accessToken: hsTokens.access_token, developerApiKey: process.env.HUBSPOT_DEVELOPER_API_KEY })
      const hubspotCompany = await hubspotClient.crm.companies.basicApi.create({
        associations: null,
        properties: {
          name: company.name,
        },
      });
      company = await CompanyModel.query().patchAndFetchById(company.id, {
        hubspot_id: hubspotCompany.id,
      })
      console.log('hubspotCompany', hubspotCompany)
    }
  }


  console.log('company', company)




  const salesModel = await SalesModel.query().insert({
    id: ulid().toString(),
    name: sales.name,
    company_id: company.id,
  })


  return salesModel
}

export const SalesRepository = {
  createSales,
}
