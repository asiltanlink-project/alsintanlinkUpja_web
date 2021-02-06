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
import * as myUrl from '../urlLink';
// import * as firebase from 'firebase/app';
import { getThemeColors } from 'utils/colors';
import LoadingSpinner from '../LoadingSpinner';
import { Redirect } from 'react-router-dom';
import zxcvbn from 'zxcvbn';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import CardBody from 'reactstrap/lib/CardBody';
import { doc } from 'prettier';
import CardFooter from 'reactstrap/lib/CardFooter';

const colors = getThemeColors();

// const perf = firebase.performance();

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataAvailable: false,
      loading: false,
      loadingPage: true,
      loadingDomisili: true,
      input: [],
      password: '',
      confirm: '',
      progress: 0,
      result: [],
      suggestions: [],
      resultProvinsi: [],
      resultKotaKab: [],
      resultKecamatan: [],
      resultDesa:[],
      email: '',
      resultClass: [
        {
          class_id: 'Pemula',
          class_name: 'Pemula',
        },
        {
          class_id: 'Berkembang',
          class_name: 'Berkembang',
        },
        {
          class_id: 'Profesional',
          class_name: 'Profesional',
        },
      ],
      RMU: false,
      benihPadiInpari30: false,
      benihPadiInpari33: false,
      benihPadiIR64: false,
      benihPadiSintanur: false,
      benihPadiCiherang: false,
      benihPadiSitubagendit: false,
      benihPadiMembramo: false,
      benihPadiInpari42: false,
      benihPadiInpari43: false,
      benihPadiInpago12: false,
      benihPadiTrabas: false,
      benihPadiRindang: false,
      // benihPadi: false,
      bibitPadi: false,
      reparasi: false,
      sukuCadang: false,
      training: false,
      trainingOperator: false,
      trainingPerawatan: false,
      trainingPerbaikan: false,
      trainingPembengkelan: false,
      trainingPembibitan: false,
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
  setClass(event, todo) {
    var nama = this.state.resultClass.find(function (element) {
      return element.class_id === event.target.value;
    });
    this.setState({
      pilihClass: event.target.value,
      namaClass: nama.class_name,
      namaClassTemp: nama.class_name,
      modal_nested_parent_list: false,
    });
    this.state.result.class = nama.class_name;
    this.state.result.class_id = this.state.pilihClass;
  }

  // untuk pilih Provinsi
  setProvinsi(event, todo) {
    var nama = this.state.resultProvinsi.find(function (element) {
      return element.id === parseInt(event.target.value);
    });

    console.log('TODO SET PROVINSI', todo);

    this.setState(
      {
        pilihProvinsi: event.target.value,
        namaProvinsi: nama.name,
        modal_nested_parent_list_provinsi: false,
        keywordList: '',
        domisiliDisabled: false,
      },
      () => this.getKotaKab(this.state.currentPages, this.state.todosPerPages),
    );
    this.state.result.province = nama.name;
    this.state.result.province_id = this.state.pilihProvinsi;
  }

  // untuk pilih Kota/Kabupaten
  setKotakab(event, todo) {
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
    this.state.result.city = nama.name;
    this.state.result.city_id = this.state.pilihKotaKab;
  }

  // untuk pilih Kecamatan
  setKecamatan(event, todo) {
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
      () => this.getDesa(this.state.currentPages, this.state.todosPerPages),
    );
    this.state.result.district = nama.name;
    this.state.result.district_id = this.state.pilihKecamatan;
  }

    // untuk pilih Desa
    setDesa(event, todo) {
      var nama = this.state.resultDesa.find(function (element) {
        return element.id === parseInt(event.target.value);
      });
  
      this.setState(
        {
          pilihDesa: event.target.value,
          namaDesa: nama.name,
          modal_nested_parent_list_desa: false,
          keywordList: '',
          domisiliDisabled: false,
        },
        () => this.getProvinsi(this.state.currentPages, this.state.todosPerPages),
      );
      this.state.result.village = nama.name;
      this.state.result.village_id = this.state.pilihDesa;
    }

  updateProfileUpja() {
    var url = myUrl.url_updateUpja;
    var input = this.state.result;
    var token = window.localStorage.getItem('tokenCookies');
    var namaLengkap = document.getElementById('namaLengkap');
    var namaProvinsi = document.getElementById('namaProvinsi');
    var namaKotaKab = document.getElementById('namaKotaKab');
    var namaKecamatan = document.getElementById('namaKecamatan');
    var namaDesa = document.getElementById('namaDesa');
    var namaKepalaDesa = document.getElementById('namaKepalaDesa');
    var namaDesa = document.getElementById('namaDesa');
    var badanHukum = document.getElementById('badanHukum');
    var RMU = document.getElementById('RMU');
    var benihPadiInpari30 = document.getElementById('benihPadiInpari30');
    var benihPadiInpari33 = document.getElementById('benihPadiInpari33');
    var benihPadiIR64 = document.getElementById('benihPadiIR64');
    var benihPadiSintanur = document.getElementById('benihPadiSintanur');
    var benihPadiCiherang = document.getElementById('benihPadiCiherang');
    var benihPadiSitubagendit = document.getElementById(
      'benihPadiSitubagendit',
    );
    var benihPadiInpari42 = document.getElementById('benihPadiInpari42');
    var benihPadiInpari43 = document.getElementById('benihPadiInpari43');
    var benihPadiMembramo = document.getElementById('benihPadiMembramo');
    var benihPadiInpago12 = document.getElementById('benihPadiInpago12');
    var benihPadiTrabas = document.getElementById('benihPadiTrabas');
    var benihPadiRindang = document.getElementById('benihPadiRindang');
    // var benihPadi = document.getElementById('benihPadi');
    var bibitPadi = document.getElementById('bibitPadi');
    var reparasi = document.getElementById('reparasi');
    var sukuCadang = document.getElementById('sukuCadang');
    // var training = document.getElementById('training');
    var trainingOperator = document.getElementById('trainingOperator');
    var trainingPerawatan = document.getElementById('trainingPerawatan');
    var trainingPerbaikan = document.getElementById('trainingPerbaikan');
    var trainingPembengkelan = document.getElementById('trainingPembengkelan');
    var trainingPembibitan = document.getElementById('trainingPembibitan');
    var namaKelas = document.getElementById('namaKelas');
    var simpan = document.getElementById('simpan');
    var batalsimpan = document.getElementById('batalsimpan');
    console.log('ISI INPUT', input);

    this.setState({ loading: true });

    var payload = {
      name: input.name,
      province: input.province_id || parseInt(this.state.pilihProvinsi),
      city: input.city_id || parseInt(this.state.pilihKotaKab),
      district: input.district_id || parseInt(this.state.pilihKecamatan),
      leader_name: input.leader_name,
      // village: input.village,
      village: input.village_id || parseInt(this.state.pilihDesa),
      class: input.class || this.state.pilihClass,
      legality: input.legality,
      rmu: this.state.RMU === true ? 1 : 0,
      benihPadiInpari30: this.state.benihPadiInpari30 === true ? 1 : 0,
      benihPadiInpari33: this.state.benihPadiInpari33 === true ? 1 : 0,
      benihPadiIR64: this.state.benihPadiIR64 === true ? 1 : 0,
      benihPadiCiherang: this.state.benihPadiCiherang === true ? 1 : 0,
      benihPadiSitubagendit: this.state.benihPadiSitubagendit === true ? 1 : 0,
      benihPadiSintanur: this.state.benihPadiSintanur === true ? 1 : 0,
      benihPadiInpari42: this.state.benihPadiInpari42 === true ? 1 : 0,
      benihPadiInpari43: this.state.benihPadiInpari43 === true ? 1 : 0,
      benihPadiMembramo: this.state.benihPadiMembramo === true ? 1 : 0,
      benihPadiInpago12: this.state.benihPadiInpago12 === true ? 1 : 0,
      benihPadiTrabas: this.state.benihPadiTrabas === true ? 1 : 0,
      benihPadiRindang: this.state.benihPadiRindang === true ? 1 : 0,
      // rice_seed: this.state.benihPadi === true ? 1 : 0,
      rice: this.state.bibitPadi === true ? 1 : 0,
      reparation: this.state.reparasi === true ? 1 : 0,
      spare_part: this.state.sukuCadang === true ? 1 : 0,
      // training: this.state.training === true ? 1 : 0,
      trainingOperator: this.state.trainingOperator === true ? 1 : 0,
      trainingPerawatan: this.state.trainingPerawatan === true ? 1 : 0,
      trainingPerbaikan: this.state.trainingPerbaikan === true ? 1 : 0,
      trainingPembengkelan: this.state.trainingPembengkelan === true ? 1 : 0,
      trainingPembibitan: this.state.trainingPembibitan === true ? 1 : 0,
    };

    console.log('PAYLOAD SAVE', payload);

    const option = {
      method: 'PUT',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `${'Bearer'} ${token}`,
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
          this.setState({
            loading: false,
            modal_nested_parent_list_verifikasi: false,
          });
          namaLengkap.disabled = true;
          namaProvinsi.style.display = 'none';
          namaKotaKab.style.display = 'none';
          namaKecamatan.style.display = 'none';
          namaDesa.style.display = 'none';
          namaKepalaDesa.disabled = true;
          namaDesa.disabled = true;
          badanHukum.disabled = true;
          RMU.disabled = true;
          benihPadiInpari30.disabled = true;
          benihPadiInpari33.disabled = true;
          benihPadiIR64.disabled = true;
          benihPadiCiherang.disabled = true;
          benihPadiSitubagendit.disabled = true;
          benihPadiSintanur.disabled = true;
          benihPadiInpari42.disabled = true;
          benihPadiInpari43.disabled = true;
          benihPadiMembramo.disabled = true;
          benihPadiInpago12.disabled = true;
          benihPadiTrabas.disabled = true;
          benihPadiRindang.disabled = true;
          // benihPadi.disabled = true;
          bibitPadi.disabled = true;
          reparasi.disabled = true;
          sukuCadang.disabled = true;
          // training.disabled = true;
          trainingOperator.disabled = true;
          trainingPerawatan.disabled = true;
          trainingPerbaikan.disabled = true;
          trainingPembengkelan.disabled = true;
          trainingPembibitan.disabled = true;
          namaKelas.style.display = 'none';
          simpan.style.display = 'none';
          batalsimpan.style.display = 'none';
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

  // get provinsi data
  getProvinsi(currPage, currLimit) {
    var offset = (currPage - 1) * currLimit;
    var keyword = this.state.keywordList;
    const urlA = myUrl.url_getProvince;
    // console.log('jalan', urlA);
    this.setState({ loadingDomisili: true });
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
        // console.log('data Provinsi', data.result);
        if (data.status === 0) {
          this.showNotification('Data tidak ditemukan!', 'error');
        } else {
          this.setState({
            resultProvinsi: data.result.provinces,
            // maxPages: data.metadata.pages ? data.metadata.pages : 1,
            loading: false,
            loadingDomisili: false,
          });
        }
      });
  }
  // Get KotaKab
  getKotaKab(currPage, currLimit) {
    var offset = (currPage - 1) * currLimit;
    var keyword = this.state.keywordList;
    const urlA = myUrl.url_getCity + '?province_id=' + this.state.pilihProvinsi;
    // console.log('jalan kota', urlA);
    this.setState({ loadingDomisili: true });
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
        // console.log('data Kota/Kabupaten', data.result);
        if (data.status === 0) {
          this.showNotification('Data tidak ditemukan!', 'error');
        } else {
          this.setState({
            resultKotaKab: data.result.citys,
            // maxPages: data.metadata.pages ? data.metadata.pages : 1,
            loading: false,
            loadingDomisili: false,
          });
        }
      });
  }

  // Get Kecamatan
  getKecamatan(currPage, currLimit) {
    const urlA = myUrl.url_getDistrict + '?city_id=' + this.state.pilihKotaKab;
    console.log('jalan kecamatan', urlA);
    this.setState({ loadingDomisili: true });
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
        // console.log('data Kecamatan', data.result);
        if (data.status === 0) {
          this.showNotification('Data tidak ditemukan!', 'error');
        } else {
          this.setState({
            resultKecamatan: data.result.districts,
            // maxPages: data.metadata.pages ? data.metadata.pages : 1,
            loading: false,
            loadingDomisili: false,
          });
        }
      });
  }

  // Get Kecamatan
  getDesa(currPage, currLimit) {
    const urlA = myUrl.url_getVillage + '?district_id=' + this.state.pilihKecamatan;
    console.log('jalan kecamatan', urlA);
    this.setState({ loadingDomisili: true });
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
        console.log('data desa', data.result);
        if (data.status === 0) {
          this.showNotification('Data tidak ditemukan!', 'error');
        } else {
          this.setState({
            resultDesa: data.result.villages,
            // maxPages: data.metadata.pages ? data.metadata.pages : 1,
            loading: false,
            loadingDomisili: false,
          });
        }
      });
  }

  getListbyPaging(currPage, currLimit) {
    // const trace = perf.trace('getBundling');
    const url = myUrl.url_showDetailUPJA;
    var token = window.localStorage.getItem('tokenCookies');

    // console.log('URL GET LIST', url);

    this.setState({ loadingPage: true });
    // console.log("offset", offset, "currLimit", currLimit);

    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `${'Bearer'} ${token}`,
      },
    };
    // console.log('option', option);
    fetch(url, option)
      .then(response => {
        // trace.stop();
        if (response.ok) {
          return response.json();
        } else {
          if (response.status === 401) {
            this.showNotification('Username/Password salah!', 'error');
          } else if (response.status === 500) {
            this.showNotification('Internal Server Error', 'error');
          } else {
            this.showNotification('Response ke server gagal!', 'error');
          }
          this.setState({
            loading: false,
          });
        }
      })
      .then(data => {
        var status = data.status;
        var result = data.result.upja;
        var message = data.result.message;
        console.log('data jalan GetlistByPaging', data);
        if (status === 0) {
          this.showNotification(message, 'error');
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState(
            {
              result: result,
              loadingPage: false,
            },
            () => {
              if (this.state.result.rmu === 1) {
                this.setState({ RMU: true });
              } else {
                this.setState({ RMU: false });
              }
              if (this.state.result.benihPadiInpari33 === 1) {
                this.setState({ benihPadiInpari33: true });
              } else {
                this.setState({ benihPadiInpari33: false });
              }
              if (this.state.result.benihPadiInpari30 === 1) {
                this.setState({ benihPadiInpari30: true });
              } else {
                this.setState({ benihPadiInpari30: false });
              }
              if (this.state.result.benihPadiIR64 === 1) {
                this.setState({ benihPadiIR64: true });
              } else {
                this.setState({ benihPadiIR64: false });
              }
              if (this.state.result.benihPadiCiherang === 1) {
                this.setState({ benihPadiCiherang: true });
              } else {
                this.setState({ benihPadiCiherang: false });
              }
              if (this.state.result.benihPadiSitubagendit === 1) {
                this.setState({ benihPadiSitubagendit: true });
              } else {
                this.setState({ benihPadiSitubagendit: false });
              }
              if (this.state.result.benihPadiSintanur === 1) {
                this.setState({ benihPadiSintanur: true });
              } else {
                this.setState({ benihPadiSintanur: false });
              }
              if (this.state.result.benihPadiInpari42 === 1) {
                this.setState({ benihPadiInpari42: true });
              } else {
                this.setState({ benihPadiInpari42: false });
              }
              if (this.state.result.benihPadiInpari43 === 1) {
                this.setState({ benihPadiInpari43: true });
              } else {
                this.setState({ benihPadiInpari43: false });
              }
              if (this.state.result.benihPadiMembramo === 1) {
                this.setState({ benihPadiMembramo: true });
              } else {
                this.setState({ benihPadiMembramo: false });
              }
              if (this.state.result.benihPadiInpago12 === 1) {
                this.setState({ benihPadiInpago12: true });
              } else {
                this.setState({ benihPadiInpago12: false });
              }
              if (this.state.result.benihPadiTrabas === 1) {
                this.setState({ benihPadiTrabas: true });
              } else {
                this.setState({ benihPadiTrabas: false });
              }
              if (this.state.result.benihPadiRindang === 1) {
                this.setState({ benihPadiRindang: true });
              } else {
                this.setState({ benihPadiRindang: false });
              }
              if (this.state.result.rice === 1) {
                this.setState({ bibitPadi: true });
              } else {
                this.setState({ bibitPadi: false });
              }
              // if (this.state.result.rice_seed === 0) {
              //   this.setState({ benihPadi: true });
              // } else {
              //   this.setState({ benihPadi: false });
              // }
              if (this.state.result.spare_part === 1) {
                this.setState({ sukuCadang: true });
              } else {
                this.setState({ sukuCadang: false });
              }
              // if (this.state.result.training === 0) {
              //   this.setState({ training: true });
              // } else {
              //   this.setState({ training: false });
              // }
              if (this.state.result.trainingOperator === 1) {
                this.setState({ trainingOperator: true });
              } else {
                this.setState({ trainingOperator: false });
              }
              if (this.state.result.trainingPerbaikan === 1) {
                this.setState({ trainingPerbaikan: true });
              } else {
                this.setState({ trainingPerbaikan: false });
              }
              if (this.state.result.trainingPerawatan === 1) {
                this.setState({ trainingPerawatan: true });
              } else {
                this.setState({ trainingPerawatan: false });
              }
              if (this.state.result.trainingPembengkelan === 1) {
                this.setState({ trainingPembengkelan: true });
              } else {
                this.setState({ trainingPembengkelan: false });
              }
              if (this.state.result.trainingPembibitan === 1) {
                this.setState({ trainingPembibitan: true });
              } else {
                this.setState({ trainingPembibitan: false });
              }
              if (this.state.result.reparation === 1) {
                this.setState({ reparasi: true });
              } else {
                this.setState({ reparasi: false });
              }
            },
          );
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loadingPage: false,
        });
      });
  }

  componentDidMount() {
    this.getListbyPaging();
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
    window.localStorage.removeItem('tokenCookies');
    window.localStorage.removeItem('accessList');
    this.setState({ loading: true }, () => window.location.replace('/login'));
  }

  updateInputValue(value, field, fill) {
    let input = this.state[fill];
    console.log('INPUT', value, field, fill);
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

  handleClose = () => {
    this.setState({ input: [] });
  };

  canBeSubmittedRegis() {
    const {
      input,
      email,
      password,
      confirm,
      namaProvinsi,
      namaKotaKab,
      namaKecamatan,
      namaDesa,
      namaClass,
    } = this.state;
    return (
      input.length !== 0 &&
      input.namaLengkap !== '' &&
      input.namaKepalaDesa !== '' &&
      // input.namaDesa !== '' &&
      input.badanHukum !== '' &&
      email !== '' &&
      namaProvinsi !== '' &&
      namaKotaKab !== '' &&
      namaKecamatan !== '' &&
      namaDesa !=='' &&
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

  setEdit() {
    var namaLengkap = document.getElementById('namaLengkap');
    var namaProvinsi = document.getElementById('namaProvinsi');
    var namaKotaKab = document.getElementById('namaKotaKab');
    var namaKecamatan = document.getElementById('namaKecamatan');
    var namaDesa = document.getElementById('namaDesa');
    var namaKepalaDesa = document.getElementById('namaKepalaDesa');
    var namaDesa = document.getElementById('namaDesa');
    var badanHukum = document.getElementById('badanHukum');
    var namaKelas = document.getElementById('namaKelas');
    var simpan = document.getElementById('simpan');
    var batalsimpan = document.getElementById('batalsimpan');
    var RMU = document.getElementById('RMU');
    var benihPadiInpari30 = document.getElementById('benihPadiInpari30');
    var benihPadiInpari33 = document.getElementById('benihPadiInpari33');
    var benihPadiIR64 = document.getElementById('benihPadiIR64');
    var benihPadiCiherang = document.getElementById('benihPadiCiherang');
    var benihPadiSitubagendit = document.getElementById(
      'benihPadiSitubagendit',
    );
    var benihPadiSintanur = document.getElementById('benihPadiSintanur');
    var benihPadiInpari42 = document.getElementById('benihPadiInpari42');
    var benihPadiInpari43 = document.getElementById('benihPadiInpari43');
    var benihPadiMembramo = document.getElementById('benihPadiMembramo');
    var benihPadiInpago12 = document.getElementById('benihPadiInpago12');
    var benihPadiTrabas = document.getElementById('benihPadiTrabas');
    var benihPadiRindang = document.getElementById('benihPadiRindang');
    // var benihPadi = document.getElementById('benihPadi');
    var bibitPadi = document.getElementById('bibitPadi');
    var reparasi = document.getElementById('reparasi');
    var sukuCadang = document.getElementById('sukuCadang');
    // var training = document.getElementById('training');
    var trainingOperator = document.getElementById('trainingOperator');
    var trainingPerawatan = document.getElementById('trainingPerawatan');
    var trainingPerbaikan = document.getElementById('trainingPerbaikan');
    var trainingPembengkelan = document.getElementById('trainingPembengkelan');
    var trainingPembibitan = document.getElementById('trainingPembibitan');

    namaLengkap.disabled = false;
    namaProvinsi.style.display = 'block';
    namaKotaKab.style.display = 'block';
    namaKecamatan.style.display = 'block';
    namaDesa.style.display = 'block';
    namaKepalaDesa.disabled = false;
    namaDesa.disabled = false;
    badanHukum.disabled = false;
    RMU.disabled = false;
    benihPadiInpari30.disabled = false;
    benihPadiInpari33.disabled = false;
    benihPadiIR64.disabled = false;
    benihPadiCiherang.disabled = false;
    benihPadiSitubagendit.disabled = false;
    benihPadiSintanur.disabled = false;
    benihPadiInpari42.disabled = false;
    benihPadiInpari43.disabled = false;
    benihPadiMembramo.disabled = false;
    benihPadiInpago12.disabled = false;
    benihPadiTrabas.disabled = false;
    benihPadiRindang.disabled = false;
    // benihPadi.disabled = false;
    bibitPadi.disabled = false;
    reparasi.disabled = false;
    sukuCadang.disabled = false;
    // training.disabled = false;
    trainingOperator.disabled = false;
    trainingPerawatan.disabled = false;
    trainingPerbaikan.disabled = false;
    trainingPembengkelan.disabled = false;
    trainingPembibitan.disabled = false;
    namaKelas.style.display = 'block';
    simpan.style = 'block';
    batalsimpan.style = 'block';
  }
  disetEdit() {
    var namaLengkap = document.getElementById('namaLengkap');
    var namaProvinsi = document.getElementById('namaProvinsi');
    var namaKotaKab = document.getElementById('namaKotaKab');
    var namaKecamatan = document.getElementById('namaKecamatan');
    var namaDesa = document.getElementById('namaDesa');
    var namaKepalaDesa = document.getElementById('namaKepalaDesa');
    var namaDesa = document.getElementById('namaDesa');
    var badanHukum = document.getElementById('badanHukum');
    var RMU = document.getElementById('RMU');
    var benihPadiInpari30 = document.getElementById('benihPadiInpari30');
    var benihPadiInpari33 = document.getElementById('benihPadiInpari33');
    var benihPadiIR64 = document.getElementById('benihPadiIR64');
    var benihPadiCiherang = document.getElementById('benihPadiCiherang');
    var benihPadiSitubagendit = document.getElementById(
      'benihPadiSitubagendit',
    );
    var benihPadiInpari42 = document.getElementById('benihPadiInpari42');
    var benihPadiInpari43 = document.getElementById('benihPadiInpari43');
    var benihPadiMembramo = document.getElementById('benihPadiMembramo');
    var benihPadiInpago12 = document.getElementById('benihPadiInpago12');
    var benihPadiTrabas = document.getElementById('benihPadiTrabas');
    var benihPadiRindang = document.getElementById('benihPadiRindang');
    var benihPadiSintanur = document.getElementById('benihPadiSintanur');
    // var benihPadi = document.getElementById('benihPadi');
    var bibitPadi = document.getElementById('bibitPadi');
    var reparasi = document.getElementById('reparasi');
    var sukuCadang = document.getElementById('sukuCadang');
    // var training = document.getElementById('training');
    var trainingOperator = document.getElementById('trainingOperator');
    var trainingPerawatan = document.getElementById('trainingPerawatan');
    var trainingPerbaikan = document.getElementById('trainingPerbaikan');
    var trainingPembengkelan = document.getElementById('trainingPembengkelan');
    var trainingPembibitan = document.getElementById('trainingPembibitan');
    var namaKelas = document.getElementById('namaKelas');
    var simpan = document.getElementById('simpan');
    var batalsimpan = document.getElementById('batalsimpan');

    namaLengkap.disabled = true;
    namaProvinsi.style.display = 'none';
    namaKotaKab.style.display = 'none';
    namaKecamatan.style.display = 'none';
    namaDesa.style.display = 'none';
    namaKepalaDesa.disabled = true;
    namaDesa.disabled = true;
    badanHukum.disabled = true;
    RMU.disabled = true;
    benihPadiInpari30.disabled = true;
    benihPadiInpari33.disabled = true;
    benihPadiCiherang.disabled = true;
    benihPadiIR64.disabled = true;
    benihPadiSitubagendit.disabled = true;
    benihPadiSintanur.disabled = true;
    benihPadiInpari42.disabled = true;
    benihPadiInpari43.disabled = true;
    benihPadiMembramo.disabled = true;
    benihPadiInpago12.disabled = true;
    benihPadiTrabas.disabled = true;
    benihPadiRindang.disabled = true;
    // benihPadi.disabled = true;
    bibitPadi.disabled = true;
    reparasi.disabled = true;
    sukuCadang.disabled = true;
    // training.disabled = true;
    trainingOperator.disabled = true;
    trainingPerawatan.disabled = true;
    trainingPerbaikan.disabled = true;
    trainingPembengkelan.disabled = true;
    trainingPembibitan.disabled = true;
    this.setState({
      trainingOperator: !trainingOperator,
      trainingPerawatan: !trainingPerawatan,
      trainingPerbaikan: !trainingPerbaikan,
      trainingPembengkelan: !trainingPembengkelan,
      trainingPembibitan: !trainingPembibitan,
      benihPadiInpari30: !benihPadiInpari30,
      benihPadiInpari33: !benihPadiInpari33,
      benihPadiIR64: !benihPadiIR64,
      benihPadiCiherang: !benihPadiCiherang,
      benihPadiSitubagendit: !benihPadiSitubagendit,
      benihPadiSintanur: !benihPadiSintanur,
      benihPadiInpari42: !benihPadiInpari42,
      benihPadiInpari42: !benihPadiInpari42,
      benihPadiMembramo: !benihPadiMembramo,
      benihPadiInpago12: !benihPadiInpago12,
      benihPadiTrabas: !benihPadiTrabas,
      benihPadiRindang: !benihPadiRindang,
      RMU: !RMU,
      sukuCadang: !sukuCadang,
      bibitPadi: !bibitPadi,
      reparasi: !reparasi,
    });
    namaKelas.style.display = 'none';
    simpan.style.display = 'none';
    batalsimpan.style.display = 'none';
    this.componentDidMount();
  }

  setModalEdit(todo) {
    this.setState(
      {
        input: todo,
      },
      this.toggle('nested_parent_list_verifikasi'),
    );
  }

  setModalBatal() {
    this.setState(
      {
        input: [],
      },
      this.toggle('nested_parent_editUpja'),
    );
  }

  render() {
    const { suggestions, loading, loadingDomisili } = this.state;

    const colorProgress = this.colorProgress();
    const strengthProgress = this.strengthProgress();
    const isEnabled = this.canBeSubmitted();
    const isEnabledRegis = this.canBeSubmittedRegis();

    const currentTodos = this.state.result;
    const provinsiTodos = this.state.resultProvinsi;
    const kotakabTodos = this.state.resultKotaKab;
    const kecamatanTodos = this.state.resultKecamatan;
    const classTodos = this.state.resultClass;
    const desaTodos = this.state.resultDesa;
    var buttonSimpan = document.getElementById('simpan');

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
                onClick={e => {
                  this.setClass(e, todo);
                }}
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
                onClick={e => {
                  this.setProvinsi(e, todo);
                }}
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
                onClick={e => {
                  this.setKotakab(e, todo);
                }}
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
                onClick={e => {
                  this.setKecamatan(e, todo);
                }}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

      const renderDesa =
      desaTodos &&
      desaTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="primary"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.id}
                onClick={e => {
                  this.setDesa(e, todo);
                }}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

    return (
      <Page
        title="Profile"
        breadcrumbs={[{ name: 'Profile', active: true }]}
        className="Profile"
      >
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
                  <Row>
                    <Col
                      style={{
                        textAlign: 'right',
                        fontSize: '1.3em',
                        fontWeight: 'bold',
                      }}
                    >
                      <Button
                        color="primary"
                        style={{ marginLeft: '1%' }}
                        // onClick={this.toggle('nested_parent_editUpja')}
                        onClick={() => this.setEdit()}
                      >
                        Edit UPJA
                      </Button>
                    </Col>
                    <hr></hr>
                  </Row>
                  {/* untuk isi kepala desa */}
                  <FormGroup>
                    <Label style={{ textAlign: 'center' }}>
                      Nama Kepala UPJA:
                    </Label>
                    <Input
                      disabled
                      id="namaKepalaDesa"
                      autoComplete="off"
                      type="text"
                      name="leader_name"
                      placeholder="Nama Kepala Desa..."
                      onChange={evt =>
                        this.updateInputValue(
                          evt.target.value,
                          evt.target.name,
                          'result',
                        )
                      }
                      // value={this.state.namaKepalaDesa}
                      value={this.state.result && this.state.result.leader_name}
                    ></Input>
                  </FormGroup>
                  {/* untuk isi nama */}
                  <FormGroup>
                    <Label style={{ textAlign: 'center' }}>Nama UPJA:</Label>
                    <Input
                      disabled
                      id="namaLengkap"
                      type="text"
                      autoComplete="off"
                      name="name"
                      placeholder="Nama Lengkap..."
                      onChange={evt =>
                        this.updateInputValue(
                          evt.target.value,
                          evt.target.name,
                          'result',
                        )
                      }
                      value={this.state.result && this.state.result.name}
                    ></Input>
                  </FormGroup>

                  {/* untuk isi email */}
                  <FormGroup style={{ marginBottom: 0 }}>
                    <Label style={{ textAlign: 'center' }}>Email:</Label>
                    <Input
                      disabled
                      type="email"
                      value={this.state.result && this.state.result.email}
                      // value={this.state.email.trim()}
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
                        name="province"
                        // value={this.state.namaProvinsi}
                        onChange={evt =>
                          this.updateInputValue(
                            evt.target.value,
                            evt.target.name,
                            'result',
                          )
                        }
                        value={this.state.result && this.state.result.province}
                      />
                      <InputGroupAddon
                        addonType="append"
                        id="namaProvinsi"
                        style={{ display: 'none' }}
                      >
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
                        // value={this.state.namaKotaKab}
                        value={this.state.result && this.state.result.city}
                      />
                      <InputGroupAddon
                        addonType="append"
                        id="namaKotaKab"
                        style={{ display: 'none' }}
                      >
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
                        value={this.state.result && this.state.result.district}
                      />
                      <InputGroupAddon
                        addonType="append"
                        id="namaKecamatan"
                        style={{ display: 'none' }}
                      >
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

                  {/* untuk pilih Desa */}
                  <FormGroup>
                    <Label style={{ textAlign: 'center' }}>
                      Nama Desa:
                    </Label>
                    <InputGroup style={{ float: 'right' }}>
                      <Input
                        disabled
                        placeholder="Pilih Desa"
                        style={{ fontWeight: 'bold' }}
                        value={this.state.result && this.state.result.village}
                      />
                      <InputGroupAddon
                        addonType="append"
                        id="namaDesa"
                        style={{ display: 'none' }}
                      >
                        <Button
                          onClick={this.toggle('nested_parent_list_desa')}
                        >
                          <MdList />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                  <br></br>
                  <br></br>

                  {/* untuk isi desa
                  <FormGroup>
                    <Label style={{ textAlign: 'center' }}>Nama Desa:</Label>
                    <Input
                      disabled
                      id="namaDesa"
                      autoComplete="off"
                      type="text"
                      name="village"
                      placeholder="Nama Desa..."
                      onChange={evt =>
                        this.updateInputValue(
                          evt.target.value,
                          evt.target.name,
                          'result',
                        )
                      }
                      value={this.state.result && this.state.result.village}
                    ></Input>
                  </FormGroup> */}

                  {/* untuk isi Badan Hukum */}
                  <FormGroup>
                    <Label style={{ textAlign: 'center' }}>Badan Hukum:</Label>
                    <Input
                      disabled
                      id="badanHukum"
                      autoComplete="off"
                      type="text"
                      name="legality"
                      placeholder="Badan hukum..."
                      onChange={evt =>
                        this.updateInputValue(
                          evt.target.value,
                          evt.target.name,
                          'result',
                        )
                      }
                      value={this.state.result && this.state.result.legality}
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
                        // value={this.state.namaClass}
                        value={this.state.result && this.state.result.class}
                      />
                      <InputGroupAddon
                        addonType="append"
                        style={{ display: 'none' }}
                        id="namaKelas"
                      >
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

                  {/* untuk isi Layanan Lainnya UPJA */}
                  <FormGroup>
                    <Label style={{ textAlign: 'center' }}>
                      Layanan Lainnya:
                    </Label>
                    <Row>
                      <Col>
                        <FormGroup check>
                          <Label check style={{ fontWeight: 'bold' }}>
                            {/* <Input
                              type="checkbox"
                              disabled
                              id="benihPadi"
                              checked={this.state.benihPadi}
                              onChange={() =>
                                this.setState({
                                  benihPadi: !this.state.benihPadi,
                                })
                              }
                            /> */}
                            Benih Padi
                          </Label>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Col>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                disabled
                                id="benihPadiInpari30"
                                checked={this.state.benihPadiInpari30}
                                onChange={() =>
                                  this.setState({
                                    benihPadiInpari30: !this.state
                                      .benihPadiInpari30,
                                  })
                                }
                              />
                              INPARI 30
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                disabled
                                id="benihPadiInpari33"
                                checked={this.state.benihPadiInpari33}
                                onChange={() =>
                                  this.setState({
                                    benihPadiInpari33: !this.state
                                      .benihPadiInpari33,
                                  })
                                }
                              />
                              INPARI 33
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                disabled
                                id="benihPadiIR64"
                                checked={this.state.benihPadiIR64}
                                onChange={() =>
                                  this.setState({
                                    benihPadiIR64: !this.state.benihPadiIR64,
                                  })
                                }
                              />
                              IR 64
                            </Label>
                          </FormGroup>
                        </Col>
                      </Col>
                      <Col>
                        <Col>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                disabled
                                id="benihPadiSintanur"
                                checked={this.state.benihPadiSintanur}
                                onChange={() =>
                                  this.setState({
                                    benihPadiSintanur: !this.state
                                      .benihPadiSintanur,
                                  })
                                }
                              />
                              Sintanur
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                disabled
                                id="benihPadiCiherang"
                                checked={this.state.benihPadiCiherang}
                                onChange={() =>
                                  this.setState({
                                    benihPadiCiherang: !this.state
                                      .benihPadiCiherang,
                                  })
                                }
                              />
                              Ciherang
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                disabled
                                id="benihPadiSitubagendit"
                                checked={this.state.benihPadiSitubagendit}
                                onChange={() =>
                                  this.setState({
                                    benihPadiSitubagendit: !this.state
                                      .benihPadiSitubagendit,
                                  })
                                }
                              />
                              Situbagendit
                            </Label>
                          </FormGroup>
                        </Col>
                      </Col>
                      <Col>
                        <Col>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                disabled
                                id="benihPadiInpari42"
                                checked={this.state.benihPadiInpari42}
                                onChange={() =>
                                  this.setState({
                                    benihPadiInpari42: !this.state
                                      .benihPadiInpari42,
                                  })
                                }
                              />
                              INPARI 42
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                disabled
                                id="benihPadiInpari43"
                                checked={this.state.benihPadiInpari43}
                                onChange={() =>
                                  this.setState({
                                    benihPadiInpari43: !this.state
                                      .benihPadiInpari43,
                                  })
                                }
                              />
                              INPARI 43
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                disabled
                                id="benihPadiMembramo"
                                checked={this.state.benihPadiMembramo}
                                onChange={() =>
                                  this.setState({
                                    benihPadiMembramo: !this.state
                                      .benihPadiMembramo,
                                  })
                                }
                              />
                              Membramo
                            </Label>
                          </FormGroup>
                        </Col>
                      </Col>
                      <Col>
                        <Col>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                disabled
                                id="benihPadiInpago12"
                                checked={this.state.benihPadiInpago12}
                                onChange={() =>
                                  this.setState({
                                    benihPadiInpago12: !this.state
                                      .benihPadiInpago12,
                                  })
                                }
                              />
                              Inpago 12
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                disabled
                                id="benihPadiTrabas"
                                checked={this.state.benihPadiTrabas}
                                onChange={() =>
                                  this.setState({
                                    benihPadiTrabas: !this.state
                                      .benihPadiTrabas,
                                  })
                                }
                              />
                              Trabas
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                disabled
                                id="benihPadiRindang"
                                checked={this.state.benihPadiRindang}
                                onChange={() =>
                                  this.setState({
                                    benihPadiRindang: !this.state
                                      .benihPadiRindang,
                                  })
                                }
                              />
                              Rindang
                            </Label>
                          </FormGroup>
                        </Col>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup check>
                          <Label check style={{ fontWeight: 'bold' }}>
                            {/* <Input
                              type="checkbox"
                              disabled
                              id="training"
                              checked={this.state.training}
                              onChange={() =>
                                this.setState({
                                  training: !this.state.training,
                                })
                              }
                            /> */}
                            Training
                          </Label>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Col>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                disabled
                                id="trainingOperator"
                                checked={this.state.trainingOperator}
                                onChange={() =>
                                  this.setState({
                                    trainingOperator: !this.state
                                      .trainingOperator,
                                  })
                                }
                              />
                              Operator
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                disabled
                                id="trainingPerawatan"
                                checked={this.state.trainingPerawatan}
                                onChange={() =>
                                  this.setState({
                                    trainingPerawatan: !this.state
                                      .trainingPerawatan,
                                  })
                                }
                              />
                              Perawatan
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                disabled
                                id="trainingPerbaikan"
                                checked={this.state.trainingPerbaikan}
                                onChange={() =>
                                  this.setState({
                                    trainingPerbaikan: !this.state
                                      .trainingPerbaikan,
                                  })
                                }
                              />
                              Perbaikan
                            </Label>
                          </FormGroup>
                        </Col>
                      </Col>
                      <Col>
                        <Col>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                disabled
                                id="trainingPembengkelan"
                                checked={this.state.trainingPembengkelan}
                                onChange={() =>
                                  this.setState({
                                    trainingPembengkelan: !this.state
                                      .trainingPembengkelan,
                                  })
                                }
                              />
                              Pembengkelan
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="checkbox"
                                disabled
                                id="trainingPembibitan"
                                checked={this.state.trainingPembibitan}
                                onChange={() =>
                                  this.setState({
                                    trainingPembibitan: !this.state
                                      .trainingPembibitan,
                                  })
                                }
                              />
                              Pembibitan
                            </Label>
                          </FormGroup>
                        </Col>
                      </Col>
                    </Row>

                    <Row>
                      <Col style={{ marginBottom: 0, paddingBottom: 0 }}>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="checkbox"
                              disabled
                              id="RMU"
                              checked={this.state.RMU}
                              onChange={() =>
                                this.setState({
                                  RMU: !this.state.RMU,
                                })
                              }
                            />
                            RMU
                          </Label>
                        </FormGroup>
                        {/* <FormGroup check>
                          <Label check>
                            <Input
                              type="checkbox"
                              disabled
                              id="benihPadi"
                              checked={this.state.benihPadi}
                              onChange={() =>
                                this.setState({
                                  benihPadi: !this.state.benihPadi,
                                })
                              }
                            />
                            Benih Padi
                          </Label>
                        </FormGroup> */}
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="checkbox"
                              disabled
                              id="bibitPadi"
                              checked={this.state.bibitPadi}
                              onChange={() =>
                                this.setState({
                                  bibitPadi: !this.state.bibitPadi,
                                })
                              }
                            />
                            Bibit Padi
                          </Label>
                        </FormGroup>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="checkbox"
                              disabled
                              id="reparasi"
                              checked={this.state.reparasi}
                              onChange={() =>
                                this.setState({
                                  reparasi: !this.state.reparasi,
                                })
                              }
                            />
                            Reparasi
                          </Label>
                        </FormGroup>
                      </Col>
                      <Col style={{ marginBottom: 0, paddingBottom: 0 }}>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="checkbox"
                              disabled
                              id="sukuCadang"
                              checked={this.state.sukuCadang}
                              onChange={() =>
                                this.setState({
                                  sukuCadang: !this.state.sukuCadang,
                                })
                              }
                            />
                            Suku Cadang
                          </Label>
                        </FormGroup>
                      </Col>
                    </Row>
                  </FormGroup>
                </Form>
              </CardBody>
              <CardFooter style={{ textAlign: 'right' }}>
                <Button
                  // block
                  color="secondary"
                  id="simpan"
                  style={{ display: 'none' }}
                  // onClick={this.toggle('nested_parent_editUpja')}
                  onClick={this.toggle('nested_parent_list_verifikasi')}
                >
                  Simpan Upja
                </Button>
                <Button
                  // block
                  color="danger"
                  id="batalsimpan"
                  style={{
                    display: 'none',
                    marginleft: '1%',
                    paddingLeft: '1%',
                  }}
                  // onClick={()=>this.componentDidMount()}
                  onClick={() => this.disetEdit()}
                >
                  Batal
                </Button>
              </CardFooter>
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
                {provinsiTodos.length === 0 && loadingDomisili === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingDomisili === false && provinsiTodos.length === 0 ? (
                  (
                    <tr>
                      <td
                        style={{ backgroundColor: 'white' }}
                        colSpan="17"
                        className="text-center"
                      >
                        TIDAK ADA DATA
                      </td>
                    </tr>
                  ) || <LoadingSpinner status={4} />
                ) : loadingDomisili === true && provinsiTodos.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderProvinsi
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
                {kotakabTodos.length === 0 && loadingDomisili === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingDomisili === false && kotakabTodos.length === 0 ? (
                  (
                    <tr>
                      <td
                        style={{ backgroundColor: 'white' }}
                        colSpan="17"
                        className="text-center"
                      >
                        TIDAK ADA DATA
                      </td>
                    </tr>
                  ) || <LoadingSpinner status={4} />
                ) : loadingDomisili === true && kotakabTodos.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderKotakab
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
                {kecamatanTodos.length === 0 && loadingDomisili === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingDomisili === false && kecamatanTodos.length === 0 ? (
                  (
                    <tr>
                      <td
                        style={{ backgroundColor: 'white' }}
                        colSpan="17"
                        className="text-center"
                      >
                        TIDAK ADA DATA
                      </td>
                    </tr>
                  ) || <LoadingSpinner status={4} />
                ) : loadingDomisili === true && kecamatanTodos.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderKecamatan
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal List Kecamatan */}

        {/* Modal List Desa */}
        <Modal
          onExit={this.handleCloseDomisili}
          isOpen={this.state.modal_nested_parent_list_desa}
          toggle={this.toggle('nested_parent_list_desa')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_list_desa')}>
            List Desa
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <tbody>
                {desaTodos.length === 0 && loadingDomisili === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingDomisili === false && desaTodos.length === 0 ? (
                  (
                    <tr>
                      <td
                        style={{ backgroundColor: 'white' }}
                        colSpan="17"
                        className="text-center"
                      >
                        TIDAK ADA DATA
                      </td>
                    </tr>
                  ) || <LoadingSpinner status={4} />
                ) : loadingDomisili === true && desaTodos.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderDesa
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal List Desa */}

        {/* Modal Verifikasi */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_list_verifikasi}
          toggle={this.toggle('nested_parent_list_verifikasi')}
          className={this.props.className}
        >
          <ModalHeader>Konfirmasi Simpan Data</ModalHeader>
          <ModalBody>
            <Label>Apakah Anda yakin untuk menyimpan data ini?</Label>
          </ModalBody>
          <ModalFooter style={{ textAlign: 'center' }}>
            <Button
              style={{ textAlign: 'center' }}
              disabled={loading}
              onClick={() => this.updateProfileUpja()}
            >
              {!loading && 'Ya'}
              {loading && <MdAutorenew />}
              {loading && 'Sedang diproses'}
            </Button>
            <Button
              color="primary"
              onClick={this.toggle('nested_parent_list_verifikasi')}
            >
              Tidak
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal Verifikasi */}
        {/* KHUSUS MODAL */}
      </Page>
    );
  }
}
export default Profile;
