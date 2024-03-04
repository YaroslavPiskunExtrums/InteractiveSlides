import classNames from '@lib/utils/classNames'
import { CSSProperties } from 'react'
import classes from './customerDetail.module.scss'
import { CustomerDetailsSettingsType } from '@/types/figures/customerDetails.types'
import { useForm } from 'react-hook-form'

interface IProps {
  config: CustomerDetailsSettingsType
}
const CustomerDetails = ({ config }: IProps) => {
  const { register } = useForm({
    defaultValues: {
      fullName: config.fullName,
      email: config.email,
      phone: config.phone,
      business: config.business,
      textMessage: config.textMessage,
      additionalFields: config.additionalFields,
    },
  })

  return (
    <form
      className={classes.customerDetailsForm}
      style={
        {
          '--formConfigBorderRadius': config.formConfig.borderRadius,
          '--formConfigBorderColor': config.formConfig.borderColor,
          '--formConfigBackColor': config.formConfig.backColor,
          '--inputConfigBackColor': config.inputConfig.backColor,
          '--inputConfigBorderColor': config.inputConfig.borderColor,
          '--inputConfigTextColor': config.inputConfig.textColor,
          '--inputConfigBorderRadius': config.inputConfig.borderRadius,
          '--inputConfigFontSize': config.inputConfig.fontSize,
        } as CSSProperties
      }
    >
      <h2>Customer Details</h2>
      <div>
        <div className={classes.formGroup}>
          <label htmlFor="customer-details-full-name">Type your full name</label>
          <input
            type="text"
            className={classNames(classes.customerDetailsInput, classes.formControl)}
            id="customer-details-full-name"
            {...register('fullName')}
          />
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="customer-details-email">Type your email</label>
          <input
            type="email"
            className={classNames(classes.customerDetailsInput, classes.formControl)}
            id="customer-details-email"
            {...register('email')}
          />
        </div>
      </div>
      <div>
        <div className={classes.formGroup}>
          <label htmlFor="customer-details-phone">Provide your phone number</label>
          <input
            type="text"
            className={classNames(classes.customerDetailsInput, classes.formControl)}
            id="customer-details-phone"
            {...register('phone')}
          />
        </div>
        <div className={classes.formGroup}>
          <label htmlFor="customer-details-business">Select your business</label>
          <select
            className={classNames(classes.customerDetailsInput, classes.formControl)}
            id="customer-details-business"
            {...register('business')}
          >
            <option value="Architecture">Architecture</option>
            <option value="Engineering">Engineering</option>
          </select>
        </div>
      </div>
      <div className={classes.formGroup}>
        <label htmlFor="customer-details-message">Text your message</label>
        <textarea
          className={classNames(classes.customerDetailsInput, classes.formControl)}
          placeholder=""
          {...register('textMessage')}
        />
      </div>
      {config.additionalFields.map((_, index) => (
        <div className={classes.formGroup} key={index}>
          <label htmlFor="customer-details-additional-field-${index}">
            Additional field #{index}
          </label>
          <input
            type="text"
            className={classNames(classes.customerDetailsInput, classes.formControl)}
            id="customer-details-additional-field-${index}"
            {...register(`additionalFields.${index}`)}
          />
        </div>
      ))}
    </form>
  )
}

export default CustomerDetails
