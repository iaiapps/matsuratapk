const url = "source/dzikrpetang.json";

axios
  .get(url)
  .then(function (response) {
    const data = response.data;
    let index = 0;
    let prev = document.getElementById("prev");
    let next = document.getElementById("next");

    function updateProgress() {
      let pct = Math.round(((index + 1) / data.length) * 100);
      document.getElementById("progress-fill").style.width = pct + "%";
    }

    function displayItem(dzikr) {
      document.getElementById("judul").innerText =
        dzikr.name + " " + dzikr.note;
      document.getElementById("arab").innerText = dzikr.text;
      document.getElementById("trans").innerText = dzikr.trans;
      document.getElementById("counter").textContent =
        (index + 1) + " / " + data.length;

      prev.style.opacity = index <= 0 ? 0.3 : 1;
      prev.style.pointerEvents = index <= 0 ? "none" : "auto";
      next.style.opacity = index >= data.length - 1 ? 0.3 : 1;
      next.style.pointerEvents = index >= data.length - 1 ? "none" : "auto";

      updateProgress();
    }

    prev.addEventListener("click", function () {
      if (index > 0) displayItem(data[--index]);
    });

    next.addEventListener("click", function () {
      if (index < data.length - 1) displayItem(data[++index]);
    });

    document.getElementById("search-input").addEventListener("input", function () {
      let q = this.value.toLowerCase();
      let list = document.getElementById("search-list");
      list.innerHTML = "";
      if (!q) {
        list.style.display = "none";
        return;
      }
      let matches = [];
      data.forEach(function (item, i) {
        let name = (item.name + " " + item.note).toLowerCase();
        let text = item.text.toLowerCase();
        let trans = item.trans.toLowerCase();
        if (name.indexOf(q) !== -1 || text.indexOf(q) !== -1 || trans.indexOf(q) !== -1) {
          matches.push(i);
        }
      });
      if (matches.length === 0) {
        list.style.display = "none";
        return;
      }
      list.style.display = "block";
      matches.forEach(function (i) {
        let li = document.createElement("li");
        li.textContent = data[i].name + " " + data[i].note;
        li.className = "search-item";
        li.addEventListener("click", function () {
          index = i;
          displayItem(data[index]);
          list.style.display = "none";
          document.getElementById("search-input").value = "";
        });
        list.appendChild(li);
      });
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".search-wrapper")) {
        document.getElementById("search-list").style.display = "none";
      }
    });

    displayItem(data[index]);
  })
  .catch(function (error) {
    console.log(error);
  });
