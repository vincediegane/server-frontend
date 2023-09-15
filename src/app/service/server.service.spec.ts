import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServerService } from './server.service';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';
import { Status } from '../enum/status.enum';

describe('ServerService', () => {
  
  let serverService: ServerService;
  let httpTestingController: HttpTestingController;
  let apiUrl = 'http://localhost:8080/server';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ServerService],
    });
    serverService = TestBed.inject(ServerService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('devrait récupérer la liste des serveurs', () => {
    const expectedResponse: CustomResponse = {
      timeStamp: new Date(),
      statusCode: 0,
      status: '',
      reason: '',
      message: '',
      developerMessage: '',
      data: {
        servers: undefined,
        server: undefined
      }
    };

    serverService.servers$.subscribe((response: CustomResponse) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/list`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('devrait récupérer un serveur par ID', () => {
    const serverId = 1;
    const expectedResponse: CustomResponse = {
      timeStamp: new Date(),
      statusCode: 0,
      status: '',
      reason: '',
      message: '',
      developerMessage: '',
      data: {
        servers: undefined,
        server: undefined
      }
    };

    serverService.server$(serverId).subscribe((response: CustomResponse) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/${serverId}`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedResponse);
  });

  it('devrait sauvegarder un serveur', () => {
    const server: Server = {
      id: 0,
      ipAddress: '',
      name: '',
      memory: '',
      type: '',
      imageUrl: '',
      status: Status.ALL
    };
    const expectedResponse: CustomResponse = {
      timeStamp: new Date(),
      statusCode: 0,
      status: '',
      reason: '',
      message: '',
      developerMessage: '',
      data: {
        servers: undefined,
        server: undefined
      }
    };

    serverService.save$(server).subscribe((response: CustomResponse) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/save`);
    expect(req.request.method).toBe('POST');
    req.flush(expectedResponse);
  });

  // Ajoutez d'autres tests pour les autres méthodes du service
  // Comme ping$, filter$, delete$, etc.

  it('devrait gérer les erreurs HTTP', () => {
    const server: Server = {
      id: 0,
      ipAddress: '',
      name: '',
      memory: '',
      type: '',
      imageUrl: '',
      status: Status.ALL
    };
    const errorMessage = 'Erreur HTTP 500';

    serverService.save$(server).subscribe(
      () => fail('La requête ne devrait pas réussir'),
      (error) => {
        expect(error.message).toBe(`An error occured - Error code: 500`);
      }
    );

    const req = httpTestingController.expectOne(`${apiUrl}/save`);
    expect(req.request.method).toBe('POST');
    req.error(new ErrorEvent('HTTP error', { message: errorMessage }), { status: 500 });
  });

  it('devrait filtrer les serveurs par statut SERVER_UP', (done) => {
    const status = Status.SERVER_UP;
    const response: CustomResponse = {
      data: {
        servers: [
          { id: 1, status: Status.SERVER_UP, ipAddress: '', name: '', memory: '', type: '', imageUrl: '' },
          { id: 2, status: Status.SERVER_DOWN, ipAddress: '', name: '', memory: '', type: '', imageUrl: '' }
        ],
      },
      message: 'Servers filtered by SERVER UP status',
      timeStamp: new Date(),
      statusCode: 0,
      status: '',
      reason: '',
      developerMessage: ''
    };

    serverService.filter$(status, response).subscribe((filteredResponse: CustomResponse) => {
      expect(filteredResponse.message).toBe('Servers filtered by SERVER UP status');
      expect(filteredResponse.data!.servers!.length).toBe(1);
      expect(filteredResponse.data!.servers![0].status).toBe(Status.SERVER_UP);
      done();
    });
  });

  it('devrait filtrer les serveurs par statut SERVER_DOWN', (done) => {
    const status = Status.SERVER_DOWN;
    const response: CustomResponse = {
      data: {
        servers: [
          { id: 1, status: Status.SERVER_UP, ipAddress: '', name: '', memory: '', type: '', imageUrl: '' },
          { id: 2, status: Status.SERVER_DOWN, ipAddress: '', name: '', memory: '', type: '', imageUrl: '' }
        ],
      },
      message: 'Servers filtered by SERVER DOWN status',
      timeStamp: new Date(),
      statusCode: 0,
      status: '',
      reason: '',
      developerMessage: ''
    };

    serverService.filter$(status, response).subscribe((filteredResponse: CustomResponse) => {
      expect(filteredResponse.message).toBe('Servers filtered by SERVER DOWN status');
      expect(filteredResponse.data!.servers!.length).toBe(1);
      expect(filteredResponse.data!.servers![0].status).toBe(Status.SERVER_DOWN);
      done();
    });
  });

  it('devrait retourner un message approprié si aucun serveur ne correspond', (done) => {
    const status = Status.SERVER_UP;
    const response: CustomResponse = {
      data: {
        servers: [
          { id: 1, status: Status.SERVER_DOWN, ipAddress: '', name: '', memory: '', type: '', imageUrl: '' }
        ],
      },
      message: 'No servers of SERVER UP found',
      timeStamp: new Date(),
      statusCode: 0,
      status: '',
      reason: '',
      developerMessage: ''
    };

    serverService.filter$(status, response).subscribe((filteredResponse: CustomResponse) => {
      filteredResponse
      expect(filteredResponse.message).toBe('No servers of SERVER_UP found');
      expect(filteredResponse.data!.servers!.length).toBe(0);
      done();
    });
  });
});
