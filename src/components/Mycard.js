import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Moment from 'react-moment';
import axios from 'axios';
import 'moment/locale/es';
import swal from 'sweetalert';
import url from '../ApiUrl';
class Mycard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null
        }
    }
    getUserInfo = () => {
        const UserInfo = JSON.parse(localStorage.getItem('UserInfo'));
        if (UserInfo) {
            return UserInfo;
        } else {
            return null;
        }
    }
    deleteRecipe = (recipeId) => {
        swal({
            title: "Seguro?",
            text: "estas seguro que quieres eliminar tu receta!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const token = this.getUserInfo()
                    axios.delete(url+'recipe/' + recipeId, { headers: { 'Content-Type': 'application/json', 'access-token': token.token } })
                        .then(() => {
                            this.handleClose();
                            this.props.handleDelete();
                        })
                } else {
                    swal("Tu receta esta ah salvo!");
                }
            });
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        return (
            <Card>
                <CardHeader
                    action={
                        <IconButton aria-label="settings" onClick={this.handleClick}>
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={this.props.recipe.name}
                    subheader={<Moment fromNow >{this.props.recipe.date}</Moment>}
                />
                <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem>
                        <Link to={"/edit/" + this.props.recipe._id} onClick={e => e.preventDefault} className="LinkMenuItem">
                            Edit
                                    </Link>
                    </MenuItem>
                    <MenuItem onClick={
                        (e) => {
                            e.preventDefault()
                            this.deleteRecipe(this.props.recipe._id)
                        }
                    }>Delete
                                </MenuItem>
                </Menu>
                <CardMedia
                    image={this.url + "get-image/" + this.props.recipe.image}
                    title={this.props.recipe.name}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {this.props.recipe.description}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <Typography>
                        <Link to={"/view/" + this.props.recipe._id} onClick={e => e.preventDefault} className="link">
                            Ver Receta
                                    </Link>
                    </Typography>
                </CardActions>
            </Card>
        )

    }
}

export default Mycard;