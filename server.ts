import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Search proxy endpoint for YouTube scraping & regex ID extraction
  app.get('/api/search', async (req, res) => {
    try {
      const query = (req.query.q as string) || '';
      if (!query.trim()) {
        return res.status(400).json({ error: 'Query parameter q is required' });
      }

      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' shorts')}`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      });

      const html = await response.text();

      // Regular expression identifier capture targeting /watch?v= and "videoId":
      const idMatches = new Set<string>();
      
      // Match /watch?v=XXXXXXXXXXX
      const watchMatches = html.matchAll(/\/watch\?v=([a-zA-Z0-9_-]{11})/g);
      for (const m of watchMatches) {
        if (m[1]) idMatches.add(m[1]);
      }

      // Match "videoId":"XXXXXXXXXXX" in ytInitialData JSON stream
      const jsonMatches = html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g);
      for (const m of jsonMatches) {
        if (m[1]) idMatches.add(m[1]);
      }

      const ids = Array.from(idMatches);

      if (ids.length > 0) {
        // Pick a pseudo-random index off the discovered items array (e.g. 5th or 10th index element, or pseudo-random)
        let chosenIndex = 0;
        if (ids.length > 10) {
          chosenIndex = 9; // 10th element (0-indexed)
        } else if (ids.length > 5) {
          chosenIndex = 4; // 5th element
        } else {
          chosenIndex = Math.floor(Math.random() * ids.length);
        }
        
        const videoId = ids[chosenIndex];
        return res.json({
          success: true,
          videoId,
          allFound: ids.length,
          chosenIndex,
          fullUrl: `https://www.youtube.com/watch?v=${videoId}`,
          embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&allowfullscreen=true`
        });
      }

      return res.json({
        success: false,
        error: 'No video IDs found in stream'
      });
    } catch (err: any) {
      console.error('Search error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
