/* eslint-disable no-mixed-spaces-and-tabs */
import {
	Box,
	Button,
	Chip,
	Divider,
	FormControlLabel,
	FormGroup,
	IconButton,
	Stack,
	Switch,
	TextField,
	Tooltip,
} from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'
import CheckIcon from '@mui/icons-material/Check'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	changeBoardID,
	changeClassName,
	changeHeight,
	changeOmniStudioTokenState,
	changeParams,
	changePublicApiTokenState,
	changeShowConfig,
	changeShowConfigRevealed,
	changeStyle,
	changeVisualizationState,
	changeWidgetCode,
	changeWidgetID,
	changeWidth,
	initialiseState,
} from '../state/playground-slice'
import { Widget } from 'empli-embed'
import {
	extractParameterValue,
	getPublicApiToken,
	getOmniStudioApiToken,
	parseJSON,
	parseToInteger,
	makeRequestID,
} from '../utils/functions'
import {
	checkPublicApiTokenValidity,
	checkOmniStudioTokenValidity,
} from '../utils/token-utils'
import {
	OMNI_STUDIO_NOT_GENERATED,
	PUBLIC_API_NOT_GENERATED,
} from '../constants/token-messages'
import CodeIcon from '@mui/icons-material/Code'
import LaunchIcon from '@mui/icons-material/Launch'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TextFieldModal from './text-field-modal'
import WidgetCodeModal from './widget-code-modal'
import { openModal } from '../state/playground-ui-slice'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

const getPlaygroundState = (state) => state.playground

const Playground = () => {
	const queryParams = useMemo(
		() => new URLSearchParams(window.location.search),
		[]
	)
	const {
		boardID,
		widgetID,
		width,
		height,
		showConfig,
		showConfigRevealed,
		className,
		params,
		style,
		visualizationState,
		publicApiTokenState,
		omniStudioTokenState,
		styleValid,
		paramsValid,
	} = useSelector(getPlaygroundState)

	const dispatch = useDispatch()

	useEffect(() => {
		initialiseForm()
		checkTokenAvailability()
	}, [initialiseForm, checkTokenAvailability])

	const initialiseForm = useCallback(() => {
		const newWidgetID = queryParams.get('widgetID')
		const newBoardID = queryParams.get('boardID')
		const newWidth = queryParams.get('width')
		const newHeight = queryParams.get('height')
		const newClassName = queryParams.get('className')
		const newShowConfigRevealed =
			queryParams.get('showConfigRevealed') === 'true'
		const newShowConfig = queryParams.get('showConfig') === 'true'
		const newStyle = queryParams.get('style')
		const newParams = queryParams.get('params')

		dispatch(
			initialiseState({
				widgetID: parseToInteger(extractParameterValue(newWidgetID)),
				boardID: parseToInteger(extractParameterValue(newBoardID)),
				width: parseToInteger(extractParameterValue(newWidth)),
				height: parseToInteger(extractParameterValue(newHeight)),
				className: extractParameterValue(newClassName),
				showConfigRevealed: newShowConfigRevealed,
				showConfig: newShowConfig,
				style: extractParameterValue(newStyle),
				params: extractParameterValue(newParams),
				widgetCode: null,
				visualizationState: null,
				omniStudioTokenState: {
					valid: null,
					message: null,
				},
				publicApiTokenState: {
					valid: null,
					message: null,
				},
				styleValid: parseJSON(extractParameterValue(newStyle)) !== null,
				paramsValid: parseJSON(extractParameterValue(newParams)) !== null,
			})
		)
	}, [queryParams, dispatch])

	const checkTokenAvailability = useCallback(async () => {
		if (localStorage.getItem('omni-studio-api-access-token') === null) {
			dispatch(
				changeOmniStudioTokenState({
					valid: false,
					availability: OMNI_STUDIO_NOT_GENERATED,
				})
			)
		} else {
			const responseObject = await checkOmniStudioTokenValidity(
				localStorage.getItem('omni-studio-api-access-token')
			)

			dispatch(
				changeOmniStudioTokenState({
					valid: responseObject.valid,
					availability: responseObject.message,
				})
			)
		}

		if (localStorage.getItem('public-api-access-token') === null) {
			dispatch(
				changePublicApiTokenState({
					valid: false,
					availability: PUBLIC_API_NOT_GENERATED,
				})
			)
		} else {
			const responseObject = await checkPublicApiTokenValidity(
				localStorage.getItem('public-api-access-token')
			)
			dispatch(
				changePublicApiTokenState({
					valid: responseObject.valid,
					availability: responseObject.message,
				})
			)
		}
	}, [dispatch])

	const handleButtonClick = () => {
		if (boardID === null || widgetID === null) {
			alert('Error during embedding - boardID andd widgetID must be specified!')
			return
		}

		queryParams.set('boardID', boardID)
		queryParams.set('widgetID', widgetID)
		queryParams.set('showConfig', showConfig)
		queryParams.set('showConfigRevealed', showConfigRevealed)
		queryParams.set('height', height)
		queryParams.set('width', width)
		queryParams.set('className', className)
		queryParams.set('params', params)
		queryParams.set('style', style)

		const newUrl = `${window.location.pathname}?${queryParams.toString()}`
		window.history.pushState({ path: newUrl }, '', newUrl)
		dispatch(
			changeVisualizationState({
				boardID: boardID,
				widgetID: widgetID,
				showConfig: showConfig,
				showConfigRevealed: showConfigRevealed,
				height: height,
				width: width,
				className: className,
				params: parseJSON(params),
				style: parseJSON(style),
			})
		)
	}

	const memoizedWidget = useMemo(() => {
		if (visualizationState) {
			return (
				<Widget
					boardID={visualizationState.boardID}
					widgetID={visualizationState.widgetID}
					params={visualizationState.params}
					width={visualizationState.width}
					height={visualizationState.height}
					className={visualizationState.className}
					showConfig={visualizationState.showConfig}
					showConfigRevealed={visualizationState.showConfigRevealed}
					style={visualizationState.style}
					tokenFunc={getTokensFromLocalStorage}
				/>
			)
		}

		return null
	}, [visualizationState])

	const connectPublicApiToken = useCallback(async () => {
		const id = makeRequestID()
		window.open(`/user/setup-public-api-token/${id}`, '_blank')
		const token = await getPublicApiToken(id)

		if (token !== null) {
			localStorage.setItem('public-api-access-token', token.access_token)
			localStorage.setItem('public-api-refresh-token', token.refresh_token)
			checkTokenAvailability()
		}
	}, [checkTokenAvailability])

	const connectOmniStudioToken = useCallback(async () => {
		const id = makeRequestID()
		window.open(`/user/setup-omni-studio-api-token/${id}`, '_blank')
		const token = await getOmniStudioApiToken(id)
		if (token !== null) {
			localStorage.setItem('omni-studio-api-access-token', token.access_token)
			localStorage.setItem('omni-studio-api-refresh-token', token.refresh_token)
			checkTokenAvailability()
		}
	}, [checkTokenAvailability])

	const generateWidgetComponentCode = () => {
		dispatch(openModal('codeModal'))
		if (visualizationState !== null) {
			const {
				boardID,
				widgetID,
				params,
				style,
				width,
				height,
				className,
				showConfig,
				showConfigRevealed,
			} = visualizationState

			const widgetLines = [
				`<Widget`,
				boardID && `boardID={${boardID}}`,
				widgetID && `widgetID={${widgetID}}`,
				width && `width={${width}}`,
				height && `height={${height}}`,
				className && `className={${className}}`,
				params && `params={${JSON.stringify(params)}}`,
				style && `style={${JSON.stringify(style)}}`,
				showConfig && `showConfig={${showConfig}}`,
				showConfigRevealed && `showConfigRevealed={${showConfigRevealed}}`,
				`/>`,
			].filter(Boolean)

			dispatch(
				changeWidgetCode(
					`${widgetLines.filter((line) => line !== '').join('\n')}`
				)
			)
		} else {
			dispatch(changeWidgetCode('Invalid visualization state!'))
		}
	}

	const copyEnvVariables = () => {
		const envText = `ACCESS_TOKEN=${localStorage.getItem(
			'public-api-access-token'
		)}\nOMNI_API_TOKEN=${localStorage.getItem('omni-studio-api-access-token')}`

		navigator.clipboard.writeText(envText)
	}

	const getTokensFromLocalStorage = () => {
		return {
			omniApiToken: localStorage.getItem('omni-studio-api-access-token'),
			publicApiToken: localStorage.getItem('public-api-access-token'),
		}
	}

	return (
		<Box
			display='flex'
			flexDirection='column'
			justifyContent='space-between'
			height='100vh'
		>
			<Box>
				<Box display='flex' alignItems='center' justifyContent='space-between'>
					<h1>Emplifi Embedding playground</h1>
					{visualizationState ? (
						<Button
							onClick={generateWidgetComponentCode}
							variant='outlined'
							startIcon={<CodeIcon />}
						>
							Embed
						</Button>
					) : null}
				</Box>
				<Box
					display='flex'
					borderRadius={8}
					border='1px solid gray'
					overflow='auto'
				>
					<Box
						padding={1}
						alignItems='center'
						display='flex'
						flexDirection='column'
					>
						<Stack spacing={1} direction='row'>
							<TextField
								variant='outlined'
								label='Board ID'
								onChange={() => dispatch(changeBoardID(event.target.value))}
								value={boardID ?? ''}
								type='number'
								size='small'
								style={{ width: 120 }}
							/>
							<TextField
								variant='outlined'
								label='Widget ID'
								onChange={() => dispatch(changeWidgetID(event.target.value))}
								value={widgetID ?? ''}
								type='number'
								size='small'
								style={{ width: 120 }}
							/>
						</Stack>
						<Box>
							<FormGroup>
								<FormControlLabel
									control={<Switch />}
									onChange={() =>
										dispatch(changeShowConfig(event.target.checked))
									}
									label='Show Config'
									checked={showConfig}
								/>
								<FormControlLabel
									control={<Switch />}
									label='Show Revealed Config'
									onChange={() =>
										dispatch(changeShowConfigRevealed(event.target.checked))
									}
									checked={showConfigRevealed}
								/>
							</FormGroup>
						</Box>
						<Box>
							<TextField
								variant='outlined'
								label='ClassName'
								value={className ?? ''}
								onChange={() => dispatch(changeClassName(event.target.value))}
								size='small'
								fullWidth
							/>
						</Box>
						<Box padding={1} flexDirection='column'>
							<TextField
								variant='outlined'
								label={<>Style: {styleValid ? <CheckIcon /> : <ErrorIcon />}</>}
								value={style ?? ''}
								onChange={() => dispatch(changeStyle(event.target.value))}
								size='small'
								fullWidth
								maxRows={10}
								minRows={5}
								multiline
								InputProps={{
									endAdornment: (
										<IconButton
											size='small'
											onClick={() => {
												dispatch(openModal('styleModal'))
											}}
										>
											<LaunchIcon fontSize='small' />
										</IconButton>
									),
								}}
							/>
						</Box>
						<Box padding={1} flexDirection='column'>
							<TextField
								variant='outlined'
								label={
									<>Params: {paramsValid ? <CheckIcon /> : <ErrorIcon />}</>
								}
								value={params ?? ''}
								onChange={() => dispatch(changeParams(event.target.value))}
								size='small'
								fullWidth
								maxRows={10}
								minRows={5}
								multiline
								InputProps={{
									endAdornment: (
										<IconButton
											aria-label='delete'
											size='small'
											onClick={() => {
												dispatch(openModal('paramsModal'))
											}}
										>
											<LaunchIcon fontSize='small' />
										</IconButton>
									),
								}}
							/>
						</Box>

						<Stack spacing={1} direction='row'>
							<TextField
								type='number'
								label='Width'
								onChange={() => dispatch(changeWidth(event.target.value))}
								value={width ?? ''}
								size='small'
								style={{ width: 120 }}
							/>
							<TextField
								type='number'
								label='Height'
								onChange={() => dispatch(changeHeight(event.target.value))}
								value={height ?? ''}
								size='small'
								style={{ width: 120 }}
							/>
						</Stack>
						<Button
							onClick={handleButtonClick}
							variant='contained'
							disabled={
								!publicApiTokenState.valid || !omniStudioTokenState.valid
							}
						>
							Preview
						</Button>
					</Box>
					<Divider orientation='vertical' flexItem />
					<Box
						padding={1}
						flexDirection='column'
						justifyContent='center'
						flex={1}
						display='flex'
					>
						{visualizationState === null ? (
							<p>Widget will be embedded here.</p>
						) : (
							memoizedWidget
						)}
					</Box>
				</Box>
			</Box>
			<WidgetCodeModal />
			<TextFieldModal label='Params' id='params' />
			<TextFieldModal label='Style' id='style' />

			<Box margin={1} display='flex' flexDirection='column' padding={2}>
				<Divider>
					<Chip label='Token Status' size='medium' />
				</Divider>
				<Box display='flex' justifyContent='space-between' width='100%'>
					<Stack direction='row' spacing={2}>
						<Box display='flex' alignItems='center'>
							<Box flex={1} margin={1}>
								<Tooltip title={omniStudioTokenState.availability}>
									<span>Omni Studio Token:</span>
								</Tooltip>
							</Box>
							<Box>
								{omniStudioTokenState.valid ? (
									<CheckCircleIcon color='success' />
								) : (
									<Button
										onClick={connectOmniStudioToken}
										variant='outlined'
										size='small'
									>
										Reconnect
									</Button>
								)}
							</Box>
						</Box>
						<Box display='flex' alignItems='center'>
							<Box flex={1} margin={1}>
								<Tooltip title={publicApiTokenState.availability}>
									<span>Public API Token:</span>
								</Tooltip>
							</Box>
							<Box>
								{publicApiTokenState.valid ? (
									<CheckCircleIcon color='success' />
								) : (
									<Button
										onClick={connectPublicApiToken}
										variant='outlined'
										size='small'
									>
										Reconnect
									</Button>
								)}
							</Box>
						</Box>
					</Stack>
					<Button
						variant='outlined'
						color='primary'
						onClick={copyEnvVariables}
						endIcon={<ContentCopyIcon />}
					>
						.env
					</Button>
				</Box>
			</Box>
		</Box>
	)
}

export default Playground
