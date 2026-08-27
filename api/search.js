export default async function handler(req, res) {
  // CORS настройки для связи с твоим фронтендом
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    let query = '';
    if (req.query && req.query.q) {
      query = req.query.q;
    }

    const searchTrigger = ' вертикальное видео шортс смотреть шорты короткое видео shorts';
    const fullQuery = (query ? query.trim() : '') + searchTrigger;

    // Ссылка на поиск Ютуба
    const targetUrl = `https://youtube.com{encodeURIComponent(fullQuery)}&sp=EgIQAw%253D%253D`;

    // ЖЕСТКИЙ ТАРАН: Заворачиваем запрос в официальный распределенный Google-шлюз для обхода блокировок
    const googleBypassUrl = `https://google.com{encodeURIComponent(targetUrl)}`;

    const response = await fetch(googleBypassUrl);
    if (!response.ok) {
      return res.status(200).json({ success: false, error: 'NODE_EMPTY' });
    }

    const html = await response.text();

    // Собираем ВСЕ возможные ID видео со страницы Ютуба в массив
    const foundIds = [];
    const regexShorts = /\/shorts\/([a-zA-Z0-9_-]{11})/g;
    let match;
    while ((match = regexShorts.exec(html)) !== null) {
      if (match[1] && !foundIds.includes(match[1])) {
        foundIds.push(match[1]);
      }
    }

    const regexVideoId = /"videoId"\s*:\s*"([a-zA-Z0-9_-]{11})"/g;
    while ((match = regexVideoId.exec(html)) !== null) {
      if (match[1] && !foundIds.includes(match[1])) {
        foundIds.push(match[1]);
      }
    }

    // Если нашли реальные ID, берем случайный из пула и выдаем фронтенду
    if (foundIds.length > 0) {
      const randomId = foundIds[Math.floor(Math.random() * foundIds.length)];
      return res.status(200).json({
        success: true,
        videoId: randomId
      });
    }

    return res.status(200).json({ success: false, error: 'NODE_EMPTY' });
  } catch (error) {
    console.error('Error in search backend:', error);
    return res.status(200).json({ success: false, error: 'NODE_EMPTY' });
  }
}
