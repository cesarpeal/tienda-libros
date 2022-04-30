import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

class Sidebar extends Component{
	url = Global.url;

	state = {
		books: []
	}

	componentDidMount(){
		this.getmoreSold();
	}

	getmoreSold = () => {
		axios.get(this.url+"more-sold")
			 .then(res => {
			 	this.setState({
			 		books: res.data.books
			 	});
			 });
	}

	render(){
		if(this.state.books.length >= 1){
			return(
				<aside id="sidebar">
					<div>
						<h3>Más vendidos</h3>
							<Carousel>
								{this.state.books.map((book, index) => (
									<article className="article" key={book.idLibro.id}>
										<Link replace to={'/libro/'+book.idLibro.id}>
											<img src="https://www.suzukijember.com/gallery/gambar_product/default.jpg" alt={book.idLibro.titulo}/>
										</Link>

										<div className="data">
											<p><Link replace to={'/libro/'+book.idLibro.id}>{book.idLibro.titulo}</Link> - {book.idLibro.categoria} - {book.idLibro.precio}</p>
										</div>
									</article>
								))}
							</Carousel>
					</div>
				</aside>
			);
		} else {
			return(
				<p>Cargando...</p>
			);
		}
	}
}

export default Sidebar;