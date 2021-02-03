import React from 'react'

import { connect } from 'react-redux'
import fitLists, { getFitListsAsyncActionCreator, deleteFitListAsyncActionCreator, editFitListAsyncActionCreator } from '../state/fitLists'

import { Typography } from '@material-ui/core'
import FitListsList from '../components/FitListsList'
import SingleFitList from './SingleFitList'
import MultiAutocompleteInput from '../components/MultiAutocompleteInput'

const styles = {
  refresh: { cursor: 'pointer', color: 'blue' },
  autocomplete: { maxWidth: 700, margin: '30px auto' },
  nofitList: { cursor: 'pointer' }
}

class UserFitLists extends React.Component {
  state = {
    selectedItem: []
  }

  setSelectedItem = (items) => this.setState({ selectedItem: items })

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    this.props._getData()
  }

  render() {
    if (this.props._isFetching.length === 0) {

      const fitListsToShow = this.props._fitLists.filter(FitList => {
        const exercises = fitLists.exercises.map(el => el.exercise)
        return this.state.selectedItem.reduce((red, el) => exercises.includes(el) ? red : false, true)
      })

      if (this.props._isError) {
        return (
          <div>
            <Typography
              variant='h4'
              align='center'
              color='error'
            >
              Nie udało się pobrać treningów
          </Typography>
            <Typography
              style={styles.refresh}
              variant='h4'
              align='center'
              onClick={this.getData}
            >
              Odśwież
          </Typography>
          </div>
        )
      }
      if (this.props._fitLists.length === 0) {
        return (
          <div>
            <Typography
              variant='h4'
              align='center'
              color='secondary'
            >
              Nie dodałeś/aś jeszcze żadnego treningu.
          </Typography>
            <Typography
              style={styles.noFitLists}
              variant='h4'
              align='center'
              color='primary'
              onClick={() => this.props.history.push('/add-fitlist')}
            >
              Dodaj trening
          </Typography>
          </div>
        )
      }

      if (this.props.match.params.id) {
        const fitList = this.props._fitLists.find(el => el.key === this.props.match.params.id)
        return <SingleFitList
          data={fitList}
          param={this.props.match.params.id}
          back={() => this.props.history.push('/your-fitlists')}
          _deleteFitList={this.props._deleteFitList}
          _editFitList={this.props._editFitList}
        />
      }

      return (
        <div>
          <div style={styles.autocomplete}>
            <MultiAutocompleteInput
              label='Jakie ćwiczenia lubisz?'
              placeholder='Wybierz trening (zacznij pisać i wybierz z listy)'
              suggestions={this.props._suggestions}
              selectedItem={this.state.selectedItem}
              setSelectedItem={this.setSelectedItem}
            />
          </div>
          <FitListsList
            data={fitListsToShow}
            route='/your-fitlists'
            changeRoute={this.props.history.push}
          />
          {fitListsToShow.length === 0 &&
            <Typography
              color='secondary'
              align='center'
              variant='h4'
            >
              Nie ma treningu zawierającego te ćwiczenia
        </Typography>
          }
        </div>
      )
    }
    return null
  }
}

const mapStateToProps = state => ({
  _isError: state.fitLists.isError,
  _fitLists: state.fitLists.fitLists,
  _suggestions: state.fitLists.suggestions,
  _isFetching: state.fullScreenCircuralProgress.circurals
})

const mapDispatchToProps = dispatch => ({
  _getData: () => dispatch(getFitListsAsyncActionCreator()),
  _deleteFitList: (key, success, error) => dispatch(deleteFitListAsyncActionCreator(key, success, error)),
  _editFitList: (form, key, success, error) => dispatch(editFitListAsyncActionCreator(form, key, success, error))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserFitLists)