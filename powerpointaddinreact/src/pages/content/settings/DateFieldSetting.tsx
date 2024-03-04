import { DateFieldDefaultStylesType } from '@/types/defaultStyles/defaultStyleConfigs.types'
import { DateFieldSettingsType } from '@/types/figures/dateField.types'
import Label from '@components/content/label/Label'
import SettingBtn from '@components/content/settingBtn/SettingBtn'
import SettingInput from '@components/content/settingInput/SettingInput'
import SettingLayout from '@components/content/settingLayout/SettingLayout'
import SettingSelect from '@components/content/settingSelect/settingSelect'
import SubTitle from '@components/content/subTitle/SubTitle'
import { FiguresEnum, fontFamilies } from '@lib/constants/figures.constants'
import { inputStyleSettingList } from '@lib/constants/setting.constants'
import { useResetConfig } from '@lib/hooks/useResetConfig'
import { ContentRoutesList } from '@lib/routes/routes.enum'
import { getSavedConfig, saveConfigToOfficeSettings } from '@lib/utils/addin'
import { saveLabelToList } from '@lib/utils/saveLabelToList'
import { useConfig } from '@store/config.store'
import { useDefaultStyles } from '@store/defaultStyles.store'
import { useRoute } from '@store/routing.store'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

const DateFieldSetting = () => {
  const { setConfig } = useConfig()
  const { setHash } = useRoute()

  const { control, reset, watch } = useForm<DateFieldSettingsType>({
    defaultValues: {
      figureType: FiguresEnum.dateField,
      label: '',
      question: '',
      backgroundConfig: {
        backgroundColor: '#ffffff',
      },
      inputConfig: {
        backColor: '#ffffff',
        borderColor: '#ced4da',
        borderRadius: 4,
        fontSize: 16,
        textColor: '#495057',
      },
      questionConfig: {
        fontSize: 22,
      },
      textConfig: {
        fontIndex: fontFamilies[0].value,
        textColor: '#000000',
      },
    },
  })

  useResetConfig({ reset, type: FiguresEnum.dateField })
  const { dateFieldStyles } = useDefaultStyles()

  useEffect(() => {
    if (!dateFieldStyles) {
      return
    }
    if (getSavedConfig()?.figureType === FiguresEnum.dateField) return
    const {
      backgroundConfig: { backgroundColor },
      inputConfig: {
        backColor: inputBackColor,
        borderColor: inputBorderColor,
        borderRadius: inputBorderRadius,
        fontSize: inputFontSize,
        textColor: inputTextColor,
      },
      questionConfig: { fontSize },
      textConfig: { fontIndex, textColor },
    } = JSON.parse(dateFieldStyles) as DateFieldDefaultStylesType

    reset({
      label: '',
      question: '',
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
      questionConfig: {
        fontSize: fontSize ?? 22,
      },
      textConfig: {
        fontIndex: fontIndex ?? fontFamilies[0].value,
        textColor: textColor ?? '#000000',
      },
      figureType: FiguresEnum.dateField,
    })
  }, [dateFieldStyles, reset])

  const onSubmitConfig = () => {
    const data = watch()
    saveLabelToList(data.label)
    saveConfigToOfficeSettings(data)
    setConfig(data)
    setHash(ContentRoutesList.dateFieldFigure.path)
  }

  return (
    <SettingLayout title="Date field">
      <Controller
        control={control}
        name="question"
        render={({ field }) => (
          <SettingInput
            onChange={field.onChange}
            value={field.value}
            placeholder="Type your question"
          />
        )}
      />
      <SettingBtn btnTitle="Add to presentation" clickHandler={onSubmitConfig} />
      <SubTitle>Select label</SubTitle>
      <Controller
        control={control}
        name="label"
        render={({ field }) => <Label onChange={field.onChange} value={field.value} />}
      />
      <SubTitle>Question style settings</SubTitle>
      <Controller
        control={control}
        name="questionConfig.fontSize"
        render={({ field }) => (
          <SettingInput
            onChange={field.onChange}
            value={field.value}
            type="number"
            label={{ id: 'questionFontSize', text: 'Question font size' }}
          />
        )}
      />
      <SubTitle>Input style settings</SubTitle>
      {inputStyleSettingList.map((item) => (
        <Controller
          control={control}
          name={item.name}
          key={item.name}
          render={({ field }) => (
            <SettingInput
              onChange={field.onChange}
              value={field.value}
              type={item.type}
              label={item.label}
              labelDisplay={item.labelDisplay}
              labelWidth={item.labelWidth}
            />
          )}
        />
      ))}
      <SubTitle>Text Style Settings</SubTitle>
      <Controller
        control={control}
        name="textConfig.textColor"
        render={({ field }) => (
          <SettingInput
            onChange={field.onChange}
            value={field.value}
            label={{ id: 'textColor', text: 'Text color' }}
            type="color"
            labelDisplay="inline-block"
            labelWidth="45%"
          />
        )}
      />
      <Controller
        control={control}
        name="textConfig.fontIndex"
        render={({ field }) => (
          <SettingSelect
            onChange={field.onChange}
            value={field.value}
            selectId="fontFamily"
            options={fontFamilies}
            smallLabel={true}
            label="Font family"
          />
        )}
      />
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

export default DateFieldSetting
