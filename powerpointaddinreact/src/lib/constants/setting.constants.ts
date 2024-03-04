import { businessList } from './figures.constants'

export const btnStyleSettingList = [
  {
    name: 'btnConfig.backColor',
    type: 'color',
    label: { id: 'buttonBackgroundColor', text: 'Background color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    name: 'btnConfig.hoverColor',
    type: 'color',
    label: { id: 'buttonBackgroundHoverColor', text: 'Hover color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    name: 'btnConfig.borderColor',
    type: 'color',
    label: { id: 'buttonBorderColor', text: 'Border color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    name: 'btnConfig.hoverBorderColor',
    type: 'color',
    label: { id: 'buttonBorderHoverColor', text: 'Hover border color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    name: 'btnConfig.textColor',
    type: 'color',
    label: { id: 'buttonTextColor', text: 'Text color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    name: 'btnConfig.hoverTextColor',
    type: 'color',
    label: { id: 'buttonHoverTextColor', text: 'Hover Text color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    name: 'btnConfig.fontSize',
    type: 'number',
    label: { id: 'buttonFontSize', text: 'Text font size' },
    labelDisplay: 'block',
    labelWidth: '100%',
  },
  {
    name: 'btnConfig.borderRadius',
    type: 'number',
    label: { id: 'buttonBorderRadius', text: 'Border radius px' },
    labelDisplay: 'block',
    labelWidth: '100%',
  },
] as const

export const settingsDataList = [
  {
    name: 'question',
    placeholder: 'Question',
  },
  {
    name: 'subheading',
    placeholder: 'Subheading',
  },
  {
    name: 'equation',
    placeholder: 'Equation',
  },
] as const

export const dataSettings = [
  {
    type: 'input',
    name: 'fullName',
    placeholder: 'Full name',
  },
  {
    type: 'input',
    name: 'email',
    placeholder: 'Email',
  },
  {
    type: 'input',
    name: 'phone',
    placeholder: 'Phone number',
  },
  {
    type: 'select',
    options: businessList,
    name: 'business',
  },
  {
    type: 'textArea',
    name: 'textMessage',
    placeholder: 'Leave your message',
  },
] as const

export const inputStyleSettingList = [
  {
    type: 'color',
    name: 'inputConfig.backColor',
    label: { id: 'inputBackgroundColor', text: 'Background color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    type: 'color',
    name: 'inputConfig.borderColor',
    label: { id: 'inputBorderColor', text: 'Border color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    type: 'color',
    name: 'inputConfig.textColor',
    label: { id: 'inputTextColor', text: 'Text color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    type: 'number',
    name: 'inputConfig.borderRadius',
    label: { id: 'inputBorderRadius', text: 'Border radius px' },
    labelDisplay: 'block',
    labelWidth: '100%',
  },
  {
    type: 'number',
    name: 'inputConfig.fontSize',
    label: { id: 'inputFontSize', text: 'Text font size' },
    labelDisplay: 'block',
    labelWidth: '100%',
  },
] as const

export const formStyleSettingList = [
  {
    type: 'color',
    name: 'formConfig.backColor',
    label: { id: 'formBackgroundColor', text: 'Background color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    type: 'color',
    name: 'formConfig.borderColor',
    label: { id: 'formBorderColor', text: 'Border color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    type: 'number',
    name: 'formConfig.borderRadius',
    label: { id: 'formBorderRadius', text: 'Border radius px' },
    labelDisplay: 'block',
    labelWidth: '100%',
  },
] as const

export const questionStyleSettingList = [
  {
    name: 'textConfig.textColor',
    type: 'color',
    label: { id: 'questionTextColor', text: 'Text color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    name: 'questionConfig.fontSize',
    type: 'number',
    label: { id: 'questionFontSize', text: 'Question font size' },
    labelDisplay: 'block',
    labelWidth: '100%',
  },
] as const

export const dropdownStyleSettingList = [
  {
    name: 'dropdownConfig.backgroundColor',
    type: 'color',
    label: { id: 'dropdownBackgroundColor', text: 'Background color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    name: 'dropdownConfig.fontColor',
    type: 'color',
    label: { id: 'dropdownFontColor', text: 'Font color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    name: 'dropdownConfig.hoverColor',
    type: 'color',
    label: { id: 'dropdownHoverColor', text: 'Hover color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    name: 'dropdownConfig.hoverTextColor',
    type: 'color',
    label: { id: 'dropdownHoverTextColor', text: 'Hover text color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    name: 'dropdownConfig.borderColor',
    type: 'color',
    label: { id: 'dropdownBorderColor', text: 'Border color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    name: 'dropdownConfig.borderRadius',
    type: 'number',
    label: { id: 'dropdownBorderRadius', text: 'Border radius px' },
    labelDisplay: 'block',
    labelWidth: '100%',
  },
] as const

export const numberRangeSettingList = [
  {
    placeholder: 'min',
    type: 'number',
    name: 'rangeConfig.0.min',
  },
  {
    placeholder: 'max',
    type: 'number',
    name: 'rangeConfig.0.max',
  },
  {
    placeholder: 'step',
    type: 'number',
    name: 'rangeConfig.0.step',
  },
] as const

export const numberRangeStyleSettingList = [
  {
    name: 'rangeConfig.0.primaryColor',
    type: 'color',
    label: { id: 'rangeSelectorPrimaryColor', text: 'Primary color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    name: 'textConfig.fontSize',
    type: 'number',
    label: { id: 'textConfigFontSize', text: 'Text font size' },
    labelDisplay: 'block',
    labelWidth: '100%',
  },
] as const

export const optionRangeStyleSettingList = [
  {
    name: 'rangeConfig.1.primaryColor',
    type: 'color',
    label: { id: 'optionPrimaryColor', text: 'Primary color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    name: 'rangeConfig.1.pointerColor',
    type: 'color',
    label: { id: 'optionPointerColor', text: 'Pointer color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    name: 'rangeConfig.1.pointerBorderColor',
    type: 'color',
    label: { id: 'optionPointerBorderColor', text: 'Pointer border color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    name: 'rangeConfig.1.optionTextConfig.textColor',
    type: 'color',
    label: { id: 'optionTextColor', text: 'Text color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    name: 'rangeConfig.1.optionTextConfig.checkedTextColor',
    type: 'color',
    label: { id: 'optionCheckedTextColor', text: 'Checked Text color' },
    labelDisplay: 'inline-block',
    labelWidth: '45%',
  },
  {
    name: 'textConfig.fontSize',
    type: 'number',
    label: { id: 'textConfigFontSize', text: 'Text font size' },
    labelDisplay: 'block',
    labelWidth: '100%',
  },
] as const
