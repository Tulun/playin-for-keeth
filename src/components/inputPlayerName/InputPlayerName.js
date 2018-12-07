import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

const InputPlayerName = ({ name, addingPlayerToLeaderboard, addPlayerToLeaderboard, onChange }) => (
  <div className="InputPlayerName d-flex justify-content-center">
      { addingPlayerToLeaderboard && <p>Transaction pending...</p> }
      { !addingPlayerToLeaderboard && 
        <Form inline>
          <FormGroup>
            <Label className="mr-2" for="playerName">Name:</Label>
            <Input
              type="text"
              name="name"
              id="playerName"
              placeholder="Player Name"
              onChange={ onChange }
              value={ name }
            />
          </FormGroup>
          <Button
            color="primary"
            onClick={ addPlayerToLeaderboard }
          >Add</Button>
        </Form>
      }    
  </div>
);

export default InputPlayerName;
