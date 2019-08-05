import React from 'react';
import * as types from 'actions/types';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from 'reducers';
import { Modal, Button, Message, Grid, Image, Divider, Icon } from 'semantic-ui-react';
import { Translate, withLocalize, LocalizeContextProps } from 'react-localize-redux';
import aboutTranslations from 'components/Misc/Utility-pages/About/aboutTranslations';
import selectionGif from 'images/aboutGifs/selectionGif.gif';
import commentGif from 'images/aboutGifs/commentGif.gif';
import profileGif from 'images/aboutGifs/profileGif.gif';
import metadataGif from 'images/aboutGifs/metadataGif.gif';

export interface FirstTimeModalProps extends LocalizeContextProps {}

const FirstTimeModal: React.SFC<FirstTimeModalProps> = ({ addTranslation }) => {
  addTranslation(aboutTranslations);
  const dispatch = useDispatch();
  const user = useSelector((state: IReduxState) => state.auth.user);
  const isFirstTime = useSelector((state: IReduxState) => state.settings.firstTime);

  const handleClose = () => {
    dispatch(types.SET_FIRST_TIME(false));
  };

  if (user) return null;
  return (
    <Modal
      style={{
        position: 'fixed',
        width: '80%',
        top: '10%',
        left: '10%',
        zIndex: 999
      }}
      open={isFirstTime}
    >
      <Modal.Header style={{ textAlign: 'center' }}>Velkommen til medMCQ</Modal.Header>
      <Modal.Content>
        Kære bruger. Hvis du er ny bruger af siden så anbefaler vi dig at læse følgende. Hvis du er
        gammel bruger, så kan det også være du finder funktioner, som du ikke kender til.
        <br />
        Nogle af sidens funktioner afhænger af, om du opretter en gratis bruger eller ej.
        <h5>Funktioner uden bruger</h5>
        <Grid divided="vertically" stackable columns="equal">
          <Grid.Row>
            <Grid.Column verticalAlign="middle">
              <ul>
                <li>
                  Valg af spørgsmål tilfældigt, ud fra specialer eller tags eller ud fra hele
                  eksamenssæt
                </li>
                <li>
                  Besvarelse af 1000-vis af spørgsmål fra tidligere eksamenssæt - helt gratis og
                  uden begrænsning!
                </li>
                <li>Dele spørgsmålene med din læsegruppe eller underviser gennem direkte links.</li>
                <li>
                  Mulighed for at læse kommentarer under spørgsmålene, blandt de 100-vis af
                  kommentarer, der er blevet skrevet på siden.
                </li>
              </ul>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Image src={selectionGif}></Image>
            </Grid.Column>
            <Grid.Column>
              <Image src={commentGif}></Image>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <h3>Oprettelse af bruger</h3>
        <h5>
          Du behøver ikke oprette en gratis bruger, men vær opmærksom på, at du med en bruger får
          flere funktioner:
        </h5>
        <Grid divided="vertically" verticalAlign="middle" columns="equal">
          <Grid.Row>
            <Grid.Column>
              <ul>
                <li>
                  <b>Skrive kommentarer:</b> Du vil have mulighed under spørgsmålene at skrive
                  kommentarer til at hjælpe medstuderende med at forstå et spørgsmål. Vi anbefaler
                  på det kraftigste at du bidrager til fællesskabet med din viden, da det både
                  hjælper din egen forståelse og andres. Når vi hjælper hinanden går det hele en del
                  nemmere. Du kan endda skrive kommentarer helt anonymt!
                </li>
                <li>
                  <b>Private kommentarer:</b> Selvom vi anbefaler at skrive offentlige eller anonyme
                  kommentarer, sådan at alle for gavn af din viden, så har du med en bruger også
                  mulighed for at skrive private kommentarer, som du kun selv kan se.
                </li>
                <li>Gemme spørgsmål, så du kan vende tilbage til dem senere</li>
                <li>Stemme på specialer og tags, for at kategorisere spørgsmålene</li>
                <li>
                  Tilgå din profilside med statistik over hvilke spørgsmål du har besvaret, og
                  hvordan det er gået
                </li>
              </ul>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Image src={metadataGif} />
            </Grid.Column>
            <Grid.Column>
              <Image src={profileGif} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <h3>Vigtig information fra dine undervisere</h3>
        <Message warning>
          <Translate id="about.frontDisclaimer" />
        </Message>
        <Icon name="heartbeat" />
        Du ønskes held og lykke med eksamenslæsningen og god fornøjelse fra os - Sigurd Morsby og
        Thomas Jensen.
      </Modal.Content>
      <Modal.Actions>
        <div style={{ textAlign: 'center' }}>
          <Button size="huge" color="green" onClick={handleClose}>
            Tak for informationen! Tag mig til siden.
          </Button>
        </div>
      </Modal.Actions>
    </Modal>
  );
};

export default withLocalize(FirstTimeModal);
