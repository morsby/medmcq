import React from 'react';
import { Dropdown } from 'semantic-ui-react';

const QuestionMetadataDropdown = ({ options, onChange }) => {
  console.log(options);

  const createDropdowns = () => {
    // TODO: Her skal være noget med kategorier og deres items (i options er der kategorier der bare skal sorteres)
    // Sådan noget nested noget
    // <Dropdown.Menu>
    //       <Dropdown.Item>
    //         <Icon name='dropdown' />
    //         <span className='text'>Still Left</span>
    //         <Dropdown.Menu>
    //           <Dropdown.Item>1</Dropdown.Item>
    //           <Dropdown.Item>2</Dropdown.Item>
    //           <Dropdown.Item>3</Dropdown.Item>
    //         </Dropdown.Menu>
    //       </Dropdown.Item>
    //       <Dropdown.Item>2</Dropdown.Item>
    //       <Dropdown.Item>3</Dropdown.Item>
    //     </Dropdown.Menu>
    //   </Dropdown.Item>
    // https://react.semantic-ui.com/modules/dropdown/#variations-menu-direction-left
  };

  return (
    <span style={{ margin: '5px', border: '1px solid grey', padding: '5px' }}>
      <Dropdown scrolling text="Tag">
        <Dropdown.Menu>
          {options.map((o) => {
            return <Dropdown.Item text={o.text} value={o.value} />;
          })}
        </Dropdown.Menu>
      </Dropdown>
    </span>
  );
};

export default QuestionMetadataDropdown;
