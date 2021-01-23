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
  Alert,
} from 'reactstrap'
import DataTable from 'react-data-table-component'
import { API } from 'aws-amplify'
import * as queries from '../../graphql/queries'
import * as mutations from '../../graphql/mutations'
import { DatePicker, Space } from 'antd'
import moment from 'moment'
import CreateTaskModal from '../../components/CreateTaskModal/CreateTaskModal'
import ListTaskModal from '../../components/ListTaskModal/ListTaskModal'
const { RangePicker } = DatePicker
function ListProjects() {
  const [modal, setModal] = useState(false)
  const [company, setCompany] = useState(null)
  const [project, setProjects] = useState([])
  const [deadline, setDeadline] = useState(null)
  const [createTaskModal, setCreateTaskModal] = useState(false)
  const [createTaskProject, setCreateTaskProject] = useState(null)
  const toggleCreateTaskModal = () => setCreateTaskModal(!createTaskModal)
  const [listTaskModal, setListTaskModal] = useState(false)
  const toggleListTaskModal = () => setListTaskModal(!listTaskModal)
  console.log(company)
  const [projectInfo, setProjectInfo] = useState({
    projectName: '',
    deadline: '',
    estimatedCost: '',
    technologies: '',
  })
  const toggle = () => setModal(!modal)
  const [visible, setVisible] = useState(false)

  const onDismiss = () => setVisible(false)
  console.log(projectInfo)
  async function handleSubmit(event) {
    event.preventDefault()
    const projectDetails = {
      projectName: projectInfo.projectName,
      deadline:
        '[' +
        moment(deadline[0]._d).format('l') +
        ' - ' +
        moment(deadline[1]._d).format('l') +
        ']',
      estimatedCost: projectInfo.estimatedCost,
      technologies: projectInfo.technologies,
      projectCompanyId: company.id,
    }

    const result = await API.graphql({
      query: mutations.createProject,
      variables: { input: projectDetails },
    })
    console.log(result.data.createProject)

    toggle()
    console.log(company.projects.nextToken)
    setProjects((prev) => {
      return [result.data.createProject, ...prev]
    })
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

    setCompany(allCompanies.data.listCompanys.items[0])
    if (allCompanies.data.listCompanys.items[0] !== undefined) {
      setProjects(allCompanies.data.listCompanys.items[0].projects.items)
    }
  }

  useEffect(() => {
    getAllCompanies()
  }, [])
  const data = [{ id: 1, title: 'Conan the Barbarian', year: '1982' }]
  const columns = [
    {
      name: 'Project Name',
      cell: (e) => (
        <span
          style={{
            color: 'rgb(251, 176, 130)',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
          onClick={() => {
            console.log(e)
            setCreateTaskProject(e)
            toggleListTaskModal()
          }}
        >
          {e.projectName}
        </span>
      ),
      sortable: true,
    },
    {
      name: 'Owner',
      selector: 'owner',
      sortable: true,
      right: true,
    },
    {
      name: 'Deadline',
      selector: 'deadline',
      wrap: true,
      sortable: true,
      right: true,
    },
    {
      name: 'Estimated Cost',
      selector: 'estimatedCost',
      sortable: true,
      right: true,
    },
    {
      name: 'Technologies',
      selector: 'technologies',
      sortable: true,
      right: true,
    },
    {
      name: 'Actions',
      cell: (e) => {
        return (
          <div>
            <span
              className='mx-1'
              onClick={() => {
                console.log(e)
                setCreateTaskProject(e)
                toggleListTaskModal()
              }}
            >
              <i class='fas fa-list fa-2x'></i>
            </span>
          </div>
        )
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: 'Add Task',
      cell: (e) => {
        return (
          <Button
            outline
            color='primary'
            onClick={() => {
              console.log(e)
              setCreateTaskProject(e)
              toggleCreateTaskModal()
            }}
          >
            Add Task
          </Button>
        )
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]

  return (
    <div className='content'>
      <Container fluid>
        <Row>
          <Col className='d-flex justify-content-end '>
            <Alert color='info' isOpen={visible} toggle={onDismiss}>
              <span>You cannot create a project without having a company!</span>
            </Alert>
          </Col>
        </Row>
      </Container>

      <ListTaskModal
        listTaskModal={listTaskModal}
        setListTaskModal={setListTaskModal}
        toggleListTaskModal={toggleListTaskModal}
        project={createTaskProject}
      />
      <CreateTaskModal
        createTaskModal={createTaskModal}
        setCreateTaskModal={setCreateTaskModal}
        toggleCreateTaskModal={toggleCreateTaskModal}
        createTaskProject={createTaskProject}
        getAllCompanies={getAllCompanies}
      />

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
                onChange={(data) => setDeadline(data)}
                required
                style={{ width: '100%' }}
              />
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
        <Button
          className='float-right'
          color='success'
          onClick={() => {
            if (company !== undefined) {
              toggle()
            } else {
              setVisible(true)
            }
          }}
        >
          Create Project
        </Button>
      </div>
      <div>
        <DataTable columns={columns} data={project} />
      </div>
    </div>
  )
}

export default ListProjects
