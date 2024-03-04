function addOpenField(openFieldConfig) {
  let backgroundConfig = {
    backgroundColor: '#ffffff',
  }

  openFieldConfig.question = $('#openFieldContent input[name="question"]').val()
  openFieldConfig.questionConfig.fontSize = $('#question-size-open-field').val()
  openFieldConfig.subheading = $('#openFieldContent input[name="subheading"]').val()
  openFieldConfig.inputConfig = getInputConfig('openFieldContent')
  openFieldConfig.inputConfig.fontSize = $('#text-size-open-field').val()


  openFieldConfig.textConfig = getTextConfig('openFieldContent')
  openFieldConfig.label = $('#labels-list-open-field-input').val()
  backgroundConfig.backgroundColor = $(`#openFieldContent input[name="backgroundColor"]`).val()
  openFieldConfig.backgroundConfig = { ...backgroundConfig }


  if (openFieldConfig.label) {
    updateElementsLabels(openFieldConfig.label)
  }


  generateOpenFieldHTML(openFieldConfig)


}

function generateOpenFieldHTML(openFieldConfig) {
  console.log("openFieldConfig", openFieldConfig)
  let openFieldHTML =
    `<style>
        #filledPage {
            background-color: ${openFieldConfig.backgroundConfig.backgroundColor};
        }
        .open-field-question {
            color: ${openFieldConfig.textConfig.textColor};
            font-family: ${FONTFAMILY[openFieldConfig.textConfig.fontIndex]};
            font-size: ${openFieldConfig.questionConfig.fontSize}px;
        }

        .open-field-input {
            background-color: ${openFieldConfig.inputConfig.backColor};
            border-color: ${openFieldConfig.inputConfig.borderColor};
            color: ${openFieldConfig.inputConfig.textColor};
            border-radius: ${openFieldConfig.inputConfig.borderRadius}px;
            font-size: ${openFieldConfig.inputConfig.fontSize}px;
        }
    </style>
    <div class='text-center pb-2'>
        <h2 class='open-field-question text-center'>${openFieldConfig.question}</h2>
        <small>${openFieldConfig.subheading}</small>
    </div>
    <div class = 'form-group'>
        <input class='open-field-input form-control' type='text' placeholder='Type here...' id='openfieldinput' />
    </div>`
  $('#filledPageContent').html(openFieldHTML)
}
