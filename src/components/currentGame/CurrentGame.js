import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
};

const CurrentGame = ({ endGame, game, gameInProgress, pot, joinGame, playerTwoJoined }) => (
	<div className="CurrentGame">
		<h2>Let the Games Begin!</h2>
		<h6>Gane ID: {game.id}</h6>
		<h3>Player 1: {game.firstPlayer}</h3>
		<h6>vs</h6>
		<h3>Player 2: {game.secondPlayer}</h3>
		<p>playing for</p>
		<h1 className="display-1">{ pot } <span className="h6">ETH</span></h1>
		{gameInProgress ? 
			<p>
				P1 Declared Winner: {game.declaredWinnerFirstPlayer}
				P2 Declared Winner: {game.declaredWinnerSecondPlayer}
			</p>
		: null}
		{!playerTwoJoined && <Button color="primary" onClick={ joinGame }>Join Game</Button> }
		{playerTwoJoined && <Button color="primary" onClick={ endGame }>End Game</Button> }
	</div>
);

CurrentGame.propTypes = propTypes;
export default CurrentGame;
