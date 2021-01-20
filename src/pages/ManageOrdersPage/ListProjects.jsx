import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Label,
  FormGroup,
  Input,
} from 'reactstrap'
import { API } from 'aws-amplify'
import * as queries from '../../graphql/queries'
import * as mutations from '../../graphql/mutations'
import { DatePicker, Space } from 'antd'
import moment from 'moment'
const { RangePicker } = DatePicker
function ListProjects() {
  const [modal, setModal] = useState(false)
  const [company, setCompany] = useState(null)
  const [project, setProjects] = useState(null)
  const [deadline,setDeadline] = useState(null)
  const [projectInfo, setProjectInfo] = useState({
    projectName: '',
    deadline: '',
    estimatedCost: '',
    technologies: '',
  })
  const toggle = () => setModal(!modal)
  console.log(company)
  console.log(projectInfo)
  async function handleSubmit(event) {
    event.preventDefault()
    const projectDetails = {
      projectName: projectInfo.projectName,
      deadline: '['+ moment(deadline[0]._d).format('LLLL')+' - '+ moment(deadline[1]._d).format('LLLL')+']',
      estimatedCost: projectInfo.estimatedCost,
      technologies: projectInfo.technologies,
      projectCompanyId: company.id,
    }

    const result = await API.graphql({
      query: mutations.createProject,
      variables: { input: projectDetails },
    })
    console.log(result.data.createProject)
    //setCompanies([result.data.createProject])
    toggle()
  }

  function handleChange(event) {
    const { name, value } = event.target
    setProjectInfo((prev) => {
      return {
        ...prev,
        [name]: value,
      }
    })
  }
  const getAllCompanies = async () => {
    // Simple query
    const allCompanies = await API.graphql({ query: queries.listCompanys })
    console.log(allCompanies)
    //console.log(allCompanies.data.listCompanys.items)
    setCompany(allCompanies.data.listCompanys.items[0])
  }

  useEffect(() => {
    getAllCompanies()
  }, [])
  return (
    <div className='content'>
      <Modal isOpen={modal} toggle={toggle}>
        <Form className='company-form' onSubmit={handleSubmit}>
          <ModalHeader toggle={toggle}></ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for='exampleEmail'>
                Project Name<span style={{ color: 'red' }}>*</span>
              </Label>
              <Input
                type='text'
                name='projectName'
                id='exampleEmail'
                placeholder='Project Name'
                required
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label className='d-block' for='examplePassword'>
                Deadline<span style={{ color: 'red' }}>*</span>
              </Label>
              <RangePicker 
              onChange={(data)=> setDeadline(data)}
              required
              style={{width:'100%'}} />
            </FormGroup>
            <FormGroup>
              <Label for='examplePassword'>
                Estimated Cost<span style={{ color: 'red' }}>*</span>
              </Label>
              <Input
                type='text'
                name='estimatedCost'
                id='examplePassword'
                placeholder=' Estimated Cost'
                required
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for='examplePassword'>
                Technologies<span style={{ color: 'red' }}>*</span>
              </Label>
              <Input
                type='text'
                name='technologies'
                id='examplePassword'
                placeholder='Technologies'
                required
                onChange={handleChange}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' type='submit'>
              Create
            </Button>{' '}
          </ModalFooter>{' '}
        </Form>
      </Modal>
      <div>
        <Button className='float-right' color='success' onClick={toggle}>
          Create Project
        </Button>
      </div>
    </div>
  )
}

export default ListProjects
