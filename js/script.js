new Vue({
  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks: [
        {
          name: "Japanese Denim",
          artist: "Daniel Caesar",
          cover: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/img/songs/japanesedenim.jpg",
          source: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/mp3/Daniel Caesar-Japanese Denim.mp3",
          url: "https://youtu.be/6OkneaH-eTA?si=ufX1_jUKGkz82kzs",
          favorited: false
        },
        {
          name: "Feel No Ways",
          artist: "Drake",
          cover: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/img/songs/feelnoways.jpg",
          source: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/mp3/Drake-Feel No Ways.mp3",
          url: "https://youtu.be/pMaogWC5TEQ?si=0xvzZSaB5Yu5Wpyh",
          favorited: false
        },
        {
          name: "Solo Dolo, Pt. III",
          artist: "Kid Cudi",
          cover: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/img/songs/solodolopt3.jpg",
          source: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/mp3/Kid Cudi-Solo Dolo Pt III.mp3",
          url: "https://youtu.be/8kUNIXRY9io?si=d3hBsOUqX-5DJCxc",
          favorited: false
        },
        {
          name: "Power Trip",
          artist: "J. Cole ft. Miguel",
          cover: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/img/songs/powertrip.jpg",
          source: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/mp3/J Cole-Power Trip.mp3",
          url: "https://youtu.be/7AjD7nKiUQ4?si=ul6tMhKtc8R8AxOU",
          favorited: false
        },
        {
          name: "Snooze",
          artist: "SZA",
          cover: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/img/songs/snooze.jpg",
          source: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/mp3/SZA-Snooze.mp3",
          url: "https://youtu.be/LDY_XyxBu8A?si=AulR69uVbaRV79TR",
          favorited: false
        },
        {
          name: "Money Trees",
          artist: "Kendrick Lamar ft. Jay Rock",
          cover: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/img/songs/moneytrees.jpg",
          source: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/mp3/Kendrick Lamar-Money Trees.mp3",
          url: "https://youtu.be/Iy-dJwHVX84?si=gaxSGmlywnhb_qrC",
          favorited: false
        },
      ],
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null
    };
  },
  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(event) {
      // Pause the audio while seeking
      this.audio.pause();

      // Get the position of the click relative to the progress bar
      const progress = this.$refs.progress;
      const position = event.clientX - progress.getBoundingClientRect().left;

      // Calculate the percentage based on the position
      const percentage = (100 * position) / progress.offsetWidth;

      // Update the bar and circle positions
      this.barWidth = percentage + '%';
      this.circleLeft = percentage + '%';

      // Update the audio playback position
      const maxduration = this.audio.duration;
      this.audio.currentTime = (maxduration * percentage) / 100;

      // Resume audio playback
      this.audio.play();
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if(this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    playSpecificTrack(event) {
      // Prevent the default behavior of the anchor tag
      event.preventDefault();
      // Check if the click target is the anchor itself or a child element
      const clickedElement = event.target.tagName.toLowerCase();
      
      // If the clicked element is not the anchor, find the closest anchor
      const anchor = clickedElement === 'a' ? event.target : event.target.closest('a');

      // Get the specificTrackIndex from the data attribute
      const specificTrackIndex = anchor.dataset.specificTrackIndex;

      // Ensure specificTrackIndex is a valid number
      if (!isNaN(specificTrackIndex)) {
        // Convert it to a number if needed
        this.currentTrackIndex = parseInt(specificTrackIndex, 10);

        // Set the current track to the desired track
        this.currentTrack = this.tracks[this.currentTrackIndex];

        // Reset the player to play the new track
        this.resetPlayer();
      } else {
        console.error("Invalid specificTrackIndex:", specificTrackIndex);
      }
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited;
    }
  },
  created() {
    let vm = this;
    this.currentTrack = this.tracks[0];
    this.audio = new Audio();
    this.audio.src = this.currentTrack.source;
    this.audio.ontimeupdate = function() {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function() {
      vm.generateTime();
    };
    this.audio.onended = function() {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    // this is optional (for preload covers)
    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement('link');
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image"
      document.head.appendChild(link)
    }
  }
});