import { yupResolver } from '@hookform/resolvers/yup'
import { renamePresentation } from '@lib/api/renamePresentation'
import { TaskPaneRouterList } from '@lib/routes/routes.enum'
import { setPresentationNameInOffice } from '@lib/utils/addin'
import { presentationRenameSchema } from '@lib/validation/presentationRenameSchema'
import { Controller, useForm } from 'react-hook-form'
import AuthInput from '@components/taskPane/authInput/AuthInput'
import LinkBtn from '@components/common/linkBtn/LinkBtn'
import { Dispatch, SetStateAction } from 'react'
import { useRoute } from '@store/routing.store'
import { usePresentation } from '@store/presentation.store'
import classes from './presentationRenameForm.module.scss'

interface IForm {
  presentationName: string
}

interface IProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

const PresentationRenameForm = ({ setIsLoading }: IProps) => {
  const { setHash } = useRoute()
  const { uniqueId } = usePresentation()

  const {
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<IForm>({
    mode: 'all',
    resolver: yupResolver(presentationRenameSchema),
    defaultValues: {
      presentationName: '',
    },
  })

  const onSubmitHandler = async () => {
    const { presentationName } = watch()
    if (!presentationName || Boolean(Object.values(errors).length)) {
      console.log(errors, presentationName)
      return
    }
    setIsLoading(true)
    try {
      setPresentationNameInOffice(presentationName)
      await renamePresentation({
        name: presentationName,
        uniqueID: uniqueId,
      })
      reset()
      setHash(TaskPaneRouterList.submitPresentation.path)
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={classes.form}>
      <label htmlFor="presentationName">Presentation Name</label>
      <Controller
        control={control}
        name="presentationName"
        render={({ field }) => (
          <AuthInput
            onChange={field.onChange}
            value={field.value}
            id="presentationName"
            placeholder="Enter your presentation name"
            type="text"
          />
        )}
      />
      <div>
        <LinkBtn onClick={onSubmitHandler} className="text-base w-full mt-0 bg-[#FF5630]">
          Name presentation
        </LinkBtn>
      </div>
    </div>
  )
}

export default PresentationRenameForm
