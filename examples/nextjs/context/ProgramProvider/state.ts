import { createContext } from "react";
import { Idl, Program } from "@project-serum/anchor";
import { AssertionError } from "assert";

export type ProgramConnectedState = Program<Idl>;

export type ProgramNotConnectedState = null;

export type ProgramState =
  | ProgramConnectedState
  | ProgramNotConnectedState;

export const initalState = null;

export function assertIsProgramLoaded(
  program: ProgramState,
): asserts program is ProgramConnectedState {
  if (program === undefined) {
    throw new AssertionError({
      message: "Program has not been loaded",
    });
  }
}

export const ProgramContext =
  createContext<ProgramState>(initalState);
