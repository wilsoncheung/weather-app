<template>
  <footer class="footer mt-auto py-0 text-center">
    <div class="mentions">
      <div>
        Coded by
        <a href="https://wilsoncheung.github.io/" target="_blank">Wilson Cheung</a>
      </div>
      <div>
        Inspired by
        <a href="http://darkskyapp.github.io/skycons/" target="_blank">Skycons Library</a>
      </div>
      <div>
        Powered by
        <a href="https://darksky.net/poweredby/" target="_blank">Dark Sky API</a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style scoped>
footer {
  /* position: absolute;
    left: 0;
    bottom: 0;
    height: 100px;
    width: 100%; */
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #c3c3c3;
  font-size: 15px;
  background-color: white;
}
.mentions {
  padding: 10px;
}
.mentions > div {
  margin-bottom: 1px;
}
a {
  color: #256eb5;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>