// 1. กำหนดพิกัดเริ่มต้นให้อยู่บริเวณ อ.สะเดา จ.สงขลา
const sadaoLat = 6.6385;
const sadaoLng = 100.4231;
const zoomLevel = 12;

// 2. สร้างแผนที่ Leaflet ใน div id="map-container"
const map = L.map('map-container').setView([sadaoLat, sadaoLng], zoomLevel);
// หลังจากสร้างตัวแปร map สั่งให้ Leaflet คำนวณขนาดกรอบใหม่ทันที
setTimeout(function() {
    map.invalidateSize();
}, 200);

// คำสั่งช่วยคำนวณใหม่เมื่อมีการย่อ/ขยายหน้าจอ
window.addEventListener('resize', function() {
    map.invalidateSize();
});

// 3. โหลดชั้นข้อมูลแผนที่จาก OpenStreetMap (แนะนำให้รันผ่าน Live Server ใน VS Code เพื่อป้องกันบล็อก 403)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 4. ฟังก์ชันดึงตำแหน่ง GPS ปัจจุบันของผู้ใช้งาน
function getmylocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // เลื่อนแผนที่ไปตำแหน่งปัจจุบันของผู้ใช้แบบซูมใกล้ขึ้น
                map.setView([lat, lng], 15);

                // สร้างหมุดสีฟ้าแสดงพิกัดปัจจุบันของเรา
                const userIcon = L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                L.marker([lat, lng], { icon: userIcon })
                    .addTo(map)
                    .bindPopup("<b>📍 ตำแหน่งปัจจุบันของคุณ</b>").openPopup();

                alert("ดึงตำแหน่ง GPS สำเร็จ!");
            },
            (error) => {
                alert("ไม่สามารถดึงตำแหน่งได้ กรุณาเปิดการอนุญาตเข้าถึง GPS บนเบราว์เซอร์");
                console.error(error);
            },
            { enableHighAccuracy: true }
        );
    } else {
        alert("เบราว์เซอร์ของคุณไม่รองรับการดึงพิกัด GPS");
    }
}

// 3. ระบบส่งฟอร์มรายงานปัญหา (Form Submission)
const waterReportForm = document.getElementById('waterReportForm');

if (waterReportForm) {
    waterReportForm.addEventListener('submit', (e) => {
        e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรชเอง

        // ตรวจสอบข้อมูลเบื้องต้นหรือจำลองการบันทึกข้อมูล
        // เปาะเปี๊ยะสามารถนำข้อมูลตรงนี้ไปเก็บบันทึกใน localStorage หรือเชื่อมต่อฐานข้อมูลต่อได้เลยครับ
        
        // แสดงป๊อปอัปแจ้งเตือนความสำเร็จ
        alert('🎉 ส่งรายงานปัญหาสำเร็จ!\nขอบคุณที่ร่วมเป็นส่วนหนึ่งในการดูแลแหล่งน้ำ อ.สะเดา ครับ');

        // รีเซ็ตฟอร์มทั้งหมดให้กลับมาค่าเริ่มต้น
        waterReportForm.reset();

        // รีเซ็ตข้อความและสีของกล่องอัปโหลดรูปภาพให้กลับเป็นปกติ
        const uploadText = document.getElementById('uploadText');
        const uploadZone = document.getElementById('uploadZone');
        if (uploadText) {
            uploadText.innerHTML = 'คลิกเพื่ออัปโหลดรูปภาพ';
        }
        if (uploadZone) {
            uploadZone.style.borderColor = '#b0bec5';
            uploadZone.style.background = '#f8fafb';
        }

        // (ตัวเลือกเสริม) พาผู้ใช้กลับไปหน้าแรก หรือหน้าแดชบอร์ด
        // window.location.href = 'index.html';
    });
}