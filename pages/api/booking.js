const { BASE, BUSINESS_ID, COTTESLOE_BRANCH, SKIN_NEEDLING_SERVICE_COTT, getAuthHeaders } = require('./_phorest');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { clientId, startTime, endTime, staffId, note, clientCourseItemId } = req.body;
  if (!clientId || !startTime || !endTime) {
    return res.status(400).json({ message: 'clientId, startTime and endTime are required' });
  }

  try {
    const url = `${BASE}/business/${BUSINESS_ID}/branch/${COTTESLOE_BRANCH}/booking`;
    const body = {
      bookingStatus: 'ACTIVE',
      clientId,
      note: note || '',
      clientAppointmentSchedules: [
        {
          clientId,
          serviceSchedules: [
            {
              serviceId: SKIN_NEEDLING_SERVICE_COTT,
              startTime,
              endTime,
              staffId: staffId || undefined,
              clientCourseItemId: clientCourseItemId || undefined
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
    return res.status(response.status).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
