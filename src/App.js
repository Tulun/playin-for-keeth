import React, { Component } from 'react'
import {Jumbotron} from 'reactstrap';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Tx from 'ethereumjs-tx'
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';

// Services
import WalletService from './services/Wallet'

// Address
import address from './address';

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
			declaringWinnerCallError: false
		}
		// wallet stuff
		this.walletService = new WalletService();

		this.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws'));
	}

	async componentDidMount() {
		const balance = await this.web3.eth.getBalance(this.walletService.publicKey);		
		const gameInProgress = await leaderboard.methods.gameInProgress().call();
		this.setState({ 
			gameInProgress,
			balance: `${this.web3.utils.fromWei(balance)}` 
		});

		const player = await leaderboard.methods.player(this.walletService.publicKey).call();

		console.log('p', player);
    
    // watch game progress changes
    leaderboard.events.allEvents({fromBlock: `0`, toBlock: "latest"}, async (error, result) => {
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
<<<<<<< HEAD
  }
  
  handleError(err) {
    console.error(err);
  }

  scanQR(){

  }

  render() {

    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <p className="mb-0">
              Playing for keETHs
            </p>
          </header>
           
          {/* <Route path="/:contract" component={Home} /> */}
          {/* Temp for testing. */}
          {/* <Route path="/" component={Home} /> */}
          <Route path="*" component={Home} />
        </div>
      </Router>
    );
  }
=======
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
				type: 'string',
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

	render() {
		return(
			<div className="text-center">
				<ToastContainer  />
				<Jumbotron>
					<h1>Your ETH Wallet Public Key</h1>
					<p>Fund me to play!</p>
					<p className="address">{this.walletService.publicKey}</p>
					{this.state.copied &&
						<p className="success">Copied to clipboard.</p>
					}
          <CopyToClipboard text={this.walletService.publicKey}
            onCopy={() => this.handlePublicKeyCopy()}>
            <button className="btn btn-primary">Copy Wallet Address</button>
          </CopyToClipboard>
					<p>Balance: {this.state.balance} ETH</p>
					<h3 className="address">Contract Address: {address}</h3>
					<h3>Game In Progress: {`${this.state.gameInProgress}`}</h3>
				</Jumbotron>
				<Jumbotron>
					<div className="row">
						<div className="col-xs-12 col-sm-12 col-md-12">
							{this.state.players.length ? 
								<div className='table-responsive'>
									<table className="Home-table table">
										<thead className="Home-table-head">
											<tr className="Home-table-body">
												<th scope="col">ID</th>
												<th scope="col">Name</th>
												<th scope="col">Address</th>
												<th scope="col">Wins</th>
												<th scope="col">Losses</th>
												<th scope="col">Ties</th>
											</tr>
										</thead>
										<tbody className="Home-table-body">
											{this.state.players.map( (player, index) => {
												return (
													<tr className="Home-table-row" key={index}>
														<th scope="row">{index}</th>
														<th scope="col">{player.name}</th>
														<th scope="col">{player.playerAddress}</th>
														<th scope="col">{player.wins}</th>
														<th scope="col">{player.losses}</th>
														<th scope="col">{player.ties}</th>
													</tr>
												)
											})}
										</tbody>
									</table>
								</div>
							: null }
						</div>
					</div>
				</Jumbotron>
				<Jumbotron>
					<h2>Add Player to Leaderboard</h2>
					<div className="form-group">
              <label>Input Name:</label>
              <input className="form-control" onChange={(event) => {
                this.setState({ name: event.target.value })
              }}
              value={this.state.name} />
            </div>
					{this.state.addingPlayerToLeaderboard && <p>Transaction pending...</p>}
					{!this.state.addingPlayerToLeaderboard && 
						<button onClick={() => this.addPlayerToLeaderboard()} className="btn btn-primary">Signup for Leaderboard</button>
					}
				</Jumbotron>
				<Jumbotron>
					<h2>Create Game</h2>
					<div className="form-group">
              <label>Add ETH amount to input if you want to gamble, otherwise just click button</label>
              <input className="form-control" onChange={(event) => {
                this.setState({ value: event.target.value })
              }}
              value={this.state.value} />
            </div>
					{this.state.creatingGame && <p>Transaction pending...</p>}
					{!this.state.creatingGame && 
						<button onClick={() => this.createGame()} className="btn btn-primary">Create Game</button>
					}
				</Jumbotron>
				<Jumbotron>
					<h2>Close Game</h2>
					<div className="form-group">
            <label>Ends game immediately. Any bet is returned to user.</label>
          </div>
					{this.state.closingGame && <p>Transaction pending...</p>}
					{!this.state.closingGame && <button onClick={() => this.closeGame()} className="btn btn-primary">Close Game</button>}
				</Jumbotron>
				<Jumbotron>

				<Jumbotron>
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
				</Jumbotron>

					<h2>Choose Winner</h2>
					<div className="row">
						<div className="col-xs-12 col-sm-12 col-md-12">
							<div className="form-group">
								<label>Choose Winner</label>
								<select value={this.state.chooseWinner} onChange={(event) => this.setState({ chooseWinner: event.target.value}) }>
									<option value="">--Choose Winner--</option>
									<option value="first">First Player</option>
									<option value="second">Second Player</option>
									<option value="tie">Tie</option>
								</select>
							</div>
						</div>
					</div>
					{this.state.declaringWinnerCall && <p>Transaction pending...</p>}
					{!this.state.declaringWinnerCall && <button onClick={() => this.declareWinner()} className="btn btn-primary">Choose Winner</button>}
				</Jumbotron>
				<Jumbotron>
					{this.state.gameInProgress ? 
						<div className="row">
							<div className="col-xs-12 col-sm-12 col-md-12">
								<h2>Current Game</h2>
								<ul className="list-group">
									<li className="list-group-item">ID: {this.state.game.id}</li>
									<li className="list-group-item">Player One: {this.state.game.firstPlayer}</li>
									<li className="list-group-item">Player Two: {this.state.game.secondPlayer}</li>
									<li className="list-group-item">Bet: {this.state.game.bet}</li>
									<li className="list-group-item">Pot: {this.state.game.pot}</li>
									<li className="list-group-item">P1 Declared Winner: {this.state.game.declaredWinnerFirstPlayer}</li>
									<li className="list-group-item">P2 Declared Winner: {this.state.game.declaredWinnerSecondPlayer}</li>
								</ul>
							</div>
						</div>
					: null}
				</Jumbotron> 
			</div>
		)
	}
>>>>>>> master
}

export default Home;
