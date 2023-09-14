import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { UtilsService } from './utils.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { NbOverlayModule, NbThemeModule, NbToastrModule, NbToastrService } from '@nebular/theme';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr'; // Importez les données de localisation pour le français


// Enregistrez les données de localisation pour le français
registerLocaleData(localeFr, 'fr');

describe('UtilsService', () => {
  let utilsService: UtilsService;
	let nbToastrService: NbToastrService;
	let router: Router;

  // Mocks
  const ActivatedRouteSpy = {
    snapshot: {
      paramMap: convertToParamMap({
        some: 'some',
        else: 'else',
      }),
    },
    queryParamMap: of(
      convertToParamMap({
        some: 'some',
        else: 'else',
      })
    ),
  };

  const RouterSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NbToastrModule.forRoot(), NbOverlayModule.forRoot(), NbThemeModule.forRoot(), RouterTestingModule],
      providers: [
        UtilsService,
				NbToastrService,
        { provide: Router, useValue: RouterSpy },
        { provide: ActivatedRoute, useValue: ActivatedRouteSpy },
      ],
    });
    utilsService = TestBed.inject(UtilsService);
		nbToastrService = TestBed.inject(NbToastrService);
		router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('Devrait être créé', () => {
    expect(utilsService).toBeTruthy();
  });

  it('Devrait formater la date', () => {
    const formatedDate = utilsService.formatDate(new Date(), 'yyyy-MM-dd');
    expect(formatedDate).toBe('2023-09-14');
  });

	it('Devrait formater en decimal', () => {
		const decimal = utilsService.formatDecimal('10');
		expect(decimal.toString()).toBe('10');
	});

	it('Devrait parser en decimal', () => {
		const decimal = utilsService.parseDecimal(10);
		expect(decimal).toBe(10.0);
	});

	it('Devrait appeler nbToastrService.show avec les bons paramètres', () => {
    // Créez un espion (spy) pour la méthode nbToastrService.show
    const showSpy = spyOn(nbToastrService, 'show');

    // Appelez la fonction à tester
    utilsService.displayError('Message d\'erreur', 'Titre', false);

    // Vérifiez que nbToastrService.show a été appelée avec les bons paramètres
    expect(showSpy).toHaveBeenCalledWith(
      'Message d\'erreur',
      'Titre',
      {
        status: 'danger',
        duration: 10000,
        icon: '',
        destroyByClick: true,
        toastClass: 'cb-toast',
        preventDuplicates: true,
      }
    );
  });

	it('Devrait appeler nbToastrService.show avec les bons paramètres', () => {
    // Créez un espion (spy) pour la méthode nbToastrService.show
    const showSpy = spyOn(nbToastrService, 'show');

    // Appelez la fonction à tester
    utilsService.displayAlert('Message d\'alerte', 'Titre');

    // Vérifiez que nbToastrService.show a été appelée avec les bons paramètres
    expect(showSpy).toHaveBeenCalledWith(
      'Message d\'alerte',
      'Titre',
      {
        status: 'warning',
        duration: 5000,
        icon: '',
				destroyByClick: true,
				toastClass: 'Titre' ? 'cb-toast' : 'cb-toast-without-title',
				preventDuplicates:true
      }
    );
  });

	it('Devrait appeler nbToastrService.show avec les bons paramètres', () => {
    // Créez un espion (spy) pour la méthode nbToastrService.show
    const showSpy = spyOn(nbToastrService, 'show');

    // Appelez la fonction à tester
    utilsService.displayInfo('Message d\'alerte', 'Titre');

    // Vérifiez que nbToastrService.show a été appelée avec les bons paramètres
    expect(showSpy).toHaveBeenCalledWith(
      'Message d\'alerte',
      'Titre',
      {
        status: 'info',
      duration: 5000,
      icon: '',
      destroyByClick: true,
      toastClass: 'Titre' ? 'cb-toast' : 'cb-toast-without-title',
      preventDuplicates:true
      }
    );
  });

	it('devrait télécharger le fichier avec les paramètres appropriés', () => {
    // Créez des espions (spies) pour les méthodes et les objets nécessaires
    const createObjectURLSpy = spyOn(window.URL, 'createObjectURL');
    /* const createElementSpy = spyOn(document, 'createElement').and.returnValue({ click: () => {} }); */
    const appendChildSpy = spyOn(document.body, 'appendChild');
    const removeChildSpy = spyOn(document.body, 'removeChild');

    // Appelez la fonction à tester
    utilsService.downloadFile('base64data', 'example.pdf', 'application/pdf');

    // Vérifiez que les méthodes ont été appelées avec les bons paramètres
    expect(createObjectURLSpy).toHaveBeenCalledOnceWith(new Blob([Uint8Array.from([104, 101, 108, 108, 111])], { type: 'application/pdf' }));
    /* expect(createElementSpy).toHaveBeenCalledOnceWith('a'); */
    expect(appendChildSpy).toHaveBeenCalledOnceWith(jasmine.any(HTMLAnchorElement));
    expect(removeChildSpy).toHaveBeenCalledOnceWith(jasmine.any(HTMLAnchorElement));
  });

	it('devrait rediriger vers une route sans état', () => {
    const route = '/example';

    // Appelez la fonction à tester
    utilsService.redirectTo(route);

    // Vérifiez que router.navigateByUrl a été appelée avec la route appropriée
    expect(router.navigateByUrl).toHaveBeenCalledWith(route);
  });

  it('devrait rediriger vers une route avec un état', () => {
    const route = '/example';
    const state = { data: 'someData' };

    // Appelez la fonction à tester
    utilsService.redirectTo(route, state);

    // Vérifiez que router.navigateByUrl a été appelée avec la route et l'état appropriés
    expect(router.navigateByUrl).toHaveBeenCalledWith(route, { state });
  });

});
