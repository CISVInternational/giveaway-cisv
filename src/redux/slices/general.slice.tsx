import { createSlice } from "@reduxjs/toolkit"

const initialState = { participants: [], destinies: [], programs: [] }

const slice = createSlice({
  name: "general",
  initialState,
  reducers: {
    putParticipants(state, action) {
      state.participants = action.payload
    },
    putDestinies(state, action) {
      state.destinies = action.payload
    },
    putPrograms(state, action) {
      state.programs = action.payload
    },
  },
})

export default slice

export const { name, actions, reducer } = slice
