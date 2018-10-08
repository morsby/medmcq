import React from "react";
import { withRouter } from "react-router";
import { Container, Icon, Button } from "semantic-ui-react";
import { urls } from "../../utils/common";

const Footer = props => {
    const handleClick = path => {
        props.history.push(path);
    };
    return (
        <footer className="main-footer">
            <Container>
                <div className="footer-text">
                    <p>
                        Siden er lavet med tilladelse fra Institut for Klinisk
                        Medicin, Health, Aarhus Universitet.
                    </p>
                    <p>
                        <Icon name="heartbeat" />Sigurd Morsby Larsen
                    </p>
                </div>
                {props.history.location.pathname !== urls.about && (
                    <Button
                        floated="right"
                        onClick={() => handleClick(urls.about)}
                    >
                        Om siden
                    </Button>
                )}
            </Container>
        </footer>
    );
};

export default withRouter(Footer);
