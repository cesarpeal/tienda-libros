import React, {Component} from 'react';
import axios from 'axios';
import LineasPedido from './LineasPedido';
import Global from '../Global';

class Orders extends Component {
	url = Global.url;

	state = {
		pedidos: [],
		status: []
	}

	componentDidMount(){
		this.showOrders();
	}

	showOrders = () => {
		var config = {
			method: 'GET',
			url: this.url+'mis-pedidos',
			headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.getItem('token').replace(/['"]+/g, '')}
		}

		axios(config)
			.then(res => {
				if(res.data.status === 'success' && (res.data.pedidos)){
					this.setState({
						pedidos: res.data.pedidos,
						status: 'success'
					});
				}
			});
	}

	render(){
		if(this.state.pedidos.length >= 1 && this.state.status === 'success' && this.state.pedidos !== 'nope'){
			var Pedidos = this.state.pedidos.map((pedido) => {
				return(
					<div className="lineas" key={pedido.id}>
						<h2>Id de pedido: {pedido.id} - Coste total del pedido: {pedido.importe}</h2>
						<LineasPedido idPedido={pedido.id} />
					</div>
				);
			});
			return(
				<div className="center">
					{Pedidos}
				</div>
			);
		} else if(this.state.status === 'success' && this.state.pedidos === 'nope'){
			return(
				<p>No hay pedidos que mostrar</p>
			);
			
		} else {
			return(
				<h3>Cargando...</h3>
			);
		}
	}
}

export default Orders;