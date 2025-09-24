const { BASE, BUSINESS_ID, COTTESLOE_BRANCH, getAuthHeaders } = require('./_phorest');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { clientId, courseId, priceGross, externalTxnRef } = req.body;
  if (!clientId || !courseId || !priceGross) {
    return res.status(400).json({ message: 'clientId, courseId and priceGross are required' });
  }

  try {
    const url = `${BASE}/business/${BUSINESS_ID}/branch/${COTTESLOE_BRANCH}/purchase`;
    const body = {
      clientId,
      items: [
        {
          type: 'COURSE',
          courseId,
          price: priceGross,
          quantity: 1
        }
      ],
      payments: [
        {
          amount: priceGross,
          externalReference: externalTxnRef || undefined
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
