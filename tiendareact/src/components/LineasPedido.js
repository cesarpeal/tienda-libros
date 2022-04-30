import React, {Component} from 'react';
import axios from 'axios';
import Global from '../Global';

class LineasPedido extends Component {
	url = Global.url;

	state = {
		lineas: []
	}

	componentDidMount(){
		var idPedido = this.props.idPedido;
		this.lineasPedido(idPedido);
	}

	lineasPedido = (idPedido) => {
		axios.get(this.url+'lineas/'+idPedido)
			.then(res => {
				this.setState({
					lineas: res.data.lineas
				});
			});
	}

	render(){
		if(this.state.lineas.length >= 1){
			var Lineas = this.state.lineas.map((linea) => {
				return(
					<div key={linea.id}>
						<p>{linea.idLibro.titulo} - Precio:{linea.idLibro.precio} - Cantidad:{linea.cantidad} - Coste: {linea.coste}</p>
					</div>
				);
			});
			return(
				<div className="center">
					{Lineas}
				</div>
			);
		} else {
			return(
				<h3>Cargando...</h3>
			);
		}
	}
}

export default LineasPedido;