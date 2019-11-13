import React, { useState } from 'react';
import { withLocalize, Translate } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Menu, Icon, Button, Loader } from 'semantic-ui-react';
import { getQuestions, changeSettings } from 'actions';
import Flag from 'react-flagkit';
import _ from 'lodash';

const RightMenu = ({ languages, logout, handleNavigation, setActiveLanguage }) => {
  const [loading, setLoading] = useState(false);
  const activeLanguage = useSelector((state) => state.settings.language);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const fetchQuestionsByCommentIds = async (commentIds) => {
    setLoading(true);
    commentIds = _.uniq(commentIds);
    await dispatch(getQuestions({ commentIds }));
    history.push('/quiz');
    setLoading(false);
  };

  const changeLang = (lang) => {
    setActiveLanguage(lang);
    dispatch(changeSettings({ type: 'language', value: lang }));
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
              logout();
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
