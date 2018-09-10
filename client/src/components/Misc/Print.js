import React from "react";
import { connect } from "react-redux";

import { printQuiz } from "../../utils/print";

const Print = ({ questions }) => {
    printQuiz(questions);
};

function mapStateToProps(state) {
    return {
        questions: state.questions
    };
}

export default connect(
    mapStateToProps,
    null
)(Print);
