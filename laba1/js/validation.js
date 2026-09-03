(function () {
  'use strict';

  const fieldIds = [
    'fullName',
    'group',
    'isuId',
    'dormNumber',
    'room',
    'settlementDate',
    'notes'
  ];

  function normalizeText(value) {
    return String(value || '').trim().replace(/\s+/g, ' ');
  }

  function todayIso() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.toISOString().slice(0, 10);
  }

  function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}Error`);

    if (input) {
      input.closest('.field')?.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
    }

    if (error) {
      error.textContent = message;
    }
  }

  function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}Error`);

    if (input) {
      input.closest('.field')?.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
    }

    if (error) {
      error.textContent = '';
    }
  }

  function clearAllErrors() {
    fieldIds.forEach(clearError);
  }

  function validateStudentFields(data) {
    clearAllErrors();
    let isValid = true;

    if (!/^[A-Za-zА-Яа-яЁё ]{5,80}$/.test(data.fullName)) {
      showError('fullName', 'ФИО должно содержать только буквы и пробелы.');
      isValid = false;
    }

    if (!/^[A-Za-zА-Яа-яЁё0-9 -]{2,20}$/.test(data.group)) {
      showError('group', 'Группа должна быть от 2 до 20 символов.');
      isValid = false;
    }

    if (!Number.isInteger(data.isuId) || !/^\d{6}$/.test(String(data.isuId))) {
      showError('isuId', 'ИСУ ID должен состоять ровно из 6 цифр.');
      isValid = false;
    }

    if (!Number.isInteger(data.dormNumber) || data.dormNumber < 1 || data.dormNumber > 20) {
      showError('dormNumber', 'Номер общежития должен быть от 1 до 20.');
      isValid = false;
    }

    if (!/^[0-9]{1,4}[A-Za-zА-Яа-я]?$/.test(data.room)) {
      showError('room', 'Комната: 1-4 цифры и необязательная буква.');
      isValid = false;
    }

    if (!data.settlementDate) {
      showError('settlementDate', 'Укажите дату заселения.');
      isValid = false;
    } else if (data.settlementDate < todayIso()) {
      showError('settlementDate', 'Дата заселения не должна быть в прошлом.');
      isValid = false;
    }

    if (data.notes.length > 300) {
      showError('notes', 'Заметки не должны превышать 300 символов.');
      isValid = false;
    }

    return isValid;
  }

  function bindErrorReset(form) {
    fieldIds.forEach((fieldId) => {
      const field = form.querySelector(`#${fieldId}`);

      if (field) {
        field.addEventListener('input', () => clearError(fieldId));
      }
    });
  }

  window.StudentValidation = {
    normalizeText,
    todayIso,
    validateStudentFields,
    bindErrorReset,
    clearAllErrors
  };
})();
