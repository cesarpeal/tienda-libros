import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';
import qs from 'qs';

class Login extends Component{
	url = Global.url;

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
			'json': '{"email":"'+this.state.user.email+'", "password":"'+ this.state.user.password+'", "gettoken":true}' 
		});

		var config = {
			method: 'post',
			url: this.url+'login',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: data
		};
		
		axios(config)
			 .then(res => {
			 	if(res.data.status !== "error"){
				this.setState({
					status: 'success'
				});
					this.state.user.getToken = res.data;								
					localStorage.setItem('token', JSON.stringify(this.state.user.getToken));
				} else if (res.data.status === 'error'){
					this.setState({
							status: res.data.status
					});
				}
			});
	}

	render() {
	return(
		<div id="login">
			<form onSubmit={this.recibirFormulario}>
				<div id="user">
					<label htmlFor="email">Email: </label>
					<input type="email" name="email" ref={this.emailRef} onChange={this.changeState} />
				</div>
				<div id="password">
					<label htmlFor="pass">Contraseña: </label>
					<input type="password" name="password" ref={this.passRef} onChange={this.changeState} />
				</div>
				<input type="submit" value="Login"  id="submit"/>
			</form>
			<p>¿No tienes una cuenta? Regístrate <Link replace to="/registro">aquí</Link></p>
		</div>
	);
}}

export default Login;