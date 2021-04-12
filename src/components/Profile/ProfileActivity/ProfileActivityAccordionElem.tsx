import React from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import marked from 'marked';

/**
 * An accordion element.
 */
export interface ProfileActivityAccordionElemProps {
  title: string;
  children: any;
  index: number;
  active: boolean;
  handleClick: Function;
}

const ProfileActivityAccordionElem: React.SFC<ProfileActivityAccordionElemProps> = ({
  title,
  children,
  index,
  active,
  handleClick
}) => {
  return (
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
};

export default ProfileActivityAccordionElem;
