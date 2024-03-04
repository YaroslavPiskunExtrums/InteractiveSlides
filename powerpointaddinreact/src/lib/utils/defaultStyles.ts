import { getDefaultStyles } from '@lib/api/getDefaultStyles'

import { setToLocalStorage } from './localStorage'
import { useDefaultStyles } from '@store/defaultStyles.store'

export const saveDefaultStyles = async () => {
  const defaultStyles = await getDefaultStyles()
  if (!defaultStyles) return

  setToLocalStorage('default_styles', defaultStyles)
  const {
    button_default_styles,
    calculator_default_styles,
    customer_details_default_styles,
    multiple_choice_default_styles,
    open_field_default_styles,
    range_selector_default_styles,
    date_field_default_styles,
    personalization_default_styles,
  } = defaultStyles

  useDefaultStyles.getState().setButtonStyles(button_default_styles)
  useDefaultStyles.getState().setCalculatorStyles(calculator_default_styles)
  useDefaultStyles.getState().setCustomerDetailsStyles(customer_details_default_styles)
  useDefaultStyles.getState().setMultipleChoiceStyles(multiple_choice_default_styles)
  useDefaultStyles.getState().setOpenFieldStyles(open_field_default_styles)
  useDefaultStyles.getState().setRangeSelectorStyles(range_selector_default_styles)
  useDefaultStyles.getState().setDateFieldStyles(date_field_default_styles)
  useDefaultStyles.getState().setPersonalizationStyles(personalization_default_styles)
}
