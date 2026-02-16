import { useEffect, useRef } from "react";

function KakaoMap({ users, onInteraction }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.kakao || !users) return;

    window.kakao.maps.load(() => {
      const container = mapRef.current;

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
            padding:10px;
            border-radius:12px;
            text-align:center;
            width:190px;
            box-shadow:0 3px 10px rgba(0,0,0,0.3);
          ">
            <img src="${user.avatar}" 
              style="width:55px;height:55px;border-radius:50%;margin-bottom:6px;border:2px solid white;" />
            <div style="font-weight:bold;margin-bottom:4px;">
              ${user.username}
            </div>
            <div style="font-size:12px;margin-bottom:8px;">
              ${user.profile}
            </div>

            <div style="display:flex;justify-content:space-around;font-size:18px;cursor:pointer;">
              <span id="email-${user.id}">📧</span>
              <span id="like-${user.id}">❤️</span>
              <span id="msg-${user.id}">💬</span>
              <span id="follow-${user.id}">🔔</span>
            </div>
          </div>
        `;

        const overlay = new window.kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 1.3,
        });

        overlay.setMap(map);

        setTimeout(() => {
          const emailBtn = document.getElementById(`email-${user.id}`);
          const likeBtn = document.getElementById(`like-${user.id}`);
          const msgBtn = document.getElementById(`msg-${user.id}`);
          const followBtn = document.getElementById(`follow-${user.id}`);

          emailBtn.onclick = () =>
            onInteraction(`📧 ${user.username}에게 이메일 전송`);

          likeBtn.onclick = () =>
            onInteraction(`❤️ ${user.username}을(를) 좋아합니다`);

          msgBtn.onclick = () =>
            onInteraction(`💬 ${user.username}에게 메시지 보냄`);

          followBtn.onclick = () =>
            onInteraction(`🔔 ${user.username}을(를) 팔로우했습니다`);
        }, 100);
      });
    });
  }, [users, onInteraction]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}

export default KakaoMap;
