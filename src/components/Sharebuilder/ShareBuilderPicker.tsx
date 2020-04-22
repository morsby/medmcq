import React from 'react';
import { Segment, Grid, Divider, Header, Icon, Button, Container } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';

export interface ShareBuilderPickerProps {}

const ShareBuilderPicker: React.SFC<ShareBuilderPickerProps> = () => {
  const history = useHistory();

  return (
    <div className="flex-container">
      <Segment
        className="content"
        style={{ margin: '5rem auto', maxWidth: '1300px' }}
        textAlign="center"
        placeholder
      >
        <Grid columns={2} stackable textAlign="center">
          <Divider vertical>Eller</Divider>

          <Grid.Row verticalAlign="middle">
            <Grid.Column>
              <Header icon>
                <Icon name="search" />
                Byg ved søgning
              </Header>
              <Button primary onClick={() => history.push('/share/search')}>
                Byg
              </Button>
            </Grid.Column>

            <Grid.Column>
              <Header icon>
                <Icon name="world" />
                Byg med links
              </Header>
              <Button primary onClick={() => history.push('/share/links')}>
                Byg
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  );
};

export default ShareBuilderPicker;
