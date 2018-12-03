import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	gameInProgress: PropTypes.bool.isRequired,
}

const ProgressLight = ({ gameInProgress }) => (
	<div className="ProgressLight">
		<p className="ProgressLight-text mb-0">Game in Progress: {`${gameInProgress}`} </p>
	</div>
);

ProgressLight.propTypes = propTypes;
export default ProgressLight;
