// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { createChromeMock } from './test/chrome-mock';

// Provide a fresh in-memory `chrome` API mock for every test file.
(globalThis as any).chrome = createChromeMock();

