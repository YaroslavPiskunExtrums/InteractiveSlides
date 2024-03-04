import { Request, Response } from 'express'
import { SalesModel } from '@models/sales.model.js'
import { PresentationModel } from '@models/presentation.model.js'
import { PresentationLinksModel } from '@models/presentation-links-model.js'
import { CompanyModel } from '@models/company.model.js'

async function getAllSales(req: Request, res: Response) {
  const auth = req.headers.authorization
  const token = auth.split(' ')[1]
  const tokenData = JSON.parse(atob(token.split('.')[1]))

  if (!auth || !token || !tokenData) {
    res.status(401).send('Unauthorized')
    return
  }
  const companiesInfo = []
  const presentations = await PresentationModel.query().where('user_id', tokenData.id)
  for (const presentation of presentations) {
    const links = await PresentationLinksModel.query().where('presentation_id', presentation.id)
    for (const link of links) {

      const sales = await SalesModel.query().where('id', link.sales_id).first()
      const company = await CompanyModel.query().where('id', sales.company_id).first()


      companiesInfo.push({
        company_name: company.name,
        sales_name: sales.name,
        presentation_name: presentation.name,
        updated_at: link.updated_at,
      })
    }
  }

  res.status(200).json({ status: 'OK', data: companiesInfo })
}

export const CompaniesController = {
  getAllSales,
}
