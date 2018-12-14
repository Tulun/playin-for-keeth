import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

const propTypes = {
	gameInProgress: PropTypes.bool.isRequired,
}

const ProgressLight = ({ gameInProgress, onClick }) => (
	<div className="ProgressLight">
		<p className="ProgressLight-text mb-0">Game in Progress: {`${gameInProgress}`}  { gameInProgress ? <Button size="sm" onClick={ onClick } color="primary">View Current Game</Button> : null}</p>
	</div>
);

ProgressLight.propTypes = propTypes;
export default ProgressLight;
