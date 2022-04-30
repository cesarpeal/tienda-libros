import React, {useEffect, useState} from 'react';
import {useNavigate, Link, Outlet} from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Global from '../Global';

function Header() {
	const url = Global.url;
	let navigate = useNavigate();
	let token = localStorage.getItem("token");

	token = JSON.parse(token);
	console.log(token);
	useEffect(() =>{
		if(!user && token){
			getUser(token);
		}
	})

  	const [search, setSearch] = useState("");
  	const [user, setUser] = useState("");

  	const handleSearchChange = (e) => {
	    setSearch(e.target.value);
	  };



	const getUser = (token) =>{
		var config = {
			method: 'post',
			url: url+'user',
			headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.getItem('token').replace(/['"]+/g, '')}
		}
		axios(config)
			  .then(res => {
			  	setUser(res.data.user);
			  });
	}

	function handleSubmit(event){
		event.preventDefault();
		navigate("/busqueda/"+search);
	}

	function logout(event){
		event.preventDefault();
		localStorage.removeItem("token");
		navigate("/");
	}

		return(
			<main>
				<header id="header">
					<div id="titulo">
						<Link to="/"><h1>Librería React</h1></Link>
					</div>
					<div id="search">
						<form onSubmit={handleSubmit}>
							<input type="text" name="search" value={search} onChange={handleSearchChange} />
							<input type="submit" value="L" className="icon" />
						</form>
					</div>
					{(!token) ? (
						<Login />
						) : (
						<div id="welcome">
							<h3>Bienvenido <span>{user.nombre}</span></h3>
							<nav id="usermenu">
								<ul>
									<li><a href="#">Menú</a>
										<ul>
											<li><Link className="usermenu" replace to="/pedidos">Mis pedidos</Link></li>
											<li><Link className="usermenu" replace to="/editar-usuario">Editar usuario</Link></li>
											<li><button className="usermenu" onClick={logout}>Logout</button></li>
										</ul>
									</li>
								</ul>
							</nav>
						</div>
					)} 
					<div id="subheader">
						<nav id="menu">
							<ul>
								<Link replace to="/cien-mejores"><li>Más populares</li></Link>
								<Link replace to="/categorias"><li>Categorías</li></Link>
								<li>Info</li>
							</ul>
						</nav>
					</div>
					<div className="clearfix"></div>
				</header>
				<section id="content">
					<Outlet />
				</section>
			</main>
		);
}

export default Header;