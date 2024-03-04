import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'reactstrap'
import BreadCrumb from '../../Components/Common/BreadCrumb'
// @ts-ignore
import HubspotLogo from './hubspot.png'
import Services from './components/services/Services'
import { useSearchParams } from 'react-router-dom'

import './integrations.scss'
import { authFetch } from 'src/lib/util/auth'

const Integrations = () => {
  let [searchParams, setParams] = useSearchParams()
  const [apiKey, setApiKey] = useState<string>()


  const api_url = window.location.hostname.indexOf('app.slidex.ai') !== -1 ? `${window.location.origin}/addin` : 'http://localhost:5000'
  const obj = JSON.parse(sessionStorage.getItem('authUser')).accessToken
  const userObj = JSON.parse(atob(obj.split('.')[1]))


  const [isLinkLoad, setIsLinkLoad] = useState(false)
  const [authLink, setAuthLink] = useState('')
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('interactive_slides_integrations_keys'))

  const getSignInLink = async () => {


    const response = await fetch(`${api_url}/api/integrations/hubspot/authorization-url`)
    const data = await response.json()

    setAuthLink(data.link)

    console.log(data)
    return data
  }

  const goToAuth = () => {
    window.open(authLink, '_blank')
  }

  const saveUserKeys = async (keys) => {
    const response = await fetch(`${api_url}/api/integrations/hubspot/save-users-keys`, {
      method: 'POST',
      body: JSON.stringify({ ...keys, user_id: userObj.id }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()

    console.log(data)
    return data
  }

  const getApiKeys = async () => {
    const response = await authFetch(`/api/integrations/resolve-user-internal-api-key`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()

    setApiKey(data?.internal_api_key)
    return data
  }


  useEffect(() => {


    if (!userObj?.is_trial_user) {
      getSignInLink().then(() => setIsLinkLoad(false))
    }


    if (searchParams) {
      const params = Object.fromEntries([...searchParams])

      let keys: any = localStorage.getItem('interactive_slides_integrations_keys')

      console.log('PARAMS', params)

      if (params.access_token && params.service) {
        if (keys) {
          keys = JSON.parse(keys)
          keys[params.service] = params
        } else {
          keys = { [params.service]: params }
        }


        localStorage.setItem('interactive_slides_integrations_keys', JSON.stringify(keys))
        saveUserKeys(keys[params.service]).then(() => console.log('keys were saved'))
        setIsAuth(true)
        setParams({})

      }
    }
    getApiKeys().then(() => console.log('api keys were got'))

  }, [])


  return (
    <div>
      <React.Fragment>
        <div className='page-content integrations-page'>

          <Container fluid>
            <BreadCrumb title='Integrations' pageTitle='' />
            <Row>
              <Col xs={12}>
                <div className={'integrations-page_main-content'}>
                  {
                    !userObj.is_trial_user ? <div className={'service'}>
                      <Services onClick={goToAuth} loading={isLinkLoad} image={HubspotLogo} name={'Hubspot'}
                                status={isAuth} alt={'Hubspot'} />
                      <Services
                        onClick={() => {
                          const res = window.open('https://zapier.com/engine/auth/start/App194639CLIAPI@1.0.0/', '_blank')
                        }}
                        loading={isLinkLoad}
                        image={'data:image/png;base64,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'}
                        name={'Zapier'}
                        status={!!apiKey}
                        alt={'Zapier'}>
                        <span>API key: </span>
                        <span onClick={()=>navigator.clipboard.writeText(apiKey)} style={{cursor: 'pointer'}}>{apiKey}</span>
                      </Services>
                    </div> : <></>
                  }

                </div>
              </Col>


            </Row>

          </Container>
        </div>
      </React.Fragment>
    </div>
  )
}

export default Integrations