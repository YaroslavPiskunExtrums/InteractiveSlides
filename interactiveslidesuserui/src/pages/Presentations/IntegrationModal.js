import {Modal, ModalBody, Row, Col, Button} from "reactstrap";

const IntegrationModal = ({
                    onAdd,
                    onClose,
                    items,
                    onItemChange,
                    show,
                    properties,
                    renderProperties,
                    onAddContactField,
                    onEditField,
                    onEditCustomField,
                    onDeleteField,
                    onAddCompanyField,
                    onAddDealField,
                    defaultProperties
                  }) => {
  return (
    <Modal size={"lg"} fade={true} isOpen={show} toggle={onClose} centered={true}>
      <ModalBody className="py-3 px-5">
        <div className="mt-2 text-center">
          <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <h4>Integrations</h4>
          </div>
        </div>
        <div className={"mb-3"}>
          <p className="text-muted mb-2">
            Select integration
          </p>
          <select className={"form-select"}>
            <option>Hubspot</option>
          </select>
        </div>
        <div>
          <div className="mt-4 mb-4 pt-2 fs-15">
            <h4>Contact Settings</h4>
          </div>
          <div className={"mb-4"}>
            <div className={"d-flex align-items-center"}>
              <Button onClick={onAddContactField} color={"primary"}>Add</Button>
            </div>
          </div>
          {
            renderProperties.contact.map((property, index) => {
              return (
                property.name === "custom_field_contact" || property?.custom ?
                  <Row key={index} className={"mb-3"}>
                    <Col xs={4}>
                      <select
                        className={"form-select"}
                        defaultValue={property.name}
                        onChange={(e) => onEditField("contact", {name: e.target.value, label: e.target.value}, index)}
                      >
                        {properties.contact.map((item, index) => <option key={index}
                                                                         value={item.name}>{item.label}</option>)}
                      </select>
                    </Col>
                    <Col xs={3}>
                      <div className={"d-flex align-items-center"}>
                        <input placeholder={"Custom name"}
                               onChange={e => onEditCustomField("contact", e.target.value, index)} type={"text"}
                               className={"form-control"}/>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className={"d-flex align-items-center"}>
                        <select
                          onChange={(e) => onItemChange("contact", e.target.value, index)}
                          className={"form-select"}>
                          {items.map((item, index) => <option key={index} value={item.id}>{item.text}</option>)}
                        </select>
                      </div>
                    </Col>
                    <Col xs={1}>
                      {
                        property.name !== 'firstname' || property.name !== 'lastname' ?
                          <Button onClick={() => onDeleteField("contact", index)} color={"danger"}>
                            <i className="ri-delete-bin-6-line"></i>
                          </Button>
                          :
                          <></>
                      }
                    </Col>
                  </Row>
                  :
                  <Row key={index} className={"mb-3"}>
                    <Col xs={6}>
                      <select
                        className={"form-select"}
                        defaultValue={property.name}
                        onChange={(e) => onEditField("contact", {name: e.target.value, label: e.target.value}, index)}

                      >
                        {properties.contact.map((item, index) => <option key={index}
                                                                         value={item.name}>{item.label}</option>)}
                      </select>
                    </Col>
                    <Col xs={5}>
                      <div className={"d-flex align-items-center"}>
                        <select
                          defaultValue={defaultProperties.contact[index].id}
                          onChange={(e) => onItemChange("contact", e.target.value, index)}
                          className={"form-select"}>
                          {items.map((item, index) => <option key={index} value={item.id}>{item.text}</option>)}
                        </select>
                      </div>
                    </Col>
                    <Col xs={1}>
                      {
                        property.name === 'firstname' || property.name === 'lastname' ?
                          <></>
                          :
                          <Button onClick={() => onDeleteField("contact", index)} color={"danger"}>
                            <i className="ri-delete-bin-6-line"></i>
                          </Button>
                      }
                    </Col>
                  </Row>
              )
            })
          }

          <div className="mt-4 pt-2 mb-4 fs-15">
            <h4>Company Settings</h4>
          </div>
          <div className={"mb-4"}>
            <div className={"d-flex align-items-center"}>
              <Button onClick={onAddCompanyField} color={"primary"}>Add</Button>
            </div>
          </div>
          {
            renderProperties.company.map((property, index) => {
              return (
                property.name === "custom_field_company" || property?.custom ?
                  <Row key={index} className={"mb-3"}>
                    <Col xs={4}>
                      <select
                        className={"form-select"}
                        defaultValue={property.name}
                        onChange={(e) => onEditField("company", {name: e.target.value, label: e.target.value}, index)}
                      >
                        {properties.company.map((item, index) => <option key={index}
                                                                         value={item.name}>{item.label}</option>)}
                      </select>
                    </Col>
                    <Col xs={3}>
                      <div className={"d-flex align-items-center"}>
                        <input placeholder={"Custom name"}
                               onChange={e => onEditCustomField("company", e.target.value, index)} type={"text"}
                               className={"form-control"}/>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className={"d-flex align-items-center"}>
                        <select
                          onChange={(e) => onItemChange("company", e.target.value, index)}
                          className={"form-select"}>
                          {items.map((item, index) => <option key={index} value={item.id}>{item.text}</option>)}
                        </select>
                      </div>
                    </Col>
                    <Col xs={1}>
                      <Button onClick={() => onDeleteField("company", index)} color={"danger"}>
                        <i className="ri-delete-bin-6-line"></i>
                      </Button>
                    </Col>
                  </Row>
                  :
                  <Row key={index} className={"mb-3"}>
                    <Col xs={6}>
                      <select
                        className={"form-select"}
                        defaultValue={property.name}
                        onChange={(e) => onEditField("company", {name: e.target.value, label: e.target.value}, index)}
                      >
                        {properties.company.map((item, index) => <option key={index}
                                                                         value={item.name}>{item.label}</option>)}
                      </select>
                    </Col>
                    <Col xs={5}>
                      <div className={"d-flex align-items-center"}>
                        <select
                          onChange={(e) => onItemChange("company", e.target.value, index)}
                          defaultValue={defaultProperties.company[index].id}
                          className={"form-select"}>
                          {items.map((item, index) => <option key={index} value={item.id}>{item.text}</option>)}
                        </select>
                      </div>
                    </Col>
                    <Col xs={1}>
                      {
                        property.name === 'name' ?
                          <></>
                          :
                          <Button onClick={() => onDeleteField("company", index)} color={"danger"}>
                            <i className="ri-delete-bin-6-line"></i>
                          </Button>
                      }
                    </Col>
                  </Row>
              )
            })
          }


          <div className="mt-4 pt-2 mb-4 fs-15">
            <h4>Deals Settings</h4>
          </div>
          <div className={"mb-4"}>
            <div className={"d-flex align-items-center"}>
              <Button onClick={onAddDealField} color={"primary"}>Add</Button>
            </div>
          </div>
          {
            renderProperties.deals.map((property, index) => {
              return (
                property.name === "custom_field_deals" || property?.custom ?
                  <Row key={index} className={"mb-3"}>
                    <Col xs={4}>
                      <select
                        className={"form-select"}
                        defaultValue={property.name}
                        onChange={(e) => onEditField("deals", {name: e.target.value, label: e.target.value}, index)}
                      >
                        {properties.deals.map((item, index) => <option key={index}
                                                                       value={item.name}>{item.label}</option>)}
                      </select>
                    </Col>
                    <Col xs={3}>
                      <div className={"d-flex align-items-center"}>
                        <input placeholder={"Custom name"}
                               onChange={e => onEditCustomField("deals", e.target.value, index)} type={"text"}
                               className={"form-control"}/>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className={"d-flex align-items-center"}>
                        <select
                          onChange={(e) => onItemChange("deals", e.target.value, index)}
                          className={"form-select"}>
                          {items.map((item, index) => <option key={index} value={item.id}>{item.text}</option>)}
                        </select>
                      </div>
                    </Col>
                    <Col xs={1}>
                      <Button onClick={() => onDeleteField("deals", index)} color={"danger"}>
                        <i className="ri-delete-bin-6-line"></i>
                      </Button>
                    </Col>
                  </Row>
                  :
                  <Row key={index} className={"mb-3"}>
                    <Col xs={6}>
                      <select
                        className={"form-select"}
                        defaultValue={property.name}
                        onChange={(e) => onEditField("deals", {name: e.target.value, label: e.target.value}, index)}
                      >
                        {properties.deals.map((item, index) => <option key={index}
                                                                       value={item.name}>{item.label}</option>)}
                      </select>
                    </Col>
                    <Col xs={5}>
                      <div className={"d-flex align-items-center"}>
                        <select
                          defaultValue={defaultProperties.deals[index].id}
                          onChange={(e) => onItemChange("deals", e.target.value, index)}
                          className={"form-select"}>
                          {items.map((item, index) => <option key={index} value={item.id}>{item.text}</option>)}
                        </select>
                      </div>
                    </Col>
                    <Col xs={1}>
                      {
                        property.name !== 'dealname' || property.name !== "pipeline" || property.name !== "dealstage" ?
                          <></>
                          :
                          <Button onClick={() => onDeleteField("deals", index)} color={"danger"}>
                            <i className="ri-delete-bin-6-line"></i>
                          </Button>
                      }
                    </Col>
                  </Row>
              )
            })
          }

        </div>
        <div className="d-flex gap-4 justify-content-center mt-4 mb-2">
          <button
            type="button"
            className="btn w-sm btn-outline-danger"
            data-bs-dismiss="modal"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn w-sm btn-success"
            id="delete-record"
            onClick={onAdd}
          >
            Add
          </button>
        </div>
      </ModalBody>
    </Modal>

  )
}
export default IntegrationModal

