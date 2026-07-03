import { describe, it, expect, render, cleanup } from 'react-native-harness';
import { View } from 'react-native';

describe('empty leak file 036', () => {
  it('renders an empty view #036', async () => {
    await render(<View style={{ width: 10, height: 10 }} />);
    expect(true).toBe(true);
    cleanup();
  });
});
