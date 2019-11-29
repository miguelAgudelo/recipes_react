import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import NavBar from './components/NavBar'
import RecipeList from './components/RecipeList';
import MisRecipe from './components/MisRecipe'
import RecipeSave from './components/RecipeSave';
import RecipeUpdate from './components/RecipeUpdate';
import RecipeView from './components/RecipeView';
import Register from './components/Register'
import Login from './components/Login'
import Error from './components/Error';
import axios from 'axios';
import url from './ApiUrl';
class Router extends Component {
    handleLogin = this.handleLogin.bind(this);
    constructor() {
        super();
        this.state= {
            isLoget : false
        }
            
    }
    UNSAFE_componentWillMount() {
        const sessionData = this.getUserInfo()
        if(sessionData === null){
			this.setState({
                isLoget : false
            })
		}else{
			axios.get(url+'verify',{ headers: {'access-token': sessionData.token} })
            .then((res) => {
                if(res.data.message !== 'pass'){
                    this.setState({
                        isLoget : false
                    })
                }else{
                    this.setState({
                        isLoget : true
                    })
                }
            })
		}
		
    }
    getUserInfo = () => {
		const UserInfo = JSON.parse(localStorage.getItem('UserInfo'));
		if(UserInfo){
			return UserInfo;
		}else{
			return null;
		}
	}
    handleLogin(response) {
        this.setState({
            isLoget : response
        })
    }
    render() {
        return (
            <BrowserRouter>
                <NavBar log={this.state.isLoget} handleLogin={this.handleLogin}/>
                <CssBaseline />
                <Container>
                    <Switch>
                        <Route exact path="/" render={(props) => <RecipeList {...props} log={this.state.isLoget}/>} />
                        <Route exact path="/home" render={(props) => <RecipeList {...props} log={this.state.isLoget}/>} />
                        <Route exact path="/my-recipe" render={(props) => <MisRecipe {...props} log={this.state.isLoget}/>} />
                        <Route exact path="/login" render={(props) => <Login {...props} handleLogin={this.handleLogin} />} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/create" component={RecipeSave} />
                        <Route exact path="/edit/:id" component={RecipeUpdate} />
                        <Route exact path="/view/:id" component={RecipeView} />
                        <Route component={Error}/>
                    </Switch>
                </Container>
            </BrowserRouter>
        );
    }

}

export default Router;