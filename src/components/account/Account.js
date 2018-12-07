import React from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Alert, Tooltip } from 'reactstrap';

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

const Account = ({ contractAddress, balance, publicKey, copied, onCopy, tooltipOpen, toggle }) => (
	<div className="Account">
		<h1 className="h2 mb-3">Your Account</h1>

		<div className="Account-info-container border-top py-5">
			<div className="Account-balance">
				<p className="Account-balance-header mb-0">Balance:</p>
				<h1 className="Account-balance-funds display-4 mb-4">{balance} <span className="Account-balance-funds-symbol h6">ETH</span></h1> 
			</div>
			<Tooltip placement="top" isOpen={tooltipOpen} target="addressToolTip" toggle={toggle}>
				Fund me to play!
			</Tooltip>
			<div className="d-flex justify-content-center" id="addressToolTip">
				<p className="Account-address py-2 px-3 m-0 border rounded">{ publicKey }</p>
				<CopyToClipboard
					text={ publicKey }
					onCopy={ onCopy }
				>
					<button className="btn btn-primary">Copy Wallet Address</button>
				</CopyToClipboard>
			</div>
			{copied && <Alert color="success">Copied to clipboard.</Alert>}
			<small className="d-block pt-2">
				<a
					href={`https://ropsten.etherscan.io/address/${contractAddress}`}
					className="text-muted"
					target="_blank"
					rel="noopener noreferrer"
				>Contract Address: {contractAddress}</a>
			</small>
		</div>
	</div>
);

Account.propTypes = propTypes;
export default Account;