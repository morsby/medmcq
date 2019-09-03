import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Button } from 'semantic-ui-react';
import {
  withLocalize,
  LocalizeContextProps,
  Translate,
  setActiveLanguage
} from 'react-localize-redux';
import aboutTranslations from 'components/Misc/Utility-pages/About/aboutTranslations';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from 'reducers';

export interface FirstTimeToastProps extends RouteComponentProps, LocalizeContextProps {
  closeToast?: Function;
  language: string;
}

const FirstTimeToast: React.SFC<FirstTimeToastProps> = ({
  closeToast,
  history,
  addTranslation
}) => {
  const language = useSelector((state: IReduxState) => state.settings.language);
  const [changedLanguage, setChangedLanguage] = useState(false);
  const dispatch = useDispatch();
  addTranslation(aboutTranslations);

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
        <Button basic inverted onClick={() => closeToast}>
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

export default withLocalize(withRouter(FirstTimeToast));
