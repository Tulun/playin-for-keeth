import React from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Styles
import './Account.scss';

const propTypes = {
	contractAddress: PropTypes.string.isRequired,
	balance: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]),
	publicKey: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]),
	copied: PropTypes.bool.isRequired,
	onCopy: PropTypes.func.isRequired,
}

const Account = ({ contractAddress, balance, publicKey, copied, onCopy }) => (
	<div className="Account">
		<h1 className="h2">Your Account</h1>
		<div className="Account-balance">
			<p className="Account-balance-header">Balance:</p>
			<h1 className="Account-balance-funds display-1">{balance} <span className="Account-balance-funds-symbol h6">ETH</span></h1> 
		</div>
		<p>Fund me to play!</p>
		<p className="Account-address">{ publicKey }</p>
		{copied && <p className="success">Copied to clipboard.</p>}
		<CopyToClipboard
			text={ publicKey }
			onCopy={ onCopy }
		>
			<button className="btn btn-primary">Copy Wallet Address</button>
		</CopyToClipboard>
		
		<h6 className="address">Contract Address: {contractAddress}</h6>
	</div>
);

Account.propTypes = propTypes;
export default Account;