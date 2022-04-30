import Books  from './Books';
import {useParams} from 'react-router-dom';

function Book() {

	let {idLibro} = useParams();
	return (
			<div className="center">
				<Books
					idLibro={idLibro}
				/>
			</div>
	);
}

export default Book;