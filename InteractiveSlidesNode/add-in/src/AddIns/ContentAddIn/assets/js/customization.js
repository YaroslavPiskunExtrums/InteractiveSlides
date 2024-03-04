function addCustomization(customizationConfig) {
  let backgroundConfig = {
    backgroundColor: '#ffffff',
  }


  if(!customizationConfig.backgroundConfig) {
    customizationConfig.backgroundConfig = backgroundConfig
  }

  customizationConfig.type = document.getElementById('select-customization-type').value

  customizationConfig.textConfig.layout = document.getElementById('text-align-customization').value
  customizationConfig.textConfig.textColor = $(`#customizationContent input[name="textColor"]`).val()
  customizationConfig.textConfig.fontSize = $(`#customizationContent input[name="fontSize"]`).val()
  customizationConfig.textConfig.fontIndex = $(`#customizationContent select[name="fontIndex"]`).val()

  customizationConfig.imageConfig.borderRadius = $(`#customizationContent input[name="imageRadius"]`).val()

  customizationConfig.backgroundConfig.backgroundColor = $(`#customizationContent input[name="backgroundColor"]`).val()

  customizationConfig.text = $(`#customizationContent textarea[name="text"]`).val()


  generateCustomizationHTML(customizationConfig)
}

function readImageFileCustomization(file) {
  let ImageType = /image.*/
  if (file.type.match(ImageType)) {
    let reader = new FileReader()
    reader.onloadend = function(event) {
      config.itemConfig[CUSTOMIZATION].imageUrl = event.target.result
    }
    reader.readAsDataURL(file)
  } else {
    config.itemConfig[CUSTOMIZATION].imageUrl = ''
  }
}

function generateCustomizationHTML(customizationConfig) {
  let predefinedValue = customizationConfig?.text ?? ''

  // config.itemConfig[CUSTOMIZATION] = customizationConfig

  // console.log("CUSTOMIZATION CONFIG", customizationConfig, config)

  let multipleChoiceHtml = `
    <style>
      #filledPage {
        background-color: ${customizationConfig.backgroundConfig.backgroundColor};
      }
      
      #filledPageContent {
        height: 85vh;
      }
      
      #filledPage .user-text-area {
        font-size: ${customizationConfig.textConfig?.fontSize}px;
        text-align: ${customizationConfig.textConfig?.layout};
        color: ${customizationConfig.textConfig?.textColor};
        font-family: ${FONTFAMILY[customizationConfig.textConfig?.fontIndex]};
        background-color: ${customizationConfig.backgroundConfig.backgroundColor};
        resize: vertical;
        width: 98%;
        display: block;
        margin: 0 auto;
        max-height: 300px;
        border: none;
      }
      
       #filledPage .user-text-area.--dashed {
        border: 1px dashed #495057;
      }
       #filledPage .user-text-area:focus {
        outline: none;
        border: 1px dashed #495057;
       }
       #filledPage .user-image {
          width: 100%;
          height: 100%;
          border-radius: ${customizationConfig.imageConfig.borderRadius}px;
       }
    </style>
    
    
    <script>
      let textArea = null
       function updateTextArea() {
        textArea?.value ? textArea.placeholder = '' : textArea.placeholder = 'Type your text'
        textArea?.value ? textArea.classList.remove('--dashed') : textArea.classList.add('--dashed')
      }
      if(!textArea) {
        textArea = document.getElementById('userTextArea')
      }
      if(textArea) {
        textArea.oninput = updateTextArea
      }
      
      
  
    </script>
  `



  if (customizationConfig.type === 'text') {
    multipleChoiceHtml += `
      <textarea placeholder='${predefinedValue ? "" : "Type your text"}' class='user-text-area ${predefinedValue ? "" : "--dashed"}' id='userTextArea'>${predefinedValue ?? ''}</textarea>
    `
  }
  if (customizationConfig.type === 'image') {
    multipleChoiceHtml += `
       ${customizationConfig?.imageUrl ? `<img src='${customizationConfig?.imageUrl}' alt='${customizationConfig.fileName}' class='user-image''/>`
      :
      `<div style='background-color: ${customizationConfig.backgroundConfig.backgroundColor}; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;'>No image</div>`}
    `
  }

  $('#filledPageContent').html(multipleChoiceHtml)

}








