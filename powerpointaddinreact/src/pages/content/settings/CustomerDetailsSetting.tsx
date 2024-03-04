import { CustomerDetailsSettingsType } from '@/types/figures/customerDetails.types'
import SettingSelect from '@components/content/settingSelect/settingSelect'
import SettingInput from '@components/content/settingInput/SettingInput'
import { FiguresEnum, business } from '@lib/constants/figures.constants'
import { useConfig } from '@store/config.store'
import { useRoute } from '@store/routing.store'
import { Controller, useForm } from 'react-hook-form'
import SettingTextArea from '@components/content/settingTextArea/SettingTextArea'
import SettingBtn from '@components/content/settingBtn/SettingBtn'
import SubTitle from '@components/content/subTitle/SubTitle'
import Label from '@components/content/label/Label'
import { saveLabelToList } from '@lib/utils/saveLabelToList'
import { getSavedConfig, saveConfigToOfficeSettings } from '@lib/utils/addin'
import { ContentRoutesList } from '@lib/routes/routes.enum'
import { useDefaultStyles } from '@store/defaultStyles.store'
import { useResetConfig } from '@lib/hooks/useResetConfig'
import { useEffect } from 'react'
import { CustomerDetailsDefaultStylesType } from '@/types/defaultStyles/defaultStyleConfigs.types'
import SettingLayout from '@components/content/settingLayout/SettingLayout'
import {
  dataSettings,
  inputStyleSettingList,
  formStyleSettingList,
} from '@lib/constants/setting.constants'

const CustomerDetailsSetting = () => {
  const { setConfig } = useConfig()
  const { setHash } = useRoute()

  const { control, reset, watch, setValue, getValues } = useForm<CustomerDetailsSettingsType>({
    defaultValues: {
      figureType: FiguresEnum.customerDetails,
      fullName: '',
      email: '',
      phone: '',
      label: '',
      textMessage: '',
      additionalFields: [],
      business: business.architecture,
      backgroundConfig: {
        backgroundColor: '#ffffff',
      },
      formConfig: {
        backColor: '#e9e9e9',
        borderColor: '#6c757d',
        borderRadius: 10,
      },
      inputConfig: {
        backColor: '#ffffff',
        borderColor: '#ced4da',
        borderRadius: 4,
        fontSize: 16,
        textColor: '#495057',
      },
    },
  })

  const onAddAdditionalField = () => {
    setValue('additionalFields', [...watch('additionalFields'), ''])
  }

  useResetConfig({ reset, type: FiguresEnum.customerDetails })
  const { customerDetailsStyles } = useDefaultStyles()

  useEffect(() => {
    if (!customerDetailsStyles) {
      return
    }
    if (getSavedConfig()?.figureType === FiguresEnum.customerDetails) return
    const {
      backgroundConfig: { backgroundColor },
      inputConfig: {
        backColor: inputBackColor,
        borderColor: inputBorderColor,
        borderRadius: inputBorderRadius,
        fontSize: inputFontSize,
        textColor: inputTextColor,
      },
      formConfig: {
        backColor: formBackColor,
        borderColor: formBorderColor,
        borderRadius: formBorderRadius,
      },
    } = JSON.parse(customerDetailsStyles) as CustomerDetailsDefaultStylesType

    reset({
      backgroundConfig: {
        backgroundColor: backgroundColor ?? '#ffffff',
      },
      inputConfig: {
        backColor: inputBackColor ?? '#ffffff',
        borderColor: inputBorderColor ?? '#ced4da',
        borderRadius: inputBorderRadius ?? 4,
        fontSize: inputFontSize ?? 16,
        textColor: inputTextColor ?? '#495057',
      },
      formConfig: {
        backColor: formBackColor ?? '#e9e9e9',
        borderColor: formBorderColor ?? '#6c757d',
        borderRadius: formBorderRadius ?? 10,
      },
      additionalFields: [],
      business: business.architecture,
      email: '',
      fullName: '',
      label: '',
      phone: '',
      textMessage: '',
      figureType: FiguresEnum.customerDetails,
    })
  }, [customerDetailsStyles, reset])

  const onSubmitConfig = () => {
    const data = watch()
    saveLabelToList(data.label)
    saveConfigToOfficeSettings(data)
    setConfig(data)
    setHash(ContentRoutesList.customerDetailFigure.path)
  }

  return (
    <SettingLayout title="Customer Details">
      {dataSettings.map((settingItem) => (
        <Controller
          key={settingItem.name}
          control={control}
          name={settingItem.name}
          render={({ field }) => {
            if (settingItem.type === 'input') {
              return (
                <SettingInput
                  onChange={field.onChange}
                  value={field.value}
                  placeholder={settingItem.placeholder}
                />
              )
            }
            if (settingItem.type === 'select') {
              return (
                <SettingSelect
                  options={settingItem.options}
                  onChange={field.onChange}
                  value={field.value}
                  selectId={settingItem.name}
                />
              )
            }
            if (settingItem.type === 'textArea') {
              return (
                <SettingTextArea
                  onChange={field.onChange}
                  value={field.value}
                  placeholder={settingItem.placeholder}
                />
              )
            }
            return <></>
          }}
        />
      ))}
      {getValues('additionalFields').map((_, index) => (
        <Controller
          control={control}
          name={`additionalFields.${index}`}
          key={index}
          render={({ field }) => (
            <SettingInput
              onChange={field.onChange}
              value={field.value}
              placeholder={`Additional field ${index + 1}`}
              marginBottom="0"
            />
          )}
        />
      ))}
      <SettingBtn btnTitle="Add option" clickHandler={onAddAdditionalField} isShowIcon isAddItem />
      <SettingBtn btnTitle="Add to presentation" clickHandler={onSubmitConfig} />
      <SubTitle>Select label</SubTitle>
      <Controller
        control={control}
        name="label"
        render={({ field }) => <Label onChange={field.onChange} value={field.value} />}
      />
      <SubTitle>Input Style Settings</SubTitle>
      {inputStyleSettingList.map((item) => (
        <Controller
          control={control}
          name={item.name}
          key={item.name}
          render={({ field }) => (
            <SettingInput
              onChange={field.onChange}
              value={field.value}
              label={item.label}
              type={item.type}
              labelDisplay={item.labelDisplay}
              labelWidth={item.labelWidth}
            />
          )}
        />
      ))}
      <SubTitle>Form Style Settings</SubTitle>
      {formStyleSettingList.map((item) => (
        <Controller
          control={control}
          name={item.name}
          key={item.name}
          render={({ field }) => (
            <SettingInput
              onChange={field.onChange}
              value={field.value}
              label={item.label}
              type={item.type}
              labelDisplay={item.labelDisplay}
              labelWidth={item.labelWidth}
            />
          )}
        />
      ))}
      <SubTitle>Background settings</SubTitle>
      <Controller
        control={control}
        name="backgroundConfig.backgroundColor"
        render={({ field }) => (
          <SettingInput
            value={field.value}
            onChange={field.onChange}
            type={'color'}
            label={{ id: 'backgroundColor', text: 'Background color' }}
          />
        )}
      />
    </SettingLayout>
  )
}

export default CustomerDetailsSetting
