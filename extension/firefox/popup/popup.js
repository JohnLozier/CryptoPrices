var prices;
const getPrice = () => {
    fetch('https://data.messari.io/api/v1/assets?fields=slug,symbol,metrics/market_data/price_usd,metrics/market_data/percent_change_usd_last_24_hours').then(data => {
        data.json().then(data => data.data).then(data => {
            inject(data);
        })
    })
}
function rounddata(data) {
    if ((data)[i].metrics.market_data.price_usd.toString().split(".")[0] > 2) {
        var round = Math.round((data)[i].metrics.market_data.price_usd).toString();
    } else {
        var round = (data)[i].metrics.market_data.price_usd.toPrecision(4).toString();
        var length = round.split(".")[1].length;
        for (a = 0; a < length; a++) {
            if (round.slice(-1) == 0) {
                round = round.slice(0, -1);
            }
        }
        if (round.split(".")[1] == "") {
            round = round.slice(0, -1);
        }
    }
    return "$" + round
}
function cryptoname(data) {
    var slug;
    slug = (data)[i].slug
    if (slug.toString().split("-").length == 1) {
        slug = slug.toString().charAt(0).toUpperCase() + slug.slice(1);
    } else {
        slug = slug.toString().split("-");
        for (e = 0; e < slug.length; e++) {
            slug[e] = slug[e].charAt(0).toUpperCase() + slug[e].slice(1);
        }
        slug = slug.join(" ");
    }
    return slug
}
function changeper(data) {
    var round = Math.round(100*(data)[i].metrics.market_data.percent_change_usd_last_24_hours)/100;
    round = round.toString();
    if (round.includes(".")) {
        var length = round.split(".")[1].length;
    } else {
        length = 0;
    }
    for (a = 0; a < length; a++) {
        if (round.slice(-1) == 0) {
            round = round.slice(0, -1);
        }
    }
    if (round.split(".")[1] == "") {
        round = round.slice(0, -1);
    }
    while (round.length > 4) {
        round = round.slice(0, -1);
    }
    if (round == "-0.0") {
        round = "0";
    }
    return round + "%";
}
function inject(data) {
    for (i = 0; i in (data); i++) { 
        var img = document.getElementsByClassName("cryptoimage")[i]
        if ((data)[i].slug.toLowerCase() == "polkadot") {
            img.src = "https://crypto.com/price/_next/image.png?url=https://tpp-static.crypto.com/token/icons/polkadot-new/color_icon.png&w=64&q=75";
        } else {
            img.src = "https://crypto.com/price/_next/image.png?url=https://tpp-static.crypto.com/token/icons/" + (data)[i].slug.toLowerCase() + "/color_icon.png&w=64&q=75";
        };

        var texttop = document.getElementsByClassName("cryptotexttop")[i];
        texttop.innerText = cryptoname(data);

        var changepercent = document.getElementsByClassName("changeper")[i];
        changepercent.innerText = changeper(data);
        changepercent.style.color = "#059605";
        if (changepercent.innerText.includes("-")) {
            changepercent.style.color = "#e00000";
        }
        if (changepercent.innerText == "0%") {
            changepercent.style.color = "#797979";
        }

        var textbottom = document.getElementsByClassName("cryptotextbottom")[i];
        textbottom.innerText = rounddata(data);
        textbottom.style.color = changepercent.style.color;

    }
}
getPrice()