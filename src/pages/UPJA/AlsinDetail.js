import Page from 'components/Page';
import React from 'react';
import imageNotFound from 'assets/img/imageNotFound.jpg';
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
  MdHome,
} from 'react-icons/md';
import { MdLoyalty, MdRefresh } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import * as myUrl from 'pages/urlLink.js';
import * as firebase from 'firebase/app';
import { Scrollbar } from 'react-scrollbars-custom';
import LoadingSpinner from 'pages/LoadingSpinner.js';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import 'firebase/analytics'
const analytics = firebase.analytics()

class AlsinDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultFarmer: [],
      resultUpja: [],
      resultFarmerTransaction: [],
      resultUpjaTransaction: [],
      resultUpjaAlsin: [],
      resultAlsin: [],
      resultAlsinItem: [],
      resultDetailAlsinItem: [],
      resultDetailTransactionAlsinItem: [],
      resultTransactionAlsin: [],
      resultTransaction: [],
      resultTransactionAlsinItem: [],
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
      loadingPage: true,
      loadingPageAlsin: true,
      loadingPageDetailAlsin: true,
      loadingPageTransaction: true,
      loadingPageTransactionAlsinItem: true,
      checked: false,
      barcode: '',
      newProductDesc: '',
      newProcode: '',
      enterButton: false,
      resultProvinsi: [],
      resultKotaKab: [],
      resultKecamatan: [],
      pilihType: '',
      pilihProvinsi: '',
      pilihKotaKab: '',
      pilihKecamatan: '',
      lastID: 0,
      namaPeriode: '',
      ecommerceID: '',
      action: '',
      typeDisabled: false,
      domisiliDisabled: true,
      periodeDisabled: true,
      dataAvailable: false,
      startDate: '',
      endDate: '',
      resetInfo: false,
      resultStatus: [
        {
          status_id: 'Tersedia',
          status_name: 'Tersedia',
        },
        {
          status_id: 'Sedang Digunakan',
          status_name: 'Sedang Digunakan',
        },
        {
          status_id: 'Rusak',
          status_name: 'Rusak',
        },
      ],

      namaProvinsi2: [],
      idPelapak: [],
      pelapakDetail: [],
      ecommerceDetail: [],
      dynamicHeightEcommerce: '0px',
      dynamicHeightPelapak: '0px',

      farmer_id: props.match.params.farmer_id,
      upja_id: props.match.params.upja_id,
      alsin_type_id: props.match.params.alsin_type_id,
    };
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

  saveDomisili() {
    this.setState({
      pilihProvinsi: this.state.pilihProvinsi,
      pilihKotaKab: this.state.pilihKotaKab,
      pilihKecamatan: this.state.pilihKecamatan,
      domisiliDisabled: true,
      typeDisabled: true,
      modal_nested_parent_list_domisili: false,
    });
  }

  // get data farmer
  getListbyPagingFarmer(currPage, currLimit) {
    var farmer_id = this.state.farmer_id;
    const url = myUrl.url_getAllAlsin + '?farmer_id=' + farmer_id;
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
            loadingPage: false,
          });
        }
      })
      .then(data => {
        var status = data.status;
        var resultFarmer = data.result.farmer;
        var resultTransaction = data.result.transactions.transactions;
        var message = data.result.message;
        // console.log('data jalan GetlistByPaging farmer', data);
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPage: false,
          });
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState(
            {
              resultFarmer: [resultFarmer],
              resultFarmerTransaction: resultTransaction,
              loadingPage: false,
            },
            // () =>
            //   console.log(
            //     'TRANSAKSI FARMER',
            //     this.state.resultFarmerTransaction,
            //   ),
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

  // get data upja
  getListbypagingAlsin(currPage, currLimit) {
    var alsin_type_id = this.state.alsin_type_id;
    const url = myUrl.url_getAllAlsinDetail + '?alsin_type_id=' + alsin_type_id;
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
            loadingPage: false,
          });
        }
      })
      .then(data => {
        // console.log('DATA ALSIN DETAIL', data);
        var status = data.status;
        var resultAlsin = data.result.alsin;
        var resultAlsinItem = data.result.alsin_items;
        var message = data.result.message;
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPage: false,
          });
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState({
            resultAlsin: resultAlsin,
            resultAlsinItem: resultAlsinItem,
            loadingPage: false,
          });
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

  getDetailAlsin(currPage, currLimit) {
    var upja_id = this.state.upja_id;
    // console.log('UPJA ID', upja_id);
    var alsin_type_id = this.state.detailAlsin.alsin_type_id;
    const url =
      myUrl.url_getAllAlsin +
      '?upja_id=' +
      upja_id +
      '&alsin_type_id=' +
      alsin_type_id;
    var token = window.localStorage.getItem('tokenCookies');
    // console.log('URL GET LIST ALSIN', url);

    this.setState(
      { loadingPageAlsin: true },
      this.toggle('nested_parent_detail_alsin'),
    );
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
            loadingPageAlsin: false,
          });
        }
      })
      .then(data => {
        // console.log('DATA ALSIN', data);
        var status = data.status;
        var resultAlsinItem = data.result.alsin_items;
        var resultAlsin = data.result.alsin;
        var message = data.result.message;
        // console.log('data jalan GetlistByPaging upja', data);
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPageAlsin: false,
          });
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState({
            resultAlsin: [resultAlsin],
            resultAlsinItem: resultAlsinItem,
            loadingPageAlsin: false,
          });
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loadingPageAlsin: false,
        });
      });
  }

  getDetailAlsinItem(currPage, currLimit) {
    var alsin_item_id = this.state.detailAlsinItem.alsin_item_id;
    const url = myUrl.url_getAllAlsin + '?alsin_item_id=' + alsin_item_id;
    var token = window.localStorage.getItem('tokenCookies');
    // console.log('URL GET LIST ALSIN DETAIL', url);

    this.setState(
      { loadingPageDetailAlsin: true },
      this.toggle('nested_parent_detail_alsin_item'),
    );
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
            loadingPageDetailAlsin: false,
          });
        }
      })
      .then(data => {
        // console.log('DATA ALSIN DETAIL', data);
        var status = data.status;
        var resultDetailAlsinItem = data.result.alsin_items;
        var resultDetailTransactionAlsinItem = data.result.transactions;
        var message = data.result.message;
        // console.log('data jalan GetlistByPaging upja', data);
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPageDetailAlsin: false,
          });
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState({
            resultDetailAlsinItem: [resultDetailAlsinItem],
            resultDetailTransactionAlsinItem: resultDetailTransactionAlsinItem,
            loadingPageDetailAlsin: false,
          });
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loadingPageDetailAlsin: false,
        });
      });
  }

  getDetailTransaction(currPage, currLimit) {
    var transaction_order_id = this.state.detailTransaction
      .transaction_order_id;
    const url =
      myUrl.url_getAllAlsin + '?transaction_order_id=' + transaction_order_id;
    var token = window.localStorage.getItem('tokenCookies');
    // console.log('URL GET LIST TRANSACTION', url);

    this.setState(
      { loadingPageTransaction: true },
      this.toggle('nested_parent_list_transaksi'),
    );
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
            loadingPageTransaction: false,
          });
        }
      })
      .then(data => {
        // console.log('DATA TRANSAKSI', data);
        var status = data.status;
        var resultTransaction = data.result.transaction;
        var resultTransactionAlsin = data.result.alsins;
        var message = data.result.message;
        // console.log('data jalan GetlistByPaging upja', data);
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPageTransaction: false,
          });
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState(
            {
              resultTransaction: [resultTransaction],
              resultTransactionAlsin: resultTransactionAlsin,
              loadingPageTransaction: false,
            },
            // () => console.log('DATA TRANSAKSI', data),
          );
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loadingPageTransaction: false,
        });
      });
  }

  getDetailTransactionAlsin(currPage, currLimit) {
    // console.log(
    //   'this.state.detailTransactionAlsinItem',
    //   this.state.detailTransactionAlsinItem,
    // );
    var transaction_order_id = this.state.detailTransaction
      .transaction_order_id;
    var alsin_type_id = this.state.detailTransactionAlsinItem.alsin_type_id;
    const url =
      myUrl.url_getAllAlsin +
      '?transaction_order_id=' +
      transaction_order_id +
      '&alsin_type_id=' +
      alsin_type_id;
    var token = window.localStorage.getItem('tokenCookies');
    // console.log('URL GET LIST TRANSACTION ALSIN ITEM', url);

    this.setState(
      { loadingPageTransactionAlsinItem: true },
      this.toggle('nested_parent_list_transaksi_alsinItem'),
    );
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
            loadingPageTransactionAlsinItem: false,
          });
        }
      })
      .then(data => {
        // console.log('DATA TRANSAKSI ALSIN ITEM', data);
        var status = data.status;
        var resultTransactionAlsinItem = data.result.alsin_items;
        var message = data.result.message;
        // console.log('data jalan GetlistByPaging upja', data);
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPageTransactionAlsinItem: false,
          });
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState(
            {
              resultTransactionAlsinItem: resultTransactionAlsinItem,
              loadingPageTransactionAlsinItem: false,
            },
            // () => console.log('DATA TRANSAKSI', data),
          );
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loadingPageTransactionAlsinItem: false,
        });
      });
  }

  componentDidMount() {
    var token = window.localStorage.getItem('tokenCookies');
    if (token === '' || token === null || token === undefined) {
      window.location.replace('/login');
    }
    this.getListbypagingAlsin();
    analytics.logEvent("Halaman Alsin Detail")
  }

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

  toggle = (modalType, todo) => () => {
    // console.log('TERPANGGIL');
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

    console.log('MODAL TYPEE', modalType);
    if (modalType === 'nested_parent_editAlsin') {
      // console.log('LOG 1');
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        editAlsin: todo,
      });
    } else if (modalType === 'nested_parent_nonaktifAlsin') {
      // console.log('LOG 1');
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        deleteAlsin: todo,
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

  handleCloseDomisili = () => {
    this.setState(
      {
        namaProvinsi: '',
        namaKotaKab: '',
        namaKecamatan: '',
        pilihProvinsi: '',
        pilihKotaKab: '',
        pilihKecamatan: '',
        modal_nested_parent_list_domisili: false,
      },
      // () =>
      //   console.log(
      //     'ISI SETELAH CLOSE',
      //     this.state.namaProvinsi,
      //     this.state.namaKotaKab,
      //     this.state.namaKecamatan,
      //   ),
    );
  };

  handleClose = () => {};

  SearchAllList() {
    const {
      pilihKecamatan,
      pilihKotaKab,
      pilihType,
      pilihProvinsi,
    } = this.state;
    return (
      pilihKecamatan !== '' &&
      pilihKotaKab !== '' &&
      pilihType !== '' &&
      pilihProvinsi !== ''
    );
  }

  setModalType() {
    this.setState(
      {
        domisiliDisabled: true,
        // namaEcommerce: '',
      },
      this.toggle('nested_parent_list'),
    );
  }

  setModalDetailAlsin(todo) {
    this.setState(
      {
        detailAlsin: todo,
        // namaEcommerce: '',
      },
      () => this.getDetailAlsin(),
    );
  }

  setModalDetailAlsinItem(todo) {
    this.setState(
      {
        detailAlsinItem: todo,
        // namaEcommerce: '',
      },
      () => this.getDetailAlsinItem(),
    );
  }
  setModalDetailTransaction(todo) {
    this.setState(
      {
        detailTransaction: todo,
        // namaEcommerce: '',
      },
      () => this.getDetailTransaction(),
    );
  }

  setModalDetailTransaksiAlsin(todo) {
    this.setState(
      {
        detailTransactionAlsinItem: todo,
        // namaEcommerce: '',
      },
      () => this.getDetailTransactionAlsin(),
    );
  }

  firstPage() {
    this.setState(
      {
        lastID: 0,
      },
      () => this.getListbyPaging(),
    );
  }

  actionPage(param) {
    var nextPage = document.getElementById('nextPageHeader');
    var prevPage = document.getElementById('prevPageHeader');
    var firstPage = document.getElementById('firstPageHeader');

    // console.log('PARAM', param, 'TEST', param === nextPage);

    if (param === 'nextPageHeader') {
      // console.log('A');
      // this.setState(
      //   {
      //     action: 'next',
      //   },
      //   () => this.getListbyPaging(),
      // );
    }
    if (param === 'prevPageHeader') {
      // console.log('B');
      this.setState(
        {
          action: 'prev',
          lastID: this.state.lastIDprev,
        },
        () => this.getListbyPaging(),
      );
    }
    if (param === 'firstPageHeader') {
      // console.log('C');
      this.setState(
        {
          lastID: 0,
          action: '',
        },
        () => this.getListbyPaging(),
      );
    }
  }

  deleteHeaderData = first_param => {
    var url = myUrl.url_deleteAlsinItem;
    const deleteDataHeader = first_param;
    var token = window.localStorage.getItem('tokenCookies');
    console.log('DATA HEADER', deleteDataHeader);

    this.setState({ loading: true });
    var payload = {
      alsin_item_id: deleteDataHeader.alsin_item_id,
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
            () => this.getListbypagingAlsin(),
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
    // const trace = perf.trace('updateHeaderData');
    var url = myUrl.url_updateAlsinItem;
    const updateHeaderData = first_param;
    var token = window.localStorage.getItem('tokenCookies');
    console.log('DATA HEADER', updateHeaderData);
    console.log('DATA HEADER', this.state.editAlsin);

    this.setState({ loading: true });
    var payload = {
      alsin_item_id: updateHeaderData.alsin_item_id,
      vechile_code: updateHeaderData.vechile_code,
      status: updateHeaderData.status || this.state.pilihStatus,
      description: updateHeaderData.description
    };

    console.log('PAYLOAD EDIT ALSIN ITEM', payload);

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
            () => this.getListbypagingAlsin(),
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

  updateInputValue(value, field, fill) {
    let input = this.state[fill];
    input[field] = value;
    this.setState({ input }, () =>
      console.log('EDIT ALSIN ', this.state.editAlsin),
    );
  }

  setStatus = event => {
    var nama = this.state.resultStatus.find(function (element) {
      return element.status_id === event.target.value;
    });
    this.setState({
      pilihStatus: event.target.value,
      namaStatus: nama.status_name,
    });
    this.state.editAlsin.status = '';
  };

  render() {
    const {
      loading,
      loadingPage,
      loadingPageAlsin,
      loadingPageDetailAlsin,
      loadingPageTransaction,
      loadingPageTransactionAlsinItem,
    } = this.state;
    const statusTodos = this.state.resultStatus;

    const currentTodosFarmer = this.state.resultFarmer;
    const currentTodosUpja = this.state.resultUpja;
    const currentTodosFarmerTransaction = this.state.resultFarmerTransaction;
    const currentTodosAlsin = this.state.resultAlsinItem;
    const currentTodosUpjaAlsin = this.state.resultUpjaAlsin;
    const currentTodosAlsinItem = this.state.resultAlsinItem;
    const currentTodosDetailAlsinItem = this.state
      .resultDetailTransactionAlsinItem;
    const currentTodosTransaction = this.state.resultTransactionAlsin;
    const currentTodosTransactionAlsinItem = this.state
      .resultTransactionAlsinItem;
    const provinsiTodos = this.state.resultProvinsi;
    const kotakabTodos = this.state.resultKotaKab;
    const kecamatanTodos = this.state.resultKecamatan;

    const isEnabledSaveDomisili = this.canBeSubmittedDomisili();
    const isSearch = this.SearchAllList();

    var formatter = new Intl.NumberFormat('id-ID', {
      currency: 'IDR',
    });

    const renderStatus =
      statusTodos &&
      statusTodos.map((todo, i) => {
        return <option value={todo.status_id}>{todo.status_name}</option>;
      });

    const renderTodosFarmer =
      currentTodosFarmerTransaction &&
      currentTodosFarmerTransaction.map((todo, i) => {
        return (
          <tr key={i}>
            {todo.upja_id !== '' && (
              <td style={{ textAlign: 'left' }}>
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: '#009688',
                    }}
                    onClick={() => this.setModalDetailTransaction({ ...todo })}
                  >
                    {todo.upja_id}
                  </Label>
                }
              </td>
            )}
            <td>{formatter.format(todo.transport_cost)}</td>
            <td>{formatter.format(todo.total_cost)}</td>
            {todo.upja_name !== '' && (
              <td style={{ textAlign: 'left' }}>
                <Link to={`/showTransaction/upja=${todo.upja_id}`}>
                  {
                    <Label
                      style={{
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        color: '#009688',
                      }}
                    >
                      {todo.upja_name}
                    </Label>
                  }
                </Link>
              </td>
            )}
            <td>{todo.order_time}</td>
            <td>{todo.delivery_time}</td>
            {todo.payment_yn === 1 && (
              <td>
                <Badge color="success">Sudah Lunas</Badge>
              </td>
            )}
            {todo.payment_yn === 0 && (
              <td>
                <Badge color="danger">Belum Dibayar</Badge>
              </td>
            )}
          </tr>
        );
      });

    {
      // console.log('render alsin', currentTodosAlsin);
    }
    const renderTodosAlsin =
      currentTodosAlsin &&
      currentTodosAlsin.map((todo, i) => {
        return (
          <tr key={i}>
            {todo.vechile_code === null && <td>-</td>}
            {todo.vechile_code !== null && <td>{todo.vechile_code}</td>}
            <td>{todo.description}</td>

            {todo.status === 'Rusak' && (
              <td>
                <Badge color="danger">{todo.status}</Badge>
              </td>
            )}
            {todo.status === 'Sedang Digunakan' && (
              <td>
                <Badge color="warning">{todo.status}</Badge>
              </td>
            )}
            {todo.status === 'Tersedia' && (
              <td>
                <Badge color="success">{todo.status}</Badge>
              </td>
            )}

            <td>
              <Button
                style={{ margin: '0px' }}
                color="secondary"
                size="sm"
                onClick={this.toggle('nested_parent_editAlsin', { ...todo })}
              >
                <MdEdit />
              </Button>
            </td>
            <td>
              <Button
                style={{ margin: '0px' }}
                color="danger"
                size="sm"
                onClick={this.toggle('nested_parent_nonaktifAlsin', {
                  ...todo,
                })}
              >
                <MdDelete />
              </Button>
            </td>
          </tr>
        );
      });

    const renderTodosTransaction =
      currentTodosTransaction &&
      currentTodosTransaction.map((todo, i) => {
        return (
          <tr key={i}>
            {todo.alsin_type_name !== '' && (
              <td style={{ textAlign: 'left' }}>
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: '#009688',
                    }}
                    onClick={() =>
                      this.setModalDetailTransaksiAlsin({ ...todo })
                    }
                  >
                    {todo.alsin_type_name}
                  </Label>
                }
              </td>
            )}
            {todo.alsin_type_name === '' && (
              <td style={{ textAlign: 'left' }}>
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    -
                  </Label>
                }
              </td>
            )}
            <td>{todo.total_alsin}</td>
          </tr>
        );
      });

    const renderTodosTransactionAlsinItem =
      currentTodosTransactionAlsinItem &&
      currentTodosTransactionAlsinItem.map((todo, i) => {
        return (
          <tr key={i}>
            {todo.vechile_code !== null && (
              <td style={{ textAlign: 'left' }}>
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    {todo.vechile_code}
                  </Label>
                }
              </td>
            )}
            {todo.vechile_code === null && (
              <td style={{ textAlign: 'left' }}>
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    -
                  </Label>
                }
              </td>
            )}
            <td>{todo.cost}</td>
            {todo.status === 'Rusak' && (
              <td>
                <Badge color="danger">{todo.status}</Badge>
              </td>
            )}
            {todo.status === 'Sedang Digunakan' && (
              <td>
                <Badge color="warning">{todo.status}</Badge>
              </td>
            )}
            {todo.status === 'Tersedia' && (
              <td>
                <Badge color="success">{todo.status}</Badge>
              </td>
            )}
          </tr>
        );
      });

    const renderTodosUpjaAlsin =
      currentTodosUpjaAlsin &&
      currentTodosUpjaAlsin.map((todo, i) => {
        return (
          <tr key={i}>
            {todo.alsin_type_name !== '' && (
              <td style={{ textAlign: 'left' }}>
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: '#009688',
                    }}
                    onClick={() => this.setModalDetailAlsin({ ...todo })}
                  >
                    {todo.alsin_type_name}
                  </Label>
                }
              </td>
            )}
            {todo.picture === null && (
              <td>
                <img
                  src={imageNotFound}
                  width="100"
                  height="50"
                  className="pr-2"
                  alt=""
                />
              </td>
            )}
            {todo.picture !== null && (
              <td>
                <img
                  src={todo.picture}
                  width="100"
                  height="50"
                  className="pr-2"
                  alt=""
                />
              </td>
            )}

            <td>{formatter.format(todo.cost)}</td>
            <td>{todo.available}</td>
            <td>{todo.not_available}</td>
            <td>{todo.total_item}</td>
          </tr>
        );
      });

    const renderTodosAlsinItem =
      currentTodosAlsinItem &&
      currentTodosAlsinItem.map((todo, i) => {
        return (
          <tr key={i}>
            {todo.vechile_code !== '' && (
              <td style={{ textAlign: 'left' }}>
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: '#009688',
                    }}
                    onClick={() => this.setModalDetailAlsinItem({ ...todo })}
                  >
                    {todo.vechile_code}
                  </Label>
                }
              </td>
            )}
            {todo.status === 1 && (
              <td>
                <Badge color="red">Tidak Tersedia</Badge>
              </td>
            )}
            {todo.status === 0 && (
              <td>
                <Badge color="success">Tersedia</Badge>
              </td>
            )}
          </tr>
        );
      });

    const renderTodosDetailAlsinItem =
      currentTodosDetailAlsinItem &&
      currentTodosDetailAlsinItem.map((todo, i) => {
        return (
          <tr key={i}>
            <th scope="row">{todo.upja_name}</th>
            <td>{todo.farmer_name}</td>
            {todo.vechile_code !== '' && (
              <td style={{ textAlign: 'left' }}>
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: '#009688',
                    }}
                    onClick={() => this.setModalDetailAlsinItem({ ...todo })}
                  >
                    {todo.vechile_code}
                  </Label>
                }
              </td>
            )}
            {/* <td>{todo.vechile_code}</td> */}
            <td>{formatter.format(todo.transport_cost)}</td>
            <td>{formatter.format(todo.total_cost)}</td>
            <td>{todo.order_time}</td>
            <td>{todo.delivery_time}</td>
            {todo.payment_yn === 1 && (
              <td>
                <Badge color="red">Belum Dibayar</Badge>
              </td>
            )}
            {todo.payment_yn === 0 && (
              <td>
                <Badge color="success">Sudah Lunas</Badge>
              </td>
            )}
          </tr>
        );
      });

    return (
      <Page
        title="Alsin Detail"
        breadcrumbs={[{ name: 'Alsin', active: true }]}
        className="Alsin"
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
                      placeholder="Cari..."
                      id="search"
                      onChange={evt => this.updateSearchValue(evt)}
                      onKeyPress={event => this.enterPressedSearch(event, true)}
                    />
                  </Form>
                </Col>
                <Col
                  sm={7}
                  style={{ textAlign: 'right', paddingRight: 0 }}
                ></Col>
              </CardHeader> */}
              <CardBody>
                <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                  <Col>
                    <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                      <Col
                        sm={9}
                        style={{ paddingBottom: 0, marginBottom: '1%' }}
                      >
                        {this.state.resultAlsin &&
                        this.state.resultAlsin.picture === null ? (
                          <img
                            src={imageNotFound}
                            width="120"
                            height="60"
                            className="pr-2"
                            alt=""
                          />
                        ) : (
                          <img
                            src={
                              this.state.resultAlsin &&
                              this.state.resultAlsin.farmer_name
                            }
                            width="120"
                            height="60"
                            className="pr-2"
                            alt=""
                          />
                        )}
                      </Col>
                    </Row>
                    <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                      <Col sm={3} style={{ paddingBottom: 0, marginBottom: 0 }}>
                        <Label style={{ fontWeight: 'bold' }}>Alsin</Label>
                      </Col>

                      <Col sm={9} style={{ paddingBottom: 0, marginBottom: 0 }}>
                        :&nbsp;
                        {this.state.resultAlsin &&
                        this.state.resultAlsin.length === 0 ? (
                          <Label style={{ fontWeight: 'bold' }}>-</Label>
                        ) : (
                          <Label style={{ fontWeight: 'bold' }}>
                            &nbsp;
                            {this.state.resultAlsin &&
                              this.state.resultAlsin.name}
                          </Label>
                        )}
                      </Col>
                    </Row>
                    <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                      <Col sm={3} style={{ paddingBottom: 0, marginBottom: 0 }}>
                        <Label style={{ fontWeight: 'bold' }}>Harga</Label>
                      </Col>

                      <Col sm={9} style={{ paddingBottom: 0, marginBottom: 0 }}>
                        :&nbsp;
                        {this.state.resultAlsin &&
                        this.state.resultAlsin.length === 0 ? (
                          <Label style={{ fontWeight: 'bold' }}>-</Label>
                        ) : (
                          <Label style={{ fontWeight: 'bold' }}>
                            &nbsp;
                            {this.state.resultAlsin &&
                              formatter.format(this.state.resultAlsin.cost)}
                          </Label>
                        )}
                      </Col>
                    </Row>
                    <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                      <Col sm={3} style={{ paddingBottom: 0, marginBottom: 0 }}>
                        <Label style={{ fontWeight: 'bold' }}>Tersedia</Label>
                      </Col>
                      <Col sm={9} style={{ paddingBottom: 0, marginBottom: 0 }}>
                        :&nbsp;
                        {this.state.resultAlsin &&
                        this.state.resultAlsin.length === 0 ? (
                          <Label style={{ fontWeight: 'bold' }}>-</Label>
                        ) : (
                          <Label style={{ fontWeight: 'bold' }}>
                            &nbsp;{' '}
                            {this.state.resultAlsin &&
                              this.state.resultAlsin.available}
                          </Label>
                        )}
                      </Col>
                    </Row>
                    <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                      <Col sm={3} style={{ paddingBottom: 0, marginBottom: 0 }}>
                        <Label style={{ fontWeight: 'bold' }}>
                          Tidak Tersedia
                        </Label>
                      </Col>
                      <Col sm={9} style={{ paddingBottom: 0, marginBottom: 0 }}>
                        :&nbsp;
                        {this.state.resultAlsin &&
                        this.state.resultAlsin.length === 0 ? (
                          <Label style={{ fontWeight: 'bold' }}>-</Label>
                        ) : (
                          <Label style={{ fontWeight: 'bold' }}>
                            &nbsp;{' '}
                            {this.state.resultAlsin &&
                              this.state.resultAlsin.not_available}
                          </Label>
                        )}
                      </Col>
                    </Row>
                    <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                      <Col sm={3} style={{ paddingBottom: 0, marginBottom: 0 }}>
                        <Label style={{ fontWeight: 'bold' }}>Total Item</Label>
                      </Col>
                      <Col sm={9} style={{ paddingBottom: 0, marginBottom: 0 }}>
                        :&nbsp;
                        {this.state.resultAlsin &&
                        this.state.resultAlsin.length === 0 ? (
                          <Label style={{ fontWeight: 'bold' }}>-</Label>
                        ) : (
                          <Label style={{ fontWeight: 'bold' }}>
                            &nbsp;{' '}
                            {this.state.resultAlsin &&
                              this.state.resultAlsin.total_item}
                          </Label>
                        )}
                      </Col>
                    </Row>
                  </Col>
                  <Col style={{ marginBottom: 0, paddingBottom: 0 }}>
                    <Button
                      color="danger"
                      style={{
                        float: 'right',
                        marginLeft: '1%',
                      }}
                      onClick={() => (window.location.href = '/Alsin')}
                    >
                      <MdHome></MdHome>
                    </Button>
                    <Button
                      style={{
                        float: 'right',
                        width: '120px',
                        marginLeft: '1%',
                      }}
                      onClick={() => window.history.back()}
                    >
                      Kembali
                    </Button>

                    {window.location.pathname.includes('upja') && (
                      <Button
                        color="orange"
                        style={{
                          float: 'right',
                          color: 'white',
                          width: '120px',
                        }}
                        onClick={this.toggle('nested_parent_list')}
                      >
                        Detail Alsin
                      </Button>
                    )}
                  </Col>
                </Row>

                <Table responsive striped id="tableUtama">
                  <thead>
                    <tr>
                      <th>No. Reg Alsin</th>
                      <th>Deskripsi</th>
                      <th>Status</th>
                      <th>Edit</th>
                      <th>Hapus</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentTodosAlsin.length === 0 && loadingPage === true ? (
                      <LoadingSpinner status={4} />
                    ) : loadingPage === false &&
                      currentTodosAlsin.length === 0 ? (
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
                    ) : loadingPage === true &&
                      currentTodosAlsin.length !== 0 ? (
                      <LoadingSpinner status={4} />
                    ) : (
                      renderTodosAlsin
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* KHUSUS MODAL */}
        {/* Modal Delete Alsin Item*/}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_nonaktifAlsin}
          toggle={() => this.toggleDeleteData('nested_parent_nonaktifAlsin')}
          className={this.props.className}
        >
          <ModalHeader>Konfirmasi Penghapusan Data Alsin Item</ModalHeader>
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
        {/* Modal Delete Alsin Item*/}
        {/* Modal Edit Alsin Item*/}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_editAlsin}
          toggle={this.toggle('nested_parent_editAlsin')}
          className={this.props.className}
        >
          <ModalHeader>Edit Alsin Item</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label>No. Reg Alsin</Label>
                <Input
                  autoComplete="off"
                  type="text"
                  name="vechile_code"
                  placeholder="No. Reg Alsin..."
                  onChange={evt =>
                    this.updateInputValue(
                      evt.target.value,
                      evt.target.name,
                      'editAlsin',
                    )
                  }
                  value={
                    this.state.editAlsin && this.state.editAlsin.vechile_code
                  }
                />
                <Label>Deskripsi</Label>
                <Input
                  autoComplete="off"
                  type="text"
                  name="description"
                  placeholder="Deskripsi..."
                  onChange={evt =>
                    this.updateInputValue(
                      evt.target.value,
                      evt.target.name,
                      'editAlsin',
                    )
                  }
                  value={
                    this.state.editAlsin && this.state.editAlsin.description
                  }
                />
                {/* <Label>Status</Label>
                <Input
                  autoComplete="off"
                  type="text"
                  name="status"
                  placeholder="Status..."
                  onChange={evt =>
                    this.updateInputValue(
                      evt.target.value,
                      evt.target.name,
                      'editAlsin',
                    )
                  }
                  value={this.state.editAlsin && this.state.editAlsin.status}
                /> */}
                <Label>Status</Label>
                <Input
                  type="select"
                  autoComplete="off"
                  name="select"
                  color="primary"
                  style={{ marginRight: '1px' }}
                  onChange={this.setStatus}
                >
                  <option
                    value={this.state.editAlsin && this.state.editAlsin.status}
                    disabled
                    selected
                    hidden
                    id="pilih"
                  >
                    {this.state.editAlsin && this.state.editAlsin.status}
                  </option>
                  {renderStatus}
                </Input>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle('nested_editAlsin')}>
              Simpan Edit Alsin
            </Button>
            <Modal
              onExit={this.handleClose}
              isOpen={this.state.modal_nested_editAlsin}
              toggle={this.toggle('nested_editAlsin')}
            >
              <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
              <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
              <ModalFooter>
                <Button
                  id="btnEdit"
                  color="primary"
                  onClick={() => this.updateHeaderData(this.state.editAlsin)}
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
        {/* Modal Edit Alsin Item */}

        {/* Modal Detail Alsin List */}
        <Modal
          size="xl"
          onExit={this.handleCloseDomisili}
          isOpen={this.state.modal_nested_parent_detail_alsin}
          toggle={this.toggle('nested_parent_detail_alsin')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_detail_alsin')}>
            Detail Alsin
          </ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col style={{ textAlign: 'center' }}>
                  {this.state.resultAlsin[0] &&
                    this.state.resultAlsin[0].picture === null && (
                      <img
                        src={imageNotFound}
                        width="300"
                        height="180"
                        className="pr-2"
                        alt=""
                      />
                    )}
                  {this.state.resultAlsin[0] &&
                    this.state.resultAlsin[0].picture !== null && (
                      <img
                        src={
                          this.state.resultAlsin[0] &&
                          this.state.resultAlsin[0].picture
                        }
                        width="300"
                        height="180"
                        className="pr-2"
                        alt=""
                      />
                    )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col sm={4}>
                      <Label style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        Alsin
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length === 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;-
                          </Label>
                        )}
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length !== 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;
                            {this.state.resultAlsin[0] &&
                              this.state.resultAlsin[0].alsin_type_name}
                          </Label>
                        )}
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <Label style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        Harga
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length === 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;-
                          </Label>
                        )}
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length !== 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;
                            {formatter.format(
                              this.state.resultAlsin[0] &&
                                this.state.resultAlsin[0].cost,
                            )}
                          </Label>
                        )}
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <Label style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        Total Item
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length === 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;-
                          </Label>
                        )}
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length !== 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;
                            {this.state.resultAlsin[0] &&
                              this.state.resultAlsin[0].total_item}
                          </Label>
                        )}
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <Col sm={4}>
                      <Label style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        Tersedia
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length === 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;-
                          </Label>
                        )}
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length !== 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;
                            {this.state.resultAlsin[0] &&
                              this.state.resultAlsin[0].available}
                          </Label>
                        )}
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <Label style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        Tidak Tersedia
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length === 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;-
                          </Label>
                        )}
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length !== 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;
                            {this.state.resultAlsin[0] &&
                              this.state.resultAlsin[0].not_available}
                          </Label>
                        )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Table responsive striped>
              <thead>
                <tr>
                  {/* <th>Alsin ID</th> */}
                  <th>No. Reg Alsin</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentTodosAlsinItem.length === 0 &&
                loadingPageAlsin === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingPageAlsin === false &&
                  currentTodosAlsinItem.length === 0 ? (
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
                ) : loadingPageAlsin === true &&
                  currentTodosAlsinItem.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderTodosAlsinItem
                )}
              </tbody>
            </Table>
          </ModalFooter>
        </Modal>
        {/* Modal Detail Alsin List */}

        {/* Modal Detail Alsin Item List */}
        <Modal
          size="xl"
          onExit={this.handleCloseDomisili}
          isOpen={this.state.modal_nested_parent_detail_alsin_item}
          toggle={this.toggle('nested_parent_detail_alsi_itemn')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_detail_alsin_item')}>
            Detail Alsin Item
          </ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col>
                  <Row>
                    <Col sm={4}>
                      <Label style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        UPJA
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {this.state.resultDetailAlsinItem &&
                        this.state.resultDetailAlsinItem.length === 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;-
                          </Label>
                        )}
                      {this.state.resultDetailAlsinItem &&
                        this.state.resultDetailAlsinItem.length !== 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;
                            {this.state.resultDetailAlsinItem[0] &&
                              this.state.resultDetailAlsinItem[0].upja_name}
                          </Label>
                        )}
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <Label style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        Alsin
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {this.state.resultDetailAlsinItem &&
                        this.state.resultDetailAlsinItem.length === 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;-
                          </Label>
                        )}
                      {this.state.resultDetailAlsinItem &&
                        this.state.resultDetailAlsinItem.length !== 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;
                            {this.state.resultDetailAlsinItem[0] &&
                              this.state.resultDetailAlsinItem[0]
                                .alsin_type_name}
                          </Label>
                        )}
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <Col sm={4}>
                      <Label style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        No. Reg Alsin
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {this.state.resultDetailAlsinItem &&
                        this.state.resultDetailAlsinItem.length === 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;-
                          </Label>
                        )}
                      {this.state.resultDetailAlsinItem &&
                        this.state.resultDetailAlsinItem.length !== 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;
                            {this.state.resultDetailAlsinItem[0] &&
                              this.state.resultDetailAlsinItem[0].vechile_code}
                          </Label>
                        )}
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <Label style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        Status
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {this.state.resultDetailAlsinItem &&
                        this.state.resultDetailAlsinItem.length === 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp; -
                          </Label>
                        )}
                      {this.state.resultDetailAlsinItem &&
                        this.state.resultDetailAlsinItem.length !== 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;
                            {this.state.resultDetailAlsinItem[0] &&
                              this.state.resultDetailAlsinItem[0].status}
                          </Label>
                        )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>UPJA</th>
                  <th>Farmer</th>
                  <th>Biaya Transport</th>
                  <th>Total Biaya</th>
                  <th>Waktu Pesan</th>
                  <th>Waktu Kirim</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* {console.log('DETAIL ALSIN ITEMS', currentTodosDetailAlsinItem)} */}
                {currentTodosDetailAlsinItem.length === 0 &&
                loadingPageDetailAlsin === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingPageDetailAlsin === false &&
                  currentTodosDetailAlsinItem.length === 0 ? (
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
                ) : loadingPageDetailAlsin === true &&
                  currentTodosDetailAlsinItem.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderTodosDetailAlsinItem
                )}
              </tbody>
            </Table>
          </ModalFooter>
        </Modal>
        {/* Modal Detail Alsin Item List */}

        {/* Modal Transaction */}
        <Modal
          onExit={this.handleCloseDomisili}
          isOpen={this.state.modal_nested_parent_list_transaksi}
          toggle={this.toggle('nested_parent_list_transaksi')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_list_transaksi')}>
            List Transaksi
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Alsin</th>
                  <th>Total Alsin</th>
                </tr>
              </thead>
              <tbody>
                {currentTodosTransaction.length === 0 &&
                loadingPageTransaction === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingPageTransaction === false &&
                  currentTodosTransaction.length === 0 ? (
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
                ) : loadingPageTransaction === true &&
                  currentTodosTransaction.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderTodosTransaction
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal Transaction */}

        {/* Modal Transaction Alsin Item */}
        <Modal
          onExit={this.handleCloseDomisili}
          isOpen={this.state.modal_nested_parent_list_transaksi_alsinItem}
          toggle={this.toggle('nested_parent_list_transaksi_alsinItem')}
          className={this.props.className}
        >
          <ModalHeader
            toggle={this.toggle('nested_parent_list_transaksi_alsinItem')}
          >
            List Transaksi Item
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>No. Reg Alsin</th>
                  <th>Harga</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentTodosTransactionAlsinItem.length === 0 &&
                loadingPageTransactionAlsinItem === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingPageTransactionAlsinItem === false &&
                  currentTodosTransactionAlsinItem.length === 0 ? (
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
                ) : loadingPageTransactionAlsinItem === true &&
                  currentTodosTransactionAlsinItem.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderTodosTransactionAlsinItem
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal Transaction Alsin Item*/}

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
                {kecamatanTodos.length === 0 && loadingPage === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingPage === false && kecamatanTodos.length === 0 ? (
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
                ) : loadingPage === true && kecamatanTodos.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  <Label>ADA KECAMATAN</Label>
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal List Kecamatan */}
        {/* KHUSUS MODAL */}
      </Page>
    );
  }

  canBeSubmittedDomisili() {
    const { pilihProvinsi, pilihKotaKab, pilihKecamatan } = this.state;
    return pilihProvinsi !== '' && pilihKotaKab !== '' && pilihKecamatan !== '';
  }

  updateSearchValue(evt) {
    this.setState({
      keyword: evt.target.value,
    });
  }
}
export default AlsinDetail;
