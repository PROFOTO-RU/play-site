export default async function handler(req, res) {
  // Set CORS headers for seamless frontend interaction
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Extract incoming query parameter 'q'
    let query = '';
    if (req.query && req.query.q) {
      query = req.query.q;
    } else if (req.url) {
      try {
        const urlObj = new URL(req.url, 'http://localhost');
        query = urlObj.searchParams.get('q') || '';
      } catch {
        query = '';
      }
    }

    // Append the exact human search trigger
    const searchTrigger = ' вертикальное видео шортс смотреть шорты короткое видео shorts';
    const fullQuery = (query ? query.trim() : '') + searchTrigger;

    // Construct YouTube short format search target URL
    const targetUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(fullQuery)}&sp=EgIQAw%253D%253D`;

    // Fetch with modern Chrome Windows Desktop headers
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    if (!response.ok) {
      return res.status(200).json({ success: false, error: 'NODE_EMPTY' });
    }

    const html = await response.text();

    // Deep global regex scan for unique 11-character video ID tokens
    // Signature 1: /shorts/([a-zA-Z0-9_-]{11})
    // Signature 2: "videoId"\s*:\s*"([a-zA-Z0-9_-]{11})"
    let videoId = null;

    const shortsMatch = html.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch && shortsMatch[1]) {
      videoId = shortsMatch[1];
    } else {
      const videoIdMatch = html.match(/"videoId"\s*:\s*"([a-zA-Z0-9_-]{11})"/);
      if (videoIdMatch && videoIdMatch[1]) {
        videoId = videoIdMatch[1];
      }
    }

    if (videoId && videoId.length === 11) {
      return res.status(200).json({
        success: true,
        videoId: videoId
      });
    }

    return res.status(200).json({
      success: false,
      error: 'NODE_EMPTY'
    });
  } catch (error) {
    console.error('Error in /api/search:', error);
    return res.status(200).json({
      success: false,
      error: 'NODE_EMPTY'
    });
  }
}
