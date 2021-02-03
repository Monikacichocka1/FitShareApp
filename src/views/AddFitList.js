import React from 'react'

import { connect } from 'react-redux'
import { addFitListAsyncActionCreator } from '../state/fitLists'

import { TextField, InputAdornment, Typography, Button } from '@material-ui/core'

import Exercises from '../components/Exercises'

const MAX_NAME_LENGTH = 45
const MIN_NAME_LENGTH = 4
const MIN_DESCRIPTION_LENGTH = 20
const MAX_DESCRIPTION_LENGTH = 1500
const MAX_TIME = 240

const styles = {
  div: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  input: { maxWidth: 380, margin: '10px 0' },
  title: { fontWeight: 'bold', margin: 30 },
  link: { fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' },
  randomPhoto: { marginTop: -10, marginBottom: 10, cursor: 'pointer', color: 'blue' }
}


const AddFitList = props => {
  const formInStorage = JSON.parse(localStorage.getItem('form')) || {}

  React.useEffect(() => {
    const form = {
      name,
      description,
      exercises,
      time,
      photo
    }
    localStorage.setItem('form', JSON.stringify(form))
  })

  const [name, setName] = React.useState(formInStorage.name || '')
  const [nameError, setNameError] = React.useState(false)
  const nameValidate = (value) => {
    const validValue = value && value.replace(/\s{2,}/g, ' ')
    if (value !== validValue) {
      setName(validValue)
    }
    const isError = !validValue || validValue.length < MIN_NAME_LENGTH
    setNameError(isError)
    return isError
  }
  const setValidName = (string) => {
    if (string.length < MAX_NAME_LENGTH) {
      setName(string)
    }
  }

  const [description, setDescription] = React.useState(formInStorage.description || '')
  const [descriptionError, setDescriptionError] = React.useState(false)
  const descriptionValidate = value => {
    const validValue = value && value.replace(/\s{2,}/g, ' ')
    if (value !== validValue) {
      setDescription(validValue)
    }
    const isError = !validValue || validValue.length < MIN_DESCRIPTION_LENGTH
    setDescriptionError(isError)
    return isError
  }
  const setValidDescription = string => {
    if (string.length < MAX_DESCRIPTION_LENGTH) {
      setDescription(string)
    }
  }

  const [time, setTime] = React.useState(formInStorage.time || '')
  const [timeError, setTimeError] = React.useState(false)
  const timeValidate = (value) => {
    value = Number(Number(value).toFixed(2))
    setTime(value)
    const isError = value < 1
    setTimeError(isError)
    return isError
  }
  const setValidTime = value => {
    setTime(value < 0 ? 0 : value > MAX_TIME ? MAX_TIME : value)
  }

  const [photo, setPhoto] = React.useState(formInStorage.photo || '')
  const [photoError, setPhotoError] = React.useState(false)
  const photoValidate = value => {
    const isError = !value || !value.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/)
    setPhotoError(isError)
    return isError
  }

  const [exercises, setExercises] = React.useState(formInStorage.exercises || [])
  const [exercisesError, setExercisesError] = React.useState(false)
  const exercisesValidate = value => {
    const isError = value.length === 0
    setExercisesError(isError)
    return isError
  }

  const onSubmit = () => {
    const isNameError = nameValidate(name)
    const isDescriptionError = descriptionValidate(description)
    const isExercisesError = exercisesValidate(exercises)
    const isTimeError = timeValidate(time)
    const isPhotoError = photoValidate(photo)

    if (!isNameError && !isDescriptionError && !isExercisesError && !isTimeError && !isPhotoError) {
      const form = {
        name,
        description,
        exercises,
        time,
        photo
      }

      props._addFitList(form)
        .then(() => {
          setName('')
          setDescription('')
          setExercises([])
          setTime('')
          setPhoto('')
        })
        .catch(() => { })
    }
  }

  const inputs = [
    {
      label: 'Nazwa treningu',
      value: name,
      onChange: setValidName,
      error: nameError,
      validate: nameValidate,
      helperText: 'Zbyt krótka nazwa, minimum 4 znaki'
    },
    {
      label: 'Ćwiczenia'
    },
    {
      label: 'Opis Ćwiczeń',
      value: description,
      onChange: setValidDescription,
      error: descriptionError,
      validate: descriptionValidate,
      helperText: 'Zbyt krótki opis, minimum 15 znaki',
      multiline: true
    },
    {
      label: 'Czas ćwiczeń',
      value: time,
      onChange: setValidTime,
      error: timeError,
      validate: timeValidate,
      helperText: 'Podaj prawidłowy czas',
      type: 'number',
      InputProps: {
        endAdornment: <InputAdornment position="end">min</InputAdornment>,
      }
    },
    {
      label: 'Zdjęcie',
      value: photo,
      onChange: setPhoto,
      error: photoError,
      validate: photoValidate,
      helperText: 'Podaj prawidłowy adres URL',
      placeholder: 'http://'
    },
  ]
  return (
    <div
      style={styles.div}
    >
      <Typography
        style={styles.title}
        align='center'
        variant='h5'
        color='secondary'
      >
        Dodaj trening.
        <br />
        Trening zostanie dodany do{' '}
        <Typography
          style={styles.link}
          display='inline'
          color='primary'
          onClick={() => props.history.push('/your-fitlists')}
        >
          Twojej listy.
        </Typography>
      </Typography>
      {inputs.map(input => input.label === 'Ćwiczenia' ?
        <Exercises
          key={input.label}
          exercises={exercises}
          setExercises={setExercises}
          exercisesError={exercisesError}
          setExercisesError={setExercisesError}
        />
        :
        <TextField
          key={input.label}
          style={styles.input}
          variant='outlined'
          fullWidth
          label={input.label}
          value={input.value}
          error={input.error}
          helperText={input.error && input.helperText}
          onChange={evt => {
            input.onChange(evt.target.value)
            if (input.error) {
              input.validate(evt.target.value)
            }
          }}
          onBlur={() => input.validate(input.value)}
          multiline={input.multiline}
          type={input.type || 'text'}
          InputProps={input.InputProps}
          placeholder={input.placeholder}
        />
      )}
      <Typography
        style={styles.randomPhoto}
        onClick={() => {
          setPhoto('https://source.unsplash.com/random')
          setPhotoError(false)
        }}
      >
        (losowe zdjęcie)
      </Typography>
      <Button
        color='primary'
        variant='contained'
        onClick={onSubmit}
      >
        Dodaj trening
      </Button>
    </div>
  )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  _addFitList: (form) => dispatch(addFitListAsyncActionCreator(form))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddFitList)