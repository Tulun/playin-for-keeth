import React, { Component } from 'react'
import {Jumbotron, Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText} from 'reactstrap';
import Tx from 'ethereumjs-tx'
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';

// Services
import WalletService from './services/Wallet'

// Address
import address from './address';

// Components
import ProgressLight from './components/progressLight/ProgressLight';
import Leaderboard from './components/leaderboard/Leaderboard';
import Account from './components/account/Account';
import InputPlayerName from './components/inputPlayerName/InputPlayerName';
import PlayerInformation from './components/playerInformation/PlayerInformation';
import Section from './components/section/Section';
import CreateGame from './components/createGame/CreateGame';
import CurrentGame from './components/currentGame/CurrentGame';
import EndGame from './components/endGame/EndGame';

// CSS
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

// Contract
import leaderboard from './leaderboard';

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			players: [],
			gameInProgress: false,
			game: {},
			name: "",
			balance: 0,
			betValue: "",
			value: "",
			chooseWinner: "",
			copied: false,
			creatingGame: false,
			creatingGameError: false,
			addingPlayerToLeaderboard: false,
			addingPlayerToLeaderboardError: false,
			addingSecondPlayerToGame: false,
			addingSecondPlayerToGameError: false,
			closingGame: false,
			closingGameError: false,
			declaringWinnerCall: false,
			declaringWinnerCallError: false,
			viewAccount: false,
			viewGame: false,
			viewHome: false,
		}

		// wallet stuff
		this.walletService = new WalletService();
		// web 3
		this.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws'));

		// Bindings
		this.handleNameInput = this.handleNameInput.bind(this);
		this.handleOnChangeValue = this.handleOnChangeValue.bind(this);
	}

	async componentDidMount() {
		const balance = await this.web3.eth.getBalance(this.walletService.publicKey);		
		const gameInProgress = await leaderboard.methods.gameInProgress().call();
		const game = await leaderboard.methods.game().call();
		const currentBlock = await this.web3.eth.getBlock("latest");
		const numPlayers = await leaderboard.methods.totalNumPlayers().call();
		
		console.log('cb', currentBlock);
		console.log(numPlayers);
		
		const players = [];
		if (numPlayers > 0) {
			for (let i=0; i < numPlayers; i++) {
				const player = await leaderboard.methods.players(i).call();
				players.push(player);
			}
		}

		this.setState({ 
			gameInProgress,
			balance: `${this.web3.utils.fromWei(balance)}`,
			game,
			players
		});

    // watch game progress changes
    leaderboard.events.allEvents({fromBlock: `${currentBlock.number}`, toBlock: "latest"}, async (error, result) => {
      if(!error) {
        console.log('result', result);
        if (result.event === "UpdateGameProgress") {
					const balance = await this.web3.eth.getBalance(this.walletService.publicKey);
					return this.setState({ 
						gameInProgress: result.returnValues[0], 
						balance: `${this.web3.utils.fromWei(balance)}`  
					});
        };

        if (result.event === "PlayerUpdated") {
          const players = this.state.players;
          const player = await leaderboard.methods.players(result.returnValues[0]).call();
          players[result.returnValues[0]] = player;

          return this.setState({ players });
				}
				
				if (result.event === "GameUpdated") {
					const game = await leaderboard.methods.game().call();
					const balance = await this.web3.eth.getBalance(this.walletService.publicKey);
					this.setState({ 
						game,
						balance: `${this.web3.utils.fromWei(balance)}` 
					});
				}
      } else {
        console.log('err', error)
      }
		});
		
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.state.gameInProgress && !prevState.gameInProgress) {
      const game = await leaderboard.methods.game().call();
      this.setState({ game });
      console.log('game', game);
    }
	}

	changeBlockchainUI = (type, err) => {
		if (err) {
			this.setState({ [type]: false, [err]: true });
		} else {
			this.setState({ [type]: false })
		}
	}

	addPlayerToLeaderboard = async () => {
		this.setState({ addingPlayerToLeaderboard: true })
		const nameHexcode = this.web3.eth.abi.encodeFunctionCall({
			name: "addPlayerToLeaderboard",
			type: "function",
			inputs: [{
				type: 'string',
				name: 'name'
			}]
		},[this.state.name]);

		const txCount = await this.web3.eth.getTransactionCount(this.walletService.publicKey);
		// construct the transaction data
		const txData = {
			nonce: this.web3.utils.toHex(txCount),
			gasLimit: this.web3.utils.toHex(2000000),
			gasPrice: this.web3.utils.toHex(2e9), // 2 Gwei
			to: address,
			from: this.walletService.publicKey,
			data: nameHexcode
		};

		const tx = await this.sendTransaction(txCount, txData);
		if (tx.name === "Error") {
			console.log('blarg');
			this.changeBlockchainUI("addingPlayerToLeaderboard", "addingPlayerToLeaderboardError");
			this.notify("Adding Player Leaderboard call failed.")
		} else {
			this.changeBlockchainUI("addingPlayerToLeaderboard", undefined);
		}
	}

	createGame = async () => {
		this.setState({ creatingGame: true, creatingGameError: false });
		const gameHexCode = this.web3.eth.abi.encodeFunctionSignature("createGame()");

		const txCount = await this.web3.eth.getTransactionCount(this.walletService.publicKey);
		// construct the transaction data
		const value = this.state.value ? this.state.value : "0";
		const txData = {
			nonce: this.web3.utils.toHex(txCount),
			gasLimit: this.web3.utils.toHex(5000000),
			gasPrice: this.web3.utils.toHex(2e9), // 2 Gwei
			to: address,
			from: this.walletService.publicKey,
			data: gameHexCode,
			value: this.web3.utils.toHex(this.web3.utils.toWei(value, "ether"))
		};


		const tx = await this.sendTransaction(txCount, txData);
		if (tx.name === "Error") {
			this.changeBlockchainUI("creatingGame", "creatingGameError");
			this.notify("Creating Game call failed.")
		} else {
			this.changeBlockchainUI("creatingGame", undefined);
		}

	}

	addSecondPlayerToGame = async () => {
		this.setState({ addingSecondPlayerToGame: true,addingSecondPlayerToGameError: false  });
		const addSecondPlayerHexCode = this.web3.eth.abi.encodeFunctionSignature("addSecondPlayerToGame()");

		const txCount = await this.web3.eth.getTransactionCount(this.walletService.publicKey);
		// construct the transaction data
		const betValue = this.state.betValue ? this.state.betValue : "0";
		const txData = {
			nonce: this.web3.utils.toHex(txCount),
			gasLimit: this.web3.utils.toHex(5000000),
			gasPrice: this.web3.utils.toHex(2e9), // 2 Gwei
			to: address,
			from: this.walletService.publicKey,
			data: addSecondPlayerHexCode,
			value: this.web3.utils.toHex(this.web3.utils.toWei(betValue, "ether"))
		};

		const tx = await this.sendTransaction(txCount, txData);
		if (tx.name === "Error") {
			this.notify("Add second player to game failed.")
			this.changeBlockchainUI("addingSecondPlayerToGame", "addingSecondPlayerToGameError");
		} else {
			this.changeBlockchainUI("addingSecondPlayerToGame", undefined);
		}
	}

	closeGame = async () => {
		this.setState({ closingGame: true, closingGameError: false });

		const closeGameHexCode = this.web3.eth.abi.encodeFunctionSignature("closeGame()");

		const txCount = await this.web3.eth.getTransactionCount(this.walletService.publicKey);

		const txData = {
			nonce: this.web3.utils.toHex(txCount),
			gasLimit: this.web3.utils.toHex(5000000),
			gasPrice: this.web3.utils.toHex(2e9), // 2 Gwei
			to: address,
			from: this.walletService.publicKey,
			data: closeGameHexCode,
		};

		const tx = await this.sendTransaction(txCount, txData);
		if (tx.name === "Error") {
			this.notify("Close game call failed.")
			this.changeBlockchainUI("closingGame", "closingGameError");
		} else {
			this.changeBlockchainUI("closingGame", undefined);
		}
	}

	declareWinner = async () => {
		this.setState({ declaringWinnerCall: true, declaringWinnerCallError: false })
		const winnerHexcode = this.web3.eth.abi.encodeFunctionCall({
			name: "chooseWinner",
			type: "function",
			inputs: [{
				type: 'uint',
				name: '_declaredWinner'
			}]
		},[this.state.chooseWinner]);

		const txCount = await this.web3.eth.getTransactionCount(this.walletService.publicKey);
		// construct the transaction data
		const txData = {
			nonce: this.web3.utils.toHex(txCount),
			gasLimit: this.web3.utils.toHex(1000000),
			gasPrice: this.web3.utils.toHex(2e9), // 2 Gwei
			to: address,
			from: this.walletService.publicKey,
			data: winnerHexcode
		};

		const tx = await this.sendTransaction(txCount, txData);
		if (tx.name === "Error") {
			this.notify("Declare winner call failed.")
			this.changeBlockchainUI("declaringWinnerCall", "declaringWinnerCallError");
		} else {
			this.changeBlockchainUI("declaringWinnerCall", undefined);
			console.log('err', tx.response);
		}
	}

	sendTransaction = async (txCount, txData) => {
		const transaction = new Tx(txData);
		const pk = new Buffer(localStorage.privateKey.substring(2, localStorage.privateKey.length), 'hex')
		console.log('pk', pk);
		transaction.sign(pk);
		const serializedTx = transaction.serialize().toString('hex');
		try {
			const signedTx = await this.web3.eth.sendSignedTransaction('0x' + serializedTx);
			console.log('signedTx', signedTx);
			return signedTx;
		} catch(err) {
			console.log('err', err);
			return err;
		}
	}

	handlePublicKeyCopy = () => {
		this.setState({ copied: true });

		setTimeout( () => {
			this.setState({ copied: false })
		}, 2000);
	}

	notify = (text) => {
		const closeButton = ({ closeToast }) => <button onClick={ closeToast }><i name="close" className="fas fa-times" /></button>;

		if (!toast.isActive(this.toast)) {
			return (
				this.toast = toast(`Error: ${text}`, {
					position: 'bottom-left',
					draggable: false,
					draggablePercent: 0,
					closeButton
				})
			);
		}
		return (
				toast.update(this.toast, {
					render: `Error: ${text}`
				})
		);

	}

	handleViewAccount() {
		this.setState({
			viewHome: false,
			viewGame: false,
			viewAccount: true
		});
	}

	handleNameInput(event) {
    this.setState({name: event.target.value});
  }

	handleOnChangeValue(event) {
		this.setState({ value: event.target.value })
	}

	render() {
		console.log('this.state', this.state);
		return(
			<div className="text-center">
				<ToastContainer  />
				<ProgressLight gameInProgress={ this.state.gameInProgress } />
				<Section sectionClass="bg-light">
					<h1>Playing for Ke[ETH]s</h1>
					<p>A leaderboard and ETH wagering DApp</p>
					<Button color="primary" size="lg" className="mb-5" onClick={ () => this.handleViewAccount() }>Get Started</Button>
					<h3>Leaderboard</h3>
					<Leaderboard players={ this.state.players } />
				</Section>
				<Section>
					<Account
						publicKey={ this.walletService.publicKey }
						copied={ this.state.copied }
						onCopy={ () => this.handlePublicKeyCopy() }
						balance={ this.state.balance }
						contractAddress={ address }
					/>
					<InputPlayerName
						onChange={ this.handleChange }
						value={ this.state.name }
						addingPlayerToLeaderboard={ this.state.addingPlayerToLeaderboard }
						addPlayerToLeaderboard={ () => this.addPlayerToLeaderboard() }
					/>
					<PlayerInformation />
				</Section>
				
				<Section sectionClass="bg-light">
					<CreateGame
						createGame={ () => this.createGame() }
						creatingGame={ this.state.creatingGame }
						value={ this.state.value }
						onChange={ this.handleOnChangeValue }
					/>
				</Section>

				<Section>
					<CurrentGame />
				</Section>

				<Section sectionClass="bg-light">
					<EndGame
						closingGame={this.state.closingGame }
						closeGame={ () => this.closeGame() }
						chooseWinner={ this.state.chooseWinner }
						onChange={ (event) => this.setState({ chooseWinner: event.target.value}) }
						declaringWinnerCall={ this.state.declaringWinnerCall }
						declareWinner={ () => this.declareWinner() }
					/>
				</Section>

				<Section>
					<h2>Add Second Player to Game</h2>
					<div className="form-group">
              <label>Add Player Two. Specify Bet Value if game requires it.</label>
              <input className="form-control" onChange={(event) => {
                this.setState({ betValue: event.target.value })
              }}
              value={this.state.betValue} />
            </div>
					{this.state.addingSecondPlayerToGame && <p>Transaction pending...</p>}
					{!this.state.addingSecondPlayerToGame && <button onClick={() => this.addSecondPlayerToGame()} className="btn btn-primary">Add Player Two</button>}
				</Section>

				<Section sectionClass="bg-light">
					{this.state.gameInProgress ? 
						<div>
							<h2>Current Game</h2>
							<ul className="list-group">
								<li className="list-group-item">ID: {this.state.game.id}</li>
								<li className="list-group-item">Player One: {this.state.game.firstPlayer}</li>
								<li className="list-group-item">Player Two: {this.state.game.secondPlayer}</li>
								<li className="list-group-item">Bet: {this.web3.utils.fromWei(this.state.game.bet)} ETH</li>
								<li className="list-group-item">Pot: {this.web3.utils.fromWei(this.state.game.pot)} ETH</li>
								<li className="list-group-item">P1 Declared Winner: {this.state.game.declaredWinnerFirstPlayer}</li>
								<li className="list-group-item">P2 Declared Winner: {this.state.game.declaredWinnerSecondPlayer}</li>
							</ul>
						</div>
					: null}
				</Section>
			</div>
		)
	}
}

export default Home;
