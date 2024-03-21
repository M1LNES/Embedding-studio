import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Widget } from 'empli-embed'
import { Dialog } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '../state/playground-ui-slice'

const MODAL_ID = 'codeModal'
const isOpen = (state) => state.playgroundUI.modalOpen[MODAL_ID]
const getPlaygroundState = (state) => state.playground

const WidgetCodeModal = () => {
	const { visualizationState, widgetCode } = useSelector(getPlaygroundState)
	const open = useSelector(isOpen)
	const dispatch = useDispatch()
	const handleClose = () => dispatch(closeModal(MODAL_ID))

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{
				sx: {
					minWidth: 800,
					height: 400,
					p: 4,
				},
			}}
		>
			<Typography
				id='modal-modal-title'
				variant='h6'
				component='h2'
				textAlign='center'
			>
				Widget Configuration
			</Typography>
			<Box display='flex' justifyContent='space-between' alignItems='center'>
				{visualizationState ? ( // Render "new" component with smaller size for Modal
					<Widget
						boardID={visualizationState.boardID}
						widgetID={visualizationState.widgetID}
						params={visualizationState.params}
						width={500}
						height={380}
						className={visualizationState.className}
						showConfig={visualizationState.showConfig}
						showConfigRevealed={visualizationState.showConfigRevealed}
						style={visualizationState.style}
					/>
				) : null}
				<Box display='flex' flexDirection='column' flex={1} marginLeft='10px'>
					<TextField
						disabled={true}
						value={widgetCode}
						fullWidth
						multiline
						rows={14}
					/>
					<Button
						onClick={() => {
							navigator.clipboard.writeText(widgetCode)
						}}
					>
						Copy
						<ContentCopyIcon />
					</Button>
				</Box>
			</Box>
		</Dialog>
	)
}

export default WidgetCodeModal
