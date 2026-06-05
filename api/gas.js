export default async function handler(req, res) {
  // Разрешаем запросы с твоего фронтенда
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbwqfamhH1XP68mClpfB-ZOOc1hfj8YKqKWwSQKwmsArano6-1_cfJsmeIl3CM6KqDvo3g/exec';

  try {
    const { fn, args } = req.body;

    // Отправляем в GAS как form-encoded (без CORS проблем сервер-сервер)
    const params = new URLSearchParams();
    params.append('fn', fn);
    params.append('args', JSON.stringify(args || []));

    const gasResponse = await fetch(GAS_URL, {
      method: 'POST',
      body: params,
      // Следуем редиректам — GAS часто редиректит
      redirect: 'follow',
    });

    const text = await gasResponse.text();
    
    // Пробуем распарсить как JSON
    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch {
      // Если GAS вернул не JSON — возвращаем как есть для отладки
      return res.status(200).send(text);
    }

  } catch (err) {
    console.error('GAS proxy error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
