import IntlMessage from 'components/util-components/IntlMessage';
import React from 'react';

export default function Footer() {
	return (
		<footer className="footer">
			<span>&copy;  {`${new Date().getFullYear()}`} <IntlMessage id="copyright" />
				<span className="font-weight-semibold"></span>
			</span>
		</footer>
	)
}

