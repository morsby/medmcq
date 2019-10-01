import React from 'react';
import { Grid, Image, Divider, Icon, Segment, Button } from 'semantic-ui-react';
import { Translate, withLocalize, LocalizeContextProps } from 'react-localize-redux';
import aboutTranslations from 'components/Misc/Utility-pages/About/aboutTranslations';
import selectionGif from 'images/aboutGifs/selectionGif.gif';
import commentGif from 'images/aboutGifs/commentGif.gif';
import profileGif from 'images/aboutGifs/profileGif.gif';
import metadataGif from 'images/aboutGifs/metadataGif.gif';
import { useHistory } from 'react-router';

export interface FirstTimeModalProps extends LocalizeContextProps {}

const FirstTimeModal: React.SFC<FirstTimeModalProps> = ({ addTranslation }) => {
  const history = useHistory();
  addTranslation(aboutTranslations);

  return (
    <Segment style={{ margin: '2rem auto', maxWidth: '1500px' }}>
      <div style={{ textAlign: 'center' }}>
        <Translate id="firstTime.title" />
      </div>
      <Divider />
      <h2>Information</h2>
      <Translate id="about.frontDisclaimer" />
      <h2>Funktioner</h2>
      <h4>
        <Translate id="firstTime.withoutUserTitle" />
      </h4>
      <Grid divided="vertically" stackable columns="equal">
        <Grid.Row>
          <Grid.Column verticalAlign="middle">
            <Translate id="firstTime.withoutUser" />
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
      <Translate id="firstTime.withUserTitle" />
      <Grid divided="vertically" verticalAlign="middle" columns="equal">
        <Grid.Row style={{ marginTop: '1rem' }}>
          <Grid.Column>
            <Translate id="firstTime.withUser" />
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
      <Divider />
      <div style={{ textAlign: 'center' }}>
        <h3>
          <Translate id="firstTime.haveFun" />
          <Icon name="heartbeat" />
        </h3>
        <Button onClick={() => history.push('/')} size="huge" basic color="green">
          <Translate id="firstTime.begin" />
        </Button>
      </div>
    </Segment>
  );
};

export default withLocalize(FirstTimeModal);
