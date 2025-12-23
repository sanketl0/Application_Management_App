import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: spy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should authenticate user and store token', () => {
      const mockResponse = {
        token: 'test-token-123',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User'
        }
      };

      const credentials = { username: 'testuser', password: 'password123' };

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('auth_token')).toBe('test-token-123');
        expect(localStorage.getItem('user_data')).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/login/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockResponse);
    });

    it('should update currentUser$ observable after login', (done) => {
      const mockResponse = {
        token: 'test-token',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User'
        }
      };

      service.currentUser$.subscribe(user => {
        if (user) {
          expect(user.username).toBe('testuser');
          done();
        }
      });

      service.login({ username: 'testuser', password: 'password123' }).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/login/`);
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should clear storage and navigate to login', () => {
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('user_data', JSON.stringify({ id: 1, username: 'test' }));

      service.logout();

      const req = httpMock.expectOne(`${environment.apiUrl}/logout/`);
      req.flush({});

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('user_data')).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should clear storage even if API fails', () => {
      localStorage.setItem('auth_token', 'test-token');

      service.logout();

      const req = httpMock.expectOne(`${environment.apiUrl}/logout/`);
      req.error(new ProgressEvent('error'));

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('auth_token', 'test-token');
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false when token does not exist', () => {
      localStorage.removeItem('auth_token');
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('getToken', () => {
    it('should return stored token', () => {
      localStorage.setItem('auth_token', 'my-token');
      expect(service.getToken()).toBe('my-token');
    });

    it('should return null when no token exists', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user from observable', (done) => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User'
      };

      localStorage.setItem('user_data', JSON.stringify(mockUser));
      service = TestBed.inject(AuthService); // Reinitialize to read from localStorage

      const user = service.getCurrentUser();
      expect(user?.username).toBe('testuser');
      done();
    });
  });
});