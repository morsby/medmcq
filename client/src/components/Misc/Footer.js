import React from 'react';
import { withRouter } from 'react-router';
import { Icon, Menu } from 'semantic-ui-react';
import { urls } from '../../utils/common';

const Footer = props => {
    const paragraphStyle = {
        display: 'block',
        width: '65%',
    };

    const footerStyle = {
        margin: '10px 0 0 0',
        width: '100%',
    };

    const handleClick = path => {
        props.history.push(path);
    };
    return (
        <footer style={footerStyle}>
            <Menu attached inverted color="blue">
                <Menu.Item position="right" style={paragraphStyle}>
                    <p>
                        Siden er lavet med tilladelse fra Institut for Klinisk
                        Medicin, Health, Aarhus Universitet.
                    </p>
                    <Icon name="heartbeat" />
                    {/*Udviklet af*/} Sigurd Morsby Larsen
                    {/* <p><Icon name='graduation cap' />Vedligeholdes og forbedres i samarbejde med 
                            <strong><a href="https://cesu.au.dk"> CESU </a></strong>
                            og Thomas Jensen</p> */}
                </Menu.Item>
                <Menu.Menu position="left">
                    {props.history.location.pathname !== urls.about && (
                        <Menu.Item onClick={() => handleClick(urls.about)}>
                            <Icon name="question circle outline" />
                            <p>Om siden</p>
                        </Menu.Item>
                    )}
                </Menu.Menu>
            </Menu>
        </footer>
    );
};

export default withRouter(Footer);
