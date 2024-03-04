import { links } from '@lib/constants/api.constants'
import type { Nullable } from '@/types/unionNull'
import { authFetch } from '@lib/utils/authFetch'

export const getDefaultStyles = async () => {
  const res = await authFetch(
    links.defaultStyles,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
    true
  )
  if (res?.status !== 200) {
    return null
  }
  const defaultStyles = (await res.json()) as {
    button_default_styles: Nullable<string>
    calculator_default_styles: Nullable<string>
    customer_details_default_styles: Nullable<string>
    multiple_choice_default_styles: Nullable<string>
    open_field_default_styles: Nullable<string>
    range_selector_default_styles: Nullable<string>
    date_field_default_styles: Nullable<string>
    personalization_default_styles: Nullable<string>
  }
  return defaultStyles
}
