import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

const HomePage = () => {
    const history = useHistory();

    return (
        <div>
            <h1>Home Page</h1>
            <Button onClick={() => history.push('/activities')} positive content='Go to activities'/>
        </div>
    )
}

export default HomePage
