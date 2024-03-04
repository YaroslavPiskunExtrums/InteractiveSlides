import React, { useEffect } from 'react'
import { Col, Container, Row, Table } from 'reactstrap'
import BreadCrumb from '../../Components/Common/BreadCrumb'
import './_companies.scss'
import { getAllSalesInfo } from 'src/lib/api/companies'

export default function Companies() {
  const [companyFilter, setCompanyFilter] = React.useState('')
  const [salesFilter, setSalesFilter] = React.useState('')
  const [dateFilter, setDateFilter] = React.useState('')
  const [presentationFilter, setPresentationFilter] = React.useState('')

  const [companies, setCompanies] = React.useState([])

  const getCompanies = async () => {
    const response = await getAllSalesInfo()
    const { status, data } = await response.json()

    if (status.toLowerCase() === 'ok') {
      return data
    }

    return []
  }

  useEffect(() => {
    getCompanies().then((data) => setCompanies(data))
  }, [])

  return (
    <React.Fragment>
      <div className="page-content companies-page">
        <Container fluid>
          <BreadCrumb title="Companies" pageTitle="" />

          <Row>
            <Col xs={12}>
              <div className={'companies-page_main-content'}>
                <div className={'companies-page_main-content_inputs'}>
                  <input
                    onChange={(e) => setCompanyFilter(e.target.value)}
                    placeholder={'Search company'}
                    className={'form-control'}
                  />
                  <input
                    onChange={(e) => setSalesFilter(e.target.value)}
                    placeholder={'Sales'}
                    className={'form-control'}
                  />
                  <input
                    onChange={(e) => setDateFilter(e.target.value)}
                    placeholder={'Date'}
                    className={'form-control'}
                    type={'date'}
                  />
                  <input
                    onChange={(e) => setPresentationFilter(e.target.value)}
                    placeholder={'Presentation name'}
                    className={'date-control form-control'}
                  />
                </div>
                <Table className={''}>
                  <thead>
                    <tr>
                      <th>Company name</th>
                      <th>Sales person</th>
                      <th>Presentation date</th>
                      <th>Presentation name</th>
                    </tr>
                  </thead>

                  <tbody>
                    {companies
                      .filter((company) => {
                        return (
                          company.company_name
                            .toLowerCase()
                            .includes(companyFilter.toLowerCase()) &&
                          company.sales_name.toLowerCase().includes(salesFilter.toLowerCase()) &&
                          company.updated_at.split('T')[0].includes(dateFilter) &&
                          company.presentation_name
                            .toLowerCase()
                            .includes(presentationFilter.toLowerCase())
                        )
                      })
                      .map((company, i) => {
                        return (
                          <tr key={i}>
                            <td>{company.company_name}</td>
                            <td>{company.sales_name}</td>
                            <td>{company.updated_at.split('T')[0]}</td>
                            <td>{company.presentation_name}</td>
                          </tr>
                        )
                      })}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}
