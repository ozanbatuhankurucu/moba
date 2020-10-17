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
      logoUrl
      isApproved
      instagramUrl
      twitterUrl
      facebookUrl
      websiteUrl
      createdAt
      updatedAt
      owner
    }
  }
`;
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
        logoUrl
        isApproved
        instagramUrl
        twitterUrl
        facebookUrl
        websiteUrl
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
