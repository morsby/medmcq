import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import { urls } from '../../../../utils/common';
import { withLocalize, Translate } from 'react-localize-redux';
import aboutTranslations from './aboutTranslations';

import { Container, Message, List, Button, Divider } from 'semantic-ui-react';
import Header from '../../../Layout/Header';
import Footer from '../../../Layout/Footer';

import FancyFunctions from './FancyFunctions';

/**
 * Component til siden "Om-siden".
 */
const About = ({ history, addTranslation }) => {
    addTranslation(aboutTranslations);

    const handleClick = () => {
        history.push(urls.feedback);
    };

    return (
        <div className="flex-container">
            <Header />
            <Container className="content">
                <h1>
                    <Translate id="about.header" />
                </h1>
                <Message warning>
                    <Message.Header>
                        <Translate id="about.notice.header" />
                    </Message.Header>
                    <Translate id="about.notice.body" />
                </Message>

                <FancyFunctions />

                <Divider hidden />
                <Button
                    color="red"
                    content="Giv noget feedback"
                    icon="send"
                    onClick={handleClick}
                    className="click"
                />
                <h2>Privatliv og cookies</h2>
                <p>
                    Siden benytter open source tracking i form af Matomo. Denne
                    er indstillet til at respektere browser-opt-out, ikke at
                    sætte cookies og at anonymisere IP-adresser. Det vil sige,
                    at du er fuldstændig anonym. Data gemmes i min egen database
                    og deles ikke. Data bruges til at skabe et (dermed
                    underestimeret) overslag over brugen af siden.
                </p>
                <p>
                    Siden benytter ingen cookies, med mindre du opretter en
                    bruger og logger ind. I dette tilfælde sættes en cookie, der
                    husker, at du er logget ind til næste gang.
                </p>
            </Container>
            <Footer />
        </div>
    );
};

About.propTypes = {
    /**
     * History er fra ReactRouter
     */
    history: ReactRouterPropTypes.history,
};

export default withLocalize(About);
