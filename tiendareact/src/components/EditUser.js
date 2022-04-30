import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';
import qs from 'qs';

class EditUser extends Component{
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

	componentDidMount(){
		this.getUser();
	}

	getUser = () => {

		var config = {
			method: 'post',
			url: this.url+'user',
			headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.getItem('token').replace(/['"]+/g, '')}
		};

		axios(config)
			.then(res => {
				this.setState({
					user: {
						nombre: res.data.user.nombre,
						apellidos: res.data.user.apellidos,
						direccion: res.data.user.direccion,
						email: res.data.user.email
					}
				})
			});
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
			url: this.url+'edit-user',
			headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.getItem('token').replace(/['"]+/g, '')},
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
			<div className="center">
				<h1 className="subheader">REGISTRO</h1>

				<form className="mid-form" onSubmit={this.recibirFormulario}>
					<div className="registro">
						<label htmlFor="nombre">Nombre</label>
						<input type="text" name="nombre" defaultValue={this.state.user.nombre} ref={this.nombreRef} onChange={this.changeState} />
					</div>

					<div className="registro">
						<label htmlFor="apellidos">Apellidos</label>
						<input type="text" name="apellidos" defaultValue={this.state.user.apellidos} ref={this.apellidosRef} onChange={this.changeState} />
					</div>

					<div className="registro">
						<label htmlFor="direccion">Dirección</label>
						<input type="text" name="direccion" defaultValue={this.state.user.direccion} ref={this.direccionRef} onChange={this.changeState} />
					</div>

					<div className="registro">
						<label htmlFor="email">Correo electrónico</label>
						<input type="email" name="email" defaultValue={this.state.user.email} ref={this.emailRef} onChange={this.changeState} />
					</div>

					<div className="registro">
						<label htmlFor="password">Contraseña</label>
						<input type="password" name="password" defaultValue={this.state.user.password} ref={this.passRef} onChange={this.changeState} />
					</div>

					<div className="clearfix"></div>

					<input type="submit" value="Registrarse" className="btn btn-success" />
				</form>
			</div>
		);
	}
}

export default EditUser;