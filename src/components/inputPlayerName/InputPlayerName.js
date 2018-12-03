import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

const InputPlayerName = ({ name, addingPlayerToLeaderboard, addPlayerToLeaderboard, onChange }) => (
  <div className="InputPlayerName">
    <Form>
      <FormGroup>
        <Label for="playerName">Your Name:</Label>
        <Input
          type="text"
          name="name"
          id="playerName"
          placeholder="Player Name"
          onChange={ onChange }
          value={ name }
        />
      </FormGroup>
      { addingPlayerToLeaderboard && <p>Transaction pending...</p> }
      { !addingPlayerToLeaderboard && 
        <Button
          color="primary"
          onClick={ addPlayerToLeaderboard }
        >Signup for Leaderboard</Button>
      }
    </Form>
  </div>
);

export default InputPlayerName;
