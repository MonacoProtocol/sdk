import { ProgramConnectedState, ProgramState } from "./state";

export enum ProgramActionTypes {
  SET_PROGRAM = "SET_PROGRAM",
  CLEAR_PROGRAM = "CLEAR_PROGRAM",
}

type SetProgramAction = {
  type: ProgramActionTypes.SET_PROGRAM;
  payload: ProgramConnectedState;
};

type ClearProgram = {
  type: ProgramActionTypes.CLEAR_PROGRAM;
};

type ProgramAction = SetProgramAction | ClearProgram;

export const reducer = (
  state: ProgramState,
  action: ProgramAction,
): ProgramState => {
  switch (action.type) {
    case ProgramActionTypes.SET_PROGRAM:
      return action.payload;
    case ProgramActionTypes.CLEAR_PROGRAM:
      return null;
    default:
      return state;
  }
};
