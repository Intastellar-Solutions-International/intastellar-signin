import React from 'react';
import { useIntastellar } from './useIntastellar';
import { IntastellarConfig, IntastellarTheme } from './types';

interface IntastellarButtonProps extends IntastellarConfig {
  theme?: IntastellarTheme;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const IntastellarButton: React.FC<IntastellarButtonProps> = ({
  theme = { theme: 'light', picker: 'button' },
  className = '',
  children,
  style,
  ...config
}) => {
  const { users, isLoading, signin, isSignedIn } = useIntastellar(config);

  const handleClick = () => {
    if (users.length === 1) {
      signin(users[0].email);
    } else {
      signin();
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Loading...';
    if (users.length === 1) return `Continue as ${users[0].name.first}`;
    return 'Sign in with Intastellar';
  };

  const buttonClasses = `
    intastellar-signin-button
    ${theme.theme === 'dark' ? 'dark' : 'light'}
    ${className}
  `.trim();

  const defaultStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    border: '1px solid #dadce0',
    borderRadius: '4px',
    backgroundColor: theme.theme === 'dark' ? '#2d2d2d' : '#fff',
    color: theme.theme === 'dark' ? '#fff' : '#3c4043',
    fontSize: '14px',
    fontWeight: '500',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    ...style,
  };

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={isLoading}
      style={defaultStyle}
    >
      {users.length === 1 && (
        <img
          src={users[0].image}
          alt="Profile"
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
          }}
        />
      )}
      <img
        src="https://www.intastellarsolutions.com/assets/logos/intastellar-new-planet.svg"
        alt="Intastellar"
        style={{ width: '18px', height: '18px' }}
      />
      {children || getButtonText()}
    </button>
  );
};
