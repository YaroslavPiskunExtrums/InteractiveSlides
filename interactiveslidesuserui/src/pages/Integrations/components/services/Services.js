import integrations from '../../../../assets/images/integrations/integrations.png'
import { Button } from 'reactstrap'
import React from 'react'
import './_services.scss'

const Services = ({
                    image, name, status = false,
                    onClick = () => {
                    }, alt = '',
                    className = '', loading = false, children=null,
                  }) => {
  return (
    <div className={`integrations_services ${className}`}>
      <div className={'integrations_services_image-container'}><img className={'integrations_services_image'}
                                                                    src={image} alt={alt} /></div>
      <div className={'integrations_services_service-name'}>
        {name}
      </div>
      <div className={"integrations_services_additional-info"}>
        {children}
      </div>
      <div className={`integrations_services_status-container`}>
        <span className={`integrations_services_status ${status ? '--active' : '--inactive'}`}></span>
      </div>
      <div className={`integrations_services_control-button-container`}>
        <Button className={'sign-integration'} disabled={loading} onClick={onClick}>Sign in</Button>
      </div>
    </div>
  )
}

export default Services