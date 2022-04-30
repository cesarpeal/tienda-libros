import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';
import qs from 'qs';

class ReviewForm extends Component{
	url = Global.url;

	contenidoRef = React.createRef();
	scoreRef = React.createRef();
	tituloRef = React.createRef();


	state = {
		review: {
		},
		status: null
	}
	
	changeState = () => {
		this.setState({
			review: {
				contenido: this.contenidoRef.current.value,
				score: this.scoreRef.current.value,
				titulo: this.tituloRef.current.value
			}
		});
		this.forceUpdate();
		console.log(this.state);
	}

	recibirFormulario = (idLibro) => (e) => {
		e.preventDefault();

		this.changeState();

		var data = qs.stringify({
			'json': '{"contenido":"'+this.state.review.contenido+'", "score":"'+ this.state.review.score+'", "titulo":"'+this.state.review.titulo+'"}' 
		});

		var config = {
			method: 'post',
			url: this.url+'review-crear/'+idLibro,
			headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.getItem('token').replace(/['"]+/g, '')},
			data: data
		};
		
		axios(config)
			 .then(res => {
			 	this.setState({
			 		review: this.state.review,
					status: 'success'
			 	});
			});
	}

	render() {
	return(
		<div>
			<form id="reviewForm" onSubmit={this.recibirFormulario(this.props.idLibro)}>
				<div id="reviewFormTitulo">
					<label htmlFor="titulo">Titulo de la review: </label>
					<input type="text" ref={this.tituloRef} onChange={this.changeState} />
				</div>

				<div id="reviewFormContenido">
					<label htmlFor="contenido">Contenido: </label>
					<textarea ref={this.contenidoRef} onChange={this.changeState}></textarea>
				</div>

				<div id="reviewFormScore">
					<label htmlFor="score">Score: </label>
					<select ref={this.scoreRef} onChange={this.changeState}>
						<option value='1'>1</option>
						<option value='2'>2</option>
						<option value='3'>3</option>
						<option value='4'>4</option>
						<option value='5'>5</option>
					</select>
				</div>
				<div className="clearfix"></div>
				<input id="reviewSubmit" type="submit" value="Guardar"/>
			</form>
		</div>
	);
}}

export default ReviewForm;