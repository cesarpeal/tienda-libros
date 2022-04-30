import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';

class BestHundred extends Component {
	url = Global.url;

	state = {
		books: [],
		status: null
	}

	componentDidMount(){
		this.getBestHundred();
	}

	getBestHundred = () => {
		axios.get(this.url+'cien-mejores')
			.then(res => {
				this.setState({
					books: res.data.besthundred,
					status: 'success'
				});
			});
	}

	render(){
		if(this.state.books.length >= 1 && this.state.status == 'success'){
				var Books = this.state.books.map((book) => {
					return (
						<article className="article" key={book.idLibro.id}>
							<Link replace to={'/libro/'+book.idLibro.id}>
								<img src="https://www.suzukijember.com/gallery/gambar_product/default.jpg" alt={book.idLibro.titulo}/>
							</Link>

							<div className="data">
								<p><Link replace to={'/libro/'+book.idLibro.id}>{book.idLibro.titulo}</Link> - {book.idLibro.categoria} - {book.idLibro.precio}</p>
							</div>
						</article>
					);
				});
			return(
					<div className="center">
						{Books}
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

export default BestHundred;