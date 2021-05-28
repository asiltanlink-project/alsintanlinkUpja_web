import React from 'react';
import {
  Card,
  Col,
  Row,
  FormGroup,
  Label,
  Button,
  CardBody,
  CardFooter,
  Input
} from 'reactstrap';
import Page from 'components/Page';
import ReactInputVerificationCode from 'react-input-verification-code';
import logo200Image from 'assets/img/logo/logo.png';
import * as myUrl from './urlLink';

import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import './VerifikasiOTP.css';

import { MdAutorenew, MdLoyalty } from 'react-icons/md';

class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: '',
      timerSecond: 59,
      timeUp: 'block',
      timeUpMessage: '',
      loading: false,
      loadingOTP: false,
      kirimUlang: 'none',
      login: 'block',
    };
  }

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

  updateOTPInput(evt) {
    this.setState(
      {
        otp: evt.target.value,
      },
      () => console.log('OTP INPUT', this.state.otp),
    );
  }
  handleChange = (OTP) => {
    this.setState({ otp: OTP }, () => console.log('ISINYA', this.state.otp));
  };

  onOTPChange = e => {
    const otp = e.target.value;
    this.setState({ otp: otp });
  };

  tickTock() {
    let interval = null;
    interval = setInterval(() => {
      if (this.state.timerSecond > 0) {
        this.setState({
          timerSecond: this.state.timerSecond - 1,
          kirimUlang: 'none',
          login: 'block',
          timeUp: 'block',
        });
      }
      if (this.state.timerSecond === 0) {
        clearInterval(interval);
        this.setState({
          timeUpMessage: 'Waktu Habis, Silahkan kirim Ulang OTP anda',
          kirimUlang: 'block',
          login: 'block',
          timeUp: 'none',
        });
        // setCaptcha("block");
      }
    }, 1000);
  }

  kirimUlangOTP() {
    var url = myUrl.url_resendOTP;
    var email = window.localStorage.getItem('emailPhone');
    this.setState({ loadingOTP: true });

    var payload = {
      email: email,
      otp_code: this.state.otp,
    };

    console.log('ISI PAYLOAD', payload);

    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        // "Authorization": window.localStorage.getItem('tokenLogin')
      },
      body: JSON.stringify(payload),
    };

    fetch(url, option)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({ loadingOTP: false });
        }
      })
      .then(data => {
        console.log('data Registrasi', data.result.otp_code);
        if (data.status === 0) {
          this.showNotification(data.result.message, 'error');
          this.setState({ loadingOTP: false });
        } else {
          this.showNotification(data.result.message, 'info');
          document.getElementById('otp').value = '';
          console.log('OTP VALUE', document.getElementById('otp'));
          window.localStorage.setItem('otp', data.result.otp_code);
          this.setState(
            {
              kirimUlang: 'none',
              timerSecond: 59,
              login: 'block',
              timeUp: 'block',
              timeUpMessage: '',
              loadingOTP: false,
              otp: '',
            },
            () => this.tickTock(),
          );
        }
      });
  }

  toLogin() {
    var url = myUrl.url_submitOTP;
    var email = window.localStorage.getItem('emailPhone');
    this.setState({ loading: true });

    var payload = {
      email: email,
      otp_code: this.state.otp,
    };

    console.log('ISI PAYLOAD LOGIN', payload);

    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        // "Authorization": window.localStorage.getItem('tokenLogin')
      },
      body: JSON.stringify(payload),
    };

    fetch(url, option)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({ loading: false });
        }
      })
      .then(data => {
        console.log('data Registrasi', data);
        if (data.status === 0) {
          this.showNotification(data.result.message, 'error');
          this.setState({ loading: false });
        } else {
          this.showNotification(data.result.message, 'info');

          window.location.replace('/login');
        }
      });
  }

  componentDidMount() {
    this.tickTock();
  }
  canBeLogin() {
    return this.state.otp !== '' && this.state.otp.length === 4;
  }

  render() {
    const { loading, loadingOTP } = this.state;
    return (
      <Page>
        <Row
          style={{
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Col md={6} lg={4}>
            <Card body>
              <NotificationSystem
                dismissible={false}
                ref={notificationSystem =>
                  (this.notificationSystem = notificationSystem)
                }
                style={NOTIFICATION_SYSTEM_STYLE}
              />
              <div className="text-center pb-4">
                <img
                  src={logo200Image}
                  className="rounded"
                  style={{ width: 320, height: 80 }}
                  alt="logo"
                />
              </div>
              {/* {//console.log(this.props)} */}
              <FormGroup>
                <Label>Verifikasi OTP Input:</Label>
                <CardBody id="otp">
                  {/* <div className="otpInput">
                    <ReactInputVerificationCode
                      length={4}
                      onChange={this.handleChange}
                      placeholder=""
                      value={this.state.otp}
                    />
                  </div> */}
                  <Input
                    type="text"
                    maxLength='4'
                    autocomplete="off"
                    style={{ textAlign: 'center' }}
                    value={this.state.otp}
                    onChange={(e)=> this.onOTPChange(e)}
                  ></Input>
                  <br></br>
                  <Label style={{ display: this.state.timeUp }}>
                    Sisa Waktu:&nbsp;
                    {this.state.timerSecond} detik
                  </Label>
                </CardBody>
              </FormGroup>
              <Label>{this.state.timeUpMessage}</Label>
              <CardFooter className="text-center">
                <Button
                  block
                  className="btn-round"
                  color="secondary"
                  onClick={() => this.kirimUlangOTP()}
                  size="lg"
                  style={{ display: this.state.kirimUlang }}
                >
                  Kirim Ulang OTP
                </Button>
                <Button
                  block
                  className="btn-round"
                  color="primary"
                  onClick={() => this.toLogin()}
                  size="lg"
                  disabled={!this.canBeLogin() || loading}
                  style={{ display: this.state.login }}
                >
                  {!loading && 'Masuk'}
                  {loading && <MdAutorenew />}
                  {loading && ' Sedang diproses'}
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}
export default AuthPage;
