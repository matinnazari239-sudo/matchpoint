exports.handler = async (event) => {
  const API_KEY = process.env.FOOTBALL_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "کلید API در Netlify تنظیم نشده است." })
    };
  }

  const competition = event.queryStringParameters?.competition || "PL";

  const allowed = ["PL", "PD", "SA", "FL1", "BL1"];

  if (!allowed.includes(competition)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "لیگ معتبر نیست." })
    };
  }

  try {
    const type = event.queryStringParameters?.type || "matches";

let endpoint = "matches";

if (type === "standings") {
  endpoint = "standings";
} else if (type === "scorers") {
  endpoint = "scorers";
}

const response = await fetch(
  `https://api.football-data.org/v4/competitions/${competition}/${endpoint}`,
  { headers: { "X-Auth-Token": API_KEY } }
);

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300"
      },
      body: JSON.stringify(data)
    };
  } catch {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "دریافت اطلاعات فوتبال ناموفق بود." })
    };
  }
};