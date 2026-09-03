(function () {
  'use strict';

  function formatDate(value) {
    if (!value) {
      return 'Не указано';
    }

    return new Intl.DateTimeFormat('ru-RU').format(new Date(`${value}T00:00:00`));
  }

  function createField(label, value, className = '') {
    const field = document.createElement('div');
    field.className = `dossier-field ${className}`.trim();

    const labelElement = document.createElement('span');
    labelElement.textContent = label;

    const valueElement = document.createElement('strong');
    valueElement.textContent = value || 'Не указано';

    field.append(labelElement, valueElement);
    return field;
  }

  function showStudentDossier(id) {
    const content = document.getElementById('dossierContent');
    const student = window.StudentStorage.findStudentById(id);

    if (!content || !student) {
      return;
    }

    content.innerHTML = '';

    const top = document.createElement('div');
    top.className = 'dossier-top';

    const titleBlock = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = student.fullName;
    const subtitle = document.createElement('p');
    subtitle.textContent = `Группа ${student.group}, комната ${student.room}`;
    titleBlock.append(title, subtitle);

    const status = document.createElement('span');
    status.className = student.isForeign ? 'status-pill foreign' : 'status-pill';
    status.textContent = student.isForeign ? 'Иностранный студент' : 'Российский студент';

    top.append(titleBlock, status);

    const grid = document.createElement('div');
    grid.className = 'dossier-grid';
    grid.append(
      createField('ИСУ ID', String(student.isuId)),
      createField('Номер общежития', String(student.dormNumber)),
      createField('Комната', student.room),
      createField('Срок заселения', formatDate(student.settlementDate)),
      createField('Дата создания', formatDate(student.createdAt?.slice(0, 10))),
      createField('Последнее изменение', formatDate(student.updatedAt?.slice(0, 10))),
      createField('Заметки', student.notes || 'Нет заметок', 'notes-block')
    );

    content.append(top, grid);
    window.AppNavigation.showDossier();
  }

  window.StudentDossier = {
    showStudentDossier
  };
})();
