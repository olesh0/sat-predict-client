<template>
  <div class="app-sattelite-pass">
    <div class="sat-info">
      <div>
        <div class="name">NOAA 18</div>

        <div class="pass-in-progress">
          <div class="loader">
            <div class="bar first"></div>
            <div class="bar middle"></div>
            <div class="bar last"></div>
          </div>

          <span>Pass in progress...</span>
        </div>
      </div>

      <div class="pass-time">10 Feb 11:09 / 75° W</div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.app-sattelite-pass {
  border-left: 7px solid #22D5A4;
  background: rgba(34, 213, 164, .2);
  padding: 1rem .7rem;
  font-size: 1rem;

  .sat-info {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;

    .name {
      font-size: 1.5rem;
    }

    .pass-time {
      color: #848F97;
    }
  }

  .pass-in-progress {
    font-size: .9rem;
    align-items: center;
    color: #22D5A4;

    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 7px;

    margin-top: 3px;

    .loader {
      display: grid;
      grid-template-columns: auto auto auto;
      justify-content: center;
      align-items: center;
      grid-gap: 4px;

      .bar {
        width: 3px;
        height: 15px;
        background: #22D5A4;
        border-radius: 10px;

        transition: all 300ms;
      }

      @keyframes loader {
        0%, 100% { height: 5px }
        50% { height: 15px }
      }

      @duration: 700ms;
      @halfDuration: 350ms;

      .first,
      .last {
        animation: loader @duration infinite;
      }

      .middle {
        animation: loader @duration infinite @halfDuration;
      }
    }
  }
}
</style>
