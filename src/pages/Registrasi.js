import Page from 'components/Page';
import logo200Image from 'assets/img/logo/logo.png';
import React from 'react';
import {
  Button,
  Card,
  InputGroup,
  InputGroupAddon,
  Col,
  Row,
  Label,
  Input,
  Form,
  FormGroup,
  Progress,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from 'reactstrap';
import { MdExitToApp, MdLoyalty, MdList, MdAutorenew } from 'react-icons/md';
import * as myUrl from './urlLink';
// import * as firebase from 'firebase/app';
import { getThemeColors } from 'utils/colors';
import LoadingSpinner from './LoadingSpinner';
import { Redirect } from 'react-router-dom';
import zxcvbn from 'zxcvbn';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import CardBody from 'reactstrap/lib/CardBody';

const colors = getThemeColors();

// const perf = firebase.performance();

class Registrasi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataAvailable: false,
      loading: false,
      input: {},
      password: '',
      confirm: '',
      progress: 0,
      suggestions: [],
      resultProvinsi: [],
      resultKotaKab: [],
      resultKecamatan: [],
      email: '',
      resultClass: [
        {
          class_id: 1,
          class_name: 'Pemula',
        },
        {
          class_id: 2,
          class_name: 'Berkembang',
        },
        {
          class_id: 3,
          class_name: 'Profesional',
        },
      ],
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

  toggle = modalType => () => {
    if (!modalType) {
      return this.setState(
        {
          modal: !this.state.modal,
          keywordList: '',
          realCurrentPages: 1,
          maxPages: 1,
          currentPages: 1,
          ecommerceIDtemp: this.state.ecommerceID,
        },
        // () => this.getProvinsi(1, this.state.todosPerPages),
      );
    }

    this.setState(
      {
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        keywordList: '',
        realCurrentPages: 1,
        maxPages: 1,
        currentPages: 1,
      },
      // () => this.getProvinsi(1, this.state.todosPerPages),
    );
  };

  toggleVerifikasi = modalType => {
    if (!modalType) {
      return this.setState(
        {
          modal: !this.state.modal,
          keywordList: '',
          realCurrentPages: 1,
          maxPages: 1,
          currentPages: 1,
          ecommerceIDtemp: this.state.ecommerceID,
        },
        // () => this.getProvinsi(1, this.state.todosPerPages),
      );
    }

    this.setState(
      {
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        keywordList: '',
        realCurrentPages: 1,
        maxPages: 1,
        currentPages: 1,
      },
      // () => this.getProvinsi(1, this.state.todosPerPages),
    );
  };

  // untuk pilih Class
  setClass = event => {
    var nama = this.state.resultClass.find(function (element) {
      return element.class_id === parseInt(event.target.value);
    });
    this.setState({
      pilihClass: event.target.value,
      namaClass: nama.class_name,
      namaClassTemp: nama.class_name,
      modal_nested_parent_list: false,
    });
  };

  // untuk pilih Provinsi
  setProvinsi = event => {
    var nama = this.state.resultProvinsi.find(function (element) {
      return element.id === parseInt(event.target.value);
    });

    this.setState(
      {
        pilihProvinsi: event.target.value,
        namaProvinsi: nama.name,
        modal_nested_parent_list_provinsi: false,
        keywordList: '',
        domisiliDisabled: false,
      },
      // () => console.log('PILIH PROVINSI', this.state.pilihProvinsi),
      () => this.getKotaKab(this.state.currentPages, this.state.todosPerPages),
    );
  };

  // untuk pilih Kota/Kabupaten
  setKotakab = event => {
    var nama = this.state.resultKotaKab.find(function (element) {
      return element.id === parseInt(event.target.value);
    });

    this.setState(
      {
        pilihKotaKab: event.target.value,
        namaKotaKab: nama.name,
        modal_nested_parent_list_kotakab: false,
        keywordList: '',
        domisiliDisabled: false,
      },
      () =>
        this.getKecamatan(this.state.currentPages, this.state.todosPerPages),
    );
  };

  // untuk pilih Kecamatan
  setKecamatan = event => {
    var nama = this.state.resultKecamatan.find(function (element) {
      return element.id === parseInt(event.target.value);
    });

    this.setState(
      {
        pilihKecamatan: event.target.value,
        namaKecamatan: nama.name,
        modal_nested_parent_list_kecamatan: false,
        keywordList: '',
        domisiliDisabled: false,
      },
      () => this.getProvinsi(this.state.currentPages, this.state.todosPerPages),
    );
  };

  registrasiUpja() {
    var url = myUrl.url_registarsiUpja;
    var input = this.state.input;
    this.setState({ loading: true });

    var payload = {
      name: input.namaLengkap,
      email: this.state.email,
      province: parseInt(this.state.pilihProvinsi),
      city: parseInt(this.state.pilihKotaKab),
      district: parseInt(this.state.pilihKecamatan),
      leader_name: input.namaKepalaDesa,
      village: input.namaDesa,
      class: parseInt(this.state.pilihClass),
      password: this.state.password,
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
          this.setState({ loading: false, modal_nested: false });
          this.toggleVerifikasi('nested_parent_list_verifikasi');
        }
      });
  }

  setDataStatus() {
    if (this.state.result !== null || this.state.result !== undefined) {
      this.setState({
        dataAvailable: true,
      });
    } else {
      this.setState({
        dataAvailable: false,
      });
    }
  }

  // Get Provinsi
  getProvinsi(currPage, currLimit) {
    var offset = (currPage - 1) * currLimit;
    var keyword = this.state.keywordList;
    const urlA = myUrl.url_getProvince;
    console.log('jalan', urlA);
    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };
    fetch(urlA, option)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        console.log('data Provinsi', data.result);
        if (data.status === 0) {
          this.showNotification('Data tidak ditemukan!', 'error');
        } else {
          this.setState(
            {
              resultProvinsi: data.result.provinces,
              // maxPages: data.metadata.pages ? data.metadata.pages : 1,
              loading: false,
            },
            () => this.setDataStatus(),
          );
        }
      });
  }
  // Get KotaKab
  getKotaKab(currPage, currLimit) {
    var offset = (currPage - 1) * currLimit;
    var keyword = this.state.keywordList;
    const urlA = myUrl.url_getCity + '?province_id=' + this.state.pilihProvinsi;
    console.log('jalan kota', urlA);
    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };
    fetch(urlA, option)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        console.log('data Kota/Kabupaten', data.result);
        if (data.status === 0) {
          this.showNotification('Data tidak ditemukan!', 'error');
        } else {
          this.setState(
            {
              resultKotaKab: data.result.citys,
              // maxPages: data.metadata.pages ? data.metadata.pages : 1,
              loading: false,
            },
            () => this.setDataStatus(),
          );
        }
      });
  }

  // Get Kecamatan
  getKecamatan(currPage, currLimit) {
    var offset = (currPage - 1) * currLimit;
    var keyword = this.state.keywordList;
    const urlA = myUrl.url_getDistrict + '?city_id=' + this.state.pilihKotaKab;
    console.log('jalan kecamatan', urlA);
    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };
    fetch(urlA, option)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        console.log('data Kecamatan', data.result);
        if (data.status === 0) {
          this.showNotification('Data tidak ditemukan!', 'error');
        } else {
          this.setState(
            {
              resultKecamatan: data.result.districts,
              // maxPages: data.metadata.pages ? data.metadata.pages : 1,
              loading: false,
            },
            () => this.setDataStatus(),
          );
        }
      });
  }

  componentDidMount() {
    this.getProvinsi();
  }

  state = {
    isOpenNotificationPopover: false,
    isNotificationConfirmed: false,
    isOpenUserCardPopover: false,
    redirect: false,
  };

  redirectOut() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('accessList');
    this.setState({ loading: true }, () => window.location.replace('/login'));
  }

  updateInputValue(value, field, fill) {
    let input = this.state[fill];
    input[field] = value;
    this.setState({ input });
  }

  onPassChange = e => {
    const password = e.target.value;
    this.checkPassword(password);
    this.setState({ password });
  };

  onEmailChange = e => {
    const email = e.target.value;
    this.checkEmail(email);
    this.setState({ email });
  };

  handleConfirmPassword = e => {
    const confirm = e.target.value;
    this.setState({ confirm });
  };

  canBeSubmitted() {
    const { progress } = this.state;
    return progress >= 25;
  }

  canBeSubmittedRegis() {
    const {
      input,
      email,
      password,
      confirm,
      namaProvinsi,
      namaKotaKab,
      namaKecamatan,
      namaClass,
    } = this.state;
    return (
      input.length !== 0 &&
      input.namaLengkap !== '' &&
      input.namaKepalaDesa !== '' &&
      input.namaDesa !== '' &&
      email !== '' &&
      namaProvinsi !== '' &&
      namaKotaKab !== '' &&
      namaKecamatan !== '' &&
      namaClass !== '' &&
      password !== '' &&
      confirm !== '' &&
      password === confirm
    );
  }

  colorProgress() {
    const { progress } = this.state;
    switch (progress) {
      case 0:
        return 'danger';
      case 25:
        return 'danger';
      case 50:
        return 'warning';
      case 75:
        return 'success';
      case 100:
        return '';
      default:
        return 'danger';
    }
  }

  strengthProgress() {
    const { progress } = this.state;
    switch (progress) {
      case 0:
        return '';
      case 25:
        return <b>Lemah</b>;
      case 50:
        return <b>Cukup Baik</b>;
      case 75:
        return <b>Baik!</b>;
      case 100:
        return <b>Sangat Baik!</b>;
      default:
        return '';
    }
  }

  checkPassword(password) {
    var strengthBar = this.state.progress;
    var strongRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])',
    );
    if (password.length === 0) {
      this.setState({
        progress: 0,
      });
      return;
    }
    if (password.length < 6 && password.length > 0) {
      this.setState({
        progress: 0,
        suggestions: ['Panjang harus lebih dari 5 Karakter'],
      });
      return;
    }
    if (password.match(strongRegex)) {
      const evaluation = zxcvbn(password);
      strengthBar = evaluation.score * 25;
      this.setState({ progress: strengthBar, suggestions: [] });
    } else {
      this.setState({
        suggestions: [
          'Password harus mengandung angka, huruf kecil, huruf kapital, dan simbol',
        ],
      });
      return;
    }
  }

  checkConfirmation = () => {
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm').value;
    var messages = document.getElementById('messages');

    if (this.state.confirm.length === 0) {
      messages.innerHTML = '';
      return;
    }
    if (password === confirmPassword) {
      messages.style.color = 'green';
      messages.innerHTML = 'Kata sandi Cocok';
    } else {
      messages.style.color = 'red';
      messages.innerHTML = 'Kata sandi tidak cocok!';
    }
  };

  checkEmail = () => {
    var emailMessages = document.getElementById('emailMessages');
    const { email } = this.state;
    var emailMatch = email.includes('@');

    if (this.state.email.length === 0) {
      emailMessages.innerHTML = '';
      return;
    }
    if (emailMatch === false) {
      emailMessages.style.color = 'red';
      emailMessages.innerHTML = 'Tidak memenuhi format Email';
    } else {
      emailMessages.style.color = 'green';
      emailMessages.innerHTML = 'Email memenuhi format Email';
    }
  };

  render() {
    const { suggestions, loading } = this.state;

    const colorProgress = this.colorProgress();
    const strengthProgress = this.strengthProgress();
    const isEnabled = this.canBeSubmitted();
    const isEnabledRegis = this.canBeSubmittedRegis();

    const provinsiTodos = this.state.resultProvinsi;
    const kotakabTodos = this.state.resultKotaKab;
    const kecamatanTodos = this.state.resultKecamatan;
    const classTodos = this.state.resultClass;

    const renderClass =
      classTodos &&
      classTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.class_name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="primary"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.class_id}
                onClick={this.setClass}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

    const renderProvinsi =
      provinsiTodos &&
      provinsiTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="primary"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.id}
                onClick={this.setProvinsi}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

    const renderKotakab =
      kotakabTodos &&
      kotakabTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="primary"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.id}
                onClick={this.setKotakab}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

    const renderKecamatan =
      kecamatanTodos &&
      kecamatanTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="primary"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.id}
                onClick={this.setKecamatan}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

    return (
      <Page>
        {/* untuk redirect keluar/masuk dalam kondisi boolean */}
        <NotificationSystem
          dismissible={false}
          ref={notificationSystem =>
            (this.notificationSystem = notificationSystem)
          }
          style={NOTIFICATION_SYSTEM_STYLE}
        />
        <Row
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Col>
            <Card>
              <CardBody>
                <Form onSubmit={this.handleSubmit}>
                  {/* untuk tampilan logo */}
                  <div className="text-center pb-4">
                    <img
                      src={logo200Image}
                      className="rounded"
                      style={{ width: 320, height: 80 }}
                      alt="logo"
                    />
                  </div>
                  <Row>
                    <Col
                      style={{
                        textAlign: 'center',
                        fontSize: '1.3em',
                        fontWeight: 'bold',
                      }}
                    >
                      <Label>Form Registrasi</Label>
                      <hr></hr>
                    </Col>
                  </Row>
                  {/* untuk isi nama */}
                  <FormGroup>
                    <Label style={{ textAlign: 'center' }}>Nama Lengkap:</Label>
                    <Input
                      type="text"
                      autoComplete="off"
                      name="namaLengkap"
                      placeholder="Nama Lengkap..."
                      onChange={evt =>
                        this.updateInputValue(
                          evt.target.value,
                          evt.target.name,
                          'input',
                        )
                      }
                      value={this.state.namaLengkap}
                    ></Input>
                  </FormGroup>

                  {/* untuk isi email */}
                  <FormGroup style={{ marginBottom: 0 }}>
                    <Label style={{ textAlign: 'center' }}>Email:</Label>
                    <Input
                      type="email"
                      value={this.state.email.trim()}
                      placeholder="Email.."
                      onChange={this.onEmailChange}
                      id="email"
                      name="email"
                      onKeyUp={this.checkEmail}
                      autoComplete="off"
                    ></Input>
                    <Label
                      style={{ marginBottom: 0, fontSize: '0.8em' }}
                      id="emailMessages"
                    ></Label>
                  </FormGroup>

                  {/* untuk pilh provinsi */}
                  <FormGroup>
                    <Label style={{ textAlign: 'center' }}>
                      Nama Provinsi:
                    </Label>
                    <InputGroup style={{ float: 'right' }}>
                      <Input
                        disabled
                        placeholder="Pilih Provinsi"
                        style={{ fontWeight: 'bold' }}
                        value={this.state.namaProvinsi}
                      />
                      {/* {console.log('ISINYA:', this.state.namaProvinsi)} */}
                      <InputGroupAddon addonType="append">
                        <Button
                          onClick={this.toggle('nested_parent_list_provinsi')}
                        >
                          <MdList />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                  <br></br>
                  <br></br>
                  {/* untuk pilih kota/kabupaten */}
                  <FormGroup>
                    <Label style={{ textAlign: 'center' }}>
                      Nama Kota/Kab:
                    </Label>
                    <InputGroup style={{ float: 'right' }}>
                      <Input
                        disabled
                        placeholder="Pilih Kota/Kab"
                        style={{ fontWeight: 'bold' }}
                        value={this.state.namaKotaKab}
                      />
                      <InputGroupAddon addonType="append">
                        <Button
                          onClick={this.toggle('nested_parent_list_kotakab')}
                        >
                          <MdList />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                  <br></br>
                  <br></br>
                  {/* untuk pilih kecamatan */}
                  <FormGroup>
                    <Label style={{ textAlign: 'center' }}>
                      Nama Kecamatan:
                    </Label>
                    <InputGroup style={{ float: 'right' }}>
                      <Input
                        disabled
                        placeholder="Pilih Kecamatan"
                        style={{ fontWeight: 'bold' }}
                        value={this.state.namaKecamatan}
                      />
                      <InputGroupAddon addonType="append">
                        <Button
                          onClick={this.toggle('nested_parent_list_kecamatan')}
                        >
                          <MdList />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                  <br></br>
                  <br></br>

                  {/* untuk isi kepala desa */}
                  <FormGroup>
                    <Label style={{ textAlign: 'center' }}>
                      Nama Kepala Desa:
                    </Label>
                    <Input
                      autoComplete="off"
                      type="text"
                      name="namaKepalaDesa"
                      placeholder="Nama Kepala Desa..."
                      onChange={evt =>
                        this.updateInputValue(
                          evt.target.value,
                          evt.target.name,
                          'input',
                        )
                      }
                      value={this.state.namaKepalaDesa}
                    ></Input>
                  </FormGroup>

                  {/* untuk isi desa */}
                  <FormGroup>
                    <Label style={{ textAlign: 'center' }}>Nama Desa:</Label>
                    <Input
                      autoComplete="off"
                      type="text"
                      name="namaDesa"
                      placeholder="Nama Desa..."
                      onChange={evt =>
                        this.updateInputValue(
                          evt.target.value,
                          evt.target.name,
                          'input',
                        )
                      }
                      value={this.state.namaDesa}
                    ></Input>
                  </FormGroup>

                  {/* untuk isi class */}
                  <FormGroup>
                    <Label style={{ textAlign: 'center' }}>Kelas:</Label>
                    <InputGroup style={{ float: 'right' }}>
                      <Input
                        disabled
                        placeholder="Pilih Kelas"
                        style={{ fontWeight: 'bold' }}
                        value={this.state.namaClass}
                      />
                      <InputGroupAddon addonType="append">
                        <Button
                          disabled={this.state.typeDisabled}
                          onClick={this.toggle('nested_parent_list')}
                        >
                          <MdList />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                  <br></br>
                  <br></br>

                  {/* untuk isi password */}
                  <FormGroup style={{ marginBottom: 0 }}>
                    <Label>Kata Sandi</Label>
                    <Input
                      type="password"
                      value={this.state.password.trim()}
                      placeholder="Kata Sandi.."
                      onChange={this.onPassChange}
                      id="password"
                      name="password"
                      onKeyUp={this.checkConfirmation}
                      autoComplete="off"
                    />
                    <Progress
                      max="100"
                      value={this.state.progress}
                      style={{ height: '10px' }}
                      animated
                      color={colorProgress}
                    ></Progress>
                    <Label style={{ marginBottom: 0 }} hidden={!isEnabled}>
                      Kekuatan Kata Sandi: {strengthProgress}
                    </Label>
                    <Row>
                      <Col>
                        {suggestions.map((s, index) => (
                          <Label
                            style={{ color: 'red', fontSize: '15px' }}
                            key={index}
                          >
                            {s}
                          </Label>
                        ))}
                      </Col>
                    </Row>
                  </FormGroup>
                  {/* untuk isi konfirmasi password */}
                  <FormGroup>
                    <Label>Konfirmasi Kata Sandi</Label>
                    <Input
                      type="password"
                      placeholder="Kata Sandi.."
                      value={this.state.confirm.trim()}
                      onChange={this.handleConfirmPassword}
                      id="confirm"
                      name="confirm_password"
                      onKeyUp={this.checkConfirmation}
                    />
                    <Label id="messages" style={{ marginBottom: 0 }}></Label>
                  </FormGroup>

                  {/* untuk tampilan masuk/keluar */}
                  <div
                    className="text-center pt-1"
                    style={{ textAlign: 'center' }}
                  >
                    <Col>
                      <Button
                        // block
                        style={{
                          float: 'right',
                          marginLeft: '1%',
                          width: '200px',
                        }}
                        disabled={!isEnabledRegis}
                        color="primary"
                        onClick={this.toggle('nested')}
                        // onClick={this.toggle('nested_parent_list_verifikasi')}
                      >
                        Registrasi UPJA
                      </Button>
                      <Modal
                        onExit={this.handleClose}
                        isOpen={this.state.modal_nested}
                        toggle={this.toggle('nested')}
                      >
                        <ModalHeader>Konfirmasi Registrasi</ModalHeader>
                        <ModalBody>
                          Apakah Anda yakin ingin meregistrasi data ini?
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            disabled={loading}
                            color="primary"
                            onClick={() => this.registrasiUpja()}
                          >
                            {!loading && 'Registrasi UPJA'}
                            {loading && <MdAutorenew />}
                            {loading && 'Sedang diproses'}
                          </Button>{' '}
                          {!loading && (
                            <Button
                              color="secondary"
                              onClick={this.toggle('nested')}
                            >
                              Tidak
                            </Button>
                          )}
                        </ModalFooter>
                      </Modal>
                      <Button
                        style={{ float: 'right', width: '200px' }}
                        outline
                        // block
                        onClick={this.signOut}
                      >
                        <MdExitToApp size={25} /> Batal
                      </Button>
                    </Col>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Khusus Modal */}
        {/* Modal List Class */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_list}
          toggle={this.toggle('nested_parent_list')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_list')}>
            List Kelas
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <tbody>
                {renderClass}
                {!classTodos && (
                  <tr>
                    <td
                      style={{ backgroundColor: 'white' }}
                      colSpan="11"
                      className="text-center"
                    >
                      TIDAK ADA DATA
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal List Class*/}

        {/* Modal List Provinsi */}
        <Modal
          onExit={this.handleCloseDomisili}
          isOpen={this.state.modal_nested_parent_list_provinsi}
          toggle={this.toggle('nested_parent_list_provinsi')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_list_provinsi')}>
            List Provinsi
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <tbody>
                {/* {renderProvinsi}
                {!provinsiTodos && (
                  <tr>
                    <td
                      style={{ backgroundColor: 'white' }}
                      colSpan="11"
                      className="text-center"
                    >
                      TIDAK ADA DATA
                    </td>
                  </tr>
                )} */}
                {provinsiTodos ? (
                  renderProvinsi || <LoadingSpinner status={4}></LoadingSpinner>
                ) : this.state.dataAvailable ? (
                  <tr>
                    <td
                      style={{ backgroundColor: 'white' }}
                      colSpan="17"
                      className="text-center"
                    >
                      TIDAK ADA DATA
                    </td>
                  </tr>
                ) : (
                  <LoadingSpinner status={4} />
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal List Provinsi */}

        {/* Modal List Kota/kabupaten */}
        <Modal
          onExit={this.handleCloseDomisili}
          isOpen={this.state.modal_nested_parent_list_kotakab}
          toggle={this.toggle('nested_parent_list_kotakab')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_list_kotakab')}>
            List Kota/Kabupaten
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <tbody>
                {renderKotakab}
                {!kotakabTodos && (
                  <tr>
                    <td
                      style={{ backgroundColor: 'white' }}
                      colSpan="11"
                      className="text-center"
                    >
                      TIDAK ADA DATA
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal List Kota/kabupaten */}

        {/* Modal List Kecamatan */}
        <Modal
          onExit={this.handleCloseDomisili}
          isOpen={this.state.modal_nested_parent_list_kecamatan}
          toggle={this.toggle('nested_parent_list_kecamatan')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_list_kecamatan')}>
            List Kecamatan
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <tbody>
                {renderKecamatan}
                {!kecamatanTodos && (
                  <tr>
                    <td
                      style={{ backgroundColor: 'white' }}
                      colSpan="11"
                      className="text-center"
                    >
                      TIDAK ADA DATA
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal List Kecamatan */}

        {/* Modal Verifikasi */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_list_verifikasi}
          toggle={this.toggle('nested_parent_list_verifikasi')}
          className={this.props.className}
        >
          <ModalHeader>Registrasi Berhasil</ModalHeader>
          <ModalBody>
            <Label>
              Terima kasih telah melakukan proses registrasi, cek email Anda
              untuk Verifikasi!
            </Label>
          </ModalBody>
          <ModalFooter style={{ textAlign: 'center' }}>
            <Button
              style={{ textAlign: 'center' }}
              disabled={loading}
              onClick={() => this.redirectOut()}
            >
              {!loading && 'Oke'}
              {loading && <MdAutorenew />}
              {loading && 'Sedang diproses'}
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal Verifikasi */}
        {/* KHUSUS MODAL */}
      </Page>
    );
  }
}
export default Registrasi;
