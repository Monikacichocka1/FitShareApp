import { URL } from '../consts/firebase'
import { circuralProgress } from './fullScreenCircuralProgress'
import { addSnackbar } from './snackbars'
import mapObjectToArray from '../utilities/mapObjectToArray'
import { authRequest } from './auth'

const SAVE_FITLISTS = 'fitLists/SAVE_FITLIST'
const ERROR_ON_GET = 'fitLists/ERROR_ON_GET'

export const addFitListAsyncActionCreator = form => (dispatch, getState) => {
  const userId = getState().auth.userId
  dispatch(circuralProgress.add())
  return dispatch(authRequest(URL + 'users/' + userId + '/fitLists.json', 'post', form))
    .then(() => {
      dispatch(circuralProgress.remove())
      dispatch(addSnackbar('Trening dodano prawidłowo'))
    })
    .catch(() => {
      dispatch(circuralProgress.remove())
      dispatch(addSnackbar('Dodawanie nie powiodło się, spróbuj ponownie później', 'red'))
      return Promise.reject()
    })
}

export const getFitListsAsyncActionCreator = () => (dispatch, getState) => {
  const userId = getState().auth.userId
  dispatch(circuralProgress.add())
  dispatch(authRequest(URL + 'users/' + userId + '/fitLists.json'))
    .then((response) => {
      const mappedData = mapObjectToArray(response.data)
      dispatch(saveFitListsActionCreator(mappedData))
      dispatch(circuralProgress.remove())
    })
    .catch(() => {
      dispatch(circuralProgress.remove())
      dispatch(errorOnGetFitListsActionCreator())
    })
}

export const deleteFitListAsyncActionCreator = (key, success, error) => (dispatch, getState) => {
  const userId = getState().auth.userId
  dispatch(circuralProgress.add())
  dispatch(authRequest(URL + 'users/' + userId + '/fitLists/' + key + '.json', 'delete'))
    .then(() => {
      const fitLists = getState().fitLists.fitLists
      const fitListsAfterDelete = fitLists.filter(fitList => fitList.key !== key)
      dispatch(saveFitListsActionCreator(fitListsAfterDelete))
      dispatch(addSnackbar('Trening usunięto prawidłowo'))
      dispatch(circuralProgress.remove())
      success()
    })
    .catch(() => {
      dispatch(addSnackbar('Usuwanie nie powiodło się, spróbuj ponownie później', 'red'))
      dispatch(circuralProgress.remove())
      error()
    })
}

export const editFitListAsyncActionCreator = (form, key, success, error) => (dispatch, getState) => {
  const userId = getState().auth.userId
  dispatch(circuralProgress.add())
  dispatch(authRequest(URL + 'users/' + userId + '/fitLists/' + key + '.json', 'patch', form))
    .then(() => {
      const fitLists = getState().fitLists.fitLists
      const fitListsAfterEdite = fitLists.map(fitList => {
        if (fitList.key === key) {
          return form
        }
        return fitList
      })
      dispatch(saveFitListsActionCreator(fitListsAfterEdite))
      dispatch(addSnackbar('Trening edytawno.'))
      dispatch(circuralProgress.remove())
      success()
    })
    .catch(() => {
      dispatch(addSnackbar('Edytowanie nie powiodło się, spróbuj ponownie później', 'red'))
      dispatch(circuralProgress.remove())
      error()
    })
}

const saveFitListsActionCreator = fitLists => {
  const suggestions = fitLists
    .reduce((red, el) => [...red, ...el.exercises], [])
    .reduce((red, el) => red.includes(el.exercise) ? red : [...red, el.exercise], [])
  return {
    type: SAVE_FITLISTS,
    fitLists,
    suggestions
  }
}

const errorOnGetFitListsActionCreator = () => ({ type: ERROR_ON_GET })

const initialState = {
  fitLists: [],
  suggestions: [],
  isError: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_FITLISTS:
      return {
        ...state,
        isError: false,
        fitLists: action.fitLists,
        suggestions: action.suggestions,
      }
    case ERROR_ON_GET:
      return {
        ...state,
        isError: true
      }
    default:
      return state
  }
}