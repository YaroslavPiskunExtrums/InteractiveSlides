const ELEMENTSPAGE = 0
const EDITPAGE = 1
const FINALPAGE = 2

const MULTIPLECHOICE = 0
const RANGESELECTOR = 1
const OPENFIELD = 2
const CUSTOMERDETAILS = 3
const CUSTOMBUTTON = 4

const RANGETYPENUMBER = 0
const RANGETYPEOPTION = 1

const FONTFAMILY = [
  'arial,sans-serif',
  'verdana,sans-serif',
  'tahoma,sans-serif',
  '\'trebuchet ms\',sans-serif',
  '\'Times New Roman\',serif',
  'georgia,serif',
  'garamond,serif',
  '\'courier new\',monospace',
  '\'Brush Script MT\',cursive',
  'Onest,sans-serif',
]

var config = {
  currentPage: ELEMENTSPAGE,
  selectedItem: MULTIPLECHOICE,
  itemConfig: [
    {
      label: '',
      question: 'Could your marketing be better?',
      textConfig: {
        textColor: '#000000',
        fontIndex: 0,
      },
      answers: [
        'Yes',
        'No',
      ],
      imageUrl: '',
      view: "button-list",

      btnConfig: {
        backColor: '#007bff',
        hoverColor: '#0069d9',
        textColor: '#ffffff',
        hoverTextColor: '#ffffff',
        borderColor: '#007bff',
        hoverBorderColor: '#0062cc',
        borderRadius: '4',
      },
    },
    {
      label: '',
      question: 'Estimate your success',
      subheading: 'Subheading goes here',
      textConfig: {
        textColor: '#000000',
        fontIndex: 0,
      },
      type: RANGETYPENUMBER,
      rangeConfig: [
        {
          max: 100,
          min: 0,
          step: 20,
          value: 0,
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
            checkedTextColor: '#000000',
          },
        },
      ],
    },
    {
      label: '',
      question: 'How many customers do you need?',
      subheading: 'Subheading goes here',
      inputConfig: {
        backColor: '#ffffff',
        borderColor: '#ced4da',
        textColor: '#495057',
        borderRadius: '4',
      },
      textConfig: {
        textColor: '#000000',
        fontIndex: 0,
      },
    },
    {
      label: '',
      fullName: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '+19999999999',
      business: 'Architecture',
      textMessage: 'Hello!',
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
      },
    },
    {
      label: '',
      btnText: 'Back to home page',
      btnConfig: {
        backColor: '#007bff',
        hoverColor: '#0069d9',
        textColor: '#ffffff',
        hoverTextColor: '#ffffff',
        borderColor: '#007bff',
        hoverBorderColor: '#0062cc',
        borderRadius: '4',
      },
    },
  ],
}
