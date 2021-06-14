import { createSlice } from '@reduxjs/toolkit'

const initialState = { participants: [], destinies: [] }

const slice = createSlice({
	name: 'general',
	initialState,
	reducers: {
		putParticipants(state, action) {
			state.participants = action.payload
		},
		putDestinies(state, action) {
			state.destinies = action.payload
		},
	},
})

export default slice

export const { name, actions, reducer } = slice