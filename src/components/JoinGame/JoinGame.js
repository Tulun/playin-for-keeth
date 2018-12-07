import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
	
};

const JoinGame = ({ addSecondPlayerToGame }) => (
	<div className="JoinGame">
		<h2>Join the Game</h2>
		<p>Join the current game created by [Player 1] by confirming the bet amount of [0.5eth]</p>
		<h2 className="display-1">0.5 <span className="h6">ETH</span></h2>
		<Button color="primary" onClick={ addSecondPlayerToGame }>Confirm and Join Game</Button>
	</div>
);

JoinGame.propTypes = propTypes;
export default JoinGame;
