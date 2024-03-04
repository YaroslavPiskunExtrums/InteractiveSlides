import { BlobServiceClient } from '@azure/storage-blob'

import * as process from 'process'

import { BlobContainers } from '@lib/constants/blob-containers.js'
import { Buffer } from 'buffer'
import path from 'path'


let blobServiceClient: BlobServiceClient

export function blobClient(): BlobServiceClient {
  if (!blobServiceClient) {
    blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.BLOB_STORAGE_CONNECTION_STRING || '',
    )
  }

  return blobServiceClient
}


async function getLinksByPrefix(prefix: string, container: BlobContainers) {
  const containerClient = blobClient().getContainerClient(container)
  const blobIterator = containerClient.listBlobsByHierarchy('/', { prefix })
  const urls = []
  for await (const blob of blobIterator) {
    if (blob.kind === 'prefix') continue
    const blobClient = containerClient.getBlobClient(blob.name)
    urls.push(blobClient.url)
  }
  return urls
}

async function uploadBlobToStorage(distPath: string, blobName: string, scope: BlobContainers, blobData: Buffer) {
  const containerClient = blobClient().getContainerClient(scope);
  const scopeClient = containerClient.getBlockBlobClient(path.join(distPath, blobName))
  return await scopeClient.upload(blobData, blobData.length)
}

async function cleanFilesByFolder(path: string, container: BlobContainers) {
  console.log('DELETE BLOB PATH', path)
  const containerClient = blobClient().getContainerClient(container)
  const blobIterator = await containerClient.listBlobsFlat( { prefix: path })

  for await (const blob of blobIterator) {
    console.log('DELETE BLOB NAME', blob.name)
    const blobClient = containerClient.getBlobClient(blob.name)
    await blobClient.deleteIfExists()
  }
}

export const BlobStorageService = {
  getLinksByPrefix,
  uploadBlobToStorage,
  cleanFilesByFolder
}
