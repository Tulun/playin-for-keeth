import React from 'react';
import { Button, Container, Row, Col, Form, FormGroup, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
};

const EndGame = ({ closingGame, closeGame, chooseWinner, onChange, declaringWinnerCall, declareWinner }) => (
	<div className="EndGame">
		<h2>End the Game</h2>
		<Container>
			<Row>
				<Col xs="12" md="5">
					<h2>Close Game</h2>
					<div className="form-group">
            <label>Ends game immediately. Any bet is returned to user.</label>
          </div>
					{closingGame && <p>Transaction pending...</p>}
					{!closingGame && <Button onClick={ closeGame } color="primary">Close Game</Button>}
				</Col>
				<Col xs="12" md="1"><h5>OR</h5></Col>
				<Col xs="12" md="5">
					<h2>Choose Winner</h2>
					<FormGroup>
						<Label for="selectWinner">Choose Winner</Label>
						<Input
							type="select"
							name="selectMulti"
							id="selectWinner"
							// multiple
							value={ chooseWinner }
							onChange={ onChange }
						>
							<option value={0}>--Choose Winner--</option>
							<option value={1}>First Player</option>
							<option value={2}>Second Player</option>
							<option value={3}>Tie</option>
						</Input>
						{declaringWinnerCall && <p>Transaction pending...</p>}
						{!declaringWinnerCall && <button onClick={ declareWinner } className="btn btn-primary">Choose Winner</button>}
					</FormGroup>
				</Col>
			</Row>
		</Container>
	</div>
);

EndGame.propTypes = propTypes;
export default EndGame;
