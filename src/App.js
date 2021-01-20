import { STATE_FORGETPASS, STATE_LOGIN } from 'components/AuthForm';
import GAListener from 'components/GAListener';
import { EmptyLayout, LayoutRoute, MainLayout } from 'components/Layout';
import PrivateRoute from 'components/Layout/PrivateRoute';
import PageSpinner from 'components/PageSpinner';
import Registrasi from 'pages/Registrasi';
import Verifikasi from 'pages/Verifikasi';
import AuthPage from 'pages/template/AuthPage';
import React from 'react';
import componentQueries from 'react-component-queries';
import { BrowserRouter, Redirect, Switch, Route } from 'react-router-dom';
import './styles/reduction.scss';
import * as firebase from 'firebase/app';
const firebaseConfig = {
  apiKey: 'AIzaSyDcFIDIdLSPUTGFiKvAq59ZMkwa_ldf3Mw',
  authDomain: 'alsintanlinkupja.firebaseapp.com',
  projectId: 'alsintanlinkupja',
  storageBucket: 'alsintanlinkupja.appspot.com',
  messagingSenderId: '1042721526157',
  appId: '1:1042721526157:web:959ff6579d5f6ad1416dc4',
  measurementId: 'G-5XPEMS1LLR',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const Dashboard = React.lazy(() => import('pages/template/DashboardPage'));
const profileUPJA = React.lazy(() => import('pages/UPJA/Profile'));
const alsinUPJA = React.lazy(() => import('pages/UPJA/Alsin'));
const alsinUPJADetail = React.lazy(() => import('pages/UPJA/AlsinDetail'));

const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};

class App extends React.Component {
  state = {
    title: '',
    color: '',
    menuID: '',
    reqData: [],
  };

  setTitle = (title, color) => {
    this.setState({ title: title, color: color });
  };

  passData = (type, data) => {
    var tempArr = this.state.reqData;
    if (type === 'SPManual') {
      var newObj = {
        selectedTipeLaporan: data.selectedTipeLaporan,
        selectedJenisLaporan: data.selectedJenisLaporan,
        inputDate: data.inputDate,
        spNotPrintChecked: data.spNotPrintChecked,
        notFound: data.notFound,
        hasilSP: data.hasilSP,
      };
      tempArr.push(newObj);
      this.setState({
        reqData: tempArr,
      });
    }
    if (type === 'clear') {
      this.setState({
        reqData: [],
      });
    }
  };

  getAccess() {
    var accessList = JSON.parse(window.localStorage.getItem('accessList'));
    if (accessList !== null && accessList !== undefined) {
      // console.log('MENU ID MASUK 1');
      if (Object.keys(accessList).includes('18')) {
        // console.log('MENU ID 18');
        this.setState({ menuID: '18' });
      } else if (Object.keys(accessList).includes('5')) {
        // console.log('MENU ID 5');
        this.setState({ menuID: '5' });
      } else if (Object.keys(accessList).includes('3')) {
        // console.log('MENU ID 3');
        this.setState({ menuID: '3' });
      } else {
        // console.log('MENU ID MASUK 2');
        return;
      }
    }
    // console.log('MENU ID MASUK 3');
    // return;
  }

  componentDidMount() {
    this.getAccess();
  }

  render() {
    return (
      <BrowserRouter basename={getBasename()}>
        <GAListener>
          <Switch>
            <LayoutRoute
              exact
              path="/login"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_LOGIN} />
              )}
            />
            <LayoutRoute
              exact
              path="/lupapassword"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_FORGETPASS} />
              )}
            />

            <Route
              exact
              path="/registrasi"
              layout={EmptyLayout}
              component={props => <Registrasi {...props} />}
            />
            <Route
              exact
              path="/verifikasi"
              layout={EmptyLayout}
              component={props => <Verifikasi {...props} />}
            />
            {/* {console.log('ISI MENU ID: ', this.state.menuID)} */}

            <MainLayout
              breakpoint={this.props.breakpoint}
              title={this.state.title}
              color={this.state.color}
            >
              <React.Suspense fallback={<PageSpinner />}>
                <Route exact path="/profile" component={profileUPJA} />
                <Route exact path="/Alsin" component={alsinUPJA} />
                <Route
                  exact
                  path="/Alsin/detail/:alsin_type_id"
                  component={alsinUPJADetail}
                />
                <Route
                  exact
                  path="/"
                  layout={EmptyLayout}
                  component={Dashboard}
                />
              </React.Suspense>
            </MainLayout>
            <Redirect to="/" />
          </Switch>
        </GAListener>
      </BrowserRouter>
    );
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

export default componentQueries(query)(App);
