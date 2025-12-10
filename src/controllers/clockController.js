class ClockController {
  getCurrentTime(req, res) {
    const now = new Date();
    const time = {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      iso: now.toISOString(),
      unix: now.getTime(),
      formatted: now.toLocaleString('ru-RU')
    };
    res.json({ success: true, time });
  }

  getTimezoneTime(req, res) {
    const zone = req.query.zone || 'UTC';
    const now = new Date();
    
    let offset = 0;
    if (zone === 'MSK') offset = 0;
    if (zone === 'EST') offset = -8;
    if (zone === 'JST') offset = 6;
    
    const adjustedTime = new Date(now.getTime() + offset * 3600000);
    
    res.json({
      success: true,
      timezone: zone,
      serverTime: now.toISOString(),
      adjustedTime: adjustedTime.toISOString(),
      offsetHours: offset,
      message: `Время с учетом смещения ${offset} часов`
    });
  }

  getAnalogTime(req, res) {
    const now = new Date();
    const time = {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      milliseconds: now.getMilliseconds(),
      angle: {
        hour: (now.getHours() % 12) * 30 + now.getMinutes() * 0.5,
        minute: now.getMinutes() * 6,
        second: now.getSeconds() * 6
      }
    };
    
    res.json({
      success: true,
      time,
      analogFormat: `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`,
      description: 'Данные для отрисовки аналоговых часов'
    });
  }
}

module.exports = new ClockController();