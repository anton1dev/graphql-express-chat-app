import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  InMemoryCache,
  split,
} from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient as createWsClient } from 'graphql-ws'

import { getAccessToken } from '../auth'
import { getMainDefinition } from '@apollo/client/utilities'
import { Kind, OperationTypeNode } from 'graphql'

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken()
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }
  return forward(operation)
})

const httpLink = concat(
  authLink,
  createHttpLink({ uri: 'https://graphql-chat-server-aa595544a3a1.herokuapp.com/graphql' }),
)

const wsLink = new GraphQLWsLink(
  createWsClient({
    url: 'ws://graphql-chat-server-aa595544a3a1.herokuapp.com/graphql',
    connectionParams: () => ({ accessToken: getAccessToken() }),
  }),
)

export const apolloClient = new ApolloClient({
  link: split(isSubscription, wsLink, httpLink),
  cache: new InMemoryCache(),
})

function isSubscription(operation) {
  const definition = getMainDefinition(operation.query)
  return (
    definition.kind === Kind.OPERATION_DEFINITION &&
    definition.operation === OperationTypeNode.SUBSCRIPTION
  )
}
