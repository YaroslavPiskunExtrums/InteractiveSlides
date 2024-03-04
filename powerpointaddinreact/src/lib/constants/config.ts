import { type } from './figures.constants'

export const pageStatus = {
  ELEMENTSPAGE: 0,
  EDITPAGE: 1,
  FINALPAGE: 2,
}

export const figureItemList = {
  MULTIPLECHOICE: 0,
  RANGESELECTOR: 1,
  OPENFIELD: 2,
  CUSTOMERDETAILS: 3,
  CUSTOMBUTTON: 4,
  CALCULATOR: 5,
  DATEFIELD: 6,
  PERSONALIZATION: 7,
} as const

export const defaultConfig = {
  currentPage: pageStatus.ELEMENTSPAGE,
  selectedItem: figureItemList.MULTIPLECHOICE,
  itemConfig: [
    {
      question: 'Could your marketing be better?',
      questionConfig: {
        fontSize: 22,
      },
      textConfig: {
        textColor: '#000000',
        fontSize: '16',
        fontIndex: 0,
      },
      answers: ['Yes', 'No'],
      selected: -1,
      imageUrl: '', // it is used as an image dataurl, not a file path
      label: '',

      btnConfig: {
        backColor: '#007bff',
        hoverColor: '#0069d9',
        textColor: '#ffffff',
        hoverTextColor: '#ffffff',
        borderColor: '#007bff',
        hoverBorderColor: '#0062cc',
        borderRadius: '4',
      },
      backgroundConfig: {
        backgroundColor: '#ffffff',
      },
      dropdownConfig: {
        backgroundColor: '#ffffff',
      },
    },
    {
      question: 'Estimate your success',
      questionConfig: {
        fontSize: 22,
      },
      subheading: 'Subheading goes here',
      label: '',
      textConfig: {
        textColor: '#000000',
        fontIndex: 0,
      },
      backgroundConfig: {
        backgroundColor: '#ffffff',
      },
      type: type.number,
      rangeConfig: [
        {
          max: 100,
          min: 0,
          step: 20,
          primaryColor: '#0366d6',
        },
        {
          numberOfOptions: 0,
          options: [],
          pointerColor: '#000000',
          pointerBorderColor: '#ffffff',
          primaryColor: '#6c757d',
          optionTextConfig: {
            textColor: '#6c757d',
            fontSize: '16',
            checkedTextColor: '#000000',
          },
        },
      ],
    },
    {
      question: 'How many customers do you need?',
      questionConfig: {
        fontSize: 22,
      },
      subheading: 'Subheading goes here',
      inputConfig: {
        backColor: '#ffffff',
        borderColor: '#ced4da',
        textColor: '#495057',
        borderRadius: '4',
        fontSize: '16',
      },
      textConfig: {
        textColor: '#000000',
        fontIndex: 0,
      },
      backgroundConfig: {
        backgroundColor: '#ffffff',
      },
    },
    {
      fullName: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '+19999999999',
      business: 'Architecture',
      textMessage: 'Hello!',
      label: '',
      formConfig: {
        backColor: '#e9e9e9',
        borderColor: '#6c757d',
        borderRadius: '10',
      },
      inputConfig: {
        backColor: '#ffffff',
        borderColor: '#ced4da',
        textColor: '#495057',
        borderRadius: '4',
        fontSize: '16',
      },
      backgroundConfig: {
        backgroundColor: '#ffffff',
      },
    },
    {
      btnText: 'Back to home page',
      btnConfig: {
        backColor: '#007bff',
        hoverColor: '#0069d9',
        textColor: '#ffffff',
        hoverTextColor: '#ffffff',
        borderColor: '#007bff',
        hoverBorderColor: '#0062cc',
        borderRadius: '4',
        link: null,
        fontSize: '16',
      },
      backgroundConfig: {
        backgroundColor: '#ffffff',
      },
      clicked: false,
    },
    {
      question: '',
      questionConfig: {
        fontSize: 22,
      },
      subheading: '',
      equation: '',
      inputConfig: {
        backColor: '#ffffff',
        borderColor: '#ced4da',
        textColor: '#495057',
        borderRadius: '4',
        fontSize: '16',
      },
      textConfig: {
        textColor: '#000000',
        fontIndex: 0,
      },
      backgroundConfig: {
        backgroundColor: '#ffffff',
      },
    },
    {
      question: '',
      questionConfig: {
        fontSize: 22,
      },
      inputConfig: {
        backColor: '#ffffff',
        borderColor: '#ced4da',
        textColor: '#495057',
        borderRadius: '4',
        fontSize: '16',
      },
      textConfig: {
        textColor: '#000000',
        fontIndex: 0,
      },
      backgroundConfig: {
        backgroundColor: '#ffffff',
      },
    },
    {},
    {},
  ],
}
