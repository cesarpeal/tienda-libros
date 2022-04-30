import ReviewsList  from './ReviewsList';
import {useParams} from 'react-router-dom';

function Reviews() {

	let {idLibro} = useParams();
	return (
		<ReviewsList idLibro={idLibro}	/>
	);
}

export default Reviews;