import React, { useState, useEffect } from 'react'
import { API, Storage } from 'aws-amplify'
import * as mutations from '../../graphql/mutations'
import { listCompanys } from '../../graphql/queries'
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Button,
  Spinner,
  Alert,
} from 'reactstrap'
//Inputs
import StandardInput from '../../components/Inputs/StandardInput'
import PhoneInputCustom from '../../components/Inputs/PhoneInput'
import UploadPhoto from './UploadPhoto/UploadPhoto'
import NoImageView from '../../assets/images/no-image-view.jpg'
//uuid for unique id
import { v4 as uuidv4 } from 'uuid'

//Scss Imports
import './managecompany.scss'
import config from 'aws-exports'
const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket,
} = config

function ManageCompanyPage() {
  const [isThereCompany, setIsThereCompany] = useState(null)
  const [spinnerControl, setSpinnerControl] = useState(false)
  const [logo, setLogo] = useState(null)
  const [companyData, setCompanyData] = useState({
    companyName: '',
    email: '',
    description: '',
    phone: '',
    logoUrl: '',
  })
  const [errors, setErrors] = useState({
    companyNameE: {
      emptyState: null,
      emptyMessage: 'Şirket ismini lütfen boş geçmeyiniz!',
    },
    emailE: {
      emptyState: null,
      emptyMessage: 'Şirket emailini lütfen boş geçmeyiniz!',
    },
    descriptionE: {
      emptyState: null,
      emptyMessage: 'Şirket açıklamasını lütfen boş geçmeyiniz!',
    },
    phoneE: {
      emptyState: null,
      emptyMessage: 'Şirket telefonunu lütfen boş geçmeyiniz!',
    },
  })
  const getUserCompany = async () => {
    try {
      const res = await API.graphql({
        query: listCompanys,
      })
      console.log(res)
      if (res.data.listCompanys.items.length !== 0) {
        console.log('sirket var')
        setCompanyData(res.data.listCompanys.items[0])
        setIsThereCompany(true)
      } else {
        console.log('sirket yok')
        setIsThereCompany(false)
      }
    } catch (err) {
      console.log('error getting all companies:', err)
    }
  }

  function emptyControl() {
    if (companyData.companyName === '') {
      console.log("Comp name error if in deyim.'")
      setErrors((prev) => {
        return {
          ...prev,
          companyNameE: {
            ...errors.companyNameE,
            emptyState: true,
          },
        }
      })
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          companyNameE: {
            ...errors.companyNameE,
            emptyState: false,
          },
        }
      })
    }
    if (companyData.email === '') {
      console.log("Email error else if in deyim.'")
      setErrors((prev) => {
        return {
          ...prev,
          emailE: {
            ...errors.emailE,
            emptyState: true,
          },
        }
      })
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          emailE: {
            ...errors.emailE,
            emptyState: false,
          },
        }
      })
    }
    if (companyData.description === '') {
      console.log("Descrıptıon error else if in deyim.'")
      setErrors((prev) => {
        return {
          ...prev,
          descriptionE: {
            ...errors.descriptionE,
            emptyState: true,
          },
        }
      })
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          descriptionE: {
            ...errors.descriptionE,
            emptyState: false,
          },
        }
      })
    }
    if (companyData.phone === '') {
      console.log("Phone error else if in deyim.'")
      setErrors((prev) => {
        return {
          ...prev,
          phoneE: {
            ...errors.phoneE,
            emptyState: true,
          },
        }
      })
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          phoneE: {
            ...errors.phoneE,
            emptyState: false,
          },
        }
      })
    }

    console.log(errors)

    if (
      companyData.companyName !== '' &&
      companyData.description !== '' &&
      companyData.email !== '' &&
      companyData.phone !== ''
    ) {
      console.log('suan datalari guncelleyebilirim')
      return false
    } else {
      console.log('suan datalari guncelleyemem.')
      return true
    }
  }

  const createCompany = async (e) => {
    e.preventDefault()
    console.log(emptyControl())
    if (emptyControl() === false) {
      setSpinnerControl(true)
      console.log('sirket yok')
      let url = await uploadPhoto()
      companyData.isApproved = false
      companyData.logoUrl=url
      try {
        const result = await API.graphql({
          query: mutations.createCompany,
          variables: { input: companyData },
        })
        console.log(result)
        setSpinnerControl(false)
        setIsThereCompany(true)
        setCompanyData(result.data.createCompany)
      } catch (err) {
        console.log(err)
        alert('Şirketiniz oluşturulamamıştır!')
      }
    }
  }

  async function uploadPhoto() {
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
    }
    
  }

  function handleChange(e) {
    console.log(errors)
    if (e.target === undefined) {
      setCompanyData((prev) => {
        return {
          ...prev,
          phone: e,
        }
      })
    } else {
      const { name, value } = e.target
      setCompanyData((prev) => {
        return {
          ...prev,
          [name]: value,
        }
      })
    }
  }

  function handleImage(e) {
    const file = e.target.files[0]
    setLogo(file)
    if (file !== undefined) {
      setCompanyData((prev) => {
        return {
          ...prev,
          logoUrl: URL.createObjectURL(file),
        }
      })
    }
  }

  useEffect(() => {
    getUserCompany()
  }, [])

  console.log(errors)
  console.log(companyData)

  return isThereCompany === null ? (
    <div className='content d-flex justify-content-center align-items-center'>
      <Spinner color='primary' />
    </div>
  ) : spinnerControl === true ? (
    <div className='content d-flex justify-content-center align-items-center'>
      <Spinner color='primary' />
    </div>
  ) : (
    <div className='content'>
      <Container className='approve-cont'>
        <Row>
          <Col className='d-flex justify-content-center'>
            {isThereCompany && (
              <Alert color='warning'>
                <span>Şirketiniz onaylanma aşamasındadır...</span>
              </Alert>
            )}
          </Col>
        </Row>
      </Container>
      <Form onSubmit={createCompany}>
        <Container className='form-cont'>
          <Row>
            <Col className='left' xl='6'>
              <FormGroup>
                <StandardInput
                  labelTitle='Şirket Adı'
                  inputType='text'
                  isRequired={true}
                  inputName='companyName'
                  cssId='exampleName'
                  value={companyData.companyName}
                  onChangeFunc={handleChange}
                  isThereCompany={isThereCompany && true}
                  emptyControl={errors.companyNameE.emptyState}
                  emptyErrorMessage={errors.companyNameE.emptyMessage}
                />
              </FormGroup>
              <FormGroup>
                <StandardInput
                  labelTitle='Email'
                  inputType='email'
                  isRequired={true}
                  inputName='email'
                  cssId='exampleEmail'
                  value={companyData.email}
                  onChangeFunc={handleChange}
                  isThereCompany={isThereCompany && true}
                  emptyControl={errors.emailE.emptyState}
                  emptyErrorMessage={errors.emailE.emptyMessage}
                />
              </FormGroup>
              <FormGroup>
                <StandardInput
                  labelTitle='Açıklama'
                  inputType='textarea'
                  isRequired={true}
                  inputName='description'
                  cssId='exampleDescription'
                  value={companyData.description}
                  onChangeFunc={handleChange}
                  isThereCompany={isThereCompany && true}
                  emptyControl={errors.descriptionE.emptyState}
                  emptyErrorMessage={errors.descriptionE.emptyMessage}
                />
              </FormGroup>
              <FormGroup>
                <PhoneInputCustom
                  labelTitle='TELEFON NUMARASI'
                  isRequired={true}
                  inputName='phone'
                  value={companyData.phone}
                  onChangeFunc={handleChange}
                  isThereCompany={isThereCompany && true}
                  emptyControl={errors.phoneE.emptyState}
                  emptyErrorMessage={errors.phoneE.emptyMessage}
                />
              </FormGroup>
              <FormGroup>
                <UploadPhoto
                  imgSrc={
                    companyData.logoUrl === ''
                      ? NoImageView
                      : companyData.logoUrl
                  }
                  isThereCompany={isThereCompany && true}
                  onChangeFunc={handleImage}
                />
              </FormGroup>
            </Col>
            <Col xl='6'>test12</Col>
          </Row>
          <Row>
            <Col>
              {isThereCompany === true ? null : (
                <Button color='danger' type='submit' value='Submit'>
                  ŞİRKET OLUŞTUR
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </Form>
    </div>
  )
}

export default ManageCompanyPage

// console.log('sirket var')
//         delete companyData.updatedAt
//         delete companyData.createdAt
//         delete companyData.owner
//         let companyDetails = await uploadPhoto(companyData)
//         console.log(companyDetails)
//         try {
//           const result = await API.graphql({
//             query: mutations.updateCompany,
//             variables: { input: companyDetails },
//           })
//           console.log(result)
//           setSpinnerControl(false)
//           setIsCreateOrUpdate(true)
//           setTimeout(() => {
//             setIsCreateOrUpdate(null)
//           }, 5000)
//           setCompanyData(result.data.updateCompany)
// } catch (err) {
//   console.log(err)
//   alert('Bilgileriniz güncellenemedi!')
// }
