import "@testing-library/jest-dom";

jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

class MockPointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerType: string;

  constructor(type: string, props: PointerEventInit) {
    super(type, props);
    this.button = props.button ?? 0;
    this.ctrlKey = props.ctrlKey ?? false;
    this.pointerType = props.pointerType ?? 'mouse';
  }
}

// Apply mocks
(window as any).PointerEvent = MockPointerEvent;
(window.HTMLElement.prototype as any).scrollIntoView = jest.fn();
(window.HTMLElement.prototype as any).releasePointerCapture = jest.fn();
(window.HTMLElement.prototype as any).setPointerCapture = jest.fn();
(window.HTMLElement.prototype as any).hasPointerCapture = jest.fn();

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(window as any).ResizeObserver = ResizeObserver;
