import gql from "graphql-tag"
import { LogInput } from "types/generated";
import API from "./API.class";

interface Log {}

class Log {
    static create = async (data: LogInput) => {
        const mutation = gql`
            mutation CreateLog($data: LogInput) {
                createLog(data: $data)
            } 
        `;

        await API.mutate('createLog', mutation, { data })
    }
}

export default Log