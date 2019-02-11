import React from 'react';

import { Container, Message } from 'semantic-ui-react';

import Header from '../../Layout/Header';
import Footer from '../../Layout/Footer';
import SignupForm from './SignupForm';

/**
 * Component der viser info om registrering.
 */
const Signup = () => {
    return (
        <div className="flex-container">
            <Header />
            <Container className="content">
                <h3>Her kan du tilmelde dig</h3>
                <SignupForm />
                <Message info>
                    <Message.Header>
                        Information om dit privatliv
                    </Message.Header>
                    <Message.Content>
                        <p>
                            Hvis du vælger at oprette en bruger, gemmes dine
                            oplysninger på en AU-server. Data deles ikke med
                            andre under nogen omstændigheder.
                        </p>
                        <p>
                            Du kan oprette en bruger <em>uden</em> at indtaste
                            en emailadresse og på den måde være anonym. Det
                            betyder dog, at glemmer du dine login-oplysninger,
                            er brugeren tabt.
                        </p>
                        <p>
                            Vælger du at indtaste din email adresse, vil du
                            udelukkende modtage mails, hvis du selv beder om at
                            få nulstillet dit kodeord. Der vil aldrig blive
                            sendt andre mails, og din mailadresse vil aldrig
                            blive delt.
                        </p>
                        <p>
                            Hvis du beslutter dig for at oprette en bruger, vil
                            der - når du logger ind - sættes en cookie, der
                            husker dig til næste gang. I denne cookie er
                            udelukkende information om, at du er logget ind, og
                            den bliver ikke brugt til tracking eller lignende.
                        </p>
                    </Message.Content>
                </Message>
            </Container>
            <Footer />
        </div>
    );
};

export default Signup;
