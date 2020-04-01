import React from "react";

import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import Paper from "@material-ui/core/Paper";

const UserQuery = gql`
    {
        users {
            id
            firstName
            lastName
        }
    }
`;

function App() {
    const { loading, error, data } = useQuery(UserQuery);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return data.users.map(({ id, firstName, lastName }) => (
        <div key={id}>
            <p>
                {id}: {firstName} {lastName}
            </p>
        </div>
    ));
}

export default App;
