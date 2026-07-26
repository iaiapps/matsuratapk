var Settings = {
  defaults: {
    themeMode: "light",
    arabicSize: "M",
    translationSize: "M",
    notifPagi: false,
    notifPetang: false,
    timePagi: "05:30",
    timePetang: "17:00",
  },

  get: function (key) {
    var val = localStorage.getItem("settings_" + key);
    if (val === null) return this.defaults[key];
    if (val === "true") return true;
    if (val === "false") return false;
    return val;
  },

  set: function (key, val) {
    localStorage.setItem("settings_" + key, val);
  },

  resolveTheme: function (mode) {
    if (mode === "light" || mode === "dark") return mode;
    var h = new Date().getHours();
    return h >= 6 && h < 18 ? "light" : "dark";
  },

  applyTheme: function () {
    var mode = this.get("themeMode");
    var resolved = this.resolveTheme(mode);
    document.documentElement.setAttribute("data-theme", resolved);

    var logo = document.getElementById("logo");
    if (logo) {
      logo.src = resolved === "dark" ? "img/logodark.svg" : "img/logolight.svg";
    }
  },

  applyFontSizes: function () {
    var sizes = {
      S: { arabic: "1.25rem", translation: "0.8125rem" },
      M: { arabic: "1.5rem", translation: "0.9375rem" },
      L: { arabic: "1.75rem", translation: "1rem" },
      XL: { arabic: "2rem", translation: "1.125rem" },
    };
    var mobile = window.innerWidth <= 640;
    var mSizes = {
      S: { arabic: "1rem", translation: "0.75rem" },
      M: { arabic: "1.25rem", translation: "0.8125rem" },
      L: { arabic: "1.5rem", translation: "0.9375rem" },
      XL: { arabic: "1.75rem", translation: "1.0625rem" },
    };
    var map = mobile ? mSizes : sizes;
    var aKey = this.get("arabicSize");
    var tKey = this.get("translationSize");
    document.documentElement.style.setProperty("--arabic-size", map[aKey].arabic);
    document.documentElement.style.setProperty("--translation-size", map[tKey].translation);
  },

  scheduleNotif: function (key, enabled, time) {
    if (typeof cordova === "undefined" || !cordova.plugins || !cordova.plugins.notification) return;
    var plugin = cordova.plugins.notification;

    if (enabled) {
      plugin.local.requestPermission(function (granted) {
        if (!granted) return;
        plugin.local.cancel(key === "pagi" ? 1 : 2);
        var parts = time.split(":");
        var now = new Date();
        var fire = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
          parseInt(parts[0]), parseInt(parts[1]), 0);
        if (fire <= now) fire.setDate(fire.getDate() + 1);

        plugin.local.schedule({
          id: key === "pagi" ? 1 : 2,
          title: key === "pagi" ? "Dzikir Pagi" : "Dzikir Petang",
          text: key === "pagi"
            ? "Saatnya membaca dzikir pagi"
            : "Saatnya membaca dzikir petang",
          trigger: { at: fire },
          repeat: "daily",
          foreground: true,
        });
      });
    } else {
      plugin.local.cancel(key === "pagi" ? 1 : 2);
    }
  },

  initPage: function () {
    this.applyTheme();
    this.applyFontSizes();
  },
};

// Migrate old theme key
(function () {
  var old = localStorage.getItem("theme");
  if (old && !localStorage.getItem("settings_themeMode")) {
    localStorage.setItem("settings_themeMode", old);
    localStorage.removeItem("theme");
  }
})();

Settings.initPage();

// Settings page UI
(function () {
  var opts = document.querySelectorAll(".settings-options");
  if (!opts.length) return;

  function setActiveGroup(groupId, value) {
    var btns = document.querySelectorAll("#" + groupId + " .settings-option");
    btns.forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-value") === value);
    });
  }

  // Theme
  setActiveGroup("theme-options", Settings.get("themeMode"));
  document.querySelectorAll("#theme-options .settings-option").forEach(function (btn) {
    btn.addEventListener("click", function () {
      Settings.set("themeMode", this.getAttribute("data-value"));
      setActiveGroup("theme-options", Settings.get("themeMode"));
      Settings.applyTheme();
    });
  });

  // Arabic size
  setActiveGroup("arabic-size-options", Settings.get("arabicSize"));
  document.querySelectorAll("#arabic-size-options .settings-option").forEach(function (btn) {
    btn.addEventListener("click", function () {
      Settings.set("arabicSize", this.getAttribute("data-value"));
      setActiveGroup("arabic-size-options", Settings.get("arabicSize"));
      Settings.applyFontSizes();
    });
  });

  // Translation size
  setActiveGroup("translation-size-options", Settings.get("translationSize"));
  document.querySelectorAll("#translation-size-options .settings-option").forEach(function (btn) {
    btn.addEventListener("click", function () {
      Settings.set("translationSize", this.getAttribute("data-value"));
      setActiveGroup("translation-size-options", Settings.get("translationSize"));
      Settings.applyFontSizes();
    });
  });

  // Notifications
  var pagiCheck = document.getElementById("notif-pagi");
  var petangCheck = document.getElementById("notif-petang");
  var timePagi = document.getElementById("time-pagi");
  var timePetang = document.getElementById("time-petang");

  pagiCheck.checked = Settings.get("notifPagi");
  petangCheck.checked = Settings.get("notifPetang");
  timePagi.value = Settings.get("timePagi");
  timePetang.value = Settings.get("timePetang");

  pagiCheck.addEventListener("change", function () {
    Settings.set("notifPagi", this.checked);
    Settings.scheduleNotif("pagi", this.checked, timePagi.value);
  });

  petangCheck.addEventListener("change", function () {
    Settings.set("notifPetang", this.checked);
    Settings.scheduleNotif("petang", this.checked, timePetang.value);
  });

  timePagi.addEventListener("change", function () {
    Settings.set("timePagi", this.value);
    if (pagiCheck.checked) Settings.scheduleNotif("pagi", true, this.value);
  });

  timePetang.addEventListener("change", function () {
    Settings.set("timePetang", this.value);
    if (petangCheck.checked) Settings.scheduleNotif("petang", true, this.value);
  });
})();
