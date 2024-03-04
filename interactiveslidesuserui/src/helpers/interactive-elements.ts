interface IFIGURES {
  "MULTIPLE_CHOICE": "multiple-choice",
  "RANGE_SELECTOR": "range-selector",
  "OPEN_FIELD": "open-field",
  "CUSTOMER_DETAILS": "customer-details",
  "BUTTON": "button",
  "CALCULATOR": "calculator",
  "DATE_FIELD": "date-field",
  "PERSONALIZATION": "personalization"
}

type FiguresKeys = keyof typeof FIGURES
type FiguresValues = (typeof FIGURES)[FiguresKeys]

const FIGURES: IFIGURES = {
  "MULTIPLE_CHOICE": "multiple-choice",
  "RANGE_SELECTOR": "range-selector",
  "OPEN_FIELD": "open-field",
  "CUSTOMER_DETAILS": "customer-details",
  "BUTTON": "button",
  "CALCULATOR": "calculator",
  "DATE_FIELD": "date-field",
  "PERSONALIZATION": "personalization"
} as const

const figuresArray = [
  "multiple-choice",
  "range-selector",
  "open-field",
  "customer-details",
  "button",
  "calculator",
  "date-field",
  "personalization"
] as const

enum MultipleChoiceType {
  buttonList = 'button-list',
  dropdownList = 'dropdown-list',
  multipleSelector = 'multiple-selector'

}

const figuresUserNames = [
  {
    name: "multiple-choice",
    label: "Multiple choice"
  },
  {
    name: "range-selector",
    label: "Range selector"
  },
  {
    name: "open-field",
    label: "Open field"
  },
  {
    name: "customer-details",
    label: "Customer details"
  },
  {
    name: "button",
    label: "Button"
  },
  {
    name: "calculator",
    label: "Calculator"
  },
  {
    name: "date-field",
    label: "Date field"
  },
  {
    name: 'personalization',
    label: 'Personalization'
  }
]
export { FIGURES, figuresArray, figuresUserNames, IFIGURES, FiguresValues, MultipleChoiceType }