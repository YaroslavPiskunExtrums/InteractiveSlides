import LinkBtn from '@components/common/linkBtn/LinkBtn'
import { yupResolver } from '@hookform/resolvers/yup'
import { submitPresentationSchema } from '@lib/validation/submitPresentationSchema'
import { usePresentation } from '@store/presentation.store'
import { Dispatch, SetStateAction } from 'react'
import { Controller, useForm } from 'react-hook-form'
import AuthInput from '@components/taskPane/authInput/AuthInput'
import { getPresentationName, setPresentationNameInOffice } from '@lib/utils/addin'
import { renamePresentation } from '@lib/api/renamePresentation'
import { cleanPresentation } from '@lib/api/cleanPresentation'
import { TaskPaneRouterList } from '@lib/routes/routes.enum'
import { calculateCurrentDataTime } from '@lib/utils/calculateCurrentDataTime'
import { sendFile } from '@lib/utils/sendFile'
import { useRoute } from '@store/routing.store'

interface IProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

interface IForm {
  presentationName: string
}

const SubmitPresentationForm = ({ setIsLoading }: IProps) => {
  const { uploadLinkUrl, uniqueId } = usePresentation()
  const { setHash } = useRoute()

  const { control, watch, reset } = useForm<IForm>({
    mode: 'all',
    resolver: yupResolver(submitPresentationSchema),
    defaultValues: {
      presentationName: getPresentationName() ?? '',
    },
  })
  const onSubmitHandler = async () => {
    const { presentationName } = watch()

    setIsLoading(true)
    try {
      const presentationNameFromOffice = getPresentationName()

      if (presentationNameFromOffice) {
        await renamePresentation({ name: presentationName, uniqueID: uniqueId })
        setPresentationNameInOffice(presentationName)
      }
      const currentDateTime = calculateCurrentDataTime()
      await cleanPresentation(uniqueId)
      sendFile(currentDateTime)

      reset()
      setHash(TaskPaneRouterList.preview.path)
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {uploadLinkUrl ? (
        <div className="flex flex-col">
          <Controller
            control={control}
            name="presentationName"
            render={({ field }) => (
              <AuthInput
                type="text"
                onChange={field.onChange}
                value={field.value}
                id="presentationName"
                placeholder="Presentation name"
              />
            )}
          />
        </div>
      ) : (
        <></>
      )}
      <LinkBtn onClick={onSubmitHandler} className="text-base w-full mt-0 bg-[#FF5630] px-3 py-1.5">
        Submit Presentation
      </LinkBtn>
    </div>
  )
}

export default SubmitPresentationForm
