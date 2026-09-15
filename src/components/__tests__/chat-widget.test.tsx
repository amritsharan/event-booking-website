import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatWidget } from '@/components/chat-widget';

// Mock server action
jest.mock('@/app/actions', () => ({
  askChatbotAction: jest.fn().mockResolvedValue({ text: 'I am your concierge.' }),
}));

describe('ChatWidget', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders chat launcher button initially', () => {
    render(<ChatWidget />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('opens chat window when clicked', () => {
    render(<ChatWidget />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Gilded Concierge')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ask a question...')).toBeInTheDocument();
  });
});
