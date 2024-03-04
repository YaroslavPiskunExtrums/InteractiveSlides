function addDateField(dateFieldConfig) {
  let backgroundConfig = {
    backgroundColor: '#ffffff',
  }

  dateFieldConfig.question = $('#dateFieldContent input[name="question"]').val()
  dateFieldConfig.questionConfig.fontSize = $('#question-size-date-field').val()
  dateFieldConfig.subheading = $('#dateFieldContent input[name="subheading"]').val()

  dateFieldConfig.inputConfig = getInputConfig('dateFieldContent')
  dateFieldConfig.inputConfig.fontSize = $('#text-size-date-field').val()


  dateFieldConfig.textConfig = getTextConfig('dateFieldContent')
  dateFieldConfig.label = $('#labels-list-date-field-input').val()
  backgroundConfig.backgroundColor = $(`#dateFieldContent input[name="backgroundColor"]`).val()
  dateFieldConfig.backgroundConfig = {...backgroundConfig}


  if(dateFieldConfig.label) {
    updateElementsLabels(dateFieldConfig.label)
  }


  generateDateFieldHTML(dateFieldConfig)


}

function generateDateFieldHTML(dateFieldConfig) {
  let dateFieldHTML =
    `<style>
        #filledPage {
            background-color: ${dateFieldConfig.backgroundConfig.backgroundColor};
        }
        .date-field-question {
            color: ${dateFieldConfig.textConfig.textColor};
            font-family: ${FONTFAMILY[dateFieldConfig.textConfig.fontIndex]};
            font-size: ${dateFieldConfig.questionConfig.fontSize}px;
        }

        .date-field-answer-input {
            background-color: ${dateFieldConfig.inputConfig.backColor};
            border-color: ${dateFieldConfig.inputConfig.borderColor};
            color: ${dateFieldConfig.inputConfig.textColor};
            border-radius: ${dateFieldConfig.inputConfig.borderRadius}px;
            font-size: ${dateFieldConfig.inputConfig.fontSize}px;
        }
       
    </style>
    <div class='text-center pb-2 '>
        <h2 class='text-center date-field-question'>${dateFieldConfig.question}</h2>
    </div>
    <div class = 'form-group'>
        <input type='date' class='date-field-answer-input form-control' type='text' id='openfieldinput' />
    </div>`
  $('#filledPageContent').html(dateFieldHTML)
}
