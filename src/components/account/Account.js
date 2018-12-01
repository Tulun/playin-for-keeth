import React from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const propTypes = {
	gameInProgress: PropTypes.bool.isRequired,
}

const Account = ({ address, balance, publicKey, copied, handlePublicKeyCopy }) => (
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
			onCopy={ handlePublicKeyCopy }
		>
			<button className="btn btn-primary">Copy Wallet Address</button>
		</CopyToClipboard>
		
		<h3 className="address">Contract Address: {address}</h3>
	</div>
);

Account.propTypes = propTypes;
export default Account;