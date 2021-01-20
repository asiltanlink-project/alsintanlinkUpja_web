import logo200Image from 'assets/img/logo/logo.png';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  CardBody,
  Row,
  Col,
} from 'reactstrap';
import * as firebase from 'firebase/app';
import 'firebase/performance';
import 'firebase/auth';
import * as myUrl from 'pages/urlLink';
import { MdAutorenew } from 'react-icons/md';
// global grecaptcha

import Timer from 'components/Timer';

class AuthForm extends React.Component {
  state = {
    username: '',
    password: '',
    confirm: '',
    inputEmailNumber: '',
    OTP: false,
    sendCodeId: '',
    emailOrPhone: true,
    timerMinute: 1,
    timerSecond: 0,
    resetTimer: true,
    loading: false,
    otpValue: '',
    isEnabledOTP: false,
    enterButton: false,
  };

  get isLogin() {
    return this.props.authState === STATE_LOGIN;
  }

  get isCheck() {
    return this.props.authState === STATE_CHECK;
  }

  get isForgetPass() {
    return this.props.authState === STATE_FORGETPASS;
  }

  changeAuthState = authState => event => {
    event.preventDefault();

    this.props.onChangeAuthState(authState);
  };

  handleSubmit = event => {
    event.preventDefault();
  };

  renderButtonText() {
    const { buttonText } = this.props;

    if (!buttonText && this.isLogin) {
      return 'Masuk';
    }

    if (!buttonText && this.isForgetPass) {
      return 'Lupa Kata Sandi';
    }
    return buttonText;
  }

  nextStep = async () => {
    const { username, password, inputEmailNumber } = this.state;
    const filter = /^(?:(([+])?\d{10,13})|(^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$))$/;
    const { buttonText } = this.props;

    var result = inputEmailNumber.match(filter);
    this.setState({ enterButton: true, loading: true });
    this.fetchData();
    if (!buttonText && this.isLogin) {
      //login
      if (true) {
        console.log(await this.props.onButtonClick(username, password));
        setTimeout(() => {
          this.setState({ loading: false, enterButton: false });
        }, 500);
      }
    }

    if (!buttonText && this.isForgetPass) {
      //inputan email
      this.setState({
        emailOrPhone: true,
        enterButton: false,
        loading: false,
      });
      console.log('EMAIL GO', this.state.inputEmailNumber);
      if (
        this.state.inputEmailNumber.includes('@') &&
        this.state.inputEmailNumber.includes('.')
      ) {
        this.forgetpasswordEmail(this.state.inputEmailNumber);
      } else {
        this.forgetpasswordNoHP(this.state.inputEmailNumber);
      }
    }
  };

  fetchData = () => {
    this.setState({ loading: true });
  };

  forgetpasswordEmail(param) {
    var url = myUrl.url_forgetPassword;
    this.setState({ loading: true });

    var payload = {
      email: param,
    };

    console.log('ISI PAYLOAD LOGIN EMAIL', payload);

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

          // window.location.replace('/login');
        }
      })
      .catch(error => {
        console.error('Koneksi Ke Server gagal!', error);
        this.setState({loading:false})
      });
  }

  forgetpasswordNoHP(param) {
    var url = myUrl.url_forgetPassword;
    this.setState({ loading: true });

    var payload = {
      email: param,
    };

    console.log('ISI PAYLOAD HP', payload);

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
          this.setState({ loading: false });
        } else {
          this.showNotification(data.result.message, 'info');
          //  window.location.replace('/verifikasi');
        }
      })
      .catch(error => {
        console.error('Koneksi Ke Server gagal!', error);
        this.setState({loading:false})
      });
  }

  canBeSubmitted() {
    const filter = /^(?:(([\+])?\d{10,13})|(^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$))$/;
    const { inputEmailNumber } = this.state;
    var result = inputEmailNumber.match(filter);
    return inputEmailNumber.length !== 0 && result ? true : false;
  }

  canBeSubmittedLogin() {
    const { username, password } = this.state;
    return username.length !== 0 && password.length !== 0;
  }

  updateValue = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  myFunction() {
    var x = document.getElementById('myInput');
    if (x.type === 'password') {
      document.getElementById('checkbox').checked = true;
      x.type = 'text';
    } else {
      document.getElementById('checkbox').checked = false;
      x.type = 'password';
    }
  }

  autoTab = event => {
    if (event.keyCode !== 8) {
      event.target.focus();
      var currInput = event.target;
      var prevInput = event.target.previousElementSibling;
      var nextInput = event.target.nextElementSibling;
      if (
        document.getElementById('input1').value.length !== 0 &&
        document.getElementById('input2').value.length !== 0 &&
        document.getElementById('input3').value.length !== 0 &&
        document.getElementById('input4').value.length !== 0 &&
        document.getElementById('input5').value.length !== 0 &&
        document.getElementById('input6').value.length !== 0
      ) {
        this.setState({ isEnabledOTP: true });
      } else {
        this.setState({ isEnabledOTP: false });
      }

      if (currInput.id === 'input6' && currInput.value.length > 0) {
        return;
      }
      if (currInput.value.length !== 0 && currInput.value.length === 1) {
        nextInput.disabled = false;
        currInput.disabled = true;
        currInput.blur();
        nextInput.focus();
        nextInput.select();
      } else if (currInput.value.length === 0 && currInput.id !== 'input1') {
        prevInput.disabled = false;
        currInput.disabled = true;
        currInput.blur();
        prevInput.focus();
        prevInput.select();
      }
      //console.log(this.state.isEnabledOTP)
    } else {
      return;
    }
  };

  render() {
    const {
      showLogo,
      usernameLabel,
      usernameInputProps,
      passwordLabel,
      passwordInputProps,
      emailNumberInputProps,
      emailNumberLabel,
      children,
      onLogoClick,
    } = this.props;

    const { OTP, loading } = this.state;

    const isEnabled = this.canBeSubmitted();
    // const isEnabledOTP = this.canBeSubmittedOTP();
    const isEnabledLogin = this.canBeSubmittedLogin();
    return (
      <Form onSubmit={this.handleSubmit}>
        {showLogo && (
          <div className="text-center pb-4">
            <img
              src={logo200Image}
              className="rounded"
              style={{ width: 320, height: 80 }}
              alt="logo"
              onClick={onLogoClick}
            />
          </div>
        )}

        {this.isLogin && (
          <FormGroup>
            <Label for={usernameLabel}>{usernameLabel}</Label>
            <Input
              {...usernameInputProps}
              value={this.state.username}
              onChange={this.updateValue}
              autoComplete="off"
            />
          </FormGroup>
        )}
        {this.isLogin && (
          <FormGroup>
            <Label for={passwordLabel}>{passwordLabel}</Label>
            <Input
              {...passwordInputProps}
              id="myInput"
              value={this.state.password}
              onChange={this.updateValue}
            />
          </FormGroup>
        )}
        {this.isLogin && (
          <Col>
            <Col>
              <Input
                type="checkbox"
                id="checkbox"
                onClick={this.myFunction}
              ></Input>
              <Label>Show Password (F1)</Label>
            </Col>
          </Col>
        )}
        {this.isForgetPass && (
          <FormGroup>
            <Label for={emailNumberLabel}>{emailNumberLabel}</Label>
            <Input
              {...emailNumberInputProps}
              value={this.state.inputEmailNumber}
              disabled={this.state.OTP}
              onChange={this.updateValue}
              autoComplete="off"
            />
            <div style={{ display: 'none' }} id="recaptcha-container"></div>
          </FormGroup>
        )}
        <br />

        <hr />

        {this.isLogin && (
          <Button
            disabled={!isEnabledLogin || loading}
            size="lg"
            className="bg-gradient-theme-left border-0"
            block
            onClick={this.nextStep}
          >
            {!loading && this.renderButtonText()}
            {loading && <MdAutorenew />}
            {loading && 'Sedang diproses'}
          </Button>
        )}
        {this.isForgetPass && !OTP && (
          <Button
            disabled={!isEnabled || loading}
            size="lg"
            className="bg-gradient-theme-left border-0"
            block
            onClick={this.nextStep}
          >
            {!loading && this.renderButtonText()}
            {loading && <MdAutorenew />}
            {loading && 'Sedang diproses'}
          </Button>
        )}

        {!OTP && (
          <div className="text-center pt-1">
            <h6>atau</h6>
            <h6>
              {this.isForgetPass ? (
                <a href="#login" onClick={this.changeAuthState(STATE_LOGIN)}>
                  Masuk
                </a>
              ) : (
                <a
                  href="#forgetpass"
                  onClick={this.changeAuthState(STATE_FORGETPASS)}
                >
                  Lupa Kata Sandi
                </a>
              )}
            </h6>
          </div>
        )}
        {children}
        <Row style={{ marginTop: '10%' }}>
          <Col style={{ textAlign: 'center' }}>
            <Label style={{ marginTop: '8px' }}>
              Jika belum memiliki akun silahkan&nbsp;
            </Label>
            <Label
              style={{
                marginTop: '8px',
                color: '#f26e22',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() => window.location.replace('/registrasi')}
            >
              Registrasi
            </Label>
          </Col>
        </Row>

        <script>
          {
            (document.onkeydown = e => {
              e = e || window.event;
              switch (e.key) {
                // enter untuk simpan
                case 'Enter':
                  if (
                    (isEnabledLogin === true || isEnabled === true) &&
                    this.state.enterButton === false
                  ) {
                    this.nextStep();
                  }
                  // e.preventDefault();
                  //console.log("BISA ENTER CUMI!")
                  break;

                case 'F1':
                  this.myFunction();
                  //console.log(this.myFunction);
                  // alert("F1")
                  e.preventDefault();
                  break;
              }
              //menghilangkan fungsi default tombol
              // e.preventDefault();
            })
          }
        </script>
      </Form>
    );
  }
}

export const STATE_LOGIN = 'LOGIN';
export const STATE_CHECK = 'CHECK';
export const STATE_FORGETPASS = 'FORGETPASS';
export const FLAG_EMAIL = 'EMAIL';
export const FLAG_NUMBER = 'NUMBER';

AuthForm.propTypes = {
  authState: PropTypes.oneOf([STATE_LOGIN, STATE_FORGETPASS]).isRequired,
  showLogo: PropTypes.bool,
  usernameLabel: PropTypes.string,
  usernameInputProps: PropTypes.object,
  passwordLabel: PropTypes.string,
  passwordInputProps: PropTypes.object,
  confirmPasswordLabel: PropTypes.string,
  confirmPasswordInputProps: PropTypes.object,
  phoneNumberInputProps: PropTypes.object,
  emailNumberInputProps: PropTypes.object,
  onLogoClick: PropTypes.func,
  onButtonClick: PropTypes.func,
};

AuthForm.defaultProps = {
  authState: 'LOGIN',
  showLogo: true,
  usernameLabel: 'Email',
  usernameInputProps: {
    type: 'input',
    placeholder: 'Email...',
    name: 'username',
  },
  passwordLabel: 'Password',
  passwordInputProps: {
    type: 'password',
    placeholder: 'Password...',
    name: 'password',
  },
  confirmPasswordLabel: 'Confirm Password',
  confirmPasswordInputProps: {
    type: 'password',
    placeholder: 'confirm your password',
    name: 'confirm',
  },
  emailNumberLabel: 'E-Mail/No. Handphone',
  emailNumberInputProps: {
    type: 'text',
    placeholder: 'Email/No. Handphone...',
    name: 'inputEmailNumber',
  },
  onLogoClick: () => {},
  onButtonClick: () => {},
};

export default AuthForm;
