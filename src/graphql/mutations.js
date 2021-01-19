/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCompany = /* GraphQL */ `
  mutation CreateCompany(
    $input: CreateCompanyInput!
    $condition: ModelCompanyConditionInput
  ) {
    createCompany(input: $input, condition: $condition) {
      id
      companyName
      description
      email
      phone
      projects {
        items {
          id
          projectName
          deadline
          estimatedCost
          technologies
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateCompany = /* GraphQL */ `
  mutation UpdateCompany(
    $input: UpdateCompanyInput!
    $condition: ModelCompanyConditionInput
  ) {
    updateCompany(input: $input, condition: $condition) {
      id
      companyName
      description
      email
      phone
      projects {
        items {
          id
          projectName
          deadline
          estimatedCost
          technologies
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteCompany = /* GraphQL */ `
  mutation DeleteCompany(
    $input: DeleteCompanyInput!
    $condition: ModelCompanyConditionInput
  ) {
    deleteCompany(input: $input, condition: $condition) {
      id
      companyName
      description
      email
      phone
      projects {
        items {
          id
          projectName
          deadline
          estimatedCost
          technologies
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createProject = /* GraphQL */ `
  mutation CreateProject(
    $input: CreateProjectInput!
    $condition: ModelProjectConditionInput
  ) {
    createProject(input: $input, condition: $condition) {
      id
      company {
        id
        companyName
        description
        email
        phone
        projects {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      projectName
      deadline
      estimatedCost
      technologies
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateProject = /* GraphQL */ `
  mutation UpdateProject(
    $input: UpdateProjectInput!
    $condition: ModelProjectConditionInput
  ) {
    updateProject(input: $input, condition: $condition) {
      id
      company {
        id
        companyName
        description
        email
        phone
        projects {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      projectName
      deadline
      estimatedCost
      technologies
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteProject = /* GraphQL */ `
  mutation DeleteProject(
    $input: DeleteProjectInput!
    $condition: ModelProjectConditionInput
  ) {
    deleteProject(input: $input, condition: $condition) {
      id
      company {
        id
        companyName
        description
        email
        phone
        projects {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      projectName
      deadline
      estimatedCost
      technologies
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createTask = /* GraphQL */ `
  mutation CreateTask(
    $input: CreateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    createTask(input: $input, condition: $condition) {
      id
      name
      status
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateTask = /* GraphQL */ `
  mutation UpdateTask(
    $input: UpdateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    updateTask(input: $input, condition: $condition) {
      id
      name
      status
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteTask = /* GraphQL */ `
  mutation DeleteTask(
    $input: DeleteTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    deleteTask(input: $input, condition: $condition) {
      id
      name
      status
      createdAt
      updatedAt
      owner
    }
  }
`;
