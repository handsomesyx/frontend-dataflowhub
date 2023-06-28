import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { Button, Form, Input, message, Spin } from 'antd';

import { login } from '@/apis';
import { onLogin, saveUserId, saveUserName, saveUserType } from '@/store/SaveToken';

import toptitle from '../../assets/login/denglu_biaoti@2x.png';
import topImg from '../../assets/login/denglu_logo@2x.png';
import styles from './style.module.less';

const Login = () => {
  const [form] = Form.useForm();
  // 登入
  const [getUserInfo, { loading }] = useMutation(login, {
    fetchPolicy: 'network-only',
  });

  const handleClickFinish = (values: any) => {
    if (values.name && values.password) {
      getUserInfo({
        variables: {
          username: values.name,
          password: values.password,
        },
      })
        .then(({ data }) => {
          // 如果登入成功清除之前所有的存储内容
          window.localStorage.clear();
          // 保存token
          onLogin({
            accessToken: data?.login?.accessToken,
            refreshToken: data?.login?.refreshToken,
          });

          saveUserId(data.login?.user?.id);
          // 存储用户信息
          saveUserType(data.login?.user?.role);
          saveUserName(data.login?.user?.username);
          const url = window.location;
          const newUrl = url.origin + '/home';
          setTimeout(() => {
            window.location.href = newUrl;
          }, 300);
        })
        .catch(() => {
          message.open({
            type: 'error',
            content: '账号或密码错误',
          });
          // 写这个是为了强制推到下一个队列执行  确保组件不重新渲染  不然上面的提示弹窗打不开
          setTimeout(() => {
            form.resetFields();
          }, 0);
        });
    }
  };
  return (
    <>
      {loading ? (
        <div className={styles.SpinBox}>
          <Spin size="large"></Spin>
        </div>
      ) : (
        ''
      )}
      <div className={styles.BorderBox}>
        <div>
          <img src={topImg} className={styles.Topicon} />
        </div>
        <div>
          <img src={toptitle} className={styles.TopTitleImg} />
        </div>
        <div>
          <div className={styles.Login}>
            <Form style={{ width: '100%' }} form={form} onFinish={handleClickFinish}>
              <div className={styles.Input}>
                <Form.Item
                  name={'name'}
                  rules={[{ required: true, message: '请输入账号!' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="账号" />
                </Form.Item>

                <Form.Item
                  name={'password'}
                  rules={[{ required: true, message: '请输入密码!' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="密码"
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className={styles.SubButton}>
                    登录
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
