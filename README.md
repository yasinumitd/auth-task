# Auth Task (React + Vite + Firebase)

Basit bir e‑posta/şifre ile kayıt ve giriş akışı. Firebase Authentication kullanır, `/dashboard` korumalı sayfası vardır. Router ile `/register`, `/login`, `/dashboard` rotaları bulunur.

## Gereksinimler
- Node.js 18+ (önerilen 20+)
- npm 9+

## Çalıştırma adımı
1. Bağımlılıklar
```
npm install
```
2. Geliştirme sunucusu
```
npm run dev
```
3. Tarayıcıdan açın: `http://localhost:5173`

## Test komutları
- Component testleri (Vitest + RTL)
```
npm run test
```


## Kısa mimari notları
- Router ve sayfalar
  - `src/App.tsx` temel rotaları tanımlar: `/register`, `/login`, `/dashboard`.
  - `src/providers/AuthGate.tsx` global bir sargı olarak çalışır; public rotalar (`/login`, `/register`) dışındaki tüm rotalarda kullanıcı yoksa `/login`’a yönlendirir, kullanıcı varken public rotalarda `/dashboard`’a iter.
- Firebase
  - `src/firebase.ts` Firebase App’i başlatır ve `auth` nesnesini dışa aktarır. Oturum kalıcılığı `browserSessionPersistence` (tarayıcı oturumu kapanınca biter) olarak ayarlanmıştır.
- İş mantığı (hook)
  - `src/hooks/useAuth.ts` sadece ağ işlemlerini kapsar: `register(email, password)` ve `login(email, password)`. Ayrıca `isSubmitting`, `error`, `clearError` durumları sağlar. Validasyonlar sayfa bileşenlerinde tutulur.
- Sayfalar
  - `src/pages/Register.tsx`: e‑posta formatı, şifre karmaşıklığı (8+ karakter, rakam, büyük/küçük harf) ve şifre eşleşmesi. Eksik şifre kurallarını dinamik listeler.
  - `src/pages/Login.tsx`: e‑posta formatı ve zorunlu şifre kontrolü, başarılı girişte `/dashboard`’a yönlendirme.
  - `src/pages/Protected.tsx`: oturumdaki kullanıcının e‑postasını gösterir ve çıkış yapma butonu içerir.

İsteğe bağlı geliştirmeler
- `AuthGate` public rota listesini konfigüre edilebilir hale getirmek
- Başarılı giriş/kayıt sonrası toast bildirimleri

## TODO
- Backend kısmı eksik kendimi geliştirmem gereken alan. bu yüzden sayfaların yine dinamik çalışabilmesi için firebase kurdum.