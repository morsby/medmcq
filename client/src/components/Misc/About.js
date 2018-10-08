import React from "react";

import { urls } from "../../utils/common";

import { Container, Message, List, Button, Divider } from "semantic-ui-react";
import Header from "./Header";
import Footer from "./Footer";

import FancyFunctions from "./FancyFunctions";

const About = ({ history }) => {
    const handleClick = () => {
        history.push(urls.feedback);
    };

    return (
        <div className="flex-container">
            <Header />
            <Container className="content">
                <h1>Om siden</h1>
                <Message warning>
                    <Message.Header>BEMÆRK</Message.Header>
                    <p>
                        Denne side er et frivilligt arbejdsredskab til dig der
                        vil teste dine MCQ-færdigheder inden for de medicinske
                        specialer der bliver undervist i på Abdomen- og
                        Inflammationssemesteret på kandidatuddannelsen i medicin
                        ved Aarhus Universitet.
                    </p>

                    <p>
                        MCQ-spørgsmål med svar, som du finder her på siden, er
                        alle fra tidligere eksamener afholdt på de to semestre.
                        Af samme årsag skal du derfor være opmærksom på:
                        <List ordered>
                            <List.Item>
                                At ’korrekte’ svar kan have ændret sig siden.
                                Hvad der har været et korrekt svar til en
                                MCQ-eksamen i 2015, vil kunne være et forkert
                                svar i dag.
                            </List.Item>
                            <List.Item>
                                At pensum kan have ændret sig siden. Du vil
                                altså kunne opleve spørgsmål, der relaterer sig
                                til sygdomme som du ikke længere vil blive
                                eksamineret i. Omvendt kan du også opleve, at
                                der ikke er spørgsmålseksempler på sygdomme som
                                du vil kunne blive eksamineret i, i dag.
                            </List.Item>
                            <List.Item>
                                At flere spørgsmål fra tidligere eksamener har
                                været lavet under forudsætning af at
                                eksaminationen var med ’åben bog’ (eksamen med
                                hjælpemidler). Pt. er de fleste MCQ-eksamener
                                med ’lukket bog’, dvs. uden hjælpemidler. Dette
                                kan bl.a. have indflydelse på
                                kompleksitetsgraden af spørgsmålene.
                            </List.Item>
                        </List>
                    </p>

                    <p>
                        Det er altid dit eget ansvar at holde dig ovenfor
                        stående for øje og du vil derfor ikke kunne få medhold i
                        en evt. eksamens-klagesag, med baggrund i denne sides
                        materialer. Hverken Institut for Klinisk Medicin, Aarhus
                        Universitet eller udvikler af systemet, Sigurd Morsby
                        Larsen, efterredigerer spørgsmål og svar hvorfor
                        spørgsmål og svar fremstår som da de blev anvendt ved
                        den konkrete MCQ-eksamen.
                    </p>
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
            </Container>
            <Footer />
        </div>
    );
};

export default About;
