import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';
import qs from 'qs';

class Register extends Component{
	url = Global.url;

	nombreRef = React.createRef();
	apellidosRef = React.createRef();
	direccionRef = React.createRef();
	emailRef = React.createRef();
	passRef = React.createRef();

	state = {
		user: {
		},
		status: null
	}
	
	changeState = () => {
		this.setState({
			user: {
				nombre: this.nombreRef.current.value,
				apellidos: this.apellidosRef.current.value,
				direccion: this.direccionRef.current.value,
				email: this.emailRef.current.value,
				password: this.passRef.current.value
			}
		});
		this.forceUpdate();
		console.log(this.state);
	}

	recibirFormulario = (e) => {
		e.preventDefault();

		this.changeState();

		var data = qs.stringify({
			'json': '{"nombre":"'+this.state.user.nombre+'", "apellidos":"'+this.state.user.apellidos+'", "direccion":"'+this.state.user.direccion+'", "email":"'+this.state.user.email+'", "password":"'+ this.state.user.password+'"}' 
		});

		var config = {
			method: 'post',
			url: this.url+'register',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: data
		};
		axios(config)
			 .then(res => {
				if(this.state.user){
				this.setState({
					user: this.state.user,
					status: 'success'
				});
				this.state.user.getToken = res.data.user;
				} else {
					this.setState({
						status: 'failed'
					});
				}
			});
			 console.log(this.state.user);
	}

	render(){
		return(
			<section id="content">
				<h1 className="subheader">REGISTRO</h1>

				<form className="mid-form" onSubmit={this.recibirFormulario}>
					<div className="registro">
						<label htmlFor="nombre">Nombre</label>
						<input type="text" name="nombre" ref={this.nombreRef} onChange={this.changeState} />
					</div>

					<div className="registro">
						<label htmlFor="apellidos">Apellidos</label>
						<input type="text" name="apellidos" ref={this.apellidosRef} onChange={this.changeState} />
					</div>

					<div className="registro">
						<label htmlFor="direccion">Direcci??n</label>
						<input type="text" name="direccion" ref={this.direccionRef} onChange={this.changeState} />
					</div>

					<div className="registro">
						<label htmlFor="email">Correo electr??nico</label>
						<input type="email" name="email" ref={this.emailRef} onChange={this.changeState} />
					</div>

					<div className="registro">
						<label htmlFor="password">Contrase??a</label>
						<input type="password" name="password" ref={this.passRef} onChange={this.changeState} />
					</div>

					<div className="clearfix"></div>

					<input type="submit" value="Registrarse" className="btn btn-success" />
				</form>
			</section>
		);
	}
}

export default Register;