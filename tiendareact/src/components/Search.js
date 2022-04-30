import Books  from './Books';
import {useParams} from 'react-router-dom';

function Search() {

	let {search} = useParams();

	return (
		<section id="content">
			<h1 className="subtitle">Búsqueda: {search}</h1>

			<div className="center">
				<Books
						search={search}
				/>
			</div>
		</section>
	);
}

export default Search;