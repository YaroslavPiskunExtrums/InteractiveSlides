import { Model } from 'objection'

export interface ICompanyDefaultStyles {
	id?: number
	open_field_default_styles?: string
	button_default_styles?: string
	calculator_default_styles?: string
	customer_details_default_styles?: string
	multiple_choice_default_styles?: string
	range_selector_default_styles?: string
	company_id?: string
}

export class CompanyDefaultStylesModel extends Model implements ICompanyDefaultStyles {
	static get tableName() {
		return 'company_default_styles'
	}

	id?: number
	open_field_default_styles?: string
	button_default_styles?: string
	calculator_default_styles?: string
	customer_details_default_styles?: string
	multiple_choice_default_styles?: string
	range_selector_default_styles?: string
	company_id?: string
}