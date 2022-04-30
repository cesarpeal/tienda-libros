import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';

class Categories extends Component {
	url = Global.url;

	state = {
		categorias: []
	}

	componentDidMount(){
		this.getCategorias();
	}

	getCategorias = () => {
		axios.get(this.url+'categorias')
			.then(res => {
				this.setState({
					categorias: res.data.categorias
				});
			});
	}

	render(){
		if(this.state.categorias.length >= 1){
				var Categorias = this.state.categorias.map((categoria) => {
					return (
						<div className="categoria">
							<Link replace to={'/categoria/'+categoria.categoria}><h2>{categoria.categoria}</h2></Link>
						</div>
					);
				});
			return(
				<div className="center">
					{Categorias}
				</div>
			);
		} else {
			return (
				<div>
					<h1>Cargando...</h1>
				</div>
			);
		}
	}
}

export default Categories;