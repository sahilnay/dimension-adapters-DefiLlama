import { Adapter, FetchOptions } from '../../adapters/types';
import { httpGet } from '../../utils/fetchURL';
import { CHAIN } from '../../helpers/chains';

const EcoChains: Record<string, string> = {
  [CHAIN.ETHEREUM]: '1',
  [CHAIN.BASE]: '8453',
  [CHAIN.ARBITRUM]: '42161',
  [CHAIN.POLYGON]: '137',
  [CHAIN.OPTIMISM]: '10',
  [CHAIN.UNICHAIN]: '130',
  [CHAIN.INK]: '57073',
  [CHAIN.CELO]: '42220',
  [CHAIN.SONIC]: '146',
};

const fetch: any = async (timestamp: number, _: any, options: FetchOptions) => {
  const balances = options.createBalances();


  const chainId = EcoChains[options.chain];
  const data = await httpGet(`https://event-query-node.eco.com/api/v1/routes/chain-tokens?chain_id=${chainId}&start_date=${options.startTimestamp}&end_date=${options.endTimestamp}`);

  for (const item of data.result) {
    balances.add(item.token, BigInt(item.volume_raw));
  }

  return {
    dailyBridgeVolume: balances,
  }
}

const chainAdapter = { fetch, start: '2025-01-14' }

const adapter: Adapter = {
  adapter: Object.fromEntries(Object.entries(EcoChains).map(
    ([chain]) => [chain, chainAdapter]
  )),
}

export default adapter;
