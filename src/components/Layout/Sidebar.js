import logo200Image from 'assets/img/logo/logo.png';
import sidebarBgImage from 'assets/img/sidebar/sidebarSawah.jpg';
import SourceLink from 'components/SourceLink';
import React from 'react';
import { MdHdrStrong } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { Nav, Navbar, NavItem, NavLink as BSNavLink } from 'reactstrap';
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

const bem = bn.create('sidebar');

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    if (window.localStorage.getItem('accessList')) {
      accessList = JSON.parse(window.localStorage.getItem('accessList'));
    }
  }

  state = {
    isOpenAlsintanlink: false,
  };

  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];
      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
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
