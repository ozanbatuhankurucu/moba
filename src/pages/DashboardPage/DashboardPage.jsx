import React, { useEffect, useState } from 'react'
import { API } from 'aws-amplify'
import * as queries from '../../graphql/queries'
import * as mutations from '../../graphql/mutations'
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Spinner,
  Alert,
} from 'reactstrap'
import './dashboardpage.scss'
function DashboardPage() {
  const [companies, setCompanies] = useState(null)
  const [createControl, setCreateControl] = useState(false)
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    description: '',
    email: '',
    phone: '',
  })
  const [visible, setVisible] = useState(false)

  const onDismiss = () => setVisible(false)
  useEffect(() => {
    getAllCompanies()
  }, [])
  console.log(companies)
  const getAllCompanies = async () => {
    // Simple query
    const allCompanies = await API.graphql({ query: queries.listCompanys })
    console.log(allCompanies.data.listCompanys.items)
    setCompanies(allCompanies.data.listCompanys.items)
  }
  async function handleSubmit(event) {
    event.preventDefault()
    const companyDetails = {
      companyName: companyInfo.companyName,
      description: companyInfo.description,
      email: companyInfo.email,
      phone: companyInfo.phone,
    }

    const result = await API.graphql({
      query: mutations.createCompany,
      variables: { input: companyDetails },
    })
    console.log(result.data.createCompany)
    setCompanies([result.data.createCompany])
    setCreateControl(false)
    setVisible(true)
  }
  console.log(companyInfo)
  function handleChange(event) {
    const { name, value } = event.target
    setCompanyInfo((prev) => {
      return {
        ...prev,
        [name]: value,
      }
    })
  }
  return (
    <div className='content'>
      <Container fluid>
        <Row>
          <Col>
            <Alert
              style={{ display: 'inline-block', float: 'right' }}
              color='info'
              isOpen={visible}
              toggle={onDismiss}
            >
              Your company has been successfully established.
            </Alert>
          </Col>
        </Row>
      </Container>
      {createControl === true ? (
        <Container>
          <Row>
            <Col
              style={{ padding: '150px 0' }}
              className='d-flex justify-content-center align-items-center'
            >
              <Form
                className='company-form'
                style={{
                  width: '60%',
                  boxShadow: '0 0 5px #000',
                  borderRadius: '30px',
                  padding: '30px',
                }}
                onSubmit={handleSubmit}
              >
                <FormGroup>
                  <Label for='exampleEmail'>
                    Company Name<span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Input
                    type='text'
                    name='companyName'
                    id='exampleEmail'
                    placeholder='Company Name'
                    required
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for='examplePassword'>
                    Description<span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Input
                    type='text'
                    name='description'
                    id='examplePassword'
                    placeholder='Description'
                    required
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for='examplePassword'>
                    Email<span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Input
                    type='email'
                    name='email'
                    id='examplePassword'
                    placeholder='Email'
                    required
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for='examplePassword'>
                    Phone Number<span style={{ color: 'red' }}>*</span>
                  </Label>
                  <Input
                    type='phone'
                    name='phone'
                    id='examplePassword'
                    placeholder='Phone Number'
                    required
                    onChange={handleChange}
                  />
                </FormGroup>

                <Button
                  color='primary'
                  style={{ float: 'right' }}
                  type='submit'
                >
                  CREATE
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      ) : companies === null ? (
        <div className='d-flex justify-content-center'>
          <Spinner type='grow' color='primary' />
        </div>
      ) : companies.length === 0 ? (
        <Container>
          <Row>
            <Col className='d-flex justify-content-center pt-5'>
              <div
                style={{
                  width: '500px',
                  height: '500px',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: '0 0 5px #000',
                  borderRadius: '30px',
                }}
              >
                <div style={{ width: '70%', textAlign: 'center' }}>
                  <h4>You don't have a company.</h4>
                  <Button
                    color='primary'
                    onClick={() => setCreateControl(true)}
                  >
                    Create Company
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      ) : (
        <Container>
          <Row>
            <Col
              style={{ padding: '150px 0' }}
              className='d-flex justify-content-center align-items-center'
            >
              <div
                className='company-info-cont'
                style={{
                  width: '60%',
                  boxShadow: '0 0 5px #000',
                  borderRadius: '30px',
                  padding: '30px',
                }}
              >
                <Container>
                  <Row>
                    <Col xl='6' lg='5' md='5' sm='4' xs='4'>
                      <span style={{ fontWeight: 'bold' }}>Company Name :</span>
                    </Col>
                    <Col xl='6' lg='7' md='7' sm='8' xs='8'>
                      {companies[0].companyName}
                    </Col>
                  </Row>
                  <Row>
                    <Col xl='6' lg='5' md='5' sm='4' xs='4'>
                      <span style={{ fontWeight: 'bold' }}>Description :</span>
                    </Col>
                    <Col xl='6' lg='7' md='7' sm='8' xs='8'>
                      {companies[0].description}
                    </Col>
                  </Row>
                  <Row>
                    <Col xl='6' lg='5' md='5' sm='4' xs='4'>
                      <span style={{ fontWeight: 'bold' }}>Email :</span>
                    </Col>
                    <Col xl='6' lg='7' md='7' sm='8' xs='8'>
                      <span>{companies[0].email}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl='6' lg='5' md='5' sm='4' xs='4'>
                      <span style={{ fontWeight: 'bold' }}>Phone :</span>
                    </Col>
                    <Col xl='6' lg='7' md='7' sm='8' xs='8'>
                      {companies[0].phone}
                    </Col>
                  </Row>
                </Container>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  )
}

export default DashboardPage
