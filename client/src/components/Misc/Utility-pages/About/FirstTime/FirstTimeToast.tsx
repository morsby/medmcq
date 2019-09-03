import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Button } from 'semantic-ui-react';

export interface FirstTimeToastProps extends RouteComponentProps {
  closeToast?: Function;
}

const FirstTimeToast: React.SFC<FirstTimeToastProps> = ({ closeToast, history }) => {
  const handleClick = () => {
    closeToast();
    history.push('/firsttime');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      Velkommen til medMCQ!
      <br />
      Om du er her for første gang, eller har brugt siden længe, så ser her for nogle gode tips og
      tricks!
      <div style={{ textAlign: 'center', margin: '5px' }}>
        <Button basic inverted onClick={handleClick}>
          Vis mig det!
        </Button>
        <Button basic inverted onClick={() => closeToast}>
          Ellers tak
        </Button>
      </div>
    </div>
  );
};

export default withRouter(FirstTimeToast);
