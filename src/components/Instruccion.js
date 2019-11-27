import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid'

class Instruccion extends Component {
    instruccionRef = React.createRef() 
    state = {
        id:this.props.i.id,
		text:this.props.i.text
	};


    setChange = () => {
        this.setState({text:this.instruccionRef.current.value});
        setTimeout(() => {
            this.props.handleInstr(this.state);
        }, 100);
	}
    render() {
        if(this.props.i !== null){
            return(
                <Grid item xs = { 12}>
                    <TextField
                        id="standard"
                        label="instruccion"
                        placeholder='escriba los pasos a seguir...'
                        margin="normal"
                        multiline
          				rowsMax="4"
                        fullWidth
                        defaultValue = {this.props.i.text}
                        inputRef={this.instruccionRef}
                        onChange={this.setChange}
                        variant="outlined"
                    />
                </Grid>
            );
        }else{
            return (<h1>agrega alguna instruccion de como preparar</h1>);
        }
        
    }
        
}

export default Instruccion;
