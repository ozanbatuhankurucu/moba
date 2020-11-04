import React, { useState, useEffect } from 'react'
import { API } from 'aws-amplify'
import * as mutations from '../../graphql/mutations'
import { listCompanys } from '../../graphql/queries'
import {
  Container,
  Row,
  Col,
  FormGroup,
  Button,
  Spinner,
  Alert,
  Input,
  Label,
} from 'reactstrap'
//Inputs
import MaskedPhoneInput from '../../components/Inputs/MaskedPhone/MaskedPhoneInput'
import MaskedInput from 'react-input-mask'
import StandardInput from '../../components/Inputs/StandardInput'
//Photo Picker
import PickPhoto from '../../components/PhotoPicker/PickPhoto'
//Use Hook Form
import { useForm } from 'react-hook-form'
//Storage Service
import uploadPhoto from '../../helperFunctions/asyncFunctions/storageService'
//Material UI
import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

//Country state city
import csc from 'country-state-city'
//Scss Imports
import './managecompany.scss'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}))

function ManageCompanyPage() {
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    email: '',
    description: '',
    phone: '',
    instagramUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    websiteUrl: '',
  })
  const [isThereCompany, setIsThereCompany] = useState(null)

  const [spinnerControl, setSpinnerControl] = useState(false)

  const [logo, setLogo] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(
    csc.getCountryById('223')
  )
  const [selectedCity, setSelectedCity] = useState()
  const [selectedCityOfState, setSelectedCityOfState] = useState()
  console.log(selectedCountry)
  console.log(selectedCity)
  console.log(selectedCityOfState)
  const { register, handleSubmit, watch, errors } = useForm()

  const [companyAddress, setCompanyAddress] = useState({
    city: '',
    cityOfState: '',
    detailedAddress: '',
  })
  const [companyOwnerInfo,setCompanyOwnerInfo] = useState()
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const steps = getSteps()
  const onSubmit = (data) => {
    if (activeStep === 0) {
      setCompanyInfo(data)
      console.log(data)
    } else if (activeStep === 1) {
      console.log(data)
      setCompanyAddress(data)
    }else if(activeStep ===2){

    }
    handleNext()
  }

  const getUserCompany = async () => {
    try {
      const res = await API.graphql({
        query: listCompanys,
      })
      console.log(res)
      if (res.data.listCompanys.items.length !== 0) {
        console.log('sirket var')
        setCompanyAddress(res.data.listCompanys.items[0])
        setIsThereCompany(true)
      } else {
        console.log('sirket yok')
        setIsThereCompany(false)
      }
    } catch (err) {
      console.log('error getting all companies:', err)
    }
  }

  const createCompany = async (e) => {
    e.preventDefault()

    setSpinnerControl(true)
    console.log('sirket yok')
    let url = await uploadPhoto(logo)
    console.log(url)
    companyAddress.isApproved = false
    companyAddress.logoUrl = url
    try {
      const result = await API.graphql({
        query: mutations.createCompany,
        variables: { input: companyAddress },
      })
      console.log(result)
      setSpinnerControl(false)
      setIsThereCompany(true)
      setCompanyAddress(result.data.createCompany)
    } catch (err) {
      console.log(err)
      alert('Şirketiniz oluşturulamamıştır!')
    }
  }
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }
  function getSteps() {
    return [
      'Şirket Bilgileri',
      'Şirket Adres',
      'Yetkili Bilgileri',
      'Herangi bir alan',
    ]
  }

  function handleImage(e) {
    console.log(e.target.files[0])
    if (e.target.files[0] !== undefined) {
      setLogo(e.target.files[0])
    }
    //setImage(URL.createObjectURL(e.target.files[0]));
  }
  console.log(watch('cityOfState'))
  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <StandardInput
                  labelTitle='Şirket Adı'
                  maxLen={40}
                  inputType='text'
                  isRequired={true}
                  inputName='companyName'
                  refTemp={register({
                    required: 'Şirket ismini lütfen boş geçmeyiniz!',
                  })}
                  defaultVal={companyInfo.companyName}
                  isThereCompany={isThereCompany && true}
                  emptyControl={errors.companyName}
                />
              </FormGroup>

              <FormGroup>
                <StandardInput
                  labelTitle='Şirket Email'
                  maxLen={255}
                  inputType='text'
                  isRequired={true}
                  inputName='email'
                  refTemp={register({
                    required: 'Şirket emailini lütfen boş geçmeyiniz!',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Geçersiz email adresi!',
                    },
                  })}
                  isThereCompany={isThereCompany && true}
                  defaultVal={companyInfo.email}
                  emptyControl={errors.email}
                />
              </FormGroup>
              <FormGroup>
                <StandardInput
                  labelTitle='Açıklama'
                  maxLen={300}
                  inputType='textarea'
                  isRequired={true}
                  inputName='description'
                  refTemp={register({
                    required: 'Şirket açıklamasını lütfen boş geçmeyiniz!',
                  })}
                  isThereCompany={isThereCompany && true}
                  defaultVal={companyInfo.description}
                  emptyControl={errors.description}
                />
              </FormGroup>

              <MaskedPhoneInput
                labelTitle='Telefon'
                inputName='phone'
                isRequired={true}
                refTemp={register({
                  required: 'Şirket telefonunu lütfen boş geçmeyiniz!',
                })}
                defaultVal={companyInfo.phone}
                emptyControl={errors.phone}
                maskedInput={MaskedInput}
                inputMask='0 999 999 9999'
              />

              <FormGroup>
                <PickPhoto
                  handleImage={handleImage}
                  imageUrl={logo !== null ? URL.createObjectURL(logo) : null}
                  labelTitle='Şirket Logosu'
                  isRequired={false}
                />
              </FormGroup>
              <Container>
                <Row>
                  <Col className='p-0 pr-3' xl='6' lg='6' md='6' sm='6' xs='6'>
                    <FormGroup>
                      <StandardInput
                        labelTitle='Instagram Link'
                        maxLen={2000}
                        inputType='text'
                        isRequired={false}
                        inputName='instagramUrl'
                        refTemp={register}
                        isThereCompany={isThereCompany && true}
                        defaultVal={companyInfo.instagramUrl}
                        emptyControl={false}
                      />
                    </FormGroup>
                  </Col>
                  <Col className='p-0' xl='6' lg='6' md='6' sm='6' xs='6'>
                    <FormGroup>
                      <StandardInput
                        labelTitle='Twitter Link'
                        maxLen={2000}
                        inputType='text'
                        isRequired={false}
                        inputName='twitterUrl'
                        refTemp={register}
                        isThereCompany={isThereCompany && true}
                        defaultVal={companyInfo.twitterUrl}
                        emptyControl={false}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className='p-0 pr-3' xl='6' lg='6' md='6' sm='6' xs='6'>
                    <FormGroup>
                      <StandardInput
                        labelTitle='Facebook Link'
                        maxLen={2000}
                        inputType='text'
                        isRequired={false}
                        inputName='facebookUrl'
                        refTemp={register}
                        isThereCompany={isThereCompany && true}
                        defaultVal={companyInfo.facebookUrl}
                        emptyControl={false}
                      />
                    </FormGroup>
                  </Col>
                  <Col className='p-0' xl='6' lg='6' md='6' sm='6' xs='6'>
                    <FormGroup>
                      <StandardInput
                        labelTitle='Website Link'
                        maxLen={2000}
                        inputType='text'
                        isRequired={false}
                        inputName='websiteUrl'
                        refTemp={register}
                        isThereCompany={isThereCompany && true}
                        defaultVal={companyInfo.websiteUrl}
                        emptyControl={false}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Container>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Geri
                  </Button>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant='contained'
                      color='primary'
                      type='submit'
                      className={classes.button}
                      onClick={createCompany}
                    >
                      ŞİRKET OLUŞTUR
                    </Button>
                  ) : (
                    <Button
                      variant='contained'
                      color='primary'
                      type='submit'
                      className={classes.button}
                    >
                      ILERI
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </>
        )
      case 1:
        return (
          <>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label className='lable-title' for='exampleName'>
                  Ülke <span className='star'>*</span>
                </Label>
                <Input
                  type='select'
                  onChange={(x) =>
                    setSelectedCountry(new Object(JSON.parse(x.target.value)))
                  }
                >
                  <option value={JSON.stringify(selectedCountry)}>
                    {selectedCountry.name}
                  </option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label className='lable-title' for='exampleName'>
                  Şehir <span className='star'>*</span>
                </Label>
                <Input
                  type='select'
                  name='city'
                  innerRef={register({
                    required: 'Şehir alanını boş geçmeyiniz!',
                  })}
                  onChange={(x) =>
                    setSelectedCity(new Object(JSON.parse(x.target.value)))
                  }
                  defaultValue={JSON.stringify(selectedCity)}
                >
                  <option value='' selected disabled hidden>
                    Şehir seçiniz
                  </option>

                  {csc
                    .getStatesOfCountry(selectedCountry.id)
                    .map((x, index) => (
                      <option key={index} value={JSON.stringify(x)}>
                        {x.name}
                      </option>
                    ))}
                </Input>
                {errors.city ? (
                  <p style={{ color: 'red' }}>{errors.city.message}</p>
                ) : null}
              </FormGroup>
              <FormGroup>
                <Label className='lable-title' for='exampleName'>
                  İlçe <span className='star'>*</span>
                </Label>
                <Input
                  type='select'
                  name='cityOfState'
                  innerRef={register({
                    required: 'İlçe alanını boş geçmeyiniz!',
                  })}
                  onChange={(x) => {
                    setSelectedCityOfState(JSON.parse(x.target.value))
                  }}
                  defaultValue={JSON.stringify(selectedCityOfState)}
                >
                  {selectedCityOfState !== undefined ? (
                    <option value='' selected disabled hidden>
                      {selectedCityOfState.name}
                    </option>
                  ) : (
                    <option value='' selected disabled hidden>
                      İlçe seçiniz
                    </option>
                  )}

                  {selectedCity !== undefined
                    ? csc.getCitiesOfState(selectedCity.id).map((x, index) => (
                        <option key={index} value={JSON.stringify(x)}>
                          {x.name}
                        </option>
                      ))
                    : null}
                </Input>
                {errors.cityOfState ? (
                  <p style={{ color: 'red' }}>{errors.cityOfState.message}</p>
                ) : null}
              </FormGroup>
              <FormGroup>
                <StandardInput
                  labelTitle='Detaylı Adres'
                  maxLen={300}
                  inputType='textarea'
                  isRequired={true}
                  inputName='detailedAddress'
                  refTemp={register({
                    required: 'Adres alanını boş geçmeyiniz!',
                  })}
                  isThereCompany={isThereCompany && true}
                  defaultVal={companyAddress.detailedAddress}
                  emptyControl={errors.detailedAddress}
                />
              </FormGroup>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Geri
                  </Button>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant='contained'
                      color='primary'
                      className={classes.button}
                      onClick={createCompany}
                    >
                      ŞİRKET OLUŞTUR
                    </Button>
                  ) : (
                    <Button
                      variant='contained'
                      color='primary'
                      type='submit'
                      className={classes.button}
                    >
                      ILERI
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </>
        )

      case 2:
        return (
          <>
            <Container>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col className='p-0 pr-3' xl='6' lg='6' md='6' sm='6' xs='6'>
                    <FormGroup>
                      <StandardInput
                        labelTitle='Yetkili Adı'
                        maxLen={100}
                        inputType='text'
                        isRequired={true}
                        inputName='ownerName'
                        refTemp={register({
                          required: 'Yetkili adını lütfen boş geçmeyiniz!',
                        })}
                        isThereCompany={isThereCompany && true}
                        defaultVal={companyAddress.ownerName}
                        emptyControl={errors.ownerName}
                      />
                    </FormGroup>
                  </Col>
                  <Col className='p-0' xl='6' lg='6' md='6' sm='6' xs='6'>
                    <FormGroup>
                      <StandardInput
                        labelTitle='Yetkili Soyadı'
                        maxLen={100}
                        inputType='text'
                        isRequired={true}
                        inputName='ownerSurname'
                        refTemp={register({
                          required: 'Yetkili soyadını lütfen boş geçmeyiniz!',
                        })}
                        isThereCompany={isThereCompany && true}
                        defaultVal={companyAddress.ownerSurname}
                        emptyControl={errors.ownerSurname}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className='p-0 pr-3' xl='6' lg='6' md='6' sm='6' xs='6'>
                    <FormGroup>
                      <StandardInput
                        labelTitle='Yetkili Telefon'
                        maxLen={100}
                        inputType='text'
                        isRequired={true}
                        inputName='ownerPhone'
                        refTemp={register({
                          required: 'Yetkili telefonunu lütfen boş geçmeyiniz!',
                        })}
                        isThereCompany={isThereCompany && true}
                        defaultVal={companyAddress.ownerPhone}
                        emptyControl={errors.ownerPhone}
                      />
                    </FormGroup>
                  </Col>
                  <Col className='p-0' xl='6' lg='6' md='6' sm='6' xs='6'>
                    <FormGroup>
                      <StandardInput
                        labelTitle='Yetkili Email'
                        maxLen={255}
                        inputType='text'
                        isRequired={true}
                        inputName='ownerEmail'
                        refTemp={register({
                          required: 'Şirket emailini lütfen boş geçmeyiniz!',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Geçersiz email adresi!',
                          },
                        })}
                        isThereCompany={isThereCompany && true}
                        defaultVal={companyAddress.ownerEmail}
                        emptyControl={errors.ownerEmail}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </form>
              <Row>
                <Col className='p-0'>
                  <div className={classes.actionsContainer}>
                    <div>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.button}
                      >
                        Geri
                      </Button>
                      {activeStep === steps.length - 1 ? (
                        <Button
                          variant='contained'
                          color='primary'
                          className={classes.button}
                          onClick={createCompany}
                        >
                          ŞİRKET OLUŞTUR
                        </Button>
                      ) : (
                        <Button
                          variant='contained'
                          color='primary'
                          type='submit'
                          className={classes.button}
                        >
                          ILERI
                        </Button>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </>
        )
      case 3:
        return (
          <>
            <div>case 3</div>
          </>
        )
      default:
        return 'Unknown step'
    }
  }

  useEffect(() => {
    getUserCompany()
  }, [])
  console.log(errors)
  console.log(activeStep)
  console.log(companyAddress)
  console.log(selectedCountry)
  console.log(selectedCity)
  console.log(selectedCityOfState)

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

      <Container className='form-cont'>
        <Row>
          <Col className='left' xl='6'>
            <div className={classes.root}>
              <Stepper activeStep={activeStep} orientation='vertical'>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      <div>{getStepContent(index)}</div>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length && (
                <Paper square elevation={0} className={classes.resetContainer}>
                  <Typography>
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Button onClick={handleReset} className={classes.button}>
                    Reset
                  </Button>
                </Paper>
              )}
            </div>
          </Col>
          <Col xl='6'>test</Col>
        </Row>
      </Container>
    </div>
  )
}

export default ManageCompanyPage

// {/* register your input into the hook by invoking the "register" function */}
// <input name='example' ref={register({ required: true })} />
// {errors.example && <span>This field is required</span>}
// {/* include validation with required or other standard HTML validation rules */}
// <input name='exampleRequired' ref={register({ required: true })} />
// {/* errors will return when field validation fails  */}
// {errors.exampleRequired && <span>This field is required</span>}

// function handleImage(e) {
//   const file = e.target.files[0]
//   setLogo(file)
//   if (file !== undefined) {
//     setCompanyData((prev) => {
//       return {
//         ...prev,
//         logoUrl: URL.createObjectURL(file),
//       }
//     })
//   }
// }
