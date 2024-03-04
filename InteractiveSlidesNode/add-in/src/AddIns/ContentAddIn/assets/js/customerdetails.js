function addCustomerDetails(customerDetailsConfig) {
  let backgroundConfig = {
    backgroundColor: '#ffffff',
  }

  customerDetailsConfig.fullName = $('#customerDetailsContent input[name="fullName"]').val()
  customerDetailsConfig.email = $('#customerDetailsContent input[name="email"]').val()
  customerDetailsConfig.phone = $('#customerDetailsContent input[name="phone"]').val()
  customerDetailsConfig.business = $('#customerDetailsContent select[name="business"]').val()
  customerDetailsConfig.textMessage = $('#customerDetailsContent textarea[name="textMessage"]').val()

  backgroundConfig.backgroundColor = $(`#customerDetailsContent input[name="backgroundColor"]`).val()
  customerDetailsConfig.backgroundConfig = { ...backgroundConfig }


  let additionalFieldCount = $('#customer-details-additional-field-wrapper').children().length
  customerDetailsConfig.additionalFields = []
  for (let i = 0; i < additionalFieldCount; i++) {
    customerDetailsConfig.additionalFields[i] = $(`#customerDetailsContent input[name="additional-field-${i}"]`).val()
  }

  customerDetailsConfig.inputConfig = getInputConfig('customerDetailsContent')
  customerDetailsConfig.inputConfig.fontSize = $('#text-size-customer-details').val()


  customerDetailsConfig.formConfig = getFormConfig('customerDetailsContent')

  customerDetailsConfig.label = $('#labels-list-customer-details-input').val()

  if (customerDetailsConfig.label) {
    updateElementsLabels(customerDetailsConfig.label)
  }


  generateCustomerDetailsHTML(customerDetailsConfig)
}

function generateCustomerDetailsHTML(customerDetailsConfig) {
  let customerDetailsHTML =
    `<style>
        #filledPage {
            background-color: ${customerDetailsConfig.backgroundConfig.backgroundColor};
        }
        .customer-details-form {
            border-radius: ${customerDetailsConfig.formConfig.borderRadius}px;
            border: 1px solid ${customerDetailsConfig.formConfig.borderColor};
            background-color: ${customerDetailsConfig.formConfig.backColor};
        }
        .customer-details-input {
            background-color: ${customerDetailsConfig.inputConfig.backColor};
            border-color: ${customerDetailsConfig.inputConfig.borderColor};
            color: ${customerDetailsConfig.inputConfig.textColor};
            border-radius: ${customerDetailsConfig.inputConfig.borderRadius}px;
        }
        #filledPage .customer-details-input {
            font-size: ${customerDetailsConfig.inputConfig?.fontSize}px;
        }
    </style>
    <form class='customer-details-form'>
        <h2>Customer Details</h2>
        <div class='row'>
            <div class='form-group col-md-6'>
                <label for='customer-details-full-name'>Type your full name</label>
                <input type='text' class='customer-details-input form-control' id='customer-details-full-name' value = '${customerDetailsConfig.fullName}'>
            </div>
            <div class='form-group col-md-6'>
                <label for='customer-details-email'>Type your email</label>
                <input type='email' class='customer-details-input form-control' id='customer-details-email' value = '${customerDetailsConfig.email}'>
            </div>
        </div>
        <div class='row'>
            <div class='form-group col-md-6'>
                <label for='customer-details-phone'>Provide your phone number</label>
                <input type='text' class='customer-details-input form-control' id='customer-details-phone' value = '${customerDetailsConfig.phone}'>
            </div>
            <div class='form-group col-md-6'>
                <label for='customer-details-business'>Select your business</label>
                <select class='customer-details-input form-control' id='customer-details-business' value = '${customerDetailsConfig.business}'>
                    <option value='Architecture' ${(customerDetailsConfig.business == 'Architecture') ? 'selected' : ''}>Architecture</option>
                    <option value='Engineering' ${(customerDetailsConfig.business == 'Engineering') ? 'selected' : ''}>Engineering</option>
                </select>
            </div>
        </div>
        <div class='mb-3'>
            <label for='customer-details-message'>Text your message</label>
            <textarea class='customer-details-input form-control' placeholder=''>${customerDetailsConfig.textMessage}</textarea>
        </div>`
  for (let i = 0; i < customerDetailsConfig.additionalFields.length; i++) {
    customerDetailsHTML +=
      `<div class='form-group'>
                <label for='customer-details-additional-field-${i}'>Additional field ${i}</label>
                <input type='text' class='customer-details-input form-control' value = '${customerDetailsConfig.additionalFields[i]}'>
            </div>`
  }
  customerDetailsHTML += `</form>`
  $('#filledPageContent').html(customerDetailsHTML)
}
