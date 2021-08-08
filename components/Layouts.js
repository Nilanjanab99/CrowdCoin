import React from 'react';
import Header from './Header'

const lo = (props) => {
	return (
		<div>
			<Header />
			{props.children}
		</div>
	);
};
export default lo;