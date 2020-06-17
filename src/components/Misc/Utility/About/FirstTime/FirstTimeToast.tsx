import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Button } from 'semantic-ui-react';
import {
  withLocalize,
  LocalizeContextProps,
  Translate,
  setActiveLanguage
} from 'react-localize-redux';
import aboutTranslations from 'components/Misc/Utility/About/aboutTranslations';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';

export interface FirstTimeToastProps extends LocalizeContextProps {
  closeToast?: Function;
  language: string;
}

const FirstTimeToast: React.SFC<FirstTimeToastProps> = ({ closeToast, addTranslation }) => {
  const history = useHistory();
  const language = useSelector((state: ReduxState) => state.settings.language);
  const [changedLanguage, setChangedLanguage] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    addTranslation(aboutTranslations);
  }, []);

  const handleClick = () => {
    closeToast();
    history.push('/firsttime');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Translate id="firstTime.toastTitle" />
      <br />
      <Translate id="firstTime.toast" />
      <div style={{ textAlign: 'center', margin: '5px' }}>
        <Button basic inverted onClick={handleClick}>
          <Translate id="firstTime.toastShowMe" />
        </Button>
        <Button basic inverted onClick={() => closeToast()}>
          <Translate id="firstTime.toastNoThanks" />
        </Button>
      </div>
      {language === 'dk' && !changedLanguage && (
        <Button
          basic
          inverted
          onClick={() => {
            setChangedLanguage(true);
            dispatch(setActiveLanguage('gb'));
          }}
        >
          For english press here
        </Button>
      )}
    </div>
  );
};

export default withLocalize(FirstTimeToast);
