import React, { useState } from 'react';
import ShareBuilder from 'classes/ShareBuilder';
import { Input, Divider, Button, Segment, Container } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
const domain =
  process.env.NODE_ENV === 'production' ? 'https://medmcq.au.dk' : 'http://localhost:3000';

export interface ShareBuilderLinksProps {}

const ShareBuilderLinks: React.SFC<ShareBuilderLinksProps> = () => {
  const [link, setLink] = useState('');
  const [shareLinks, setShareLinks] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const user = useSelector((state: ReduxState) => state.auth.user);
  const shareLink = `${domain}/share/${link}`;

  const handleCreateLink = async () => {
    setSubmitLoading(true);

    const links = shareLinks.split(',');
    let ids = [];
    for (let link of links) {
      const id = Number(link.trim().split(/quiz\/(\d+)/)[1]);
      if (isNaN(id)) continue;
      ids.push(id);
    }

    const link = await ShareBuilder.createShareLink({ questionIds: ids });
    setLink(link);
    setSubmitLoading(false);
  };

  return (
    <div className="flex-container">
      <Segment
        className="content"
        style={{ margin: '5rem auto', maxWidth: '1300px' }}
        textAlign="center"
      >
        <h1>Opret quiz</h1>
        <label>Indsæt dele-links her, adskilt af komma.</label>
        <Input
          fluid
          placeholder="https://medmcq.au.dk/quiz/5, https://medmcq.au.dk/quiz/10, osv..."
          value={shareLinks}
          onChange={(e) => setShareLinks(e.target.value)}
        />

        <Divider />

        {!user ? (
          <>
            <p style={{ color: 'grey' }}>
              Opret en gratis bruger oppe til højre. Dette lader dig også justere dine links på et
              senere tidspunkt
            </p>
            <Button disabled>Du skal være logget ind for at oprette links</Button>
          </>
        ) : (
          <Button
            loading={submitLoading}
            primary
            disabled={!shareLinks || submitLoading}
            onClick={handleCreateLink}
          >
            Opret link
          </Button>
        )}
        {link && (
          <div style={{ border: '2px solid grey', padding: '1rem', margin: '1rem' }}>
            <h3>
              Dette er dit link:{' '}
              <a target="_blank" rel="noopener noreferrer" href={shareLink}>
                {shareLink}
              </a>
            </h3>
            <p>Linket åbner i et nyt vindue. Husk at gemme det hvis du skal bruge det igen.</p>
          </div>
        )}
      </Segment>
    </div>
  );
};

export default ShareBuilderLinks;
