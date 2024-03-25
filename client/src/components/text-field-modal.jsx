import React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CheckIcon from '@mui/icons-material/Check'
import ErrorIcon from '@mui/icons-material/Error'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '../state/playground-ui-slice'

/**
 * React component representing a modal with a text field
 *
 * Used for easier modification of large payloads/inputs
 *
 * @param {string} label - The label for the text field.
 * @param {string} id - The id for the text field.
 *
 * @returns {React.Element} - The JSX element representing the modal with a text field.
 */
const TextFieldModal = ({ label, id }) => {
	const isOpen = (state) => state.playgroundUI.modalOpen[`${id}Modal`]
	const getPlaygroundState = (state) => state.playground

	const value = useSelector((state) => getPlaygroundState(state)[id])
	const valid = useSelector((state) => getPlaygroundState(state)[`${id}Valid`])
	const open = useSelector(isOpen)
	const reducerName = `change${label}`

	const dispatch = useDispatch()

	const onClose = () => {
		dispatch(closeModal(`${id}Modal`))
	}

	const actionCreator = (value) => ({
		type: 'playground/' + reducerName,
		payload: value,
	})
	const onChange = (value) => {
		dispatch(actionCreator(value))
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: {
					minWidth: 800,
					height: 400,
					p: 4,
				},
			}}
		>
			<TextField
				variant='outlined'
				label={
					<>
						{label}:{valid ? <CheckIcon /> : <ErrorIcon />}
					</>
				}
				value={value ?? ''}
				onChange={(event) => onChange(event.target.value)}
				size='small'
				fullWidth
				rows={16}
				multiline
			/>
			<Box textAlign='right'>
				<Button startIcon={<ExitToAppIcon />} onClick={onClose} size='large'>
					Close
				</Button>
			</Box>
		</Dialog>
	)
}

TextFieldModal.propTypes = {
	children: PropTypes.node,
	label: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
}

export default TextFieldModal
