import React, { Component } from 'react'
import {Button} from 'reactstrap';
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
import PlayerInformation from './components/playerInformation/PlayerInformation';
import Section from './components/section/Section';
import CreateGame from './components/createGame/CreateGame';
import CurrentGame from './components/currentGame/CurrentGame';
import EndGame from './components/endGame/EndGame';
import JoinGame from './components/JoinGame/JoinGame';
import Navbar from "./components/navbar/Navbar";

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
			player: {
				name: "",
				rank: 0,
				wins: 0,
				losses: 0,
				ties: 0,
			},
			balance: 0,
			betValue: "",
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
			pages: {
				viewHome: true,
				viewAccount: false,
				viewCreateGame: false,
				viewCurrentGame: false,
				viewEndGame: false,
			},
			tooltipOpen: false,
		}

		// wallet stuff
		this.walletService = new WalletService();
		// web 3
		this.web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws'));
	}

	async componentDidMount() {
		const balance = await this.web3.eth.getBalance(this.walletService.publicKey);		
		const gameInProgress = await leaderboard.methods.gameInProgress().call();
		const game = await leaderboard.methods.game().call();
		const currentBlock = await this.web3.eth.getBlock("latest");
		const numPlayers = await leaderboard.methods.totalNumPlayers().call();
		
		console.log('cb', currentBlock);
		console.log(numPlayers);
		
		const initialPlayers = [];
		if (numPlayers > 0) {
			for (let i=0; i < numPlayers; i++) {
				const player = await leaderboard.methods.players(i).call();
				initialPlayers.push(player);
			}
		}

		// Determine player info.
		let initialPlayer = {
			name: "",
			rank: 0,
			wins: 0,
			losses: 0,
			ties: 0,
		};

		initialPlayers.map( pl => {
			if (pl.playerAddress.toLowerCase() === this.walletService.publicKey.toLowerCase()) {
				initialPlayer = pl;
			}
		});

		this.setState({ 
			gameInProgress,
			balance: `${this.web3.utils.fromWei(balance)}`,
			game,
			players: initialPlayers,
			player: initialPlayer
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
          const player = await leaderboard.methods.players(parseInt(result.returnValues[0])).call();
          players[parseInt(result.returnValues[0])] = player;
					console.log('in result', players);

          return this.setState({ players, player });
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

		console.log('name', this.state.name)
		
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
		const value = this.state.betValue ? this.state.betValue
		 : "0";
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

	handleInputChange = (event, state) => {
    this.setState({[state]: event.target.value});
  }

	toggle = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
	}
	
	handleViewPage = (page) => {
		switch(page) {
			case "home" :
				this.setState({
					pages: {
						viewHome: true,
						viewAccount: false,
						viewCreateGame: false,
						viewCurrentGame: false,
						viewEndGame: false,
					}
				});
				break;
			case "account": 
				this.setState({
					pages: {
						viewHome: false,
						viewAccount: true,
						viewCreateGame: false,
						viewCurrentGame: false,
						viewEndGame: false,
					}
				});
				break;
			case "createGame":
				this.setState({
					pages: {
						viewHome: false,
						viewAccount: false,
						viewCreateGame: true,
						viewCurrentGame: false,
						viewEndGame: false,
					}
				});
				break;
			case "viewCurrentGame":
				this.setState({
					pages: {
						viewHome: false,
						viewAccount: false,
						viewCreateGame: false,
						viewCurrentGame: true,
						viewEndGame: false,
					}
				});
				break;
			case "viewEndGame":
				this.setState({
					pages: {
						viewHome: false,
						viewAccount: false,
						viewCreateGame: false,
						viewCurrentGame: false,
						viewEndGame: true,
					}
				});
				break;
			default:
				return null;
		}

	}

	render() {		
		let pot = '';
		if(this.state.game.pot) {
			console.log('pot', this.web3.utils.fromWei(this.state.game.pot));	
		}

		console.log(this.state)

		return(
			<div className="container text-center py-5">
				<Navbar handleViewPage={this.handleViewPage} />
				<ToastContainer  />
				<ProgressLight gameInProgress={ this.state.gameInProgress } />

				{ this.state.pages.viewHome && 
					<div className="Home">
						<h1>Playing for Ke[ETH]s</h1>
						<p>A leaderboard and ETH wagering DApp</p>
						<div className="mb-5"	>
							{ this.state.gameInProgress ?
									<Button color="primary" size="lg" onClick={ () => this.handleViewPage('viewCurrentGame') }>View Current Game</Button>
								:
									<Button color="primary" size="lg" onClick={ () => this.handleViewPage('account') }>Get Started</Button>
							}
						</div>
						<h3>Leaderboard</h3>
						<Leaderboard players={ this.state.players } />
					</div>
				}

				{ this.state.pages.viewAccount &&
					<div className="Account">
						<Account
							publicKey={ this.walletService.publicKey }
							copied={ this.state.copied }
							onCopy={ () => this.handlePublicKeyCopy() }
							balance={ this.state.balance }
							contractAddress={ address }
							tooltipOpen={ this.state.tooltipOpen}
							toggle={ this.toggle }
						/>
						<PlayerInformation
							handleViewPage={this.handleViewPage}
							player={ this.state.player }
							handleInputChange={ this.handleInputChange }
							value={ this.state.name }
							addingPlayerToLeaderboard={ this.state.addingPlayerToLeaderboard }
							addPlayerToLeaderboard={ () => this.addPlayerToLeaderboard() }
						/>
						{ this.state.gameInProgress ?
							<Button color="primary" size="lg" className="mt-5" onClick={ () => this.handleViewPage('createGame') }>Create Game</Button>
							:
							<Button color="primary" size="lg" className="mt-5" onClick={ () => this.handleViewPage('viewCurrentGame') }>View Current Game</Button>
						}
						
					</div>
				}
				
				{ this.state.pages.viewCreateGame &&
					<div className="CreateGame">
						<CreateGame
							createGame={ () => this.createGame() }
							creatingGame={ this.state.creatingGame }
							value={ this.state.betValue }
							handleInputChange={ this.handleInputChange }
						/>
					</div>
				}
				
				{ this.state.pages.viewCurrentGame &&
					<Section>
						<CurrentGame
							// endGame={}
							game={this.state.game}
							gameInProgress={this.state.gameInProgress}
							pot={pot}
						/>
					</Section>
				}

				{ this.state.pages.viewEndGame &&
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
				}

				{ this.state.viewJoinGame &&
					<Section>
						<JoinGame addSecondPlayerToGame={ () => this.addSecondPlayerToGame() } />
					</Section>
				}

			</div>
		)
	}
}

export default Home;
