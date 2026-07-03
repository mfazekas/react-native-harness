import { describe, it, expect, render, cleanup } from 'react-native-harness';
import { View } from 'react-native';

describe('empty leak file 037', () => {
  it('renders an empty view #037', async () => {
    await render(<View style={{ width: 10, height: 10 }} />);
    expect(true).toBe(true);
    cleanup();
  });
});
