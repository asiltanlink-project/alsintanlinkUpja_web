import Page from 'components/Page';
import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Label,
  ButtonGroup,
  InputGroup,
  InputGroupAddon,
  Form,
  FormGroup,
  Badge,
  Tooltip,
} from 'reactstrap';
import {
  MdSearch,
  MdAutorenew,
  MdEdit,
  MdDelete,
  MdList,
  MdAdd,
  MdInsertChart,
  MdLocationOn,
} from 'react-icons/md';
import { MdLoyalty, MdRefresh } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import * as myUrl from '../urlLink';
import * as firebase from 'firebase/app';
import LoadingSpinner from 'pages/template/LoadingSpinner.js';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const perf = firebase.performance();

const initialCurrentDimen = {
  procod: '',
  nama: '',
  updateBy: '',
  qty: 0,
};

var accessList = {};

class Transaksi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDimen: { ...initialCurrentDimen },
      currentPage: 1,
      currentPages: 1,
      realCurrentPage: 1,
      realCurrentPages: 1,
      todosPerPage: 5,
      todosPerPages: 5,
      maxPage: 1,
      maxPages: 1,
      flag: 0,
      keyword: '',
      keywordList: '',
      procod: '',
      loading: false,
      newProductDesc: '',
      newProcode: '',
      enterButton: false,
      pilihPeriode: '',
      pilihPelapak: '',
      pilihPelapak2: '',
      pilihEcommerce: '',
      pilihEcommerce2: '',
      lastID: 0,
      lastIDtemp: 0,
      namaPeriode: '',
      ecommerceID: '',
      action: '',
      pelapakDisabled: false,
      ecommerceDisabled: true,
      periodeDisabled: true,
      startDate: '',
      endDate: '',
      resetInfo: false,
      namaOutlet: '',
      pilihStatus: '',
      namaStatus: '',
      pilihStatusFarmer: '',
      namaStatusFarmer: '',
      result: [],
      resultAllAlsinType: [],
      resultDataProcod: [],
      currentDimenBatasStandar: [],
      currentDimenBatasStandarLama: [],
      namaPelapak2: [],
      idPelapak: [],
      pelapakDetail: [],
      ecommerceDetail: [],
      listEditMasal: [],
      resultBatasPerPelapak: [],
      resultPricingService: [],
      resultPricingHeader: [],
      resultReparation: [],
      resultRiceSeeds: [],
      resultRices: [],
      resultRMUS: [],
      resultSparePart: [],
      resultTrainings: [],
      resultPeriode: [
        {
          periode_id: 'upcoming',
          periode_name: 'Akan Datang',
        },
        {
          periode_id: 'ongoing',
          periode_name: 'Sedang Berjalan',
        },
        {
          periode_id: 'expired',
          periode_name: 'Sudah Selesai',
        },
      ],
      disabledStatus: false,
      resultType: [
        {
          status_id: ' ',
          status_name: 'Semuanya',
        },
        {
          status_id: 'Menunggu Penentuan Pembayaran',
          status_name: 'Menunggu Penentuan Pembayaran',
        },
        {
          status_id: 'Menunggu Konfirimasi Petani',
          status_name: 'Menunggu Konfirimasi Petani',
        },
        {
          status_id: 'Menunggu Konfirmasi Upja',
          status_name: 'Menunggu Konfirmasi Upja',
        },
        {
          status_id: 'Menunggu Alsin dikirim',
          status_name: 'Menunggu Alsin dikirim',
        },
        {
          status_id: 'Sedang dikerjakan',
          status_name: 'Sedang dikerjakan',
        },
        {
          status_id: 'Selesai',
          status_name: 'Selesai',
        },
        {
          status_id: 'Transaksi ditolak Upja',
          status_name: 'Transaksi ditolak Upja',
        },
      ],
      resultPricing1: [
        {
          status_id: 'Transaksi ditolak Upja',
          status_name: 'Transaksi ditolak Upja',
        },
        {
          status_id: 'Menunggu Penentuan Pembayaran',
          status_name: 'Menunggu Penentuan Pembayaran',
        },
        {
          status_id: 'Menunggu Konfirimasi Petani',
          status_name: 'Menunggu Konfirimasi Petani',
        },
      ],
      resultPricing2: [
        {
          status_id: 'Menunggu Konfirimasi Petani',
          status_name: 'Menunggu Konfirimasi Petani',
        },
        {
          status_id: 'Menungggu Konfirmasi Upja',
          status_name: 'Menungggu Konfirmasi Upja',
        },
      ],
      resultPricing3: [
        {
          status_id: 'Menungggu Konfirmasi Upja',
          status_name: 'Menungggu Konfirmasi Upja',
        },
        {
          status_id: 'Menunggu Alsin dikirim',
          status_name: 'Menunggu Alsin dikirim',
        },
      ],
      resultPricing4: [
        {
          status_id: 'Menunggu Alsin dikirim',
          status_name: 'Menunggu Alsin dikirim',
        },
        {
          status_id: 'Sedang  dikerjakan',
          status_name: 'Sedang dikerjakan',
        },
      ],
      resultPricing5: [
        {
          status_id: 'Sedang dikerjakan',
          status_name: 'Sedang dikerjakan',
        },
        {
          status_id: 'Selesai',
          status_name: 'Selesai',
        },
      ],
      dynamicHeightEcommerce: '0px',
      dynamicHeightPelapak: '0px',
      loadingPage: false,
      loadingAlsin: true,

      resultAlsin: [],
      resultPricing: [],
      resultPricingDetail: [],
    };

    if (window.localStorage.getItem('accessList')) {
      accessList = JSON.parse(window.localStorage.getItem('accessList'));
    }
  }

  //set Current Limit
  handleSelect(event) {
    this.setState(
      {
        [event.target.name]: event.target.value,
        currentPage: 1,
        realCurrentPage: 1,
      },
      () => {
        this.getListbyPaging(1, this.state.todosPerPage, this.state.keyword);
      },
    );
  }

  handleSelectEditMasal(event) {
    this.setState(
      {
        ecommerceID: event.target.value,
      },
      () => {
        this.getOutletEcommerce();
      },
    );
  }

  handleSelectList(event) {
    this.setState(
      {
        [event.target.name]: event.target.value,
        currentPages: 1,
        realCurrentPages: 1,
      },
      () => {},
    );
  }

  //set Current Page
  paginationButton(event, flag, maxPage = 0) {
    var currPage = Number(event.target.value);
    if (currPage + flag > 0 && currPage + flag <= maxPage) {
      this.setState(
        {
          currentPage: currPage + flag,
          realCurrentPage: currPage + flag,
        },
        () => {
          this.getListbyPaging(
            this.state.currentPage,
            this.state.todosPerPage,
            this.state.keyword,
          );
        },
      );
    }
  }

  paginationButtonList(event, flag, maxPages = 0) {
    var currPages = Number(event.target.value);
    if (currPages + flag > 0 && currPages + flag <= maxPages) {
      this.setState(
        {
          currentPages: currPages + flag,
          realCurrentPages: currPages + flag,
        },
        () => {
          this.getPelapak(this.state.currentPages, this.state.todosPerPages);
        },
      );
    }
  }

  enterPressedPage = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      if (this.state.currentPage > 0) {
        if (this.state.currentPage > this.state.maxPage) {
          this.setState(
            prevState => ({
              realCurrentPage: prevState.maxPage,
              currentPage: prevState.maxPage,
            }),
            () =>
              this.getListbyPaging(
                this.state.currentPage,
                this.state.todosPerPage,
                this.state.keyword,
              ),
          );
        } else {
          this.setState(
            prevState => ({
              realCurrentPage: prevState.currentPage,
            }),
            () =>
              this.getListbyPaging(
                this.state.currentPage,
                this.state.todosPerPage,
                this.state.keyword,
              ),
          );
        }
      }
    }
  };

  enterPressedPageList = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      if (this.state.currentPages > 0) {
        if (this.state.currentPages > this.state.maxPages) {
          this.setState(
            prevState => ({
              realCurrentPages: prevState.maxPages,
              currentPages: prevState.maxPages,
            }),
            () =>
              this.getPelapak(
                this.state.currentPages,
                this.state.todosPerPages,
              ),
          );
        } else {
          this.setState(
            prevState => ({
              realCurrentPages: prevState.currentPages,
            }),
            () =>
              this.getPelapak(
                this.state.currentPages,
                this.state.todosPerPages,
              ),
          );
        }
      }
    }
  };

  enterPressedSearch = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      // this.showNotification('Sedang Mencari data', 'info');
      event.preventDefault();
      this.setState(
        {
          currentPage: 1,
          realCurrentPage: 1,
        },
        () => {
          this.getListbyPaging(
            this.state.currentPage,
            this.state.todosPerPage,
            this.state.keyword,
          );
        },
      );
    }
  };

  enterPressedSearchList = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      this.setState(
        {
          currentPages: 1,
          realCurrentPages: 1,
          // modal_nested_parent_list: false
        },
        () => {
          this.getPelapak(this.state.currentPages, this.state.todosPerPages);
        },
      );
    }
  };

  enterPressedSearchListEditMasal = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      this.setState(
        {
          currentPages: 1,
          realCurrentPages: 1,
          // modal_nested_parent_list: false
        },
        () => {
          this.getOutletEcommerce();
        },
      );
    }
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

  getListbyPaging(currPage, currLimit) {
    var pelapakID = this.state.pilihPelapak;
    var ecommerceID = this.state.resultPelapakID;
    var periodeID = this.state.pilihPeriode;
    var lastID = this.state.lastID;
    var keyword = this.state.keyword;
    var action = this.state.action;
    const trace = perf.trace('getListbyPaging');
    trace.start();

    this.setState({ loadingPage: true });

    const url =
      myUrl.url_updateUpja +
      'length=' +
      currLimit +
      '&page=' +
      currPage +
      '&status=' +
      periodeID +
      '&outletid=' +
      pelapakID +
      '&ecommerceid=' +
      ecommerceID +
      '&procod=' +
      keyword +
      '&lastid=' +
      lastID +
      '&action=' +
      action;

    // console.log('URL GET LIST', url);
    // console.log('LAST ID', lastID);

    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };
    fetch(url, option)
      .then(response => {
        trace.stop();
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({
            loading: false,
          });
        }
      })
      .then(data => {
        console.log('data jalan GetlistByPaging', data);
        if (data.error.status === true) {
          this.showNotification(data.error.msg, 'error');
          this.setState({ setDataErrorStatus: true });
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            this.props.history.push({
              pathname: '/login',
            });
          }
          if (data.error.code === 101) {
          }
        } else {
          if (data.metadata.pages === 0) {
            this.setState({ maxPage: 1 });
          } else {
            if (data.data === null) {
              this.setState(
                {
                  setDataErrorStatus: true,
                  result: data,
                  maxPage: data.metadata.pages ? data.metadata.pages : 1,
                  lastIDtemp: data.metadata.lastidprev,
                  // lastID: data.metadata.lastid,
                  // lastIDprev: data.metadata.lastidprev,
                  loading: false,
                  loadingPage: false,
                },
                // () =>
                //   console.log(
                //     'NULL LAST ID === LAST ID PREV',
                //     this.state.lastID === this.state.lastIDtemp,
                //     this.state.lastID,
                //     this.state.lastIDtemp,
                //     // this.state.lastID - 10 === this.state.lastIDprev,
                //   ),
              );
            } else {
              this.setState({
                setDataErrorStatus: true,
                result: data,
                maxPage: data.metadata.pages ? data.metadata.pages : 1,
                lastID: data.metadata.lastid,
                lastIDprev: data.metadata.lastidprev,
                lastIDtemp: data.metadata.lastid,
                loading: false,
                loadingPage: false,
              });
            }
          }
        }
      })
      .catch(err => {
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({
          loading: false,
        });
      });
  }

  getOutletEcommerce() {
    var keyword = this.state.keyword;
    var ecommerceID = this.state.ecommerceID;
    const url =
      myUrl.url_updateUpja +
      '&ecommerceid=' +
      ecommerceID +
      '&keyword=' +
      keyword;
    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };
    fetch(url, option)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({
            loading: false,
          });
        }
      })
      .then(data => {
        if (data.error.status === true) {
          this.showNotification(data.error.msg, 'error');
          this.setState({ setDataErrorStatus: true });
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            this.props.history.push({
              pathname: '/login',
            });
          }
          if (data.error.code === 101) {
          }
        } else {
          if (data.metadata.pages === 0) {
            this.setState({ maxPage: 1 });
          } else {
            this.setState({
              setDataErrorStatus: true,
              resultPelapakEcommerce: data.data,
              maxPage: data.metadata.pages ? data.metadata.pages : 1,
              lastID: data.metadata.lastid,
              lastIDprev: data.metadata.lastidprev,
              loading: false,
            });
          }
        }
      })
      .catch(err => {
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({
          loading: false,
        });
      });
  }

  deleteHeaderData = first_param => {
    const trace = perf.trace('deleteHeaderData');
    trace.start();
    var url = myUrl.url_deleteAlsin;
    const deleteDataHeader = first_param;
    var token = window.localStorage.getItem('tokenCookies');
    console.log('DATA HEADER', deleteDataHeader);

    this.fetchData();
    var payload = {
      alsin_id: deleteDataHeader.alsin_id,
    };

    console.log('PAYLOAD', payload);

    const option = {
      method: 'DELETE',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `${'Bearer'} ${token}`,
      },
      body: JSON.stringify(payload),
    };
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
            loadingPage: false,
            loading: false,
          });
        }
      })
      .then(data => {
        console.log('DATA DELETE', data);
        var status = data.status;
        var message = data.result.message;
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPage: false,
            loading: false,
          });
        } else {
          this.showNotification(message, 'info');
          this.setState(
            {
              loadingPage: false,
              loading: false,
              modal_nested_parent_nonaktifAlsin: false,
              nested_parent_nonaktifAlsin: false,
            },
            () => this.getTransaksi(),
          );
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loadingPage: false,
          loading: false,
        });
      });
  };

  updateHeaderData = first_param => {
    const trace = perf.trace('updateHeaderData');
    trace.start();
    var url = myUrl.url_updateTransaksi;
    const updateHeaderData = first_param;
    const updateDetailData = this.state.resultPricing;
    var token = window.localStorage.getItem('tokenCookies');
    console.log('DATA DETAIL', updateDetailData);

    this.fetchData();
    if (updateHeaderData.statusFarmer !== undefined) {
      console.log('MASUK IF', updateHeaderData);
      if (updateHeaderData.status === updateHeaderData.statusFarmer) {
        updateHeaderData.status = updateHeaderData.status;
      } else {
        updateHeaderData.status = updateHeaderData.statusFarmer;
      }
    } else {
      updateHeaderData.status = updateHeaderData.status;
    }
    var payload = {
      // editPricing: updateHeaderData,
      status: updateHeaderData.status,
      transaction_order_id: updateHeaderData.transaction_order_id,
      transport_cost: parseInt(updateHeaderData.transport_cost),
      alsins: this.state.resultalsin,
      alsin_items: this.state.resultalsinItem,
      rmus: this.state.resultRMUS,
      rice: this.state.resultRices,
      training: this.state.resultTrainings,
      reparation: this.state.resultReparation,
      rice_seed: this.state.resultRiceSeeds,
      spare_part: this.state.resultSparePart,
    };

    console.log('PAYLOAD EDIT', payload);

    const option = {
      method: 'PUT',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `${'Bearer'} ${token}`,
      },
      body: JSON.stringify(payload),
    };

    this.setState({
      loading: false,
    });
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
            loadingPage: false,
            loading: false,
          });
        }
      })
      .then(data => {
        console.log('DATA EDIT', data);
        var status = data.status;
        var message = data.result.message;
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPage: false,
            loading: false,
          });
        } else {
          this.showNotification(message, 'info');
          this.setState(
            {
              loadingPage: false,
              loading: false,
              modal_nested_parent_editAlsin: false,
              modal_nested_editAlsin: false,
            },
            () => this.getTransaksi(),
          );
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loadingPage: false,
          loading: false,
        });
      });
  };

  getListPerOutlet(currPage, currLimit) {
    const trace = perf.trace('getListPerOutlet');
    // var pelapakID = this.state.pilihPelapak;
    // var ecommerceID = this.state.pilihEcommerce;
    var pelapakID = '';
    var ecommerceID = '';
    trace.start();
    const url =
      myUrl.url_updateUpja +
      'length=' +
      currLimit +
      '&page=' +
      currPage +
      '&outletid=' +
      pelapakID +
      '&ecommerceid=' +
      ecommerceID;

    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };
    fetch(url, option)
      .then(response => {
        trace.stop();
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({
            loading: false,
          });
        }
      })
      .then(data => {
        if (data.responseMessage === 'FALSE') {
          this.showNotification(data.responseDescription, 'error');
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            window.localStorage.removeItem('tokenCookies');
            window.localStorage.removeItem('accessList');
            this.props.history.push({
              pathname: '/',
            });
          }
        } else {
          this.setState({
            resultBatasPerPelapak: data.data,
            maxPage: data.metadata.pages ? data.metadata.pages : 1,
            loading: false,
          });
        }
      })
      .catch(err => {
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({
          loading: false,
        });
      });
  }

  getListDefault() {
    const trace = perf.trace('getListDefault');
    trace.start();
    const url = myUrl.url_updateUpja;

    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };
    fetch(url, option)
      .then(response => {
        trace.stop();
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({
            loading: false,
          });
        }
      })
      .then(data => {
        if (data.responseMessage === 'FALSE') {
          this.showNotification(data.responseDescription, 'error');
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            window.localStorage.removeItem('tokenCookies');
            window.localStorage.removeItem('accessList');
            this.props.history.push({
              pathname: '/',
            });
          }
        } else {
          this.setState({
            currentDimenBatasStandar: data.data[0],
            nilaiLamaPharos: data.data[0].dividerlnbupripi,
            nilaiLamaNonPharos: data.data[0].dividerlnbuprinonpi,
            loading: false,
          });
        }
      })
      .catch(err => {
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({
          loading: false,
        });
      });
  }

  // Get Outlet
  getPelapak(currPage, currLimit) {
    var offset = (currPage - 1) * currLimit;
    var keyword = this.state.keywordList;
    const urlA =
      myUrl.url_updateUpja +
      '&offset=' +
      offset +
      '&limit=' +
      currLimit +
      '&keyword=' +
      keyword;

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
        if (data.error.status === true) {
          this.showNotification(data.error.msg, 'error');
        } else {
          this.setState({
            resultPelapak: data.data,
            maxPages: data.metadata.pages ? data.metadata.pages : 1,
            loading: false,
          });
        }
      });
  }

  getAllEcommerce() {
    const trace = perf.trace('getAllEcommerce');
    const urlA = myUrl.url_updateUpja;
    trace.start();
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
        trace.stop();
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        this.setState({ resultEcommerce: data.data });
      });
  }

  getAccess() {
    var access = accessList[30];
    access &&
      access.map(todo => {
        return <tr>{todo === 61 && this.setState({ menuID: 61 })}</tr>;
      });
  }

  getPelapakID() {
    const trace = perf.trace('getPelapakID');
    trace.start();
    const urlA =
      myUrl.url_updateUpja +
      'outletId=' +
      this.state.pilihPelapak +
      '&ecommerceId=' +
      this.state.pilihEcommerce;
    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };
    window.localStorage.setItem('ecommerceID', this.state.pilihEcommerce);
    window.localStorage.setItem('pelapakID', this.state.pilihPelapak);

    fetch(urlA, option)
      .then(response => {
        trace.stop();
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        if (data.data === null) {
          return;
        } else {
          this.setState({ resultPelapakID: data.data[0].pelapak_id }, () =>
            window.localStorage.setItem(
              'insertPelapakID',
              this.state.resultPelapakID,
            ),
          );
        }
      });
  }

  // untuk pilih Pelapak
  setPelapakEditMasal = event => {
    var nama = this.state.resultPelapakEcommerce.find(function (element) {
      return element.pelapakid === parseInt(event.target.value);
    });

    var listPelapak = this.state.idPelapak;
    var listDetail = this.state.pelapakDetail;

    this.setState(
      {
        pilihPelapak2: event.target.value,
        namaPelapak2: nama.outletname,
        modal_nested_parent_list_editMasal: false,
        keywordList: '',
        ecommerceDisabled: false,
        outletData: nama,

        pelapak2: nama.outletname,
        pelapakDetail: listDetail,
        idPelapak: listPelapak,
      },
      () => {
        var newpelapakDetail = {
          pelapakid: nama.pelapakid,
          ecommerceid: nama.ecommerceid,
          ecommercename: nama.ecommercename,
          outletid: nama.outletid,
          outletname: nama.outletname,
        };

        var newArr = listDetail.filter(
          item => item.pelapakid === newpelapakDetail.pelapakid,
        );

        if (newArr.length > 0) {
        } else {
          listDetail.push(newpelapakDetail);
          this.dynamicHeightPelapak();
        }
      },
      this.setState(
        {
          keyword: '',
          ecommerceID: '',
        },
        () => this.getOutletEcommerce(),
      ),
    );
  };

  // untuk pilih Pelapak
  setAlsinItem = event => {
    var nama = this.state.resultAllAlsinType.find(function (element) {
      return element.id === parseInt(event.target.value);
    });

    this.setState({
      pilihAlsin: event.target.value,
      namaAlsin: nama.name,
    });
  };
  // untuk pilih Outlet

  // untuk pilih Ecommerce
  setEcommerce = event => {
    var nama = this.state.resultEcommerce.find(function (element) {
      return element.ecommerce_id === event.target.value;
    });
    this.setState({
      pilihEcommerce: event.target.value,
      namaEcommerce: nama.ecommerce_name,
      modal_nested_parent_list_ecommerceList: false,
    });
  };

  // untuk pilih Ecommerce
  setPeriode = event => {
    var buttonSearch = document.getElementById('buttonSearch');

    var nama = this.state.resultPeriode.find(function (element) {
      return element.periode_id === event.target.value;
    });
    this.setState({
      pilihPeriode: event.target.value,
      namaPeriode: nama.periode_name,
      modal_nested_parent_list_periodeList: false,
    });
    buttonSearch.disabled = false;
  };

  // untuk pilih Status
  setType = event => {
    var nama = this.state.resultType.find(function (element) {
      return element.status_id === event.target.value;
    });
    this.setState({
      pilihStatus: event.target.value,
      namaStatus: nama.status_name,
      namaStatusTemp: nama.status_name,
      modal_nested_parent_list_provinsi: false,
      domisiliDisabled: false,
    });
  };

  setEcommerceBatasPerPelapak = event => {
    this.setState({ pilihEcommerceBatasPerPelapak: event.target.value });
  };

  setEcommerceEditMassal = event => {
    var nama = this.state.resultEcommerce.find(function (element) {
      return element.ecommerce_id === event.target.value;
    });
    var listDetail = this.state.ecommerceDetail;
    this.setState(
      {
        pilihEcommerce2: event.target.value,
        namaEcommerce2: nama.ecommerce_name,
        ecommerceDetail: listDetail,
        modal_nested_parent_list_ecommerceListEditMasal: false,
      },
      () => {
        var newEcommerceDetail = {
          ecommerceID: this.state.pilihEcommerce2,
          ecommerceName: this.state.namaEcommerce2,
        };
        var newArr = listDetail.filter(
          item => item.ecommerceID === newEcommerceDetail.ecommerceID,
        );

        if (newArr.length > 0) {
        } else {
          listDetail.push(newEcommerceDetail);
          this.dynamicHeightEcommerce();
        }
      },
      this.getAllEcommerce(),
    );
  };
  // untuk pilih ecommerce

  setListEditMassal = (param, param2) => {
    var listDetail = this.state.listEditMasal;
    // console.log('EDIT BATAS BAWAH', param, '@@@', param2);

    this.setState(
      {
        listEditMasal: listDetail,
      },
      () => {
        var newlistEditMasal = {
          alsin_type_id: this.state.addAlsin.alsin_type_id,
          cost: parseInt(this.state.addAlsin.cost),
          total_item: parseInt(this.state.addAlsin.total_item),
          alsin_type_name: this.state.addAlsin.alsin_type_name,
          vechile_code: this.state.addAlsin.vechile_code,
          alsin_item_id: this.state.addAlsin.alsin_item_id,
        };

        var newArr = listDetail.filter(
          item => item.alsin_item_id === param2.alsin_item_id,
        );

        if (newArr.length > 0) {
        } else {
          listDetail.push(newlistEditMasal);
        }

        console.log('LIST EDIT MASAL', newArr);

        this.setState({
          modal_tambahProduk: false,
          modal_backdrop_tambahProduk: false,
          modal_nested_parent_tambahProduk: false,
          modal_nested_tambahProduk: false,
        });
      },
    );
  };

  setListEditMassalEdit = (param, todo) => {
    var listDetail = [param];

    this.setState(
      {
        listEditMasal: listDetail,
      },
      () => {
        var newresultPricing = {
          alsin_type_id: this.state.editAlsinList.alsin_type_id,
          alsin_type_name: this.state.editAlsinList.alsin_type_name,
          cost: parseInt(this.state.editAlsinList.cost),
          total_item: parseInt(this.state.editAlsinList.total_item),
          transaction_order_type_id: this.state.editAlsinList
            .transaction_order_type_id,
        };

        var newArr = listDetail.filter(
          item => item.alsin_type_id === todo.alsin_type_id,
        );

        if (newArr.length > 0) {
        } else {
          listDetail.push(newresultPricing);
        }

        console.log('ISI SETELAH PUSH', listDetail);

        this.setState({
          modal_editMassal_edit: false,
          modal_backdrop_editMassal_edit: false,
          modal_nested_parent_editMassal_edit: false,
          modal_nested_editMassal_edit: false,
        });
      },
    );
  };

  onEnterSearchProcod = (event, param) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      const trace = perf.trace('onEnterSearchProcod');
      trace.start();
      const currButton = event.target;

      currButton.disabled = true;

      var url = myUrl.url_updateUpja + '?findby=procodes';

      var payload = {
        procodes: [param.trim()],
      };
      console.log('URL PROCOD', url);
      const option = {
        method: 'POST',
        json: true,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: window.localStorage.getItem('tokenCookies'),
        },
        body: JSON.stringify(payload),
      };

      fetch(url, option)
        .then(response => {
          console.log('RESPONSE PROCOD', response);
          trace.stop();
          if (response.ok) {
            this.setState({ procod: '' });
            return response.json();
          } else {
            this.showNotification('Response ke server gagal!', 'error');
            currButton.disabled = false;
            this.setState({
              loading: false,
              procod: '',
            });
          }
        })
        .then(result => {
          var data = result.data;
          console.log('ISI DATA PROCOD', result);
          if (data === null) {
            this.showNotification(
              'Data tidak ditemukan atau sudah pernah di Input sebelumnya!',
              'error',
            );
            this.setState({
              newProductDesc: '',
              newProcode: '',
              procod: '',
              qty: '',
            });
            currButton.disabled = false;
          } else {
            this.setState({
              resultDataProcod: data[0],
            });
            this.setState(prevState => ({
              currentDimen: {
                ...prevState.currentDimen,
                productID: data[0].productName ? data[0].ProductID : '',
                qty: data[0].qty,
              },
            }));
            currButton.disabled = false;
          }
        })
        .catch(err => {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({
            loading: false,
          });
          currButton.disabled = false;
        });
    }
  };

  searchBarcode = () => event => {
    const trace = perf.trace('searchProcod');
    trace.start();
    const currButton = event.target;
    var procod = this.state.procod;

    currButton.disabled = true;

    var url = myUrl.url_updateUpja + '?findby=procodes';

    var payload = {
      procodes: [procod.trim()],
    };
    console.log('URL PROCOD', url);
    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
      body: JSON.stringify(payload),
    };

    fetch(url, option)
      .then(response => {
        trace.stop();
        if (response.ok) {
          this.setState({ procod: '' });
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          currButton.disabled = false;
          this.setState({
            loading: false,
            procod: '',
          });
        }
      })
      .then(result => {
        var data = result.data;
        console.log('ISI DATA PROCOD: ', data);
        if (data === null) {
          this.showNotification(
            'Data tidak ditemukan atau sudah pernah di Input sebelumnya!',
            'error',
          );
          this.setState({
            newProductDesc: '',
            newProcode: '',
            procod: '',
            qty: '',
          });
          currButton.disabled = false;
        } else {
          this.setState({
            resultDataProcod: data[0],
          });
          this.setState(prevState => ({
            currentDimen: {
              ...prevState.currentDimen,
              productID: data[0].productName ? data[0].ProductID : '',
              qty: data[0].qty,
            },
          }));
          currButton.disabled = false;
        }
      })
      .catch(err => {
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({
          loading: false,
        });
        currButton.disabled = false;
      });
  };

  setProfileData() {
    var profileObj = JSON.parse(window.localStorage.getItem('profile'));

    this.setState({
      nip_user: profileObj['mem_nip'],
      nama_user: profileObj['mem_username'],
    });
  }

  insertListEditMasal = () => {
    const trace = perf.trace('insertListEditMasal');
    trace.start();
    var productDetail = this.state.listEditMasal;
    var url = myUrl.url_insertAlsin;
    var token = window.localStorage.getItem('tokenCookies');
    this.setState({ enterButton: true });

    this.fetchData();
    var payload = {
      alsins: productDetail,
    };

    console.log('PAYLOAD', payload);

    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `${'Bearer'} ${token}`,
      },
      body: JSON.stringify(payload),
    };

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
            loadingPage: false,
            loading: false,
            modal_nested_parent_editMassal: false,
            modal_nested_editMassal: false,
          });
        }
      })
      .then(data => {
        var status = data.status;
        var message = data.result.message;
        console.log('data Insert isinya:', data);
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPage: false,
            loading: false,
            modal_nested_parent_editMassal: false,
            modal_nested_editMassal: false,
          });
        } else {
          this.showNotification(message, 'info');
          this.setState(
            {
              loadingPage: false,
              loading: false,
              modal_nested_parent_editMassal: false,
              modal_nested_editMassal: false,
            },
            () => this.getTransaksi(),
          );
        }
      })
      .catch(err => {
        console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loadingPage: false,
          loading: false,
          modal_nested_parent_editMassal: false,
          modal_nested_editMassal: false,
        });
      });
  };

  // updateDataHeader = first_param => {
  //   var url = myUrl.url_updateUpja;
  //   const editAlsin = first_param;

  //   this.fetchData();
  //   var payload = {
  //     outletid: editDimen.outletid,
  //     ecommerceid: editDimen.ecommerceid,
  //     procod: editDimen.procod,
  //     limitpriceecommerce: parseInt(editDimen.limitpriceecommerce),
  //     startdate: tanggalAwal,
  //     enddate: tanggalAkhir,
  //     activeyn: editDimen.activeyn,
  //     updatedby: this.state.nip_user,
  //     limitid: editDimen.limitid,
  //   };

  //   const option = {
  //     method: 'PUT',
  //     json: true,
  //     headers: {
  //       'Content-Type': 'application/json;charset=UTF-8',
  //       Authorization: window.localStorage.getItem('tokenCookies'),
  //     },
  //     body: JSON.stringify(payload),
  //   };
  //   fetch(url, option)
  //     .then(response => {
  //       trace.stop();
  //       if (response.ok) {
  //         // this.getListbyPaging();
  //         this.setState({
  //           modal_nested_edit: false,
  //           modal_nested_parent_edit: false,
  //           loading: false,
  //           editDimen: {},
  //           lastID: 0,
  //         });
  //         return response.json();
  //       } else {
  //         this.showNotification('Koneksi ke server gagal!', 'error');
  //         this.setState({ loading: false, enterButton: false });
  //       }
  //     })
  //     .then(data => {
  //       if (data.responseMessage === 'FALSE') {
  //         this.showNotification(data.responseDescription, 'error');
  //         if (data.error.code === 401) {
  //           this.showNotification(
  //             'Token anda sudah expired, silakan login kembali!',
  //             'error',
  //           );
  //           window.localStorage.removeItem('tokenCookies');
  //           window.localStorage.removeItem('accessList');
  //           this.props.history.push({
  //             pathname: '/',
  //           });
  //         }
  //       } else {
  //         if (data.data.message.includes('tidak')) {
  //           this.showNotification(data.data.message, 'error');
  //         } else {
  //           this.showNotification(data.data.message, 'info');
  //           this.getListbyPaging(1, 5);
  //         }
  //       }
  //     })
  //     .catch(err => {
  //       this.showNotification('Koneksi ke server gagal!', 'error');
  //       this.setState({ loading: false, enterButton: false });
  //     });
  // };

  updateBatasStandarDefault = first_param => {
    const trace = perf.trace('updateBatasStandarDefault');
    trace.start();
    var url = myUrl.url_updateUpja;
    const editBatasDefault = first_param;

    this.fetchData();
    var payload = {
      limitpricevslnbupripi: editBatasDefault.limitpricevslnbupripi,
      limitpricevslnbuprinonpi: editBatasDefault.limitpricevslnbuprinonpi,
      dividerlnbupripi: parseFloat(editBatasDefault.dividerlnbupripi),
      dividerlnbuprinonpi: parseFloat(editBatasDefault.dividerlnbuprinonpi),
      updatedby: this.state.nip_user,
    };

    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
      body: JSON.stringify(payload),
    };
    fetch(url, option)
      .then(response => {
        trace.stop();
        if (response.ok) {
          // this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
          this.componentDidMount();
          this.setState({
            modal_nested: false,
            modal_nested_parent: false,
            loading: false,
            currentDimenBatasStandar: [],
          });
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({ loading: false, enterButton: false });
        }
      })
      .then(data => {
        if (data.responseMessage === 'FALSE') {
          this.showNotification(data.responseDescription, 'error');
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            window.localStorage.removeItem('tokenCookies');
            window.localStorage.removeItem('accessList');
            this.props.history.push({
              pathname: '/',
            });
          }
        } else {
          this.showNotification('Data berhasil diubah', 'info');
        }
      })
      .catch(err => {
        // console.log('ISI ERRORNYA:', err);
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({ loading: false, enterButton: false });
      });
  };

  deleteBatasPerPelapak = first_param => {
    const trace = perf.trace('deleteBatasPerPelapak');
    trace.start();
    var url = myUrl.url_updateUpja;
    const deleteBatasPerPelapak = first_param;

    this.fetchData();
    var payload = {
      outletid: deleteBatasPerPelapak.outletid,
      ecommerceid: deleteBatasPerPelapak.ecommerceid,
      activeyn: 'N',
      // updatedby: deleteBatasPerPelapak.updatedby,
      updatedby: this.state.nip_user,
    };

    const option = {
      method: 'PUT',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
      body: JSON.stringify(payload),
    };
    fetch(url, option)
      .then(response => {
        // console.log('RESPONSE DELETE', response);
        trace.stop();
        if (response.ok) {
          // this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
          this.componentDidMount();
          this.setState({
            modal_nested_deleteBatasPerPelapak: false,
            modal_nested_parent_deleteBatasPerPelapak: false,
            loading: false,
            deleteBatasPerPelapak: [],
          });
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({ loading: false, enterButton: false });
        }
      })
      .then(data => {
        if (data.responseMessage === 'FALSE') {
          this.showNotification(data.responseDescription, 'error');
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            window.localStorage.removeItem('tokenCookies');
            window.localStorage.removeItem('accessList');
            this.props.history.push({
              pathname: '/',
            });
          }
        } else {
          this.showNotification(data.data.message, 'info');
        }
      })
      .catch(err => {
        // console.log('ISI ERRORNYA:', err);
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({ loading: false, enterButton: false });
      });
  };

  updateBatasPerPelapak = param => {
    const trace = perf.trace('updateBatasPerPelapak');
    trace.start();
    var url = myUrl.url_updateUpja;
    const editBatasPerPelapak = param;

    this.fetchData();
    var payload = {
      outletid: editBatasPerPelapak.outletid,
      ecommerceid: editBatasPerPelapak.ecommerceid,
      limitpricevslnbupri: editBatasPerPelapak.limitpricevslnbupri,
      limitpricevslnbuprinonpi: editBatasPerPelapak.limitpricevslnbuprinonpi,
      limitpriceproduct: editBatasPerPelapak.limitpriceproduct,
      dividerlnbupripi: parseFloat(editBatasPerPelapak.dividerlnbupripi),
      dividerlnbuprinonpi: parseFloat(editBatasPerPelapak.dividerlnbuprinonpi),
      activeyn: editBatasPerPelapak.activeyn,
      updatedby: this.state.nip_user,
    };

    // console.log('ISI PAYLOAD', payload);

    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
      body: JSON.stringify(payload),
    };

    // console.log('OPTION', option);
    fetch(url, option)
      .then(response => {
        // console.log('RESPONSE', response);
        trace.stop();
        if (response.ok) {
          // this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
          this.componentDidMount();
          this.setState({
            modal_nested_editBatasPerPelapak: false,
            modal_nested_parent_editBatasPerPelapak: false,
            editBatasPerPelapak: {},
            loading: false,
          });
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({ loading: false, enterButton: false });
        }
      })
      .then(data => {
        // console.log('DATA PER PELAPAK', data);
        if (data.responseMessage === 'FALSE') {
          this.showNotification(data.responseDescription, 'error');
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            window.localStorage.removeItem('tokenCookies');
            window.localStorage.removeItem('accessList');
            this.props.history.push({
              pathname: '/',
            });
          }
        } else {
          this.showNotification(data.data.message, 'info');
        }
      })
      .catch(err => {
        // console.log('ISI ERRORNYA:', err);
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({ loading: false, enterButton: false });
      });
  };

  hapusProduk = first_param => () => {
    var url = myUrl.url_updateUpja;
    const delete_data = first_param;
    var pelapakID = this.state.pilihPelapak;
    this.fetchData();
    var payload = {
      outlet_id: delete_data.pelapakID,
      procod: delete_data.procod,
    };

    const option = {
      method: 'DELETE',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
      body: JSON.stringify(payload),
    };
    fetch(url, option)
      .then(response => response.json())
      .then(data => {
        this.setState({
          modal_delete: false,
          modal_nested_delete: false,
          modal_nested_parent_delete: false,
          loading: false,
        });
        this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
        this.setState({ modal_delete: false });
        this.showNotification('Data Berhasil Di Hapus', 'info');
      });
  };

  setData = (data = null) => {
    if (data === null || data === -1) {
      return '-';
    } else {
      if (typeof data === 'number' && !Number.isInteger(data)) {
        return data.toFixed(2);
      } else {
        return data;
      }
    }
  };

  getTransaksi() {
    var pilihStatus = this.state.pilihStatus;
    const url = myUrl.url_getTransaksi + '?status=' + pilihStatus;
    var token = window.localStorage.getItem('tokenCookies');
    console.log('URL GET LIST TRANSAKSI', url);

    this.setState({ loadingAlsin: true });
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
            loadingAlsin: false,
          });
        }
      })
      .then(data => {
        var status = data.status;
        var result = data.result.transactions;
        var message = data.result.message;
        console.log('Data Transaksi', data);
        if (status === 0) {
          this.showNotification(message, 'error');
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState({
            resultAlsin: result,
            loadingAlsin: false,
          });
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loadingAlsin: false,
        });
      });
  }

  getAllAlsinType() {
    const url = myUrl.url_allAlsinType;
    var token = window.localStorage.getItem('tokenCookies');
    // console.log('URL GET LIST', url);

    this.setState({ loadingAlsin: true });
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
            loadingAlsin: false,
          });
        }
      })
      .then(data => {
        var status = data.status;
        var result = data.result.alsins;
        var message = data.result.message;
        // console.log('ALSIN TYPE DATA', data);
        if (status === 0) {
          this.showNotification(message, 'error');
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState(
            {
              resultAllAlsinType: result,
              loadingAlsin: false,
            },
            // () =>
            //   console.log('RESULT ALSIN ITEM', this.state.resultAllAlsinType),
          );
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loadingAlsin: false,
        });
      });
  }

  componentDidMount() {
    this.getAccess();
    this.setProfileData();
    // this.getAllEcommerce();
    // this.getOutletEcommerce();
    // this.getListDefault();
    // this.getListPerOutlet(this.state.currentPage, this.state.todosPerPage);
    // this.getPelapak(this.state.currentPages, this.state.todosPerPages);
    this.getAllAlsinType();
    this.getTransaksi();
  }

  // KHUSUS STATE MODAL

  //modal batas standar
  state = {
    modal: false,
    modal_backdrop: false,
    modal_nested_parent: false,
    modal_nested: false,
    backdrop: true,
  };

  //modal batas per pelapak
  state = {
    modal_batasPerPelapak: false,
    modal_backdrop_batasPerPelapak: false,
    modal_nested_parent_batasPerPelapak: false,
    modal_nested_batasPerPelapak: false,
    backdrop_batasPerPelapak: true,
  };

  //modal Edit Batas per Pelapak
  state = {
    modal_editBatasPerPelapak: false,
    modal_backdrop_editBatasPerPelapak: false,
    modal_nested_parent_editBatasPerPelapak: false,
    modal_nested_editBatasPerPelapak: false,
    editBatasPerPelapak: {},
    tempEditBatasPerPelapak: {},
  };

  //modal Edit Massal
  state = {
    modal_editMassal: false,
    modal_backdrop_editMassal: false,
    modal_nested_parent_editMassal: false,
    modal_nested_editMassal: false,
    editDimen: {},
  };

  //modal Edit - edit Massal
  state = {
    modal_editMassal_edit: false,
    modal_backdrop_editMassal_edit: false,
    modal_nested_parent_editMassal_edit: false,
    modal_nested_editMassal_edit: false,
    editBatasBawah: {},
  };

  //modal Edit
  state = {
    modal_edit: false,
    modal_backdrop: false,
    modal_nested_parent_edit: false,
    modal_nested_edit: false,
    editDimen: {},
  };

  //modal delete
  state = {
    modal_delete: false,
    modal_backdrop: false,
    modal_nested_parent_delete: false,
    delete_data: {},
    modal_nested_delete: false,
  };

  //modal nonaktif
  state = {
    modal_nonaktif: false,
    modal_backdrop: false,
    modal_nested_parent_nonaktif: false,
    nonaktif_data: {},
    modal_nested_nonaktif: false,
  };

  //modal tambah Produk
  state = {
    modal_tambahProduk: false,
    modal_backdrop_tambahProduk: false,
    modal_nested_parent_tambahProduk: false,
    modal_nested_tambahProduk: false,
    backdrop_tambahProduk: true,
  };

  // KHUSUS STATE MODAL
  toggleEditData = (modalType, todo) => {
    if (!modalType) {
      const modal_edit = Object.assign({}, this.state.modal_edit);
      return this.setState({
        modal_edit: !modal_edit,
      });
    }
    if (modalType === 'nested_parent_editMassal_edit') {
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        editAlsinList: todo,
      });
    }
    if (modalType === 'nested_parent_editBatasPerPelapak') {
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        editBatasPerPelapak: todo,
        tempEditBatasPerPelapak: [todo.limitpriceecommerce],
      });
    } else {
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        editDimen: todo,
        tempEditDimen: [todo.limitpriceecommerce],
      });
    }
  };

  toggleDeleteData = (modalType, todo) => {
    if (!modalType) {
      const modal_delete = Object.assign({}, this.state.modal_delete);
      return this.setState({
        modal_delete: !modal_delete,
      });
    }

    if (modalType === 'nested_parent_delete') {
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
      });
    } else if (modalType === 'nested_parent_deleteBatasPerPelapak') {
      this.setState({
        deleteBatasPerPelapak: todo,
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
      });
    } else if (modalType === 'nested_parent_nonaktifHeaderData') {
      this.setState({
        deleteDataHeader: todo,
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
      });
    } else {
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        delete_data: todo,
      });
    }
  };

  toggleYN = (modalType, todo) => {
    if (!modalType) {
      const modal_nonaktif = Object.assign({}, this.state.modal_nonaktif);
      return this.setState({
        modal_nonaktif: !modal_nonaktif,
      });
    }
    if (modalType === 'nested_parent_nonaktif') {
      // console.log('LOG 1');
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        nonaktif: todo,
      });
    } else {
      // console.log('LOG 2');
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        nonaktif: todo,
      });
    }
  };

  toggle = (modalType, todo) => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
        keywordList: '',
        realCurrentPages: 1,
        maxPages: 1,
        currentPages: 1,
        ecommerceIDtemp: this.state.ecommerceID,
      });
    }

    // console.log('MODAL TYPEE', modalType);
    if (modalType === 'nested_parent_editAlsin') {
      // console.log('LOG 1');
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        editAlsin: todo,
        disabledStatus: false,
      });
    } else if (modalType === 'nested_parent_nonaktifAlsin') {
      // console.log('LOG 1');
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        deleteAlsin: todo,
      });
    } else if (modalType === 'nested_parent_tambahProduk') {
      // console.log('LOG 1');
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        addAlsin: todo,
      });
    } else {
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        keywordList: '',
        realCurrentPages: 1,
        maxPages: 1,
        currentPages: 1,
      });
    }
  };

  toggleDeleteData = (modalType, todo) => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
        keywordList: '',
        realCurrentPages: 1,
        maxPages: 1,
        currentPages: 1,
        ecommerceIDtemp: this.state.ecommerceID,
        editAlsin: todo,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
      keywordList: '',
      realCurrentPages: 1,
      maxPages: 1,
      currentPages: 1,
      editAlsin: todo,
    });
  };

  fetchData = () => {
    this.setState({ loading: true });
  };

  handleClose = () => {
    this.setState({
      currentDimenBatasStandar: {
        dividerlnbupripi: this.state.nilaiLamaPharos,
        dividerlnbuprinonpi: this.state.nilaiLamaNonPharos,
      },
      editBatasBawah: {},
      resultDataProcod: [],
      addAlsin: {},
    });
  };

  handleCloseEditMasal = () => {
    this.setState({
      editBatasBawah: [],
      listEditMasal: [],
      pelapakDetail: [],
      ecommerceDetail: [],
      dynamicHeightEcommerce: '0px',
      dynamicHeightPelapak: '0px',
    });
  };

  toggleTambah = modalType => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
        keywordList: '',
        realCurrentPages: 1,
        maxPages: 1,
        currentPages: 1,
        ecommerceIDtemp: this.state.ecommerceID,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
      keywordList: '',
      realCurrentPages: 1,
      maxPages: 1,
      currentPages: 1,
    });
  };

  handleCloseTambahMasal = () => {
    this.setState(
      {
        endDate: '',
        startDate: '',
      },
      () => this.toggleTambah('nested_parent_editMassal'),
    );
  };

  canBeSearch() {
    const { procod } = this.state;
    return procod.length !== 0 && procod.trim().length !== 0;
  }

  SearchAllList() {
    const { pilihStatus } = this.state;
    return pilihStatus !== '';
  }

  updateTanggalValue = field => evt => {
    this.setState(
      {
        [`${field}`]: evt.target.value,
      },
      () => this.validateTgl(field),
    );
    evt.preventDefault();
  };

  validateTgl(field) {
    var d1 = Date.parse(this.state.startDate);
    var d2 = Date.parse(this.state.endDate);
    var today = Date.parse(new Date().toJSON().slice(0, 10));

    if (isNaN(d2)) {
      if (d1 < today) {
        this.showNotification(
          'Tanggal Start tidak boleh kurang dari hari ini!',
          'error',
        );
      }
      return;
    }
    if (d1 > d2) {
      this.showNotification(
        'Tanggal Expired tidak boleh kurang dari hari ini!',
        'error',
      );
    } else {
      this.updateTanggalValue();
    }
  }

  deletePelapakProps(todo) {
    var pelapakList =
      this.state.pelapakDetail && this.state.pelapakDetail.length;
    var newArr = this.state.pelapakDetail.filter(
      item => item.pelapakid !== todo.pelapakid,
    );

    this.setState({
      pelapakDetail: newArr,
    });

    if (pelapakList === 1) {
      this.setState({ dynamicHeightPelapak: '0px' });
    }
  }

  deleteListEditMassal(todo) {
    var newArr = this.state.listEditMasal.filter(
      item => item.alsin_item_id !== todo.alsin_item_id,
    );
    this.setState({
      listEditMasal: newArr,
    });
  }

  dynamicHeightPelapak() {
    var pelapakList =
      this.state.pelapakDetail && this.state.pelapakDetail.length;

    if (pelapakList > 0) {
      this.setState({ dynamicHeightPelapak: '120px' });
      return;
    }
    if (pelapakList === 0) {
      this.setState({ dynamicHeightPelapak: '0px' });
    }
  }

  dynamicHeightEcommerce() {
    var ecommerceList =
      this.state.ecommerceDetail && this.state.ecommerceDetail.length;

    if (ecommerceList > 0) {
      this.setState({ dynamicHeightEcommerce: '80px' });
      return;
    }
    if (ecommerceList === 0) {
      this.setState({ dynamicHeightEcommerce: '0px' });
    }
  }

  setModalProvinsi() {
    var buttonSearch = document.getElementById('buttonSearch');
    buttonSearch.disabled = false;
    this.setState(
      {
        periodeDisabled: false,
        typeDisabled: true,
        // domisiliDisabled: true,
        // namaEcommerce: '',
      },
      this.toggle('nested_parent_list_provinsi'),
    );
  }

  findData() {
    var buttonSearch = document.getElementById('buttonSearch');
    buttonSearch.disabled = true;
    this.setState(
      {
        namaStatusSave: this.state.namaStatus,
      },
      () =>
        this.setState(
          {
            namaStatus: '',
          },
          () => this.getTransaksi(),
        ),
    );
  }

  resetSearch() {
    var buttonSearch = document.getElementById('buttonSearch');
    buttonSearch.disabled = true;
    this.setState({
      namaPelapak: '',
      namaEcommerce: '',
      namaPeriode: '',
      ecommerceDisabled: true,
      pelapakDisabled: false,
      periodeDisabled: true,
    });
  }

  setModalPelapak() {
    this.setState(
      {
        ecommerceDisabled: true,
        // namaEcommerce: '',
      },
      this.toggle('nested_parent_list'),
    );
  }

  setModalEcommerce() {
    this.setState(
      {
        periodeDisabled: false,
        pelapakDisabled: true,
        // namaEcommerce: '',
      },
      this.toggle('nested_parent_list_ecommerceList'),
    );
  }

  setModalPeriode() {
    this.setState(
      {
        periodeDisabled: false,
        pelapakDisabled: true,
        ecommerceDisabled: true,
        // namaEcommerce: '',
      },
      this.toggle('nested_parent_list_periodeList'),
    );
  }

  toggleEdit = (modalType, todo) => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
        keywordList: '',
        realCurrentPages: 1,
        maxPages: 1,
        currentPages: 1,
        ecommerceIDtemp: this.state.ecommerceID,
      });
    }

    this.setState(
      {
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        keywordList: '',
        realCurrentPages: 1,
        maxPages: 1,
        currentPages: 1,
        editPricing: todo,
        editPricingTemp: todo,
      },
      () => this.getTransactionFormPricing(this.state.editPricing),
    );
  };

  getTransactionFormPricing(todo) {
    const url =
      myUrl.url_showFormPricing +
      '?transaction_order_id=' +
      todo.transaction_order_id;
    var token = window.localStorage.getItem('tokenCookies');
    console.log('URL GET LIST', url);

    // this.setState({ loadingAlsin: true });
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
            loadingAlsin: false,
          });
        }
      })
      .then(data => {
        var status = data.status;
        var result = data.result.alsins;
        var message = data.result.message;
        var resultPricingService = data.result.other_service;
        console.log('Data Transaksi', data);
        if (status === 0) {
          // this.showNotification(message, 'error');
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState({
            resultPricing: result,
            resultPricingHeader: data.result.alsin_types,
            resultHeader: data.result.header,

            loadingAlsin: false,
            resultalsin: data.result.alsin_types,
            resultalsinItem: data.result.alsins,
            resultReparation: data.result.reparations,
            resultRiceSeeds: data.result.rice_seeds,
            resultRices: data.result.rices,
            resultRMUS: data.result.rmus,
            resultSparePart: data.result.spare_parts,
            resultTrainings: data.result.trainings,
          });
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        // this.setState({
        //   loadingAlsin: false,
        // });
      });
  }

  toggleShowPricing = (modalType, todo) => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
        keywordList: '',
        realCurrentPages: 1,
        maxPages: 1,
        currentPages: 1,
        ecommerceIDtemp: this.state.ecommerceID,
      });
    }

    this.setState(
      {
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        keywordList: '',
        realCurrentPages: 1,
        maxPages: 1,
        currentPages: 1,
        editPricingDetail: todo,
      },
      () => this.getTransactionFormPricingDetail(this.state.editPricingDetail),
    );
  };

  getTransactionFormPricingDetail(todo) {
    const url =
      myUrl.url_showFormPricingDetail + '?alsin_type_id=' + todo.alsin_type_id;
    var token = window.localStorage.getItem('tokenCookies');
    console.log('URL GET LIST PRICING DETAIL', url);

    // this.setState({ loadingAlsin: true });
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
            loadingAlsin: false,
          });
        }
      })
      .then(data => {
        var status = data.status;
        var result = data.result.alsins;
        var message = data.result.message;
        console.log('Data pricing detail', data);
        if (status === 0) {
          this.showNotification(message, 'error');
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState({
            resultPricingDetail: result,
            // loadingAlsin: false,
          });
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        // this.setState({
        //   loadingAlsin: false,
        // });
      });
  }

  firstPage() {
    this.setState(
      {
        lastID: 0,
      },
      () => this.getListbyPaging(),
    );
  }

  selectAllPelapak() {
    this.setState(
      {
        pelapakDetail: this.state.resultPelapakEcommerce,
        modal_nested_parent_list_editMasal: false,
      },
      // () => console.log('PELAPAK DETAIL LOAD', this.state.pelapakDetail),
      () => this.dynamicHeightPelapak(),
    );
  }

  actionPage(param) {
    // console.log('PARAM', param, 'TEST', param === nextPage);

    if (param === 'nextPageHeader') {
      // console.log(
      //   'NEXT PAGE',
      //   this.state.lastID === this.state.lastIDprev,
      //   this.state.lastID,
      //   this.state.lastIDprev,
      //   this.state.lastIDtemp,
      // );
      if (this.state.lastID !== this.state.lastIDtemp) {
        this.setState(
          {
            action: '',
            lastID: this.state.lastIDtemp,
          },
          () => this.getListbyPaging(),
        );
      } else {
        this.setState(
          {
            action: 'next',
            lastID: this.state.lastID,
          },
          () => this.getListbyPaging(),
        );
      }
    }
    if (param === 'prevPageHeader') {
      // console.log('PREV');
      if (this.state.lastID !== this.state.lastIDprev) {
        this.setState(
          {
            lastID: 0,
            action: '',
          },
          () => this.getListbyPaging(),
        );
      } else {
        this.setState(
          {
            action: 'prev',
            lastID: this.state.lastIDprev,
          },
          () => this.getListbyPaging(),
        );
      }
    }
    if (param === 'firstPageHeader') {
      // console.log('FIRST');
      this.setState(
        {
          lastID: 0,
          action: '',
        },
        () => this.getListbyPaging(),
      );
    }
  }

  updateInputValue(value, field, fill) {
    let input = this.state[fill];
    input[field] = value;
    this.setState(
      { input },
      // () =>
      // console.log('EDIT ALSIN PRICE', this.state.editPricing),
    );
  }

  setStatus = event => {
    console.log(
      'ATAS',
      this.state.editPricing && this.state.editPricing.status,
    );
    if (
      this.state.editPricing &&
      (this.state.editPricing.status === 'Menunggu Penentuan Pembayaran' ||
        this.state.editPricing.status === 'Transaksi ditolak Upja')
    ) {
      var nama = this.state.resultPricing1.find(function (element) {
        // console.log('ELEMENT TYPE', element);
        return element.status_id === event.target.value;
      });
    } else if (
      this.state.editPricing &&
      this.state.editPricing.status === 'Menunggu Konfirmasi Petani'
    ) {
      var nama = this.state.resultPricing2.find(function (element) {
        // console.log('ELEMENT TYPE', element);
        return element.status_id === event.target.value;
      });
    } else if (
      this.state.editPricing &&
      this.state.editPricing.status === 'Menungggu Konfirmasi Upja'
    ) {
      var nama = this.state.resultPricing3.find(function (element) {
        // console.log('ELEMENT TYPE', element);
        return element.status_id === event.target.value;
      });
    } else if (
      this.state.editPricing &&
      // (
      this.state.editPricing.status === 'Menunggu Alsin dikirim'
      // ||
      // this.state.editPricing.status === 'Sedang dikerjakan')
    ) {
      console.log('ATAS');
      var nama = this.state.resultPricing4.find(function (element) {
        // console.log('ELEMENT TYPE', element);
        return element.status_id === event.target.value;
      });
    } else if (
      this.state.editPricing &&
      this.state.editPricing.status === 'Sedang dikerjakan'
    ) {
      console.log('BAWAH');
      var nama = this.state.resultPricing5.find(function (element) {
        console.log('ELEMENT TYPE', element);
        return element.status_id === event.target.value;
      });
      // } else {
      //   var nama = this.state.resultType.find(function (element) {
      //     // console.log('ELEMENT TYPE', element);
      //     return element.status_id === event.target.value;
      //   });
    }

    // console.log('NAMA', nama);
    this.setState(
      {
        pilihStatusFarmer: event.target.value,
        namaStatusFarmer: nama.status_name,
        // disabledStatus: true,
      },
      // () => (this.state.editPricing.status = this.state.namaStatusFarmer),
      () => (this.state.editPricing.statusFarmer = this.state.namaStatusFarmer),
    );
  };

  render() {
    const { loading, loadingPage, loadingAlsin } = this.state;
    const currentTodos = this.state.result.data;
    const alsintItemTodos = this.state.resultAllAlsinType;
    const pelapakEcommerceTodos = this.state.resultPelapakEcommerce;
    const periodeTodos = this.state.resultPeriode;
    const isEnabled = this.canBeSubmitted();
    const isEnabledEdit = this.canBeSubmittedEdit();
    const isEnabledAddProduct = this.canBeSubmittedAddProduct();
    const isEnabledSaveAddProduct = this.canBeSubmittedSaveAddProduct();
    const isEnabledEditMassalEdit = this.canBeSubmittedEditMassalEdit();
    const isEnabledEditBatasPerPelapak = this.canBeSubmittedEditBatasPerPelapak();
    const isEnabledToSearch = this.canBeSearch();
    const isSearch = this.SearchAllList();

    const typeTodos = this.state.resultType;

    const statusTodos = this.state.resultType;
    const statusTodos1 = this.state.resultPricing1;
    const statusTodos2 = this.state.resultPricing2;
    const statusTodos3 = this.state.resultPricing3;
    const statusTodos4 = this.state.resultPricing4;
    const statusTodos5 = this.state.resultPricing5;

    const renderStatus =
      statusTodos &&
      statusTodos.map(todo => {
        return <option value={todo.status_id}>{todo.status_name}</option>;
      });

    // menunggu pembayaran
    const renderStatus1 =
      statusTodos1 &&
      statusTodos1.map(todo => {
        return <option value={todo.status_id}>{todo.status_name}</option>;
      });

    // menunggu konfirmasi petani
    const renderStatus2 =
      statusTodos2 &&
      statusTodos2.map(todo => {
        return <option value={todo.status_id}>{todo.status_name}</option>;
      });

    // menunggu konfirmasi upja
    const renderStatus3 =
      statusTodos3 &&
      statusTodos3.map(todo => {
        return <option value={todo.status_id}>{todo.status_name}</option>;
      });

    // menunggu alsin di kirim
    const renderStatus4 =
      statusTodos4 &&
      statusTodos4.map(todo => {
        return <option value={todo.status_id}>{todo.status_name}</option>;
      });

    // sedang dikerjakan
    const renderStatus5 =
      statusTodos5 &&
      statusTodos5.map(todo => {
        return <option value={todo.status_id}>{todo.status_name}</option>;
      });

    const renderType =
      typeTodos &&
      typeTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.status_name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="primary"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.status_id}
                onClick={this.setType}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

    var formatter = new Intl.NumberFormat('id-ID', {
      currency: 'IDR',
    });

    const listEcommerce = this.state.resultEcommerce;
    const alsinTodos = this.state.resultAlsin;
    const pricingTodos = this.state.resultPricing;
    const pricingHeadersTodos = this.state.resultPricingHeader;
    const HeaderTodos = this.state.resultHeader;
    const pricingServiceTodos = this.state.resultPricingService;
    const pricingDetailTodos = this.state.resultPricingDetail;

    // console.log('ALSIN', pricingServiceTodos);
    const renderAlsin =
      alsinTodos &&
      alsinTodos.map((todo, i) => {
        return (
          <tr key={i}>
            {/* {todo.transaction_order_id !== '' && (
              <td style={{ width: '10%', textAlign: 'left' }}>
                <Link to={`/transaksi/detail/${todo.transaction_order_id}`}>
                  {
                    <Label
                      style={{
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        color: '#009688',
                      }}
                    >
                      {todo.farmer_name}
                    </Label>
                  }
                </Link>
              </td>
            )} */}
            <td> {todo.farmer_name}</td>
            <td>{formatter.format(todo.transport_cost)}</td>
            <td>{formatter.format(todo.total_cost)}</td>
            <td>{todo.order_time}</td>
            <td>{todo.delivery_time}</td>
            <td>{todo.status}</td>
            {todo.status !== 'Transaksi ditolak Upja' &&
              todo.status !== 'Menunggu Konfirmasi Petani' && (
                <td>
                  <Button
                    style={{ margin: '0px' }}
                    color="secondary"
                    size="sm"
                    onClick={() =>
                      this.toggleEdit('nested_parent_editAlsin', {
                        ...todo,
                      })
                    }
                  >
                    <MdEdit />
                  </Button>
                </td>
              )}
          </tr>
        );
      });

    const renderPricing =
      pricingTodos &&
      pricingTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td>
              {todo.alsin_type_name}({todo.vechile_code})
            </td>
            <td>
              <Button
                color="secondary"
                size="sm"
                onClick={this.toggle('nested_parent_tambahProduk', todo)}
              >
                <MdAdd />
              </Button>
            </td>
          </tr>
        );
      });

    const renderPricingHeader =
      pricingHeadersTodos &&
      pricingHeadersTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.alsin_type_name}</td>
            <td>{todo.land_area_range} Hektar</td>
          </tr>
        );
      });

    const renderPricingService =
      pricingServiceTodos &&
      pricingServiceTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.alsin_type_name}</td>
            <td>{parseInt(todo.cost)}</td>
            {/* <td>
              <Button
                color="secondary"
                size="sm"
                onClick={this.toggle('nested_parent_tambahProduk', todo)}
              >
                <MdAdd />
              </Button>
            </td> */}
          </tr>
        );
      });

    const renderTodosReparation =
      this.state.resultReparation &&
      this.state.resultReparation.map((todo, i) => {
        return (
          <tr key={i}>
            {/* {console.log('TOTAL REPARATION', todo)} */}
            <td>{todo.alsin_type_order_name}</td>
            <td style={{ textAlign: 'right' }}>
              {formatter.format(todo.cost)}
            </td>
          </tr>
        );
      });

    const renderTodosRiceSeed =
      this.state.resultRiceSeeds &&
      this.state.resultRiceSeeds.map((todo, i) => {
        return (
          <tr key={i}>
            {/* {console.log('TOTAL REPARATION', todo)} */}
            <td>{todo.name}</td>
            <td style={{ textAlign: 'right' }}>{todo.weight} Kg</td>
            <td style={{ textAlign: 'right' }}>
              {formatter.format(todo.cost)}
            </td>
          </tr>
        );
      });

    const renderTodosRices =
      this.state.resultRices &&
      this.state.resultRices.map((todo, i) => {
        return (
          <tr key={i}>
            {/* {console.log('TOTAL REPARATION', todo)} */}
            <td>{todo.total_rice}</td>
            <td style={{ textAlign: 'right' }}>
              {todo.land_area_range} Hektar
            </td>
            <td style={{ textAlign: 'right' }}>
              {formatter.format(todo.cost)}
            </td>
          </tr>
        );
      });

    const renderTodosRMU =
      this.state.resultRMUS &&
      this.state.resultRMUS.map((todo, i) => {
        return (
          <tr key={i}>
            {/* {console.log('TOTAL REPARATION', todo)} */}
            <td>{todo.packaging} Kg</td>
            <td style={{ textAlign: 'right' }}>{todo.weight} Kg</td>
            <td style={{ textAlign: 'right' }}>
              {formatter.format(todo.cost)}
            </td>
          </tr>
        );
      });

    const renderTodosSparePart =
      this.state.resultSparePart &&
      this.state.resultSparePart.map((todo, i) => {
        return (
          <tr key={i}>
            {/* {console.log('TOTAL REPARATION', todo)} */}
            <td>{todo.name}</td>
            {/* <td>{todo.weight}</td> */}
            <td style={{ textAlign: 'right' }}>
              {formatter.format(todo.cost)}
            </td>
          </tr>
        );
      });

    const renderTodosTraining =
      this.state.resultTrainings &&
      this.state.resultTrainings.map((todo, i) => {
        return (
          <tr key={i}>
            {/* {console.log('TOTAL REPARATION', todo)} */}
            <td>{todo.name}</td>
            <td style={{ textAlign: 'right' }}>{todo.total_member}</td>
            <td style={{ textAlign: 'right' }}>
              {formatter.format(todo.cost)}
            </td>
          </tr>
        );
      });

    const renderPricingDetail =
      pricingDetailTodos &&
      pricingDetailTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td
              style={{
                fontWeight: 'bold',
                cursor: 'pointer',
                textDecoration: 'underline',
                color: '#009688',
              }}
              onClick={() =>
                this.toggleShowPricing('nested_parent', { ...todo })
              }
            >
              {todo.vechile_code}
            </td>
          </tr>
        );
      });

    const renderEcommerce =
      listEcommerce &&
      listEcommerce.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.ecommerce_name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="info"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.ecommerce_id}
                onClick={this.setEcommerce}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

    const renderEcommerceEditMasal =
      listEcommerce &&
      listEcommerce.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.ecommerce_name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="info"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.ecommerce_id}
                onClick={this.setEcommerceEditMassal}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

    const renderPeriode =
      periodeTodos &&
      periodeTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.periode_name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="info"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.periode_id}
                onClick={this.setPeriode}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

    const renderAlsinItem =
      alsintItemTodos &&
      alsintItemTodos.map((todo, i) => {
        return <option value={todo.id}>{todo.name}</option>;
      });

    const renderPelapakEditMasal =
      pelapakEcommerceTodos &&
      pelapakEcommerceTodos.map((todo, i) => {
        return (
          <tr key={i}>
            {/* {console.log('TODOS PELAPAK ECOMMERCE', todo)} */}
            <td>{todo.outletid}</td>
            <td>{todo.outletname}</td>
            <td>{todo.ecommercename}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="info"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.pelapakid}
                onClick={this.setPelapakEditMasal}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

    const renderTodos =
      currentTodos &&
      currentTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.procod}</td>
            <td>{todo.productname}</td>
            <td>{new Date(todo.startdate).toDateString()}</td>
            {todo.enddate === null && (
              <td>
                <Label>-</Label>
              </td>
            )}
            {todo.enddate !== null && (
              <td>{new Date(todo.enddate).toDateString()}</td>
            )}
            <td style={{ textAlign: 'right' }}>
              {formatter.format(todo.limitpriceecommerce)}
            </td>
            <td>{todo.sellpackname}</td>
            {todo.activeyn === 'Y' && (
              <td>
                <Badge color="success">Aktif</Badge>
              </td>
            )}
            {todo.activeyn === 'N' && (
              <td>
                <Badge color="danger">Tidak Aktif</Badge>
              </td>
            )}
            <td>{new Date(todo.lastupdated).toDateString()}</td>
            <td style={{ textAlign: 'left' }}>{todo.updatedby}</td>
            {this.state.menuID === 61 && (
              <td>
                <Button
                  id="61"
                  style={{ margin: '0px' }}
                  color="secondary"
                  size="sm"
                  onClick={() =>
                    this.toggleEditData('nested_parent_edit', { ...todo })
                  }
                >
                  <MdEdit />
                </Button>
              </td>
            )}
            {this.state.menuID === 61 && (
              <td>
                <Button
                  id="61"
                  style={{ margin: '0px' }}
                  color="danger"
                  size="sm"
                  onClick={() =>
                    this.toggleDeleteData('nested_parent_nonaktifHeaderData', {
                      ...todo,
                    })
                  }
                >
                  <MdDelete />
                </Button>
              </td>
            )}
          </tr>
        );
      });

    const renderBatasPerPelapak =
      this.state.resultBatasPerPelapak &&
      this.state.resultBatasPerPelapak.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.outletid}</td>
            <td>{todo.outletname}</td>
            <td>{todo.ecommercename}</td>
            <td style={{ textAlign: 'right' }}>{todo.dividerlnbupripi}</td>
            <td style={{ textAlign: 'right' }}>{todo.dividerlnbuprinonpi}</td>
            {todo.activeyn === 'Y' && (
              <td>
                <Badge color="success">Aktif</Badge>
              </td>
            )}
            {todo.activeyn === 'N' && (
              <td>
                <Badge color="danger">Tidak Aktif</Badge>
              </td>
            )}
            <td>
              <Button
                color="secondary"
                size="sm"
                onClick={() =>
                  this.toggleEditData('nested_parent_editBatasPerPelapak', {
                    ...todo,
                  })
                }
              >
                <MdEdit />
              </Button>
            </td>
            <td>
              <Button
                color="danger"
                size="sm"
                onClick={() =>
                  this.toggleDeleteData('nested_parent_deleteBatasPerPelapak', {
                    ...todo,
                  })
                }
              >
                <MdDelete />
              </Button>
            </td>
          </tr>
        );
      });

    const renderListEditMassal =
      this.state.listEditMasal &&
      this.state.listEditMasal.map((todo, i) => {
        return (
          <tr key={i}>
            <td style={{ textAlign: 'left' }}>
              {todo.alsin_type_name}({todo.vechile_code})
            </td>
            <td style={{ textAlign: 'right' }}>
              {formatter.format(todo.cost)}
            </td>
            {/* <td style={{ textAlign: 'right' }}>
              {formatter.format(todo.total_item)}
            </td> */}
            {/* <td>
              <Button
                color="secondary"
                size="sm"
                onClick={() =>
                  this.toggleEditData('nested_parent_editMassal_edit', {
                    ...todo,
                  })
                }
              >
                <MdEdit />
              </Button>
            </td> */}
            <td>
              <Button
                color="danger"
                size="sm"
                value={todo.nama}
                onClick={() => this.deleteListEditMassal({ ...todo })}
              >
                <MdDelete />
              </Button>
            </td>
          </tr>
        );
      });

    return (
      <Page
        title="Transaksi"
        breadcrumbs={[{ name: 'Transaksi', active: true }]}
        className="Transaksi"
      >
        <Row>
          <Col>
            <Card className="mb-3">
              <NotificationSystem
                dismissible={false}
                ref={notificationSystem =>
                  (this.notificationSystem = notificationSystem)
                }
                style={NOTIFICATION_SYSTEM_STYLE}
              />

              {/* <CardHeader className="d-flex justify-content-between">
                <Col sm={5} style={{ paddingLeft: 0 }}>
                  <Form
                    inline
                    className="cr-search-form"
                    onSubmit={e => e.preventDefault()}
                  >
                    <MdSearch
                      size="20"
                      className="cr-search-form__icon-search text-secondary"
                    />
                    <Input
                      autoComplete="off"
                      type="search"
                      className="cr-search-form__input"
                      placeholder="Cari Procod..."
                      id="search"
                      onChange={evt => this.updateSearchValue(evt)}
                      onKeyPress={event => this.enterPressedSearch(event, true)}
                    />
                  </Form>
                </Col>
                <Col sm={7} style={{ textAlign: 'right', paddingRight: 0 }}></Col>
              </CardHeader> */}

              <CardHeader
                className="d-flex justify-content-between"
                // style={{ paddingBottom: 0 }}
              >
                <Col
                  style={{
                    paddingRight: 0,
                    paddingBottom: 0,
                    marginBottom: 0,
                    paddingLeft: 0,
                  }}
                >
                  <InputGroup style={{ float: 'right' }}>
                    <Input
                      disabled
                      placeholder="Pilih Status"
                      style={{ fontWeight: 'bold' }}
                      value={this.state.namaStatus}
                    />
                    {/* {console.log('ISINYA:', this.state.namaProvinsi)} */}
                    <InputGroupAddon addonType="append">
                      <Button onClick={() => this.setModalProvinsi()}>
                        <MdList />
                      </Button>
                      <Button
                        color="primary"
                        style={{ float: 'right' }}
                        onClick={() => this.findData()}
                        disabled={!isSearch}
                        id="buttonSearch"
                      >
                        <MdSearch />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col style={{ textAlign: 'left' }}>
                    <Label style={{ marginBottom: 0, fontWeight: 'bold' }}>
                      Status:&nbsp;
                    </Label>
                    {this.state.namaStatusSave === undefined ? (
                      <Label style={{ marginBottom: 0, fontWeight: 'bold' }}>
                        Semuanya
                      </Label>
                    ) : (
                      <Label style={{ marginBottom: 0, fontWeight: 'bold' }}>
                        {this.state.namaStatusSave}
                      </Label>
                    )}
                  </Col>
                </Row>
                <Table responsive striped id="tableUtama">
                  <thead>
                    <tr>
                      <th>Farmer</th>
                      <th>Harga Transport</th>
                      <th>Total Harga</th>
                      <th>Waktu Order</th>
                      <th>Waktu Kirim</th>
                      <th>Status</th>
                      <th>Edit</th>
                      {/* <th>Hapus</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {!alsinTodos && loadingAlsin === true ? (
                      <LoadingSpinner status={4} />
                    ) : loadingAlsin === false &&
                      (!alsinTodos || alsinTodos.length === 0) ? (
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
                    ) : loadingAlsin === true && alsinTodos ? (
                      <LoadingSpinner status={4} />
                    ) : (
                      renderAlsin
                    )}
                  </tbody>
                </Table>
              </CardBody>
              {/* <CardBody>
                <Row>
                  <Col>
                    <Button
                      name="firstPageHeader"
                      value={1}
                      onClick={() => this.actionPage('firstPageHeader')}
                      disabled={
                        this.state.result.length === 0 ||
                        this.state.result === null
                      }
                    >
                      First &#10092;&#10092;
                    </Button>
                    <ButtonGroup style={{ float: 'right' }}>
                      <Button
                        name="prevPageHeader"
                        style={{ float: 'right' }}
                        onClick={() => this.actionPage('prevPageHeader')}
                        disabled={
                          this.state.result.length === 0 ||
                          this.state.result === null
                        }
                      >
                        Prev &#10092;
                      </Button>
                      <Button
                        name="nextPageHeader"
                        // value={this.state.currentPage}
                        style={{ float: 'right' }}
                        onClick={() => this.actionPage('nextPageHeader')}
                        disabled={
                          this.state.result.length === 0 ||
                          this.state.result === null
                        }
                      >
                        Next &#10093;
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </CardBody> */}
            </Card>
          </Col>
        </Row>

        {/* KHUSUS MODAL */}

        {/* Modal List Status */}
        <Modal
          onExit={this.handleCloseDomisili}
          isOpen={this.state.modal_nested_parent_list_provinsi}
          toggle={this.toggle('nested_parent_list_provinsi')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_list_provinsi')}>
            List Status
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <tbody>
                {typeTodos.length === 0 && loadingPage === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingPage === false && typeTodos.length === 0 ? (
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
                ) : loadingPage === true && typeTodos.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderType
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal List Status */}

        {/* Modal Delete Alsin*/}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_nonaktifAlsin}
          toggle={() => this.toggleDeleteData('nested_parent_nonaktifAlsin')}
          className={this.props.className}
        >
          <ModalHeader>Konfirmasi Penghapusan Data Alsin</ModalHeader>
          <ModalBody>Apakah Anda yakin ingin menghapus data ini?</ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.deleteHeaderData(this.state.deleteAlsin)}
              disabled={loading}
            >
              {!loading && 'Ya'}
              {loading && <MdAutorenew />}
              {loading && 'Sedang diproses'}
            </Button>{' '}
            {!loading && (
              <Button
                color="secondary"
                onClick={this.toggle('nested_parent_nonaktifAlsin')}
              >
                Tidak
              </Button>
            )}
          </ModalFooter>
        </Modal>
        {/* Modal Delete Alsin*/}

        {/* Modal Edit Alsin */}
        <Modal
          size="xl"
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_editAlsin}
          toggle={this.toggle('nested_parent_editAlsin')}
          className={this.props.className}
        >
          <ModalHeader>Edit Transaksi</ModalHeader>
          <ModalBody>
            {/* {console.log('NAMA ALSIN', this.state.editPricing)}
            <Form>
              <FormGroup>
                <Label>Alsin</Label>
                <Input
                  autoComplete="off"
                  type="text"
                  name="alsin_type_name"
                  placeholder="Harga..."
                  onChange={evt =>
                    this.updateInputValue(
                      evt.target.value,
                      evt.target.name,
                      'editPricing',
                    )
                  }
                  value={
                    this.state.result && this.state.editPricing.alsin_type_name
                  }
                />
              </FormGroup>
            </Form> */}

            <thead>
              <tr>
                <th
                // untuk gmaps
                >
                  Pesanan yang dipesan Farmer (
                  {HeaderTodos && HeaderTodos.farmer_name} -{' '}
                  {HeaderTodos && HeaderTodos.phone_number})
                </th>
                {/* <td>Edit</td> */}
              </tr>
            </thead>
            {/* {console.log('PRICING HEADER', pricingHeadersTodos)} */}
            <Label
              style={{
                marginBottom: 0,
                fontWeight: 'bold',
                cursor: 'pointer',
                textDecoration: 'underline',
                color: '#009688',
              }}
              onClick={() => {
                window.open(
                  'https://www.google.com/maps/search/?q=' +
                    (HeaderTodos && HeaderTodos.latitude) +
                    ',' +
                    (HeaderTodos && HeaderTodos.longtitude),
                );
              }}
            >
              {console.log(
                'LINK GMAPS',
                'https://www.google.com/maps/search/?q=' +
                  (HeaderTodos && HeaderTodos.latitude) +
                  ',' +
                  (HeaderTodos && HeaderTodos.longtitude),
              )}
              <MdLocationOn />
              Klik untuk Mengetahui Lokasi
            </Label>
            {this.state.editPricing &&
              this.state.editPricing.status ===
                'Menunggu Penentuan Pembayaran' && (
                <div>
                  <Label style={{ marginBottom: 0, marginTop: '1%' }}>
                    Harga Transportasi
                  </Label>
                  <Input
                    name="transport_cost"
                    type="number"
                    placeholder="Isi biaya transportasi..."
                    onChange={evt =>
                      this.updateInputValue(
                        evt.target.value,
                        evt.target.name,
                        'editPricing',
                      )
                    }
                    value={
                      this.state.editPricing &&
                      this.state.editPricing.transport_cost
                    }
                  ></Input>
                  {/* {console.log("EDIT PRICING", this.state.editPricing)} */}
                </div>
              )}
            <hr style={{ borderWidth: 'medium' }}></hr>
            <thead>
              <tr>
                <th>Alsin yang dipesan Petani</th>
                {/* <td>Edit</td> */}
              </tr>
            </thead>
            <Table responsive striped id="tableBatasPerPelapak">
              <tbody>{renderPricingHeader}</tbody>
              {pricingHeadersTodos && pricingHeadersTodos.length === 0 && (
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
            </Table>
            <hr style={{ borderWidth: 'medium' }}></hr>
            <thead>
              <tr>
                <th>Alsin tersedia yang dapat dipesan</th>
                {/* <td>Edit</td> */}
              </tr>
            </thead>
            <Label
              style={{ marginBottom: '0', fontSize: '0.7em', color: 'red' }}
            >
              *klik untuk menginput data dari Alsin yang telah dipesan
            </Label>
            <CardBody>
              <Table responsive striped id="tableBatasPerPelapak">
                <tbody>{renderPricing}</tbody>
              </Table>
              <Table responsive striped id="tableBatasPerPelapak">
                <thead>
                  <tr>
                    <th>Alsin</th>
                    <th style={{ textAlign: 'right' }}>Harga</th>
                    {/* <th>Total Item</th> */}
                    {/* <th>Edit</th> */}
                    <th>Hapus</th>
                  </tr>
                </thead>

                <tbody>{renderListEditMassal}</tbody>
                {this.state.listEditMasal.length === 0 && (
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
              </Table>
            </CardBody>
            <hr style={{ borderWidth: 'medium' }}></hr>
            <thead>
              <tr>
                <th>Service yang telah di pesan oleh Farmer</th>
                {/* <td>Edit</td> */}
              </tr>
            </thead>
            {/* <Label style={{ marginBottom: '0', fontSize: '0.7em', color:'red' }}>
              *klik untuk menginput data dari Alsin yang telah dipesan
            </Label> */}
            {/* Untuk Other Service Reparasi */}
            <hr style={{ borderWidth: 'medium' }}></hr>
            <Label style={{ fontWeight: 'bold' }}>Table Reparasi</Label>
            <Table responsive striped id="tableUtama">
              <thead>
                <tr>
                  <th style={{ width: '50%' }}>Alsin</th>
                  <th style={{ textAlign: 'right', width: '50%' }}>Harga</th>
                  {/* <th>Edit</th>
                      <th>Hapus</th> */}
                </tr>
              </thead>
              <tbody>
                {!this.state.resultReparation && loadingAlsin === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingAlsin === false &&
                  this.state.resultReparation.length === 0 ? (
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
                ) : loadingAlsin === true && this.state.resultReparation ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderTodosReparation
                )}
              </tbody>
            </Table>
            {/* Untuk Other Service Benih Padi */}
            <hr style={{ borderWidth: 'medium' }}></hr>
            <Label style={{ fontWeight: 'bold' }}>Table Benih Padi</Label>
            <Table responsive striped id="tableUtama">
              <thead>
                <tr>
                  <th style={{ width: '33.3%' }}>Nama</th>
                  <th style={{ textAlign: 'right', width: '33.3%' }}>Berat</th>
                  <th style={{ textAlign: 'right', width: '33.3%' }}>Harga</th>
                  {/* <th>Edit</th>
                      <th>Hapus</th> */}
                </tr>
              </thead>
              <tbody>
                {!this.state.resultRiceSeeds && loadingAlsin === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingAlsin === false &&
                  this.state.resultRiceSeeds.length === 0 ? (
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
                ) : loadingAlsin === true && this.state.resultRiceSeeds ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderTodosRiceSeed
                )}
              </tbody>
            </Table>
            {/* Untuk Other Service Bibit */}
            <hr style={{ borderWidth: 'medium' }}></hr>
            <Label style={{ fontWeight: 'bold' }}>Table Bibit Padi</Label>
            <Table responsive striped id="tableUtama">
              <thead>
                <tr>
                  <th style={{ width: '33.3%' }}>Total bibit</th>
                  <th style={{ textAlign: 'right', width: '33.3%' }}>
                    Luas Lahan
                  </th>
                  <th style={{ textAlign: 'right', width: '33.3%' }}>Harga</th>
                  {/* <th>Edit</th>
                      <th>Hapus</th> */}
                </tr>
              </thead>
              <tbody>
                {!this.state.resultRices && loadingAlsin === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingAlsin === false &&
                  this.state.resultRices.length === 0 ? (
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
                ) : loadingAlsin === true && this.state.resultRices ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderTodosRices
                )}
              </tbody>
            </Table>
            {/* Untuk Other Service RMUS */}
            <hr style={{ borderWidth: 'medium' }}></hr>
            <Label style={{ fontWeight: 'bold' }}>Table RMUS</Label>
            <Table responsive striped id="tableUtama">
              <thead>
                <tr>
                  <th style={{ width: '33.3%' }}>Packaging</th>
                  <th style={{ textAlign: 'right', width: '33.3%' }}>Berat</th>
                  <th style={{ textAlign: 'right', width: '33.3%' }}>Harga</th>
                  {/* <th>Edit</th>
                      <th>Hapus</th> */}
                </tr>
              </thead>
              <tbody>
                {!this.state.resultRMUS && loadingAlsin === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingAlsin === false &&
                  this.state.resultRMUS.length === 0 ? (
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
                ) : loadingAlsin === true && this.state.resultRMUS ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderTodosRMU
                )}
              </tbody>
            </Table>
            {/* Untuk Other Service Spare Part */}
            <hr style={{ borderWidth: 'medium' }}></hr>
            <Label style={{ fontWeight: 'bold' }}>Table Suku Cadang</Label>
            <Table responsive striped id="tableUtama">
              <thead>
                <tr>
                  <th style={{ width: '50%' }}>Nama</th>
                  <th style={{ textAlign: 'right', width: '50%' }}>Harga</th>
                  {/* <th>Edit</th>
                      <th>Hapus</th> */}
                </tr>
              </thead>
              <tbody>
                {!this.state.resultSparePart && loadingAlsin === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingAlsin === false &&
                  this.state.resultSparePart.length === 0 ? (
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
                ) : loadingAlsin === true && this.state.resultSparePart ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderTodosSparePart
                )}
              </tbody>
            </Table>
            {/* Untuk Other Service Training */}
            <hr style={{ borderWidth: 'medium' }}></hr>
            <Label style={{ fontWeight: 'bold' }}>Table Pelatihan</Label>
            <Table responsive striped id="tableUtama">
              <thead>
                <tr>
                  <th style={{ width: '33.3%' }}>Nama</th>
                  <th style={{ textAlign: 'right', width: '33.3%' }}>
                    Jumlah Anggota
                  </th>
                  <th style={{ textAlign: 'right', width: '33.3%' }}>Harga</th>
                  {/* <th>Edit</th>
                      <th>Hapus</th> */}
                </tr>
              </thead>
              <tbody>
                {!this.state.resultTrainings && loadingAlsin === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingAlsin === false &&
                  this.state.resultTrainings.length === 0 ? (
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
                ) : loadingAlsin === true && this.state.resultTrainings ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderTodosTraining
                )}
              </tbody>
            </Table>
            {/* <tbody>{renderListEditMassal}</tbody> */}
            <hr style={{ borderWidth: 'medium' }}></hr>
            {/* {console.log('EDIT TRANSAKSI', this.state.editPricing)} */}
            <Label>Status</Label>
            <Input
              disabled={this.state.disabledStatus}
              type="select"
              autoComplete="off"
              name="select"
              color="primary"
              style={{ marginRight: '1px' }}
              onChange={this.setStatus}
            >
              <option
                value={this.state.editPricing && this.state.editPricing.status}
                disabled
                selected
                hidden
                id="pilih"
              >
                {this.state.editPricing && this.state.editPricing.status}
              </option>
              {this.state.editPricing &&
                (this.state.editPricing.status ===
                  'Menunggu Penentuan Pembayaran' ||
                  this.state.editPricing.status === 'Transaksi ditolak Upja') &&
                renderStatus1}
              {this.state.editPricing &&
                this.state.editPricing.status ===
                  'Menunggu Konfirmasi Petani' &&
                renderStatus2}
              {this.state.editPricing &&
                this.state.editPricing.status === 'Menungggu Konfirmasi Upja' &&
                renderStatus3}
              {this.state.editPricing &&
                this.state.editPricing.status === 'Menunggu Alsin dikirim' &&
                renderStatus4}
              {this.state.editPricing &&
                this.state.editPricing.status === 'Sedang dikerjakan' &&
                renderStatus5}
              {this.state.editPricing &&
                this.state.editPricing.status === 'Selesai' &&
                'Selesai'}
            </Input>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              // disabled={!isEnabledEdit}
              onClick={this.toggle('nested_editAlsin')}
            >
              Simpan Edit Alsin
            </Button>
            <Modal
              // onExit={this.handleClose}
              isOpen={this.state.modal_nested_editAlsin}
              toggle={this.toggle('nested_editAlsin')}
            >
              <ModalHeader>Konfirmasi Penyimpanan Edit alsin</ModalHeader>
              <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
              <ModalFooter>
                <Button
                  id="btnEdit"
                  color="primary"
                  onClick={() => this.updateHeaderData(this.state.editPricing)}
                  disabled={loading}
                >
                  {!loading && 'Ya'}
                  {loading && <MdAutorenew />}
                  {loading && 'Sedang diproses'}
                </Button>
                {!loading && (
                  <Button
                    color="secondary"
                    onClick={this.toggle('nested_editAlsin')}
                  >
                    Tidak
                  </Button>
                )}
              </ModalFooter>
            </Modal>
            <Button
              color="secondary"
              onClick={this.toggle('nested_parent_editAlsin')}
            >
              Batal
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal Edit Alsin */}

        {/* Modal Aktif YN Detail (dalam edit header)*/}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_nonaktif}
          toggle={this.toggle('nested_parent_nonaktif')}
          className={this.props.className}
        >
          <ModalHeader>Konfirmasi Penghapusan</ModalHeader>
          <ModalBody>Apakah Anda yakin ingin menghapus data ini?</ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() =>
                this.updateBatasStandarDefault(
                  this.state.currentDimenBatasStandar,
                )
              }
              disabled={loading}
            >
              {!loading && 'Ya'}
              {loading && <MdAutorenew />}
              {loading && 'Sedang diproses'}
            </Button>{' '}
            {!loading && (
              <Button
                color="secondary"
                onClick={this.toggle('nested_parent_nonaktif')}
              >
                Tidak
              </Button>
            )}
          </ModalFooter>
        </Modal>
        {/* Modal Aktif YN Detail (dalam edit header)*/}

        {/* Modal Batas Standar */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent}
          toggle={this.toggle('nested_parent')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent')}>
            Edit Transaksi Detail
          </ModalHeader>
          <ModalBody>
            <thead>
              <tr>
                <th>Kode Kendaraan</th>
                {/* <td>Edit</td> */}
              </tr>
            </thead>
            <tbody>{renderPricingDetail}</tbody>
            {/* <Form onSubmit={e => e.preventDefault()}>
              <FormGroup>
                <Label>Produk Pharos</Label>
                <Input
                  type="number"
                  name="dividerlnbupripi"
                  min={0}
                  autoComplete="off"
                  onKeyPress={e => this.numValidate(e)}
                  onChange={evt =>
                    this.updateInputValue(
                      evt.target.value,
                      evt.target.name,
                      'currentDimenBatasStandar',
                    )
                  }
                  value={
                    this.state.currentDimenBatasStandar &&
                    this.state.currentDimenBatasStandar.dividerlnbupripi
                  }
                  placeholder="Tidak boleh minus dan tidak boleh kosong"
                />
                <Label>Produk Non-Pharos</Label>
                <Input
                  placeholder="Tidak boleh minus dan tidak boleh kosong"
                  type="number"
                  name="dividerlnbuprinonpi"
                  autoComplete="off"
                  min={0}
                  onKeyPress={e => this.numValidate(e)}
                  onChange={evt =>
                    this.updateInputValue(
                      evt.target.value,
                      evt.target.name,
                      'currentDimenBatasStandar',
                    )
                  }
                  value={
                    this.state.currentDimenBatasStandar &&
                    this.state.currentDimenBatasStandar.dividerlnbuprinonpi
                  }
                />
              </FormGroup>
            </Form> */}
            <br></br>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={!isEnabled}
              color="primary"
              onClick={this.toggle('nested')}
            >
              Simpan Batas Default
            </Button>
            <Modal
              onExit={this.handleClose}
              isOpen={this.state.modal_nested}
              toggle={this.toggle('nested')}
            >
              <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
              <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() =>
                    this.updateBatasStandarDefault(
                      this.state.currentDimenBatasStandar,
                    )
                  }
                  disabled={loading}
                >
                  {!loading && 'Ya'}
                  {loading && <MdAutorenew />}
                  {loading && 'Sedang diproses'}
                </Button>{' '}
                {!loading && (
                  <Button color="secondary" onClick={this.toggle('nested')}>
                    Tidak
                  </Button>
                )}
              </ModalFooter>
            </Modal>{' '}
            <Button color="secondary" onClick={this.toggle('nested_parent')}>
              Batal
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal Batas Standar */}

        {/* Modal Batas per Pelapak */}
        <Modal
          size="xl"
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_batasPerPelapak}
          toggle={this.toggle('nested_parent_batasPerPelapak')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_batasPerPelapak')}>
            Batas per Pelapak
          </ModalHeader>
          <ModalBody style={{ paddingTop: 0 }}>
            {/* <CardHeader
              className="d-flex justify-content-between"
              style={{ paddingLeft: 0, paddingRight: 0 }}
            >
              <Col sm={6} style={{ paddingLeft: 0 }}>
                <Form
                  inline
                  className="cr-search-form"
                  onSubmit={e => e.preventDefault()}
                >
                  <MdSearch
                    size="20"
                    className="cr-search-form__icon-search text-secondary"
                  />
                  <Input
                    autoComplete="off"
                    type="search"
                    className="cr-search-form__input"
                    placeholder="Search ..."
                    id="search"
                    onChange={evt => this.updateSearchValueList(evt)}
                    onKeyPress={event =>
                      this.enterPressedSearchList(event, true)
                    }
                  />
                </Form>
              </Col>
              <Col sm={6} style={{ paddingRight: 0 }}>
                <Form inline style={{ float: 'right' }}>
                  <Label
                    id="ecommerceBatasPerPelapak"
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    E-commerce:&nbsp;
                  </Label>
                  <Input
                    type="select"
                    // disabled={this.state.ecommerceDisabled}
                    placeholder="Pilih E-Commerce"
                    style={{ fontWeight: 'bold' }}
                    value={this.state.namaEcommerce}
                    onChange={event => this.setEcommerceBatasPerPelapak(event)}
                  >
                    <option selected hidden id="pilih">
                      Pilih E-Commerce
                    </option>
                    {renderEcommerce}
                  </Input>
                </Form>
              </Col>
            </CardHeader> */}
            <CardBody style={{ paddingTop: 0 }}>
              <Table responsive striped id="tableBatasPerPelapak">
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>pelapak</th>
                    <th>Ecommerce</th>
                    <th>Pembagi Pharos</th>
                    <th>Pembagi Non-Pharos</th>
                    <th>Status</th>
                    <th>Edit</th>
                    <th>Hapus</th>
                  </tr>
                </thead>
                <tbody>
                  {renderBatasPerPelapak}
                  {this.state.resultBatasPerPelapak.length === 0 && (
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
            </CardBody>
            <CardBody>
              <Row>
                <Col md="9" sm="12" xs="12">
                  {/* <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      Tampilkan
                    </InputGroupAddon>
                    <select
                      name="todosPerPage"
                      style={{ height: '38px' }}
                      value={this.state.value}
                      onChange={e => this.handleSelect(e)}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                    </select>
                    <InputGroupAddon addonType="append">
                      Baris Per-Halaman
                    </InputGroupAddon>
                  </InputGroup> */}
                </Col>
                <Col md="3" sm="12" xs="12">
                  <Card className="mb-3s">
                    <ButtonGroup>
                      <Button
                        name="FirstButton"
                        value={1}
                        onClick={e =>
                          this.paginationButton(e, 0, this.state.maxPage)
                        }
                      >
                        &#10092;&#10092;
                      </Button>
                      <Button
                        name="PrevButton"
                        value={this.state.currentPage}
                        onClick={e =>
                          this.paginationButton(e, -1, this.state.maxPage)
                        }
                      >
                        &#10092;
                      </Button>
                      <input
                        type="text"
                        placeholder="Page"
                        outline="none"
                        value={this.state.currentPage}
                        onChange={e =>
                          this.setState({ currentPage: e.target.value })
                        }
                        onKeyPress={e => this.enterPressedPage(e)}
                        style={{
                          height: '38px',
                          width: '75px',
                          textAlign: 'center',
                        }}
                      />
                      <Button
                        name="NextButton"
                        value={this.state.currentPage}
                        onClick={e =>
                          this.paginationButton(e, 1, this.state.maxPage)
                        }
                      >
                        &#10093;
                      </Button>
                    </ButtonGroup>
                  </Card>
                </Col>
              </Row>
            </CardBody>
          </ModalBody>
        </Modal>
        {/* Modal Batas per Pelapak */}

        {/* Modal Delete Batas per Pelapak*/}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_deleteBatasPerPelapak}
          toggle={() =>
            this.toggleDeleteData('nested_parent_deleteBatasPerPelapak')
          }
          className={this.props.className}
        >
          <ModalHeader>Konfirmasi Penghapusan Batas Per Pelapak</ModalHeader>
          <ModalBody>Apakah Anda yakin ingin menghapus data ini?</ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() =>
                this.deleteBatasPerPelapak(this.state.deleteBatasPerPelapak)
              }
              disabled={loading}
            >
              {!loading && 'Ya'}
              {loading && <MdAutorenew />}
              {loading && 'Sedang diproses'}
            </Button>{' '}
            {!loading && (
              <Button
                color="secondary"
                onClick={() =>
                  this.toggleDeleteData('nested_parent_deleteBatasPerPelapak')
                }
              >
                Tidak
              </Button>
            )}
          </ModalFooter>
        </Modal>
        {/* Modal Delete Batas per Pelapak */}

        {/* Modal Edit batas per pelapak */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_editBatasPerPelapak}
          toggle={this.toggle('nested_parent_editBatasPerPelapak')}
          className={this.props.className}
        >
          <ModalHeader
            toggle={this.toggle('nested_parent_editBatasPerPelapak')}
          >
            Edit Batas per Pelapak
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={e => e.preventDefault()}>
              {/* {console.log('VALUE', this.state.editBatasPerPelapak)} */}
              <FormGroup>
                <Row>
                  <Col>
                    <Label>Kode</Label>
                    <Input
                      type="text"
                      disabled
                      value={
                        this.state.editBatasPerPelapak &&
                        this.state.editBatasPerPelapak.outletid
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Label>Pelapak</Label>
                    <Input
                      type="text"
                      disabled
                      value={
                        this.state.editBatasPerPelapak &&
                        this.state.editBatasPerPelapak.outletname
                      }
                    />
                  </Col>
                  <Col>
                    <Label>Ecommerce</Label>
                    <Input
                      type="text"
                      disabled
                      value={
                        this.state.editBatasPerPelapak &&
                        this.state.editBatasPerPelapak.ecommercename
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Label>Pembagi Pharos</Label>
                    <Input
                      type="number"
                      name="dividerlnbupripi"
                      style={{ textAlign: 'right' }}
                      autoComplete="off"
                      placeholder="Qty Batas Bawah"
                      min={0}
                      onKeyPress={e => this.numValidate(e)}
                      onChange={evt =>
                        this.updateInputValue(
                          evt.target.value,
                          evt.target.name,
                          'editBatasPerPelapak',
                        )
                      }
                      value={
                        this.state.editBatasPerPelapak &&
                        this.state.editBatasPerPelapak.dividerlnbupripi
                      }
                    />
                  </Col>
                  <Col>
                    <Label>Pembagi Non-Pharos</Label>
                    <Input
                      type="number"
                      name="dividerlnbuprinonpi"
                      autoComplete="off"
                      placeholder="Qty Batas Bawah"
                      style={{ textAlign: 'right' }}
                      min={0}
                      onKeyPress={e => this.numValidate(e)}
                      onChange={evt =>
                        this.updateInputValue(
                          evt.target.value,
                          evt.target.name,
                          'editBatasPerPelapak',
                        )
                      }
                      value={
                        this.state.editBatasPerPelapak &&
                        this.state.editBatasPerPelapak.dividerlnbuprinonpi
                      }
                    />
                  </Col>
                </Row>
              </FormGroup>
            </Form>
            <br></br>
            {/* <Label style={{ fontSize: "12px" }}>CTRL+S untuk simpan</Label> */}
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={!isEnabledEditBatasPerPelapak}
              color="primary"
              onClick={this.toggle('nested_editBatasPerPelapak')}
            >
              Simpan Batas per Pelapak
            </Button>
            <Modal
              onExit={this.handleClose}
              isOpen={this.state.modal_nested_editBatasPerPelapak}
              toggle={this.toggle('nested_editBatasPerPelapak')}
            >
              <ModalHeader>
                Konfirmasi Penyimpanan Batas per Pelapak
              </ModalHeader>
              <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() =>
                    this.updateBatasPerPelapak(this.state.editBatasPerPelapak)
                  }
                  disabled={loading}
                >
                  {!loading && 'Ya'}
                  {loading && <MdAutorenew />}
                  {loading && 'Sedang diproses'}
                </Button>{' '}
                {!loading && (
                  <Button
                    color="secondary"
                    onClick={this.toggle('nested_editBatasPerPelapak')}
                  >
                    Tidak
                  </Button>
                )}
              </ModalFooter>
            </Modal>{' '}
            <Button
              color="secondary"
              onClick={this.toggle('nested_parent_editBatasPerPelapak')}
            >
              Batal
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal Edit batas per pelapak */}

        {/* Modal edit massal */}
        <Modal
          size="lg"
          onExit={this.handleCloseEditMasal}
          isOpen={this.state.modal_nested_parent_editMassal}
          toggle={this.toggle('nested_parent_editMassal')}
          className={this.props.className}
          scrollable={true}
          centered={true}
        >
          <ModalHeader>Alsin Item</ModalHeader>
          <ModalBody>
            <CardBody>
              <Row
                className="d-flex justify-content-between"
                style={{ marginBottom: '1%' }}
                //   style={{ paddingRight: 0, paddingLeft: 0 }}
              >
                <Label
                  style={{
                    fontWeight: 'bold',
                    marginLeft: '2%',
                    marginTop: '8px',
                  }}
                >
                  List Alsin
                </Label>
                {/* <Button
                  size="sm"
                  onClick={this.toggle('nested_parent_tambahProduk')}
                >
                  Input Alsin
                </Button> */}
              </Row>
              <Table responsive striped id="tableBatasPerPelapak">
                <thead>
                  <tr>
                    <th>Alsin Type ID</th>
                    <th>Harga</th>
                    <th>Total Item</th>
                    <th>Edit</th>
                    <th>Hapus</th>
                  </tr>
                </thead>
                <tbody>{renderListEditMassal}</tbody>
                {this.state.listEditMasal.length === 0 && (
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
              </Table>
            </CardBody>
          </ModalBody>
          <ModalFooter>
            <Button
              // disabled={!isEnabledSaveAddProduct}
              color="primary"
              onClick={this.toggle('nested_editMassal')}
            >
              Simpan Penambahan Alsin
            </Button>
            <Modal
              onExit={this.handleCloseEditMasal}
              isOpen={this.state.modal_nested_editMassal}
              toggle={this.toggle('nested_editMassal')}
            >
              <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
              <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() => this.insertListEditMasal()}
                  disabled={loading}
                >
                  {!loading && 'Ya'}
                  {loading && <MdAutorenew />}
                  {loading && 'Sedang diproses'}
                </Button>{' '}
                {!loading && (
                  <Button
                    color="secondary"
                    onClick={this.toggle('nested_editMassal')}
                  >
                    Tidak
                  </Button>
                )}
              </ModalFooter>
            </Modal>{' '}
            <Button color="secondary" onClick={this.handleCloseTambahMasal}>
              Batal
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal Batas Edit Massal */}

        {/* Modal Tambah Alsin Item */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_tambahProduk}
          toggle={this.toggle('nested_parent_tambahProduk')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_tambahProduk')}>
            Tambah Alsin
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={e => e.preventDefault()}>
              <FormGroup>
                <Label>Alsin</Label>
                <Input
                  type="text"
                  disabled={true}
                  value={
                    this.state.addAlsin && this.state.addAlsin.alsin_type_name
                  }
                ></Input>
                <Label>Harga</Label>
                <Input
                  type="number"
                  min={0}
                  name="cost"
                  style={{ textAlign: 'right' }}
                  placeholder="Harga..."
                  onKeyPress={e => this.numValidate(e)}
                  onChange={evt =>
                    this.updateInputValue(
                      evt.target.value,
                      evt.target.name,
                      'addAlsin',
                    )
                  }
                  value={this.state.addAlsin && this.state.addAlsin.cost}
                />
                {/* <Label>Total Alsin</Label>
                <Input
                  type="number"
                  min={0}
                  name="total_item"
                  style={{ textAlign: 'right' }}
                  placeholder="Total Item..."
                  onKeyPress={e => this.numValidate(e)}
                  onChange={evt =>
                    this.updateInputValue(
                      evt.target.value,
                      evt.target.name,
                      'addAlsin',
                    )
                  }
                  value={this.state.addAlsin && this.state.addAlsin.total_item}
                /> */}
                <Label
                  style={{ fontSize: '0.8em', marginBottom: 0, color: 'red' }}
                >
                  *Input nilai dengan satuan angka
                </Label>
              </FormGroup>
            </Form>
            <br></br>
            {/* <Label style={{ fontSize: "12px" }}>CTRL+S untuk simpan</Label> */}
          </ModalBody>
          <ModalFooter>
            <Button
              // disabled={!isEnabledAddProduct}
              color="primary"
              onClick={this.toggle('nested_tambahProduk')}
            >
              Simpan Tambah Alsin
            </Button>
            <Modal
              onExit={this.handleClose}
              isOpen={this.state.modal_nested_tambahProduk}
              toggle={this.toggle('nested_tambahProduk')}
            >
              <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
              <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() =>
                    this.setListEditMassal(this.state.addAlsin, {
                      ...this.state.addAlsin,
                    })
                  }
                  disabled={loading}
                >
                  {!loading && 'Ya'}
                  {loading && <MdAutorenew />}
                  {loading && 'Sedang diproses'}
                </Button>{' '}
                {!loading && (
                  <Button
                    color="secondary"
                    onClick={this.toggle('nested_tambahProduk')}
                  >
                    Tidak
                  </Button>
                )}
              </ModalFooter>
            </Modal>{' '}
            <Button
              color="secondary"
              onClick={this.toggle('nested_parent_tambahProduk')}
            >
              Batal
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal Tambah Alsin Item */}

        {/* Modal Edit - Edit Masal */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_editMassal_edit}
          toggle={this.toggle('nested_parent_editMassal_edit')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_editMassal_edit')}>
            Edit Alsin Item
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={e => e.preventDefault()}>
              {/* {console.log('EDIT ALSIN DATA', this.state.editAlsinList)} */}
              <FormGroup>
                <Label>Alsin</Label>
                <Input
                  type="text"
                  disabled
                  value={
                    this.state.editAlsinList &&
                    this.state.editAlsinList.alsin_type_name
                  }
                />
                <Label>Harga</Label>
                <Input
                  type="number"
                  name="cost"
                  autoComplete="off"
                  placeholder="Harga..."
                  min={0}
                  style={{ textAlign: 'right' }}
                  onKeyPress={e => this.numValidate(e)}
                  onChange={evt =>
                    this.updateInputValue(
                      parseInt(evt.target.value),
                      evt.target.name,
                      'editAlsinList',
                    )
                  }
                  value={
                    this.state.editAlsinList &&
                    parseInt(this.state.editAlsinList.cost)
                  }
                />
                <Label>Total Item</Label>
                <Input
                  type="number"
                  name="total_item"
                  autoComplete="off"
                  placeholder="Total item..."
                  min={0}
                  style={{ textAlign: 'right' }}
                  onKeyPress={e => this.numValidate(e)}
                  onChange={evt =>
                    this.updateInputValue(
                      parseInt(evt.target.value),
                      evt.target.name,
                      'editAlsinList',
                    )
                  }
                  value={
                    this.state.editAlsinList &&
                    parseInt(this.state.editAlsinList.total_item)
                  }
                />
                <Label
                  style={{ fontSize: '0.8em', marginBottom: 0, color: 'red' }}
                >
                  *Input nilai dalam satuan angka
                </Label>
              </FormGroup>
            </Form>
            <br></br>
          </ModalBody>
          <ModalFooter>
            <Button
              // disabled={!isEnabledEditMassalEdit}
              color="primary"
              onClick={this.toggle('nested_editMassal_edit')}
            >
              Simpan Edit Alsin Detail
            </Button>
            <Modal
              onExit={this.handleClose}
              isOpen={this.state.modal_nested_editMassal_edit}
              toggle={this.toggle('nested_editMassal_edit')}
            >
              <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
              <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() =>
                    this.setListEditMassalEdit(this.state.editAlsinList, {
                      ...this.state.editAlsinList,
                    })
                  }
                  disabled={loading}
                >
                  {!loading && 'Ya'}
                  {loading && <MdAutorenew />}
                  {loading && 'Sedang diproses'}
                </Button>{' '}
                {!loading && (
                  <Button
                    color="secondary"
                    onClick={this.toggle('nested_editMassal_edit')}
                  >
                    Tidak
                  </Button>
                )}
              </ModalFooter>
            </Modal>{' '}
            <Button
              color="secondary"
              onClick={this.toggle('nested_parent_editMassal_edit')}
            >
              Batal
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal Edit - Edit Masal */}

        {/* Modal Hapus */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_delete}
          toggle={this.toggle('delete')}
        >
          <ModalHeader toggle={this.toggle('delete')}>Hapus Produk</ModalHeader>
          <ModalBody>Apakah Anda yakin ingin menghapus data ini?</ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={this.hapusProduk(this.state.delete_data)}
              disabled={loading}
            >
              {!loading && <span>Ya</span>}
              {loading && <MdAutorenew />}
              {loading && <span>Sedang diproses</span>}
            </Button>
            {!loading && (
              <Button color="secondary" onClick={this.toggle('delete')}>
                Tidak
              </Button>
            )}
          </ModalFooter>
        </Modal>
        {/* Modal Hapus */}

        {/* Modal List Pelapak */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_list}
          toggle={this.toggle('nested_parent_list')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_list')}>
            List Alsin
          </ModalHeader>
          <ModalBody>
            <Form
              inline
              className="cr-search-form"
              onSubmit={e => e.preventDefault()}
            >
              <MdSearch
                size="20"
                className="cr-search-form__icon-search text-secondary"
              />
              <Input
                autoComplete="off"
                type="search"
                className="cr-search-form__input"
                placeholder="Cari Pelapak..."
                id="search"
                onChange={evt => this.updateSearchValueList(evt)}
                onKeyPress={event => this.enterPressedSearchList(event, true)}
              />
            </Form>

            <Table responsive striped>
              <thead>
                <tr>
                  <th style={{ border: 'none' }}>
                    <Label style={{ textAlign: 'left' }}>Kode</Label>
                  </th>
                  <th style={{ border: 'none' }}>
                    <Label style={{ textAlign: 'left' }}>Alsin</Label>
                  </th>
                </tr>
              </thead>
              <tbody>
                {renderAlsinItem}
                {!alsintItemTodos && (
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
          <ModalFooter>
            <Row>
              <Col sm="6">
                <Input
                  disabled
                  style={{
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 0,
                  }}
                  value={
                    'Halaman: ' +
                    this.state.realCurrentPages +
                    '/' +
                    this.state.maxPages
                  }
                ></Input>
              </Col>
              <Col sm="6">
                <Card className="mb-3s">
                  <ButtonGroup>
                    <Button
                      name="FirstButton"
                      value={1}
                      onClick={e =>
                        this.paginationButtonList(e, 0, this.state.maxPages)
                      }
                    >
                      &#10092;&#10092;
                    </Button>
                    <Button
                      name="PrevButton"
                      value={this.state.currentPages}
                      onClick={e =>
                        this.paginationButtonList(e, -1, this.state.maxPages)
                      }
                    >
                      &#10092;
                    </Button>
                    <input
                      type="text"
                      placeholder="Page"
                      outline="none"
                      value={this.state.currentPages}
                      onChange={e =>
                        this.setState({
                          currentPages: e.target.value,
                        })
                      }
                      onKeyPress={e => this.enterPressedPageList(e)}
                      style={{
                        height: '38px',
                        width: '75px',
                        textAlign: 'center',
                      }}
                    />
                    <Button
                      name="NextButton"
                      value={this.state.currentPages}
                      onClick={e =>
                        this.paginationButtonList(e, 1, this.state.maxPages)
                      }
                    >
                      &#10093;
                    </Button>
                    <Button
                      name="LastButton"
                      value={this.state.maxPages}
                      onClick={e =>
                        this.paginationButtonList(e, 0, this.state.maxPages)
                      }
                    >
                      &#10093;&#10093;
                    </Button>
                  </ButtonGroup>
                </Card>
              </Col>
            </Row>
          </ModalFooter>
        </Modal>
        {/* Modal List Pelapak */}

        {/* Modal List Ecommerce */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_list_ecommerceList}
          toggle={this.toggle('nested_parent_list_ecommerceList')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_list_ecommerceList')}>
            List Ecommerce
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <thead>
                <tr>
                  <th style={{ border: 'none' }}>
                    <Label style={{ textAlign: 'left' }}>Nama Ecommerce</Label>
                  </th>
                </tr>
              </thead>
              <tbody>
                {renderEcommerce}
                {!renderEcommerce && (
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
        {/* Modal List Ecommerce */}

        {/* Modal List Ecommerce Edit Masal */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_list_ecommerceListEditMasal}
          toggle={this.toggle('nested_parent_list_ecommerceListEditMasal')}
          className={this.props.className}
        >
          <ModalHeader
            toggle={this.toggle('nested_parent_list_ecommerceListEditMasal')}
          >
            List Ecommerce
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <thead>
                <tr>
                  <th style={{ border: 'none' }}>
                    <Label style={{ textAlign: 'left' }}>Nama Ecommerce</Label>
                  </th>
                </tr>
              </thead>
              <tbody>
                {renderEcommerceEditMasal}
                {!renderEcommerceEditMasal && (
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
        {/* Modal List Ecommerce Edit Masal */}

        {/* Modal List Periode */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_list_periodeList}
          toggle={this.toggle('nested_parent_list_periodeList')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_list_periodeList')}>
            List Periode
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <thead>
                <tr>
                  <th style={{ border: 'none' }}>
                    <Label style={{ textAlign: 'left' }}>Periode</Label>
                  </th>
                </tr>
              </thead>
              <tbody>
                {renderPeriode}
                {!periodeTodos && (
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
        {/* Modal List Periode */}

        {/* Modal List Pelapak Edit Masal */}
        <Modal
          size="lg"
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_list_editMasal}
          toggle={this.toggle('nested_parent_list_editMasal')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_list_editMasal')}>
            List Pelapak
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col>
                <Form
                  inline
                  className="cr-search-form"
                  onSubmit={e => e.preventDefault()}
                >
                  <MdSearch
                    size="20"
                    className="cr-search-form__icon-search text-secondary"
                  />
                  <Input
                    autoComplete="off"
                    type="search"
                    className="cr-search-form__input"
                    placeholder="Pilih Pelapak yang di tujukan"
                    id="search"
                    onChange={evt => this.updateSearchValue(evt)}
                    onKeyPress={event =>
                      this.enterPressedSearchListEditMasal(event, true)
                    }
                  />
                </Form>
              </Col>
              <Col>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">Ecom</InputGroupAddon>
                  <select
                    name="todosPerPage"
                    style={{ height: '38px' }}
                    value={this.state.value}
                    onChange={e => this.handleSelectEditMasal(e)}
                  >
                    <option value="">All</option>
                    <option value="1">Tokopedia</option>
                    <option value="2">Shopee</option>
                  </select>
                  <InputGroupAddon addonType="append">
                    <Button onClick={() => this.selectAllPelapak()}>
                      Pilih Semua
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
            </Row>

            <Table responsive striped>
              <thead>
                <tr>
                  <th style={{ border: 'none' }}>
                    <Label style={{ textAlign: 'left' }}>Comco</Label>
                  </th>
                  <th style={{ border: 'none' }}>
                    <Label style={{ textAlign: 'left' }}>Pelapak</Label>
                  </th>
                  <th style={{ border: 'none' }}>
                    <Label style={{ textAlign: 'left' }}>Ecommerce</Label>
                  </th>
                </tr>
              </thead>
              <tbody>
                {renderPelapakEditMasal}
                {!pelapakEcommerceTodos && (
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
        {/* Modal List Pelapak Edit Masal */}
        {/* KHUSUS MODAL */}
      </Page>
    );
  }

  canBeSubmitted() {
    const {
      currentDimenBatasStandar,
      nilaiLamaPharos,
      nilaiLamaNonPharos,
    } = this.state;
    var nilaiPharosLama =
      currentDimenBatasStandar && currentDimenBatasStandar.dividerlnbupripi;
    var nilaiNonPharosLama =
      currentDimenBatasStandar && currentDimenBatasStandar.dividerlnbuprinonpi;
    var nilaiNonPharosLama2 =
      nilaiNonPharosLama && nilaiNonPharosLama.toString();
    var nilaiPharosLama2 = nilaiPharosLama && nilaiPharosLama.toString();
    var nilaiLama = nilaiLamaPharos && nilaiLamaPharos.toString();
    var nilaiNonLama = nilaiLamaNonPharos && nilaiLamaNonPharos.toString();

    return (
      (nilaiNonPharosLama2 !== nilaiNonLama ||
        nilaiPharosLama2 !== nilaiLama) &&
      nilaiPharosLama2 !== '' &&
      nilaiNonPharosLama2 !== ''
    );
  }

  canBeSubmittedEdit() {
    const { currentDimen, editDimen, tempEditDimen } = this.state;
    const nilaiLama = currentDimen && currentDimen.limitpriceecommerce;
    const nilaiBaru = editDimen && editDimen.limitpriceecommerce;
    const nilaiTemp = tempEditDimen && tempEditDimen[0];

    return (
      nilaiLama === nilaiBaru && nilaiBaru !== '' && nilaiBaru !== nilaiTemp
    );
  }

  canBeSubmittedAddProduct() {
    const { resultDataProcod, currentDimen } = this.state;
    const procod = resultDataProcod && resultDataProcod.pro_code;
    const nama = resultDataProcod && resultDataProcod.pro_name;
    const qty = currentDimen && currentDimen.qtyBatasBawah;
    return (
      procod !== '' &&
      nama !== '' &&
      qty !== '' &&
      procod !== undefined &&
      nama !== undefined &&
      qty !== undefined &&
      parseFloat(qty) !== 0
    );
  }

  canBeSubmittedSaveAddProduct() {
    const { listEditMasal, startDate, endDate, pelapakDetail } = this.state;
    var d1 = Date.parse(startDate);
    var d2 = Date.parse(endDate);
    var today = Date.parse(new Date().toJSON().slice(0, 10));

    return (
      (listEditMasal.length !== 0 &&
        pelapakDetail.length !== 0 &&
        startDate !== '' &&
        d1 >= today) ||
      (listEditMasal.length !== 0 &&
        pelapakDetail.length !== 0 &&
        startDate !== '' &&
        d1 >= today &&
        d2 >= d1 &&
        d2 >= today)
    );
  }

  canBeSubmittedEditMassalEdit() {
    const { editBatasBawah, listEditMasal } = this.state;
    const nilaiLama = listEditMasal && listEditMasal[0];
    var nilaiCurr = nilaiLama && nilaiLama.qtybatasbawah;
    var nilaiBaru = editBatasBawah && editBatasBawah.qtybatasbawah;

    return (
      nilaiCurr !== nilaiBaru && nilaiBaru !== '' && parseFloat(nilaiBaru) !== 0
    );
  }
  canBeSubmittedEditBatasPerPelapak() {
    const { editBatasPerPelapak, tempEditBatasPerPelapak } = this.state;
    var nilaiNonPharosBaru =
      tempEditBatasPerPelapak && tempEditBatasPerPelapak[0];
    var nilaiPharosBaru = tempEditBatasPerPelapak && tempEditBatasPerPelapak[1];

    var nilaiPharosLama =
      editBatasPerPelapak && editBatasPerPelapak.dividerlnbupripi;
    var nilaiNonPharosLama =
      editBatasPerPelapak && editBatasPerPelapak.dividerlnbuprinonpi;

    return (
      (parseFloat(nilaiNonPharosLama) !== parseFloat(nilaiNonPharosBaru) ||
        parseFloat(nilaiPharosLama) !== parseFloat(nilaiPharosBaru)) &&
      nilaiPharosLama !== '' &&
      nilaiNonPharosLama !== '' &&
      parseFloat(nilaiPharosLama) !== 0 &&
      parseFloat(nilaiNonPharosLama) !== 0
    );
  }

  updateInputValue(value, field, Dimen) {
    let currentDimen = this.state[Dimen];
    currentDimen[field] = value;
    this.setState({ currentDimen });
  }

  numValidate(e) {
    // console.log('MASUK', e.keyCode);
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);
    if (/\+|-/.test(keyValue)) e.preventDefault();
  }

  inputBarcode = event => {
    this.setState({
      procod: event.target.value,
    });
  };

  updateSearchValue(evt) {
    this.setState({
      keyword: evt.target.value,
    });
  }

  updateSearchValueList(evt) {
    this.setState({
      keywordList: evt.target.value,
    });
  }
}
export default Transaksi;
