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
} from 'reactstrap'
//Inputs
import StandardInput from '../../components/Inputs/StandardInput'
import PhoneInputCustom from '../../components/Inputs/PhoneInput'
import UploadPhoto from './UploadPhoto/UploadPhoto'
import NoImageView from '../../assets/images/no-image-view.jpg'
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
  const { register, handleSubmit, watch, errors } = useForm()
  console.log(watch('description'))
  const [companyData, setCompanyData] = useState({
    companyName: '',
    email: '',
    description: '',
    phone: '',
    logoUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    websiteUrl: '',
  })
  const [errorMessages, setErrors] = useState({
    companyNameEMessage: 'Şirket ismini lütfen boş geçmeyiniz!',
    emailEMessage: 'Şirket emailini lütfen boş geçmeyiniz!',
    descriptionEMessage: 'Şirket açıklamasını lütfen boş geçmeyiniz!',
    phoneEMessage: 'Şirket telefonunu lütfen boş geçmeyiniz!',
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

    console.log('create company metodunu tetikledim')

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
  const handleNext = () => {
    if (activeStep === 0) {
      if (
        watch('companyName') !== '' &&
        watch('email') !== '' &&
        watch('description') !== ''
      ) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
      }
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }
  function getSteps() {
    return ['Şirket Bilgileri', 'Create an ad group', 'Create an ad']
  }
  //TODO BIr fonksiyon yaz ve butun input degerlerini orada topla ki kaybolmasin
  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <>
            <FormGroup>
              <StandardInput
                labelTitle='Şirket Adı'
                inputType='text'
                isRequired={true}
                inputName='companyName'
                refTemp={register({ required: true })}
                defaultVal={companyData.companyName}
                isThereCompany={isThereCompany && true}
                emptyControl={errors.companyName}
                emptyErrorMessage={errorMessages.companyNameEMessage}
              />
            </FormGroup>

            <FormGroup>
              <StandardInput
                labelTitle='Şirket Email'
                inputType='email'
                isRequired={true}
                inputName='email'
                refTemp={register({
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Geçersiz mail adresi!',
                  },
                })}
                isThereCompany={isThereCompany && true}
                defaultVal={companyData.email}
                emptyControl={errors.email}
                emptyErrorMessage={errorMessages.emailEMessage}
                emailErrorMessage={errors.email && errors.email.message}
              />
            </FormGroup>
            <FormGroup>
              <StandardInput
                labelTitle='Açıklama'
                inputType='textarea'
                isRequired={true}
                inputName='description'
                refTemp={register({ required: true })}
                isThereCompany={isThereCompany && true}
                emptyControl={errors.description}
                defaultVal={companyData.description}
                emptyErrorMessage={errorMessages.descriptionEMessage}
              />
            </FormGroup>

            {/* <FormGroup>
              <PhoneInputCustom
                labelTitle='Telefon Numarası'
                isRequired={true}
                inputName='phone'
                ref={register({ required: true })}
                isThereCompany={isThereCompany && true}
                emptyControl={errors.phone}
                emptyErrorMessage={errorMessages.phoneEMessage}
              />
            </FormGroup> */}
            {/* <FormGroup>
              <UploadPhoto
                imgSrc={
                  companyData.logoUrl === '' ? NoImageView : companyData.logoUrl
                }
                isThereCompany={isThereCompany && true}
                onChangeFunc={handleImage}
              />
            </FormGroup> */}
            {/* <FormGroup>
              <StandardInput
                labelTitle='Instagram Link'
                inputType='text'
                isRequired={false}
                inputName='instagramUrl'
                refTemp={register}
                isThereCompany={isThereCompany && true}
                emptyControl={false}
              />
            </FormGroup>
            <FormGroup>
              <StandardInput
                labelTitle='Twitter Link'
                inputType='text'
                isRequired={false}
                inputName='twitterUrl'
                refTemp={register}
                isThereCompany={isThereCompany && true}
                emptyControl={false}
              />
            </FormGroup>
            <FormGroup>
              <StandardInput
                labelTitle='Facebook Link'
                inputType='text'
                isRequired={false}
                inputName='facebookUrl'
                refTemp={register}
                isThereCompany={isThereCompany && true}
                emptyControl={false}
              />
            </FormGroup>
            <FormGroup>
              <StandardInput
                labelTitle='Website Link'
                inputType='text'
                isRequired={false}
                inputName='websiteUrl'
                refTemp={register}
                isThereCompany={isThereCompany && true}
                emptyControl={false}
              />
            </FormGroup> */}
          </>
        )
      case 1:
        return 'An ad group contains one or more ads which target a shared set of keywords.'
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
  console.log(activeStep)
  console.log(errorMessages)
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
