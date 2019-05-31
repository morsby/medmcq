import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Icon } from 'semantic-ui-react';
import marked from 'marked';

/**
 * An accordion element.
 */
const ProfileActivityAccordionElem = ({
  title,
  children,
  index,
  active,
  handleClick
}) => (
  <>
    <Accordion.Title
      active={active}
      index={index}
      onClick={() => (active ? handleClick(null) : handleClick(index))}
    >
      <Icon name="dropdown" />
      <div dangerouslySetInnerHTML={{ __html: marked(title) }} />
    </Accordion.Title>
    <Accordion.Content active={active}>{children}</Accordion.Content>
  </>
);

ProfileActivityAccordionElem.propTypes = {
  /**
   * The title of the accordion element
   */
  title: PropTypes.string,

  /**
   * The contents of the accordion (a React Component)
   */
  children: PropTypes.node,
  /**
   * The index of the accordion (used to handleClick)
   */
  index: PropTypes.number,

  /**
   * If the element is active?
   */
  active: PropTypes.bool,

  /**
   * Toggles the accordion
   */
  handleClick: PropTypes.func
};

export default ProfileActivityAccordionElem;
