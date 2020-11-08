import { Storage } from 'aws-amplify'
//uuid for unique id
import { v4 as uuidv4 } from 'uuid'
import config from 'aws-exports'
const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket,
} = config

async function uploadPhoto(file) {
  let folderNameTemp = ''
  if (file.type === 'application/pdf') {
    folderNameTemp = 'documents'
  } else {
    folderNameTemp = 'images'
  }
  if (file !== null) {
    const uuid = uuidv4()
    const key = `${folderNameTemp}/${uuid}${file.name}`
    const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`
    console.log(url)
    try {
      await Storage.put(key, file, {
        contentType: file.type,
      })
      return url
    } catch (err) {
      console.log('s3 error:', err)
    }
  } else {
    return ''
  }
}

export default uploadPhoto
