import React from 'react';

import { List } from 'semantic-ui-react';

const FancyFunctions = () => (
    <div>
        <h2>Smarte/skjulte funktioner</h2>
        <p>
            Siden gemmer mange ting lokalt på din enhed (ikke som cookies) -
            eksempelvis de spørgsmål, du er i gang med (hvis du har svaret på
            minimum ét spørgsmål), dit semester og andre valg, du foretager på
            siden – dette er så du nemt kan vende tilbage til siden. Hvis du
            "stemmer" på feedback-forslag, bliver dette også gemt, så der ikke
            kan stemmes mere end én gang per forslag.
        </p>
        <List bulleted>
            <List.Item>
                På en computer kan du
                <List>
                    <List.Item>
                        navigere mellem spørgsmål med piletasterne
                    </List.Item>
                    <List.Item>
                        besvare spørgsmål ved brug af tallene 1, 2 og 3 for hhv.
                        svarmulighed A, B og C.
                    </List.Item>
                </List>
            </List.Item>
            <List.Item>
                På en telefon kan du
                <List>
                    <List.Item>
                        navigere mellem spørgsmål ved at swipe (virker måske
                        også på en touchskærms-pc?)
                    </List.Item>
                </List>
            </List.Item>
            <List.Item>
                Opretter du en bruger
                <List>
                    <List.Item>
                        holder systemet styr på, hvilke spørgsmål du har
                        besvaret – og viser dig, når du har besvaret et fuldt
                        eksamenssæt
                    </List.Item>
                    <List.Item>
                        vil systemet gemme alle dine svar, så du kan se, hvor
                        det går galt (og om der er systematik bag)
                    </List.Item>
                    <List.Item>
                        kan du bede om kun at få spørgsmål, du <em>ikke</em>{' '}
                        allerede har svaret på
                    </List.Item>
                </List>
            </List.Item>
        </List>
    </div>
);

export default FancyFunctions;
