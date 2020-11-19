//
// Copyright 2020 DXOS.org
//

import { render, screen } from '@testing-library/react';
import React from 'react';

import Messages from '../src/components/Messages';

describe('Test Messages', () => {
  it('Render Messages', () => {
    render(<Messages><span>TestPad</span></Messages>);
    expect(() => screen.getByText('TestPad')).not.toThrow();
  });
});
