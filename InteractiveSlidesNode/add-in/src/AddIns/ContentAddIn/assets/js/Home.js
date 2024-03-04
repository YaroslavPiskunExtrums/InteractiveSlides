Office.onReady(async function(info) {

  // $(document).ready() is deprecated and the $() is recommended


  $(async function() {
      const apiUrl = window.location.pathname.startsWith('/addin') ? `${window.location.origin}/addin` : `${window.location.origin}`

      const loadScreenButton = document.querySelector('.load-screen button')

      loadScreenButton.onclick = (e) => {
        e.preventDefault()
        const loadScreen = document.querySelector('.load-screen')
        localStorage.setItem('slidex-loaded-content', JSON.stringify(1))
        loadScreen.style.display = 'none'
      }

      const loading = localStorage.getItem('slidex-loaded-content')
      if (loading) {
        const loadScreen = document.querySelector('.load-screen')
        loadScreen.style.display = 'none'
      }


      $('#select-customization-type').on('change', function() {
        const selectedValue = $(this).val()

        if (selectedValue === 'image') {
          $('#text-select').hide()
          $('#image-select').show()
          $('.image-config-block').show()
          $('.text-config-block').hide()
        }
        if (selectedValue === 'text') {
          $('#text-select').show()
          $('#image-select').hide()
          $('.image-config-block').hide()
          $('.text-config-block').show()
        }

      })


      $('#uploadCustomImage').on('change', function() {
        const file = this.files[0]
        const reader = new FileReader()
        reader.onload = function(e) {
          $('#customizationContent img').attr('src', e.target.result)
        }
        reader.readAsDataURL(file)
        console.log('FILE ', file.name)

        const fileNameInput = document.getElementById('custom-image-file-name')
        fileNameInput.value = file.name
        readImageFileCustomization(file)
      })
      if (localStorage.getItem('slides-tokens')) {
        const res = await authFetch(`${apiUrl}/api/HTML/get-default-styles`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }, false)

        if (res.status === 200) {
          const defaultStyles = await res.json()
          localStorage.setItem('default_styles', JSON.stringify(defaultStyles))

          const defaultMultiplyStyleConfig = getDefaultStyles(dbFields.MULTIPLY_CHOICE)
          const defaultButtonStyleConfig = getDefaultStyles(dbFields.BUTTON)

          const defaultOpenFieldStyleConfig = getDefaultStyles(dbFields.OPEN_FIELD)
          const defaultCalculatorStyleConfig = getDefaultStyles(dbFields.CALCULATOR)
          const defaultCustomerDetailStyleConfig = getDefaultStyles(dbFields.CUSTOMER_DETAIL)
          const defaultRangeSelectorStyleConfig = getDefaultStyles(dbFields.RANGE_SELECTOR)
          const defaultDateFieldStyleConfig = getDefaultStyles(dbFields.DATE_FIELD)

          if (defaultMultiplyStyleConfig) {
            setTextDefaultStyles('multipleChoiceContent', defaultMultiplyStyleConfig.textConfig)
            setBackgroundDefaultStatus('multipleChoiceContent', defaultMultiplyStyleConfig.backgroundConfig)
            setBtnDefaultStyles('multipleChoiceContent', defaultMultiplyStyleConfig.btnConfig)
            setQuestionDefaultStyles('#question-size-multiply-choice', defaultMultiplyStyleConfig?.questionConfig)
            setDropdownDefaultStyles('multipleChoiceContent', defaultMultiplyStyleConfig?.dropdownConfig)
          }
          if (defaultButtonStyleConfig) {
            setBtnDefaultStyles('addButtonContent', defaultButtonStyleConfig.btnConfig)
            setBackgroundDefaultStatus('addButtonContent', defaultButtonStyleConfig.backgroundConfig)
          }
          if (defaultOpenFieldStyleConfig) {
            setTextDefaultStyles('openFieldContent', defaultOpenFieldStyleConfig.textConfig)
            setBackgroundDefaultStatus('openFieldContent', defaultOpenFieldStyleConfig.backgroundConfig)
            setInputDefaultStyles('openFieldContent', defaultOpenFieldStyleConfig.inputConfig)
            setQuestionDefaultStyles('#question-size-open-field', defaultOpenFieldStyleConfig?.questionConfig)
          }
          if (defaultCalculatorStyleConfig) {
            setInputDefaultStyles('calculatorContent', defaultCalculatorStyleConfig.inputConfig)
            setBackgroundDefaultStatus('calculatorContent', defaultCalculatorStyleConfig.backgroundConfig)
            setTextDefaultStyles('calculatorContent', defaultCalculatorStyleConfig.textConfig)
            setQuestionDefaultStyles('#question-size-calculator', defaultCalculatorStyleConfig?.questionConfig)
          }
          if (defaultCustomerDetailStyleConfig) {
            setInputDefaultStyles('customerDetailsContent', defaultCustomerDetailStyleConfig.inputConfig)
            setBackgroundDefaultStatus('customerDetailsContent', defaultCustomerDetailStyleConfig.backgroundConfig)
            setFormDefaultStyles('customerDetailsContent', defaultCustomerDetailStyleConfig.formConfig)
          }
          if (defaultRangeSelectorStyleConfig) {
            setBackgroundDefaultStatus('rangeSelectorContent', defaultRangeSelectorStyleConfig.backgroundConfig)
            setTextDefaultStyles('rangeSelectorContent', defaultRangeSelectorStyleConfig.textConfig)
            setRangeDefaultStyle('rangeSelectorContent', defaultRangeSelectorStyleConfig.rangeConfig)
            setQuestionDefaultStyles('#question-size-range-selector', defaultRangeSelectorStyleConfig?.questionConfig)
          }
          if (defaultDateFieldStyleConfig) {
            setBackgroundDefaultStatus('dateFieldContent', defaultDateFieldStyleConfig.backgroundConfig)
            setTextDefaultStyles('dateFieldContent', defaultDateFieldStyleConfig.textConfig)
            setInputDefaultStyles('dateFieldContent', defaultDateFieldStyleConfig.inputConfig)
            setQuestionDefaultStyles('#question-size-date-field', defaultDateFieldStyleConfig?.questionConfig)
          }

        }

      }
      // check if uniqueid is validated, else generate a new one
      if (!validatePresentationUniqueID(retrievePresentationUniqueID()))
        createPresentationUniqueID()

      // save the current addin shape name to identify our addins when submit
      if (!validateShapeName(retrieveShapeName())) {
        await setContentAddInName().then(function(shapeName) {
          saveShapeName(shapeName)
        })
      }

      if (localStorage.getItem('slides-tokens') && retrieveShapeName()) {
        const res = await authFetch(`${apiUrl}/api/ContentAddIn/get-figure-config/${retrieveShapeName()}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }, false)
        if (res.status === 200) {
          const response = await res.json()
          config = JSON.parse(response.payload.content_config)
          updateStatus()
          updateUIBasedOnConfig()

          const currentConfig = config.itemConfig[config.selectedItem]

          switch (config.selectedItem) {
            case MULTIPLECHOICE: {
              setTextDefaultStyles('multipleChoiceContent', currentConfig?.textConfig)
              setBackgroundDefaultStatus('multipleChoiceContent', currentConfig?.backgroundConfig)
              setBtnDefaultStyles('multipleChoiceContent', currentConfig?.btnConfig)
              setQuestionDefaultStyles('#question-size-multiply-choice', currentConfig?.questionConfig)
              setDropdownDefaultStyles('multipleChoiceContent', currentConfig?.dropdownConfig)
              setLabelValue('labels-list-multiple-choice-input', currentConfig)
              setQuestionValue('multipleChoiceContent', currentConfig)
              $('#multiple-choice-view select').val(currentConfig?.view)

              for (let i = 0; i < currentConfig?.answers?.length; i++) {
                $(`#multipleChoiceContent input[name="multiple-choice-answer-${i}"]`).val(currentConfig?.answers?.[i]?.label ?? currentConfig?.answers?.[i])
              }
              break
            }
            case RANGESELECTOR: {
              setBackgroundDefaultStatus('rangeSelectorContent', currentConfig?.backgroundConfig)
              setTextDefaultStyles('rangeSelectorContent', currentConfig?.textConfig)
              setRangeDefaultStyle('rangeSelectorContent', currentConfig?.rangeConfig)
              setQuestionDefaultStyles('#question-size-range-selector', currentConfig?.questionConfig)
              setQuestionValue('rangeSelectorContent', currentConfig)
              setLabelValue('labels-range-selector-input', currentConfig)
              setSubheadingValue('rangeSelectorContent', currentConfig)

              $('#rangeSelectorContent select[name="type"]').val(currentConfig?.type)
              if (currentConfig?.type === '1') {

                for (let i = 0; i < currentConfig?.rangeConfig?.[1]?.numberOfOptions; i++) {
                  $(`#range-selector-options-wrapper input[name="range-option-${i}"]`).val(currentConfig?.rangeConfig?.[1]?.options[i])
                }
              } else {
                $(`#rangeSelectorContent input[name="range-max"]`).val(currentConfig?.rangeConfig?.[0]?.max)
                $(`#rangeSelectorContent input[name="range-min"]`).val(currentConfig?.rangeConfig?.[0]?.min)
                $(`#rangeSelectorContent input[name="range-step"]`).val(currentConfig?.rangeConfig?.[0]?.step)
              }

              break
            }
            case OPENFIELD: {
              setTextDefaultStyles('openFieldContent', currentConfig?.textConfig)
              setBackgroundDefaultStatus('openFieldContent', currentConfig?.backgroundConfig)
              setInputDefaultStyles('openFieldContent', currentConfig?.inputConfig)
              setQuestionDefaultStyles('#question-size-open-field', currentConfig?.questionConfig)
              setQuestionValue('openFieldContent', currentConfig)
              setLabelValue('labels-list-open-field-input', currentConfig)
              setSubheadingValue('openFieldContent', currentConfig)

              break
            }
            case CUSTOMERDETAILS: {
              setInputDefaultStyles('customerDetailsContent', currentConfig?.inputConfig)
              setBackgroundDefaultStatus('customerDetailsContent', currentConfig?.backgroundConfig)
              setFormDefaultStyles('customerDetailsContent', currentConfig?.formConfig)
              setLabelValue('labels-list-customer-details-input', currentConfig)

              $('#customerDetailsContent textarea[name="textMessage"]').val(currentConfig?.textMessage)
              $('#customerDetailsContent select[name="business"]').val(currentConfig?.business)
              $('#customerDetailsContent input[name="phone"]').val(currentConfig?.phone)
              $('#customerDetailsContent input[name="email"]').val(currentConfig?.email)
              $('#customerDetailsContent input[name="fullName"]').val(currentConfig?.fullName)
              for (let i = 0; i < currentConfig?.additionalFields.length; i++) {
                $(`#customerDetailsContent input[name="additional-field-${i}"]`).val(currentConfig?.additionalFields[i])
              }
              break
            }
            case CUSTOMBUTTON: {
              setBtnDefaultStyles('addButtonContent', currentConfig?.btnConfig)
              setBackgroundDefaultStatus('addButtonContent', currentConfig?.backgroundConfig)
              setLabelValue('labels-list-add-button-input', currentConfig)
              $('#addButtonContent input[name="btnText"]').val(currentConfig?.btnText)
              break
            }
            case CALCULATOR: {
              setInputDefaultStyles('calculatorContent', currentConfig?.inputConfig)
              setBackgroundDefaultStatus('calculatorContent', currentConfig?.backgroundConfig)
              setTextDefaultStyles('calculatorContent', currentConfig?.textConfig)
              setQuestionDefaultStyles('#question-size-calculator', currentConfig?.questionConfig)
              setLabelValue('labels-list-calculator-input', currentConfig)
              setQuestionValue('calculatorContent', currentConfig)
              setSubheadingValue('calculatorContent', currentConfig)
              $('#calculatorContent input[name="equation"]').val(currentConfig?.equation)

              break
            }
            case DATEFIELD: {
              setBackgroundDefaultStatus('dateFieldContent', currentConfig?.backgroundConfig)
              setTextDefaultStyles('dateFieldContent', currentConfig?.textConfig)
              setInputDefaultStyles('dateFieldContent', currentConfig?.inputConfig)
              setQuestionDefaultStyles('#question-size-date-field', currentConfig?.questionConfig)
              setLabelValue('labels-list-date-field-input', currentConfig)
              setQuestionValue('dateFieldContent', currentConfig)

              break
            }
            case CUSTOMIZATION: {

              $('#select-customization-type').val(currentConfig?.type)
              if (currentConfig?.type === 'text') {
                $('#text-select').show()
                $('#image-select').hide()
                $('.image-config-block').hide()
                $('.text-config-block').show()
                $('#customizationContent textarea[name="text"]').val(currentConfig?.text)
              } else {
                $('#text-select').hide()
                $('#image-select').show()
                $('.image-config-block').show()
                $('.text-config-block').hide()
                $('#customizationContent img').attr('src', currentConfig?.imageUrl)
                $('#custom-image-file-name').val(currentConfig?.fileName)
              }

              $('#text-align-customization').val(currentConfig?.textConfig?.layout)
              $('#customizationContent input[name="textColor"]').val(currentConfig?.textConfig?.textColor)
              $('#customizationContent input[name="fontSize"]').val(currentConfig?.textConfig?.fontSize)
              $('#customizationContent select[name="fontIndex"]').val(currentConfig?.textConfig?.fontIndex)
              $('#customizationContent input[name="imageRadius"]').val(currentConfig?.imageConfig?.borderRadius)
              $('#customizationContent input[name="backgroundColor"]').val(currentConfig?.backgroundConfig?.backgroundColor)


              break
            }
          }
          if (currentConfig?.label) {
            updateElementsLabels(currentConfig?.label)
          }

        }
      }

      await getLastShape().then(function(data) {
        renameLastShape(data, config)
      })

      function choiceIndices() {
        return {
          multipleChoice: 0,
          rangeSelector: 1,
          openField: 2,
          customerDetails: 3,
          addButton: 4,
          calculator: 5,
          dateField: 6,
          customization: 7,
        }
      }


      const choicePages = [$('#multipleChoiceContent'), $('#rangeSelectorContent'), $('#openFieldContent'), $('#customerDetailsContent'), $('#addButtonContent'), $('#calculatorContent'), $('#dateFieldContent'), $('#customizationContent')]

      choicePages.forEach(item => {
        console.log('MENU ITEM', item)
        item?.hide()
      })

      // set up the default range selector type
      $('.range-option').hide()
      $('.range-number').show()


      // retrieve status from office settings and validate
      // if valide then set it as config
      if (validateStatus(retrieveStatusFromOfficeSettings())) {
        config = retrieveStatusFromOfficeSettings()
        config.extendedErrorLogging = true
        // need to change the ui as the config
        updateUIBasedOnConfig()
      }


      function updateLabels(labels) {
        Office.context.document.settings.set('labels-options', labels)
        Office.context.document.settings.saveAsync()
        return labels
      }

      let presentationLabels = Office.context.document.settings.get('labels-options')


      if (!presentationLabels) {
        const defaultLabels = [
          'name',
          'email',
          'phone',
          'country',
          'title',
          'industry',
          'number of employees',
          'country/city',
          'annual revenue',
        ]
        updateLabels(defaultLabels)
        presentationLabels = defaultLabels
      }


      const labelsSelector = document.querySelectorAll('.labelsList')


      labelsSelector.forEach(function(label) {
        presentationLabels.forEach(function(presentationLabel) {
          label.innerHTML += `<option value='${presentationLabel}'>${presentationLabel}</option>`
        })
      })


      // Need to initialize based on the config
      function updateUIBasedOnConfig() {
        console.log('CONFIG_PAGE_STATUS', config.currentPage)
        switch (config.currentPage) {
          case ELEMENTSPAGE:
            // DO NOTHING
            break
          case EDITPAGE:
            let choiceId = Object.keys(choiceIndices())[config.selectedItem]
            // show corresponding edit page
            $('#' + choiceId + 'Content').show()
            // hide first page
            $('#elementsList').hide()
            break
          case FINALPAGE:
            // hide first page
            $('#elementsList').hide()
            showFinalPageBasedOnConfig(config.selectedItem)
            break
        }
      }

      // show final page based on the selectedItem index
      function showFinalPageBasedOnConfig(selectedItemIdx) {

        console.log('SELECTED PAGE IS', selectedItemIdx)

        switch (selectedItemIdx) {
          case MULTIPLECHOICE:
            // need to fill final page
            showFinalPage(selectedItemIdx)
            generateMultipleChoiceHTML(config.itemConfig[MULTIPLECHOICE])
            break
          case RANGESELECTOR:
            // need to fill final page
            showFinalPage(selectedItemIdx)
            generateRangeSelectorHTML(config.itemConfig[RANGESELECTOR])
            break
          case OPENFIELD:
            // need to fill final page
            showFinalPage(selectedItemIdx)
            generateOpenFieldHTML(config.itemConfig[OPENFIELD])
            break
          case CUSTOMERDETAILS:
            // need to fill final page
            showFinalPage(selectedItemIdx)
            generateCustomerDetailsHTML(config.itemConfig[CUSTOMERDETAILS])
            break
          case CUSTOMBUTTON:
            // need to fill final page
            showFinalPage(selectedItemIdx)
            generateCustomButtonHTML(config.itemConfig[CUSTOMBUTTON])
            break
          case CALCULATOR:
            // need to fill final page
            showFinalPage(selectedItemIdx)
            generateCalculatorHTML(config.itemConfig[CALCULATOR])
            break
          case DATEFIELD:
            // need to fill final page
            showFinalPage(selectedItemIdx)
            generateDateFieldHTML(config.itemConfig[DATEFIELD])
            break
          case CUSTOMIZATION:
            showFinalPage(selectedItemIdx)
            generateCustomizationHTML(config.itemConfig[CUSTOMIZATION])
            break
        }
      }


      $('#btnIsLink').on('change', function(e) {
        if (e.target.checked) {
          $('#linked-element-slide-wrapper').show()
        } else {
          $('#linked-element-slide-wrapper').hide()
        }
      })

      $('#btnIsLink_Multiple').on('change', (e) => {
        if (e.target.checked) {
          $('#linked-element-slide_container_Multiple').find('.form-control').remove()
          $('#linked-element-slide-wrapper_Multiple').show()
          const answersAmount = $('#multiple-choice-answer-input-wrapper').children().length
          let html = ''
          for (let i = 0; i < answersAmount; i++) {
            html += `<input type='text' class='form-control' placeholder='Add your link${answersAmount > 1 ? ' to answer #' + (i + 1) : ''}' name='multiple-choice-link-${i}'>`
          }
          $('#linked-element-slide_container_Multiple').append(html)
        } else {
          $('#linked-element-slide-wrapper_Multiple').hide()
          $('#linked-element-slide_container_Multiple').find('.form-control').remove()
        }
      })

      $('#linkType').on('change', (e) => {
        const linkTypeIds = {
          slide_link: '#linked-element-slide-slide_link',
          hyperlink: '#linked-element-slide-hyperlink',
        }

        if (!(e.target.value in linkTypeIds)) return

        Object.entries(linkTypeIds).forEach((el) => {
          if (e.target.value === el[0]) {
            $(el[1]).show()
            return
          }
          $(el[1]).hide()
        })

      })// setting up an event handler for back button in edit page
      $('.back-button').on('click', function() {
        $(this).closest('.basic-elements-body').hide()
        $('#elementsList').show()

        config.currentPage = ELEMENTSPAGE
        config.selectedItem = MULTIPLECHOICE

        // update the status
        updateStatus()
      })


      // setting up an event handler for element options in the first page
      $('#elementsList').on('click', '.basic-elements-choice', function() {
        // get the corresponding edit page id
        let choiceId = $(this).attr('id')

        // show corresponding edit page
        $('#' + choiceId + 'Content').show()

        // hide first page
        $('#elementsList').hide()

        // set the current page
        config.currentPage = EDITPAGE
        config.selectedItem = choiceIndices()[choiceId]

        // update the status
        updateStatus()
      })

      // adding multiple answers in multiple choices
      $('#multiple-choice-add-answer-btn').on('click', function() {
        let answerCount = $('#multiple-choice-answer-input-wrapper').children().length
        $('#multiple-choice-answer-input-wrapper').append(`<input type='text' class='form-control' placeholder='Add your answer' name = 'multiple-choice-answer-${answerCount}'>`)
        if (!document.getElementById('btnIsLink_Multiple').checked) {
          $('#linked-element-slide_container_Multiple').find('.form-control').remove()
        }
        const linksAmount = $('#linked-element-slide_container_Multiple').children().length
        if (linksAmount === 1) {
          $('#linked-element-slide_container_Multiple input[name="multiple-choice-link-0"]').attr('placeholder', 'Add your link to answer #1')
        }
        $('#linked-element-slide_container_Multiple').append(`<input type='text' class='form-control' placeholder='Add your link to answer #${linksAmount + 1}'}' name='multiple-choice-link-${linksAmount}'>`)
      })

      // adding additional field in customer details
      $('#customer-details-add-field-btn').on('click', function() {
        let additionalFieldCount = $('#customer-details-additional-field-wrapper').children().length
        $('#customer-details-additional-field-wrapper').append(`<div class = 'form-group'><input type='text' class='form-control' placeholder='Additional field ${additionalFieldCount}' name='additional-field-${additionalFieldCount}'></div>`)
      })

      // adding range selector type change
      $('#range-selector-type').on('change', function() {
        if (this.value == RANGETYPENUMBER) {
          $('.range-option').hide()
          $('.range-number').show()
        } else {
          $('.range-option').show()
          $('.range-number').hide()
        }
      })

      $('#multiple-choice-type').on('change', function() {
        if (this.value !== MULTIPLE_CHOICE_TYPE.DROPDOWN && this.value !== MULTIPLE_CHOICE_TYPE.MULTIPLE) {
          $('.dropdown-config-block').hide()
          $('#multiple-choice_btn-wrapper').show()
          return
        }
        $('.dropdown-config-block').show()
        $('#multiple-choice_btn-wrapper').hide()
      })
      // adding options in range selector
      $('#range-selector-add-option-btn').on('click', function() {
        let optionCount = $('#range-selector-options-wrapper').children().length
        $('#range-selector-options-wrapper').append(`<div class = 'form-group col-4'><input type='text' class='form-control' placeholder='Range option' name='range-option-${optionCount}'></div>`)
      })

      // image change handler
      function handleImage(ev) {
        let file = ev.target.files[0]
        readImageFile(file)
      }

      // add multiplechoice image event handler
      $('#multipleChoiceContent input[name="imageUrl"]').on('change', handleImage)

      // color picker change handler
      function handleColorChange(ev) {
        let nameOfInput = ev.target.name
        $(`${ev.data} .color-block input[name="${nameOfInput}Value"]`).val(ev.target.value)
      }

      // add multiplechoice color picker event handlers
      $('#multipleChoiceContent .color-block input[type="color"]').on('change', undefined, '#multipleChoiceContent', handleColorChange)
      $('#rangeSelectorContent .color-block input[type="color"]').on('change', undefined, '#rangeSelectorContent', handleColorChange)
      $('#openFieldContent .color-block input[type="color"]').on('change', undefined, '#openFieldContent', handleColorChange)
      $('#customerDetailsContent .color-block input[type="color"]').on('change', undefined, '#customerDetailsContent', handleColorChange)
      $('#addButtonContent .color-block input[type="color"]').on('change', undefined, '#addButtonContent', handleColorChange)
      $('#calculatorContent .color-block input[type="color"]').on('change', undefined, '#calculatorContent', handleColorChange)
      $('#dateFieldContent .color-block input[type="color"]').on('change', undefined, '#dateFieldContent', handleColorChange)
      $('#customizationContent .color-block input[type="color"]').on('change', undefined, '#customizationContent', handleColorChange)


      // color value change handler
      function handleColorValueChange(ev) {
        let nameOfInput = ev.target.name.replace('Value', '')
        $(`${ev.data} .color-block input[name="${nameOfInput}"]`).val(ev.target.value)
      }

      // add multiplechoice color value event handlers
      $('#multipleChoiceContent .color-block-code input').on('change', undefined, '#multipleChoiceContent', handleColorValueChange)
      $('#rangeSelectorContent .color-block-code input').on('change', undefined, '#rangeSelectorContent', handleColorValueChange)
      $('#openFieldContent .color-block-code input').on('change', undefined, '#openFieldContent', handleColorValueChange)
      $('#customerDetailsContent .color-block-code input').on('change', undefined, '#customerDetailsContent', handleColorValueChange)
      $('#addButtonContent .color-block-code input').on('change', undefined, '#addButtonContent', handleColorValueChange)
      $('#calculatorContent .color-block-code input').on('change', undefined, '#calculatorContent', handleColorValueChange)
      $('#dateFieldContent .color-block-code input').on('change', undefined, '#dateFieldContent', handleColorValueChange)
      $('#customizationContent .color-block-code input').on('change', undefined, '#customizationContent', handleColorValueChange)


      // show final page
      function showFinalPage(selectedItem) {

        config.currentPage = FINALPAGE
        config.selectedItem = selectedItem

        let choiceId = Object.keys(choiceIndices())[config.selectedItem]
        $('#' + choiceId + 'Content').hide()

        $('#filledPage').removeClass('hide')
        $('#filledPage').addClass('show')

      }

      // add event for showing final page in multiplechoice page
      $('#multiple-choice-add-to-presentation-btn').on('click', function() {
        // Add multiple choice to the presentation
        showFinalPage(MULTIPLECHOICE)
        addMultipleChoice(config.itemConfig[MULTIPLECHOICE])
        // update the status
        updateStatus()
      })

      // add event for showing final page in rangeselector page
      $('#range-selector-add-to-presentation-btn').on('click', function() {
        // Add range selector to the presentation
        showFinalPage(RANGESELECTOR)
        addRangeSelector(config.itemConfig[RANGESELECTOR])
        // update the status
        updateStatus()
      })

      // add event for showing final page in openfield page
      $('#open-field-add-to-presentation-btn').on('click', function() {
        // Add open field to the presentation
        showFinalPage(OPENFIELD)
        addOpenField(config.itemConfig[OPENFIELD])
        // update the status
        updateStatus()
      })
      // add event for showing final page in customerdetails page
      $('#customer-details-add-to-presentation-btn').on('click', function() {
        // Add customer details to the presentation
        showFinalPage(CUSTOMERDETAILS)
        addCustomerDetails(config.itemConfig[CUSTOMERDETAILS])
        // update the status
        updateStatus()
      })
      // add event for showing final page in addbutton page
      $('#add-button-add-to-presentation-btn').on('click', function() {
        // Add custom button to the presentation
        showFinalPage(CUSTOMBUTTON)
        addCustomButton(config.itemConfig[CUSTOMBUTTON])
        // update the status
        updateStatus()
      })

      $('#calculator-add-to-presentation-btn').on('click', function() {
        // Add open field to the presentation
        showFinalPage(CALCULATOR)
        addCalculator(config.itemConfig[CALCULATOR])
        // update the status
        updateStatus()
      })

      $('#date-field-add-to-presentation-btn').on('click', function() {
        // Add date field to the presentation
        showFinalPage(DATEFIELD)
        addDateField(config.itemConfig[DATEFIELD])
        // update the status
        updateStatus()
      })

      $('#customization-add-to-presentation-btn').on('click', function() {
        showFinalPage(CUSTOMIZATION)
        addCustomization(config.itemConfig[CUSTOMIZATION])
        // update the status
        updateStatus()
      })

      // hide backToEdit button in slide show mode
      Office.context.document.addHandlerAsync(Office.EventType.ActiveViewChanged, function(e) {
        if (e.activeView === 'read')
          $('#backToEdit').hide()
        else
          $('#backToEdit').show()
      })

      // setting up an event handler for three dots button in final page
      $('#backToEdit').on('click', function() {
        $(this).find('.dropdown-menu').toggle()
      })

      // setting up an event handler for back button in final page
      $('#backToEdit .dropdown-menu').on('click', '.dropdown-item', function() {

        $('#filledPage').removeClass('show')
        $('#filledPage').addClass('hide')

        // show the current editing page
        let choiceId = Object.keys(choiceIndices())[config.selectedItem]
        $('#' + choiceId + 'Content').show()

        // need to fill the information based on the current config
        // TODO
        // I do not think this is required

        // set the current page
        config.currentPage = EDITPAGE

        // update the status
        updateStatus()

      })
    },
  )

})

