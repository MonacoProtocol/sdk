export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_PROGRAM_ID: string;
      NEXT_PUBLIC_NODE: string;
    }
  }
}

