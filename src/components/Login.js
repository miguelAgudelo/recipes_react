import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import url from '../ApiUrl';
class Login extends Component {
    
    emailRef = React.createRef();
    passwordRef = React.createRef();

    constructor(props){
        super(props)
        this.state = {
            user: {
                email: "",
                password: ""
            },
            status: null,
        };
    }


    setChange = () => {
		this.setState({
			user: {
				email: this.emailRef.current.value,
				password: this.passwordRef.current.value
            },
		});
    }
    
    send = (e) => {
		e.preventDefault();
        this.setChange();
        
		axios.post(
			url+'auth',
			this.state.user
		).then(res => {
			if (res.data.status === 'success') {
                swal('Exito!!',  res.data.message, 'success');
                localStorage.setItem("UserInfo", JSON.stringify(res.data.userInfo));
				this.setState({
					status: 'success'
				});
				this.props.handleLogin(true);
			} else {
				this.setState({
                    status: 'fail'
                });
                swal('Ups!!', res.data.message, 'error');
			}
		});
	}

    render() {
		if (this.state.status === 'success') {
			return <Redirect to='/home' />;
		} else {
		    return (
				<React.Fragment>
					<div className="formContainer">
						<h1>Ingresa Aqui</h1>
						<ValidatorForm noValidate autoComplete="off" onSubmit={this.send} debounceTime={1500}>
							<div>
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<TextValidator
											required
											id="standard-required-email"
											label=" tu correo"
											placeholder='usa un email cualquiera esto es solo un ejemplo'
											margin="normal"
											inputRef={this.emailRef}
											fullWidth
											onChange={this.setChange}
											value={this.state.user.email}
											validators={['required','isEmail']}
											errorMessages={['esta informacion es requerida y debe parecerse a un emal: example@example.com']}
											variant="outlined"
										/>
									</Grid>
									<Grid item xs={12}>
										<TextValidator
                                            required
											id="standard-required-password"
											label="password"
											margin="normal"
											inputRef={this.passwordRef}
                                            fullWidth
                                            type='password'
                                            onChange={this.setChange}
                                            value={this.state.user.password}
											validators={['required']}
											errorMessages={['porfavor usa una contrasena simple de 8 o mas caracteres']}
											variant="outlined"
										/>
									</Grid>
                                    <Grid item xs={12}>
                                        <Typography>
                                            <Link to={"/register"} onClick={e => e.preventDefault} className="link">
                                                Registrar me!
                                            </Link>
                                        </Typography>
									</Grid>
									<Grid item xs={12} className="buttonLogin">
                                        <Button variant="contained">
                                            <Link to={"/home"} onClick={e => e.preventDefault}>
                                                Ver Recetas
                                            </Link>
                                        </Button>
										<Button type="submit" variant="contained" color="primary">
											Ingresar
										</Button>
									</Grid>
								</Grid>
							</div>
						</ValidatorForm>
					</div>
				</React.Fragment>
			);
		}
	}
}

export default Login;