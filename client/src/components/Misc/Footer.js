import React from "react";
import { withRouter } from "react-router";
import { Container, Icon, Button, Menu } from "semantic-ui-react";
import { urls } from "../../utils/common";

const Footer = props => {
    const paragraphStyle = {
        display: 'block',
        width: '65%',
    };

    const footerStyle = {
        margin: '10px 0 0 0',
        width: '100%'
    }

    const handleClick = path => {
        props.history.push(path);
    };
    return (
            <footer style={footerStyle}>
                <Menu inverted color='blue'>
                    <Menu.Item style={paragraphStyle}>
                        <p>Siden er lavet med tilladelse fra Institut for Klinisk
                            Medicin, Health, Aarhus Universitet.</p>
                            <Icon name="heartbeat" />Sigurd Morsby Larsen
                    </Menu.Item>
                    <Menu.Menu position='right'>
                        
                        {props.history.location.pathname !== urls.about && (
                            <Menu.Item onClick={() => handleClick(urls.about)}>
                                <Icon name='question circle outline' />
                                    <p>Om siden</p>
                            </Menu.Item>
                        )}

                    </Menu.Menu>
                </Menu>
            </footer>
    );
};

export default withRouter(Footer);
