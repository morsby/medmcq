import React from 'react';
import Countdown from 'react-countdown';
import { Button, Divider, Grid, Icon, Image, Message } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import image from './tj_profile.jpg';
import settingsReducer from 'redux/reducers/settings';
import Log from 'classes/log.class';

interface SelectionCountdownProps {}

const SelectionCountdown = (props: SelectionCountdownProps) => {
  const dispatch = useDispatch();
  const hasVoted = useSelector((state: ReduxState) => state.settings.hasVoted);
  const user = useSelector((state: ReduxState) => state.auth.user);

  const openVoting = async (name: string) => {
    dispatch(settingsReducer.actions.toggleHasVoted());
    await Log.create({ name });
  };

  if (hasVoted)
    return (
      <Button
        basic
        color="green"
        fluid
        onClick={() => {
          window.open('https://e-vote.dk/e-valg-afstemning/faces/Afstemning', '_blank');
          openVoting('voted again');
        }}
      >
        Tak for din stemme! <Icon name="heart outline" />
        Fik du ikke stemt? Tryk her.
      </Button>
    );
  return (
    <Message style={{ border: '2px solid red' }}>
      <div
        style={{
          textAlign: 'center',
          fontSize: '2em',
          color: 'red',
          fontWeight: 'bolder',
          marginBottom: '5px'
        }}
      >
        <Countdown date={new Date(2020, 10, 12, 16)} />
      </div>
      <Divider hidden />
      <h2 style={{ textAlign: 'center' }}>
        {user
          ? `${user.username.toTitleCase()}, jeg har brug for din hjælp`
          : 'Jeg har brug for din hjælp'}
        . Stem til universitetsvalget inden d. 12 November!
      </h2>
      <Divider />
      <Grid stackable columns="equal">
        <Grid.Column verticalAlign="middle" width="4">
          <Grid.Row>
            <Image src={image} size="medium" />
            <p style={{ textAlign: 'center' }}>
              Thomas Jensen (Thjen)
              <br />
              Udvikler af MedMCQ
            </p>
          </Grid.Row>
        </Grid.Column>
        <Grid.Column>
          <Grid.Row verticalAlign="middle">
            <p>
              Jeg hedder Thomas Jensen (også kendt her på siden som Thjen). De sidste 3 år har jeg
              repræsenteret medicin i studienævnet, og har gennem denne indflydelse blandt andet
              sikret, at MedMCQ er frit tilgængeligt for alle studerende og løbende får de nyeste
              eksamenssæt lagt ind. Men det er blot en lille del af vores samlede indsats, og du kan
              finde langt mere information på vores{' '}
              <a href="https://www.facebook.com/MedicinerraadAU" target="__blank">
                facebook side
              </a>
              .
            </p>
            <h2 style={{ textAlign: 'center' }}>Der er normalt fredsvalg, men ikke i år.</h2>
            <p>
              Vi fører næsten aldrig valgkamp, men andre partier vil i år gøre valget politisk i
              stedet for studenter orienteret. Vores opposition er et bredt politisk parti, som ikke
              er i kontakt med os på medicin.{' '}
            </p>
            <p style={{ color: 'red', textAlign: 'center' }}>
              De går ind for lavere SU, omlægning af alt SU til lån, færre studiepladser og mindre
              kvote 2 optagelser.
            </p>
            <p>
              Dette er vi stærkt imod. Medicinerrådet er skabt af studerende for studerende. Vi har
              hårdtarbejdende semesterrepræsentanter, som sikrer at vi er i løbende dialog med alle
              studerende og undervisere. Vi har representanter i alle uddannelsesansvarlige nævn på
              universitet. Derudover har vi en åben email tilknyttet en fast sekretær, hvor I altid
              kan komme i kontakt med os, og vi svarer altid på vores{' '}
              <a href="https://www.facebook.com/MedicinerraadAU" target="__blank">
                facebook side
              </a>
              .
            </p>
            <p>
              Stem på mig eller på medicinerrådet til universitetsvalget for at sikre de
              medicinstuderendes inflydelse på deres egen uddannelse. Får medicinerrådet samlet 6
              gange så mange stemmer som de andre partier, kan vi med flertal i studienævnet sørge
              for at ændringer kun foretages til de studerendes fordel.
            </p>
            <h2 style={{ textAlign: 'center' }}>Din stemme er meget vigtig!</h2>
            <Button
              onClick={() => {
                window.open('https://e-vote.dk/e-valg-afstemning/faces/Afstemning', '_blank');
                openVoting('voted');
              }}
              fluid
              color="green"
              style={{ cursor: 'pointer' }}
            >
              Stem på Thomas Jensen eller medicinerrådet nu.
              <br />
              Kom direkte til stemmesiden ved at trykke her. Af hjertet tak fra os alle.
            </Button>
            <p>
              Ps. tak fordi I bliver ved med at bruge MedMCQ. Det er en stor fornøjelse, at hjælpe
              så mange af jer med oplæsning til eksamen <Icon name="heart outline" />
            </p>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </Message>
  );
};

export default SelectionCountdown;
