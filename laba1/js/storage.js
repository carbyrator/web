(function () {
  'use strict';

  const STORAGE_KEY = 'dormitoryStudents.v1';

  const seedStudents = [
    {
      id: 's-1001',
      fullName: 'Иванов Андрей',
      group: 'M3301',
      isuId: 342781,
      dormNumber: 8,
      room: '412',
      settlementDate: getFutureDate(35),
      isForeign: false,
      notes: 'Староста этажа.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 's-1002',
      fullName: 'Смирнова Анна',
      group: 'P3215',
      isuId: 518294,
      dormNumber: 3,
      room: '218A',
      settlementDate: getFutureDate(58),
      isForeign: false,
      notes: 'Нужна нижняя полка.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 's-1003',
      fullName: 'Петрова Мария',
      group: 'K3140',
      isuId: 764032,
      dormNumber: 12,
      room: '509',
      settlementDate: getFutureDate(21),
      isForeign: true,
      notes: 'Документы проверены.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  function getFutureDate(offsetDays) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().slice(0, 10);
  }

  function readStudents() {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      writeStudents(seedStudents);
      return [...seedStudents];
    }

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Не удалось прочитать localStorage', error);
      return [];
    }
  }

  function writeStudents(students) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }

    return `student-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  function getAllStudents() {
    return readStudents().sort((a, b) => a.fullName.localeCompare(b.fullName, 'ru'));
  }

  function addStudent(studentData) {
    const students = readStudents();
    const now = new Date().toISOString();
    const student = {
      ...studentData,
      id: createId(),
      createdAt: now,
      updatedAt: now
    };

    students.push(student);
    writeStudents(students);
    return student;
  }

  function findStudentById(id) {
    return readStudents().find((student) => student.id === id) || null;
  }

  function updateStudent(id, studentData) {
    const students = readStudents();
    const index = students.findIndex((student) => student.id === id);

    if (index === -1) {
      return null;
    }

    students[index] = {
      ...students[index],
      ...studentData,
      id,
      updatedAt: new Date().toISOString()
    };

    writeStudents(students);
    return students[index];
  }

  function deleteStudent(id) {
    const students = readStudents();
    const nextStudents = students.filter((student) => student.id !== id);
    writeStudents(nextStudents);
    return nextStudents.length !== students.length;
  }

  window.StudentStorage = {
    getAllStudents,
    saveStudents: writeStudents,
    addStudent,
    findStudentById,
    updateStudent,
    deleteStudent
  };
})();
