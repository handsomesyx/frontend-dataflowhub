import { gql } from '@apollo/client';

/**
 * @description 登录接口
 */
export const login = gql`
  mutation login($username: String!, $password: String!) {
    login(data: { username: $username, password: $password }) {
      accessToken
      refreshToken
      user {
        role
        id_card
        username
        id
        real_name
      }
    }
  }
`;

/**
 * @description 获取新的accesstoken
 */
export const RefreshToken = gql`
  mutation refreshToken($refresh_token: JWT!) {
    refreshToken(token: $refresh_token) {
      accessToken
      refreshToken
    }
  }
`;
