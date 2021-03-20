import logo200Image from 'assets/img/logo/logo.png';
import sidebarBgImage from 'assets/img/sidebar/sidebarSawah.jpg';
import SourceLink from 'components/SourceLink';
import React from 'react';
import { MdHdrStrong } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { Button, Nav, Navbar, NavItem, NavLink as BSNavLink } from 'reactstrap';
import bn from 'utils/bemnames';

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
  {
    to: '/transaksi',
    id: '5',
    name: 'Transaksi',
    exact: false,
    Icon: MdHdrStrong,
  },
  {
    to: '/sparePart',
    id: '5',
    name: 'Suku Cadang',
    exact: false,
    Icon: MdHdrStrong,
  },
];

const bem = bn.create('sidebar');

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    isOpenAlsintanlink: false,
  };

  handleSidebarControlButton = event => {
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
              alsintanlink.map(({ to, name, exact, Icon }, index) => (
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
                    <Icon className={bem.e('nav-item-icon')} />
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
