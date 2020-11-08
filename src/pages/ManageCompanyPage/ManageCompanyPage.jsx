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
import uploadFile from '../../helperFunctions/asyncFunctions/storageService'
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
  const [companyType, setCompanyType] = useState(null)
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    email: '',
    description: '',
    phone: '',
    companyLogo: null,
    instagramUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    websiteUrl: '',
  })
  const [companyAddress, setCompanyAddress] = useState({
    city: '',
    cityOfState: '',
    detailedAddress: '',
  })
  const [companyOwnerInfo, setCompanyOwnerInfo] = useState({
    ownerName: '',
    ownerSurname: '',
    ownerPhone: '',
    ownerEmail: '',
  })
  const [companyDocuments, setCompanyDocuments] = useState({
    taxNum: '',
    taxAdministration: '',
    taxPlate: null,
  })
  const [isThereCompany, setIsThereCompany] = useState(null)

  const [spinnerControl, setSpinnerControl] = useState(false)

  const [logo, setLogo] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(
    csc.getCountryById('223')
  )
  const [selectedCity, setSelectedCity] = useState()
  const [selectedCityOfState, setSelectedCityOfState] = useState()
  console.log(companyDocuments)
  console.log(companyOwnerInfo)
  console.log(companyAddress)
  console.log(companyInfo)
  const { register, handleSubmit, watch, errors } = useForm()

  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const steps = getSteps()

  const onSubmit = (data) => {
    console.log(data)
    if (activeStep === 0) {
      setCompanyInfo(data)
    } else if (activeStep === 1) {
      console.log(data)
      setCompanyAddress(data)
    } else if (activeStep === 2) {
      setCompanyOwnerInfo(data)
    } else if (activeStep === 3) {
      setCompanyDocuments(data)
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
    let url = await uploadFile(logo)
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
      'Belgeler',
      'Banka Bilgileri',
    ]
  }

  function handleImage(e) {
    console.log(e.target.files[0])
    if (e.target.files[0] !== undefined) {
      setLogo(e.target.files[0])
    }
    //setImage(URL.createObjectURL(e.target.files[0]));
  }

  function NextBackButtons() {
    return (
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
              // onClick={handleNext}
              className={classes.button}
            >
              ILERI
            </Button>
          )}
        </div>
      </div>
    )
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
                  inputName='companyLogo'
                  refTemp={register}
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
                  defaultVal={companyAddress.detailedAddress}
                  emptyControl={errors.detailedAddress}
                />
              </FormGroup>
              <NextBackButtons />
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
                        defaultVal={companyOwnerInfo.ownerName}
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
                        defaultVal={companyOwnerInfo.ownerSurname}
                        emptyControl={errors.ownerSurname}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className='p-0 pr-3' xl='6' lg='6' md='6' sm='6' xs='6'>
                    <FormGroup>
                      <MaskedPhoneInput
                        labelTitle='Yetkili Telefon'
                        inputName='ownerPhone'
                        isRequired={true}
                        refTemp={register({
                          required: 'Yetkili telefonunu lütfen boş geçmeyiniz!',
                        })}
                        defaultVal={companyOwnerInfo.ownerPhone}
                        emptyControl={errors.ownerPhone}
                        maskedInput={MaskedInput}
                        inputMask='0 999 999 9999'
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
                        defaultVal={companyOwnerInfo.ownerEmail}
                        emptyControl={errors.ownerEmail}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className='p-0'>
                    <NextBackButtons />
                  </Col>
                </Row>
              </form>
            </Container>
          </>
        )
      case 3:
        return (
          <>
            <Container>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col className='p-0' xl='6' lg='6' md='6' sm='6' xs='6'>
                    <Label className='lable-title' for='exampleName'>
                      Şirket Türü <span className='star'>*</span>
                    </Label>
                    <Input
                      type='select'
                      onChange={(e) => setCompanyType(e.target.value)}
                      name='companyType'
                      innerRef={register({
                        required: 'Şirket türünü lütfen boş geçmeyiniz!',
                      })}
                      defaultValue={companyType}
                    >
                      <option value='' selected disabled hidden>
                        Şirket türü seçiniz
                      </option>
                      <option value='person'>Şahıs Şirket</option>
                      <option value='anonym'>Anonim Şirket</option>
                      <option value='limited'>Limited Şirket</option>
                    </Input>
                    {errors.companyType ? (
                      <p style={{ color: 'red' }}>
                        {errors.companyType.message}
                      </p>
                    ) : null}
                  </Col>
                  <Col xl='6' lg='6' md='6' sm='6' xs='6'>
                    {companyType !== null ? (
                      <FormGroup>
                        <StandardInput
                          labelTitle={
                            companyType === 'person'
                              ? 'TC Kimlik No'
                              : 'Vergi Kimlik No'
                          }
                          maxLen={100}
                          inputType='number'
                          isRequired={true}
                          inputName='taxNum'
                          refTemp={register({
                            required:
                              companyType === 'person'
                                ? 'TC Kimlik No alanını lütfen boş geçmeyiniz!'
                                : 'Vergi Kimlik No alanını lütfen boş geçmeyiniz!',
                          })}
                          defaultVal={companyDocuments.taxNum}
                          emptyControl={errors.taxNum}
                        />
                      </FormGroup>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col className='px-0 py-2'>
                    <StandardInput
                      labelTitle='Vergi Dairesi'
                      maxLen={500}
                      inputType='text'
                      isRequired={true}
                      inputName='taxAdministration'
                      refTemp={register({
                        required:
                          'Vergi dairesi alanını lütfen boş geçmeyiniz!',
                      })}
                      defaultVal={companyDocuments.taxAdministration}
                      emptyControl={errors.taxAdministration}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xl='6' lg='6' md='6' sm='6' xs='6'>
                    <FormGroup>
                      <Label className='lable-title' for='exampleName'>
                        Vergi Levhası <span className='star'>*</span>
                      </Label>
                      <Input
                        type='file'
                        name='taxPlate'
                        //onChange={uploadPdf}
                        innerRef={register({
                          required: 'Vergi levhasını yükleyiniz!',
                        })}
                      />
                      {errors.taxPlate ? (
                        <p style={{ color: 'red' }}>
                          {errors.taxPlate.message}
                        </p>
                      ) : null}
                    </FormGroup>
                    <button type='submit'>Gonder</button>
                  </Col>
                  <Col xl='6' lg='6' md='6' sm='6' xs='6'>
                    <FormGroup>
                      <Label for='exampleFile'>File</Label>
                      <Input type='file' name='file' />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className='p-0'>
                    <NextBackButtons />
                  </Col>
                </Row>
              </form>
            </Container>
          </>
        )
      case 4:
        return (
          <>
            <div>Banka Bilgileri</div>
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
  const [pdf, setPdf] = useState(null)
  async function handleStorage(e) {
    e.preventDefault()
    const result = await uploadFile(pdf)
    console.log(result)
  }
  function uploadPdf(e) {
    console.log(e.target.files[0])
    if (e.target.files[0] !== undefined) {
      setPdf(e.target.files[0])
    }
  }
  const onSubmitTemp = (data) => {
    //console.log(data.taxPlate[0])
  }

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
