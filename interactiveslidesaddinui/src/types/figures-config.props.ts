type TextFieldProps = {
  backColor: string,
  borderColor: string,
  borderRadius: string,
  textColor: string,
  fontSize: string,
}

type LinkType = "hyperlink" | "slide_link"

export type FigureButtonProps = {
  active?: boolean
  onClick?: (state: boolean) => void
  config: {
    btnText: string,
    btnConfig: {
      link: string | number,
      borderRadius: string,
      backColor: string,
      borderColor: string,
      textColor: string,
      hoverColor: string,
      hoverTextColor: string,
      hoverBorderColor: string,
      fontSize: string,
      linkType?: LinkType
      links?: string[]
    },
    clicked?: boolean
  },
}

export type RangeSelectorFigureProps = {
  config: {
    type: string,
    question: string,
    questionConfig: {
      fontSize: number
    },
    subheading: string,
    textConfig: {
      textColor: string,
    }
    rangeConfig: any
  }
}

export type FigureMultipleChoiceProps = {
  config: {
    view: 'button-list' | 'dropdown-list' | 'multiple-selector'
    answers: string[] | { label: string, value: string }[],
    imageUrl: string,
    question: string,
    dropdownConfig: {
      backgroundColor?: string
      fontColor?: string
      borderRadius?: string
      hoverColor?: string
      borderColor?: string
      fontSize?: string
      hoverTextColor?: string
    }
    questionConfig: {
      fontSize: number
    },
    selected: number,
    selectedItems?: null | number[]
    textConfig: {
      textColor: string,
      fontSize: string,
    },
    btnConfig: FigureButtonProps['config']['btnConfig']
  }
}

export type FigureOpenFieldProps = {
  config: {
    question: string,
    questionConfig: {
      fontSize: number
    },
    subheading: string,
    inputConfig: TextFieldProps,
    textConfig: {
      textColor: string,
    },
    value?: string
  }
}

export type FigurePersonalization = {
  config: {
    text: string,
    imageUrl: string,
    fileName: string,
    type: 'text' | 'image',
    textConfig: {
      layout: 'left' | 'right' | 'center',
      fontIndex: number | string,
      textColor: string,
      fontSize: number | string,
    },
    imageConfig: {
      borderRadius: number | string,
    },
    backgroundConfig: {
      backgroundColor: string
    }
  }
}

export type FigureCustomerDetailsProps = {
  config: {
    additionalFields: string[],
    business: string,
    email: string,
    fullName: string,
    phone: string,
    textMessage: string,
    inputConfig: FigureOpenFieldProps['config']['inputConfig'],
    formConfig: {
      backColor: string,
      borderColor: string,
      borderRadius: string,
    }
  }
}

export type FigureCalculatorProps = {
  config: {
    question: string,
    questionConfig: {
      fontSize: number
    },
    subheading: string,
    equation: string,
    inputConfig: TextFieldProps,
    textConfig: {
      textColor: string,
    }
    value?: string
  }
}
export type FigureDateFieldProps = {
  config: {
    question: string,
    questionConfig: {
      fontSize: number
    },
    subheading: string,
    inputConfig: TextFieldProps,
    textConfig: {
      textColor: string,
    },
    value?: string
  }
}