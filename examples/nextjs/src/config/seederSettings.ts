import { SeederSettings, SeederSides } from '@/types/settings';

const defaultSeederSettings: SeederSettings = {
  enabled: true,
  truePrice: '2',
  spread: '2',
  steps: '2',
  depth1: '100',
  depth2: '100',
  depth3: '100',
  sides: SeederSides.FOR_AGAINST,
  backToWin: '100',
  layToLose: '100',
};

export default defaultSeederSettings;
