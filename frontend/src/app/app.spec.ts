import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { MaritimeService } from './services/maritime.service';

describe('App Component', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });

    class MockIntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      value: MockIntersectionObserver,
    });
    Object.defineProperty(globalThis, 'IntersectionObserver', {
      writable: true,
      value: MockIntersectionObserver,
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should load MaritimeService with default 1 vessel and 1 office', () => {
    const service = TestBed.inject(MaritimeService);
    expect(service.vessels().length).toBe(1);
    expect(service.vessels()[0].name).toBe('MAVERICK SOHAR');
    expect(service.agents().length).toBe(1);
    expect(service.services().length).toBe(1);
    expect(service.services()[0].code).toBe('SMNK');
  });
});

