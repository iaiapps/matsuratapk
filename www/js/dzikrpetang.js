const url = "source/dzikrpetang.json";
axios
  .get(url)
  .then(function (response) {
    // ini ambil data
    const data = response.data;

    //inisialisasi variabel
    let index = 0;
    let dzikr = data[index];
    let prev = document.getElementById("prev");
    let next = document.getElementById("next");

    function displayItem(dzikr) {
      document.getElementById("judul").innerText =
        dzikr.name + " " + dzikr.note;
      document.getElementById("arab").innerText = dzikr.text;
      document.getElementById("trans").innerText = dzikr.trans;

      if (index <= 0) {
        prev.style.opacity = 0.3;
        prev.style.pointerEvents = "none";
      } else {
        prev.style.opacity = 1;
        prev.style.pointerEvents = "auto";
      }

      if (index >= data.length - 1) {
        next.style.pointerEvents = "none";
        next.style.opacity = 0.3;
      } else {
        next.style.opacity = 1;
        next.style.pointerEvents = "auto";
      }
    }

    //buttonprev
    prev.addEventListener("click", function () {
      displayItem(data[--index]);
    });

    //butonnext
    next.addEventListener("click", function () {
      displayItem(data[++index]);
    });

    //tampilkan display dzikr
    displayItem(dzikr);
  })
  .catch(function (error) {
    console.log(error);
  });
