import React from 'react'

import FitListsListItem from './FitListsListItem'

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 800,
    margin: 'auto'
  },
}

const FitListsList = props => {
  return (
    <div style={styles.container}>
      {props.data.map(fitList => (
        <FitListsListItem
          key={fitList.key}
          data={fitList}
          route={props.route}
          changeRoute={props.changeRoute}
        />
      ))}
    </div>
  )
}

export default FitListsList