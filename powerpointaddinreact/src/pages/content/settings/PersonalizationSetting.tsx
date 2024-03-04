import { PersonalizationDefaultStylesType } from '@/types/defaultStyles/defaultStyleConfigs.types'
import { PersonalizationSettingsType } from '@/types/figures/personalization.types'
import SettingBtn from '@components/content/settingBtn/SettingBtn'
import SettingFile from '@components/content/settingFile/SettingFile'
import SettingInput from '@components/content/settingInput/SettingInput'
import SettingLayout from '@components/content/settingLayout/SettingLayout'
import SettingSelect from '@components/content/settingSelect/settingSelect'
import SettingTextArea from '@components/content/settingTextArea/SettingTextArea'
import SubTitle from '@components/content/subTitle/SubTitle'
import {
  FiguresEnum,
  fontFamilies,
  layouts,
  personalizationFigureType,
} from '@lib/constants/figures.constants'
import { useResetConfig } from '@lib/hooks/useResetConfig'
import { ContentRoutesList } from '@lib/routes/routes.enum'
import { getSavedConfig, saveConfigToOfficeSettings } from '@lib/utils/addin'
import { capitalizeFirstLetter } from '@lib/utils/capitalizeFirstLetter'
import { useConfig } from '@store/config.store'
import { useDefaultStyles } from '@store/defaultStyles.store'
import { useRoute } from '@store/routing.store'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

const PersonalizationSetting = () => {
  const { setConfig } = useConfig()
  const { setHash } = useRoute()

  const { control, reset, watch, register, setValue, getValues } =
    useForm<PersonalizationSettingsType>({
      defaultValues: {
        figureType: FiguresEnum.personalization,
        text: '',
        imageUrl: '',
        fileName: '',

        type: personalizationFigureType.text,
        textConfig: {
          fontIndex: fontFamilies[0].value,
          layout: layouts.left,
          textColor: '#000000',
          fontSize: 16,
        },
        imageConfig: {
          borderRadius: 4,
        },
        backgroundConfig: {
          backgroundColor: '#ffffff',
        },
      },
    })

  useResetConfig({ reset, type: FiguresEnum.personalization })
  const { personalizationStyles } = useDefaultStyles()
  useEffect(() => {
    if (!personalizationStyles) {
      return
    }
    if (getSavedConfig()?.figureType === FiguresEnum.personalization) return
    const {
      backgroundConfig: { backgroundColor },
      imageConfig: { borderRadius: imageBorderRadius },
      textConfig: { fontIndex, textColor, fontSize, layout },
    } = JSON.parse(personalizationStyles) as PersonalizationDefaultStylesType

    reset({
      figureType: FiguresEnum.personalization,
      fileName: '',
      imageUrl: '',
      text: '',
      type: personalizationFigureType.text,
      backgroundConfig: {
        backgroundColor: backgroundColor ?? '#ffffff',
      },
      textConfig: {
        fontIndex: fontIndex ?? fontFamilies[0].value,
        textColor: textColor ?? '#000000',
        fontSize: fontSize ?? 22,
        layout: layout ?? layouts.left,
      },
      imageConfig: {
        borderRadius: imageBorderRadius || 4,
      },
    })
  }, [personalizationStyles, reset])

  const onSubmitConfig = () => {
    const data = watch()
    saveConfigToOfficeSettings(data)
    setConfig(data)
    setHash(ContentRoutesList.personalizationFigure.path)
  }
  return (
    <SettingLayout title="Customization element">
      <SubTitle>Select type</SubTitle>
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <SettingSelect
            onChange={field.onChange}
            value={field.value}
            options={Object.values(personalizationFigureType).map((type, ind) => ({
              value: type,
              label: capitalizeFirstLetter(type),
              id: ind,
            }))}
            selectId="personalization-figure-type"
          />
        )}
      />
      <SettingBtn btnTitle="Add to presentation" clickHandler={onSubmitConfig} />
      {watch('type') === personalizationFigureType.text ? (
        <>
          <Controller
            control={control}
            name="text"
            render={({ field }) => (
              <SettingTextArea
                onChange={field.onChange}
                value={field.value}
                placeholder="Type your text"
              />
            )}
          />
          <SubTitle>Text style settings</SubTitle>
          <Controller
            control={control}
            name="textConfig.layout"
            render={({ field }) => (
              <SettingSelect
                options={Object.values(layouts).map((layout, ind) => ({
                  value: layout,
                  id: ind,
                  label: capitalizeFirstLetter(layout),
                }))}
                onChange={field.onChange}
                value={field.value}
                selectId="personalization-figure-text-layout"
                label="Text align"
                smallLabel={true}
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
          <Controller
            control={control}
            name="textConfig.fontSize"
            render={({ field }) => (
              <SettingInput
                onChange={field.onChange}
                value={field.value}
                label={{ id: 'personalizationTextSize', text: 'Text font size' }}
                type="number"
              />
            )}
          />
          <Controller
            control={control}
            name="textConfig.textColor"
            render={({ field }) => (
              <SettingInput
                onChange={field.onChange}
                value={field.value}
                type="color"
                labelDisplay="inline-block"
                labelWidth="45%"
                label={{ id: 'personalizationTextColor', text: 'Text color' }}
              />
            )}
          />
        </>
      ) : (
        <>
          <Controller
            control={control}
            name="imageUrl"
            render={({ field }) => (
              <SettingFile
                onChange={field.onChange}
                fileNameFunc={{ fieldName: 'fileName', getValues, setValue }}
              />
            )}
          />
          <SubTitle>Image style settings</SubTitle>
          <SettingInput
            registerData={{ name: 'imageConfig.borderRadius', register }}
            label={{ id: 'personalizationImageBorderRadius', text: 'Image Border Radius' }}
            type="number"
          />
        </>
      )}
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
export default PersonalizationSetting
