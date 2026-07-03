import { describe, it, expect, render, cleanup } from 'react-native-harness';
import { View } from 'react-native';

describe('empty leak file 027', () => {
  it('renders an empty view #027', async () => {
    await render(<View style={{ width: 10, height: 10 }} />);
    expect(true).toBe(true);
    cleanup();
  });
});
