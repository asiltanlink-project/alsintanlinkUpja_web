import logo200Image from 'assets/img/logo/logo.png';
import sidebarBgImage from 'assets/img/sidebar/sidebarSawah.jpg';
import SourceLink from 'components/SourceLink';
import React from 'react';
import {
  MdFormatListBulleted,
  MdKeyboardArrowDown,
  MdHdrStrong,
  MdRadioButtonChecked,
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import {
  Collapse,
  Nav,
  Navbar,
  NavItem,
  NavLink as BSNavLink,
} from 'reactstrap';
import bn from 'utils/bemnames';

var accessList = {};

const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

const alsintanlink = [
  {
    to: '/profile',
    id: '5',
    name: 'Profile',
    exact: false,
    Icon: MdHdrStrong,
  },
  {
    to: '/alsin',
    id: '5',
    name: 'Alsin',
    exact: false,
    Icon: MdHdrStrong,
  },
];

const Pelapak = [
  {
    to: '/OrderMalamIni',
    id: '5',
    name: 'L1. Order Pelapak Malam Ini',
    exact: false,
    Icon: MdHdrStrong,
  },
  {
    to: '/OrderBesokPagi',
    id: '5',
    name: 'L2. Order Pelapak Besok Pagi',
    exact: false,
    Icon: MdHdrStrong,
  },
  {
    to: '/OrderBesokSore',
    id: '5',
    name: 'L3. Order Pelapak Besok Sore',
    exact: false,
    Icon: MdHdrStrong,
  },
  {
    to: '/Pesanan2',
    id: '5',
    name: 'L4. Order Pelapak Kejar On Time',
    exact: false,
    Icon: MdHdrStrong,
  },
  {
    to: '/Pesanan1',
    id: '5',
    name: 'L5. Order Pelapak Kejar Tidak Cancel',
    exact: false,
    Icon: MdHdrStrong,
  },
  {
    to: '/OrderMalamIninAPI',
    id: '5',
    name: 'L6. Order Pelapak Non API Malam Ini',
    exact: false,
    Icon: MdHdrStrong,
  },
  {
    to: '/OrderBesokPaginAPI',
    id: '5',
    name: 'L7. Order Pelapak Non API Besok Pagi',
    exact: false,
    Icon: MdHdrStrong,
  },
  {
    to: '/OrderBesokSorenAPI',
    id: '5',
    name: 'L8. Order Pelapak Non API Besok Sore',
    exact: false,
    Icon: MdHdrStrong,
  },
  {
    to: '/OrderPageBelumJadiSP',
    id: '5',
    name: 'L9. Order Pelapak Yang Belum Jadi SP Lebih Dari 1 Jam',
    exact: false,
    Icon: MdHdrStrong,
  },
];

const navB2B = [
  {
    to: '/OrderB2BTerlambat',
    id: '5',
    name: 'P1. Order B2B Terlambat',
    exact: false,
    Icon: MdHdrStrong,
  },
  {
    to: '/OrderB2B',
    id: '5',
    name: 'P2. Order B2B Malam Ini',
    exact: false,
    Icon: MdHdrStrong,
  },
  {
    to: '/OrderB2BBesokPagi',
    id: '5',
    name: 'P3. Order B2B Besok Pagi',
    exact: false,
    Icon: MdHdrStrong,
  },
  {
    to: '/OrderB2BBesokSore',
    id: '5',
    name: 'P4. Order B2B Besok Sore',
    exact: false,
    Icon: MdHdrStrong,
  },
  {
    to: '/OrderB2BKejarOnTime',
    id: '5',
    name: 'P5. Order B2B Kejar On Time',
    exact: false,
    Icon: MdHdrStrong,
  },
];

const navItems2 = [
  { to: '/OrderPelapak', id: '5', name: 'Order Dr.Ship', exact: false },
  {
    to: '/DetailProduct',
    id: '5',
    name: 'Detail Product Kurang Stock',
    exact: false,
  },
  {
    to: '/SummaryProduct',
    id: '5',
    name: 'Summary Product Kurang Stock',
    exact: false,
  },
  {
    to: '/KekuranganSlongsong',
    id: '5',
    name: 'Kekurangan Slongsong',
    exact: false,
  },
  {
    to: '/KelebihanSlongsong',
    id: '5',
    name: 'Kelebihan Slongsong',
    exact: false,
  },
  // { to: '/CetakResi', id: '5', name: 'Cetak Resi', exact: false },
];

const navReceiving = [
  {
    to: '/receivingFloor',
    id: '18',
    name: 'Receiving Floor',
    exact: false,
    Icon: MdHdrStrong,
  },
  {
    to: '/receivingApotek',
    id: '18',
    name: 'Receiving Apotek',
    exact: false,
    Icon: MdHdrStrong,
  },
];

const navStock = [
  {
    to: '/headerstock',
    id: '19',
    name: 'Stock',
    exact: false,
    Icon: MdHdrStrong,
  },
];

const navTN = [
  {
    to: '/ReturToGudang',
    id: '20',
    name: 'Transfer IN',
    exact: false,
    Icon: MdHdrStrong,
  },
];

const navMasterDataSPAddHO = [
  {
    to: '/spaddho',
    id: '23',
    name: 'SP Add HO',
    exact: false,
    Icon: MdRadioButtonChecked,
  },
];

const spdoGroup = [
  { to: '/spdo', id: '22', name: 'SP DO', exact: false, Icon: MdHdrStrong },
];

const laporanSP = [
  {
    to: '/laporansphome',
    id: '23',
    name: 'Laporan SP Home',
    exact: false,
    Icon: MdRadioButtonChecked,
  },
];

const EkspedisiExternal = [
  {
    to: '/Ekspedisi-Integra',
    id: '5',
    name: 'Ekspedisi-Integra',
    exact: false,
    Icon: MdHdrStrong,
  },
];

const bem = bn.create('sidebar');

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    if (window.localStorage.getItem('accessList')) {
      accessList = JSON.parse(window.localStorage.getItem('accessList'));
    }
  }

  state = {
    isOpenAlsintanlinkAdmin: false,
    isOpenPelapak: false,
    isOpenMasterB2B: false,
    isOpenReceiving: false,
    isOpenStock: false,
    isOpenExternal: true,
    isOpenMasterSPAddHO: false,
    isOpenEkspedisiExternal: false,
  };

  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];
      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
  };

  //added by Master I team at 11/10/2019
  refreshSamePage = (currPath, toPath) => () => {
    var temporary = 'http://localhost:3000' + toPath;
    //console.log(currPath + " " + temporary);
    if (currPath === temporary) {
      window.location.reload(false);
    }
  };

  allFound = master => {
    return master.some(menu => Object.keys(accessList).includes(menu.id));
  };

  handleSidebarControlButton = event => {
    // event.preventDefault();
    event.stopPropagation();

    document.querySelector('.cr-sidebar').classList.toggle('cr-sidebar--open');
  };

  render() {
    return (
      <aside className={bem.b()} data-image={sidebarBgImage}>
        <div className={bem.e('background')} style={sidebarBackground} />
        <div className={bem.e('content')}>
          <Navbar>
            <SourceLink className="navbar-brand d-flex">
              <img
                src={logo200Image}
                width="200"
                height="50"
                className="pr-2"
                alt=""
              />
            </SourceLink>
          </Navbar>

          <Nav vertical>
            {alsintanlink &&
              alsintanlink.map(({ to, name, exact }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                    onClick={this.handleSidebarControlButton}
                  >
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
          </Nav>
        </div>
      </aside>
    );
  }
}

export default Sidebar;
