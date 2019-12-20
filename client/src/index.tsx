import React from 'react';
import ReactDOM from 'react-dom';
import IE11 from 'components/IE11/IE11';

/**
 * Handle errormessage on internet explorer
 */
if (window.navigator.userAgent.match(/(MSIE|Trident)/)) {
  ReactDOM.render(<IE11 />, document.querySelector('#root'));
} else {
  require('./IndexApp');
}
