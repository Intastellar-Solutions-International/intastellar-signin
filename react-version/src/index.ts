// Main exports - automatically detects environment
export * from './types';
export { IntastellarAPI } from './api';

// React exports
export { useIntastellar, IntastellarButton } from './react';

// React Native exports (when available)
export { useIntastellarRN, IntastellarButton as IntastellarButtonRN } from './react-native';
