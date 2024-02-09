import { IMarketOutcome } from '@/database/types';

interface OutcomeProps {
  outcomes: IMarketOutcome[];
  isLoadingOutcomes: boolean;
}

const Skeleton = () => (
  <div
    style={{
      width: '100%',
      height: '20px',
      backgroundColor: '#eee',
      marginBottom: '10px',
    }}
  />
);

const OutcomesComponent: React.FC<OutcomeProps> = ({ outcomes, isLoadingOutcomes }) => {
  return (
    <div>
      {isLoadingOutcomes ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        <ul>
          {outcomes.map((outcome) => (
            <li key={outcome.publicKey}>{outcome.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OutcomesComponent;
