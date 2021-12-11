import { createSlice } from "@reduxjs/toolkit"
import { Participant } from "../../models/participants"
import { Destiny } from "../../models/destinies"
import { Programs } from "../../models/programs"
interface InitialState {
  participants: Participant[]
  destinies: Destiny[]
  programs: Programs[]
  year: number
}
const initialState: InitialState = { participants: [], destinies: [], programs: [], year: 2022 }

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
    putParticipantsProgram(state, action) {
      state.programs[action.payload.program].participants =
        action.payload.participants
    },
    putWinnersProgram(state, action) {
      state.programs[action.payload.program].winners = action.payload.winners
    },
    putYear(state, action) {
      state.year = action.payload
    },
  },
})

export default slice

export const { name, actions, reducer } = slice
