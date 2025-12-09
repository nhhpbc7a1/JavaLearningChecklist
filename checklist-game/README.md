# 🎮 Java Learning Checklist - Game Mode

Ứng dụng checklist dạng game để theo dõi tiến độ học Java, với tính năng lưu/tải dữ liệu từ file CSV.

## ✨ Tính năng

- 🎯 **Giao diện game-like**: UI đẹp với animations, progress bars, achievements
- 📊 **Theo dõi tiến độ**: Level, XP, completion percentage
- 💾 **Lưu/Load CSV**: Lưu và tải progress từ file CSV
- 🏆 **Achievements**: Unlock achievements khi đạt milestones
- 📱 **Responsive**: Hoạt động tốt trên mobile và desktop
- 🎨 **Visual Feedback**: Animations khi complete tasks

## 🚀 Sử dụng

### Cách 1: Mở trực tiếp
1. Mở file `index.html` trong browser
2. Bắt đầu đánh dấu các tasks đã hoàn thành

### Cách 2: Local Server (Recommended)
```bash
# Sử dụng Python
python -m http.server 8000

# Hoặc Node.js
npx http-server

# Sau đó truy cập: http://localhost:8000
```

## 📋 Chức năng

### Load CSV
- Click nút **"Load CSV"**
- Chọn file CSV đã lưu trước đó
- Progress sẽ được restore

### Save CSV
- Click nút **"Save CSV"**
- File sẽ được download với tên: `java-learning-checklist-YYYY-MM-DD.csv`

### Export CSV
- Tương tự Save CSV

### Reset All
- Reset tất cả progress về 0
- Cần xác nhận trước khi reset

## 📁 Cấu trúc File CSV

File CSV có format:
```csv
Category,Item,Description,XP,Completed
"Week 1-2: Java Core + Spring Boot","Java Fundamentals","...",10,false
...
GAME_STATE,Level:1,XP:50,MaxXP:100,Completed:5
```

- **Category**: Category của task
- **Item**: Tên task
- **Description**: Mô tả chi tiết
- **XP**: Điểm XP khi hoàn thành
- **Completed**: `true` hoặc `false`

Dòng cuối cùng chứa game state (Level, XP, MaxXP, Completed)

## 🎮 Game Mechanics

### Level System
- Bắt đầu ở Level 1
- Mỗi task hoàn thành cho XP
- Khi đủ XP, level up
- MaxXP tăng 1.5x mỗi level

### Achievements
Unlock achievements khi đạt:
- 25% completion: "Getting Started! 🎯"
- 50% completion: "Halfway There! 💪"
- 75% completion: "Almost Done! 🔥"
- 100% completion: "Master Achieved! 🏆"

### XP Values
- Basic tasks: 10-15 XP
- Advanced tasks: 20 XP
- Projects: 30 XP

## 🛠️ Customization

### Thêm tasks mới
Chỉnh sửa function `loadDefaultChecklist()` trong `script.js`:

```javascript
const defaultData = [
    { category: 'Your Category', item: 'Your Task', description: 'Description', xp: 10, completed: false },
    // ...
];
```

### Thay đổi milestones
Chỉnh sửa array `milestones` trong `script.js`:

```javascript
const milestones = [
    { percent: 25, message: "Your Message! 🎯" },
    // ...
];
```

### Customize colors
Chỉnh sửa CSS variables trong `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --success-color: #10b981;
    /* ... */
}
```

## 📝 Notes

- Dữ liệu được lưu trong browser memory (không persist sau khi đóng tab)
- Cần save CSV để lưu progress lâu dài
- File CSV có thể chỉnh sửa bằng Excel/Google Sheets
- Format CSV phải đúng để load được

## 🐛 Troubleshooting

### CSV không load được
- Kiểm tra format CSV có đúng không
- Đảm bảo có header: `Category,Item,Description,XP,Completed`
- Kiểm tra encoding file (UTF-8)

### Progress không lưu
- Nhớ click "Save CSV" trước khi đóng browser
- File CSV sẽ được download vào thư mục Downloads

## 🎨 Features có thể thêm

- [ ] LocalStorage để auto-save
- [ ] Sound effects khi complete task
- [ ] More achievements
- [ ] Statistics charts
- [ ] Dark/Light theme toggle
- [ ] Export to PDF
- [ ] Share progress link

---

**Happy Learning! 🚀**

