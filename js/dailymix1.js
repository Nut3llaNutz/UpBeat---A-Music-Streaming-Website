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
                    name: "Me And Your Mama",
                    artist: "Childish Gambino",
                    cover: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/img/playlists/maym.jpg",
                    source: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/mp3/playlists/Childish Gambino-Me and Your Mama.mp3",
                    url: "https://youtu.be/_hZCsgcKa-g?si=F6Wxo-osKzrc2dml",
                    favorited: false
                },
                {
                    name: "I KNOW ?",
                    artist: "Travis Scott",
                    cover: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/img/playlists/iknow.jpg",
                    source: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/mp3/playlists/Travis Scott-I KNOW.mp3",
                    url: "https://youtu.be/fmdLsdmYzTo?si=VS_EIS-7tJU5tGz5",
                    favorited: false
                },
                {
                    name: "Lavender Sunflower",
                    artist: "Tory Lanez",
                    cover: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/img/playlists/lavsun.jpg",
                    source: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/mp3/playlists/Tory Lanez-Lavender Sunflower.mp3",
                    url: "https://youtu.be/IVMFz_ArMHw?si=mmymnbXNgYAT6Do3",
                    favorited: false
                },
                {
                    name: "3005",
                    artist: "Childish Gambino",
                    cover: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/img/playlists/3005.jpg",
                    source: "https://raw.githubusercontent.com/Nut3llaNutz/UpBeat---A-Music-Streaming-Website/main/Assets/mp3/playlists/Childish Gambino-3005.mp3",
                    url: "https://youtu.be/tG35R8F2j8k?si=XWsMeh82I_oxCqq-",
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