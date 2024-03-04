import { RangeSelectorDefaultStylesType } from '@/types/defaultStyles/defaultStyleConfigs.types'
import { RangeSelectorSettingsType } from '@/types/figures/rangeSelector.types'
import Label from '@components/content/label/Label'
import SettingBtn from '@components/content/settingBtn/SettingBtn'
import SettingInput from '@components/content/settingInput/SettingInput'
import SettingLayout from '@components/content/settingLayout/SettingLayout'
import SettingSelect from '@components/content/settingSelect/settingSelect'
import SubTitle from '@components/content/subTitle/SubTitle'
import {
  FiguresEnum,
  fontFamilies,
  rangeSelectorType,
  type,
} from '@lib/constants/figures.constants'
import {
  numberRangeSettingList,
  numberRangeStyleSettingList,
  optionRangeStyleSettingList,
  settingsDataList,
} from '@lib/constants/setting.constants'
import { useResetConfig } from '@lib/hooks/useResetConfig'
import { ContentRoutesList } from '@lib/routes/routes.enum'
import { getSavedConfig, saveConfigToOfficeSettings } from '@lib/utils/addin'
import { saveLabelToList } from '@lib/utils/saveLabelToList'
import { useConfig } from '@store/config.store'
import { useDefaultStyles } from '@store/defaultStyles.store'
import { useRoute } from '@store/routing.store'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

const RangeSelectorSetting = () => {
  const { setConfig } = useConfig()
  const { setHash } = useRoute()

  const { control, reset, watch, getValues, setValue } = useForm<RangeSelectorSettingsType>({
    defaultValues: {
      figureType: FiguresEnum.rangeSelector,
      label: '',
      question: '',
      subheading: '',
      type: type.number,
      backgroundConfig: { backgroundColor: '#ffffff' },
      questionConfig: { fontSize: 22 },
      rangeConfig: [
        { max: '10', min: '1', primaryColor: '#0366d6', step: '1' },
        {
          numberOfOptions: 0,
          options: [],
          optionTextConfig: { checkedTextColor: '#000000', textColor: '#6c757d' },
          pointerBorderColor: '#ffffff',
          pointerColor: '#000000',
          primaryColor: '#0366d6',
        },
      ],
      textConfig: { fontIndex: fontFamilies[0].value, fontSize: 16, textColor: '#000000' },
    },
  })

  useResetConfig({ reset, type: FiguresEnum.rangeSelector })
  const { rangeSelectorStyles } = useDefaultStyles()

  useEffect(() => {
    if (!rangeSelectorStyles) {
      return
    }
    if (getSavedConfig()?.figureType === FiguresEnum.rangeSelector) return
    const {
      backgroundConfig: { backgroundColor },
      textConfig: { fontIndex, fontSize, textColor },
      rangeConfig: [
        { primaryColor },
        {
          primaryColor: rangePrimaryColor,
          numberOfOptions,
          optionTextConfig: { checkedTextColor, textColor: optionTextColor },
          pointerBorderColor,
          pointerColor,
        },
      ],
      questionConfig: { fontSize: questionFontSize },
    } = JSON.parse(rangeSelectorStyles) as RangeSelectorDefaultStylesType

    reset({
      figureType: FiguresEnum.rangeSelector,
      label: '',
      question: '',
      subheading: '',
      type: type.number,
      backgroundConfig: { backgroundColor: backgroundColor ?? '#ffffff' },
      questionConfig: { fontSize: questionFontSize ?? 22 },
      rangeConfig: [
        { max: '10', min: '1', primaryColor: primaryColor ?? '#0366d6', step: '1' },
        {
          numberOfOptions: numberOfOptions ?? 0,
          options: [],
          optionTextConfig: {
            checkedTextColor: checkedTextColor ?? '#000000',
            textColor: optionTextColor ?? '#6c757d',
          },
          pointerBorderColor: pointerBorderColor ?? '#ffffff',
          pointerColor: pointerColor ?? '#000000',
          primaryColor: rangePrimaryColor ?? '#0366d6',
        },
      ],
      textConfig: {
        fontIndex: fontIndex ?? fontFamilies[0].value,
        fontSize: fontSize ?? 16,
        textColor: textColor ?? '#000000',
      },
    })
  }, [rangeSelectorStyles, reset])

  const onSubmitConfig = () => {
    const data = watch()
    saveLabelToList(data.label)
    saveConfigToOfficeSettings(data)
    setConfig(data)
    setHash(ContentRoutesList.rangeSelectorFigure.path)
  }

  const onAddNewOption = () => {
    setValue('rangeConfig.1.options', [...getValues('rangeConfig.1.options'), ''])
    setValue('rangeConfig.1.numberOfOptions', getValues('rangeConfig.1.options').length)
  }

  return (
    <SettingLayout title="Range selector">
      {settingsDataList.reduce<JSX.Element[]>((acc, rec) => {
        if (rec.name === 'equation') {
          return acc
        }
        return [
          ...acc,
          <Controller
            name={rec.name}
            control={control}
            key={rec.name}
            render={({ field }) => (
              <SettingInput
                value={field.value}
                onChange={field.onChange}
                placeholder={rec.placeholder}
              />
            )}
          />,
        ]
      }, [])}
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <SettingSelect
            options={rangeSelectorType}
            onChange={field.onChange}
            value={field.value}
            selectId="range-selector-type"
          />
        )}
      />
      {String(getValues('type')) === '0' ? (
        <div className="flex justify-between gap-9">
          {numberRangeSettingList.map((item) => (
            <Controller
              name={item.name}
              control={control}
              key={item.name}
              render={({ field }) => (
                <SettingInput
                  value={field.value}
                  onChange={field.onChange}
                  marginBottom="0px"
                  type="number"
                  placeholder={item.placeholder}
                />
              )}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-x-3">
            {watch('rangeConfig.1.options').map((_, index) => (
              <Controller
                control={control}
                name={`rangeConfig.1.options.${index}`}
                key={index}
                render={({ field }) => (
                  <SettingInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={`Range option #${index + 1}`}
                    marginBottom="0px"
                  />
                )}
              />
            ))}
          </div>
          <SettingBtn btnTitle="Add option" clickHandler={onAddNewOption} isAddItem isShowIcon />
        </>
      )}
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
            type="number"
            label={{ id: 'rangeSelectorQuestionFontSize', text: 'Question font size' }}
          />
        )}
      />
      {String(watch('type')) === '0' ? (
        <>
          <SubTitle>Range Selector Style Settings</SubTitle>
          {numberRangeStyleSettingList.map((item) => (
            <Controller
              control={control}
              key={item.name}
              name={item.name}
              render={({ field }) => (
                <SettingInput
                  onChange={field.onChange}
                  value={field.value}
                  label={item.label}
                  labelWidth={item.labelWidth}
                  labelDisplay={item.labelDisplay}
                  type={item.type}
                />
              )}
            />
          ))}
        </>
      ) : (
        <>
          <SubTitle>Range Selector Style Settings</SubTitle>
          {optionRangeStyleSettingList.map((item) => (
            <Controller
              control={control}
              name={item.name}
              key={item.name}
              render={({ field }) => (
                <SettingInput
                  onChange={field.onChange}
                  value={field.value}
                  label={item.label}
                  labelWidth={item.labelWidth}
                  labelDisplay={item.labelDisplay}
                  type={item.type}
                />
              )}
            />
          ))}
        </>
      )}
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
export default RangeSelectorSetting
