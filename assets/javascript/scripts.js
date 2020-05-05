var filter = 8;
var index = 0;

var atual_page = 0;

function loadCards(data,filtro=0,inicio=0){
    let cards = ""
    contador = filtro===0?data.lenght:0;

    for (let item of data){
        
        if(contador === filtro && filtro>0){
            break;
        }else if(contador>=inicio){
            cards += `<div class="card_contant"><img src="${item.photo.replace("xx_large","medium").replace("x_large","medium")}" class="card_img" alt=""><p class="card_type">${item.property_type}</p><p class="card_title">${item.name}</p><p class="card_price"><b>R$ ${item.price}</b>/noite</p></div>`;
        }
        contador++;
    };

    document.querySelector("body > .container > .card_container").innerHTML = cards;
    document.querySelector("body > .container").classList.remove('hidding');

    document.querySelector("body > .load_container").classList.add('hidding');

}


async function loadPage(){
    let data = await fetch("https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72");
    loadCards(await data.json(),filter,index);
    let pages = document.querySelectorAll("body > .container > .buttons > .filtro");
    pages[0].children[atual_page].classList.add('atual');

    document.querySelector("body > .container > .buttons > .comodations").innerHTML = "<p>1 - 8 de 24 acomodações</p>";
     
}

async function nextPage(offset,button){
    atual_page = button;
    let data = await fetch("https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72");
    loadCards(await data.json(),filter+offset,index+offset);
    let pages = document.querySelectorAll("body > .container > .buttons > .filtro");
    acomodation = atual_page===0?"1 - 8":atual_page===1?"9 - 16":"17 - 24";
    frase = `${acomodation} de 24 acomodações`;

    document.querySelector("body > .container > .buttons > .comodations").innerHTML = "<p>" + frase +"</p>";

    let listData = Array.prototype.slice.call(pages[0].children, 0);
    listData.map(item=>item.classList.remove('atual'));
    pages[0].children[atual_page].classList.add('atual');
}