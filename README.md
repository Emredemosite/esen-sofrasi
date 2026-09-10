# Esen Sofrası — demo site

Yenikent / Sincan'daki Esen Sofrası için hazırlanmış, scroll tabanlı 3D tanıtım sitesi.
Referans: [Son Daven](https://sondaven.com/en) (Awwwards Site of the Month, Haz 2026).

## Çalıştırma

```bash
cd Desktop/esen-sofrasi
npx serve -l 5173 .
# → http://localhost:5173
```

Build adımı yok. Saf HTML + CSS + JS.

## Teknoloji

| | |
|---|---|
| GSAP 3.12 + ScrollTrigger | bütün sahne koreografisi |
| Lenis 1.1 | yumuşak scroll (sinematik hissin kaynağı) |
| CSS 3D transforms | menü halkası — Three.js **yok** |
| Bodoni Moda + Inter | Google Fonts |

CDN'den gelen üç kütüphane dışında dış bağımlılık yok. Video ve görsellerin hepsi
`assets/` altında yerel.

## Bölümler

1. **Preloader** — ateş videosu + yüzde sayacı, perde açılışıyla çıkar
2. **Hero** — tam ekran şiş videosu, harf harf açılan başlık, scroll'da derinliğe gömülür
3. **Manifesto** — kelimeler scroll ilerledikçe tek tek "yanar"
4. **Ateş** — `video.currentTime` scroll'a bağlı; kaydırdıkça şişler döner, 4 adım anlatısı üstünde ilerler
5. **Sofra** — 8 yemek kartı bir silindir üzerinde; scroll halkayı çevirir, arkadaki kartlar bulanıklaşır
6. **Rakamlar** — görünürlüğe girince sayan istatistikler
7. **Galeri** — dikey scroll'un yatay harekete çevrildiği şerit
8. **Mekân** — paralaks video + özellik listesi
9. **İletişim** — telefon, adres, koyu temalı Google Maps

## ⚠ Uydurma içerik — işletmeden teyit alınmalı

Gerçek veriler yalnızca: **ad, adres, telefon, 4,6 puan, 217 yorum, 400–600 ₺ aralığı.**
Aşağıdakilerin hepsi tasarımı ayakta tutmak için yazıldı, **satıştan önce değişmeli**:

- Bütün menü kalemleri ve fiyatlar (480 ₺ kuzu şiş, 620 ₺ antrikot vb.)
- "27 yıl", "180 kişilik salon", "14 dakika", "120 + 60 kişi"
- Çalışma saatleri (11:00 – 23:30)
- Ücretsiz otopark / aile salonu / nişan-mevlit / paket servis iddiaları
- Bütün hikâye metinleri (meşe kömürü, 21 gün dinlendirme, İspir fasulyesi...)

Görseller ve videolar **Mixkit** stok arşivinden (ücretsiz, ticari kullanıma açık).
Hiçbiri Esen Sofrası'nın gerçek yemeği değil — anlaşma olursa mekânda çekim yapılmalı.
Menü fotoğrafları videolardan `ffmpeg` ile kare çıkarılarak üretildi, kaynakları
`assets/video/` altında duruyor.

## Bilinen sınırlar

- Toplam ~46 MB video. Mobilde ağır; yayına çıkarsa videolar WebM'e çevrilmeli ve
  mobil için düşük çözünürlüklü varyant eklenmeli.
- `sis-scrub.mp4` all-intra kodlanmış (her kare keyframe) — scroll'da anında
  seek edilebilsin diye. Bu yüzden 8 saniye için 4 MB.
- Sayfa toplam ~15.700 px scroll. Uzun bir deneyim; sabırsız kullanıcı için
  navigasyondaki bağlantılar kısayol görevi görüyor.
- Google Maps embed'i API anahtarsız çalışıyor, marker göstermiyor. Gerçek işletme
  Google'da doğrulanınca Place ID ile marker'lı embed'e geçilebilir.
