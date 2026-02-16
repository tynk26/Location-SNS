import { useEffect, useRef } from "react";

function KakaoMap({ users }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.kakao || !users) return;

    window.kakao.maps.load(() => {
      const container = mapRef.current;

      // 🔴 항상 서울시청 중심
      const center = new window.kakao.maps.LatLng(37.5662952, 126.9779451);

      const map = new window.kakao.maps.Map(container, {
        center,
        level: 4,
      });

      users.forEach((user) => {
        const position = new window.kakao.maps.LatLng(user.lat, user.lng);

        const content = `
          <div style="
            background:#ff385c;
            color:white;
            padding:8px;
            border-radius:12px;
            text-align:center;
            font-size:13px;
            width:170px;
            box-shadow:0 3px 10px rgba(0,0,0,0.3);
          ">
            <img src="${user.avatar}" 
              style="
                width:55px;
                height:55px;
                border-radius:50%;
                object-fit:cover;
                margin-bottom:6px;
                border:2px solid white;
              "
            />
            <div style="font-weight:bold;">
              ${user.username}
            </div>
            <div style="font-size:11px;margin-top:3px;">
              ${user.profile}
            </div>
          </div>
        `;

        const overlay = new window.kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 1.3,
        });

        overlay.setMap(map);
      });
    });
  }, [users]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}

export default KakaoMap;
