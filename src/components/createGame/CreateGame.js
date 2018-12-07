import React from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
	creatingGame: PropTypes.bool.isRequired,
	createGame: PropTypes.func.isRequired,
	handleInputChange: PropTypes.func.isRequired,
	value: PropTypes.string.isRequired,
};

const CreateGame = ({ creatingGame, createGame, handleInputChange, value }) => (
	<div className="CreateGame">
		<h2>Create Game</h2>
		<p>Play for Free(minus network fees) or back yourself with an ETH amount</p>
		<Container fluid>
			<Row>
				<Col xs="12" md="5">
					<h2>Play for bragging rights</h2>
					<Button onClick={ createGame }color="primary">Play for free</Button>		
				</Col>
				<Col xs="12" md="1"><h5>OR</h5></Col>
				<Col xs="12" md="5">
					<h2>Make things interesting</h2>
					<Form>
						<FormGroup>
							<Label for="betAmount">Bet amount in ETH</Label>
							<Input
								type="text"
								name="betAmount"
								id="betAmount"
								placeholder="0.25"
								onChange={(event, state) => handleInputChange(event, "betValue") }
								value={ value }
							/>
						</FormGroup>
					</Form>
					{ creatingGame && <p>Transaction pending...</p>}
					{!creatingGame && 
						<Button onClick={ createGame }color="primary">Play with bet</Button>
					}
				</Col>
			</Row>
		</Container>
	</div>
);

CreateGame.propTypes = propTypes;
export default CreateGame;
