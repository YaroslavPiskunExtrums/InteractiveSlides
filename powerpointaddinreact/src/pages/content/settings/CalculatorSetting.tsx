import { CalculatorDefaultStylesType } from '@/types/defaultStyles/defaultStyleConfigs.types'
import { CalculatorSettingsType } from '@/types/figures/calculator.types'
import Label from '@components/content/label/Label'
import SettingSelect from '@components/content/settingSelect/settingSelect'
import SettingBtn from '@components/content/settingBtn/SettingBtn'
import SettingInput from '@components/content/settingInput/SettingInput'
import SubTitle from '@components/content/subTitle/SubTitle'
import { FiguresEnum, fontFamilies } from '@lib/constants/figures.constants'
import { useResetConfig } from '@lib/hooks/useResetConfig'
import { ContentRoutesList } from '@lib/routes/routes.enum'
import { getSavedConfig, saveConfigToOfficeSettings } from '@lib/utils/addin'
import { saveLabelToList } from '@lib/utils/saveLabelToList'
import { useConfig } from '@store/config.store'
import { useDefaultStyles } from '@store/defaultStyles.store'
import { useRoute } from '@store/routing.store'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import SettingLayout from '@components/content/settingLayout/SettingLayout'
import { settingsDataList, inputStyleSettingList } from '@lib/constants/setting.constants'

const CalculatorSetting = () => {
  const { setConfig } = useConfig()
  const { setHash } = useRoute()

  const { control, reset, watch } = useForm<CalculatorSettingsType>({
    defaultValues: {
      figureType: FiguresEnum.calculator,
      label: '',
      question: '',
      subheading: '',
      equation: '',
      backgroundConfig: {
        backgroundColor: '#ffffff',
      },
      questionConfig: {
        fontSize: 22,
      },
      textConfig: {
        fontIndex: fontFamilies[0].value,
        textColor: '#000000',
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

  useResetConfig({ reset, type: FiguresEnum.calculator })
  const { calculatorStyles } = useDefaultStyles()

  useEffect(() => {
    if (!calculatorStyles) {
      return
    }
    if (getSavedConfig()?.figureType === FiguresEnum.calculator) return
    const {
      backgroundConfig: { backgroundColor },
      inputConfig: { backColor, borderColor, borderRadius, fontSize, textColor },
      questionConfig: { fontSize: questionFontSize },
      textConfig: { fontIndex, textColor: textFontColor },
    } = JSON.parse(calculatorStyles) as CalculatorDefaultStylesType

    reset({
      equation: '',
      label: '',
      question: '',
      subheading: '',
      backgroundConfig: {
        backgroundColor: backgroundColor ?? '#ffffff',
      },
      inputConfig: {
        backColor: backColor ?? '#ffffff',
        borderColor: borderColor ?? '#ced4da',
        borderRadius: borderRadius ?? 4,
        fontSize: fontSize ?? 16,
        textColor: textColor ?? '#495057',
      },
      questionConfig: {
        fontSize: questionFontSize ?? 22,
      },
      textConfig: {
        fontIndex: fontIndex ?? fontFamilies[0].value,
        textColor: textFontColor ?? '#000000',
      },
      figureType: FiguresEnum.calculator,
    })
  }, [calculatorStyles, reset])

  const onSubmitConfig = () => {
    const data = watch()
    saveLabelToList(data.label)
    saveConfigToOfficeSettings(data)
    setConfig(data)
    setHash(ContentRoutesList.calculatorFigure.path)
  }

  return (
    <SettingLayout title="Calculator">
      {settingsDataList.map((settingItem) => (
        <Controller
          control={control}
          name={settingItem.name}
          key={settingItem.name}
          render={({ field }) => (
            <SettingInput
              placeholder={settingItem.placeholder}
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
      ))}
      <SettingBtn btnTitle="Add to presentation" clickHandler={onSubmitConfig} />
      <SubTitle>Select label</SubTitle>
      <Controller
        control={control}
        name="label"
        render={({ field }) => <Label onChange={field.onChange} value={field.value} />}
      />
      <SubTitle>Title Style Settings</SubTitle>
      <Controller
        control={control}
        name="questionConfig.fontSize"
        render={({ field }) => (
          <SettingInput
            onChange={field.onChange}
            value={field.value}
            label={{ id: 'titleFontSize', text: 'Title font size' }}
            type="number"
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
              label={item.label}
              type={item.type}
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

export default CalculatorSetting
