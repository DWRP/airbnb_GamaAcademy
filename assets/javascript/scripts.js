/* 
    Variáveis de controle
    *Não seria necessário 
    se desse para filtrar
    os dados direto da API*
*/

var database = null;
var atual_page = 1;
var offset = 0;
var filtro_atual = null;

//Iniciando a função para carregar o conteúdo da página
window.onload = loadPage();

/*
getElement('body > .container > .buttons > .all_data').innerText =  window.location.href[window.location.href.length-1] === "#"?"Ver Menos":"Ver Tudo";
*/


/*Funcões de manipulação de página. - INICIO */
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
//Remove display e visibilidade
function hiddenElements(element){
    element.classList.add('hidding');
}
//adiciona display e visibilidade
function showElements(element){
    element.classList.remove('hidding');
}
//remove somente visbilidade
function hiddenElement(element){
    element.classList.add('hidden');
}
//adiciona somente visbilidade
function showElement(element){
    element.classList.remove('hidden');
}


function rawElements(element,data){
    element.innerHTML = data;
}

/*Funcões de manipulação de página. - FIM */

/*Funcões de manipulação de conteúdo. - INICIO */
//Escreve os cards, de acordo com o banco recebido.
/* O banco é filtrado de acordo com os valores escritos nos botões */
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

//Escreve os botões na sua div e adiciona a classe atual ao botão que representa a página
function rawButtons(atual_page){

    buttonContainer = getElement("body > .container > .buttons > .filtro_page");

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

    setClass(getElementsPos("body > .container > .buttons > .filtro_page",atual_page),"atual");

    atualCheck();

}
/*Funcões de manipulação de conteúdo. - FIM */

//Requisição JSON dos dados da API
async function obterDatabase(){
    let data =  await fetch("https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72");
    let jsonData = await data.json();
    return jsonData;
}

//Função principal
async function loadPage(){
    //Manipulando variável global - obtendo os dados da API
    database = await obterDatabase();
    
    //Manipulando variável global - definindo o tamanho do filtro
    offset = database.length/3;

    //Escrevendo os cards no campo de cards
    rawCards([...database].splice(0,8));

    //Ocultando e exibindo elementos (simulação de loading)
    container = getElement("body > .container");
    loading = getElement("body > .load_container");

    showElements(container);
    hiddenElements(loading);

    //Escrevendo os botões da pagina e a frase abaixo dos botões
    rawButtons(atual_page);

    frase = `${atual_page===1?"1 - 8":atual_page===2?"9 - 16":"17 - 24"} de 24 acomodações`;

    rawElements(getElement("body > .container > .buttons > .comodations"),`<p> ${frase} </p>`);

    setTimeout(()=>{
        rmClass(getElement("body > .container > .card_container"),'card_animation');
    },1000);

    
    

}

/*Esta função checa qual é a página atual, 
removendo os botões next e prewiew quando necessário */
function atualCheck(){
    showElement(getElementsPos("body > .container > .buttons > .filtro_page",0));
    showElement(getElementsPos("body > .container > .buttons > .filtro_page",4));

    if(atual_page === 1){
        hiddenElement(getElementsPos("body > .container > .buttons > .filtro_page",0));
    }else if(atual_page === 3){
        hiddenElement(getElementsPos("body > .container > .buttons > .filtro_page",4));
    }
}

//Função para quando um botão de página é clicado
function newPage(start,button){
    window.scrollTo(0,0);

    setClass(getElement("body > .container > .card_container"),'card_animation');
     setTimeout(()=>{
        rmClass(getElement("body > .container > .card_container"),'card_animation');
    },1000);

    hiddenElement(getElement("body > .container > .card_container"));

    rmClass(getElementsPos("body > .container > .buttons > .filtro_page",atual_page),"atual");

    atual_page = button;
  
    rawCards([...database].splice(start,offset));

    setClass(getElementsPos("body > .container > .buttons > .filtro_page",atual_page),"atual");

    atualCheck();

    showElement(getElement("body > .container > .card_container"));

    frase = `${atual_page===1?"1 - 8":atual_page===2?"9 - 16":"17 - 24"} de 24 acomodações`;

    rawElements(getElement("body > .container > .buttons > .comodations"),`<p> ${frase} </p>`);

    
}

//Funções para os botões de página anterior e próxima página 
function previewPage(offset,button){

    rmClass(getElementsPos("body > .container > .buttons > .filtro_page",atual_page),"atual");
    
    atual_page -= 1;

    getElementsPos("body > .container > .buttons > .filtro_page",atual_page).click();

}
function nextPage(offset,button){

    rmClass(getElementsPos("body > .container > .buttons > .filtro_page",atual_page),"atual");
    
    atual_page += 1;

    getElementsPos("body > .container > .buttons > .filtro_page",atual_page).click();
}


function nameFilter(type){

    database.sort((index,next)=>{
        if(index.name < next.name){
            return -1;
        }else if(index.name > next.name){
            return 1;
        }else{
            return 0;
        }
    });

    if (type==='az'?false:true){
        database.reverse();
    }
}

function priceFilter(type){

    database.sort((index,next)=>{
        if(index.price < next.price){
            return -1;
        }else if(index.price > next.price){
            return 1;
        }else{
            return 0;
        }
    });

    if (type==='pm'?false:true){
        database.reverse();
    }
}


async function filtro_page(type){

    
    if (filtro_atual){
        setClass(getElement(`body > .container > .filtros > .selected`),`${filtro_atual}`)
        rmClass(getElement(`body > .container > .filtros > .${filtro_atual}`),'selected')
    }
    
    filtro_atual = type;
    setClass(getElement(`body > .container > .filtros > .${type}`),'selected')
    rmClass(getElement(`body > .container > .filtros > .${filtro_atual}`),`${filtro_atual}`)
    
    if(type === 'az' || type === 'za'){
        nameFilter(type);
    }else if(type === 'pm' || type === 'pp'){
        priceFilter(type);
    }else{
        setClass(getElement(`body > .container > .filtros > .selected`),`${filtro_atual}`)
        rmClass(getElement(`body > .container > .filtros > .${filtro_atual}`),'selected')
        database = await obterDatabase();
        filtro_atual = null;
    }

    console.log(getElement('body > .container > .buttons > .all_data').innerText);
    if(getElement('body > .container > .buttons > .all_data').innerText === "Ver Tudo"){
        getElementsPos("body > .container > .buttons > .filtro_page",atual_page).click();
    }
    else{
        getElement('body > .container > .buttons > .all_data').innerText = "Ver Tudo";
        allData();
    }

}

function allData(){

    let link = getElement('body > .container > .buttons > .all_data');

    if (link.innerText=="Ver Tudo"){
        link.innerText = "Ver Menos";
        rawCards(database);
        hiddenElement(getElement("body > .container > .buttons > .filtro_page"));

        frase = `1 - 24 de 24 acomodações`;

        rawElements(getElement("body > .container > .buttons > .comodations"),`<p> ${frase} </p>`);

    }else{
        link.innerText = "Ver Tudo";
        rawCards([...database].splice(0,8));
        showElement(getElement("body > .container > .buttons > .filtro_page"));
        
        atual_page = 1;

        frase = `${atual_page===1?"1 - 8":atual_page===2?"9 - 16":"17 - 24"} de 24 acomodações`;

        rawElements(getElement("body > .container > .buttons > .comodations"),`<p> ${frase} </p>`);
    }
}