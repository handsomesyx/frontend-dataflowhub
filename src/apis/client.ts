/* eslint-disable no-case-declarations */
import type { FetchResult, GraphQLRequest } from '@apollo/client';
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  Observable,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { message } from 'antd';
import { GraphQLError } from 'graphql/error/GraphQLError';

import { getRefreshToken, loginUser, logout, saveToken } from '../store/SaveToken';
import { RefreshToken } from '.';

function isRefreshRequest(operation: GraphQLRequest) {
  // 这个名称是请求函数的 接口名称 容易混淆
  return operation.operationName === 'refreshToken';
}

// Returns accesstoken if opoeration is not a refresh token request
function returnTokenDependingOnOperation(operation: GraphQLRequest) {
  if (isRefreshRequest(operation)) {
    return getRefreshToken() || '';
  } else {
    return loginUser() || '';
  }
}

const httpLink = createHttpLink({
  uri: `http://${window.location.hostname}:7000/graphql`,
  // uri: '/graphql',
});

const authLink = setContext((operation, { headers }) => {
  let token = returnTokenDependingOnOperation(operation);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export interface GetToken {
  refreshToken: string;
  accessToken: string;
}

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err.extensions.code) {
        case 'FORBIDDEN':
          alert('您的账号在其他地方登入，请重新登入');
          logout();
          break;
        case 'UNAUTHENTICATED': {
          // 改成请求的参数名称
          if (operation.operationName === 'refreshToken') {
            return;
          }

          const observable = new Observable<FetchResult<Record<string, any>>>(
            (observer) => {
              // used an annonymous function for using an async function
              (async () => {
                try {
                  const accessToken = await refreshToken();
                  if (!accessToken) {
                    throw new GraphQLError('Empty AccessToken');
                  }

                  // Retry the failed request
                  const subscriber = {
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                  };

                  forward(operation).subscribe(subscriber);
                } catch (err) {
                  observer.error(err);
                }
              })();
            },
          );

          return observable;
        }
      }
    }
  }

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const apolloClient = new ApolloClient({
  // uri: `http://${window.location.hostname}:7000/graphql`,
  uri: '/graphql',
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    addTypename: false,
  }),
});

// Request a refresh token to then stores and returns the accessToken.
const refreshToken = async () => {
  try {
    const refreshResolverResponse = await apolloClient.mutate<{
      refreshToken: GetToken;
    }>({
      mutation: RefreshToken,
      variables: { refresh_token: getRefreshToken() },
    });
    if (refreshResolverResponse?.errors) {
      throw new Error('123');
    }
    const accessToken = refreshResolverResponse.data?.refreshToken;
    saveToken(accessToken);

    return accessToken?.accessToken;
  } catch (e) {
    // 当刷新token过期的时候，或者是刷新token不正确的时候 ，一般不会发生
    // message.error('用户信息已过期');

    message.error('用户信息已过期,请重新登入');
    setTimeout(() => {
      logout();
    }, 1000);
    // history.replaceState('', '', newUrl);
    // history.pushState('', '', '/login');
    // history.pushState('', '', newUrl); // 不刷新页面
  }
};
