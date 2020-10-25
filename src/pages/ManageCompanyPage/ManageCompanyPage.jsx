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
  const [isThereCompany, setIsThereCompany] = useState(null)

  const [spinnerControl, setSpinnerControl] = useState(false)

  const [logo, setLogo] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(
    csc.getCountryById('223')
  )
  const [selectedCity, setSelectedCity] = useState(
    csc.getStatesOfCountry('223')[0]
  )
  const [selectedCityOfState, setSelectedCityOfState] = useState()
  console.log(selectedCountry)
  console.log(selectedCity)
  console.log(selectedCityOfState)
  const { register, handleSubmit, watch, errors } = useForm()

  const [companyData, setCompanyData] = useState({
    companyName: '',
    email: '',
    description: '',
    phone: '',
    instagramUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    websiteUrl: '',
  })

  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const steps = getSteps()
  const onSubmit = (data) => {
    console.log(data)
    setCompanyData(data)
  }

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

  const createCompany = async (e) => {
    e.preventDefault()

    setSpinnerControl(true)
    console.log('sirket yok')
    let url = await uploadPhoto(logo)
    console.log(url)
    companyData.isApproved = false
    companyData.logoUrl = url
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
  console.log(watch('phone'))
  const handleNext = () => {
    if (activeStep === 0) {
      if (
        watch('companyName') !== '' &&
        watch('email') !== '' &&
        errors.email === undefined &&
        watch('description') !== '' &&
        watch('phone') !== ''
      ) {
        console.log('icerdeyim')
        setCompanyData((prev) => {
          console.log(prev)
          return {
            ...prev,
            companyName: watch('companyName'),
            email: watch('email'),
            description: watch('description'),
            phone: watch('phone'),
            instagramUrl: watch('instagramUrl'),
            twitterUrl: watch('twitterUrl'),
            facebookUrl: watch('facebookUrl'),
            websiteUrl: watch('websiteUrl'),
          }
        })
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
      }
    } else if (activeStep === 1) {
      if (watch('cityOfState') !== '' && watch('detailedAddress') !== '') {
        setCompanyData((prev) => {
          return {
            ...prev,
            detailedAddress: watch('detailedAddress'),
            city: selectedCity.name,
            cityOfState: selectedCityOfState.name,
          }
        })
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
      }
    }
  }
  console.log(selectedCityOfState)
  const handleBack = () => {
    if (activeStep === 1) {
      setCompanyData((prev) => {
        return {
          ...prev,
          detailedAddress: watch('detailedAddress'),
          city: selectedCity.name,
          cityOfState:
            selectedCityOfState !== undefined ? selectedCityOfState.name : '',
        }
      })
      setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }
  }

  const handleReset = () => {
    setActiveStep(0)
  }
  function getSteps() {
    return ['Şirket Bilgileri', 'Şirket Adres', 'Create an ad']
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
                defaultVal={companyData.companyName}
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
                defaultVal={companyData.email}
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
                defaultVal={companyData.description}
                emptyControl={errors.description}
              />
            </FormGroup>
            <FormGroup>
              <StandardInput
                labelTitle='Telefon'
                isRequired={true}
                maxLen={15}
                inputName='phone'
                inputType='tel'
                refTemp={register({
                  required: 'Şirket telefonunu lütfen boş geçmeyiniz!',
                })}
                isThereCompany={isThereCompany && true}
                defaultVal={companyData.phone}
                emptyControl={errors.phone}
              />
            </FormGroup>
            <FormGroup>
              <PickPhoto
                handleImage={handleImage}
                imageUrl={logo !== null ? URL.createObjectURL(logo) : null}
                labelTitle='Şirket Logosu'
                isRequired={false}
              />
            </FormGroup>
            <FormGroup>
              <StandardInput
                labelTitle='Instagram Link'
                maxLen={2000}
                inputType='text'
                isRequired={false}
                inputName='instagramUrl'
                refTemp={register}
                isThereCompany={isThereCompany && true}
                defaultVal={companyData.instagramUrl}
                emptyControl={false}
              />
            </FormGroup>
            <FormGroup>
              <StandardInput
                labelTitle='Twitter Link'
                maxLen={2000}
                inputType='text'
                isRequired={false}
                inputName='twitterUrl'
                refTemp={register}
                isThereCompany={isThereCompany && true}
                defaultVal={companyData.twitterUrl}
                emptyControl={false}
              />
            </FormGroup>
            <FormGroup>
              <StandardInput
                labelTitle='Facebook Link'
                maxLen={2000}
                inputType='text'
                isRequired={false}
                inputName='facebookUrl'
                refTemp={register}
                isThereCompany={isThereCompany && true}
                defaultVal={companyData.facebookUrl}
                emptyControl={false}
              />
            </FormGroup>
            <FormGroup>
              <StandardInput
                labelTitle='Website Link'
                maxLen={2000}
                inputType='text'
                isRequired={false}
                inputName='websiteUrl'
                refTemp={register}
                isThereCompany={isThereCompany && true}
                defaultVal={companyData.websiteUrl}
                emptyControl={false}
              />
            </FormGroup>
          </>
        )
      case 1:
        return (
          <>
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
                onChange={(x) =>
                  setSelectedCity(new Object(JSON.parse(x.target.value)))
                }
                defaultValue={JSON.stringify(selectedCity)}
              >
                {csc.getStatesOfCountry(selectedCountry.id).map((x, index) => (
                  <option key={index} value={JSON.stringify(x)}>
                    {x.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label className='lable-title' for='exampleName'>
                İlçe <span className='star'>*</span>
              </Label>
              <Input
                type='select'
                name='cityOfState'
                innerRef={
                  companyData.cityOfState !== undefined &&
                  companyData.cityOfState !== ''
                    ? null
                    : register({
                        required: 'İlçe alanını boş geçmeyiniz!',
                      })
                }
                defaultValue={
                  selectedCityOfState !== undefined
                    ? JSON.stringify(selectedCityOfState)
                    : null
                }
                onChange={(x) => {
                  setSelectedCityOfState(JSON.parse(x.target.value))
                }}
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
                defaultVal={companyData.detailedAddress}
                emptyControl={errors.detailedAddress}
              />
            </FormGroup>
          </>
        )

      case 2:
        return `Try out different ad text to see what brings in the most customers,
                and learn how to enhance your ads using features like ad extensions.
                If you run into any problems with your ads, find out how to tell if
                they're running and how to resolve approval issues.`
      default:
        return 'Unknown step'
    }
  }

  useEffect(() => {
    getUserCompany()
  }, [])
  console.log(errors)
  console.log(activeStep)
  console.log(companyData)
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
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div>{getStepContent(index)}</div>
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
                                onClick={handleNext}
                              >
                                ILERI
                              </Button>
                            )}
                          </div>
                        </div>
                      </form>
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
