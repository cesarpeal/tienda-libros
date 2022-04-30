import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import Global from '../Global';
import qs from 'qs';

function Buy(){
	const url = Global.url;

	let {idLibro} = useParams();

	let navigate = useNavigate();

	let lineasStorage = null;

	useEffect(() => {

		if(!localStorage.getItem('lineas') || localStorage.getItem('lineas') !== 'undefined' || localStorage.getItem('lineas') !== undefined || localStorage.getItem('lineas') === null){
			lineasStorage = localStorage.getItem('lineas');
		}
		buy(idLibro);
	});

	function buy(idLibro) {

		var data = qs.stringify({
			'json':'{"lineas":"'+lineasStorage+'"}' 
		});

		var config = {
			method: 'post',
			url: url+'pedido-add/'+idLibro,
			headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.getItem('token').replace(/['"]+/g, '')},
			data: data
		};

		axios(config)
			 .then(res => {
			 	console.log(res.data.pedido);
				if(!localStorage.getItem('pedido') || localStorage.getItem('pedido') === null || localStorage.getItem('pedido') === undefined){
					localStorage.setItem('pedido', JSON.stringify(res.data.pedido));
				}
				localStorage.setItem('lineas', JSON.stringify(res.data.lineas));			
			});

		navigate("/carrito", {replace: true});
	}

	return(
		<div className="center">
			<p>Tramitando su pedido</p>
		</div>
		);
}

export default Buy;