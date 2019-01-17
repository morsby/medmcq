import React from "react";
import { withRouter } from "react-router";
import { Container, Icon, Button, Menu } from "semantic-ui-react";
import { urls } from "../../utils/common";

const Footer = props => {
    const paragraphStyle = {
        display: 'block',
    };

    const handleClick = path => {
        props.history.push(path);
    };
    return (
            <Menu inverted color='blue'>
                <Menu.Item style={paragraphStyle}>
                    <p>Siden er lavet med tilladelse fra Institut for Klinisk
                        Medicin, Health, Aarhus Universitet.</p>
                        <Icon name="heartbeat" />Sigurd Morsby Larsen
                </Menu.Item>
                <Menu.Menu position='right'>
                    
                    {props.history.location.pathname !== urls.about && (
                        <Menu.Item>
                            <Icon
                                name='question circle outline'
                                onClick={() => handleClick(urls.about)} />
                                Om siden
                        </Menu.Item>
                    )}
                    
                </Menu.Menu>
            </Menu>
    );
};

export default withRouter(Footer);
