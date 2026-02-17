const axios = require("axios");

async function kakaoDirections(req, res) {
  try {
    const {
      originLng,
      originLat,
      destLng,
      destLat,
      priority = "RECOMMEND",
    } = req.query;

    if (!originLng || !originLat || !destLng || !destLat) {
      return res.status(400).json({
        error:
          "Missing query params: originLng, originLat, destLng, destLat (and optional priority)",
      });
    }

    const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
    if (!KAKAO_REST_API_KEY) {
      return res.status(500).json({
        error: "KAKAO_REST_API_KEY is not set (check your .env)",
      });
    }

    const url = "https://apis-navi.kakaomobility.com/v1/directions";

    const kakaoRes = await axios.get(url, {
      params: {
        origin: `${originLng},${originLat}`,
        destination: `${destLng},${destLat}`,
        priority,
      },
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
      timeout: 10000,
    });

    return res.json(kakaoRes.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const kakaoBody = err.response?.data || { message: err.message };

    console.error("[KAKAO] directions failed:", status, kakaoBody);

    return res.status(status).json({
      error: "Kakao directions request failed",
      status,
      kakao: kakaoBody,
    });
  }
}

module.exports = { kakaoDirections };
