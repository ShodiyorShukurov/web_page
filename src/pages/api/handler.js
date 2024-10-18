export default function handler(req, res) {
  // URL query orqali foydalanuvchi ID ni olish
  const { userId } = req.query;

  // Tekshirish uchun consolda chiqaramiz
  console.log(`Foydalanuvchi ID: ${userId}`);

  // Foydalanuvchi ID ga qarab javob yuborish
  res.status(200).json({
    message: `Foydalanuvchi ID: ${userId}`,
    html: `<div><h1>Obuna bo'ldingiz, foydalanuvchi ${userId}</h1></div>`,
  });
}
