import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

describe('LoadingSkeleton component', () => {
  it('renders without crashing', () => {
    const { container } = render(<LoadingSkeleton />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders card variant with animate-pulse class', () => {
    const { container } = render(<LoadingSkeleton variant="card" />);
    expect(container.querySelector('.animate-pulse')).not.toBeNull();
  });

  it('renders list variant', () => {
    const { container } = render(<LoadingSkeleton variant="list" />);
    expect(container.querySelector('.animate-pulse')).not.toBeNull();
  });

  it('renders chart variant', () => {
    const { container } = render(<LoadingSkeleton variant="chart" />);
    expect(container.querySelector('.animate-pulse')).not.toBeNull();
  });

  it('renders generic variant by default', () => {
    const { container } = render(<LoadingSkeleton />);
    expect(container.querySelector('.animate-pulse')).not.toBeNull();
  });

  it('renders with custom className', () => {
    const { container } = render(<LoadingSkeleton className="custom-test-class" />);
    expect(container.innerHTML).toContain('custom-test-class');
  });

  it('renders multiple cards when count > 1', () => {
    const { container } = render(<LoadingSkeleton variant="card" count={3} />);
    const pulsingElements = container.querySelectorAll('.animate-pulse');
    expect(pulsingElements.length).toBeGreaterThanOrEqual(1);
  });
});
