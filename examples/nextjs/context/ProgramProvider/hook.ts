import { useContext } from "react";
import {
  assertIsProgramLoaded,
  ProgramContext,
} from "./state";

export const useProgram = () => {
  const program = useContext(ProgramContext);
  assertIsProgramLoaded(program);
  return program;
};
