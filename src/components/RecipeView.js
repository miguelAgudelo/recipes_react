import React, { Component } from 'react';
import axios from 'axios';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Moment from 'react-moment';
import url from '../ApiUrl';
class RecipeView extends Component {
    constructor() {
        super()
        this.state = {
            recipes: {
                name: "",
                description: "",
                note: "",
                instruccions: [],
                ingredients: [],
            },
            publication: null,
            status: null
        }
    }
    UNSAFE_componentWillMount() {
        this.recipeId = this.props.match.params.id;
        this.getRecipe(this.recipeId);
    }
    getRecipe = (id) => {
        axios.get(url + '/recipe/' + id)
            .then((res) => {
                this.setState({
                    recipes: res.data.recipe,
                    status: 'success',
                    publication: res.data.publication
                });
            });
    }

    render() {
        if (this.state.status !== 'success') {
            return (
                <div>
                    <h2>Cargando</h2>
                    <p>esto no deberia tardar mucho...</p>
                </div>
            );
        }


        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-start" textAlign="justify" p={1} bgcolor="background.paper">
                <img src={url + "get-image/" + this.state.recipes.image} alt={this.state.recipes.name} className="imgView" />
                <Box m={1} margin="10px">
                    <Typography variant="h4">
                        {this.state.recipes.name}
                    </Typography>
                </Box>
                <Box m={1} margin="10px">
                    <Typography variant="subtitle1">
                        publicado: {<Moment format="MMM Do YYYY" >{this.state.publication.date}</Moment>}
                    </Typography>
                </Box>
                <Box m={1} margin="10px">
                    <Typography variant="h6">
                        {this.state.recipes.description}
                    </Typography>
                </Box>
                <Box margin="10px">
                    <Typography variant="h4">
                        Ingredientes
                    </Typography>
                </Box>
                <Box m={1} margin="10px">
                    <List component="nav" aria-label="ingredients list">
                        {this.state.recipes.ingredients.map(ingredient => {
                            return <ListItem key={ingredient._id}>
                                <Typography variant="h6">
                                    {ingredient.name}   {ingredient.medida}  {ingredient.cant}
                                </Typography>
                            </ListItem>
                        })}
                    </List>
                </Box>
                <Box m={1} margin="10px">
                    {(this.state.recipes.instruccions.length > 0) &&
                        <Typography variant="h4">
                            como preparar
                        </Typography>
                    }
                </Box>
                <Box m={1} margin="10px">
                    <List component="nav" aria-label="instruccions list">
                        {this.state.recipes.instruccions.map((instruccion, index) => {
                            return <ListItem key={index.toString()}>
                                <Typography variant="h6">
                                    {instruccion}
                                </Typography>
                            </ListItem>
                        })}
                    </List>
                </Box>
                <Box m={1} margin="10px">
                    <Typography variant="h6">
                        Nota:   {this.state.recipes.note}
                    </Typography>
                </Box>
                <Box m={1} margin="10px">
                    <Typography variant="subtitle1">
                       Autor del contenido:  {this.state.publication.author}
                    </Typography>
                </Box>
            </Box>
        )
    }
}

export default RecipeView;