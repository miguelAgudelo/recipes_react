import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid'
import { TextValidator,ValidatorForm } from 'react-material-ui-form-validator';

class Ingredient extends Component {
    nameRef = React.createRef()
    medidaRef = React.createRef()
    cantRef = React.createRef()
    constructor(props){
        super(props)
        this.state = {
            id: this.props.i.id,
            ingredient: {
                            name: this.props.i.ingredient.name,
                            medida: this.props.i.ingredient.medida,
                            cant: this.props.i.ingredient.cant
                        }
        };
        ValidatorForm.addValidationRule('isNumberOrFraction', (value) => {
            const patron = /[0-9]+$|[0-9]+[/]+[0-9]+$|[0-9]+[,.]+[0-9]+$/;
            return patron.test(value);
        });
    }
    
    
    setChange = () => {
        this.setState({
            ingredient: {
                name: this.nameRef.current.value,
                medida: this.medidaRef.current.value,
                cant: this.cantRef.current.value,
            }
        });
        ValidatorForm.addValidationRule('isNumberOrFraction', (value) => {
            const patron = /[0-9]+$|[0-9]+[/]+[0-9]+$|[0-9]+[,.]+[0-9]+$/;
            return patron.test(value);
        });
        setTimeout(() => {
            this.props.handleIngr(this.state);
        }, 100);
    }
    render() {
        if (this.props.i.ingredient.name !== null) {
            return (
                <React.Fragment>
                    <Grid item xs={12}>
                        <TextValidator
                            id="standard"
                            label="nombre"
                            placeholder='nombre del ingrediente'
                            margin="normal"
                            fullWidth
                            onChange={this.setChange}
                            inputRef={this.nameRef}
                            value = {this.state.ingredient.name}
                            validators={['required']}
                            errorMessages={['esta informacion es requerida']}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextValidator
                            id="standard"
                            label="medida"
                            placeholder='en que medida'
                            margin="normal"
                            fullWidth
                            value = {this.state.ingredient.medida}
                            onChange={this.setChange}
                            inputRef={this.medidaRef}
                            validators={['required']}
                            errorMessages={['esta informacion es requerida']}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextValidator
                            id="standard"
                            label="cantidad"
                            placeholder='cantidad del ingrediente'
                            margin="normal"
                            fullWidth
                            value = {this.state.ingredient.cant}
                            onChange={this.setChange}
                            inputRef={this.cantRef}
                            validators={['isNumberOrFraction','required']}
                            errorMessages={['solo debe contener numeros fracciones o decimales', 'Campo requerido']}
                            variant="outlined"
                        />
                    </Grid>
                </React.Fragment>
            );
        } else {
            return (<h1>agrega algun ingredeiente para el coctel</h1>);
        }

    }

}

export default Ingredient;