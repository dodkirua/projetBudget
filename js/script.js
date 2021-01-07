let tmp;

/**
 * Modal Window for the add
 */
class Window{
    constructor(width,height,background,id) {
        this.width = width;
        this.height = height;
        this.background = background;
        this.id = id;
        this.value = "";

    }

    create(parent){
        document.getElementById("container").style.visibility = "hidden";
        let div = document.createElement("div");
        if (this.background !== undefined){
            div.style.backgroundColor = this.background;
        }

        if (this.width !== undefined){
            div.style.width = this.width+"%";
            div.style.left = 50-((this.width)/2)+"%";
        }
        if (this.height !== undefined){
            div.style.height = this.height+"%";
            div.style.top = 50-((this.height)/2)+"%";
        }
        if (this.id === undefined){
            div.id = "modal";
        }
        else {
            div.id = this.id;
        }
        parent.append(div);
        let info = document.createElement("div");
        info.style.width = "100%";
        info.style.height = "80%";
        info.id = "info";
        let infoAdd= new AccountingLine("Nom de l'entrée",info);
        infoAdd.create();
        div.append(info);
        let divButton = document.createElement("div");
        divButton.style.width = "100%";
        divButton.style.height = "20%";
        divButton.id = "divButton";
        let buttonCancel = document.createElement("button");
        buttonCancel.innerHTML = "CANCEL";
        let buttonValid = document.createElement("button");
        buttonValid.innerHTML = "OK";
        divButton.append(buttonCancel);
        divButton.append(buttonValid)
        div.append(divButton);
        buttonCancel.addEventListener("click",function (){
            document.getElementById("container").style.visibility = "visible";
            div.remove();
        });
        buttonValid.addEventListener("click",function (){
            document.getElementById("container").style.visibility = "visible";
            this.value = info.getElementsByTagName("input")[0].value;
            div.remove();
            new AccountingLine(this.value,tmp,false).create();

        });
    }
}

class AccountingLine {
    constructor(title,parent,need) {
        this.title = title;
        this.parent = parent;
        if (need !== undefined){
            this.need = need;
        }
        else {
            this.need = false;
        }
        this.id = replaceStr(title.trim());
    }
    create(){
        let divLine = document.createElement("div");
        divLine.className = "accountingLine";
        let line = document.createElement("label");
        line.innerHTML = this.title;
        line.htmlFor = this.id;
        divLine.append(line);
        let value = document.createElement("input");
        value.id = this.id;
        value.value = "0";
        divLine.append(value);
        this.parent.append(divLine);
    }
}

function replaceStr(str){
    for (let i = 0 ; i < str.length ; i++){
            str = str.replace(/[^a-zA-Z0-9_-]/g,'_');        }
    return str;
}

function initialise() {
    let fixed = document.getElementById("fixed");
    let ordinary = document.getElementById("ordinary");
    let casual = document.getElementById("casual");
    let receipts = document.getElementById("receipts").getElementsByClassName("contain")[0];

    let lineArray = [];
    lineArray.push(new AccountingLine("loyer et charges", fixed, true));
    lineArray.push(new AccountingLine("remboursement de crédits", fixed, false));
    lineArray.push(new AccountingLine("eau/électricité/gaz", fixed, true));
    lineArray.push(new AccountingLine("téléphone - internet ", fixed, true));
    lineArray.push(new AccountingLine("assurance habitation ", fixed, false));
    lineArray.push(new AccountingLine("assurance véhicules ", fixed, false));
    lineArray.push(new AccountingLine("mutuelle santé ", fixed, false));
    lineArray.push(new AccountingLine("frais de garde ", fixed, false));
    lineArray.push(new AccountingLine("impôts sur le revenu", fixed, false));
    lineArray.push(new AccountingLine("impôts locaux", fixed, false));

    lineArray.push(new AccountingLine("courses ", ordinary, false));
    lineArray.push(new AccountingLine("essence/frais de transport en commun ", ordinary, false));
    lineArray.push(new AccountingLine("activités sportives et culturelles ", ordinary, false));

    lineArray.push(new AccountingLine("sorties", casual, false));

    lineArray.push(new AccountingLine("Salaire", receipts, false));
    lineArray.push(new AccountingLine("Aides ", receipts, false));
    lineArray.push(new AccountingLine("Rentes ", receipts, false));
    lineArray.push(new AccountingLine("Autres ", receipts, false));
    lineArray.push(new AccountingLine("Epargne", receipts, false));

    for (let i = 0; i < lineArray.length; i++) {
        lineArray[i].create();
    }
}
initialise();

let addButton  = document.getElementsByClassName("add");

for (let i = 0 ; i< addButton.length ; i++){
    addButton[i].addEventListener("click",function (e) {
        tmp = e.target.parentElement.parentElement
        let windows = new Window(50,20,"ligntgrey","modal");
        windows.create(document.body);
    });
}

let calc = document.getElementById("calc");
let value = document.getElementById("value");

calc.addEventListener("click",function (){
    let sum = calcul();
    totalVisual(sum);
});

function calcul(){
    let tmp2;
    let spent = 0;
    let receipts = 0;
    let spentArray = document.getElementById("spent").getElementsByClassName("accountingLine");
    let receiptArray = document.getElementById("receipts").getElementsByClassName("accountingLine");

    for (let i = 0 ; i < spentArray.length ; i++){
        if (isNaN(parseFloat(spentArray[i].querySelector("input").value)) === false){
                tmp2 = parseFloat(spentArray[i].querySelector("input").value);
                if (tmp2 < 0){
                    tmp2 = tmp2 * -1;
                }
            spent = spent + tmp2;
        }
    }
    for (let i = 0 ; i < receiptArray.length ; i++){
        if (isNaN(parseFloat(receiptArray[i].querySelector("input").value)) === false){
            tmp2 = parseFloat(receiptArray[i].querySelector("input").value);
            if (tmp2 < 0){
                tmp2 = tmp2 * -1;
            }
            receipts = receipts + tmp2;
        }

    }
    return (receipts-spent);
}

function totalVisual (val) {
    value.innerHTML = "total : "+val;
    if (val >= 0){
        value.style.color = "blue";

    }
    else {
        value.style.color = "red";
    }
    textReturn(val);
}

function textReturn(val){
    let text = document.getElementById("text");
    if  (val === 0) {
        text.innerHTML = "Juste à l'équilibre";
    }
    if (val < 0 ){
        text.innerHTML = "Vous avez les poches percées";
    }
    if (val > 0 && val < 50){
        text.innerHTML = "Tu peux allez au ciné";
    }
    if (val >= 50 && val < 100){
        text.innerHTML = "Tu peux te faire un restau";
    }
    if (val >= 100 && val < 500){
        text.innerHTML = "Tu peux te faire un restau et inviter quelqu'un";
    }
    if (val >= 500 && val < 1000){
        text.innerHTML = "Tu peux t'acheter un nouvel ordi";
    }
    if (val >= 1000){
        text.innerHTML = "Tu peux t'acheter plein de truc ou mettre de coté";
    }
}