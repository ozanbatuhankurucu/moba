import React, { useState } from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Label,
  FormGroup,
  Input,
} from 'reactstrap'
import { API } from 'aws-amplify'
import * as mutations from '../../graphql/mutations'

function CreateTaskModal({
  createTaskModal,
  setCreateTaskModal,
  toggleCreateTaskModal,
  createTaskProject,
  getAllCompanies,
}) {
  const [taskInfo, setTaskInfo] = useState({
    name: '',
    status: '',
  })
  console.log(createTaskProject)
  async function handleSubmit(event) {
    event.preventDefault()
    const taskDetails = {
      name: taskInfo.name,
      status: taskInfo.status,
      taskProjectId: createTaskProject.id,
    }

    const result = await API.graphql({
      query: mutations.createTask,
      variables: { input: taskDetails },
    })
    getAllCompanies()
    toggleCreateTaskModal()
  }
  function handleChange(event) {
    const { name, value } = event.target
    setTaskInfo((prev) => {
      return {
        ...prev,
        [name]: value,
      }
    })
  }
  return (
    <Modal isOpen={createTaskModal} toggle={toggleCreateTaskModal}>
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggleCreateTaskModal}>Create Task</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for='exampleEmail'>
              Task Name<span style={{ color: 'red' }}>*</span>
            </Label>
            <Input
              type='text'
              name='name'
              id='exampleEmail'
              placeholder='Task Name'
              required
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for='exampleEmail'>
              Status<span style={{ color: 'red' }}>*</span>
            </Label>
            <Input
              type='text'
              name='status'
              id='exampleEmail'
              placeholder='Status'
              required
              onChange={handleChange}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' type='submit'>
            Create Task
          </Button>
        </ModalFooter>
      </Form>{' '}
    </Modal>
  )
}
export default CreateTaskModal
