(function () {
  'use strict';

  const screens = {
    list: 'studentsScreen',
    form: 'formScreen',
    dossier: 'dossierScreen'
  };

  function showScreen(screenName) {
    Object.entries(screens).forEach(([name, id]) => {
      const screen = document.getElementById(id);
      screen?.classList.toggle('is-visible', name === screenName);
    });

    document.getElementById('showListButton')?.classList.toggle('is-active', screenName === 'list');
  }

  window.AppNavigation = {
    showList: () => showScreen('list'),
    showForm: () => showScreen('form'),
    showDossier: () => showScreen('dossier')
  };
})();
