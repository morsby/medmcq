import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import _ from 'lodash';

import {
    Container,
    Header,
    Dropdown,
    Divider,
    Button,
    Message,
} from 'semantic-ui-react';

import SelectionNSelector from './SelectionSettings/SelectionNSelector';
import SelectionSetSelector from './SelectionSettings/SelectionSetSelector/SelectionSetSelector';
import SelectionSpecialtiesSelector from './SelectionSettings/SelectionSpecialtiesSelector';
import SelectionTypeSelector from './SelectionSettings/SelectionTypeSelector';
import SelectionMessage from './SelectionMessage/SelectionMessage';

import Footer from '../Layout/Footer';
import { default as UIHeader } from '../Layout/Header';

import { semestre, urls } from '../../utils/common';
import { specialer as specialerCommon } from '../../utils/common';

class SelectionMain extends Component {
    state = { err: [] };

    constructor(props) {
        super(props);

        this.onSettingsChange = this.onSettingsChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.settings.questions.length === 0) {
            let name = 'semester';
            let value = 7;
            let e = null;

            this.onSettingsChange(e, { name, value });
        }
    }

    onSettingsChange(e, { value, name }) {
        this.setState({ err: [] });

        this.props.changeSettings({ type: name, value });
    }

    handleSubmit(quizType) {
        let err = [];

        let {
            n,
            semester,
            type,
            set,
            questions,
            specialer,
        } = this.props.settings;

        // Når den er tom modtager den fuldt antal
        console.log(questions.length);

        // VALIDATION
        // Question.length = Antallet af spørgsmål for et semester eller speciale
        // Semester
        if (!semester) {
            err.push('Du skal vælge et semester først!');
        }

        //Specialer
        if (type === 'specialer' && specialer.length === 0) {
            err.push('Du skal vælge mindst ét speciale.');
        }

        // Sæt
        if (type === 'set' && !set) {
            err.push('Du skal vælge et sæt for at kunne starte!');
            if (semester === 11) {
                err.push('You have to select a set to start.');
            }
        }

        // Findes der spørgsmål?
        if (questions.length === 0) {
            err.push('Der er ingen spørgsmål for det valgte semester.');
            if (semester === 11) {
                err.push('There are no questions for the selected semester.');
            }
        }

        if (!n) {
            err.push('Du skal vælge et antal spørgsmål.');
            if (semester === 11) {
                err.push('You must select a number of questions.');
            }
        }

        if (n > 300) {
            err.push('Du har valgt for mange spørgsmål');
            if (semester === 11) {
                err.push('You have picked too many questions');
            }
        }

        if (n < 0) {
            err.push('Antal spørgsmål kan ikke være negativt');
            if (semester === 11) {
                err.push(
                    'The number of questions can not be a negative number'
                );
            }
        }

        // tjek for fejl, start eller ej
        if (err.length === 0) {
            if (quizType === 'new') {
                this.props.getQuestions(this.props.settings);
            }
            this.props.history.push(urls.quiz);
        } else {
            this.setState({ err });
        }
    }

    render() {
        let {
            semester,
            specialer,
            type,
            n,
            onlyNew,
            questions,
            sets,
            set,
        } = this.props.settings;
        let { user } = this.props,
            answeredQuestions;
        if (
            this.props.user &&
            this.props.user.hasOwnProperty('answeredQuestions')
        ) {
            answeredQuestions = user.answeredQuestions[semester];
        }

        // Laver et array af specialer for semesteret
        let uniques = specialerCommon[semester].map(s => s.value);

        // Grupperer de fundne spørgsmål efter specialer
        let questionsBySpecialty = _.countBy(
            // Laver et flat array af alle i spg indeholdte specialer
            _.flattenDeep(questions.map(a => a.specialty)),
            e => {
                return uniques[uniques.indexOf(e)];
            }
        );

        // Tjekker hvor mange der er valgt
        let antalValgte = 0;
        specialer.map(s => {
            let n = questionsBySpecialty[s] ? questionsBySpecialty[s] : 0;
            return (antalValgte = antalValgte + n);
        });

        return (
            <div className="flex-container">
                <UIHeader />
                <Container className="content">
                    <Header as="h1">
                        MCQ-items fra medicin - Aarhus Universitet
                    </Header>
                    <Header as="h3">Vælg semester</Header>
                    <Dropdown
                        placeholder="Vælg semester"
                        fluid
                        selection
                        options={semestre}
                        name="semester"
                        value={semester}
                        onChange={this.onSettingsChange}
                    />
                    <Divider hidden />
                    <SelectionTypeSelector
                        handleClick={this.onSettingsChange}
                        type={type}
                    />

                    <Divider hidden />

                    {type !== 'set' && (
                        <SelectionNSelector
                            n={n}
                            onlyNew={onlyNew}
                            onChange={this.onSettingsChange}
                            total={questions.length}
                            user={user}
                            semester={semester}
                        />
                    )}

                    {type === 'set' && (
                        <SelectionSetSelector
                            questions={questions}
                            sets={sets}
                            activeSet={set}
                            semester={semester}
                            answeredQuestions={answeredQuestions}
                            onChange={this.onSettingsChange}
                        />
                    )}

                    {type === 'specialer' && (
                        <SelectionSpecialtiesSelector
                            semester={semester}
                            questions={questions}
                            valgteSpecialer={specialer}
                            antalPerSpeciale={questionsBySpecialty}
                            onChange={this.onSettingsChange}
                        />
                    )}

                    {this.state.err.length > 0 && (
                        <Message negative>
                            {this.state.err.map(err => {
                                return <p key={err}>{err}</p>;
                            })}
                        </Message>
                    )}
                    <SelectionMessage user={user} type={type} />
                    <Button
                        onClick={() => this.handleSubmit('new')}
                        disabled={antalValgte < 1 && type === 'specialer'}
                    >
                        Start!
                    </Button>
                    <Divider hidden />
                    {this.props.answers.length > 0 && (
                        <Button onClick={() => this.handleSubmit('cont')}>
                            Fortsæt med igangværende spørgsmål
                        </Button>
                    )}
                    {user && (
                        <Message warning>
                            <Message.Header>Lidt ustabilitet...</Message.Header>
                            <p>
                                Der er desværre lidt ustabilitet i den funktion,
                                der gemmer hvilke spørgsmål, du har besvaret
                                (... eller i hvert fald burde gøre det). Så hvis
                                du kører fulde eksamenssæt, må du foreløbig selv
                                holde styr på, hvilke sæt, du har besvaret. Det
                                betyder desværre også, at funktionen "
                                <em>
                                    Giv mig kun spørgsmål, jeg ikke har svaret
                                    på tidligere
                                </em>
                                " ikke helt holder det, den lover.
                            </p>
                        </Message>
                    )}
                </Container>
                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        settings: state.settings,
        answers: state.answers,
        user: state.auth.user,
    };
}

export default connect(
    mapStateToProps,
    actions
)(SelectionMain);
