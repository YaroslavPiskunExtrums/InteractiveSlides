import { OpenFieldDefaultStylesType } from '@/types/defaultStyles/defaultStyleConfigs.types'
import { OpenFieldSettingsType } from '@/types/figures/openField.types'
import Label from '@components/content/label/Label'
import SettingBtn from '@components/content/settingBtn/SettingBtn'
import SettingInput from '@components/content/settingInput/SettingInput'
import SettingLayout from '@components/content/settingLayout/SettingLayout'
import SettingSelect from '@components/content/settingSelect/settingSelect'
import SubTitle from '@components/content/subTitle/SubTitle'
import { FiguresEnum, fontFamilies, openFieldType } from '@lib/constants/figures.constants'
import { inputStyleSettingList, settingsDataList } from '@lib/constants/setting.constants'
import { useResetConfig } from '@lib/hooks/useResetConfig'
import { ContentRoutesList } from '@lib/routes/routes.enum'
import { getSavedConfig, saveConfigToOfficeSettings } from '@lib/utils/addin'
import { capitalizeFirstLetter } from '@lib/utils/capitalizeFirstLetter'
import { saveLabelToList } from '@lib/utils/saveLabelToList'
import { useConfig } from '@store/config.store'
import { useDefaultStyles } from '@store/defaultStyles.store'
import { useRoute } from '@store/routing.store'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

const OpenFieldSetting = () => {
  const { setConfig } = useConfig()
  const { setHash } = useRoute()

  const { control, reset, watch } = useForm<OpenFieldSettingsType>({
    defaultValues: {
      figureType: FiguresEnum.openField,
      type: openFieldType.input,
      label: '',
      question: '',
      subheading: '',
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

  useResetConfig({ reset, type: FiguresEnum.openField })
  const { openFieldStyles } = useDefaultStyles()

  useEffect(() => {
    if (!openFieldStyles) {
      return
    }
    if (getSavedConfig()?.figureType === FiguresEnum.openField) return
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
    } = JSON.parse(openFieldStyles) as OpenFieldDefaultStylesType

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
      figureType: FiguresEnum.openField,
      subheading: '',
      type: openFieldType.input,
    })
  }, [openFieldStyles, reset])

  const onSubmitConfig = () => {
    const data = watch()
    saveLabelToList(data.label)
    saveConfigToOfficeSettings(data)
    setConfig(data)
    setHash(ContentRoutesList.openFieldFigure.path)
  }
  return (
    <SettingLayout title="Open field">
      {settingsDataList.reduce<JSX.Element[]>((acc, rec) => {
        if (rec.name === 'equation') return acc
        return [
          ...acc,
          <Controller
            control={control}
            key={rec.name}
            name={rec.name}
            render={({ field }) => (
              <SettingInput
                onChange={field.onChange}
                value={field.value}
                placeholder={rec.placeholder}
              />
            )}
          />,
        ]
      }, [])}
      <SettingBtn btnTitle="Add to presentation" clickHandler={onSubmitConfig} />
      <SubTitle>Select label</SubTitle>
      <Controller
        control={control}
        name="label"
        render={({ field }) => <Label onChange={field.onChange} value={field.value} />}
      />
      <SubTitle>Question Style Settings</SubTitle>
      <Controller
        control={control}
        name="questionConfig.fontSize"
        render={({ field }) => (
          <SettingInput
            onChange={field.onChange}
            value={field.value}
            label={{ id: 'openFieldQuestionFontSize', text: 'Question font size' }}
            type="number"
          />
        )}
      />
      <SubTitle>Input Style Settings</SubTitle>
      {inputStyleSettingList.map((item) => (
        <Controller
          control={control}
          key={item.name}
          name={item.name}
          render={({ field }) => (
            <SettingInput {...item} onChange={field.onChange} value={field.value} />
          )}
        />
      ))}
      <Controller
        control={control}
        name={'type'}
        render={({ field }) => (
          <SettingSelect
            onChange={field.onChange}
            value={field.value}
            options={Object.values(openFieldType).map((type, index) => ({
              id: index,
              value: type,
              label: capitalizeFirstLetter(type),
            }))}
            selectId="openFieldType"
            label='Input type'
            smallLabel
          />
        )}
      />
      <SubTitle>Text Style Settings</SubTitle>
      <Controller
        control={control}
        name="textConfig.textColor"
        render={({ field }) => (
          <SettingInput
            onChange={field.onChange}
            value={field.value}
            label={{ id: 'openFieldTextColor', text: 'Text color' }}
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
            selectId="fontFamily"
            options={fontFamilies}
            onChange={field.onChange}
            value={field.value}
            smallLabel
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
export default OpenFieldSetting
