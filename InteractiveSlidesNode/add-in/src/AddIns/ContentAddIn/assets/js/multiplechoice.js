function addMultipleChoice(multipleChoiceConfig) {
  let backgroundConfig = {
    backgroundColor: '#ffffff',
  }

  multipleChoiceConfig.question = $('#multipleChoiceContent input[name="question"]').val()
  multipleChoiceConfig.questionConfig.fontSize = $('#question-size-multiply-choice').val()
  multipleChoiceConfig.textConfig = getTextConfig('multipleChoiceContent')
  multipleChoiceConfig.textConfig.fontSize = $('#text-size-multiple-select').val()

  if (!multipleChoiceConfig.dropdownConfig) {
    multipleChoiceConfig.dropdownConfig = {
      backgroundColor: '#ffffff',
      fontColor: '#000000',
      borderRadius: '4',
      borderColor: '#ffffff',
      hoverColor: '#5bc5fa',
      hoverTextColor: '#ffffff',
    }
  }


  multipleChoiceConfig.dropdownConfig.backgroundColor = $('#multipleChoiceContent input[name="dropdownBackgroundColor"]').val()
  multipleChoiceConfig.dropdownConfig.fontColor = $('#multipleChoiceContent input[name="dropdownFontColor"]').val()
  multipleChoiceConfig.dropdownConfig.borderRadius = $('#multipleChoiceContent input[name="dropdownBorderRadius"]').val()
  multipleChoiceConfig.dropdownConfig.borderColor = $('#multipleChoiceContent input[name="input-dropdownBorderColorValue"]').val()
  multipleChoiceConfig.dropdownConfig.hoverColor = $('#multipleChoiceContent input[name="input-dropdownHoverColorValue"]').val()
  multipleChoiceConfig.dropdownConfig.hoverTextColor = $('#multipleChoiceContent input[name="input-dropdownHoverTextColorValue"]').val()

  multipleChoiceConfig.btnConfig = getBtnConfig('multipleChoiceContent')
  console.log(document.getElementById('btnIsLink_Multiple').checked)
  if (document.getElementById('btnIsLink_Multiple').checked) {
    multipleChoiceConfig.btnConfig.linkType = 'slide_link'
    let linksCount = $('#linked-element-slide_container_Multiple').children().length
    multipleChoiceConfig.btnConfig.links = []
    for (let i = 0; i < linksCount; i++) {
      const value = $(`#multipleChoiceContent input[name="multiple-choice-link-${i}"]`).val()
      multipleChoiceConfig.btnConfig.links[i] = +value < 1 ? 1 : +value
    }
  }


  multipleChoiceConfig.label = $('#labels-list-multiple-choice-input').val()
  backgroundConfig.backgroundColor = $(`#multipleChoiceContent input[name="backgroundColor"]`).val()
  multipleChoiceConfig.backgroundConfig = { ...backgroundConfig }

  multipleChoiceConfig.view = $('#multiple-choice-view select').val()

  if (multipleChoiceConfig.label) {
    updateElementsLabels(multipleChoiceConfig.label)
  }


  let answerCount = $('#multiple-choice-answer-input-wrapper').children().length
  multipleChoiceConfig.answers = []
  for (let i = 0; i < answerCount; i++) {
    multipleChoiceConfig.answers[i] = $(`#multipleChoiceContent input[name="multiple-choice-answer-${i}"]`).val()
  }

  generateMultipleChoiceHTML(multipleChoiceConfig)
}

function readImageFile(file) {
  let ImageType = /image.*/
  if (file.type.match(ImageType)) {
    let reader = new FileReader()
    reader.onloadend = function(event) {
      config.itemConfig[0].imageUrl = event.target.result
    }
    reader.readAsDataURL(file)
  } else {
    multipleChoiceConfig.imageUrl = ''
  }
}

function generateMultipleChoiceHTML(multipleChoiceConfig) {
  let multipleChoiceHtml = `
  <style>
        #filledPage {
            background-color: ${multipleChoiceConfig.backgroundConfig.backgroundColor};
        }
        #filledPage .multiple-choice-btn, #filledPage .multiple-choice-select {
          font-size: ${multipleChoiceConfig.textConfig?.fontSize}px;
        }
        .multiple-choice-btn{
            background-color: ${multipleChoiceConfig.btnConfig.backColor};
            border-color: ${multipleChoiceConfig.btnConfig.borderColor};
            color: ${multipleChoiceConfig.btnConfig.textColor};
            border-radius: ${multipleChoiceConfig.btnConfig.borderRadius}px;
        }
        .multiple-choice-btn:hover{
            background-color: ${multipleChoiceConfig.btnConfig.hoverColor};
            border-color: ${multipleChoiceConfig.btnConfig.hoverBorderColor};
            color: ${multipleChoiceConfig.btnConfig.hoverTextColor};
        }
        .multiple-choice-question{
            color: ${multipleChoiceConfig.textConfig.textColor};
            font-family: ${FONTFAMILY[multipleChoiceConfig.textConfig.fontIndex]};
            font-size: ${multipleChoiceConfig.questionConfig.fontSize}px;
        }
  `
  if (multipleChoiceConfig.view === 'button-list') {
    multipleChoiceHtml += `
    </style>
    <div class='text-center'>
        <img class='max-width-400' src='${multipleChoiceConfig?.imageUrl ?? ''}'/>
    </div>
    <h2 class='mt-2 text-center multiple-choice-question'>${multipleChoiceConfig.question}</h2>
    <div class='align-center-horizon'>`
    for (let i = 0; i < multipleChoiceConfig?.answers?.length; i++) {
      multipleChoiceHtml +=
        `<button class='btn mx-1 multiple-choice-btn'>
            ${multipleChoiceConfig?.answers?.[i]?.label ?? multipleChoiceConfig?.answers?.[i]}
        </button>`
    }

    multipleChoiceHtml += `</div>`
  }
  if (multipleChoiceConfig.view === 'dropdown-list' || multipleChoiceConfig.view === 'multiple-selector') {
    multipleChoiceHtml += `
      .dropdown, .multiple-choice-answer, .multiple-choice-options, .multiple-choice-option{
        border-radius: 5px;
      }
      .multiple-choice-answer, .multiple-choice-options{
        width: 100%;
        cursor: pointer;
        border: none;
        outline: none;
        font-size: ${multipleChoiceConfig.textConfig.fontSize}px;
        position: absolute;
        top: 0;
        background: ${multipleChoiceConfig.dropdownConfig.backgroundColor};
      }
      .dropdown{
        width: 100%;
        height: max-content;
        position: relative;
        background: white;
        box-shadow: 0 2px 5px rgba(42, 179, 248, 0.4);
      }
      .multiple-choice-answer{
        height: 100%;
        padding: ${multipleChoiceConfig.textConfig.fontSize}px 10px;
        box-shadow: 0 2px 5px rgba(124, 130, 141, 0.2);
        left: 0;
        color: ${multipleChoiceConfig.dropdownConfig.fontColor};
        border-radius: ${multipleChoiceConfig.dropdownConfig.borderRadius}px;
        border: 1px solid ${multipleChoiceConfig.dropdownConfig.borderColor};
      }
      .multiple-choice-options{
        padding: 4px;
        box-shadow: 0 2px 5px rgb(124, 130, 141);
        overflow: hidden;
        opacity: 0;
        transform: translateY(-50px);
        visibility: hidden;
        border-radius: ${multipleChoiceConfig.dropdownConfig.borderRadius}px;
        border: 1px solid ${multipleChoiceConfig.dropdownConfig.borderColor};
      }
      .multiple-choice-option{
        padding: 4px;
        color: ${multipleChoiceConfig.dropdownConfig.fontColor};
      }
      .multiple-choice-option:not(:last-of-type){
        margin-bottom: 8px;
      }
      .multiple-choice-option:hover{
        color: ${multipleChoiceConfig.dropdownConfig.hoverTextColor};
        background: ${multipleChoiceConfig.dropdownConfig.hoverColor};
      }
      .opened .multiple-choice-options {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
      .multiple-choice-option svg {
        display: none;
      }
      .multiple-choice-option {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .multiple-choice-option.--selected-option svg {
        display: block;
      }
      .multiple-choice-option-text {
        flex-grow: 1; 
      }
    </style>
    <div class='text-center'>
        <img class='max-width-400' src='${multipleChoiceConfig?.imageUrl ?? ''}'/>
    </div>
    <h2 class='mt-2 text-center multiple-choice-question'>${multipleChoiceConfig.question}</h2>
    <div class='align-center-horizon'>
      <div class='dropdown'>`
    if (multipleChoiceConfig.view === 'dropdown-list') {
      multipleChoiceHtml += `<input type='text' class='multiple-choice-answer' value='${multipleChoiceConfig.answers?.[0]?.label ?? multipleChoiceConfig?.answers?.[0]}'/>`
    }
    if (multipleChoiceConfig.view === 'multiple-selector') {
      multipleChoiceHtml += `<input type='text' class='multiple-choice-answer' value='Selected 0 items'/>`
    }
    multipleChoiceHtml += `<div class='multiple-choice-options'>`
    for (let i = 0; i < multipleChoiceConfig?.answers?.length; i++) {
      multipleChoiceHtml +=
        `<div value='${i}' class='multiple-choice-option'><div class='multiple-choice-option-text'>${multipleChoiceConfig.answers?.[i]?.label ?? multipleChoiceConfig?.answers?.[i]}</div>
                 <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'
                     viewBox='0 0 24 24'>
                  <path fill='currentColor' d='M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z' />
                </svg>
         </div>`
    }
    multipleChoiceHtml += `</div></div></div>`
  }
  $('#filledPageContent').html(multipleChoiceHtml)
  dropdownLogic(multipleChoiceConfig)
}

function editMultipleChoice(multipleChoiceConfig) {

}

function dropdownLogic(multipleChoiceConfig) {
  let selectedOptions = []

  const dropdown = document.querySelector('.dropdown')
  const input = document.querySelector('.multiple-choice-answer')
  const listOfOptions = document.querySelectorAll('.multiple-choice-option')
  const body = document.body

  const toggleDropdown = (event) => {
    event.stopPropagation()

    if (multipleChoiceConfig.view === 'dropdown-list') {
      dropdown.classList.toggle('opened')
    }
    else {
      if(!dropdown.classList.contains('opened')){
        dropdown.classList.add('opened')
      }
    }

  }
  const selectOption = (event) => {
    if (multipleChoiceConfig.view === 'dropdown-list') {

      input.value = event.currentTarget.textContent
    } else {
      event.currentTarget.classList.toggle('--selected-option')

      selectedOptions = Array.from(document.querySelectorAll('.--selected-option'))


      input.value = `Selected ${selectedOptions.length} ${selectedOptions.length > 1 || selectedOptions.length === 0 ? 'items' : 'item'}`
    }


  }

  if (dropdown) {
    const closeDropdownFromOutside = () => {
      if (dropdown.classList.contains('opened')) {
        dropdown.classList.remove('opened')
      }
    }

    body.addEventListener('click', closeDropdownFromOutside)
    dropdown.addEventListener('click', toggleDropdown)


    listOfOptions.forEach((option) => {
      option?.addEventListener('click', selectOption)
    })
  }


}





