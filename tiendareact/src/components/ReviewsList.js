import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';

class ReviewsList extends Component {
	url = Global.url;

	state = {
		reviews: [],
		titulo: []
	}

	componentDidMount(){
		var idLibro = this.props.idLibro;
		console.log(idLibro);
		if(idLibro){
			this.getBookReviews(idLibro);
		}
	}

	getBookReviews = (idLibro) => {
		axios.get(this.url+"reviews/"+idLibro)
		.then(res => {
			this.setState({
				reviews: res.data.reviews,
				titulo: res.data.titulo
			});
		});
	}

	render(){
		if(this.state.reviews.length >= 1){
			var Reviews = this.state.reviews.map((review) => {
				return(
					<div className="reviewList">
						<p className="reviewtitulo">{review.titulo} - {review.score}/5</p>
						<div className="clearfix"></div>
						<p>{review.contenido}</p>
						<div className="clearfix"></div>
					</div>
				);
			});
		return(
			<div className="center">
				<h2>Todas las reviews de {this.state.titulo}</h2>
				{Reviews}
			</div>
		);
		} else {
			return(
				<div>
					<h3>No hay reviews</h3>
				</div>
			);
		}
	}
}

export default ReviewsList;