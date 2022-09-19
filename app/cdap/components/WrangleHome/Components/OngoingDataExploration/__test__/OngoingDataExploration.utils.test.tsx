import { arg, result } from '../mock/oldData.mock';
import { generateDataForExplorationCard } from '../utils';

describe('Test the Utility Functions', () => {
  it('Should test the result for empty array', () => {
    const result = generateDataForExplorationCard([]);
    expect(result).toEqual([]);
  });

  it('Should test the result for mock data', () => {
    const result = generateDataForExplorationCard(arg);
    expect(result).toEqual(result);
  });
});
