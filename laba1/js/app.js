(function () {
  'use strict';

  function initApp() {
    window.StudentForm.initStudentForm();
    window.StudentTable.renderStudentsTable();

    document.getElementById('studentsTableBody')?.addEventListener('click', window.StudentTable.handleTableClick);
    document.getElementById('studentSearch')?.addEventListener('input', window.StudentTable.renderStudentsTable);
    document.getElementById('addStudentButton')?.addEventListener('click', window.StudentForm.openAddForm);
    document.getElementById('showListButton')?.addEventListener('click', () => {
      window.StudentTable.renderStudentsTable();
      window.AppNavigation.showList();
    });
    document.getElementById('backFromDossierButton')?.addEventListener('click', () => {
      window.StudentTable.renderStudentsTable();
      window.AppNavigation.showList();
    });
  }

  document.addEventListener('DOMContentLoaded', initApp);
})();
