import { Storage } from 'aws-amplify';
//uuid for unique id
import { v4 as uuidv4 } from 'uuid'
import config from 'aws-exports'
const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket,
} = config

  async function uploadPhoto(logo) {
    if (logo !== null) {
      const uuid = uuidv4()
      const key = `images/${uuid}${logo.name}`
      const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`
      console.log(url)
      try {
        await Storage.put(key, logo, {
          contentType: logo.type,
        })
        return url
      } catch (err) {
        console.log('s3 error:', err)
      }
    }else{
      return ''
    }
  }

  export default uploadPhoto;