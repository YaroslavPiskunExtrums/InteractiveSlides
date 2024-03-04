import { MultipleChoiceDefaultStylesType } from '@/types/defaultStyles/defaultStyleConfigs.types'
import { MultipleChoiceSettingsType } from '@/types/figures/multipleChoice.types'
import Label from '@components/content/label/Label'
import LinkCheckbox from '@components/content/linkCheckbox/LinkCheckbox'
import SettingBtn from '@components/content/settingBtn/SettingBtn'
import SettingFile from '@components/content/settingFile/SettingFile'
import SettingInput from '@components/content/settingInput/SettingInput'
import SettingLayout from '@components/content/settingLayout/SettingLayout'
import SettingSelect from '@components/content/settingSelect/settingSelect'
import SubTitle from '@components/content/subTitle/SubTitle'
import {
  FiguresEnum,
  fontFamilies,
  multipleChoiceView,
  views,
} from '@lib/constants/figures.constants'
import {
  btnStyleSettingList,
  dropdownStyleSettingList,
  questionStyleSettingList,
} from '@lib/constants/setting.constants'
import { useResetConfig } from '@lib/hooks/useResetConfig'
import { ContentRoutesList } from '@lib/routes/routes.enum'
import { getSavedConfig, saveConfigToOfficeSettings } from '@lib/utils/addin'
import { saveLabelToList } from '@lib/utils/saveLabelToList'
import { useConfig } from '@store/config.store'
import { useDefaultStyles } from '@store/defaultStyles.store'
import { useRoute } from '@store/routing.store'
import { ChangeEvent, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

const MultipleChoiceSetting = () => {
  const { setConfig } = useConfig()
  const { setHash } = useRoute()
  const [isLink, setIsLink] = useState(false)

  const { control, reset, watch, getValues, setValue } = useForm<MultipleChoiceSettingsType>({
    defaultValues: {
      figureType: FiguresEnum.multipleChoice,
      question: '',
      label: '',
      answers: [{ value: '', label: '' }],
      view: multipleChoiceView[0].value,
      imageUrl: '',
      backgroundConfig: {
        backgroundColor: '#ffffff',
      },
      btnConfig: {
        backColor: '#007bff',
        borderColor: '#007bff',
        borderRadius: 4,
        hoverBorderColor: '#0062cc',
        hoverColor: '#0069d9',
        hoverTextColor: '#ffffff',
        links: null,
        link: null,
        linkType: null,
        textColor: '#ffffff',
      },
      dropdownConfig: {
        backgroundColor: '#ffffff',
        borderColor: '#ffffff',
        borderRadius: 4,
        fontColor: '#000000',
        hoverColor: '#5bc5fa',
        hoverTextColor: '#ffffff',
      },
      questionConfig: {
        fontSize: 22,
      },
      selected: -1,
      selectedItems: null,
      textConfig: {
        textColor: '#000000',
        fontSize: 16,
        fontIndex: fontFamilies[0].value,
      },
    },
  })

  useResetConfig({ reset, type: FiguresEnum.multipleChoice })
  const { multipleChoiceStyles } = useDefaultStyles()

  useEffect(() => {
    if (!multipleChoiceStyles) {
      return
    }
    if (getSavedConfig()?.figureType === FiguresEnum.multipleChoice) return
    const {
      backgroundConfig: { backgroundColor },
      questionConfig: { fontSize: questionFontSize },
      textConfig: { textColor, fontSize, fontIndex },
      dropdownConfig: {
        backgroundColor: dropdownBackgroundColor,
        borderColor: dropdownBorderColor,
        borderRadius: dropdownBorderRadius,
        fontColor: dropdownFontColor,
        hoverColor: dropdownHoverColor,
        hoverTextColor: dropdownHoverTextColor,
      },
      btnConfig: {
        backColor,
        borderColor,
        borderRadius,
        hoverBorderColor,
        hoverColor,
        hoverTextColor,
        textColor: btnTextColor,
      },
    } = JSON.parse(multipleChoiceStyles) as MultipleChoiceDefaultStylesType

    reset({
      answers: [{ value: '', label: '' }],
      imageUrl: '',
      label: '',
      question: '',
      view: multipleChoiceView[0].value,
      selected: -1,
      selectedItems: null,
      backgroundConfig: {
        backgroundColor: backgroundColor ?? '#ffffff',
      },
      questionConfig: {
        fontSize: questionFontSize ?? 22,
      },
      textConfig: {
        textColor: textColor ?? '#000000',
        fontSize: fontSize ?? 16,
        fontIndex: fontIndex ?? fontFamilies[0].value,
      },
      dropdownConfig: {
        backgroundColor: dropdownBackgroundColor ?? '#ffffff',
        borderColor: dropdownBorderColor ?? '#ffffff',
        borderRadius: dropdownBorderRadius ?? 4,
        fontColor: dropdownFontColor ?? '#000000',
        hoverColor: dropdownHoverColor ?? '#5bc5fa',
        hoverTextColor: dropdownHoverTextColor ?? '#ffffff',
      },
      btnConfig: {
        backColor: backColor ?? '#007bff',
        borderColor: borderColor ?? '#007bff',
        borderRadius: borderRadius ?? 4,
        hoverBorderColor: hoverBorderColor ?? '#0062cc',
        hoverColor: hoverColor ?? '#0069d9',
        hoverTextColor: hoverTextColor ?? '#ffffff',
        links: null,
        link: null,
        linkType: null,
        textColor: btnTextColor ?? '#ffffff',
      },
      figureType: FiguresEnum.multipleChoice,
    })
  }, [multipleChoiceStyles, reset])

  const onAddAnswer = () => {
    setValue('answers', [...watch('answers'), { value: '', label: '' }])
    if (isLink && watch('btnConfig.links'))
      setValue('btnConfig.links', [...(watch('btnConfig.links') as NonNullable<string[]>), ''])
  }

  const onChangeLinkStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.currentTarget.checked
    setIsLink(isChecked)
    if (!isChecked) {
      setValue('btnConfig.links', null)
      setValue('btnConfig.linkType', null)
      return
    }
    setValue(
      'btnConfig.links',
      getValues('answers').map(() => '')
    )
    setValue('btnConfig.linkType', 'slide_link')
  }

  const onSubmitConfig = () => {
    const data = watch()
    saveLabelToList(data.label)
    saveConfigToOfficeSettings(data)
    setConfig(data)
    setHash(ContentRoutesList.multipleChoiceFigure.path)
  }
  return (
    <SettingLayout title="Multiple choice">
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
      {getValues('answers').map((_, index) => (
        <Controller
          key={index}
          control={control}
          name={`answers.${index}`}
          render={({ field }) => (
            <SettingInput
              onChange={(e) => field.onChange({ label: e.target.value, value: e.target.value })}
              value={field.value.label}
              placeholder="Type your answer"
              marginBottom="0px"
            />
          )}
        />
      ))}
      <SettingBtn btnTitle="Add answer" clickHandler={onAddAnswer} isShowIcon isAddItem />
      <SubTitle marginBottom="0">Select multiple choice view</SubTitle>
      <Controller
        control={control}
        name="view"
        render={({ field }) => (
          <SettingSelect
            onChange={field.onChange}
            value={field.value}
            options={multipleChoiceView}
            selectId="view"
          />
        )}
      />
      <Controller
        control={control}
        name="imageUrl"
        render={({ field }) => <SettingFile onChange={field.onChange} />}
      />
      <SettingBtn btnTitle="Add to presentation" clickHandler={onSubmitConfig} />
      {watch('view') !== 'multiple-selector' && (
        <LinkCheckbox value={isLink} onChange={onChangeLinkStatus} />
      )}
      {isLink && watch('btnConfig.links') && (
        <>
          <SubTitle>Select slides to go to</SubTitle>
          {watch('btnConfig.links')?.map((_, index) => (
            <Controller
              control={control}
              name={`btnConfig.links.${index}`}
              key={index}
              render={({ field }) => (
                <SettingInput
                  onChange={field.onChange}
                  value={field.value}
                  placeholder={
                    Number(getValues('btnConfig.links')?.length) > 1
                      ? `Add your link to answer #${index + 1}`
                      : 'Add your link to answer'
                  }
                  marginBottom="0px"
                />
              )}
            />
          ))}
        </>
      )}
      <SubTitle>Select label</SubTitle>
      <Controller
        control={control}
        name="label"
        render={({ field }) => <Label onChange={field.onChange} value={field.value} />}
      />
      <SubTitle>Question Style Settings</SubTitle>
      {questionStyleSettingList.map((item) => (
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
      {watch('view') === views.buttonList ? (
        <>
          <SubTitle>Button Style Settings</SubTitle>

          {btnStyleSettingList.reduce<JSX.Element[]>((acc, rec) => {
            if (rec.name === 'btnConfig.fontSize') {
              return acc
            }
            return [
              ...acc,
              <Controller
                control={control}
                name={rec.name}
                key={rec.name}
                render={({ field }) => (
                  <SettingInput
                    onChange={field.onChange}
                    value={field.value}
                    type={rec.type}
                    label={rec.label}
                    labelDisplay={rec.labelDisplay}
                    labelWidth={rec.labelWidth}
                  />
                )}
              />,
            ]
          }, [])}
        </>
      ) : (
        <>
          <SubTitle>Dropdown settings</SubTitle>
          {dropdownStyleSettingList.map((item) => (
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
        </>
      )}
      <SubTitle>Text Style Settings</SubTitle>
      <Controller
        control={control}
        name="textConfig.fontSize"
        render={({ field }) => (
          <SettingInput
            onChange={field.onChange}
            value={field.value}
            type="number"
            label={{ id: 'textFontSize', text: 'Text font size' }}
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

export default MultipleChoiceSetting
