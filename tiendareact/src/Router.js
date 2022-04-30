import React, {Component} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import MainPage from './components/MainPage';
import Search from './components/Search';
import Categories from './components/Categories';
import Category from './components/Category';
import EditUser from './components/EditUser';
import Book from './components/Book';
import Buy from './components/Buy';
import Cart from './components/Cart';
import Reviews from './components/Reviews';
import Orders from './components/Orders';
import Register from './components/Register';
import Sidebar from './components/Sidebar';
import BestHundred from './components/BestHundred';
import Footer from './components/Footer';

class Router extends Component{

	render(){
		return(
			<BrowserRouter>

				<div className="center">
					<Routes>
						<Route path="/" element={<Header />}>
							<Route index element={<MainPage />} />
							<Route path="/libro/:idLibro" element={<Book />} />
							<Route path="/cien-mejores" element={<BestHundred />} />
							<Route path="/categorias" element={<Categories />} />
							<Route path="/categoria/:category" element={<Category />} />
							<Route path="/busqueda/:search" element={<Search />} />
							<Route path="/registro" element={<Register />} />
							<Route path="/comprar/:idLibro" element={<Buy />} />
							<Route path="/carrito" element={<Cart />} />
							<Route path="/reviews/:idLibro" element={<Reviews />} />
							<Route path="/pedidos" element={<Orders />} />
							<Route path="/editar-usuario" element={<EditUser />} />
							<Route path="*" element={<div>404 Not found</div>} />
						</Route>
					</Routes>
				</div>
				<Sidebar />
			    <div className="clearfix"></div>
				<Footer />

			</BrowserRouter>
		);
	}
}

export default Router;