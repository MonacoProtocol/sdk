import { useProgram } from '@/context/ProgramContext';

const VersionComponent: React.FC = () => {
  const programContext = useProgram();
  if (programContext.program && programContext.productProgram) {
    return (
      <>
        <h3>Protocol Versions</h3>
        <div>Monaco Protocol: {programContext.program.idl.version}</div>
        <div>Product: {programContext.productProgram.idl.version}</div>
      </>
    );
  }
};

export default VersionComponent;
