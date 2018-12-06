import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
};

const CurrentGame = ({ endGame }) => (
	<div className="CurrentGame">
		<h2>Let the Games Begin!</h2>
		<h3>Player 1</h3>
		<h6>vs</h6>
		<h3>Waiting for P2 to join</h3>
		<p>playing for</p>
		<h1 className="display-1">0.25 <span className="h6">ETH</span></h1>
		<Button color="primary" onClick={ endGame }>End Game</Button>
	</div>
);

CurrentGame.propTypes = propTypes;
export default CurrentGame;
