var prices;

if (localStorage.getItem("backgroundColor") == "white") {
    document.body.style.backgroundColor = "white";
} else if (localStorage.getItem("backgroundColor") == "black") {
    document.body.style.backgroundColor = "#35393e";
} else {
    document.body.style.backgroundColor = "white";
    localStorage.setItem("backgroundColor", "white");
}

document.body.addEventListener("click", function onclick() {
    if (localStorage.getItem("backgroundColor") == "black") {
        document.body.style.backgroundColor = "white";
        localStorage.setItem("backgroundColor", "white");
    } else {
        document.body.style.backgroundColor = "#35393e";
        localStorage.setItem("backgroundColor", "black");
    }
});

const getPrice = () => {
    fetch('https://price-api.crypto.com/v1/price/tokens?page=1&limit=20&include=id').then(data => {
        data.json().then(data => data.data).then(data => {
            inject(data);
        })
    })
}

function rounddata(data) {
    if ((data)[i].usd_price.toString().split(".")[0] > 2) {
        var round = Math.round((data)[i].usd_price).toString();
    } else {
        var round = (data)[i].usd_price.toPrecision(4).toString();
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

function changeper(data) {
    var round = (data)[i].usd_price_change_24h * 100
    round = Math.round(100*round)/100;
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
    while (round.length > 4) {
        round = round.slice(0, -1);
    }
    if (round.split(".")[1] == "") {
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
        img.src = "https://crypto.com/price/_next/image.png?url=https://tpp-static.crypto.com/token/icons/" + (data)[i].slug + "/color_icon.png&w=64&q=75";

        var texttop = document.getElementsByClassName("cryptotexttop")[i];
        texttop.innerText = (data)[i].name;

        var changepercent = document.getElementsByClassName("changeper")[i];
        changepercent.innerText = changeper(data);
        changepercent.style.color = "#00da00";
        if (changepercent.innerText.includes("-")) {
            changepercent.style.color = "#ca0000";
        }
        if (changepercent.innerText == "0%") {
            changepercent.style.color = "#545454";
        }

        var textbottom = document.getElementsByClassName("cryptotextbottom")[i];
        textbottom.innerText = rounddata(data);
        textbottom.style.color = changepercent.style.color;

    }
}
getPrice()