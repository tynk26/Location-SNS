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
            🔵 현재 사용자 마커 (파란색)
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

              console.log("[MAP] 근처 사용자:", users);

              users.forEach((user) => {
                // 자기 자신은 제외
                if (user.lat === latitude && user.lng === longitude) return;

                const markerPosition = new window.kakao.maps.LatLng(
                  user.lat,
                  user.lng,
                );

                const marker = new window.kakao.maps.Marker({
                  position: markerPosition,
                });

                marker.setMap(map);

                const infoWindow = new window.kakao.maps.InfoWindow({
                  content: `
                  <div style="padding:10px;">
                    <strong>${user.nickname}</strong><br/>
                    ${user.bio}
                  </div>
                `,
                });

                window.kakao.maps.event.addListener(marker, "click", () => {
                  infoWindow.open(map, marker);
                });
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
