document.addEventListener('DOMContentLoaded', function() {
  // Music Player
  const songs = [
    {
      title: 'Giải phóng miền Nam',
      src: 'giai-phong-mien-nam.mp3'
    },
    {
      title: 'Như có Bác Hồ trong ngày vui đại thắng',
      src: 'nhu-co-bac-ho.mp3'
    },
    {
      title: 'Tiến về Sài Gòn',
      src: 'tien-ve-sai-gon.mp3'
    },
    {
      title: 'Chiến thắng Điện Biên',
      src: 'chien-thang-dien-bien.mp3'
    }
  ];

  const musicPlayer = {
    audio: new Audio(),
    currentSongIndex: 0,
    isPlaying: false,
    progressInterval: null,
    
    init: function() {
      this.audio.volume = 0.5;
      this.loadSong(0);
      this.setupEventListeners();
    },
    
    loadSong: function(index) {
      this.currentSongIndex = index;
      this.audio.src = songs[index].src;
      document.getElementById('song-title').textContent = songs[index].title;
      
      if (this.isPlaying) {
        this.playSong();
      }
    },
    
    playSong: function() {
      this.audio.play();
      document.getElementById('play').innerHTML = '<i class="fas fa-pause"></i>';
      this.isPlaying = true;
      
      this.progressInterval = setInterval(() => {
        const progressPercent = (this.audio.currentTime / this.audio.duration) * 100;
        document.querySelector('.progress').style.width = `${progressPercent}%`;
      }, 1000);
    },
    
    pauseSong: function() {
      this.audio.pause();
      document.getElementById('play').innerHTML = '<i class="fas fa-play"></i>';
      this.isPlaying = false;
      clearInterval(this.progressInterval);
    },
    
    prevSong: function() {
      this.currentSongIndex = (this.currentSongIndex - 1 + songs.length) % songs.length;
      this.loadSong(this.currentSongIndex);
      this.playSong();
    },
    
    nextSong: function() {
      this.currentSongIndex = (this.currentSongIndex + 1) % songs.length;
      this.loadSong(this.currentSongIndex);
      this.playSong();
    },
    
    setupEventListeners: function() {
      const playBtn = document.getElementById('play');
      const prevBtn = document.getElementById('prev');
      const nextBtn = document.getElementById('next');
      const volumeSlider = document.getElementById('volume');
      const progressContainer = document.querySelector('.progress-container');
      
      playBtn.addEventListener('click', () => {
        if (this.isPlaying) {
          this.pauseSong();
        } else {
          this.playSong();
        }
      });
      
      prevBtn.addEventListener('click', () => {
        this.prevSong();
      });
      
      nextBtn.addEventListener('click', () => {
        this.nextSong();
      });
      
      volumeSlider.addEventListener('input', (e) => {
        this.audio.volume = e.target.value;
      });
      
      progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        
        this.audio.currentTime = (clickX / width) * duration;
      });
      
      this.audio.addEventListener('ended', () => {
        this.nextSong();
      });
    }
  };
  
  musicPlayer.init();
  
  // Vietnam Map with D3.js
  const width = document.getElementById('vietnam-map').clientWidth;
  const height = 500;
  
  const svg = d3.select('#vietnam-map')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', '0 0 800 1200')
    .attr('preserveAspectRatio', 'xMidYMid meet');
    
  const projection = d3.geoMercator()
    .center([106, 16])
    .scale(2500)
    .translate([width / 2, height / 2]);
    
  const path = d3.geoPath().projection(projection);
  
  const g = svg.append('g');
  
  // Load Vietnam GeoJSON data
  d3.json('https://raw.githubusercontent.com/tonydiep/d3-vietnam-map/master/vietnam.json')
    .then(function(data) {
      // Draw mainland Vietnam
      g.selectAll('.province')
        .data(data.features)
        .enter()
        .append('path')
        .attr('class', 'province')
        .attr('d', path)
        .attr('fill', '#d50000')
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .on('mouseover', function(event, d) {
          d3.select(this)
            .attr('fill', '#b71c1c');
            
          // Show tooltip with province name
          const [x, y] = d3.pointer(event);
          
          svg.append('text')
            .attr('class', 'tooltip')
            .attr('x', x)
            .attr('y', y - 10)
            .attr('text-anchor', 'middle')
            .attr('fill', '#fff')
            .attr('stroke', '#000')
            .attr('stroke-width', 0.5)
            .text(d.properties.Name);
        })
        .on('mouseout', function() {
          d3.select(this)
            .attr('fill', '#d50000');
            
          svg.selectAll('.tooltip').remove();
        });
        
      // Add Hoang Sa Islands
      svg.append('circle')
        .attr('cx', projection([112, 16.5])[0])
        .attr('cy', projection([112, 16.5])[1])
        .attr('r', 10)
        .attr('fill', '#ffeb3b')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);
        
      svg.append('text')
        .attr('x', projection([112, 16.5])[0])
        .attr('y', projection([112, 16.5])[1] - 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#000')
        .attr('font-weight', 'bold')
        .attr('font-size', '12px')
        .text('Quần đảo Hoàng Sa');
        
      // Add Truong Sa Islands
      svg.append('circle')
        .attr('cx', projection([114, 10])[0])
        .attr('cy', projection([114, 10])[1])
        .attr('r', 10)
        .attr('fill', '#ffc107')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);
        
      svg.append('text')
        .attr('x', projection([114, 10])[0])
        .attr('y', projection([114, 10])[1] - 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#000')
        .attr('font-weight', 'bold')
        .attr('font-size', '12px')
        .text('Quần đảo Trường Sa');
    })
    .catch(function(error) {
      console.log('Error loading map data:', error);
      
      // Fallback simple map if GeoJSON fails to load
      const vietnamShape = "M150,10 C145,50 155,90 140,130 C130,160 160,200 150,250 C140,300 130,400 150,500 L140,580";
      
      svg.append('path')
        .attr('d', vietnamShape)
        .attr('fill', 'none')
        .attr('stroke', '#d50000')
        .attr('stroke-width', 5);
        
      // Add Hoang Sa Islands
      svg.append('circle')
        .attr('cx', 250)
        .attr('cy', 200)
        .attr('r', 10)
        .attr('fill', '#ffeb3b')
        .attr('stroke', '#fff');
        
      svg.append('text')
        .attr('x', 250)
        .attr('y', 185)
        .attr('text-anchor', 'middle')
        .text('Hoàng Sa');
        
      // Add Truong Sa Islands
      svg.append('circle')
        .attr('cx', 280)
        .attr('cy', 400)
        .attr('r', 10)
        .attr('fill', '#ffc107')
        .attr('stroke', '#fff');
        
      svg.append('text')
        .attr('x', 280)
        .attr('y', 385)
        .attr('text-anchor', 'middle')
        .text('Trường Sa');
    });
    
  // Add sparkle effects on mouse move
  document.addEventListener('mousemove', function(e) {
    if (Math.random() > 0.95) {
      createSparkle(e.pageX, e.pageY);
    }
  });
  
  function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    
    // Random position near cursor
    const offsetX = Math.random() * 100 - 50;
    const offsetY = Math.random() * 100 - 50;
    
    sparkle.style.left = (x + offsetX) + 'px';
    sparkle.style.top = (y + offsetY) + 'px';
    
    // Random size
    const size = Math.random() * 8 + 4;
    sparkle.style.width = size + 'px';
    sparkle.style.height = size + 'px';
    
    // Random color (red, yellow, gold)
    const colors = ['#d50000', '#ffeb3b', '#ffd700'];
    sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    document.body.appendChild(sparkle);
    
    // Remove after animation completes
    setTimeout(() => {
      sparkle.remove();
    }, 1000);
  }
});