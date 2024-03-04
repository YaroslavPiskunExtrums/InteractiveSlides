function getTextConfig(wrapperId) {
    let textConfig = {
        textColor: "#000000",
        fontIndex: 0
    };

    textConfig.textColor = $(`#${wrapperId}  input[name="textColor"]`).val();
    textConfig.fontIndex = $(`#${wrapperId}  select[name="fontIndex"]`).val();
    return textConfig;
}

function getBtnConfig(wrapperId) {
    let btnConfig = {
        backColor: "#007bff",
        hoverColor: "#0069d9",
        textColor: "#ffffff",
        hoverTextColor: "#ffffff",
        borderColor: "#007bff",
        hoverBorderColor: "#0062cc",
        borderRadius: "4"
    };

    btnConfig.backColor = $(`#${wrapperId}  input[name="btn-backColor"]`).val();
    btnConfig.hoverColor = $(`#${wrapperId}  input[name="btn-hoverColor"]`).val();
    btnConfig.textColor = $(`#${wrapperId}  input[name="btn-textColor"]`).val();
    btnConfig.hoverTextColor = $(`#${wrapperId}  input[name="btn-hoverTextColor"]`).val();
    btnConfig.borderColor = $(`#${wrapperId}  input[name="btn-borderColor"]`).val();
    btnConfig.hoverBorderColor = $(`#${wrapperId}  input[name="btn-hoverBorderColor"]`).val();
    btnConfig.borderRadius = $(`#${wrapperId}  input[name="btn-borderRadius"]`).val();
    return btnConfig;
}

function getBackgroundConfig(wrapperId) {
  console.log("GETTING BACKGROUND CONFIG",wrapperId)

  let backgroundConfig = {
    backgroundColor: "#ffffff",
  }
  backgroundConfig.backgroundColor = $(`#${wrapperId}  input[name="backgroundColor"]`).val();

  return backgroundConfig;
}

function getInputConfig(wrapperId) {
    let inputConfig = {
        backColor: "#ffffff",
        borderColor: "#ced4da",
        textColor: "#495057",
        borderRadius: "4"
    };

    inputConfig.backColor = $(`#${wrapperId}  input[name="input-backColor"]`).val();
    inputConfig.borderColor = $(`#${wrapperId}  input[name="input-borderColor"]`).val();
    inputConfig.textColor = $(`#${wrapperId}  input[name="input-textColor"]`).val();
    inputConfig.borderRadius = $(`#${wrapperId}  input[name="input-borderRadius"]`).val();

    return inputConfig;
}

function getFormConfig(wrapperId) {
    let formConfig = {
        backColor: "#e9e9e9",
        borderColor: "#6c757d",
        borderRadius: "10"
    };

    formConfig.backColor = $(`#${wrapperId}  input[name="form-backColor"]`).val();
    formConfig.borderColor = $(`#${wrapperId}  input[name="form-borderColor"]`).val();
    formConfig.borderRadius = $(`#${wrapperId}  input[name="form-borderRadius"]`).val();

    return formConfig;
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
    ];

    rangeConfig[0].max = $(`#${wrapperId}  input[name="range-max"]`).val();
    rangeConfig[0].min = $(`#${wrapperId}  input[name="range-min"]`).val();
    rangeConfig[0].step = $(`#${wrapperId}  input[name="range-step"]`).val();
    rangeConfig[0].primaryColor = $(`#${wrapperId}  input[name="range-primaryColor"]`).val();

    rangeConfig[1].pointerColor = $(`#${wrapperId}  input[name="range-pointerColor"]`).val();
    rangeConfig[1].pointerBorderColor = $(`#${wrapperId}  input[name="range-pointerBorderColor"]`).val();
    rangeConfig[1].primaryColor = $(`#${wrapperId}  input[name="range-primaryColor"]`).val();
    rangeConfig[1].optionTextConfig.textColor = $(`#${wrapperId}  input[name="range-textColor"]`).val();
    rangeConfig[1].optionTextConfig.checkedTextColor = $(`#${wrapperId}  input[name="range-checkedTextColor"]`).val();
    
    return rangeConfig;
}
