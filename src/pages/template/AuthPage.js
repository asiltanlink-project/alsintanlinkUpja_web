import AuthForm, { STATE_LOGIN } from 'components/AuthForm';
import React from 'react';
import { Card, Col, Row } from 'reactstrap';
import * as myUrl from '../urlLink';

import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';

import { MdLoyalty } from 'react-icons/md';
import * as firebase from 'firebase/app';
// import 'firebase/analytics'
// const analytics = firebase.analytics()

class AuthPage extends React.Component {
  handleAuthState = authState => {
    if (authState === STATE_LOGIN) {
      this.props.history.push('/login');
    } else {
      this.props.history.push('/lupapassword');
    }
  };

  gotoChangePwd = () => {
    this.props.history.push({
      pathname: '/resetpassword',
      state: { ok: true },
    });
  };

  handleLogoClick = () => {
    this.props.history.push('/login');
  };

  requestLogin = async (email, password) => {
    const urlA = myUrl.url_login;

    var payload = {
      email: email,
      password: password,
    };

    console.log('PAYLOAD', payload);
    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: '',
      },
      body: JSON.stringify(payload),
    };
    let data = await fetch(urlA, option)
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          if (response.status === 401) {
            this.showNotification('Username/Password salah!', 'error');
          } else if (response.status === 500) {
            this.showNotification('Internal Server Error', 'error');
          } else {
            this.showNotification('Koneksi ke server gagal 1', 'error');
          }
          return true;
        }
      })
      .catch(() => {
        this.showNotification('Koneksi ke server gagal!', 'error');
        return true;
      });

    if (data === true) {
      return true;
    }
    if (data) {
      data = await data.json();

      console.log('DATA LOGIN', data);
      var message = data.result.message;
      var profile = data.result.upja;
      var token = data.result.token;
      var status = data.status;

      if (status === 1) {
        this.showNotification(message, 'info');
        window.localStorage.setItem('tokenCookies', token);
        window.localStorage.setItem('profile', JSON.stringify(profile));
        window.location.replace('/');
      } else {
        this.showNotification(message, 'error');
      }
    } else {
      this.showNotification('Koneksi ke server gagal', 'error');
    }
    return true;
  };

  showNotification = (currMessage, levelType) => {
    setTimeout(() => {
      if (!this.notificationSystem) {
        return;
      }
      this.notificationSystem.addNotification({
        title: <MdLoyalty />,
        message: currMessage,
        level: levelType,
      });
    }, 300);
  };

  render() {
    return (
      <Row
        style={{
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* {analytics.logEvent('Halaman Login')} */}
        <Col md={6} lg={4}>
          <Card body>
            <NotificationSystem
              dismissible={false}
              ref={notificationSystem =>
                (this.notificationSystem = notificationSystem)
              }
              style={NOTIFICATION_SYSTEM_STYLE}
            />
            {/* {//console.log(this.props)} */}
            <AuthForm
              authState={this.props.authState}
              onChangeAuthState={this.handleAuthState}
              onLogoClick={this.handleLogoClick}
              onButtonClick={this.requestLogin}
              gotoChangePwd={this.gotoChangePwd}
              showNotification={this.showNotification}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}
export default AuthPage;
