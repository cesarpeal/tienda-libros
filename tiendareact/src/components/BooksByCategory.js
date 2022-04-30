import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';

class BooksByCategory extends Component {
	url = Global.url;

	state = {
		books: []
	}

	componentDidMount(){
		var category = this.props.category;
		this.getBooksByCategory(category);
	}

	getBooksByCategory = (category) => {
		axios.get(this.url+'categoria/'+category)
			.then(res => {
				this.setState({
					books: res.data.libros
				});
			});
	}

	render(){
		if(this.state.books.length >= 1){
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
		} else {
			return (
				<div>
					<h1>Cargando...</h1>
				</div>
			);
		}
	}
}

export default BooksByCategory;