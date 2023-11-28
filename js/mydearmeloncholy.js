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
                    name: "Call Out My Name",
                    artist: "The Weeknd",
                    cover: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/img/albums/mydearmeloncholy.jpg",
                    source: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/mp3/albums/The Weeknd-Call Out My Name.mp3",
                    url: "https://youtu.be/M4ZoCHID9GI?si=d1tF5v3utB8HX7wb",
                    favorited: false
                },
                {
                    name: "Try Me",
                    artist: "The Weeknd",
                    cover: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/img/albums/mydearmeloncholy.jpg",
                    source: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/mp3/albums/The Weeknd-Try Me.mp3",
                    url: "https://youtu.be/2DjM0lY4pbE?si=IOSz72Var8m3Pzsy",
                    favorited: false
                },
                {
                    name: "Wasted Times",
                    artist: "The Weeknd, Gesaffelstein",
                    cover: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/img/albums/mydearmeloncholy.jpg",
                    source: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/mp3/albums/The Weeknd-Wasted Times.mp3",
                    url: "https://youtu.be/R0rKB_bsUNg?si=fJZK5SFMv_cGCSMN",
                    favorited: false
                },
                {
                    name: "I Was Never There",
                    artist: "The Weeknd, Gesaffelstein",
                    cover: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/img/albums/mydearmeloncholy.jpg",
                    source: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/mp3/albums/The Weeknd-I Was Never There.mp3",
                    url: "https://youtu.be/OlStmta0Vh4?si=W94qchU-mZdsN-D7",
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
                if (this.isTimerPlaying) {
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
        this.audio.ontimeupdate = function () {
            vm.generateTime();
        };
        this.audio.onloadedmetadata = function () {
            vm.generateTime();
        };
        this.audio.onended = function () {
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