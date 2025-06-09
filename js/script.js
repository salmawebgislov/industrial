// Background slideshow di elemen .hero
const hero = document.querySelector(".hero");
const heroSlides = document.querySelectorAll(".slideshow-container img");

console.log("Jumlah gambar slideshow:", heroSlides.length);

let currentSlide = 0;

function setBackgroundFromSlide(index) {
  const imageUrl = heroSlides[index].getAttribute("src");
  hero.style.backgroundImage = `url(${imageUrl})`;
}

function startSlideshow() {
  setBackgroundFromSlide(currentSlide);
  currentSlide = (currentSlide + 1) % heroSlides.length;
  setTimeout(startSlideshow, 4000); // Ganti setiap 4 detik
}

startSlideshow();

// Ganti gambar saat hero di-klik
hero.addEventListener("click", () => {
  setBackgroundFromSlide(currentSlide);
  currentSlide = (currentSlide + 1) % heroSlides.length;
});


// Horizontal scroll container (misal untuk card testimonial atau galeri)
const container = document.getElementById('cardContainer');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

if (container && nextBtn && prevBtn) {
  nextBtn.addEventListener('click', () => {
    container.scrollBy({ left: 270, behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    container.scrollBy({ left: -270, behavior: 'smooth' });
  });
}


// Carousel Infrastruktur (dengan dot navigasi)
const infraDots = document.querySelectorAll('.dot');
const infraSlides = document.querySelectorAll('.infrastruktur-slide');

infraDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const index = parseInt(dot.getAttribute('data-slide'));

    // Hapus semua 'active'
    infraSlides.forEach(slide => slide.classList.remove('active'));
    infraDots.forEach(d => d.classList.remove('active'));

    // Tambahkan 'active' sesuai index
    infraSlides[index].classList.add('active');
    dot.classList.add('active');
  });
});
 // Inisialisasi peta
  var map = L.map('map').setView([-6.3, 107.3], 10);

  // Basemap 1: OpenStreetMap
  var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Basemap 2: Satelit
  var satellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  });

  // Layer tambahan: Kawasan Industri (contoh polygon atau marker)
  var kawasanIndustri = L.layerGroup();
  L.marker([-6.3, 107.3]).bindPopup('Kawasan Industri 1').addTo(kawasanIndustri);

  // Layer control
  var baseLayers = {
    "OpenStreetMap": osm,
    "Satellite": satellite
  };

  var overlays = {

  };



// Easy Button (contoh)
L.easyButton('fa-home', function(btn, map){
  map.setView([-6.387, 107.237], 11);
}, 'Kembali ke Karawang').addTo(map);

// Tombol locate (cari lokasi pengguna)
L.control.locate({
  position: 'topleft',
  strings: {
    title: "Temukan lokasiku"
  }
}).addTo(map);


// Load GeoJSON secara dinamis

// Buat pane agar titik selalu di atas
map.createPane('titikAtas');
map.getPane('titikAtas').style.zIndex = 650;

// Buat pane untuk garis (jalan, jarak, batas) di bawah titik
map.createPane('garisBawah');
map.getPane('garisBawah').style.zIndex = 450;

function customIcon(url, size = [30, 30]) {
  return L.icon({
    iconUrl: url,
    iconSize: size,
    iconAnchor: [15, 15],     // Pusat ikon (anchor) agar sejajar dengan lokasi marker
    popupAnchor: [0, -28]     // Popup muncul sedikit di atas ikon
  });
}
fetch('asset/data geojson/iniindustri.geojson')
  .then(res => res.json())
  .then(data => {
    var sebaranIndustriLayer = L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          pane: 'titikAtas',
          icon: customIcon('asset/simbol industri.png')
        });
      },
      onEachFeature: function (feature, layer) {
        let nama = feature.properties.nama || 'Industri';
        layer.bindPopup(`<strong>🏭 Industri:</strong> ${nama}`);
      }
    });
    overlays["Sebaran Industri"] = sebaranIndustriLayer;
    sebaranIndustriLayer.addTo(map);
    controlLayers.addOverlay(sebaranIndustriLayer, "Sebaran Industri");
  });


  //batas admin
fetch('asset/data geojson/batas administrasi.geojson')
.then(res => res.json())
.then(data => {
    var batasAdminLayer = L.geoJSON(data, {
        pane: 'garisBawah',
        style: {
            color: "#2E86C1",
            weight: 2,
            opacity: 0.7,
            fill: false
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.nama || "Batas Wilayah");
        }
    });
    overlays["Batas Administrasi"] = batasAdminLayer;
    batasAdminLayer.addTo(map);
    controlLayers.addOverlay(batasAdminLayer, "Batas Administrasi");
});

  //jalan
fetch('asset/data geojson/jalan.geojson')
.then(res => res.json())
.then(data => {
    var jalanLayer = L.geoJSON(data, {
        pane: 'garisBawah',
        style: function (feature) {
            let jenis = feature.properties.REMARK?.toLowerCase() || "";
            let color = "#F39C12";
            if (jenis.includes("arteri")) color = "rgb(29, 4, 255)";
            else if (jenis.includes("lokal")) color = "rgb(174, 58, 210)";
            return { color, weight: 2 };
        },
        onEachFeature: function (feature, layer) {
            let nama = feature.properties.NAMRJL || "Jalan";
            let jenis = feature.properties.REMARK || "Tidak diketahui";
            layer.bindPopup(`<strong>${nama}</strong><br>Jenis: ${jenis}`);
        }
    });
    overlays["Jaringan Jalan"] = jalanLayer;
    jalanLayer.addTo(map);
    controlLayers.addOverlay(jalanLayer, "Jaringan Jalan");
});

//jarak
fetch('asset/data geojson/jarak line.geojson')
.then(res => res.json())
.then(data => {
    var JarakLine = L.geoJSON(data, {
        pane: 'garisBawah',
        style: {
            color: "rgb(255, 0, 0)",
            weight: 3,
            opacity: 1,
            dashArray: '2, 5'
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.nama || 'Jarak');
        }
    });
    overlays["Jarak"] = JarakLine;
    JarakLine.addTo(map);
    map.fitBounds(JarakLine.getBounds()); // zoom otomatis ke area layer
    controlLayers.addOverlay(JarakLine, "Jarak Line");
});

  //poin
  fetch('asset/data geojson/poin rs.geojson')
  .then(res => res.json())
  .then(data => {
    var PoinRS = L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: '#007bff',
          color: '#fff',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup(feature.properties.nama || 'RS Poin');
      }
    });
    overlays["Poin RS"] = PoinRS;
    PoinRS.addTo(map);
        map.fitBounds(sebaranRSLayer.getBounds()); // zoom otomatis ke area layer
    controlLayers.addOverlay(PoinRS, "POIN RS");
  });


  fetch('asset/data geojson/sebaran rs.geojson')
  .then(res => res.json())
  .then(data => {
    var sebaranRSLayer = L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          pane: 'titikAtas',
          icon: customIcon('asset/smbol rs.png')
        }).bindPopup(`<strong>🏥 RS:</strong> ${feature.properties.nama_pulau || 'RS'}`);
      }
    });
    overlays["Sebaran RS"] = sebaranRSLayer;
    sebaranRSLayer.addTo(map);
    controlLayers.addOverlay(sebaranRSLayer, "Sebaran RS");
  });


// Layer control diperbarui setelah semua layer ditambahkan
var controlLayers = L.control.layers(baseLayers, overlays).addTo(map);

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.style.background = 'white';
  div.style.padding = '10px';
  div.style.border = '1px solid #ccc';
  div.style.borderRadius = '8px';
  div.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
  div.style.fontSize = '13px';
  div.style.lineHeight = '1.5em';
  div.innerHTML = `
    <strong style="font-size:14px;">Keterangan</strong><br><br>

    <strong>Industri & Kesehatan</strong><br>
    <img src="asset/simbol industri.png" style="width:20px; vertical-align:middle;"> Sebaran Industri<br>
    <img src="asset/smbol rs.png" style="width:20px; vertical-align:middle;"> Sebaran Rumah Sakit<br>
    <span style="
      display:inline-block;
      width:12px;
      height:12px;
      margin-left: 4px;
      background:#007bff;
      border-radius:50%;
      border:1px solid #fff;
      vertical-align:middle;
      margin-right:3px;"></span> Poin Rumah Sakit<br><br>

    <strong>Garis</strong><br>
    <span style="display:inline-block; width:20px; height:3px; background:red;"></span> Jarak Line<br>
    <span style="display:inline-block; width:20px; height:3px; background:blue;"></span> Jalan Arteri<br>
    <span style="display:inline-block; width:20px; height:3px; background:rgb(174, 58, 210);"></span> Jalan Lokal<br>
    <span style="display:inline-block; width:20px; height:3px; background:rgb(243, 156, 18);"></span> Jalan Lain<br><br>

    <strong>Batas Wilayah</strong><br>
    <svg height="10" width="30">
      <line x1="0" y1="5" x2="30" y2="5" style="stroke:#2E86C1;stroke-width:2;stroke-dasharray:4,2" />
    </svg> Batas Administrasi
  `;
  return div;
};

legend.addTo(map);
