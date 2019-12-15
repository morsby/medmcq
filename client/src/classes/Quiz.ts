
interface QuizStart {
    ids: string[]
}

interface Quiz {}

class Quiz {
    static start = (data: QuizStart) => {}
}

export default Quiz;