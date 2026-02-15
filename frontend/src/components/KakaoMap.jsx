import { useEffect, useRef } from "react";
import axios from "axios";

function KakaoMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.kakao) return;

    window.kakao.maps.load(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          console.log("[MAP] 내 위치:", latitude, longitude);

          const container = mapRef.current;

          const options = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: 3,
          };

          const map = new window.kakao.maps.Map(container, options);

          /*
            🔵 내 위치 마커
          */
          const myMarker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(latitude, longitude),
          });

          myMarker.setMap(map);

          /*
            🟢 근처 사용자 가져오기
          */
          axios
            .get("http://localhost:5000/api/users/nearby", {
              params: {
                lat: latitude,
                lng: longitude,
                radius: 1000,
              },
            })
            .then((res) => {
              const users = res.data;

              users.forEach((user) => {
                // 자기 자신 제외
                if (user.lat === latitude && user.lng === longitude) return;

                const position = new window.kakao.maps.LatLng(
                  user.lat,
                  user.lng,
                );

                const marker = new window.kakao.maps.Marker({
                  position,
                });

                marker.setMap(map);

                /*
                  🔴 RED PROFILE TEXTBOX
                */
                const content = `
                  <div style="
                    background:red;
                    color:white;
                    padding:8px 12px;
                    border-radius:8px;
                    font-size:13px;
                    font-weight:bold;
                    box-shadow:0 2px 6px rgba(0,0,0,0.3);
                    text-align:center;
                  ">
                    ${user.nickname}<br/>
                    <span style="font-weight:normal;font-size:12px;">
                      ${user.bio}
                    </span>
                  </div>
                `;

                const overlay = new window.kakao.maps.CustomOverlay({
                  position,
                  content,
                  yAnchor: 1.8, // 위치 위로 띄움
                });

                overlay.setMap(map);
              });
            })
            .catch((err) => {
              console.error("근처 사용자 불러오기 실패:", err);
            });
        },
        (error) => {
          console.error("위치 오류:", error);
        },
      );
    });
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "500px", marginTop: "20px" }}
    />
  );
}

export default KakaoMap;
