export enum FiguresEnum {
  multipleChoice = 'multiple-choice',
  rangeSelector = 'range-selector',
  openField = 'open-field',
  customerDetails = 'customer-details',
  addButton = 'add-button',
  calculator = 'calculator',
  dateField = 'date-field',
  personalization = 'personalization',
}

export const figuresList = [
  FiguresEnum.multipleChoice,
  FiguresEnum.rangeSelector,
  FiguresEnum.openField,
  FiguresEnum.customerDetails,
  FiguresEnum.addButton,
  FiguresEnum.calculator,
  FiguresEnum.dateField,
  FiguresEnum.personalization,
]

export const views = {
  buttonList: 'button-list',
  dropdownList: 'dropdown-list',
  multipleSelector: 'multiple-selector',
} as const

export const multipleChoiceView = [
  { id: 0, value: views.buttonList, label: 'Button list view' },
  { id: 1, value: views.dropdownList, label: 'Dropdown list view' },
  { id: 2, value: views.multipleSelector, label: 'Multiple selector view' },
]

export type ViewsType = (typeof views)[keyof typeof views]

export const type = {
  number: 0,
  option: 1,
} as const

export const rangeSelectorType = [
  { id: 0, value: type.number, label: 'Range Selector Number' },
  { id: 1, value: type.option, label: 'Range Selector Option' },
]

export const fontFamilies = [
  { id: 0, value: '0', label: 'arial,sans-serif' },
  { id: 1, value: '1', label: 'verdana,sans-serif' },
  { id: 2, value: '2', label: 'tahoma,sans-serif' },
  { id: 3, value: '3', label: '"trebuchet ms",sans-serif' },
  { id: 4, value: '4', label: '"Times New Roman",serif' },
  { id: 5, value: '5', label: 'georgia,serif' },
  { id: 6, value: '6', label: 'garamond,serif' },
  { id: 7, value: '7', label: '"courier new",monospace' },
  { id: 8, value: '8', label: '"Brush Script MT",cursive' },
  { id: 9, value: '9', label: 'Onest,sans-serif' }
]

export const business = {
  architecture: 'Architecture',
  engineering: 'Engineering',
} as const

export type BusinessType = (typeof business)[keyof typeof business]

export const businessList = [
  { id: 0, value: business.architecture, label: 'Architecture' },
  { id: 1, value: business.engineering, label: 'Engineering' },
]

export const buttonLinks = {
  slideLink: 'slide_link',
  hyperlink: 'hyperlink',
} as const

export type LinkType = (typeof buttonLinks)[keyof typeof buttonLinks]

export const linkList = [
  { id: 0, value: buttonLinks.slideLink, label: 'Slide link' },
  { id: 1, value: buttonLinks.hyperlink, label: 'Hyperlink' },
]

export const defaultLabels = [
  'name',
  'email',
  'phone',
  'country',
  'title',
  'industry',
  'number of employees',
  'country/city',
  'annual revenue',
]

export const layouts = {
  left: 'left',
  center: 'center',
  right: 'right',
} as const

export const personalizationFigureType = {
  text: 'text',
  image: 'image',
} as const

export const openFieldType = {
  input: 'input',
  textarea: 'textarea',
} as const
