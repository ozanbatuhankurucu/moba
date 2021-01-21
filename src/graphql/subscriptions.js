/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCompany = /* GraphQL */ `
  subscription OnCreateCompany($owner: String) {
    onCreateCompany(owner: $owner) {
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
export const onUpdateCompany = /* GraphQL */ `
  subscription OnUpdateCompany($owner: String) {
    onUpdateCompany(owner: $owner) {
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
export const onDeleteCompany = /* GraphQL */ `
  subscription OnDeleteCompany($owner: String) {
    onDeleteCompany(owner: $owner) {
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
export const onCreateProject = /* GraphQL */ `
  subscription OnCreateProject($owner: String) {
    onCreateProject(owner: $owner) {
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
`;
export const onUpdateProject = /* GraphQL */ `
  subscription OnUpdateProject($owner: String) {
    onUpdateProject(owner: $owner) {
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
`;
export const onDeleteProject = /* GraphQL */ `
  subscription OnDeleteProject($owner: String) {
    onDeleteProject(owner: $owner) {
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
`;
export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask($owner: String) {
    onCreateTask(owner: $owner) {
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
`;
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask($owner: String) {
    onUpdateTask(owner: $owner) {
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
`;
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask($owner: String) {
    onDeleteTask(owner: $owner) {
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
`;
