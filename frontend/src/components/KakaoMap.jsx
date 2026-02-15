import { useEffect, useRef, useState } from "react";
import axios from "axios";

function KakaoMap({ currentUserId }) {
  const mapRef = useRef(null);
  const [chattingUser, setChattingUser] = useState(null);

  useEffect(() => {
    if (!window.kakao) return;

    window.kakao.maps.load(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const container = mapRef.current;

        const map = new window.kakao.maps.Map(container, {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3,
        });

        // 내 위치 마커
        new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(latitude, longitude),
          map,
        });

        axios
          .get("http://localhost:5000/api/users/nearby", {
            params: { lat: latitude, lng: longitude, radius: 1000 },
          })
          .then((res) => {
            const users = res.data;

            // 이미 추가된 좌표 저장
            const occupiedPositions = [];

            users.forEach((user) => {
              if (user.id === currentUserId) return;

              let lat = user.lat;
              let lng = user.lng;

              // 간단한 겹침 방지: 이미 사용된 위치면 약간씩 오프셋
              let attempts = 0;
              while (
                occupiedPositions.some(
                  (pos) =>
                    Math.abs(pos.lat - lat) < 0.0005 &&
                    Math.abs(pos.lng - lng) < 0.0005,
                ) &&
                attempts < 10
              ) {
                lat += (Math.random() - 0.5) * 0.001; // 약간 위/아래 이동
                lng += (Math.random() - 0.5) * 0.001; // 약간 좌/우 이동
                attempts++;
              }
              occupiedPositions.push({ lat, lng });

              const position = new window.kakao.maps.LatLng(lat, lng);

              let avatarUrl = user.avatar || "https://via.placeholder.com/50";
              if (avatarUrl.startsWith("/uploads/")) {
                avatarUrl = `http://localhost:5000${avatarUrl}`;
              }

              const content = `
                <div style="
                  background:red;
                  color:white;
                  padding:6px;
                  border-radius:10px;
                  text-align:center;
                  font-size:13px;
                  width:160px;
                  box-shadow:0 2px 6px rgba(0,0,0,0.3);
                ">
                  <img src="${avatarUrl}" 
                       style="width:50px;height:50px;border-radius:50%;margin-bottom:5px;" />
                  <div><strong>${user.nickname}</strong></div>
                  <div style="font-size:11px;">${user.bio}</div>
                  <div style="margin-top:4px;">
                    <button id="like-${user.id}" style="
                      background:white;color:red;border:none;padding:2px 5px;border-radius:4px;margin-right:4px;
                      cursor:pointer;
                    ">❤️</button>
                    <button id="chat-${user.id}" style="
                      background:white;color:black;border:none;padding:2px 5px;border-radius:4px;
                      cursor:pointer;
                    ">💬</button>
                  </div>
                </div>
              `;

              const overlay = new window.kakao.maps.CustomOverlay({
                position,
                content,
                yAnchor: 1.8,
              });

              overlay.setMap(map);

              // 버튼 이벤트 바인딩
              setTimeout(() => {
                const likeBtn = document.getElementById(`like-${user.id}`);
                if (likeBtn) {
                  likeBtn.onclick = () => {
                    axios
                      .post("http://localhost:5000/api/like", {
                        fromId: currentUserId,
                        toId: user.id,
                      })
                      .then(() => alert("좋아요 전송!"));
                  };
                }

                const chatBtn = document.getElementById(`chat-${user.id}`);
                if (chatBtn) {
                  chatBtn.onclick = () => {
                    setChattingUser(user);
                  };
                }
              }, 50);
            });
          });
      });
    });
  }, [currentUserId]);

  return (
    <>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "500px", marginTop: "20px" }}
      />
      {chattingUser && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 250,
            height: 300,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: 10,
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            padding: 10,
          }}
        >
          <strong>💬 {chattingUser.nickname}</strong>
          <div style={{ flex: 1, overflowY: "auto", marginTop: 5 }}>
            채팅 내용 영역
          </div>
          <input
            placeholder="메시지 입력"
            style={{ marginTop: 5, padding: 4 }}
          />
          <button
            style={{ marginTop: 4 }}
            onClick={() => setChattingUser(null)}
          >
            닫기
          </button>
        </div>
      )}
    </>
  );
}

export default KakaoMap;
