import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';
import qs from 'qs';
import ReviewForm from './ReviewForm';

class Books extends Component {
	url = Global.url;

	contenidoRef = React.createRef();
	scoreRef = React.createRef();

	state = {
		books: [],
		book: [],
		review: [],
		media: [],
		status: null
	}

	componentDidMount(){
		var search = this.props.search;
		var idLibro = this.props.idLibro;
		if(search && (search !== null || search !== undefined)){
			this.getBySearch(search);
		} else if(idLibro && (idLibro !== null || idLibro !== undefined)){
			this.getBook(idLibro);
			this.getReview(idLibro);
			this.getBookScore(idLibro);
		} else {
			this.getBooks();
		}
	}

	getBySearch = (searched) => {
		axios.get(this.url+"busqueda/"+searched)
			 .then(res => {
			 	this.setState({
			 		books: res.data.books,
			 		status: 'success'

			 	});
			 })
			 .catch(err => {
			 	this.setState({
				 	books: [],
				 	status: 'success'
				 });
			 });
	}

	getBooks = () => {
		axios.get(this.url+"libros")
			 .then(res => {
			 	this.setState({
			 		books: res.data.books,
			 		status: 'success'
			 	});
			 });
	}

	getBook = (id) => {
		axios.get(this.url+"libro/"+id)
			 .then(res => {
			 	this.setState({
			 		book: res.data.book,
			 		status: 'success'
			 	});
			 });
	}

	getReview = (idLibro) => {
		var data = qs.stringify({
			'json':'{"idLibro":'+idLibro+'}'
		});

		var config = {
			method: 'post',
			url: this.url+'reviewed',
			headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.getItem('token').replace(/['"]+/g, '')},
			data: data
		};

		axios(config)
			.then(res => {
				this.setState({
					review: res.data.review
				});
			});
	}

	getBookScore = (idLibro) => {
		axios.get(this.url+'libro-media/'+idLibro)
			.then(res => {
				this.setState({
					media: res.data.media
				});
			});
	}

	render(){
		console.log(this.state.review);
	if(this.state.books.length >= 1 && this.state.status === 'success'){
			var Books = this.state.books.map((book) => {
				return (
					<article className="article" key={book.id}>
						<Link replace to={'/libro/'+book.id}>
							<img src="https://www.suzukijember.com/gallery/gambar_product/default.jpg" alt={book.titulo}/>
						</Link>

						<div className="data">
							<p><Link replace to={'/libro/'+book.id}>{book.titulo}</Link> - {book.categoria} - {book.precio}</p>
						</div>
					</article>
				);
			});
		return(
				<div className="center">
					{Books}
				</div>
		);
		} 	else if(this.state.book && this.state.status === 'success'){
			var book = this.state.book;
				return (
					<div className="center" key={book.id}>
						<div id="book">
							<h2>{book.titulo}</h2>
							<img src="https://www.suzukijember.com/gallery/gambar_product/default.jpg" alt={book.titulo}/>
							<h4>Resumen de {book.titulo}</h4>
							<p>{book.descripcion}</p>
							{this.state.media ? (
								<h3>Puntuación media de usuarios {this.state.media}/5</h3>
								): (
								<h3>No hay reviews</h3>
								)
							}
						</div>
						<div id="buy">
							<Link replace to={"/comprar/"+book.id}><button><p>Comprar por {book.precio} €</p></button></Link>
						</div>
						<div id="reviews">
							{(this.state.review === 'false') ? (
								<ReviewForm idLibro={book.id}/>
							) : (
							<div id="review">
								<h2>Tu reseña</h2>
								<h3>{this.state.review.titulo}</h3><p id="puntuacion">- {this.state.review.score}/5 estrellas</p>
								<div className="clearfix"></div>
								<p>{this.state.review.contenido}</p>
							</div>
							)}
							<Link to={"/reviews/"+book.id}><h4>Ver todas las reviews</h4></Link>
						</div>
					</div>
				);
		} 	else if(this.state.books.length === 0 && this.state.status === 'success'){
			return (
				<div id="article">
					<h2 className="subtitle">No hay artículos para mostrar</h2>
					<p>La búsqueda no ha dado resultados</p>
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

export default Books;