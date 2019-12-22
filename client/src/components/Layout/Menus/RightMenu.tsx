import React, { useState } from 'react';
import { withLocalize, Translate, LocalizeContextProps } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Icon, Button, Loader } from 'semantic-ui-react';
import Flag from 'react-flagkit';
import _ from 'lodash';
import { ReduxState } from 'redux/reducers';
import settingsReducer from 'redux/reducers/settings';
import User from 'classes/User';
import Question from 'classes/Question';
import Quiz from 'classes/Quiz';

export interface RightMenuProps extends LocalizeContextProps {
  handleNavigation: Function;
}

const RightMenu: React.SFC<RightMenuProps> = ({
  setActiveLanguage,
  languages,
  handleNavigation
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const activeLanguage = useSelector((state: ReduxState) => state.settings.language);
  const user = useSelector((state: ReduxState) => state.auth.user);

  const fetchQuestionsByCommentIds = async (commentIds) => {
    setLoading(true);
    commentIds = _.uniq(commentIds);
    await Quiz.start({ ids: commentIds });
    handleNavigation('/quiz');
  };

  const changeLang = (lang) => {
    setActiveLanguage(lang);
    dispatch(settingsReducer.actions.changeSettings({ type: 'language', value: lang }));
  };

  const generateFlag = (lang) => {
    if (lang.code !== activeLanguage) {
      return (
        <Menu.Item onClick={() => changeLang(lang.code)} key={lang.code}>
          <div>
            <Flag style={{ textAlign: 'center' }} country={lang.code.toUpperCase()} size="20" />
          </div>
        </Menu.Item>
      );
    }
  };

  if (user) {
    return (
      <>
        {languages.map((lang) => generateFlag(lang))}
        <Menu.Item onClick={() => handleNavigation('/profil')}>
          <strong>
            <Translate
              id="header.greeting"
              data={{
                user: user.username[0].toUpperCase() + user.username.substring(1)
              }}
            />
          </strong>
        </Menu.Item>
        {!loading ? (
          <Menu.Item
            onClick={() => fetchQuestionsByCommentIds(user.likes.map((like) => like.commentId))}
          >
            <Icon name="thumbs up outline" /> {user.likes.length}
          </Menu.Item>
        ) : (
          <Menu.Item>
            <Loader active inline size="tiny" />
          </Menu.Item>
        )}
        <Menu.Item>
          <Button
            inverted
            onClick={() => {
              User.logout();
              return handleNavigation('/');
            }}
          >
            <Translate id="header.logout" />
          </Button>
        </Menu.Item>
      </>
    );
  } else {
    return (
      <>
        {languages.map((lang) => generateFlag(lang))}
        <Menu.Item onClick={() => handleNavigation('/login')}>
          <Icon name="doctor" /> <Translate id="header.login" />
        </Menu.Item>
      </>
    );
  }
};

export default withLocalize(RightMenu);
