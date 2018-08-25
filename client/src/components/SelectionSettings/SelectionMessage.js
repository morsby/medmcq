import React from "react";
import PropTypes from "prop-types";

import { Message } from "semantic-ui-react";

const SelectionMessage = ({ user = null, type }) => {
    if (user && type !== "set")
        return (
            <Message info>
                <p>
                    Bemærk, at såfremt de valgte indstillinger resulterer i
                    færre spørgsmål end det ønskede antal, får du blot alle
                    tilgængelige spørgsmål. Er antallet af spørgsmål 0, vælges
                    ligeligt blandt alle.
                </p>
            </Message>
        );
    if (!user && type === "specialer")
        return (
            <p>
                Bemærk, at såfremt de valgte specialer til sammen indeholder
                færre spørgsmål end det ønskede antal, får du blot alle
                tilgængelige.
            </p>
        );
    return null;
};

SelectionMessage.propTypes = {
    user: PropTypes.object,
    type: PropTypes.string.isRequired
};

export default SelectionMessage;
