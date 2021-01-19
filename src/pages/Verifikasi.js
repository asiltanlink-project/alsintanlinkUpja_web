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
} from 'reactstrap';
import Page from 'components/Page';
import ReactInputVerificationCode from 'react-input-verification-code';
import logo200Image from 'assets/img/logo/logo.png';
import * as myUrl from './urlLink';

import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import './VerifikasiOTP.css';

import { Md3DRotation, MdLoyalty } from 'react-icons/md';

class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: '',
      timerSecond: 59,
      timeUp: 'block',
      timeUpMessage: '',
      loading: false,
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
  handleChange = OTP => {
    this.setState({ otp: OTP }, () => console.log('ISINYA', this.state.otp));
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
          login: 'none',
          timeUp: 'none',
        });
        // setCaptcha("block");
      }
    }, 1000);
  }

  componentDidMount() {
    this.tickTock();
  }
  canBeLogin() {
    return this.state.otp !== '' && this.state.otp.length === 6;
  }

  render() {
    const { loading } = this.state;
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
                  <div className="otpInput">
                    <ReactInputVerificationCode
                      length={6}
                      onChange={this.handleChange}
                      placeholder=""
                    />
                  </div>
                  <br></br>
                  <Label style={{ display: this.state.timeUp }}>
                    Sisa Waktu:&nbsp;
                    {this.state.timerSecond} detik
                  </Label>
                </CardBody>
              </FormGroup>
              <Label>{this.state.timeUpMessage}</Label>
              <Button
                block
                className="btn-round"
                color="info"
                // onClick={() => kirimUlangCaptcha()}
                // onClick={() => sendVerificationCodeFirst()}
                size="lg"
                style={{ display: this.state.kirimUlang }}
              >
                Kirim Ulang OTP
              </Button>
              <CardFooter className="text-center">
                <Button
                  block
                  className="btn-round"
                  color="info"
                  //   onClick={() => toLogin()}
                  size="lg"
                  disabled={!this.canBeLogin() || loading}
                  style={{ display: this.state.login }}
                >
                  {!loading && 'Masuk'}
                  {loading && <Md3DRotation />}
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
