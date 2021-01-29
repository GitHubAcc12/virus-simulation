function startParticles() {
    Particles.init({
      selector: ".background",
      color: ['#DA0463', '#404B69', '#DBEDF3'],
      connectParticles: true
    });
};

window.onload = startParticles; 


