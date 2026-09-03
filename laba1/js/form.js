(function () {
  'use strict';

  let form;

  function getFormData() {
    return {
      fullName: window.StudentValidation.normalizeText(form.fullName.value),
      group: window.StudentValidation.normalizeText(form.group.value),
      isuId: Number(form.isuId.value),
      dormNumber: Number(form.dormNumber.value),
      room: window.StudentValidation.normalizeText(form.room.value).toUpperCase(),
      settlementDate: form.settlementDate.value,
      isForeign: form.isForeign.checked,
      notes: window.StudentValidation.normalizeText(form.notes.value)
    };
  }

  function setFormMode(mode) {
    const isEdit = mode === 'edit';
    document.getElementById('formTitle').textContent = isEdit ? 'Редактировать студента' : 'Добавить студента';
    document.getElementById('formModeLabel').textContent = isEdit
      ? 'Изменение существующей записи'
      : 'Новая запись в журнале общежития';
  }

  function resetForm() {
    form.reset();
    form.studentId.value = '';
    window.StudentValidation.clearAllErrors();
    setFormMode('add');
  }

  function openAddForm() {
    resetForm();
    window.AppNavigation.showForm();
    form.fullName.focus();
  }

  function openEditForm(id) {
    const student = window.StudentStorage.findStudentById(id);

    if (!student) {
      return;
    }

    form.studentId.value = student.id;
    form.fullName.value = student.fullName;
    form.group.value = student.group;
    form.isuId.value = student.isuId;
    form.dormNumber.value = student.dormNumber;
    form.room.value = student.room;
    form.settlementDate.value = student.settlementDate;
    form.isForeign.checked = student.isForeign;
    form.notes.value = student.notes || '';
    window.StudentValidation.clearAllErrors();
    setFormMode('edit');
    window.AppNavigation.showForm();
    form.fullName.focus();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const data = getFormData();
    console.log('Данные студента:', data);

    if (!form.checkValidity() || !window.StudentValidation.validateStudentFields(data)) {
      form.reportValidity();
      return;
    }

    if (form.studentId.value) {
      window.StudentStorage.updateStudent(form.studentId.value, data);
    } else {
      window.StudentStorage.addStudent(data);
    }

    resetForm();
    window.StudentTable.renderStudentsTable();
    window.AppNavigation.showList();
  }

  function initStudentForm() {
    form = document.getElementById('studentForm');

    if (!form) {
      return;
    }

    form.settlementDate.min = window.StudentValidation.todayIso();
    window.StudentValidation.bindErrorReset(form);
    form.addEventListener('submit', handleSubmit);
    document.getElementById('cancelFormButton')?.addEventListener('click', () => {
      resetForm();
      window.AppNavigation.showList();
    });
  }

  window.StudentForm = {
    initStudentForm,
    openAddForm,
    openEditForm
  };
})();
