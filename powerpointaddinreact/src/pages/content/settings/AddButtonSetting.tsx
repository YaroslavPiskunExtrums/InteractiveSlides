import { AddBtnDefaultStylesType } from '@/types/defaultStyles/defaultStyleConfigs.types'
import { AddButtonSettingsType } from '@/types/figures/addButton.types'
import Label from '@components/content/label/Label'
import LinkCheckbox from '@components/content/linkCheckbox/LinkCheckbox'
import SettingSelect from '@components/content/settingSelect/settingSelect'
import SettingBtn from '@components/content/settingBtn/SettingBtn'
import SettingInput from '@components/content/settingInput/SettingInput'
import SubTitle from '@components/content/subTitle/SubTitle'
import { FiguresEnum, linkList } from '@lib/constants/figures.constants'
import { useResetConfig } from '@lib/hooks/useResetConfig'
import { ContentRoutesList } from '@lib/routes/routes.enum'
import { getSavedConfig, saveConfigToOfficeSettings } from '@lib/utils/addin'
import { saveLabelToList } from '@lib/utils/saveLabelToList'
import { useConfig } from '@store/config.store'
import { useDefaultStyles } from '@store/defaultStyles.store'
import { useRoute } from '@store/routing.store'
import { ChangeEvent, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import SettingLayout from '@components/content/settingLayout/SettingLayout'
import { btnStyleSettingList } from '@lib/constants/setting.constants'

const AddButtonSetting = () => {
  const { setConfig } = useConfig()
  const { setHash } = useRoute()
  const [isLink, setIsLink] = useState(false)

  const { control, setValue, reset, watch } = useForm<AddButtonSettingsType>({
    defaultValues: {
      btnText: '',
      label: '',
      figureType: FiguresEnum.addButton,
      backgroundConfig: {
        backgroundColor: '#ffffff',
      },
      btnConfig: {
        backColor: '#007bff',
        borderColor: '#007bff',
        borderRadius: 4,
        fontSize: 16,
        hoverBorderColor: '#0062cc',
        hoverColor: '#0069d9',
        hoverTextColor: '#ffffff',
        link: null,
        linkType: null,
        textColor: '#ffffff',
      },
    },
  })

  const onChangeLinkStatus = (e: ChangeEvent<HTMLInputElement>) => {
    setIsLink(e.target.checked)

    if (!e.target.checked) {
      setValue('btnConfig.link', null)
      setValue('btnConfig.linkType', null)
      return
    }

    setValue('btnConfig.link', '')
    setValue('btnConfig.linkType', 'slide_link')
  }

  useResetConfig({ reset, type: FiguresEnum.addButton })
  const { buttonStyles } = useDefaultStyles()

  useEffect(() => {
    if (!buttonStyles) {
      return
    }
    if (getSavedConfig()?.figureType === FiguresEnum.addButton) return
    const {
      backgroundConfig: { backgroundColor },
      btnConfig: {
        backColor,
        borderColor,
        borderRadius,
        hoverBorderColor,
        hoverColor,
        hoverTextColor,
        textColor,
        fontSize,
      },
    } = JSON.parse(buttonStyles) as AddBtnDefaultStylesType

    reset({
      backgroundConfig: {
        backgroundColor: backgroundColor ?? '#ffffff',
      },
      btnConfig: {
        backColor: backColor ?? '#007bff',
        borderColor: borderColor ?? '#007bff',
        borderRadius: borderRadius ?? 4,
        hoverBorderColor: hoverBorderColor ?? '#0062cc',
        hoverColor: hoverColor ?? '#0069d9',
        hoverTextColor: hoverTextColor ?? '#ffffff',
        textColor: textColor ?? '#ffffff',
        fontSize: fontSize ?? 16,
        link: null,
        linkType: null,
      },
      btnText: '',
      label: '',
      figureType: FiguresEnum.addButton,
    })
  }, [buttonStyles, reset])

  const onSubmitConfig = () => {
    const data = watch()
    saveLabelToList(data.label)
    saveConfigToOfficeSettings(data)
    setConfig(data)
    setHash(ContentRoutesList.addButtonFigure.path)
  }

  return (
    <SettingLayout title="Button">
      <Controller
        control={control}
        name="btnText"
        render={({ field }) => (
          <SettingInput
            placeholder="Add button text"
            onChange={field.onChange}
            value={field.value}
          />
        )}
      />
      <SettingBtn btnTitle="Add to presentation" clickHandler={onSubmitConfig} />
      <LinkCheckbox value={isLink} onChange={onChangeLinkStatus} />
      {isLink ? (
        <>
          <SubTitle>Select type of link</SubTitle>
          <Controller
            control={control}
            name="btnConfig.linkType"
            render={({ field }) => (
              <SettingSelect
                onChange={field.onChange}
                value={field.value ?? 'slide_link'}
                selectId=""
                options={linkList}
              />
            )}
          />
          <SubTitle>Select slide to go to</SubTitle>
          <Controller
            control={control}
            name="btnConfig.link"
            render={({ field }) => (
              <SettingInput
                value={field.value ?? ''}
                onChange={field.onChange}
                type={'number'}
                placeholder="Enter slide number"
              />
            )}
          />
        </>
      ) : (
        <></>
      )}
      <SubTitle>Select label</SubTitle>
      <Controller
        control={control}
        name="label"
        render={({ field }) => <Label onChange={field.onChange} value={field.value} />}
      />
      <SubTitle>Button Style Settings</SubTitle>
      {btnStyleSettingList.map((item) => (
        <Controller
          control={control}
          name={item.name}
          key={item.name}
          render={({ field }) => (
            <SettingInput {...item} onChange={field.onChange} value={field.value} />
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

export default AddButtonSetting
