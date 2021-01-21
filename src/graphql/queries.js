/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCompany = /* GraphQL */ `
  query GetCompany($id: ID!) {
    getCompany(id: $id) {
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
`
export const listCompanys = /* GraphQL */ `
  query ListCompanys(
    $filter: ModelCompanyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCompanys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
            tasks {
              items {
                id
                name
                status
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
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`
export const getProject = /* GraphQL */ `
  query GetProject($id: ID!) {
    getProject(id: $id) {
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
      tasks {
        items {
          id
          name
          status
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
`
export const listProjects = /* GraphQL */ `
  query ListProjects(
    $filter: ModelProjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        company {
          id
          companyName
          description
          email
          phone
          createdAt
          updatedAt
          owner
        }
        projectName
        deadline
        estimatedCost
        technologies
        tasks {
          items {
            id
            name
            status
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
      nextToken
    }
  }
`
export const getTask = /* GraphQL */ `
  query GetTask($id: ID!) {
    getTask(id: $id) {
      id
      name
      status
      project {
        id
        company {
          id
          companyName
          description
          email
          phone
          createdAt
          updatedAt
          owner
        }
        projectName
        deadline
        estimatedCost
        technologies
        tasks {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      createdAt
      updatedAt
      owner
    }
  }
`
export const listTasks = /* GraphQL */ `
  query ListTasks(
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        status
        project {
          id
          projectName
          deadline
          estimatedCost
          technologies
          createdAt
          updatedAt
          owner
        }
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`
