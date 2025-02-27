document.addEventListener('DOMContentLoaded', function () {
  // تحديد العناصر
  const menuItems = document.querySelectorAll('.menu li');
  const pages = document.querySelectorAll('.page');
  const createTaskButton = document.getElementById('create-task-button');
  const taskCreationForm = document.getElementById('task-creation-form');
  const submitTaskButton = document.getElementById('submit-task');
  const languageToggle = document.getElementById('language-toggle');
  let currentLanguage = 'ar';
  const themeSwitch = document.getElementById('theme-switch');
  const body = document.body;
  const upcomingMeetings = document.getElementById('upcomingMeetings');
  const meetingDetails = document.getElementById('meetingDetails');
  const meetingAgenda = document.getElementById('meetingAgenda');
  const meetingParticipants = document.getElementById('meetingParticipants');
  const meetingLocation = document.getElementById('meetingLocation');
  const addToCalendarButton = document.getElementById('addToCalendar');
  const chatbotButton = document.getElementById('chatbot-button');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');
  const kanbanItems = document.querySelectorAll('.kanban-item');
  const kanbanColumns = document.querySelectorAll('.kanban-column');
  let draggedItem = null;

  // وظيفة إخفاء جميع الصفحات
  function hideAllPages() {
      pages.forEach(page => {
          page.style.display = 'none';
      });
  }

  // وظيفة عرض صفحة محددة
  function showPage(pageId) {
      hideAllPages();
      document.getElementById(pageId).style.display = 'block';
  }

  // وظيفة ترجمة النصوص
  function translateText(language) {
      const elements = document.querySelectorAll('[data-en][data-ar]');
      elements.forEach(element => {
          const englishText = element.getAttribute('data-en');
          const arabicText = element.getAttribute('data-ar');

          if (language === 'en') {
              element.textContent = englishText;
          } else {
              element.textContent = arabicText;
          }

          // التعامل مع placeholders
          if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
              const englishPlaceholder = element.getAttribute('data-en-placeholder');
              const arabicPlaceholder = element.getAttribute('data-ar-placeholder');
              if (englishPlaceholder && arabicPlaceholder) {
                  element.placeholder = language === 'en' ? englishPlaceholder : arabicPlaceholder;
              }
          }
      });
  }

  // وظيفة تبديل اللغة
  function toggleLanguage() {
      currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
      translateText(currentLanguage);

      // تحديث نص تبديل اللغة
      languageToggle.textContent = currentLanguage === 'ar' ? 'English' : 'Arabic';

      // تحديث سمة dir للعلامة html
      document.documentElement.setAttribute('dir', currentLanguage === 'ar' ? 'rtl' : 'ltr');

      // تحديث سمة lang للعلامة html
      document.documentElement.setAttribute('lang', currentLanguage);
  }

  // وظيفة تبديل الوضع الليلي/النهاري
  function toggleDarkMode() {
      body.classList.toggle('dark-mode');
      // تخزين تفضيل الوضع في local storage
      localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
  }

  // وظيفة إنشاء الرسوم البيانية
  function createChart(canvasId, chartType, data, options) {
      const ctx = document.getElementById(canvasId).getContext('2d');
      new Chart(ctx, {
          type: chartType,
          data: data,
          options: options
      });
  }

  // وظيفة تنسيق الوقت
  function formatTime(milliseconds) {
      const seconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      return `<span class="math-inline">\{pad\(hours\)\}\:</span>{pad(minutes % 60)}:${pad(seconds % 60)}`;
  }

  // وظيفة إضافة صفر قبل الرقم إذا كان أقل من 10
  function pad(number) {
      return number < 10 ? '0' + number : number;
  }

  // وظيفة حساب نسبة الإكمال
  function updateCompletionPercentage() {
      const totalTasks = document.querySelectorAll('.kanban-item').length;
      const completedTasks = document.querySelectorAll('.kanban-item[data-status="completed"]').length;
      const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
      document.getElementById('percentage').textContent = percentage + '%';
  }

  // وظيفة تحديث أنماط المهام
  function updateTaskStyles(taskItem) {
      const status = taskItem.dataset.status;
      taskItem.classList.remove('in-progress', 'completed');
      if (status === 'in-progress') {
          taskItem.classList.add('in-progress');
      } else if (status === 'completed') {
          taskItem.classList.add('completed');
      }
  }

  // إضافة مستمعي الأحداث لعناصر القائمة
  menuItems.forEach(item => {
      item.addEventListener('click', function () {
          const pageId = this.getAttribute('data-page');
          showPage(pageId);
      });
  });

  // عرض صفحة لوحة التحكم عند التحميل
  showPage('dashboard');

  // تبديل نموذج إنشاء المهام
  if (createTaskButton && taskCreationForm) {
      createTaskButton.addEventListener('click', function () {
          taskCreationForm.style.display = taskCreationForm.style.display === 'none' ? 'block' : 'none';
      });
  }

  // الترجمة الأولية
  translateText(currentLanguage);

  // مستمع حدث تبديل اللغة
  languageToggle.addEventListener('click', toggleLanguage);

  // التحقق من تفضيل الوضع الليلي في local storage
  if (localStorage.getItem('darkMode') === 'true') {
      body.classList.add('dark-mode');
      themeSwitch.checked = true;
  }

  // مستمع حدث تبديل الوضع الليلي/النهاري
  themeSwitch.addEventListener('change', toggleDarkMode);

  // بيانات الرسوم البيانية
  const teamData = {
      labels: ['سلمى', 'فاطمة', 'رانيا'],
      datasets: [{
          data: [70, 85, 60],
          backgroundColor: ['#36a2eb', '#ff6384', '#ffcd56']
      }]
  };

  const dashboardChartData = {
      labels: ['مكتملة', 'قيد التنفيذ', 'معلقة'],
      datasets: [{
          label: 'المهام',
          data: [30, 40, 30],
          backgroundColor: [
              'rgba(75, 192, 192, 0.8)',
              'rgba(255, 206, 86, 0.8)',
              'rgba(255, 99, 132, 0.8)'
          ],
          borderWidth: 1
      }]
  };

  const teamStatsData = {
      labels: ['متوسط وقت إكمال المهام', 'نسبة المهام المكتملة', 'معدل الحضور في الاجتماعات'],
      datasets: [{
          label: 'إحصائيات الفريق',
          data: [4, 85, 90],
          backgroundColor: ['#36a2eb', '#ff6384', '#ffcd56']
      }]
  };

  // إنشاء الرسوم البيانية
  createChart('teamPerformanceChart', 'pie', teamData, { responsive: true, maintainAspectRatio: false });
  if (document.getElementById('dashboardChart')) {
      createChart('dashboardChart', 'doughnut', dashboardChartData, { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } });
  }
  createChart('teamStatsChart', 'bar', teamStatsData, { responsive: true, scales: { y: { beginAtZero: true } } });

  // عرض نسبة الأداء في الجدول
  document.getElementById('team-a-percentage').textContent = teamData.datasets[0].data[0].data[0] + '%';
  document.getElementById('team-b-percentage').textContent = teamData.datasets[0].data[1] + '%';
  document.getElementById('team-c-percentage').textContent = teamData.datasets[0].data[2] + '%';

  // جدول المهام المنجزة
  const completedTasks = [
      { name: 'تصميم الواجهة', completedBy: 'فاطمة', completionDate: '2025-02-15' },
      { name: 'تطوير الوظيفة', completedBy: 'سلمى', completionDate: '2025-02-16' },
      { name: 'اختبار النظام', completedBy: 'رانيا', completionDate: '2025-02-17' }
  ];

  const completedTasksTableBody = document.getElementById('completedTasksTable').querySelector('tbody');
  completedTasks.forEach(task => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${task.name}</td>
          <td>${task.completedBy}</td>
          <td>${task.completionDate}</td>
      `;
      completedTasksTableBody.appendChild(row);
  });

  // مستمعي الأحداث لجدول المهام
  const taskTable = document.getElementById('taskTable');
  if (taskTable) {
      taskTable.addEventListener('click', function (event) {
          if (event.target.classList.contains('status-button')) {
              const button = event.target;
              const row = button.closest('tr');
              const statusCell = row.querySelector('.status');
              const newStatus = button.getAttribute('data-status');

              statusCell.textContent = newStatus;
              statusCell.className = `status ${newStatus.toLowerCase().replace(' ', '-')}`;

              if (newStatus === 'Completed') {
                  button.textContent = button.getAttribute('data-en-reopen');
                  button.setAttribute('data-status', 'In Progress');
              } else if (newStatus === 'In Progress') {
                  button.textContent = button.getAttribute('data-en-complete');
                  button.setAttribute('data-status', 'Completed');
              }
          } else if (event.target.classList.contains('delete-button')) {
              const row = event.target.closest('tr');
              row.remove();
          }
      });
  }

 // إنشاء الاجتماعات
const createMeetingForm = document.getElementById('createMeetingForm');
const meetingsTableBody = document.getElementById('meetingsTable').querySelector('tbody');

createMeetingForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('meetingTitle').value;
    const dateTime = document.getElementById('meetingDateTime').value;
    const agenda = document.getElementById('meetingAgenda').value;
    const participants = document.getElementById('meetingParticipants').value;
    const location = document.getElementById('meetingLocation').value;

    const meeting = { title, dateTime, agenda, participants, location };

    // إضافة الاجتماع إلى الجدول
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${meeting.title}</td>
        <td>${meeting.dateTime}</td>
        <td>${meeting.agenda}</td>
        <td>${meeting.participants}</td>
        <td>${meeting.location}</td>
    `;
    meetingsTableBody.appendChild(row);

    // إعادة تعيين النموذج
    createMeetingForm.reset();
});


  if (addToCalendarButton) {
      addToCalendarButton.addEventListener('click', function () {
          alert('تمت إضافة الاجتماع إلى التقويم!');
      });
  }

  // روبوت المحادثة
  if (chatbotButton && chatbotWindow && chatbotMessages && chatbotInput && chatbotSend) {
      chatbotButton.addEventListener('click', function () {
          chatbotWindow.style.display = 'block';
      });

      chatbotSend.addEventListener('click', function () {
          const message = chatbotInput.value;
          chatbotMessages.innerHTML += `<p>أنت: ${message}</p>`;
          chatbotInput.value = '';
          chatbotMessages.innerHTML += `<p>الروبوت: سأجيب قريبا</p>`;
      });

      document.addEventListener('click', function (event) {
          if (chatbotWindow.style.display === 'block' && !chatbotContainer.contains(event.target)) {
              chatbotWindow.style.display = 'none';
          }
      });
  }

  // نموذج إنشاء المهام
  if (submitTaskButton) {
      submitTaskButton.addEventListener('click', function () {
          const taskName = document.getElementById('task-name').value;
          const taskDescription = document.getElementById('task-description').value;
          const taskAssignee = document.getElementById('task-assignee').value;
          const taskDueDate = document.getElementById('task-due-date').value;
          const taskPriority = document.getElementById('task-priority').value;
          const taskAttachments = document.getElementById('task-attachments').files;

          console.log('Task Name:', taskName);
          console.log('Task Description:', taskDescription);
          console.log('Assignee:', taskAssignee);
          console.log('Due Date:', taskDueDate);
          console.log('Priority:', taskPriority);
          console.log('Attachments:', taskAttachments);

          taskCreationForm.style.display = 'none';
      });
  }

  // لوحة كانبان
  kanbanItems.forEach(item => {
      item.addEventListener('dragstart', function () {
          draggedItem = this;
          setTimeout(() => {
              this.style.display = 'none';
          }, 0);
      });

      item.addEventListener('dragend', function () {
          setTimeout(() => {
              this.style.display = 'block';
              draggedItem = null;
          }, 0);
      });
  });

  kanbanColumns.forEach(column => {
      column.addEventListener('dragover', function (e) {
          e.preventDefault();
      });

      column.addEventListener('dragenter', function (e) {
          e.preventDefault();
          this.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
      });

      column.addEventListener('dragleave', function () {
          this.style.backgroundColor = 'transparent';
      });

      column.addEventListener('drop', function (e) {
          this.style.backgroundColor = 'transparent';
          this.querySelector('.kanban-list').appendChild(draggedItem);
          draggedItem.dataset.status = this.dataset.status;
          updateTaskStyles(draggedItem);
          updateCompletionPercentage();
      });
  });

  const startTimers = document.querySelectorAll('.start-timer');
  startTimers.forEach(button => {
      let startTime, timerInterval;
      const elapsedTimeDisplay = button.parentElement.querySelector('.elapsed-time');

      button.addEventListener('click', function () {
          if (button.textContent === 'بدء المؤقت' || button.textContent === 'Start Timer') {
              startTime = Date.now();
              timerInterval = setInterval(() => {
                  const elapsedTime = Date.now() - startTime;
                  elapsedTimeDisplay.textContent = formatTime(elapsedTime);
              }, 1000);
              button.textContent = 'إيقاف المؤقت';
          } else {
              clearInterval(timerInterval);
              button.textContent = 'بدء المؤقت';
          }
      });
  });

  updateCompletionPercentage();
});

// Create the dashboard chart
if (document.getElementById('dashboardChart1')) {
  createChart('dashboardChart1', 'doughnut', dashboardChartData, dashboardChartOptions);
}

// ... (بقية الكود) ...

function updateTaskStyles(taskItem) {
  const status = taskItem.dataset.status;
  const assignee = taskItem.dataset.assignee;
  const startDate = taskItem.dataset.startDate;
  const endDate = taskItem.dataset.endDate;
  const completion = taskItem.dataset.completion;

  taskItem.classList.remove('in-progress', 'completed');
  if (status === 'in-progress') {
      taskItem.classList.add('in-progress');
  } else if (status === 'completed') {
      taskItem.classList.add('completed');
  }

  const assigneeSpan = taskItem.querySelector('.assignee');
  if (!assigneeSpan) {
      const newAssigneeSpan = document.createElement('span');
      newAssigneeSpan.classList.add('assignee');
      newAssigneeSpan.textContent = ` (${assignee})`;
      taskItem.querySelector('span').after(newAssigneeSpan);
  } else {
      assigneeSpan.textContent = ` (${assignee})`;
  }

  const startDateSpan = taskItem.querySelector('.start-date');
  if (!startDateSpan) {
      const newStartDateSpan = document.createElement('span');
      newStartDateSpan.classList.add('start-date');
      newStartDateSpan.textContent = `البداية: ${startDate}`;
      taskItem.querySelector('.assignee').after(newStartDateSpan);
  } else {
      startDateSpan.textContent = `البداية: ${startDate}`;
  }

  const endDateSpan = taskItem.querySelector('.end-date');
  if (!endDateSpan) {
      const newEndDateSpan = document.createElement('span');
      newEndDateSpan.classList.add('end-date');
      newEndDateSpan.textContent = `النهاية: ${endDate}`;
      taskItem.querySelector('.start-date').after(newEndDateSpan);
  } else {
      endDateSpan.textContent = `النهاية: ${endDate}`;
  }

  const completionSpan = taskItem.querySelector('.completion');
  if (!completionSpan) {
      const newCompletionSpan = document.createElement('span');
      newCompletionSpan.classList.add('completion');
      newCompletionSpan.textContent = `الإنجاز: ${completion}%`;
      taskItem.querySelector('.end-date').after(newCompletionSpan);
  } else {
      completionSpan.textContent = `الإنجاز: ${completion}%`;
  }
}

 const dashboardChartData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [{
      label: 'Tasks',
      data: [30, 40, 30],
      backgroundColor: [
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(255, 99, 132, 0.8)'
      ],
      borderWidth: 1
    }]
  };

  // Example options for the dashboard chart
  const dashboardChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  // Function to create a chart
  function createChart(chartId, chartType, data, options) {
    const ctx = document.getElementById(dashboardChart1).getContext('2d');
    return new Chart(ctx, {
      type: chartType,
      data: data,
      options: options
    });
  }

  // Create the dashboard chart if the element exists
  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('dashboardChart1')) {
      createChart('dashboardChart1', 'doughnut', dashboardChartData, dashboardChartOptions);
    }
  });

