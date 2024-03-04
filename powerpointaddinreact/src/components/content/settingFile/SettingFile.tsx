import ImageSvg from '@assets/ImageSvg'
import { ChangeEvent, useState } from 'react'
import classes from './settingFile.module.scss'
import { UseFormGetValues, UseFormSetValue } from 'react-hook-form'

interface IProps {
  onChange: (...event: any[]) => void
  fileNameFunc?: {
    setValue: UseFormSetValue<any>
    getValues: UseFormGetValues<any>
    fieldName: string
  }
}

const SettingFile = ({ onChange, fileNameFunc }: IProps) => {
  const [fileName, setFileName] = useState('')

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    const ImageType = /image.*/
    if (file?.type.match(ImageType)) {
      const reader = new FileReader()
      reader.onloadend = function (event) {
        onChange((event.target?.result as string) ?? '')
        fileNameFunc
          ? fileNameFunc?.setValue(fileNameFunc.fieldName, file.name)
          : setFileName(file.name)
      }
      reader.readAsDataURL(file)
    } else {
      fileNameFunc ? fileNameFunc?.setValue(fileNameFunc.fieldName, '') : setFileName('')
    }
  }

  return (
    <div className={classes.containerForFile}>
      <input
        type="text"
        readOnly
        className={classes.inputWithFileName}
        value={fileNameFunc ? fileNameFunc.getValues(fileNameFunc.fieldName) : fileName}
      />
      <label htmlFor="add-file" className={classes.addFileContainer}>
        <input type="file" id="add-file" className={classes.fileInput} onChange={handleImage} />
        <div>
          <ImageSvg />
        </div>
      </label>
    </div>
  )
}

export default SettingFile
