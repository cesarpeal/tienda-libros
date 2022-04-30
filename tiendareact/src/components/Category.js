import BooksByCategory  from './BooksByCategory';
import {useParams} from 'react-router-dom';

function Category() {

	let {category} = useParams();

	return (
			<div className="center">
				<BooksByCategory
						category={category}
				/>
			</div>
	);
}

export default Category;