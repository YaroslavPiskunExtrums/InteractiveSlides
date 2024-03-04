const ELEMENTSPAGE = 0
const EDITPAGE = 1
const FINALPAGE = 2

const MULTIPLECHOICE = 0
const RANGESELECTOR = 1
const OPENFIELD = 2
const CUSTOMERDETAILS = 3
const CUSTOMBUTTON = 4
const CALCULATOR = 5
const DATEFIELD = 6
const CUSTOMIZATION = 7

const RANGETYPENUMBER = 0
const RANGETYPEOPTION = 1

const MULTIPLE_CHOICE_TYPE = {
  BUTTON: 'button-list',
  DROPDOWN: 'dropdown-list',
  MULTIPLE: 'multiple-selector'
}

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
      question: 'Could your marketing be better?',
      questionConfig: {
        fontSize: 22
      },
      textConfig: {
        textColor: '#000000',
        fontSize: '16',
        fontIndex: 0,
      },
      answers: [
        'Yes',
        'No',
      ],
      selected: -1,
      selectedItems: [],
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
        backgroundColor: '#ffffff'
      }
    },
    {
      question: 'Estimate your success',
      questionConfig: {
        fontSize: 22
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
      type: RANGETYPENUMBER,
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
        fontSize: 22
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
        fontSize: 22
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
        fontSize: 22
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
    {
      text: '',
      imageUrl: '',
      fileName: '',
      type: 'text',
      textConfig: {
        layout: 'left',
        fontIndex: 0,
        textColor: '#000000',
        fontSize: 22
      },
      imageConfig: {
        borderRadius: 4
      },
      backgroundConfig: {
        backgroundColor: '#ffffff'
      }
    }
  ],
}


