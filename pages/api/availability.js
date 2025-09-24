const { BASE, BUSINESS_ID, COTTESLOE_BRANCH, SKIN_NEEDLING_SERVICE_COTT, getAuthHeaders } = require('./_phorest');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  const { startISO, endISO } = req.body;
  try {
    const url = `${BASE}/business/${BUSINESS_ID}/branch/${COTTESLOE_BRANCH}/appointments/availability`;
    const body = {
      startTime: startISO,
      endTime: endISO,
      clientSchedules: [
        {
          serviceSchedules: [
            {
              serviceId: SKIN_NEEDLING_SERVICE_COTT
            }
          ]
        }
      ]
    };
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
