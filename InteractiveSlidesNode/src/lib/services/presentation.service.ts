import { blobClient, BlobStorageService } from '@lib/services/blobStorage.service.js'
import { BlobContainers } from '@lib/constants/blob-containers.js'
import fs from 'fs'
import * as child_process from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { IPresentation, PresentationModel } from '@models/presentation.model.js'
import { BlockBlobSyncUploadFromURLOptions } from '@azure/storage-blob'
import { SlideModel } from '@models/slide.model.js'
import { ulid } from 'ulid'
import * as process from 'process'
import * as os from 'os'
import sharp from 'sharp'
import * as console from 'console'


const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

async function getLinksByIds(deviceId: string, id: string) {
  const prefix = `${deviceId}/${id}/time`
  return await BlobStorageService.getLinksByPrefix(prefix, BlobContainers.IMAGES)
}

enum OS {
  'WINDOWS' = 'windows',
  'LINUX' = 'linux',
  'MAC' = 'mac',
}

const detectOSType = () => {
  const type = os.type()
  if (type.startsWith('Windows')) return OS.WINDOWS
  if (type.startsWith('Linux')) return OS.LINUX
  if (type.startsWith('Darwin')) return OS.MAC
  return 'UNKNOWN'
}

async function convertToImages(presentation: IPresentation, srcPath: string, distPath: string) {

  //Get all chunks from blob storage of presentation
  const resultBuffer = await concatByChunks(srcPath)

  //Creating temp folder on local disk
  const tempFolderPath = path.join(__dirname, '../../../temp', distPath.replaceAll(':', '&'))


  console.log('TEMP FOLDER PATH', tempFolderPath)
  if (!fs.existsSync(tempFolderPath)) {
    fs.mkdirSync(tempFolderPath, { recursive: true })
  }

  //Saving presentation to temp folder and uploading to blob storage
  fs.writeFileSync(tempFolderPath + '/origin.pptx', resultBuffer)
  await BlobStorageService.uploadBlobToStorage(distPath, 'origin.pptx', BlobContainers.PRESENTATIONS, resultBuffer)

  try {
    await convertImgService(path.join(tempFolderPath, 'origin.pptx'), path.join(tempFolderPath))
    await saveImages(presentation, distPath, tempFolderPath)
    fs.rmSync(tempFolderPath, { recursive: true })
  } catch (e) {
    console.log(e)
    throw e
  }


}


async function saveImages(presentation: IPresentation, distPath: string, tempFolderPath: string) {
  const images: { name: string, file: Buffer, url: string, width: number, height: number }[] = []

  const files = fs.readdirSync(tempFolderPath)

  for (const file of files) {
    if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {

      const imageBuffer = fs.readFileSync(path.join(tempFolderPath, file))
      const imageData = await sharp(imageBuffer)

      const { width, height } = await imageData.metadata()

      images.push({ name: file, file: imageBuffer, url: '', width, height })
    }
  }

  images.sort((a, b) => {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  })


  const containerClient = blobClient().getContainerClient(BlobContainers.IMAGES)

  const presentationImageSharp = await sharp(images[0].file)


  const presentationIcon = await presentationImageSharp.resize(468).toBuffer()
  await BlobStorageService.uploadBlobToStorage(`icons/${presentation.device_id}/${presentation.id}`, 'presentation_icon.jpg', BlobContainers.IMAGES, presentationIcon)

  const presentationIconBlockBlobClient = containerClient.getBlockBlobClient(path.join(`icons/${presentation.device_id}/${presentation.id}`, 'presentation_icon.jpg'))

  const presentationImageStats = await presentationImageSharp.stats()

  const { channels: [r, g, b] } = presentationImageStats

  const redColor = Math.round(r.mean) ? Math.round(r.mean).toString(16) : '00'
  const greenColor = Math.round(g.mean) ? Math.round(g.mean).toString(16) : '00'
  const blueColor = Math.round(b.mean) ? Math.round(b.mean).toString(16) : '00'


  await PresentationModel.query().patchAndFetchById(presentation.id, {
    presentation_icon: presentationIconBlockBlobClient.url,
    presentation_color: `#${redColor}${greenColor}${blueColor}`,
  })


  for await (const image of images) {
    await BlobStorageService.uploadBlobToStorage(distPath, image.name, BlobContainers.IMAGES, image.file)
    const blockBlobClient = containerClient.getBlockBlobClient(path.join(distPath, image.name))
    image.url = blockBlobClient.url
  }


  await SlideModel.query().delete().where('presentation_id', presentation.id)


  for (const image of images) {
    const slideNumber = image.name.match(/\d+/g).pop()
    await SlideModel.query().insert({
      id: ulid(),
      presentation_id: presentation.id,
      slide: +slideNumber,
      url: image.url,
      width: image.width,
      height: image.height,
    })
  }

}

async function concatByChunks(srcPath: string) {
  const containerClient = blobClient().getContainerClient(BlobContainers.PRESENTATIONS)
  const blobList = containerClient.listBlobsFlat({ prefix: srcPath })

  const blobBuffers = []

  for await (const blob of blobList) {
    const blockBlobClient = containerClient.getBlockBlobClient(blob.name)
    console.log('DOWNLOAD BLOB NAME', blob.name)
    const downloadResponse = await blockBlobClient.download(0)
    const buffer = await streamToBuffer(downloadResponse.readableStreamBody)

    blobBuffers.push(buffer)
  }
  return Buffer.concat(blobBuffers)
}


async function convertImgService(srcPath: string, distPath: string) {
  try {
    let result = null

    console.log('OS TYPE', detectOSType())

    if (detectOSType() === OS.LINUX) {
      const execFilePath = path.join(__dirname, '../../../external-service/convert-service/linux/ConvertPptxToImages')

      fs.chmodSync(execFilePath, 0o777)

      result = child_process.spawnSync(execFilePath, [srcPath, distPath])
    }
    if (detectOSType() === OS.MAC) {
      const execFilePath = path.join(__dirname, '../../../external-service/convert-service/osx/ConvertPptxToImages')

      fs.chmodSync(execFilePath, 0o777)

      result = child_process.spawnSync(execFilePath, [srcPath, distPath])
    }
    if (detectOSType() === OS.WINDOWS) {
      result = child_process.spawnSync(`${path.join(__dirname, '../../../external-service/convert-service/windows/ConvertPptxToImages.exe')}`, [srcPath, distPath])
    }
    console.log('CONVERT RESULT', result?.status, result?.stdout.toString(), result?.stderr.toString())
    return result
  } catch (e) {
    console.log(e)
    return null
  }
}


async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    readableStream.on('data', (data) => {
      chunks.push(data)
    })
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    readableStream.on('error', reject)
  })
}


export const PresentationService = {
  convertToImages,
  getLinksByIds,
}
