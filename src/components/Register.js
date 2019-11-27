import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom';

class Register extends Component {
    
    nameRef = React.createRef();
    emailRef = React.createRef();
    passwordRef = React.createRef();
    passwordConfRef = React.createRef();
    constructor(){
        super()
        this.state = {
            user: {
                name: "",
                email: "",
                password: ""
            },
            passwordConfirm: '',
            status: null,
        };
    }


    setChange = () => {
		this.setState({
			user: {
				name: this.nameRef.current.value,
				email: this.emailRef.current.value,
				password: this.passwordRef.current.value
            },
            passwordConfirm:this.passwordConfRef.current.value
		});
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            const formData = this.state.user;
            if (value !== formData.password) {
                return false;
            }
            return true;
        });
    }
    
    send = (e) => {
		e.preventDefault();
        this.setChange();
        
		axios.post(
			'http://localhost:3900/api/user',
			this.state.user
		).then(res => {
			if (res.data.status === 'success') {
                swal('Exito!!',  res.data.message, 'success');
				this.setState({
					status: 'success'
                });
			} else {
				this.setState({
                    status: 'failed'
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
						<h1>Crea tu cuenta aqui</h1>
						<ValidatorForm noValidate autoComplete="off" onSubmit={this.send} debounceTime={1500}>
							<div>
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<TextValidator
											required
											id="standard-required-name"
											label="Nombre"
                                            margin="normal"
                                            placeholder='el nombre con el que se publicaran tus recetas'
											inputRef={this.nameRef}
											fullWidth
											onChange={this.setChange}
											value={this.state.user.name}
											validators={['required']}
											errorMessages={['esta informacion es requerida']}
											variant="outlined"
										/>
									</Grid>
									<Grid item xs={12}>
										<TextValidator
											required
											id="standard-required-email"
											label="correo"
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
										<TextValidator
                                            required
											id="standard-required-passwordConfirm"
											label="confirma password"
											placeholder='(confirma tu contrasena que sea igual a la anterior)'
											margin="normal"
											inputRef={this.passwordConfRef}
                                            fullWidth
                                            type='password'
                                            onChange={this.setChange}
                                            value={this.state.passwordConfirm}
											validators={['isPasswordMatch', 'required']}
                                            errorMessages={['las contrasenas deben ser iguales', 'Campo requerido']}
											variant="outlined"
										/>
									</Grid>
									<Grid item xs={12} className="buttonForm">
										<Button type="submit" variant="contained" color="primary">
											Registrar
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

export default Register;