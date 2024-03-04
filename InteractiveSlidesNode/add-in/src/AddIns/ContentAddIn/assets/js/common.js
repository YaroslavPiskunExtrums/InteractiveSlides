function getTextConfig(wrapperId) {
    let textConfig = {
        textColor: "#000000",
        fontIndex: 0
    }

    textConfig.textColor = $(`#${wrapperId}  input[name="textColor"]`).val()
    textConfig.fontIndex = $(`#${wrapperId}  select[name="fontIndex"]`).val()
    return textConfig
}

function setTextDefaultStyles(wrapperId, defaultTextConfig) {
    $(`#${wrapperId}  input[name="textColor"]`).val(defaultTextConfig.textColor)
    $(`#${wrapperId}  select[name="fontIndex"]`).val(defaultTextConfig.fontIndex)
    $(`#${wrapperId}  input[name="textColorValue"]`).val(defaultTextConfig.textColor)
    if (defaultTextConfig.fontSize) $(`#${wrapperId}  input[name="fontSize"]`).val(defaultTextConfig.fontSize)
}

function setBtnDefaultStyles(wrapperId, defaultBtnConfig) {
    $(`#${wrapperId}  input[name="btn-backColor"]`).val(defaultBtnConfig.backColor)
    $(`#${wrapperId}  input[name="btn-hoverColor"]`).val(defaultBtnConfig.hoverColor)
    $(`#${wrapperId}  input[name="btn-textColor"]`).val(defaultBtnConfig.textColor)
    $(`#${wrapperId}  input[name="btn-hoverTextColor"]`).val(defaultBtnConfig.hoverTextColor)
    $(`#${wrapperId}  input[name="btn-borderColor"]`).val(defaultBtnConfig.borderColor)
    $(`#${wrapperId}  input[name="btn-hoverBorderColor"]`).val(defaultBtnConfig.hoverBorderColor)
    $(`#${wrapperId}  input[name="btn-borderRadius"]`).val(defaultBtnConfig.borderRadius)

    if (defaultBtnConfig.fontSize) {
        $(`#${wrapperId} input[name="fontSize"]`).val(defaultBtnConfig.fontSize)
    }
    if (defaultBtnConfig.linkType && defaultBtnConfig.link) {
        $('#linkType').val(defaultBtnConfig.linkType)
        if (defaultBtnConfig.linkType === 'hyperlink') {
            $('#linked-element-slide-hyperlink-input').val(defaultBtnConfig.link)
        } else if (defaultBtnConfig.linkType === 'slide_link') {
            $('#linked-element-slide-input').val(defaultBtnConfig.link < 1 ? 1 : defaultBtnConfig.link)
        }
    }
}

function setQuestionDefaultStyles(id, defaultQuestionConfig) {
    $(id).val(defaultQuestionConfig?.fontSize || 26)
}

function setBackgroundDefaultStatus(wrapperId, defaultBackgroundConfig) {
    $(`#${wrapperId}  input[name="backgroundColor"]`).val(defaultBackgroundConfig.backgroundColor)
}

function setInputDefaultStyles(wrapperId, defaultInputConfig) {
    $(`#${wrapperId}  input[name="input-backColor"]`).val(defaultInputConfig.backColor)
    $(`#${wrapperId}  input[name="input-borderColor"]`).val(defaultInputConfig.borderColor)
    $(`#${wrapperId}  input[name="input-textColor"]`).val(defaultInputConfig.textColor)
    $(`#${wrapperId}  input[name="input-borderRadius"]`).val(defaultInputConfig.borderRadius)
    $(`#${wrapperId}  input[name="fontSize"]`).val(defaultInputConfig.fontSize)
}

function setFormDefaultStyles(wrapperId, defaultFormConfig) {
    $(`#${wrapperId}  input[name="form-backColor"]`).val(defaultFormConfig.backColor)
    $(`#${wrapperId}  input[name="form-borderColor"]`).val(defaultFormConfig.borderColor)
    $(`#${wrapperId}  input[name="form-borderRadius"]`).val(defaultFormConfig.borderRadius)
}

function setRangeDefaultStyle(wrapperId, defaultRangeConfig) {
    $(`#${wrapperId}  input[name="range-primaryColor"]`).val(defaultRangeConfig[0].primaryColor)
    $(`#${wrapperId}  input[name="range-pointerColor"]`).val(defaultRangeConfig[1].pointerColor)
    $(`#${wrapperId}  input[name="range-pointerBorderColor"]`).val(defaultRangeConfig[1].pointerBorderColor)
    $(`#${wrapperId}  input[name="range-primaryColor"]`).val(defaultRangeConfig[1].primaryColor)
    $(`#${wrapperId}  input[name="range-textColor"]`).val(defaultRangeConfig[1].optionTextConfig.textColor)
    $(`#${wrapperId}  input[name="range-checkedTextColor"]`).val(defaultRangeConfig[1].optionTextConfig.checkedTextColor)
}

function setDropdownDefaultStyles(wrapperId, defaultDropdownConfig) {
    $(`#${wrapperId}  input[name="dropdownBackgroundColor"]`).val(defaultDropdownConfig.backgroundColor ?? '#ffffff')
    $(`#${wrapperId}  input[name="dropdownFontColor"]`).val(defaultDropdownConfig.fontColor ?? '#000000')
    $(`#${wrapperId}  input[name="dropdownBorderRadius"]`).val(defaultDropdownConfig.borderRadius ?? '4')
    $(`#${wrapperId}  input[name="input-dropdownBorderColor"]`).val(defaultDropdownConfig.borderColor ?? '#ffffff')
    $(`#${wrapperId}  input[name="input-dropdownHoverColor"]`).val(defaultDropdownConfig.hoverColor ?? '#5bc5fa')
    $(`#${wrapperId}  input[name="input-dropdownHoverTextColor"]`).val(defaultDropdownConfig.hoverTextColor ?? '#ffffff')

    $(`#${wrapperId}  input[name="dropdownBackgroundColorValue"]`).val(defaultDropdownConfig.backgroundColor ?? '#ffffff')
    $(`#${wrapperId}  input[name="dropdownFontColorValue"]`).val(defaultDropdownConfig.fontColor ?? '#000000')
    $(`#${wrapperId}  input[name="input-dropdownBorderColorValue"]`).val(defaultDropdownConfig.borderColor ?? '#ffffff')
    $(`#${wrapperId}  input[name="input-dropdownHoverColorValue"]`).val(defaultDropdownConfig.hoverColor ?? '#5bc5fa')
    $(`#${wrapperId}  input[name="input-dropdownHoverTextColorValue"]`).val(defaultDropdownConfig.hoverTextColor ?? '#ffffff')

}

function setQuestionValue(wrapperId, config) {
    $(`#${wrapperId} input[name="question"]`).val(config?.question)
}

function setLabelValue(wrapperId, config) {
    $(`#${wrapperId}`).val(config?.label)
}

function setSubheadingValue(wrapperId, config) {
    $(`#${wrapperId} input[name="subheading"]`).val(config?.subheading)
}

function getBtnConfig(wrapperId) {
    let btnConfig = {
        backColor: "#007bff",
        hoverColor: "#0069d9",
        textColor: "#ffffff",
        hoverTextColor: "#ffffff",
        borderColor: "#007bff",
        hoverBorderColor: "#0062cc",
        borderRadius: "4",
    }

    btnConfig.backColor = $(`#${wrapperId}  input[name="btn-backColor"]`).val()
    btnConfig.hoverColor = $(`#${wrapperId}  input[name="btn-hoverColor"]`).val()
    btnConfig.textColor = $(`#${wrapperId}  input[name="btn-textColor"]`).val()
    btnConfig.hoverTextColor = $(`#${wrapperId}  input[name="btn-hoverTextColor"]`).val()
    btnConfig.borderColor = $(`#${wrapperId}  input[name="btn-borderColor"]`).val()
    btnConfig.hoverBorderColor = $(`#${wrapperId}  input[name="btn-hoverBorderColor"]`).val()
    btnConfig.borderRadius = $(`#${wrapperId}  input[name="btn-borderRadius"]`).val()
    btnConfig.link = null
    btnConfig.linkType = null
    btnConfig.links = null

    return btnConfig
}

function getInputConfig(wrapperId) {
    let inputConfig = {
        backColor: "#ffffff",
        borderColor: "#ced4da",
        textColor: "#495057",
        borderRadius: "4"
    }

    inputConfig.backColor = $(`#${wrapperId}  input[name="input-backColor"]`).val()
    inputConfig.borderColor = $(`#${wrapperId}  input[name="input-borderColor"]`).val()
    inputConfig.textColor = $(`#${wrapperId}  input[name="input-textColor"]`).val()
    inputConfig.borderRadius = $(`#${wrapperId}  input[name="input-borderRadius"]`).val()

    return inputConfig
}

function getFormConfig(wrapperId) {
    let formConfig = {
        backColor: "#e9e9e9",
        borderColor: "#6c757d",
        borderRadius: "10"
    }

    formConfig.backColor = $(`#${wrapperId}  input[name="form-backColor"]`).val()
    formConfig.borderColor = $(`#${wrapperId}  input[name="form-borderColor"]`).val()
    formConfig.borderRadius = $(`#${wrapperId}  input[name="form-borderRadius"]`).val()

    return formConfig
}

function getRangeConfig(wrapperId) {
    let rangeConfig = [
        {
            max: 100,
            min: 0,
            step: 20,
            primaryColor: "#0366d6",
        },
        {
            numberOfOptions: 0,
            options: [],
            pointerColor: "#000000",
            pointerBorderColor: "#ffffff",
            primaryColor: "#6c757d",
            optionTextConfig: {
                textColor: "#6c757d",
                checkedTextColor: "#000000"
            }
        }
    ]

    rangeConfig[0].max = $(`#${wrapperId}  input[name="range-max"]`).val()
    rangeConfig[0].min = $(`#${wrapperId}  input[name="range-min"]`).val()
    rangeConfig[0].step = $(`#${wrapperId}  input[name="range-step"]`).val()
    rangeConfig[0].primaryColor = $(`#${wrapperId}  input[name="range-primaryColor"]`).val()

    rangeConfig[1].pointerColor = $(`#${wrapperId}  input[name="range-pointerColor"]`).val()
    rangeConfig[1].pointerBorderColor = $(`#${wrapperId}  input[name="range-pointerBorderColor"]`).val()
    rangeConfig[1].primaryColor = $(`#${wrapperId}  input[name="range-primaryColor"]`).val()
    rangeConfig[1].optionTextConfig.textColor = $(`#${wrapperId}  input[name="range-textColor"]`).val()
    rangeConfig[1].optionTextConfig.checkedTextColor = $(`#${wrapperId}  input[name="range-checkedTextColor"]`).val()

    return rangeConfig
}

function getDeserializedDataFromLS(key) {
    const data = localStorage.getItem(key)
    if (!data) return null
    return JSON.parse(data)
}

function getDefaultStyles(key) {
    const styles = getDeserializedDataFromLS('default_styles')?.[key]
    if (!styles) return null
    return JSON.parse(styles)
}

const dbFields = {
    MULTIPLY_CHOICE: 'multiple_choice_default_styles',
    RANGE_SELECTOR: 'range_selector_default_styles',
    CUSTOMER_DETAIL: 'customer_details_default_styles',
    CALCULATOR: 'calculator_default_styles',
    BUTTON: 'button_default_styles',
    OPEN_FIELD: 'open_field_default_styles',
    DATE_FIELD: 'date_field_default_styles',
}
