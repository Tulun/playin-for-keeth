import React from 'react';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
};

const CurrentGame = ({ endGame, game, pot, joinGame, playerTwoJoined, player }) => (
	<div className="CurrentGame">
		<h2>Let the Games Begin!</h2>
		<h6>Game ID: {game.id}</h6>
		<h3>Player 1: {game.firstPlayer === player.playerAddress ? player.name : 'Waiting for player...'}</h3>
		<h3>Player 2: {game.secondPlayer === player.playerAddress ? player.name : 'Waiting for player...'}</h3>
		<p>playing for</p>
		<h1 className="display-1">{ pot } <span className="h6">ETH</span></h1>
		{!playerTwoJoined && <Button color="primary" onClick={ joinGame }>Join Game</Button> }
		{ playerTwoJoined && 
			<div>
				<p>
					P1 Declared Winner: {game.declaredWinnerFirstPlayer}
				</p>
				<p>
					P2 Declared Winner: {game.declaredWinnerSecondPlayer}
				</p>
				<Button color="primary" onClick={ endGame }>End Game</Button>
			</div>
		}
	</div>
);

CurrentGame.propTypes = propTypes;
export default CurrentGame;
