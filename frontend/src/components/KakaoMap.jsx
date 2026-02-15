import { useEffect, useRef } from "react";

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

          // 내 위치 마커
          const markerPosition = new window.kakao.maps.LatLng(
            latitude,
            longitude,
          );

          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });

          marker.setMap(map);
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
