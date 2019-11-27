import React, { Component } from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import swal from 'sweetalert';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Mycard from './Mycard';

class MisRecipe extends Component {
    url = "http://localhost:3900/api/"
    searchRef = React.createRef()
    handleDelete = this.handleDelete.bind(this);
    constructor(props){
        super(props);
        this.state = {
            recipes: [],
            status: null,
            search: ''
        };
    }
    getUserInfo = () => {
		const UserInfo = JSON.parse(localStorage.getItem('UserInfo'));
		if(UserInfo){
			return UserInfo;
		}else{
			return null;
		}
	}
    UNSAFE_componentWillMount() {
        const sessionData = this.getUserInfo();
        axios.get('http://localhost:3900/api/misrecipe',{ headers: {'Content-Type':'application/json','access-token': sessionData.token} })
            .then((res) => {
                if(res.data.recipes){
                    const recipes = res.data.recipes.map(recipe => {
                        recipe.description = (recipe.description.length > 150) ? recipe.description.slice(0,150)+"..." : recipe.description
                        return recipe
                    })
                    this.setState({
                        recipes: recipes,
                        status: 'success'
                    })
                }else{
                    this.setState({
                        recipes: [],
                        status: 'fail'
                    })
                }
                
            })
    }
    getUserInfo = () => {
		const UserInfo = JSON.parse(localStorage.getItem('UserInfo'));
		if(UserInfo){
			return UserInfo;
		}else{
			return null;
		}
    }
    
    handleDelete() {
        const sessionData = this.getUserInfo();
		axios.get('http://localhost:3900/api/misrecipe', { headers: { 'Content-Type': 'application/json', 'access-token': sessionData.token } })
            .then((res) => {
                this.setState({
                    recipes: res.data.recipes,
                    status: 'success'
                })
                swal("Receta Eliminada Satisfactoriamente!", {
                    icon: "success",
                });
            })
	}
    

    setChange = () => {
        this.setState({search:this.searchRef.current.value})
    }

    render() {

        let content = null
        if (this.state.recipes.length > 0) {
            content = this.state.recipes.filter(recipe =>
                recipe.name.toLowerCase().includes(this.state.search.toLowerCase()) 
            ).map(recipe => (
                <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                    <Mycard recipe={recipe} handleDelete={this.handleDelete}></Mycard>
                </Grid>
            ));
        } else if (this.state.recipes.length === 0 && this.state.status === 'success') {
            
            content =<Grid item xs={12}>
                    <h2>No hay recetas aun!</h2>
                    <p>se el primero en agregar una (:</p>
                </Grid>
            
        } else {
            content =<Grid item xs={12}>
                        <h2>lo sentimos!</h2>
                        <p>ah ocurrido un error porfavor recarge la pagina</p>
                    </Grid>
        }

        return (
            <Box>
                <form noValidate autoComplete="off">
                    <TextField 
                        id="outlined-basic"
                        label="Buscador"
                        variant="outlined"
                        className="search"
                        placeholder='busca el coctel que quieres'
                        margin="normal"
                        fullWidth
                        onChange={this.setChange}
                        inputRef={this.searchRef}
                    />
                </form>
                <Grid container spacing={3}>
                    {content}
                </Grid>
            </Box>
        );

    }


}

export default MisRecipe;