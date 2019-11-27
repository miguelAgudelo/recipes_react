import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import swal from 'sweetalert';
import { Redirect } from 'react-router-dom';
import Ingredient from './Ingredient';
import Instruccion from './Instruccion';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Divider from '@material-ui/core/Divider';


class RecipeUpdate extends Component {
    nameRef = React.createRef();
    descriptionRef = React.createRef();
    noteRef = React.createRef();
    recipeId = null;
    handleInstr = this.handleInstr.bind(this);
	handleIngr = this.handleIngr.bind(this);

    constructor(props) {
        super(props)
        this.state = {
			recipe: {
				name: "",
				description: "",
				note: "",
				instruccions: [],
				ingredients: [],
			},
			instruccions: [],
			ingredients:[],
			status: null,
			selectedFile: null
		};
        this.recipeId = this.props.match.params.id;
        const sessionData = this.getUserInfo()
		axios.get('http://localhost:3900/api/verify',{ headers: {'access-token': sessionData.token} })
            .then((res) => {
                if(res.data.message !== 'pass'){
                    this.setState({
                        status: 'noautorize'
					})
					swal('Restringido!!', 'debes iniciar session primero', 'error');
				}
				
            })
        this.getRecipe(this.recipeId);
    }
    getRecipe = (id) => {
        axios.get('http://localhost:3900/api/recipe/' + id)
            .then((res) => {
                this.setState({
                    recipe: res.data.recipe,
                    status: 'load'
                });
                let ingr = this.state.recipe.ingredients;
                for (let c of ingr) {
                    this.reIngredient(c);
                }
                let inst = this.state.recipe.instruccions;
                for (let i of inst) {
                    this.reInstruction(i);
                }
                this.setChange();
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

    reInstruction = (t = "") => {
        const n = this.state.instruccions.length + 1;
		const i = "instruccionN" + n;
		const o = { id: i, text: t}
		const inst = this.state.instruccions
		inst.push(o);
		this.setState({
			instruccions: inst
		})
    }
    reIngredient = (c = {}) => {
        let n = this.state.ingredients.length + 1;
		let i = "ingredientN" + n;
		let o = { id: i, ingredient: c }
		const ingr = this.state.ingredients
		ingr.push(o);
		this.setState({
			ingredients: ingr
		})
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
        const sessionData = this.getUserInfo()
        const dataSend = this.state.recipe
        axios.put(
            'http://localhost:3900/api/save/' + this.recipeId,
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
                        'http://localhost:3900/api/upload-image/' + recipeId,
                        formData,
                        { headers: {'access-token': sessionData.token} }
                    ).then(res => {
                        if (res.data.recipe) {
                            this.setState({
                                recipe: res.data.recipe,
                                status: 'success'
                            });
                        } else {
                            this.setState({
                                recipe: res.data.recipe,
                                status: 'fail'
                            });
                        }
                        swal('Exito!!', 'se ah editado su receta', 'success');
                    });
                } else {
                    this.setState({
                        recipe: res.data.recipe,
                        status: 'success'
                    });
                    swal('Exito!!', 'se ah editado su receta', 'success');
                }
            } else {
                this.setState({
                    status: 'failed'
                });
            }
        });

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
        if (this.state.status === 'success') {
            return (<Redirect to='/' />);
        }
        if (this.state.status === 'load') {
            let deleteButtonIngr = null;
            let deleteButtonInst = null;
            if(this.state.ingredients.length > 1)
				deleteButtonIngr = <Button type="button" variant="contained" color="secondary" onClick={this.deleteIngredient}>delete</Button>
			if(this.state.instruccions.length > 0)
				deleteButtonInst = <Button type="button" variant="contained" color="secondary" onClick={this.deleteInstruction}>delete</Button>
			return (
                <React.Fragment>
                    <ValidatorForm ref="form" noValidate autoComplete="off" onSubmit={this.send} debounceTime={1500}>
                        <div className="formContainer">
                            <h1>Edita tu coctel</h1>
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
                                {this.state.ingredients.map((ingredient) => (
                                    <Ingredient
                                        handleIngr={this.handleIngr}
                                        key={ingredient.id}
                                        i={ingredient}
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
                                <Divider variant="middle" />
                                <Grid item xs={12}>
                                    <TextField
                                        id="standard"
                                        label="Nota"
                                        placeholder='(opcional)'
                                        margin="normal"
                                        multiline
          								rowsMax="4"
                                        defaultValue={this.state.recipe.note}
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
                                        //multiple
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
                </React.Fragment>
            );
        } else {
            return (
                <div>
                    <h2>Cargando</h2>
                    <p>esto no deberia tardar mucho...</p>
                </div>
            );
        }

    }
}

export default RecipeUpdate;