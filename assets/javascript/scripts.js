var database = null;
var atual_page = 1;
var offset = 0;

function getElement(element){
    return document.querySelector(element);
}

function getElements(element){
    return document.querySelectorAll(element);
}

function getElementsPos(element,pos){
    ele = document.querySelectorAll(element);
    return ele[0].children[Number.parseInt(pos)];
}

function setClass(element,classe){
    element.classList.add(classe);
}

function rmClass(element,classe){
    element.classList.remove(classe);
}

function hiddenElements(element){
    element.classList.add('hidding');
}

function hiddenElement(element){
    element.classList.add('hidden');
}

function showElements(element){
    element.classList.remove('hidding');
}

function rawElements(element,data){
    element.innerHTML = data;
}

function rawCards(database){

    let cards = '';

    database.forEach(item=>{
        cards += '<div class="card_contant">';
        cards += `<img src="${item.photo.replace("xx_large","medium").replace("x_large","medium")}" class="card_img" alt="">`
        cards += `<p class="card_type">${item.property_type}</p>`
        cards += `<p class="card_title">${item.name}</p>`
        cards +=`<p class="card_price"><b>R$ ${item.price}</b>/noite</p></div>`;
    });
    let cardContainter = getElement("body > .container > .card_container");
    
    rawElements(cardContainter,cards);
}


function rawButtons(database,atual_page){

    buttonContainer = getElement("body > .container > .buttons > .filtro");

    let btDiv = `<button class="pages bckfrw" onclick="previewPage(0,0)"> <svg aria-hidden="true" role="presentation" viewBox="-15 0 32 32" xmlns="http://www.w3.org/2000/svg" style="display: block; fill: none; height: 16px; width: 16px; stroke: currentcolor; stroke-width: 4; overflow: visible;"><g fill="none"><path d="m20 28-11.29289322-11.2928932c-.39052429-.3905243-.39052429-1.0236893 0-1.4142136l11.29289322-11.2928932"></path></g></svg> </button>`;

    
    let start = 0;
    let end = offset;

    for (let index = 0; index<3;index++){
        btDiv += `<button class="pages" onclick="newPage(${start},${index+1})">${index+1}</button>`;
        start = end;
        end += offset;
    }

    btDiv += `<button class="pages bckfrw" onclick="nextPage(0,4)"> <svg aria-hidden="true" role="presentation" viewBox="-10 0 32 32" xmlns="http://www.w3.org/2000/svg" style="display: block; fill: none; height: 16px; width: 16px; stroke: currentcolor; stroke-width: 4; overflow: visible;"><g fill="none"><path d="m12 4 11.2928932 11.2928932c.3905243.3905243.3905243 1.0236893 0 1.4142136l-11.2928932 11.2928932"></path></g></svg> </button>`;

    rawElements(buttonContainer,btDiv);

    setClass(getElementsPos("body > .container > .buttons > .filtro",atual_page),"atual");

    atualCheck();

}

async function obterDatabase(){
    let data =  await fetch("https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72");
    let jsonData = await data.json();
    return jsonData;
}

async function loadPage(){
    database = await obterDatabase();
    
    offset = database.length/3;

    container = getElement("body > .container");
    loading = getElement("body > .load_container");

    rawCards([...database].splice(0,8));

    showElements(container);
    hiddenElements(loading);

    rawButtons(database,atual_page);

    frase = `${atual_page===1?"1 - 8":atual_page===2?"9 - 16":"17 - 24"} de 24 acomodações`;

    rawElements(getElement("body > .container > .buttons > .comodations"),`<p> ${frase} </p>`)

}

function atualCheck(){
    rmClass(getElementsPos("body > .container > .buttons > .filtro",0),'hidden');
    rmClass(getElementsPos("body > .container > .buttons > .filtro",4),'hidden');

    if(atual_page === 1){
        hiddenElement(getElementsPos("body > .container > .buttons > .filtro",0));
    }else if(atual_page === 3){
        hiddenElement(getElementsPos("body > .container > .buttons > .filtro",4));
    }
}

function newPage(start,button){
    
    hiddenElement(getElement("body > .container > .card_container"));

    rmClass(getElementsPos("body > .container > .buttons > .filtro",atual_page),"atual");

    atual_page = button;
  
    rawCards([...database].splice(start,offset));

    setClass(getElementsPos("body > .container > .buttons > .filtro",atual_page),"atual");

    atualCheck();

    rmClass(getElement("body > .container > .card_container"),'hidden');
}

function previewPage(offset,button){

    rmClass(getElementsPos("body > .container > .buttons > .filtro",atual_page),"atual");
    
    atual_page -= 1;

    getElementsPos("body > .container > .buttons > .filtro",atual_page).click();

}
function nextPage(offset,button){

    rmClass(getElementsPos("body > .container > .buttons > .filtro",atual_page),"atual");
    
    atual_page += 1;

    getElementsPos("body > .container > .buttons > .filtro",atual_page).click();
}