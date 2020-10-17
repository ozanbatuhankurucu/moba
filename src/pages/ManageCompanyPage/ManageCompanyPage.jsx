import React, { useState, useEffect } from 'react'
import { API } from 'aws-amplify'
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
  const [companyData, setCompanyData] = useState({
    companyName: '',
    email: '',
    description: '',
    phone: '',
    logoUrl: '',
  })
  const [errors, setErrors] = useState({
    companyName: {
      emptyState: null,
      emptyMessage: 'Şirket ismini lütfen boş geçmeyiniz!',
    },
    email: {
      emptyState: null,
      emptyMessage: 'Şirket emailini lütfen boş geçmeyiniz!',
    },
    description: {
      emptyState: null,
      emptyMessage: 'Şirket açıklamasını lütfen boş geçmeyiniz!',
    },
    phone: {
      emptyState: null,
      emptyMessage: 'Şirket telefonunu lütfen boş geçmeyiniz!',
    },
  })
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const steps = getSteps()

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
          companyName: {
            ...errors.companyName,
            emptyState: true,
          },
        }
      })
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          companyName: {
            ...errors.companyName,
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
          email: {
            ...errors.email,
            emptyState: true,
          },
        }
      })
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          email: {
            ...errors.email,
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
          description: {
            ...errors.description,
            emptyState: true,
          },
        }
      })
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          description: {
            ...errors.description,
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
          phone: {
            ...errors.phone,
            emptyState: true,
          },
        }
      })
    } else {
      setErrors((prev) => {
        return {
          ...prev,
          phone: {
            ...errors.phone,
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
    console.log('create company metodunu tetikledim')
    if (emptyControl() === false) {
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
  const handleNext = () => {
    if (activeStep === 0) {
      console.log(emptyControl())
      if (!emptyControl()) {
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
                cssId='exampleName'
                value={companyData.companyName}
                onChangeFunc={handleChange}
                isThereCompany={isThereCompany && true}
                emptyControl={errors.companyName.emptyState}
                emptyErrorMessage={errors.companyName.emptyMessage}
              />
            </FormGroup>
            <FormGroup>
              <StandardInput
                labelTitle='Şirket Email'
                inputType='email'
                isRequired={true}
                inputName='email'
                cssId='exampleEmail'
                value={companyData.email}
                onChangeFunc={handleChange}
                isThereCompany={isThereCompany && true}
                emptyControl={errors.email.emptyState}
                emptyErrorMessage={errors.email.emptyMessage}
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
                emptyControl={errors.description.emptyState}
                emptyErrorMessage={errors.description.emptyMessage}
              />
            </FormGroup>
            <FormGroup>
              <PhoneInputCustom
                labelTitle='Telefon Numarası'
                isRequired={true}
                inputName='phone'
                value={companyData.phone}
                onChangeFunc={handleChange}
                isThereCompany={isThereCompany && true}
                emptyControl={errors.phone.emptyState}
                emptyErrorMessage={errors.phone.emptyMessage}
              />
            </FormGroup>
            <FormGroup>
              <UploadPhoto
                imgSrc={
                  companyData.logoUrl === '' ? NoImageView : companyData.logoUrl
                }
                isThereCompany={isThereCompany && true}
                onChangeFunc={handleImage}
              />
            </FormGroup>
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
                              onClick={handleNext}
                              className={classes.button}
                            >
                              ILERI
                            </Button>
                          )}
                        </div>
                      </div>
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
