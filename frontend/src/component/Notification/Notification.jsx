const sendNotification = (title, options) => {

  options = {
    ...options,
    icon: 'favicon.ico',
    dir: 'auto'
  };

  if (!("Notification" in window)) {
    console.log('HTML Notifications не поддерживаются, необходимо обновить браузер.');
  }

  else if (Notification.permission === "granted") {
    const notification = new Notification(title, options);

    function clickFunc() {
      console.log('Пользователь кликнул на уведомление');
    }

    notification.onclick = clickFunc;
  }

  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        new Notification(title, options);
      } else {
        alert('Вы запретили показывать уведомления'); // Юзер отклонил наш запрос на показ уведомлений
      }
    });
  } else {
    // Пользователь ранее отклонил наш запрос на показ уведомлений
    // В этом месте мы можем, но не будем его беспокоить. Уважайте решения своих пользователей.
  }
};

export {sendNotification};