import React, { useState, useEffect } from 'react'
import { API, Auth, Storage } from 'aws-amplify'
import * as mutations from '../../graphql/mutations'
import { listCompanys } from '../../graphql/queries'
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,Alert 
} from 'reactstrap'
import NoImageView from '../../assets/images/no-image-view.jpg'
//uuid for unique id
import { v4 as uuidv4 } from 'uuid'
//Phone Selecter Packages
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
//Scss Imports
import './managecompany.scss'
import config from 'aws-exports'
const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket,
} = config
function ManageCompanyPage() {
  const [isCreateOrUpdate, setIsCreateOrUpdate] = useState(null)
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
    logoE: {
      emptyState: null,
      emptyMessage: 'Şirket logosunu lütfen boş geçmeyiniz!',
    },
  })
  const getCompanies = async () => {
    try {
      const res = await API.graphql({
        query: listCompanys,
      })
      console.log(res)
     if(res.data.listCompanys.items.length!==0){
      setCompanyData(res.data.listCompanys.Items[0])
      setIsThereCompany(true)
     }else{
       setIsThereCompany(false)
     }
    } catch (err) {
      console.log('error getting all companies:', err)
    }
  }
  // const getOwnerCompany = async (companies) => {
  //   let user
  //   try {
  //     user = await Auth.currentAuthenticatedUser()
  //   } catch (err) {
  //     console.log(err)
  //   }
  //   console.log(user)

  //   setUserID(user.attributes.sub)
  //   console.log(companies)
  //   companies.data.listCompanys.items.forEach((element) => {
  //     console.log(user.attributes.sub)
  //     if (element.ownerID === user.attributes.sub) {
  //       console.log('restaurantlar eslesti!')
       
       
  //     }
  //   })
  // }
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
    if (companyData.logoUrl === '') {
      console.log("Logo error else if in deyim.'")
      setErrors((prev) => {
        return {
          ...prev,
          logoE: {
            ...errors.logoE,
            emptyState: true,
          },
        }
      })
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          logoE: {
            ...errors.logoE,
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
      companyData.phone !== '' &&
      companyData.logoUrl !== ''
    ) {
      console.log('suan datalari guncelleyebilirim')
      return false
    } else {
      console.log('suan datalari guncelleyemem.')
      return true
    }
  }

  const createAndUpdateCompany = async (e) => {
    e.preventDefault()

    console.log(emptyControl())

    if (emptyControl() === false) {
      setSpinnerControl(true)
      if (isThereCompany) {
        console.log('sirket var')
        let companyDetails = {
          id: companyData.id,
          companyName: companyData.companyName,
          email: companyData.email,
          description: companyData.description,
          phone: companyData.phone,
          logoUrl: companyData.logoUrl,
        
        }
        console.log(companyDetails)

        companyDetails = await uploadPhoto(companyDetails)
        console.log(companyDetails)
        try {
          const result = await API.graphql({
            query: mutations.updateCompany,
            variables: { input: companyDetails },
          })
          console.log(result)
          setSpinnerControl(false)
          setIsCreateOrUpdate(true)
          setTimeout(() => {
            setIsCreateOrUpdate(null)
          },5000);
          setCompanyData(result.data.updateCompany)
        } catch (err) {
          console.log(err)
          alert('Bilgileriniz güncellenemedi!')
        }
      } else {
        console.log('sirket yok')
        let companyDetails = {
          companyName: companyData.companyName,
          email: companyData.email,
          description: companyData.description,
          phone: companyData.phone,
          logoUrl: companyData.logoUrl,
        }
        companyDetails = await uploadPhoto(companyDetails)
        try {
          const result = await API.graphql({
            query: mutations.createCompany,
            variables: { input: companyDetails },
          })
          console.log(result)
          setSpinnerControl(false)
          setIsCreateOrUpdate(false)
          setTimeout(() => {
            setIsCreateOrUpdate(null)
          },5000);
          setIsThereCompany(true)
          setCompanyData(result.data.createCompany)
        } catch (err) {
          console.log(err)
          alert('Şirketiniz oluşturulamamıştır!')
        }
      }
    }
  }

  async function uploadPhoto(companyDetails) {
    if (logo !== null) {
      const uuid = uuidv4()
      const key = `images/${uuid}${logo.name}`
      const url = `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`
      console.log(url)
      try {
        await Storage.put(key, logo, {
          contentType: logo.type,
        })
        companyDetails.logoUrl = url
      } catch (err) {
        console.log('s3 error:', err)
      }
    }
    return companyDetails
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
    getCompanies()
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
      <Container>
        <Row>
          <Col className='d-flex justify-content-center'>
          {isCreateOrUpdate===null ? null : (isCreateOrUpdate===true ? ( <Alert>Bilgileriniz başarıyla güncellenmiştir! </Alert>) : (<Alert>Şirketiniz başarıyla oluşturulmuştur!</Alert>) ) }
          </Col>
        </Row>
      </Container>
      <Form onSubmit={createAndUpdateCompany}>
        <Container className='form-cont'>
          <Row>
            <Col className='left' xl='6'>
              <FormGroup>
                <Label className='lable-title' for='exampleName'>
                  Şirket Adı<span className='star'>*</span>
                </Label>
                <Input
                  type='text'
                  name='companyName'
                  id='exampleName'
                  value={companyData.companyName}
                  onChange={handleChange}
                />
                {/* Sol taraf true ise sagi donuyor false is null donuyor. */}
                {errors.companyNameE.emptyState && (
                  <mark>{errors.companyNameE.emptyMessage}</mark>
                )}
              </FormGroup>
              <FormGroup>
                <Label className='lable-title' for='exampleEmail'>
                  Email<span className='star'>*</span>
                </Label>
                <Input
                  type='email'
                  name='email'
                  id='exampleEmail'
                  value={companyData.email}
                  onChange={handleChange}
                />
                {errors.emailE.emptyState && (
                  <mark>{errors.emailE.emptyMessage}</mark>
                )}
              </FormGroup>
              <FormGroup>
                <Label className='lable-title' for='exampleDescription'>
                  Açıklama<span className='star'>*</span>
                </Label>
                <Input
                  type='textarea'
                  name='description'
                  id='exampleDescription'
                  value={companyData.description}
                  onChange={handleChange}
                />
                {errors.descriptionE.emptyState && (
                  <mark>{errors.descriptionE.emptyMessage}</mark>
                )}
              </FormGroup>
              <FormGroup>
                <Label className='lable-title' for='examplePhone'>
                  TELEFON NUMARASI<span className='star'>*</span>
                </Label>
                <PhoneInput
                  inputStyle={{ paddingLeft: '48px' }}
                  name='phone'
                  //istenilen ulkeleri ekleyebiliyoruz buraya.
                  onlyCountries={['tr']}
                  country={'tr'}
                  value={companyData.phone}
                  onChange={handleChange}
                />
                {errors.phoneE.emptyState && (
                  <mark>{errors.phoneE.emptyMessage}</mark>
                )}
              </FormGroup>
              <FormGroup>
                <Label className='lable-title' for='examplePhone'>
                  ŞİRKET LOGOSU<span className='star'>*</span>
                </Label>
                <Row className='image-row py-3 m-0'>
                  <Col
                    className='p-0 d-flex flex-column justify-content-around align-items-center'
                    xl='6'
                    lg='6'
                    md='6'
                    sm='6'
                    xs='6'
                  >
                    <img
                      className='company-logo'
                      alt='company-logo'
                      src={
                        companyData.logoUrl === ''
                          ? NoImageView
                          : companyData.logoUrl
                      }
                    ></img>
                  </Col>
                  <Col
                    className='p-0 d-flex justify-content-center align-items-center '
                    xl='6'
                    lg='6'
                    md='6'
                    sm='6'
                    xs='6'
                  >
                    <label htmlFor='upload'>
                      <Input
                        type='file'
                        name='file'
                        id='upload'
                        onChange={handleImage}
                      />
                      <svg>
                        <rect
                          x='0'
                          y='0'
                          fill='none'
                          width='100%'
                          height='100%'
                        />
                      </svg>
                      Logo Yükle
                    </label>
                  </Col>
                  {errors.logoE.emptyState && (
                    <mark>{errors.logoE.emptyMessage}</mark>
                  )}
                </Row>
              </FormGroup>
            </Col>
            <Col xl='6'>test12</Col>
          </Row>
          <Row>
            <Col>
              {isThereCompany === true ? (
                <Button color='info' type='submit' value='Submit'>
                  BİLGİLERİ GÜNCELLE
                </Button>
              ) : (
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
