import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { Grid, Icon, Container, Menu } from 'semantic-ui-react';
import { urls } from '../../utils/common';
import { Translate, withLocalize, LocalizeContextProps } from 'react-localize-redux';
import layoutTranslations from './layoutTranslations.json';

/**
 * Footer component.
 */

export interface FooterProps extends LocalizeContextProps {}

const Footer: React.SFC<FooterProps> = ({ addTranslation }) => {
  const history = useHistory();

  useEffect(() => {
    addTranslation(layoutTranslations);
  });

  const iconStyle = {
    float: 'none',
    marginRight: '3px',
  };

  const footerStyle = {
    backgroundColor: 'rgb(0,61,115)',
    margin: '10px 0 0 0',
    padding: '1rem',
    width: '100%',
    color: '#fff',
  };

  const handleClick = (path) => {
    history.push(path);
  };

  return (
    <footer style={footerStyle}>
      <Container>
        <Grid>
          <Grid.Row>
            <Grid.Column largeScreen={12} computer={12} tablet={10} mobile={16}>
              <p>
                <Translate id="footer.permission" />
              </p>
              <div>
                <Icon name="heartbeat" /> <Translate id="footer.developed_by" />
              </div>
              <div>
                <Icon name="sitemap" /> <span>Version 2.1.0</span>
              </div>
            </Grid.Column>
            <Grid.Column largeScreen={4} computer={4} tablet={6} mobile={16}>
              <Menu secondary vertical inverted fluid>
                <Menu.Item onClick={() => handleClick(urls.contact)}>
                  <Icon name="send" style={iconStyle} />
                  <Translate id="footer.contact_link" />
                </Menu.Item>

                <Menu.Item onClick={() => handleClick(urls.about)}>
                  <Icon name="question circle outline" style={iconStyle} />
                  <Translate id="footer.about_link" />
                </Menu.Item>
              </Menu>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </footer>
  );
};

export default withLocalize(Footer);
