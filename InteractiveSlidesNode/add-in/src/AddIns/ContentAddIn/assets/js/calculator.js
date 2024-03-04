function addCalculator(openFieldConfig) {
  let backgroundConfig = {
    backgroundColor: '#ffffff',
  }

  openFieldConfig.question = $('#calculatorContent input[name="question"]').val()
  openFieldConfig.questionConfig.fontSize = $('#question-size-calculator').val()
  openFieldConfig.subheading = $('#calculatorContent input[name="subheading"]').val()
  openFieldConfig.equation = $('#calculatorContent input[name="equation"]').val()

  openFieldConfig.inputConfig = getInputConfig('calculatorContent')
  openFieldConfig.inputConfig.fontSize = $('#text-size-calculator').val()


  openFieldConfig.textConfig = getTextConfig('calculatorContent')
  openFieldConfig.label = $('#labels-list-calculator-input').val()
  backgroundConfig.backgroundColor = $(`#calculatorContent input[name="backgroundColor"]`).val()
  openFieldConfig.backgroundConfig = { ...backgroundConfig }


  if (openFieldConfig.label) {
    updateElementsLabels(openFieldConfig.label)
  }


  generateCalculatorHTML(openFieldConfig)


}

function generateCalculatorHTML(openFieldConfig) {
  let openFieldHTML =
    `<style>
        #filledPage {
            background-color: ${openFieldConfig.backgroundConfig.backgroundColor};
        }
        .calculator-question {
            color: ${openFieldConfig.textConfig.textColor};
            font-family: ${FONTFAMILY[openFieldConfig.textConfig.fontIndex]};
            font-size: ${openFieldConfig.questionConfig.fontSize}px;
        }

        .calculator-answer-input {
            background-color: ${openFieldConfig.inputConfig.backColor};
            border-color: ${openFieldConfig.inputConfig.borderColor};
            color: ${openFieldConfig.inputConfig.textColor};
            border-radius: ${openFieldConfig.inputConfig.borderRadius}px;
            font-size: ${openFieldConfig.inputConfig.fontSize}px;
        }
       .calculator-answer-input:read-only {
            background-color: ${openFieldConfig.inputConfig.backColor};
            border-color: ${openFieldConfig.inputConfig.borderColor};
            color: ${openFieldConfig.inputConfig.textColor};
            border-radius: ${openFieldConfig.inputConfig.borderRadius}px;
            font-size: ${openFieldConfig.inputConfig.fontSize}px;
       }
    </style>
    <div class='text-center pb-2'>
        <h2 class='calculator-question text-center'>${openFieldConfig.question}</h2>
        <small>${openFieldConfig.subheading}</small>
    </div>
    <div class = 'form-group'>
        <input readonly class='calculator-answer-input form-control' type='text' id='openfieldinput' />
    </div>`
  $('#filledPageContent').html(openFieldHTML)
}
