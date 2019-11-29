import React, { Component } from 'react';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Moment from 'react-moment';
import 'moment/locale/es';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import {Link} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import url from '../ApiUrl';
class RecipeList extends Component {
    searchRef = React.createRef()
    constructor(props){
        super(props);
        this.state = {
            recipes: [],
            status: null,
            search: ''
        };
    }
    
    UNSAFE_componentWillMount() {
        axios.get(url+'recipes')
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
    
    setChange = () => {
        this.setState({search:this.searchRef.current.value})
    }

    render() {

        let content = null
        if (this.state.recipes.length > 0) {
            
            content = 
                this.state.recipes.filter(recipe =>
                    recipe.name.toLowerCase().includes(this.state.search.toLowerCase()) 
                ).map(recipe => (
                <Grid item xs={12} sm={6} md={4} key={recipe._id}>
                    <Card>
                        <CardHeader
                            title={recipe.name}
                            subheader={<Moment fromNow >{recipe.date}</Moment>}
                        />
                        <CardMedia
                            image={this.url + "get-image/" + recipe.image}
                            title={recipe.name}
                        />
                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {recipe.description}
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <Typography>
                                <Link to={"/view/"+recipe._id} onClick={e => e.preventDefault} className="link">
                                    Ver Receta
                                </Link>
                            </Typography>
                        </CardActions>
                    </Card>
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
                <Grid container className="list">
                    {content}
                </Grid>
            </Box>
        );

    }


}

export default RecipeList;