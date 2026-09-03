(function () {
  'use strict';

  function formatDate(value) {
    if (!value) {
      return 'Не указано';
    }

    return new Intl.DateTimeFormat('ru-RU').format(new Date(`${value}T00:00:00`));
  }

  function getSearchValue() {
    return document.getElementById('studentSearch')?.value.trim().toLowerCase() || '';
  }

  function matchesSearch(student, query) {
    if (!query) {
      return true;
    }

    return [
      student.fullName,
      student.group,
      student.isuId,
      student.dormNumber,
      student.room,
      student.settlementDate,
      student.isForeign ? 'иностранный' : 'российский',
      student.notes
    ]
      .join(' ')
      .toLowerCase()
      .includes(query);
  }

  function createActionButton(action, id, label, symbol, extraClass = '') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `icon-button ${extraClass}`.trim();
    button.dataset.action = action;
    button.dataset.id = id;
    button.title = label;
    button.setAttribute('aria-label', label);
    button.textContent = symbol;
    return button;
  }

  function renderStudentsTable() {
    const tbody = document.getElementById('studentsTableBody');
    const count = document.getElementById('studentsCount');
    const empty = document.getElementById('emptyState');

    if (!tbody || !count || !empty) {
      return;
    }

    const students = window.StudentStorage.getAllStudents();
    const query = getSearchValue();
    const visibleStudents = students.filter((student) => matchesSearch(student, query));

    tbody.innerHTML = '';
    count.textContent = `${visibleStudents.length} из ${students.length} записей`;
    empty.hidden = visibleStudents.length > 0;

    visibleStudents.forEach((student) => {
      const row = document.createElement('tr');

      const nameCell = document.createElement('td');
      nameCell.dataset.label = 'ФИО';
      nameCell.innerHTML = `<span class="student-name"></span>`;
      nameCell.querySelector('.student-name').textContent = student.fullName;
      row.append(nameCell);

      const cells = [
        ['Группа', student.group],
        ['ИСУ ID', student.isuId],
        ['Общежитие', student.dormNumber],
        ['Комната', student.room],
        ['Заселение до', formatDate(student.settlementDate)]
      ];

      cells.forEach(([label, value]) => {
        const cell = document.createElement('td');
        cell.dataset.label = label;
        cell.textContent = value;
        row.append(cell);
      });

      const statusCell = document.createElement('td');
      statusCell.dataset.label = 'Статус';
      const status = document.createElement('span');
      status.className = student.isForeign ? 'status-pill foreign' : 'status-pill';
      status.textContent = student.isForeign ? 'Иностранный' : 'Российский';
      statusCell.append(status);
      row.append(statusCell);

      const actionsCell = document.createElement('td');
      actionsCell.dataset.label = 'Действия';
      const actions = document.createElement('div');
      actions.className = 'row-actions';
      actions.append(
        createActionButton('details', student.id, 'Подробнее', 'i'),
        createActionButton('edit', student.id, 'Редактировать', '✎'),
        createActionButton('delete', student.id, 'Удалить', '×', 'danger')
      );
      actionsCell.append(actions);
      row.append(actionsCell);

      tbody.append(row);
    });
  }

  function handleTableClick(event) {
    const button = event.target.closest('[data-action]');

    if (!button) {
      return;
    }

    const { action, id } = button.dataset;

    if (action === 'details') {
      window.StudentDossier.showStudentDossier(id);
    }

    if (action === 'edit') {
      window.StudentForm.openEditForm(id);
    }

    if (action === 'delete') {
      const student = window.StudentStorage.findStudentById(id);
      const name = student ? student.fullName : 'эту запись';

      if (window.confirm(`Удалить ${name}?`)) {
        window.StudentStorage.deleteStudent(id);
        renderStudentsTable();
      }
    }
  }

  window.StudentTable = {
    renderStudentsTable,
    handleTableClick
  };
})();
