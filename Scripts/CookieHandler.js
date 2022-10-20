function setCookie(key, value, expValue) {
    if (expValue === undefined) {
        expValue = 1;
    }
    var expires = new Date();
    var expTime = expValue;
    expires.setTime(expires.getTime() + expTime * 24 * 60 * 60 * 1000);
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString() + "; path =/";
}

function getCookie(cname) {

    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');

    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }

    return "";
}

function getGrtSettingsSetting(searchVal) {
    try {
        var settings = localStorage.getItem("returnUrl");
        var split = settings.split('|');
        if (split.length == 1 && !settings.includes(searchVal)) {
            return settings;
        }

        else if (split.length == 2 && settings.includes(searchVal)) {
            var name_value = split[1].substring(split[1].indexOf(":") + 1, split[1].length);
            if (split[0].includes(name_value)) {
                return split[0];
            }
        }
        for (var i = 0; i < split.length; i++) {
            var name_value = split[i].substring(0, split[i].indexOf(":"));
            if (name_value === searchVal) {
                var result = split[i].substring(split[i].indexOf(':') + 1);
                if (isJson(result)) {
                    return JSON.parse(result);
                } else {
                    return result;
                }
            }
        }
    } catch {
        return null;
    }
    return "";
}

function addAmendGrtSettingSetting(sectionName, newValue) {
    try {
        var settings = getCookie("grt-settings");
        var split = settings.split('|');

        for (var i = 0; i < split.length; i++) {
            var name_value = split[i].substring(0, split[i].indexOf(":"));
            if (name_value === sectionName) {
                // make the change
                try {
                    var value = split[i].substring(split[i].indexOf(":") + 1);
                    settings = settings.replace(sectionName + ":" + value, sectionName + ":" + newValue)
                    var d = new Date();
                    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year TTL
                    var expires = "expires=" + d.toUTCString();
                    document.cookie = "grt-settings=" + settings + ";" + expires + ";path=/";
                    return true;
                } catch {
                    return false;
                }

            }
        }

        var d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year TTL
        var expires = "expires=" + d.toUTCString();
        if (settings.length > 1) {
            settings = settings + "|" + sectionName + ":" + newValue;
        } else {
            settings = sectionName + ":" + newValue;
        }
        document.cookie = "grt-settings=" + settings + ";" + expires + ";path=/";


        return true;
    } catch {
        return false;
    }
}

function removeGrtSettingsSetting(searchVal) {
    try {
        var settings = getCookie("grt-settings");
        var split = settings.split('|');
        for (var i = 0; i < split.length; i++) {
            var name_value = split[i].substring(0, split[i].indexOf(":"));
            if (name_value === searchVal) {
                settings = settings.replace(split[i], "");
                //do any cleaning that is needed
                try {
                    settings = settings.replace('||', "|");
                    if (settings.startsWith('|')) {
                        settings = settings.substring(1);
                    }
                    if (settings.endsWith('|')) {
                        settings = settings.substring(0, settings.length - 1);
                    }
                } catch { }
                var d = new Date();
                d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year TTL
                var expires = "expires=" + d.toUTCString();
                document.cookie = "grt-settings=" + settings + ";" + expires + ";path=/";
            }
        }

        return true;
    } catch {
        return false;
    }
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}