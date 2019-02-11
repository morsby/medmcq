import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { allowedNs } from '../../utils/common';
import { calculateResults } from '../../utils/quiz';

import selectionText from './selection.json';
import { withLocalize, Translate } from 'react-localize-redux';

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
import SelectionSpecialtiesSelector from './SelectionSettings/SelectionSpecialtiesSelector/SelectionSpecialtiesSelector';
import SelectionTypeSelector from './SelectionSettings/SelectionTypeSelector';
import SelectionUniqueSelector from './SelectionSettings/SelectionUniqueSelector';
import SelectionMessage from './SelectionMessage';

import Footer from '../Layout/Footer';
import { default as UIHeader } from '../Layout/Header';

import { semestre, urls } from '../../utils/common';
import { specialer as specialerCommon } from '../../utils/common';

/**
 * Hovedsiden til at håndtere alle valg af spørgsmål.
 * Props beskrives i bunden.
 */
class SelectionMain extends Component {
    state = { err: [] };

    constructor(props) {
        super(props);

        this.props.addTranslation(selectionText);

        this.onSettingsChange = this.onSettingsChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Seeder data hvis det er første besøg.
     */
    componentDidMount() {
        if (this.props.settings.questions.length === 0) {
            let name = 'semester';
            let value = 7;
            let e = null;

            this.onSettingsChange(e, { name, value });
        }
    }

    /**
     * Func der ændrer settings i redux state.
     * @param  {event} e         Event. Bruges ikke.
     * @param  {string} value    Den værdi der sættes
     * @param  {string} name     Den indstilling der ændres
     */
    onSettingsChange(e, { value, name }) {
        this.setState({ err: [] });

        if (name === 'n' && value) value = Number(value);

        this.props.changeSettings({ type: name, value });
    }

    /**
     * Func der (efter validering) henter spørgsmålene
     * @param  {string} quizType Er der tale om en ny quiz eller fortsættelse
     *                           af en gammeL?
     */
    handleSubmit(quizType) {
        let err = [];

        /**
         * Alle de nedenstående variable kommer fra settingsReducer -- de har
         * derfor IKKE noget med selve quiz-spørgsmålene at gøre, og hentes for
         * at kunne tælle antal spørgsmål for hvert semester, speciale m.v.
         */
        let {
            n,
            semester,
            type,
            set,
            questions,
            specialer,
        } = this.props.settings;

        // Når den er tom modtager den fuldt antal

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

        // Antal
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
            // Ny quiz? Hent spørgsmål
            if (quizType === 'new') {
                this.props.getQuestions(this.props.settings);
            }

            // Uanset om det er en ny quiz eller ej – skift url til quizzen.
            this.props.history.push(urls.quiz);
        } else {
            this.setState({ err });
        }
    }

    render() {
        /**
         * Alle de nedenstående variable kommer fra settingsReducer -- de har
         * derfor IKKE noget med selve quiz-spørgsmålene at gøre, og hentes for
         * at kunne tælle antal spørgsmål for hvert semester, speciale m.v.
         */
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

        // Hvis brugeren har svaret på spørgsmål før, så hent disses id.
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
                        <Translate id="static.header" />
                    </Header>
                    <Header as="h3">
                        <Translate id="static.choose_semester" />
                    </Header>
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
                            onChange={this.onSettingsChange}
                            total={questions.length}
                            semester={semester}
                        />
                    )}
                    {user && type !== 'set' && (
                        <SelectionUniqueSelector
                            onlyNew={onlyNew}
                            onChange={this.onSettingsChange}
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
                        disabled={
                            (antalValgte < 1 && type === 'specialer') ||
                            n < allowedNs.min ||
                            n > allowedNs.max
                        }
                    >
                        Start!
                    </Button>
                    <Divider hidden />
                    {calculateResults(this.props.questions).status ===
                        'in_progress' && (
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
                                betyder desværre også, at funktionen &quot;
                                <em>
                                    Giv mig kun spørgsmål, jeg ikke har svaret
                                    på tidligere
                                </em>
                                &quot; ikke helt holder det, den lover.
                            </p>
                        </Message>
                    )}
                </Container>
                <Footer />
            </div>
        );
    }
}

SelectionMain.propTypes = {
    /**
     * Indstillinger der styrer valg af spørgsmål.
     * Bruges til at hente nye spørgsmål.
     * Fra redux.
     */
    settings: PropTypes.object,

    /**
     * Func der kaldes, når der ændres indstillinger. Ændrer Redux state.
     */
    changeSettings: PropTypes.func,

    /**
     * Func der henter nye spørgsmål (ud fra settings) fra API'en.
     */
    getQuestions: PropTypes.func,

    /**
     * Fra ReactRouter.
     */
    history: ReactRouterPropTypes.history,

    /**
     * Brugeren. Bruges bl.a. til at holde styr på tidligere besvarelser.
     */
    user: PropTypes.object,

    /**
     * Evt. allerede hentede spørgsmål. Benyttes til at give muligheden for at
     * fortsætte en tidligere quiz.
     */
    questions: PropTypes.array,
};

function mapStateToProps(state) {
    return {
        settings: state.settings,
        user: state.auth.user,
        questions: state.questions,
    };
}

export default withLocalize(
    connect(
        mapStateToProps,
        actions
    )(SelectionMain)
);
