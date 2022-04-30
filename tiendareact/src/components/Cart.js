import React, {Component} from 'react';
import {Link, Navigate} from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';
import qs from 'qs';

class Cart extends Component{
	url = Global.url;

	cantidadRef = React.createRef();

	state = {
		lineas: [],
		pedido: [],
		cantidad: [],
		status: null
	}

	componentDidMount(){
		var lineas_array = localStorage.getItem('lineas');
		var pedido = localStorage.getItem('pedido');
		if(lineas_array !== null){
			this.getBooks(lineas_array, pedido);
		}
	}

	getBooks = (lineas, pedido) => {
		this.setState({
			lineas: JSON.parse(lineas),
			pedido: JSON.parse(pedido),
			status: 'success'
		});

	}
	endOrder = () => {

		var data = qs.stringify({
			'json':'{"pedido":"'+localStorage.getItem('pedido')+'", "lineas":"'+localStorage.getItem('lineas')+'"}' 
		});

		var config = {
			method: 'post',
			url: this.url+'pedido/end',
			headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.getItem('token').replace(/['"]+/g, '')},
			data: data
		};

		axios(config)
			 .then(res => {
				this.setState({
					lineas: null,
					pedido: null,
					status: null
				});
			});
		localStorage.removeItem('pedido');
		localStorage.removeItem('lineas');
		}

		clearOrder = () => {
			localStorage.removeItem('pedido');
			localStorage.removeItem('lineas');
		}

		moreOrless = (idLibro, button) => (event) => {
			event.preventDefault();
			var data = qs.stringify({
				'json':'{"idLibro":'+idLibro+', "lineas":"'+localStorage.getItem('lineas')+'", "button":"'+button+'"}' 
			});

			var config = {
				method: 'post',
				url: this.url+'more-or-less',
				headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.getItem('token').replace(/['"]+/g, '')},
				data: data
			};

			
			
			axios(config)
				 .then(res => {
					localStorage.setItem('lineas', JSON.stringify(res.data.lineas));		
				});

		}


	render(){
		if(this.state.lineas.length >= 1){
				var Lineas = this.state.lineas.map((linea) => {
					return (
						<div key={linea.idLibro.id}>
							<p>{linea.idLibro.titulo}</p><button onClick={this.moreOrless(linea.idLibro.id, "-")}>-</button><p>{linea.cantidad}</p><button onClick={this.moreOrless(linea.idLibro.id, "+")}>+</button>
						</div>
					);
				});
			return(
				<div className="center">
					{Lineas}
					<Link replace to={"/"}><button onClick={this.endOrder}>Finalizar pedido</button></Link>
					<Link replace to={"/"}><button onClick={this.clearOrder}>Limpiar pedido</button></Link>
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
export default Cart;