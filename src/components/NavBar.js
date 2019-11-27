import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AddIcon from '@material-ui/icons/Add';
import LocalBarIcon from '@material-ui/icons/LocalBar';
export default function NavBar(props) {
  const matches = useMediaQuery('(min-width:530px)');
  //const [token, setToken] = useState(0);
  
  /* const getUserInfo = () => {
    const UserInfo = JSON.parse(localStorage.getItem('UserInfo'));

    if (UserInfo) {
      return UserInfo.token;
    } else {
      return null;
    }
  }
  setToken(token = getUserInfo()) */
  const logout = () => {
    localStorage.removeItem("UserInfo");
    //setToken(token = getUserInfo())
    props.handleLogin(false);
  }


  let navItems = null;
  if (!props.log) {
    navItems = <div className="navItems">
      <Typography variant="h6">
        <NavLink to={'/login'} activeClassName="App-link">Iniciar session</NavLink>
      </Typography>
    </div>
  } else if (matches) {
    navItems = <div className="navItems">
      <Typography variant="h6">
        <NavLink to={'/my-recipe'} activeClassName="App-link">Mis Cocteles</NavLink>
      </Typography>
      <Typography variant="h6">
        <NavLink to={'/create'} activeClassName="App-link">Agregar</NavLink>
      </Typography>
      <Typography variant="h6">
        <NavLink to={'/login'} activeClassName="App-link" onClick={logout}>Salir session</NavLink>
      </Typography>
    </div>
  }else {
    navItems = <div className="navItems">

        <NavLink to={'/my-recipe'} activeClassName="App-link"><LocalBarIcon /></NavLink>


        <NavLink to={'/create'} activeClassName="App-link"><AddIcon/></NavLink>


        <NavLink to={'/login'} activeClassName="App-link" onClick={logout}><ExitToAppIcon/></NavLink>

    </div>
  }
  return (
    <AppBar position="static">
      <Toolbar>
        <div>
          <Typography variant="h5">
            <NavLink to={'/home'} activeClassName="App-link">HOME</NavLink>
          </Typography>
        </div>
        {navItems}
      </Toolbar>
    </AppBar>
  );


}
