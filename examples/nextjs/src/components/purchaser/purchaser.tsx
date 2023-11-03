import Link from 'next/link';

import { truncateString } from '@/utils/display';
import { generateExplorerLink } from '@/utils/navigation';

interface PurchaserProps {
  purchaser: string;
  loading: boolean;
}

const PurchaserComponent: React.FC<PurchaserProps> = ({ purchaser, loading }) => {
  if (loading) return null;
  return (
    <div>
      <h3>
        Purchaser:{' '}
        <a href={generateExplorerLink(purchaser, false, true)} target="_blank" rel="noreferrer">
          {truncateString(purchaser)}
        </a>
      </h3>
      <Link
        key={`${purchaser}-view-insight}`}
        href={`/walletInsight?publicKey=${purchaser}`}
        style={{ textDecoration: 'none' }}
      >
        View Wallet Insight...
      </Link>
    </div>
  );
};

export default PurchaserComponent;
