function addCustomButton(customButtonConfig) {
  let backgroundConfig = {
    backgroundColor: '#ffffff',
  }
  customButtonConfig.btnText = $('#addButtonContent input[name="btnText"]').val()
  customButtonConfig.btnConfig = getBtnConfig('addButtonContent')
  customButtonConfig.btnConfig.fontSize = $('#text-size-button').val()

  customButtonConfig.label = $('#labels-list-add-button-input').val()

  backgroundConfig.backgroundColor = $(`#addButtonContent input[name="backgroundColor"]`).val()
  customButtonConfig.backgroundConfig = { ...backgroundConfig }


  if (customButtonConfig.label) {
    updateElementsLabels(customButtonConfig.label)
  }
  if (document.getElementById('btnIsLink').checked) {
    customButtonConfig.btnConfig.linkType = $('#linkType').val()
    if (customButtonConfig.btnConfig.linkType === 'slide_link') {
      customButtonConfig.btnConfig.link = $('#linked-element-slide-input').val()

      customButtonConfig.btnConfig.link = customButtonConfig.btnConfig.link < 1 ? 1 : customButtonConfig.btnConfig.link

    } else if (customButtonConfig.btnConfig.linkType === 'hyperlink') {
      customButtonConfig.btnConfig.link = $('#linked-element-slide-hyperlink-input').val()
    }
  }

  generateCustomButtonHTML(customButtonConfig)
}

function generateCustomButtonHTML(customButtonConfig) {
  let customButtonHTML =
    `<style>
        #filledPage {
            background-color: ${customButtonConfig.backgroundConfig.backgroundColor};
        }
        #filledPage .custom-btn {
          font-size: ${customButtonConfig.btnConfig?.fontSize}px;
        }
        .custom-btn{
            background-color: ${customButtonConfig.btnConfig.backColor};
            border-color: ${customButtonConfig.btnConfig.borderColor};
            color: ${customButtonConfig.btnConfig.textColor};
            border-radius: ${customButtonConfig.btnConfig.borderRadius}px;
        }
        .custom-btn:hover{
            background-color: ${customButtonConfig.btnConfig.hoverColor};
            border-color: ${customButtonConfig.btnConfig.hoverBorderColor};
            color: ${customButtonConfig.btnConfig.hoverTextColor};
        }

    </style>
    <div class = 'text-center'>
        <button id='customButton' class = 'btn custom-btn m-1'>${customButtonConfig.btnText}</button>
    </div>
    `
  $('#filledPageContent').html(customButtonHTML)
  // $('#customButton').click(function () {
  //   PowerPoint.run(async (context) => {
  //     context.presentation.load("slides");
  //     await context.sync();
  //     const slide = context.presentation.slides.getItemAt(customButtonConfig.btnConfig.link - 1);
  //     await context.sync();
  //     slide.load("id");
  //
  //     console.log(slide.id)
  //
  //     try {
  //       await context.sync();
  //     } catch (error) {
  //       console.warn("Please check your link");
  //       console.error(error);
  //       return;
  //     }
  //     await context.sync();
  //     console.log("HERE")
  //     context.presentation.setSelectedSlides([slide.id]);
  //     console.log("HERE-2")
  //
  //     await context.sync();
  //     console.log("HERE-3")
  //
  //   });
  // })


}
