<template>
  <div class="range-container">
    <div id="track" :class="{ show: show }" class="range-slider">
      <div id="progress" class="progress"></div>
      <div id="thumb" class="thumb"></div>
    </div>
    <br />
    <!-- <div>trackLength: {{ trackLength }}</div>
    <div>distanceAway: {{ distanceAway }}</div>
    <div>trackOffsetTop: {{ trackOffsetTop }}</div>
    <div>thumbOffsetTop: {{ thumbOffsetTop }}</div>
    <div>mouse y: {{ clientY }}</div>
    <div>percentage: {{ percentage }}</div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      trackLength: 0,
      thumbLength: 0,
      distanceAway: 0,
      thumbOffsetTop: 0,
      trackOffsetTop: 0,
      percentage: 0,
      clientY: 0,
    };
  },
  mounted() {
    const track = document.getElementById('track');
    const progress = document.getElementById('progress');
    const thumb = document.getElementById('thumb');

    // Track length, accounting for the thumb height (min pos / low pos)
    const trackLength = track.offsetHeight - thumb.offsetHeight;
    let scrollDistance =
      window.pageYOffset ||
      (document.documentElement || document.body.parentNode || document.body)
        .scrollTop;
    const maxPosition = trackLength;

    this.trackLength = trackLength;

    let thumbsCurrentPos = 0;
    let percentage = 0;

    const valuesThatChange = () => {
      thumbsCurrentPos = trackLength - thumb.offsetTop;
      percentage = (thumbsCurrentPos / maxPosition) * 100;

      scrollDistance =
        window.pageYOffset ||
        (document.documentElement || document.body.parentNode || document.body)
          .scrollTop;
      this.percentage = percentage;
      this.$emit('valueChange', percentage);
      this.thumbOffsetTop = thumbsCurrentPos;
      this.trackOffsetTop =
        window.pageYOffset + track.getBoundingClientRect().top;
      //this.distanceAway = track.offsetTop - thumb.offsetTop;
    };

    valuesThatChange();

    document.addEventListener('mousemove', e => {
      this.clientY = e.clientY;
    });
    const drag = e => {
      valuesThatChange();
      progress.style.height = `${thumbsCurrentPos + thumb.offsetHeight / 2}px `;
      this.clientY =
        -(e.clientY - this.trackOffsetTop) +
        track.offsetHeight -
        scrollDistance;
      console.log(scrollDistance, this.clientY);
      this.distanceAway = scrollDistance;
      this.distanceAway =
        -(e.clientY - this.trackOffsetTop) +
        track.offsetHeight +
        scrollDistance;
      const halfOfThumb = thumb.offsetHeight / 2;
      if (this.clientY >= track.offsetHeight - halfOfThumb) {
        thumb.style.bottom = `${trackLength}px`;
        console.log('ran');
        progress.style.height = `${track.offsetHeight}px`;
        //progress.style.height = `${percentage}%`;
        return;
      }

      if (this.clientY <= halfOfThumb) {
        thumb.style.bottom = `0px`;
        progress.style.height = `0px `;
        console.log('ran');
        //progress.style.height = `${percentage}%`;
        return;
      }
      thumb.style.bottom = `${this.clientY - halfOfThumb}px`;
      percentage = (thumbsCurrentPos / maxPosition) * 100;
      progress.style.height = `${this.clientY -
        halfOfThumb +
        thumb.offsetHeight / 2}px `;
    };

    thumb.addEventListener('mousedown', e => {
      document.onmousemove = drag;
    });

    document.addEventListener('mouseup', () => {
      document.onmousemove = null;
    });

    track.addEventListener('mousedown', e => {
      drag(e);
      document.onmousemove = drag;
    });
  },
};
</script>

<style lang="scss" scoped>
.range-slider {
  background: rgb(122, 122, 122);
  border-radius: 10px;
  cursor: pointer;
  height: 100px;
  margin-left: 40px;
  position: relative;
  user-select: none;
  width: 10px;

  .thumb {
    background: rgb(82, 163, 255);
    border-radius: 100px;
    bottom: 0px;
    box-shadow: 0px 1px 1px rgb(27, 27, 27);
    cursor: ns-resize;
    left: 50%;
    padding: 10px;
    position: absolute;
    transform: translateX(-50%);
    transition: background-color 0.1s;
    width: 10px;
  }

  .progress {
    background: rgb(255, 31, 31);
    border-radius: 100px;
    bottom: 0;
    min-height: 10px;
    position: absolute;
    width: 100%;
  }
}
.show {
  opacity: 1;
}
</style>
