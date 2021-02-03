import React from 'react'

import { Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Button } from '@material-ui/core'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core'
import DotIcon from '@material-ui/icons/Brightness1'

import imgPlacecholder from '../img/img-placeholder.svg'
import EditFitList from '../components/EditFitList'


const styles = {
  backToFitLists: { cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }
}

const SingleFitList = props => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isEditeDialogOpen, setIsEditeDialogOpen] = React.useState(false)

  if (!props.data) {
    return (
      <div>
        <Typography
          variant='h4'
          color='secondary'
          align='center'
        >
          Nie znaleziono treningu o identyfikatorze:
          <br />
          {props.param}
        </Typography>
        <Typography
          style={styles.backToFitLists}
          variant='h4'
          color='primary'
          align='center'
          onClick={props.back}
        >
          Wróć do treningów
        </Typography>
      </div>
    )
  }

  return (
    <Paper
      style={{ padding: 20, maxWidth: 600, margin: '20px auto' }}
    >
      <div
        style={{ display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'flex-end' }}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, margin: '20px 20px 0 20px' }}
        >
          <Typography
            style={{ maxWidth: 264, wordBreak: 'break-word' }}
            variant='h5'
            align='center'
            color='secondary'
            gutterBottom
          >
            <b>{props.data.name.toUpperCase()}</b>
          </Typography>
          <Typography
            style={{ fontSize: 12 }}
            align='center'
            color='secondary'
            gutterBottom
            paragraph
          >
            Czas treningu: {props.data.time}min
          </Typography>
          <Typography
            style={{ marginTop: 5 }}
            align='center'
            color='secondary'
            gutterBottom
          >
            <b>Ćwiczenia:</b>
          </Typography>
          <List
            style={{ marginTop: -5 }}
          >
            {props.data.exercises.map((el, index) => (
              <ListItem
                style={{ paddingTop: 0, paddingBottom: 0 }}
                key={el.exercise + el.quantity + index}
              >
                <ListItemIcon
                  style={{ marginRight: -40 }}
                >
                  <DotIcon style={{ width: 7 }} />
                </ListItemIcon>
                <ListItemText
                  style={{ marginBottom: 0, marginTop: 0 }}
                  primary={el.exercise + ' - ' + el.quantity}
                  primaryTypographyProps={{ style: { fontSize: 14 } }}
                />
              </ListItem>
            ))}
          </List>
        </div>
        <div
          style={{ width: 264, maxHeight: 264, position: 'relative', margin: '0 auto' }}
        >
          <img
            style={{ width: '100%', maxHeight: 264, backgroundImage: 'url(' + imgPlacecholder + ')', backgroundSize: 'cover', backgroundPosition: 'center' }}
            src={props.data.photo}
            alt={props.data.name}
            onError={evt => evt.target.src = imgPlacecholder}
          />
        </div>
      </div>
      <div
        style={{ width: '100%', marginTop: 25 }}
      >
        <Typography
          variant='h5'
          align='center'
          color='secondary'
          gutterBottom
        >
          Opis ćwiczeń:
        </Typography>
        <Typography
          style={{ wordBreak: 'break-word', whiteSpace: 'pre-line', marginTop: 20 }}
          align='center'
        >
          {props.data.description}
        </Typography>
      </div>
      <div style={{ width: '100%', marginTop: 25, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          style={{ margin: 10 }}
          variant='contained'
          color='primary'
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          Usuń
        </Button>
        <Button
          style={{ margin: 10 }}
          variant='contained'
          color='secondary'
          onClick={() => setIsEditeDialogOpen(true)}
        >
          Edytuj
        </Button>
      </div>
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle >{"Czy napewno chcesz usunąć trening?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Trening zostanie trwale usunięty. Nie można odwrócić tej operacji.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              props._deleteFitList(
                props.param,
                props.back,
                () => setIsDeleteDialogOpen(false)
              )
            }}
            color="primary"
          >
            Usuń
          </Button>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
            color="secondary"
            autoFocus
          >
            Anuluj
          </Button>
        </DialogActions>
      </Dialog>
      {isEditeDialogOpen &&
        <EditFitList
          onClose={() => setIsEditeDialogOpen(false)}
          data={props.data}
          _editFitList={props._editFitList}
        />
      }
    </Paper>
  )
}

export default SingleFitList