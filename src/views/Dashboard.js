import React from 'react'
import { Typography } from '@material-ui/core'

const Dashboard = props => {
  return (
    <div>
      <Typography
        variant='h1'
        align='center'
        style={{ marginTop: 100 }}
      >
        #FITNESS
        #EXERCISES 
        #SHARING
        #COVID
        #STAY_IN_HOME
      </Typography>
    </div>
  )
}

export default Dashboard