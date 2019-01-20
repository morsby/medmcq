export const smoothScroll = (h, dir = "up") => {
    let top = window.pageYOffset || document.documentElement.scrollTop;
    let bottom = document.body.scrollHeight;
    let px = 20;
    let i = h || top;
    if (dir === "up") {
        if (i > px) {
            setTimeout(() => {
                window.scrollTo(0, i);
                smoothScroll(i - px);
            }, 10);
        } else {
            window.scrollTo(0, 0);
        }
    } else if (dir === "down") {
        if (i < bottom - px) {
            setTimeout(() => {
                window.scrollTo(0, i);
                smoothScroll(i + px, dir);
            }, 10);
        } else {
            window.scrollTo(0, bottom);
        }
    }
};

export const evalAnswer = (question, answer) => {
    if (!question.answer) return; // hvis ikke svaret

    if (Array.isArray(question.correctAnswer)) {
        if (question.correctAnswer.includes(answer)) return "green";
    } else {
        if (answer === question.correctAnswer) return "green"; // hvis korrekt svar
    }
    if (answer === question.answer) return "red"; // hvis forkert svar
    return "grey"; // ikke valgt mulighed
};

export const calculateResults = (answers, numberOfQuestions) => {
    if (answers.length < numberOfQuestions) {
        return { done: false };
    }

    let correct = 0;
    for (var i = 0, l = answers.length; i < l; i++) {
        if (
            typeof answers[i] === "undefined" ||
            typeof answers[i] !== "boolean"
        ) {
            return { done: false };
        } else if (answers[i] === true) {
            correct++;
        }
    }

    return {
        done: true,
        n: answers.length,
        correct,
        percentage: `${Math.round((correct / answers.length) * 10000) / 100}%`
    };
};

export const subSupScript = text => {
    return text
        .replace(/\^(.+?)\^/g, "<sup>$1</sup>")
        .replace(/~(.+?)~/g, "<sub>$1</sub>");
};
