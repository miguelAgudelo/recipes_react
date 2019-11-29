import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom';
import Ingredient from './Ingredient';
import Instruccion from './Instruccion';
import Divider from '@material-ui/core/Divider';
import url from '../ApiUrl';

class RecipeSave extends Component {
	nameRef = React.createRef();
	descriptionRef = React.createRef();
	noteRef = React.createRef();
	handleInstr = this.handleInstr.bind(this);
	handleIngr = this.handleIngr.bind(this);
	constructor(){
		super();
		this.state = {
			recipe: {
				name: "",
				description: "",
				note: "",
				instruccions: [],
				ingredients: [],
			},
			instruccions: [],
			ingredients:[{ id: "instruccionN1", ingredient: { name: '', medida: '', cant: '' } }],
			status: null,
			selectedFile: null
		};
	}
	UNSAFE_componentWillMount() {
		const sessionData = this.getUserInfo()
		if(sessionData === null){
			this.setState({
				status: 'noautorize'
			})
		}else{
			axios.get(url+'verify',{ headers: {'access-token': sessionData.token} })
            .then((res) => {
                if(res.data.message !== 'pass'){
                    this.setState({
                        status: 'noautorize'
					})
					swal('Restringido!!', 'debes iniciar session primero', 'error');
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
	send = (e) => {
		e.preventDefault();
		this.setChange();
		const sessionData = this.getUserInfo();
		const dataSend = {user: sessionData.token,recipe:this.state.recipe}
		axios.post(
			url+'save',
			dataSend,
			{ headers: {'Content-Type':'application/json','access-token': sessionData.token} }
		).then(res => {
			if (res.data.recipe) {
				this.setState({
					recipe: res.data.recipe,
					status: 'wait'
				});
				if (this.state.selectedFile !== null) {
					let recipeId = this.state.recipe._id;
					const formData = new FormData();
					formData.append('file0', this.state.selectedFile, this.state.selectedFile.name);
					axios.post(
						url+'upload-image/' + recipeId,
						formData,
						{ headers: {'access-token': sessionData.token} }
					).then(res => {
						swal('Exito!!', 'se ah guardado su receta', 'success');
						if (res.data.recipe) {
							this.setState({
								status: 'success'
							});
						} else {
							this.setState({
								status: 'fail'
							});
						}
						
					});
				} else {
					swal('Exito!!', 'se ah guardado su receta', 'success');
					this.setState({
						recipe: res.data.recipe,
						status: 'success'
					});
				}
			} else {
				swal('Ups!!', res.data.message, 'error');
				this.setState({
					status: 'failed'
				});
			}
		});

	}

	addInstruction = () => {
		const n = this.state.instruccions.length + 1;
		const i = "instruccionN" + n;
		const o = { id: i, text: "" }
		const inst = this.state.instruccions
		inst.push(o);
		this.setState({
			instruccions: inst
		})
		this.setChange();
	}

	deleteInstruction = () => {
		const instr = this.state.instruccions
		instr.pop();
		this.setState({
			instruccions: instr
		})
		this.setChange();
	}

	addIngredient = () => {
		let n = this.state.ingredients.length + 1;
		let i = "ingredientN" + n;
		let o = { id: i, ingredient: { name: '', medida: '', cant: '' } }
		const ingr = this.state.ingredients
		ingr.push(o);
		this.setState({
			ingredients: ingr
		})
		this.setChange();
	}

	deleteIngredient = () => {
		if(this.state.ingredients.length > 1){
			const ingr = this.state.ingredients
			ingr.pop();
			this.setState({
				ingredients: ingr
			})
			this.setChange();
		}
	}

	handleInstr(_State) {
		let i = this.state.instruccions;
		i.forEach((i) => {i.text = (i.id === _State.id) ? _State.text : i.text});
		this.setState({
			instruccions: i
		})
		this.setChange();
	}

	handleIngr(_State) {
		let c = this.state.ingredients;
		c.forEach((i) => {i.ingredient = (i.id === _State.id) ? _State.ingredient : i.ingredient});
		this.setState({
			ingredients: c
		})
		this.setChange();
	}

	setChange = () => {
		const instr = this.state.instruccions.map(value => value.text);
		const ingr = this.state.ingredients.map(value => value.ingredient);
		this.setState({
			recipe: {
				name: this.nameRef.current.value,
				description: this.descriptionRef.current.value,
				note: this.noteRef.current.value,
				instruccions: instr,
				ingredients: ingr,
			}
		});
	}

	fileChange = (e) => {

		this.setState({
			selectedFile: e.target.files[0]
		});
	}

	render() {
		if (this.state.status === 'success' || this.state.status === 'noautorize') {
			return <Redirect to='/home' />;
		} else {
			let deleteButtonIngr = null;
			let deleteButtonInst = null;
			if(this.state.ingredients.length > 1)
				deleteButtonIngr = <Button type="button" variant="contained" color="secondary" onClick={this.deleteIngredient}>delete</Button>
			if(this.state.instruccions.length > 0)
				deleteButtonInst = <Button type="button" variant="contained" color="secondary" onClick={this.deleteInstruction}>delete</Button>
			return (
				<React.Fragment>
					<div className="formContainer">
						<h1>Ingreso de un nuevo coctel</h1>
						<ValidatorForm noValidate autoComplete="off" onSubmit={this.send} debounceTime={1500}>
							<div>
								<Grid container spacing={3}>
									<Grid item xs={12}>
										<TextValidator
											required
											id="standard-required"
											label="Nombre del cocktail"
											margin="normal"
											inputRef={this.nameRef}
											fullWidth
											onChange={this.setChange}
											value={this.state.recipe.name}
											validators={['required']}
											errorMessages={['esta informacion es requerida']}
											variant="outlined"
										/>
									</Grid>
									<Grid item xs={12}>
										<TextValidator
											required
											id="standard-required"
											label="descripcion"
											placeholder='historia, decripcion o lo que quieras decir de tu cocktail'
											margin="normal"
											multiline
          									rowsMax="6"
											inputRef={this.descriptionRef}
											fullWidth
											onChange={this.setChange}
											value={this.state.recipe.description}
											validators={['required']}
											errorMessages={['esta informacion es requerida']}
											variant="outlined"
										/>
									</Grid>
									<Divider variant="middle" />
									{this.state.ingredients.map((value) => (
										<Ingredient
											key={value.id}
											i={value}
											handleIngr={this.handleIngr}
										/>
									))}
									<Grid item xs={12} className="buttonForm">
										{deleteButtonIngr}
										<Button type="button" variant="contained" color="primary" onClick={this.addIngredient}>
											Add Ingredient
										</Button>
									</Grid>
									<Divider variant="middle" />
									{this.state.instruccions.map((instruccion) => (
										<Instruccion
											handleInstr={this.handleInstr}
											key={instruccion.id}
											i={instruccion}
										/>
									))}
									<Grid item xs={12} className="buttonForm">
										{deleteButtonInst}
										<Button type="button" variant="contained" color="primary" onClick={this.addInstruction}>
											Add Instruction
										</Button>
									</Grid>
									<Divider variant="middle" align="center"/>
									<Grid item xs={12}>
										<TextField
											id="standard"
											label="Nota"
											placeholder='(opcional)'
											margin="normal"
											multiline
          									rowsMax="4"
											inputRef={this.noteRef}
											fullWidth
											onChange={this.setChange}
											variant="outlined"
										/>
									</Grid>
									<Grid item xs={12} className="buttonForm">
										<input
											accept="image/*"
											style={{ display: 'none' }}
											id="raised-button-file"
											multiple
											type="file"
											name="file0"
											onChange={this.fileChange}
										/>
										<label htmlFor="raised-button-file">
											<Button variant="contained" component="span" color="secondary">Upload</Button>
										</label>
										<Button type="submit" variant="contained" color="primary">
											Guardar
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

export default RecipeSave;