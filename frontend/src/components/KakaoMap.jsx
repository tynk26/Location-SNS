import { useEffect, useRef, useState } from "react";

function KakaoMap({ users, currentUser }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const overlaysRef = useRef([]); // user markers
  const routePolylineRef = useRef(null); // route polyline

  const [isMapReady, setIsMapReady] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [routeInfo, setRouteInfo] = useState(null);
  const [isRouting, setIsRouting] = useState(false);

  // -----------------------------
  // Init map ONCE
  // -----------------------------
  useEffect(() => {
    if (!window.kakao) return;

    window.kakao.maps.load(() => {
      const center = new window.kakao.maps.LatLng(37.5662952, 126.9779451);

      const map = new window.kakao.maps.Map(mapRef.current, {
        center,
        level: 4,
      });

      mapInstance.current = map;
      setIsMapReady(true);
    });
  }, []);

  // -----------------------------
  // Helpers
  // -----------------------------
  const clearOverlays = () => {
    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];
  };

  const clearRoute = () => {
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
      routePolylineRef.current = null;
    }
    setRouteInfo(null);
  };

  const buildPathFromRoute = (route0) => {
    const sections = route0?.sections;
    if (!Array.isArray(sections) || sections.length === 0) return [];

    const path = [];

    for (const section of sections) {
      const roads = section?.roads;
      if (!Array.isArray(roads)) continue;

      for (const road of roads) {
        const v = road?.vertexes;
        if (!Array.isArray(v) || v.length < 2) continue;

        // vertexes: [lng1, lat1, lng2, lat2, ...]
        for (let i = 0; i < v.length - 1; i += 2) {
          const lng = v[i];
          const lat = v[i + 1];
          if (typeof lng !== "number" || typeof lat !== "number") continue;
          path.push(new window.kakao.maps.LatLng(lat, lng));
        }
      }
    }

    return path;
  };

  const fitBoundsFromSummary = (summary) => {
    const map = mapInstance.current;
    if (!map || !summary?.bound) return;

    const b = summary.bound;
    const bounds = new window.kakao.maps.LatLngBounds(
      new window.kakao.maps.LatLng(b.min_y, b.min_x),
      new window.kakao.maps.LatLng(b.max_y, b.max_x),
    );
    map.setBounds(bounds);
  };

  // -----------------------------
  // Render markers when users change
  // -----------------------------
  useEffect(() => {
    if (!isMapReady || !mapInstance.current) return;
    if (!users || users.length === 0) return;

    const map = mapInstance.current;

    clearOverlays();

    users.forEach((user) => {
      if (user.lat == null || user.lng == null) return;

      const position = new window.kakao.maps.LatLng(
        parseFloat(user.lat),
        parseFloat(user.lng),
      );

      // clickable red box overlay with avatar + name
      const content = document.createElement("div");
      content.style.background = "#ff385c";
      content.style.color = "white";
      content.style.padding = "10px";
      content.style.borderRadius = "12px";
      content.style.textAlign = "center";
      content.style.width = "190px";
      content.style.boxShadow = "0 3px 10px rgba(0,0,0,0.3)";
      content.style.cursor = "pointer";

      content.innerHTML = `
        <img src="${user.avatar}"
          style="width:55px;height:55px;border-radius:50%;margin-bottom:6px;border:2px solid white;object-fit:cover;" />
        <div style="font-weight:bold;margin-bottom:4px;">
          ${user.username}
        </div>
        <div style="font-size:12px;opacity:0.95;">
          ${user.profile ?? ""}
        </div>
      `;

      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content,
        yAnchor: 1.3,
      });

      overlay.setMap(map);
      overlaysRef.current.push(overlay);

      content.onclick = () => {
        setSelectedUser(user);
        clearRoute();
      };
    });

    return () => clearOverlays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, isMapReady]);

  // -----------------------------
  // Fetch + render fastest route
  // -----------------------------
  const fetchFastestRoute = async () => {
    if (!selectedUser) return;
    if (!currentUser) {
      alert("로그인 먼저 하세요 (출발지 위치가 필요합니다).");
      return;
    }

    setIsRouting(true);
    clearRoute();

    try {
      const url = `http://localhost:5000/api/kakao/directions?originLng=${currentUser.lng}&originLat=${currentUser.lat}&destLng=${selectedUser.lng}&destLat=${selectedUser.lat}`;

      const res = await fetch(url);
      const data = await res.json();

      // Always log raw response so you can verify quickly
      console.log("[KAKAO DIRECTIONS RAW]", data);

      // If proxy wrapped an error
      if (!res.ok || data?.error) {
        alert(
          `길찾기 실패: ${data?.kakao?.msg || data?.kakao?.message || data?.error || "unknown"}`,
        );
        return;
      }

      const route0 = Array.isArray(data?.routes) ? data.routes[0] : null;
      const summary = route0?.summary || null;

      if (!route0 || !summary) {
        // Show keys to help debugging without crashing
        const keys = data ? Object.keys(data) : [];
        alert(
          `길찾기 응답에 routes/summary가 없습니다. 콘솔 확인. topKeys=${keys.join(",")}`,
        );
        return;
      }

      // Show route summary in popup
      setRouteInfo({
        distance: summary.distance, // meters
        duration: summary.duration, // seconds
        taxiFare: summary.fare?.taxi ?? null,
        tollFare: summary.fare?.toll ?? null,
      });

      // Fit map bounds even if we can't draw polyline
      fitBoundsFromSummary(summary);

      // Build polyline path (may be empty in some cases)
      const path = buildPathFromRoute(route0);

      if (path.length > 0) {
        const map = mapInstance.current;

        const polyline = new window.kakao.maps.Polyline({
          path,
          strokeWeight: 6,
          strokeColor: "#1E88E5",
          strokeOpacity: 0.9,
          strokeStyle: "solid",
        });

        polyline.setMap(map);
        routePolylineRef.current = polyline;
      } else {
        // Not fatal: still show summary + bounds
        console.warn(
          "[KAKAO] No polyline vertexes found; showing summary only.",
        );
      }
    } catch (e) {
      console.error(e);
      alert("길찾기 호출 중 오류가 발생했습니다.");
    } finally {
      setIsRouting(false);
    }
  };

  return (
    <>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* Popup modal */}
      {selectedUser && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "24px",
            borderRadius: "16px",
            width: "360px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            zIndex: 9999,
          }}
        >
          {/* Close */}
          <div
            style={{
              textAlign: "right",
              cursor: "pointer",
              fontWeight: "bold",
              marginBottom: 10,
            }}
            onClick={() => {
              setSelectedUser(null);
              clearRoute();
            }}
          >
            ✕
          </div>

          {/* Profile */}
          <div style={{ textAlign: "center" }}>
            <img
              src={selectedUser.avatar}
              alt="avatar"
              style={{
                width: 84,
                height: 84,
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: 10,
              }}
            />
            <h3 style={{ margin: "0 0 6px 0", color: "#000" }}>
              {selectedUser.username}
            </h3>
            <div style={{ fontSize: 14, color: "#555", marginBottom: 8 }}>
              {selectedUser.profile}
            </div>
            <div style={{ fontSize: 13, color: "#777" }}>
              📍 {selectedUser.location}
            </div>
          </div>

          {/* Route button */}
          <button
            onClick={fetchFastestRoute}
            disabled={isRouting}
            style={{
              marginTop: 14,
              width: "100%",
              padding: 10,
              borderRadius: 12,
              border: "none",
              background: "#ff385c",
              color: "#000",
              fontWeight: "bold",
              cursor: "pointer",
              opacity: isRouting ? 0.7 : 1,
            }}
          >
            {isRouting ? "경로 계산 중..." : "🚗 최적 경로 보기 (빠른 길찾기)"}
          </button>

          {/* Route summary */}
          {routeInfo && (
            <div
              style={{
                marginTop: 14,
                fontSize: 14,
                lineHeight: 1.6,
                color: "#000", // ✅ force black text
              }}
            >
              <div>🕒 소요 시간: {Math.round(routeInfo.duration / 60)}분</div>
              <div>📏 거리: {(routeInfo.distance / 1000).toFixed(2)} km</div>

              {routeInfo.taxiFare != null && (
                <div>
                  🚕 예상 택시비: {routeInfo.taxiFare.toLocaleString()}원
                </div>
              )}

              {routeInfo.tollFare != null && (
                <div>🧾 통행료: {routeInfo.tollFare.toLocaleString()}원</div>
              )}

              <div
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: "#000", // also black
                }}
              >
                * polyline(경로 선)이 없으면 요약/바운드만 표시됩니다. 콘솔의
                RAW 응답을 확인하세요.
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default KakaoMap;
