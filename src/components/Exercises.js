import React from 'react'

import { TextField, Fab, Paper, Typography, IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'


const MAX_LENGTH = 30
const MIN_EXERCISE_LENGTH = 3

const styles = {
  container: { maxWidth: 380 },
  inputsDiv: { display: 'flex', justifyContent: 'center' },
  input: { margin: '10px 20px 10px 0', maxWidth: 150 },
  addButton: { marginTop: 18 },
  paper: { maxWidth: 380, padding: 10, marginTop: 10, marginBottom: 10 },
  singleExercise: { display: 'flex' },
  singleExerciseTypography: { flexGrow: 1 },
  singleExerciseRemoveButton: { width: 30, height: 30, alignSelf: 'center' }

}

const Exercises = props => {
  const [exercise, setExercise] = React.useState('')
  const [exerciseError, setExerciseError] = React.useState(false)
  const exerciseValidate = value => {
    const validValue = value && value.replace(/\s{2,}/g, ' ')
    if (value !== validValue) {
      setExercise(validValue)
    }
    const isError = !validValue || validValue.length < MIN_EXERCISE_LENGTH
    setExerciseError(isError)
    return isError
  }
  const setValidExercise = string => {
    if (string.length < MAX_LENGTH) {
      setExercise(string)
    }
  }
  const focusTo = React.useRef(null)

  const [quantity, setQuantity] = React.useState('')
  const [quantityError, setQuantityError] = React.useState(false)
  const quantityValidate = value => {
    const validValue = value && value.replace(/\s{2,}/g, ' ')
    if (value !== validValue) {
      setQuantity(validValue)
    }
    const isError = !validValue
    setQuantityError(isError)
    return isError
  }
  const setValidQuantity = string => {
    if (string.length < MAX_LENGTH) {
      setQuantity(string)
    }
  }

  const onSubmit = () => {
    const isExerciseError = exerciseValidate(exercise)
    const isQuantityError = quantityValidate(quantity)

    if (!isExerciseError && !isQuantityError) {
      props.setExercises([
        ...props.exercises,
        {
          exercise: exercise.toLowerCase(),
          quantity
        }
      ])
      setExercise('')
      setQuantity('')
      props.setExercisesError(false)
      focusTo.current.focus()
    }
  }

  const submitOnEnter = evt => {
    if (evt.key === 'Enter') {
      onSubmit()
    }
  }

  const removeExercise = index => {
    props.setExercises(props.exercises.filter((el, i) => index !== i))
  }

  const inputs = [
    {
      label: 'Ćwiczenie',
      value: exercise,
      error: exerciseError || props.exercisesError,
      helperText: 'Min 3 znaki',
      onChange: setValidExercise,
      validate: exerciseValidate,
      inputRef: focusTo
    },
    {
      label: 'Ilość powtórzeń',
      value: quantity,
      error: quantityError || props.exercisesError,
      helperText: 'Podaj ilość powtórzeń',
      onChange: setValidQuantity,
      validate: quantityValidate
    },
  ]
  return (
    <div style={styles.container}>
      {props.exercisesError &&
        <Typography
          color='error'
          align='center'
        >
          <b>Dodaj Ćwiczenia!</b>
        </Typography>
      }
      <div style={styles.inputsDiv}>
        {inputs.map(input =>
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
            onKeyPress={submitOnEnter}
            inputRef={input.inputRef}
          />
        )}
        <Fab
          style={styles.addButton}
          size='small'
          color='primary'
          onClick={onSubmit}
        >
          <AddIcon />
        </Fab>
      </div>
      {
        props.exercises.length > 0 &&
        <Paper style={styles.paper}>
          <Typography
            align='center'
          >
            Ćwiczenia:
        </Typography>
          {props.exercises.map((exercise, index) => (
            <div
              style={styles.singleExercise}
              key={exercise.exercise + exercise.quantity + index}
            >
              <Typography
                style={styles.singleExerciseTypography}
              >
                {index + 1}. {exercise.exercise} - {exercise.quantity}
              </Typography>
              <IconButton
                style={styles.singleExerciseRemoveButton}
                size='small'
                onClick={() => removeExercise(index)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </Paper>
      }
    </div>
  )
}

export default Exercises