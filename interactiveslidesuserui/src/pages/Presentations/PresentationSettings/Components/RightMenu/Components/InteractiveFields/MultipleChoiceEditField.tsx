import { Button, Col, Row } from 'reactstrap'
import React, { ChangeEvent, useState } from 'react'
import { Controller, useController, useFieldArray, useFormContext } from 'react-hook-form'
import { IForm } from '../../right-menu.types'
import './multiple-choice.style.scss'
import { fontFamilyList } from 'src/lib/constants/fontFamily'

const MultipleChoiceEditField = () => {
  const { control, getValues, setValue, watch } = useFormContext<IForm>()
  const { append, remove, fields } = useFieldArray({ control: control, name: 'answers' })
  const { field: linksFields } = useController({ control, name: 'btnConfig.links' })

  const [viewType, setViewType] = useState(getValues('view') || 'dropdown-list')
  const [isLink, setIsLink] = useState<boolean>(getValues('btnConfig.linkType') ? true : false)

  const [isShowLink, setIsShowLink] = useState(getValues('view') !== 'multiple-selector')
  const onChangeLinks = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setIsLink(checked)
    if (checked) {
      const answer = getValues('answers') ?? []
      setValue(
        'btnConfig.links',
        answer.map((_) => '')
      )
      setValue('btnConfig.linkType', 'slide_link')

      return
    }
    setValue('btnConfig.links', null)
    setValue('btnConfig.linkType', null)
  }

  const onAddField = () => {
    append({ label: '', value: '' })

    if (isLink) {
      setValue('btnConfig.links', [...linksFields.value, ''])
    }
  }

  const onRemoveField = () => {
    const indexElForRemove = getValues('answers')?.length
    remove(indexElForRemove - 1)

    if (isLink) {
      const values = getValues('btnConfig.links') ?? []
      if (!values.length) return
      values.length -= 1
      setValue('btnConfig.links', values)
    }
  }

  return (
    <div className={'right-menu_body_element-type mb-3'}>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Question</h5>
        <Controller
          name="question"
          control={control}
          render={({ field: { value, onChange } }) => (
            <input value={value ?? ''} onChange={onChange} className={'form-control'} />
          )}
        />
      </div>

      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Answers</h5>

        {fields?.map((answer, ind) => {
          return (
            <div
              key={answer.id}
              className={'right-menu_body_element-type mb-3 gap-3 d-flex align-items-center'}
            >
              <Controller
                name={`answers.${ind}.label`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <input value={value} onChange={onChange} className={'form-control'} type="text" />
                )}
              />
            </div>
          )
        })}
      </div>
      <Button onClick={onAddField} className={'w-100 mb-1'}>
        Add field
      </Button>
      <Button onClick={onRemoveField} color={'danger'} className={'w-100 mb-3'}>
        Remove field
      </Button>

      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Label</h5>
        <Controller
          name="label"
          control={control}
          render={({ field: { onChange, value } }) => (
            <input className={'form-control'} value={value ?? ''} onChange={onChange} />
          )}
        />
      </div>
      {isShowLink && (
        <div className={'right-menu_body_element-type mb-3'}>
          <label htmlFor="checkbox_link" style={{ display: 'inline-flex', gap: '10px' }}>
            <input id="checkbox_link" type="checkbox" onChange={onChangeLinks} checked={isLink} />
            Is link
          </label>
        </div>
      )}
      {isLink && (
        <div className={'right-menu_body_element-type mb-3'}>
          <h5>Links</h5>

          {linksFields.value?.map((_, ind) => {
            return (
              <div
                key={ind}
                className={'right-menu_body_element-type mb-3 gap-3 d-flex align-items-center'}
              >
                <Controller
                  name={`btnConfig.links.${ind}`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <input
                      value={value}
                      onChange={onChange}
                      className={'form-control'}
                      type="text"
                    />
                  )}
                />
              </div>
            )
          })}
        </div>
      )}
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Question style settings</h5>
        <div className={'d-flex gap-2'}>
          <div className={'right-menu_body_element-type flex-1 mb-2'}>
            <h6>Question font size</h6>
            <Controller
              name="questionConfig.fontSize"
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  className={'form-control'}
                  type="number"
                  value={value ?? ''}
                  onChange={onChange}
                />
              )}
            />
          </div>
        </div>
        <div className={'right-menu_body_element-type mb-2'}>
          <h6>Text color</h6>
          <Controller
            name="textConfig.textColor"
            control={control}
            render={({ field: { onChange, value } }) => (
              <input
                value={value ?? '#000000'}
                onChange={onChange}
                className={'form-control'}
                type="color"
              />
            )}
          />
        </div>
        <div className={'right-menu_body_element-type mb-3'}>
          <h5>Select View</h5>
          <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
            <Controller
              name="view"
              control={control}
              render={({ field: { onChange, value } }) => (
                <select
                  className={'form-select'}
                  onChange={(e) => {
                    onChange(e.target.value)
                    const view = getValues('view') || 'dropdown-list'
                    setViewType(view)
                    setIsShowLink(e.target.value !== 'multiple-selector')
                  }}
                  value={value ?? 'dropdown-list'}
                >
                  <option value={'dropdown-list'}>Dropdown List</option>
                  <option value={'button-list'}>Buttons List</option>
                  <option value={'multiple-selector'}>Multiple selector</option>
                </select>
              )}
            />
          </div>
        </div>
        {viewType === 'dropdown-list' || viewType === 'multiple-selector' ? (
          <div>
            <h5>Dropdown Settings</h5>
            <div className="dropdown-list_settings">
              <div
                className={
                  'right-menu_body_element-type flex-1 text-center mb-2 dropdown-list_settings_item'
                }
              >
                <Controller
                  name="dropdownConfig.backgroundColor"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <input
                      onChange={onChange}
                      value={value ?? '#ffffff'}
                      className={'form-control'}
                      type="color"
                    />
                  )}
                />

                <h6>Background color</h6>
              </div>
              <div
                className={
                  'right-menu_body_element-type flex-1 text-center mb-2 dropdown-list_settings_item'
                }
              >
                <Controller
                  name="dropdownConfig.fontColor"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <input
                      onChange={onChange}
                      value={value ?? '#000000'}
                      className={'form-control'}
                      type="color"
                    />
                  )}
                />
                <h6>Font color</h6>
              </div>
              <div
                className={
                  'right-menu_body_element-type flex-1 text-center mb-2 dropdown-list_settings_item'
                }
              >
                <Controller
                  name="dropdownConfig.hoverColor"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    console.log(value)
                    return (
                      <input
                        onChange={onChange}
                        value={value ?? '#5bc5fa'}
                        className={'form-control'}
                        type="color"
                      />
                    )
                  }}
                />
                <h6>Hover background color</h6>
              </div>
              <div
                className={
                  'right-menu_body_element-type flex-1 text-center mb-2 dropdown-list_settings_item'
                }
              >
                <Controller
                  name="dropdownConfig.hoverTextColor"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <input
                      onChange={onChange}
                      value={value ?? '#ffffff'}
                      className={'form-control'}
                      type="color"
                    />
                  )}
                />
                <h6>Hover text color</h6>
              </div>
              <div className={'right-menu_body_element-type dropdown-list_settings_item'}>
                <Controller
                  name="dropdownConfig.borderColor"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <input
                      onChange={onChange}
                      value={value ?? '#ffffff'}
                      className={'form-control'}
                      type="color"
                    />
                  )}
                />
                <h6>Border color</h6>
              </div>
            </div>

            <div className={'right-menu_body_element-type flex-1 mb-2'}>
              <h6>Border radius</h6>
              <Controller
                name="dropdownConfig.borderRadius"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <input
                    value={value ?? '4'}
                    onChange={onChange}
                    className={'form-control'}
                    type="number"
                  />
                )}
              />
            </div>
          </div>
        ) : (
          <div>
            <h5>Button Config</h5>
            <Row className={'mb-2'}>
              <Col xs={6}>
                <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
                  <Controller
                    name="btnConfig.backColor"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <input
                        value={value ?? '#000000'}
                        className={'form-control'}
                        type="color"
                        onChange={onChange}
                      />
                    )}
                  />
                  <h6>Background color</h6>
                </div>
                <div className={'right-menu_body_element-type  flex-1 text-center mb-2'}>
                  <Controller
                    name="btnConfig.borderColor"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <input
                        value={value ?? '#000000'}
                        className={'form-control'}
                        type="color"
                        onChange={onChange}
                      />
                    )}
                  />
                  <h6>Border color</h6>
                </div>
                <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
                  <Controller
                    name="btnConfig.textColor"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <input
                        value={value ?? '#000000'}
                        className={'form-control'}
                        type="color"
                        onChange={onChange}
                      />
                    )}
                  />
                  <h6>Text color</h6>
                </div>
              </Col>
              <Col xs={6}>
                <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
                  <Controller
                    name="btnConfig.hoverColor"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <input
                        value={value ?? '#000000'}
                        className={'form-control'}
                        type="color"
                        onChange={onChange}
                      />
                    )}
                  />
                  <h6>Hover color</h6>
                </div>
                <div className={'right-menu_body_element-type  flex-1 text-center mb-2'}>
                  <Controller
                    name="btnConfig.hoverBorderColor"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <input
                        value={value ?? '#000000'}
                        onChange={onChange}
                        className={'form-control'}
                        type="color"
                      />
                    )}
                  />
                  <h6>Hover border color</h6>
                </div>
                <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
                  <Controller
                    name="btnConfig.hoverTextColor"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <input
                        value={value ?? '#000000'}
                        className={'form-control'}
                        type="color"
                        onChange={onChange}
                      />
                    )}
                  />
                  <h6>Hover text color</h6>
                </div>
              </Col>
            </Row>
            <div className={'right-menu_body_element-type mb-2'}>
              <h6>Border radius</h6>
              <Controller
                name="btnConfig.borderRadius"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <input
                    value={value ?? ''}
                    className={'form-control'}
                    type="number"
                    onChange={onChange}
                  />
                )}
              />
            </div>
          </div>
        )}
      </div>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Text Style Settings</h5>
        <div className={'right-menu_body_element-type flex-1 mb-2'}>
          <h6>Text size</h6>
          <Controller
            name="textConfig.fontSize"
            control={control}
            render={({ field: { onChange, value } }) => (
              <input
                value={value ?? ''}
                onChange={onChange}
                className={'form-control'}
                type="number"
              />
            )}
          />
        </div>
        <div className={'right-menu_body_element-type flex-1 mb-2'}>
          <h6>Font family</h6>
          <Controller
            name="textConfig.fontIndex"
            control={control}
            render={({ field: { onChange, value } }) => (
              <select value={value ?? '0'} onChange={onChange} className={'form-select'}>
                {fontFamilyList.map(({ name, value }) => (
                  <option key={value} value={value}>
                    {name}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
      </div>
      <div className={'right-menu_body_element-type mb-3'}>
        <h5>Background Settings</h5>
        <div className={'right-menu_body_element-type flex-1 text-center mb-2'}>
          <Controller
            name="backgroundConfig.backgroundColor"
            control={control}
            render={({ field: { onChange, value } }) => (
              <input
                value={value ?? '#000000'}
                onChange={onChange}
                className={'form-control'}
                type="color"
              />
            )}
          />
          <h6>Background Color</h6>
        </div>
      </div>
    </div>
  )
}

export default MultipleChoiceEditField
