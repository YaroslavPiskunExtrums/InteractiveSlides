function addRangeSelector(rangeSelectorConfig) {
  let backgroundConfig = {
    backgroundColor: '#ffffff',
  }

  rangeSelectorConfig.question = $('#rangeSelectorContent input[name="question"]').val()
  rangeSelectorConfig.questionConfig.fontSize = $('#question-size-range-selector').val()
  rangeSelectorConfig.subheading = $('#rangeSelectorContent input[name="subheading"]').val()
  rangeSelectorConfig.type = $('#rangeSelectorContent select[name="type"]').val()
  rangeSelectorConfig.textConfig = getTextConfig('rangeSelectorContent')
  rangeSelectorConfig.textConfig.fontSize = $('#text-size-range-selector').val()
  rangeSelectorConfig.rangeConfig = getRangeConfig('rangeSelectorContent')
  backgroundConfig.backgroundColor = $(`#rangeSelectorContent input[name="backgroundColor"]`).val()
  rangeSelectorConfig.backgroundConfig = { ...backgroundConfig }

  rangeSelectorConfig.label = $('#labels-range-selector-input').val()


  if (rangeSelectorConfig.label) {
    updateElementsLabels(rangeSelectorConfig.label)
  }
  console.log("rangeSelectorConfigLABEL", document.getElementById('labels-range-selector-input'), rangeSelectorConfig.label)

  let optionCount = $('#range-selector-options-wrapper').children().length
  rangeSelectorConfig.rangeConfig[1].numberOfOptions = optionCount
  for (let i = 0; i < optionCount; i++) {
    rangeSelectorConfig.rangeConfig[1].options[i] = $(`#range-selector-options-wrapper input[name="range-option-${i}"]`).val()
  }



  generateRangeSelectorHTML(rangeSelectorConfig)
}

function generateRangeSelectorHTML(rangeSelectorConfig) {
  let rangeSelectorHTML = `<style>
    #filledPage {
      background-color: ${rangeSelectorConfig.backgroundConfig.backgroundColor};
    }
     
    #filledPage #range-option-slider label::before {
      font-size: ${rangeSelectorConfig.textConfig?.fontSize}px;
    }

    .range-selector-question {
      color: ${rangeSelectorConfig.textConfig.textColor};
      font-family: ${FONTFAMILY[rangeSelectorConfig.textConfig.fontIndex]};
      font-size: ${rangeSelectorConfig.questionConfig.fontSize}px;
    }
  `
  if (rangeSelectorConfig.type == RANGETYPENUMBER) {
    rangeSelectorHTML +=
      `/* number range selector primary color */
            .range-selector-number {
                --primary-color: ${rangeSelectorConfig.rangeConfig[0].primaryColor};
            }
            </style >
            <div class='text-center pb-2'>
                <h2 class='range-selector-question text-center'>${rangeSelectorConfig.question}</h2>
                <small>${rangeSelectorConfig.subheading}</small>
            </div>
            <div class='range-selector-number' style='--min:${rangeSelectorConfig.rangeConfig[0].min}; --max:${rangeSelectorConfig.rangeConfig[0].max}; --step:${rangeSelectorConfig.rangeConfig[0].step}; --value:${rangeSelectorConfig.rangeConfig[0].min}; --text-value:"${rangeSelectorConfig.rangeConfig[0].min}";'>
                    <input type='range' min='${rangeSelectorConfig.rangeConfig[0].min}' max='${rangeSelectorConfig.rangeConfig[0].max}' step='${rangeSelectorConfig.rangeConfig[0].step}' value='${rangeSelectorConfig.rangeConfig[0].min}'
                        oninput="this.parentNode.style.setProperty('--value',this.value); this.parentNode.style.setProperty('--text-value', JSON.stringify(this.value))">
                    <output></output>
                    <div class='range-selector-number__progress'></div>
            </div>`
  } else {
    rangeSelectorHTML +=
      `/* option pointer color and border color */
        .range-selector-option #range-option-slider #range-option-pos{
            background-color: ${rangeSelectorConfig.rangeConfig[1].pointerColor};
            border-color: ${rangeSelectorConfig.rangeConfig[1].pointerBorderColor};
        }
        /* option checked text color */
        .range-selector-option #range-option-slider input:checked + label::before{
            color: ${rangeSelectorConfig.rangeConfig[1].optionTextConfig.checkedTextColor};
        }
        /* option text color */
        .range-selector-option #range-option-slider input + label::before{
            color: ${rangeSelectorConfig.rangeConfig[1].optionTextConfig.textColor};
        }
        /* option range selector primary color */
        .range-selector-option #range-option-slider label::after{
            border-color: ${rangeSelectorConfig.rangeConfig[1].primaryColor};
        }
        .range-selector-option #range-option-slider::before{
            background-color: ${rangeSelectorConfig.rangeConfig[1].primaryColor};
        }
        .range-selector-option #range-option-slider::before{
            width: calc(100% * (${(rangeSelectorConfig.rangeConfig[1].numberOfOptions - 1) / rangeSelectorConfig.rangeConfig[1].numberOfOptions}));
        }`

    for (let i = 0; i < rangeSelectorConfig.rangeConfig[1].numberOfOptions; i++) {
      rangeSelectorHTML +=
        `.range-selector-option #range-option-slider input:checked:nth-child(${2 * i + 1}) ~ #range-option-pos {
                left: ${100 * (i * 2 + 1) / (2 * rangeSelectorConfig.rangeConfig[1].numberOfOptions)}%;
            }`
    }

    rangeSelectorHTML +=
      `</style >
            <div class='text-center pb-2'>
                <h2 class='range-selector-question text-center'>${rangeSelectorConfig.question}</h2>
                <small>${rangeSelectorConfig.subheading}</small>
            </div>`

    rangeSelectorHTML +=
      `<div class='range-selector-option' >
                <div id='range-option-slider'>`

    for (let i = 0; i < rangeSelectorConfig.rangeConfig[1].numberOfOptions; i++) {
      rangeSelectorHTML +=
        `<input type='radio' name='range-option' id='${i + 1}' value='${i + 1}' required>
                <label for='${i + 1}' data-range-option='${rangeSelectorConfig.rangeConfig[1].options[i]}'></label>`
    }

    rangeSelectorHTML +=
      `<div id='range-option-pos'></div>
            </div>
        </div>`
  }


  $('#filledPageContent').html(rangeSelectorHTML)
}
