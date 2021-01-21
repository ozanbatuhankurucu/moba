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
import DataTable from 'react-data-table-component'

function ListTaskModal({
  listTaskModal,
  setListTaskModal,
  toggleListTaskModal,
  project,
}) {
  const columns = [
    {
      name: 'Task Name',
      selector: 'name',
      sortable: true,
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      right: true,
    },
  ]
  console.log(project)
  return (
    <Modal isOpen={listTaskModal} toggle={toggleListTaskModal}>
      <ModalHeader toggle={toggleListTaskModal}>Task List</ModalHeader>
      <ModalBody>
        {project && <DataTable columns={columns} data={project.tasks.items} />}
        {/* <DataTable columns={columns} data={} /> */}
      </ModalBody>
    
    </Modal>
  )
}
export default ListTaskModal
