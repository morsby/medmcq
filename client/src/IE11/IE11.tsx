import React from 'react';

export interface IE11Props {}

const IE11: React.SFC<IE11Props> = () => {
  return (
    <div
      style={{
        textAlign: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <h1 style={{ color: 'blue' }}>MedMCQ</h1>
      <h2>
        Din internet browser er forældet, og understøttes derfor ikke.
        <br />
        Benyt venligst Chrome, Firefox, Edge eller anden nyrere browser i stedet.
      </h2>
      <h3>Denne advarsel gælder ikke kun for medMCQ.</h3>
      <h4>
        Regionscomputere bruger som standard alle internet explorer, men under apps kan man i stedet
        finde Chrome.
        <br />
        Det anbefales på det kraftigste at skifte, da der er store sikkerhedsmæssige mangler i
        internet explorer, da den ikke længere modtager opdateringer fra Microsoft.
      </h4>
    </div>
  );
};

export default IE11;
